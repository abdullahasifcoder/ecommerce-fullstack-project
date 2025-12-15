const express = require('express');
const router = express.Router();
const db = require('../models');
const { optionalAuth, authenticateUser } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/error');

/**
 * Home page
 */
router.get('/', optionalAuth, asyncHandler(async (req, res) => {
  // Get featured products
  const featuredProducts = await db.Product.findAll({
    where: { isActive: true, isFeatured: true },
    limit: 8,
    include: [{
      model: db.Category,
      as: 'category',
      attributes: ['name', 'slug']
    }],
    order: [['salesCount', 'DESC']]
  });

  // Get categories
  const categories = await db.Category.findAll({
    where: { isActive: true, parentId: null },
    order: [['sortOrder', 'ASC']],
    limit: 6
  });

  res.render('pages/home', {
    title: 'Home',
    user: req.user || null,
    featuredProducts,
    categories
  });
}));

/**
 * Shop page - product listing
 */
router.get('/shop', optionalAuth, asyncHandler(async (req, res) => {
  const { page = 1, limit = 12, categoryId, search, minPrice, maxPrice, sortBy = 'createdAt' } = req.query;
  const { Op } = require('sequelize');

  const offset = (page - 1) * limit;
  const where = { isActive: true };

  if (categoryId) where.categoryId = categoryId;
  if (search) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { description: { [Op.iLike]: `%${search}%` } }
    ];
  }
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price[Op.gte] = minPrice;
    if (maxPrice) where.price[Op.lte] = maxPrice;
  }

  const { count, rows: products } = await db.Product.findAndCountAll({
    where,
    include: [{ model: db.Category, as: 'category', attributes: ['name', 'slug'] }],
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [[sortBy, 'DESC']]
  });

  const categories = await db.Category.findAll({
    where: { isActive: true },
    order: [['name', 'ASC']]
  });

  res.render('pages/shop', {
    title: 'Shop',
    user: req.user || null,
    products,
    categories,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: count,
      pages: Math.ceil(count / limit)
    },
    filters: { categoryId, search, minPrice, maxPrice, sortBy }
  });
}));

/**
 * Product detail page
 */
router.get('/product/:slug', optionalAuth, asyncHandler(async (req, res) => {
  const product = await db.Product.findOne({
    where: { slug: req.params.slug, isActive: true },
    include: [{
      model: db.Category,
      as: 'category',
      attributes: ['id', 'name', 'slug']
    }]
  });

  if (!product) {
    return res.status(404).render('pages/404', {
      title: 'Product Not Found',
      user: req.user || null
    });
  }

  // Increment view count
  await product.increment('viewCount');

  // Get related products
  const relatedProducts = await db.Product.findAll({
    where: {
      categoryId: product.categoryId,
      id: { [db.Sequelize.Op.ne]: product.id },
      isActive: true
    },
    order: [['salesCount', 'DESC']],
    limit: 4
  });

  res.render('pages/product-detail', {
    title: product.name,
    user: req.user || null,
    product,
    relatedProducts
  });
}));

/**
 * Cart page
 */
router.get('/cart', authenticateUser, asyncHandler(async (req, res) => {
  const cartItems = await db.CartItem.findAll({
    where: { userId: req.user.id },
    include: [{
      model: db.Product,
      as: 'product',
      attributes: ['id', 'name', 'slug', 'price', 'stock', 'imageUrl']
    }]
  });

  let subtotal = 0;
  cartItems.forEach(item => {
    subtotal += parseFloat(item.product.price) * item.quantity;
  });

  res.render('pages/cart', {
    title: 'Shopping Cart',
    user: req.user,
    cartItems,
    subtotal: subtotal.toFixed(2)
  });
}));

/**
 * Checkout page
 */
router.get('/checkout', authenticateUser, asyncHandler(async (req, res) => {
  const cartItems = await db.CartItem.findAll({
    where: { userId: req.user.id },
    include: [{ model: db.Product, as: 'product' }]
  });

  if (cartItems.length === 0) {
    return res.redirect('/cart');
  }

  let subtotal = 0;
  cartItems.forEach(item => {
    subtotal += parseFloat(item.product.price) * item.quantity;
  });

  const tax = subtotal * 0.1;
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + tax + shipping;

  res.render('pages/checkout', {
    title: 'Checkout',
    user: req.user,
    cartItems,
    subtotal: subtotal.toFixed(2),
    tax: tax.toFixed(2),
    shipping: shipping.toFixed(2),
    total: total.toFixed(2)
  });
}));

/**
 * Orders page
 */
router.get('/orders', authenticateUser, asyncHandler(async (req, res) => {
  const orders = await db.Order.findAll({
    where: { userId: req.user.id },
    include: [{
      model: db.OrderItem,
      as: 'orderItems',
      include: [{ model: db.Product, as: 'product', attributes: ['name', 'imageUrl'] }]
    }],
    order: [['createdAt', 'DESC']]
  });

  res.render('pages/orders', {
    title: 'My Orders',
    user: req.user,
    orders
  });
}));

/**
 * Order success page
 */
router.get('/orders/success', authenticateUser, asyncHandler(async (req, res) => {
  res.render('pages/order-success', {
    title: 'Order Successful',
    user: req.user
  });
}));

/**
 * Login page
 */
router.get('/login', (req, res) => {
  if (req.cookies.token) {
    return res.redirect('/');
  }
  res.render('pages/login', {
    title: 'Login',
    user: null
  });
});

/**
 * Register page
 */
router.get('/register', (req, res) => {
  if (req.cookies.token) {
    return res.redirect('/');
  }
  res.render('pages/register', {
    title: 'Register',
    user: null
  });
});

/**
 * Profile page
 */
router.get('/profile', authenticateUser, (req, res) => {
  res.render('pages/profile', {
    title: 'My Profile',
    user: req.user
  });
});

module.exports = router;
