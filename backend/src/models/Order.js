'use strict';

module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    orderNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: {
        msg: 'Order number already exists',
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    status: {
      type: DataTypes.ENUM(
        'pending',
        'processing',
        'shipped',
        'delivered',
        'cancelled',
        'refunded'
      ),
      defaultValue: 'pending',
    },
    paymentStatus: {
      type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
      defaultValue: 'pending',
    },
    paymentMethod: {
      type: DataTypes.STRING(50),
      defaultValue: 'stripe',
    },
    stripePaymentIntentId: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    stripeSessionId: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    tax: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      validate: {
        min: 0,
      },
    },
    shippingCost: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      validate: {
        min: 0,
      },
    },
    discount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      validate: {
        min: 0,
      },
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    // Shipping address (snapshot at time of order)
    shippingAddress: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    shippingCity: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    shippingState: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    shippingPostalCode: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    shippingCountry: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: 'USA',
    },
    // Customer info (snapshot)
    customerName: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    customerEmail: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    customerPhone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    trackingNumber: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    shippedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deliveredAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    cancelledAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'orders',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['orderNumber'],
      },
      {
        fields: ['userId'],
      },
      {
        fields: ['status'],
      },
      {
        fields: ['paymentStatus'],
      },
      {
        fields: ['createdAt'],
      },
      {
        fields: ['stripePaymentIntentId'],
      },
    ],
    hooks: {
      // Auto-generate order number before creating
      beforeValidate: (order) => {
        if (!order.orderNumber) {
          const timestamp = Date.now();
          const random = Math.floor(Math.random() * 1000);
          order.orderNumber = `ORD-${timestamp}-${random}`;
        }
      },
    },
    scopes: {
      // Predefined scope for pending orders
      pending: {
        where: { status: 'pending' },
      },
      // Predefined scope for paid orders
      paid: {
        where: { paymentStatus: 'paid' },
      },
    },
  });

  // Define associations
  Order.associate = (models) => {
    Order.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
      onDelete: 'RESTRICT',
    });

    Order.hasMany(models.OrderItem, {
      foreignKey: 'orderId',
      as: 'orderItems',
      onDelete: 'CASCADE',
    });
  };

  return Order;
};
