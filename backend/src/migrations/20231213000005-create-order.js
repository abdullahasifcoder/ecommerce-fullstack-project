'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      orderNumber: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      status: {
        type: Sequelize.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'),
        defaultValue: 'pending'
      },
      paymentStatus: {
        type: Sequelize.ENUM('pending', 'paid', 'failed', 'refunded'),
        defaultValue: 'pending'
      },
      paymentMethod: {
        type: Sequelize.STRING(50),
        defaultValue: 'stripe'
      },
      stripePaymentIntentId: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      stripeSessionId: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      subtotal: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      tax: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.00
      },
      shippingCost: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.00
      },
      discount: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.00
      },
      total: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      shippingAddress: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      shippingCity: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      shippingState: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      shippingPostalCode: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      shippingCountry: {
        type: Sequelize.STRING(100),
        allowNull: false,
        defaultValue: 'USA'
      },
      customerName: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      customerEmail: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      customerPhone: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      trackingNumber: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      shippedAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      deliveredAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      cancelledAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Add indexes
    await queryInterface.addIndex('orders', ['orderNumber'], {
      unique: true,
      name: 'orders_order_number_unique'
    });

    await queryInterface.addIndex('orders', ['userId'], {
      name: 'orders_user_id_idx'
    });

    await queryInterface.addIndex('orders', ['status'], {
      name: 'orders_status_idx'
    });

    await queryInterface.addIndex('orders', ['paymentStatus'], {
      name: 'orders_payment_status_idx'
    });

    await queryInterface.addIndex('orders', ['createdAt'], {
      name: 'orders_created_at_idx'
    });

    await queryInterface.addIndex('orders', ['stripePaymentIntentId'], {
      name: 'orders_stripe_payment_intent_id_idx'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('orders');
  }
};
