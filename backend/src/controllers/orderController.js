const db = require('../models');
const { asyncHandler } = require('../middleware/error');
const { stripe, STRIPE_SUCCESS_URL, STRIPE_CANCEL_URL } = require('../config/stripe');
const { Op } = require('sequelize');

/**
 * @route   GET /api/orders
 * @desc    Get user's orders
 * @access  Private
 */
const getOrders = asyncHandler(async (req, res) => {
  const orders = await db.Order.findAll({
    where: { userId: req.user.id },
    include: [{
      model: db.OrderItem,
      as: 'orderItems',
      include: [{
        model: db.Product,
        as: 'product',
        attributes: ['id', 'name', 'slug']
      }]
    }],
    order: [['createdAt', 'DESC']]
  });

  res.json({
    success: true,
    orders
  });
});

/**
 * @route   GET /api/orders/:id
 * @desc    Get single order by ID
 * @access  Private
 */
const getOrderById = asyncHandler(async (req, res) => {
  const order = await db.Order.findOne({
    where: { id: req.params.id, userId: req.user.id },
    include: [{
      model: db.OrderItem,
      as: 'orderItems',
      include: [{
        model: db.Product,
        as: 'product',
        attributes: ['id', 'name', 'slug', 'imageUrl']
      }]
    }]
  });

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  res.json({
    success: true,
    order
  });
});

/**
 * @route   POST /api/orders/checkout
 * @desc    Create checkout session with Stripe
 * @access  Private
 */
const createCheckoutSession = asyncHandler(async (req, res) => {
  const { shippingAddress, city, state, postalCode, country = 'USA' } = req.body;

  // Validate shipping address
  if (!shippingAddress || !city || !state || !postalCode) {
    return res.status(400).json({
      success: false,
      message: 'Please provide complete shipping address'
    });
  }

  // Get cart items
  const cartItems = await db.CartItem.findAll({
    where: { userId: req.user.id },
    include: [{
      model: db.Product,
      as: 'product',
      where: { isActive: true }
    }]
  });

  if (cartItems.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Your cart is empty'
    });
  }

  // Check stock availability for all items
  for (const item of cartItems) {
    if (item.product.stock < item.quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock for ${item.product.name}. Only ${item.product.stock} available.`
      });
    }
  }

  // Calculate total
  let subtotal = 0;
  const lineItems = [];

  for (const item of cartItems) {
    const itemTotal = parseFloat(item.product.price) * item.quantity;
    subtotal += itemTotal;

    lineItems.push({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.product.name,
          description: item.product.shortDescription || '',
          images: item.product.imageUrl ? [item.product.imageUrl] : []
        },
        unit_amount: Math.round(parseFloat(item.product.price) * 100) // Convert to cents
      },
      quantity: item.quantity
    });
  }

  const tax = subtotal * 0.1; // 10% tax
  const shippingCost = subtotal > 100 ? 0 : 10; // Free shipping over $100
  const total = subtotal + tax + shippingCost;

  // Create Stripe checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: `${STRIPE_SUCCESS_URL}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: STRIPE_CANCEL_URL,
    client_reference_id: req.user.id.toString(),
    customer_email: req.user.email,
    metadata: {
      userId: req.user.id.toString(),
      shippingAddress,
      city,
      state,
      postalCode,
      country,
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      shippingCost: shippingCost.toFixed(2),
      total: total.toFixed(2)
    },
    shipping_address_collection: {
      allowed_countries: ['US', 'CA']
    }
  });

  res.json({
    success: true,
    sessionId: session.id,
    url: session.url
  });
});

/**
 * @route   POST /api/orders/webhook
 * @desc    Handle Stripe webhook events
 * @access  Public (Stripe only)
 */
const stripeWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const { STRIPE_WEBHOOK_SECRET } = require('../config/stripe');

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // Use transaction for atomicity
    const t = await db.sequelize.transaction();

    try {
      // Get cart items
      const userId = parseInt(session.metadata.userId);
      const cartItems = await db.CartItem.findAll({
        where: { userId },
        include: [{ model: db.Product, as: 'product' }],
        transaction: t
      });

      // Create order
      const order = await db.Order.create({
        userId,
        stripeSessionId: session.id,
        stripePaymentIntentId: session.payment_intent,
        status: 'processing',
        paymentStatus: 'paid',
        paymentMethod: 'stripe',
        subtotal: parseFloat(session.metadata.subtotal),
        tax: parseFloat(session.metadata.tax),
        shippingCost: parseFloat(session.metadata.shippingCost),
        total: parseFloat(session.metadata.total),
        shippingAddress: session.metadata.shippingAddress,
        shippingCity: session.metadata.city,
        shippingState: session.metadata.state,
        shippingPostalCode: session.metadata.postalCode,
        shippingCountry: session.metadata.country,
        customerName: session.customer_details.name,
        customerEmail: session.customer_details.email,
        customerPhone: session.customer_details.phone
      }, { transaction: t });

      // Create order items and update stock
      for (const cartItem of cartItems) {
        await db.OrderItem.create({
          orderId: order.id,
          productId: cartItem.product.id,
          productName: cartItem.product.name,
          productSku: cartItem.product.sku,
          productImage: cartItem.product.imageUrl,
          price: cartItem.product.price,
          quantity: cartItem.quantity
        }, { transaction: t });

        // Update product stock and sales count
        await cartItem.product.decrement('stock', {
          by: cartItem.quantity,
          transaction: t
        });
        await cartItem.product.increment('salesCount', {
          by: cartItem.quantity,
          transaction: t
        });
      }

      // Clear cart
      await db.CartItem.destroy({
        where: { userId },
        transaction: t
      });

      await t.commit();

      console.log(`Order created successfully for session ${session.id}`);
    } catch (error) {
      await t.rollback();
      console.error('Error creating order:', error);
    }
  }

  res.json({ received: true });
});

/**
 * @route   GET /api/admin/orders
 * @desc    Get all orders (admin)
 * @access  Private (Admin)
 */
const getAllOrders = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    status,
    paymentStatus,
    search
  } = req.query;

  const offset = (page - 1) * limit;
  const where = {};

  if (status) where.status = status;
  if (paymentStatus) where.paymentStatus = paymentStatus;
  if (search) {
    where[Op.or] = [
      { orderNumber: { [Op.iLike]: `%${search}%` } },
      { customerEmail: { [Op.iLike]: `%${search}%` } },
      { customerName: { [Op.iLike]: `%${search}%` } }
    ];
  }

  const { count, rows: orders } = await db.Order.findAndCountAll({
    where,
    include: [
      {
        model: db.User,
        as: 'user',
        attributes: ['id', 'firstName', 'lastName', 'email']
      },
      {
        model: db.OrderItem,
        as: 'orderItems',
        include: [{
          model: db.Product,
          as: 'product',
          attributes: ['id', 'name']
        }]
      }
    ],
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [['createdAt', 'DESC']]
  });

  res.json({
    success: true,
    orders,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: count,
      pages: Math.ceil(count / limit)
    }
  });
});

/**
 * @route   PUT /api/admin/orders/:id/status
 * @desc    Update order status
 * @access  Private (Admin)
 */
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, trackingNumber } = req.body;

  const order = await db.Order.findByPk(req.params.id);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  const updateData = { status };

  // Set appropriate timestamps
  if (status === 'shipped') {
    updateData.shippedAt = new Date();
    if (trackingNumber) updateData.trackingNumber = trackingNumber;
  } else if (status === 'delivered') {
    updateData.deliveredAt = new Date();
  } else if (status === 'cancelled') {
    updateData.cancelledAt = new Date();
  }

  await order.update(updateData);

  res.json({
    success: true,
    message: 'Order status updated',
    order
  });
});

module.exports = {
  getOrders,
  getOrderById,
  createCheckoutSession,
  stripeWebhook,
  getAllOrders,
  updateOrderStatus
};
