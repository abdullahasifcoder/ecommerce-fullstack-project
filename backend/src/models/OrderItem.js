'use strict';

module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define('OrderItem', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'orders',
        key: 'id',
      },
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id',
      },
    },
    // Snapshot data at time of order (in case product changes later)
    productName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    productSku: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    productImage: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: {
          args: [0],
          msg: 'Price must be positive',
        },
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: [1],
          msg: 'Quantity must be at least 1',
        },
        isInt: {
          msg: 'Quantity must be an integer',
        },
      },
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
  }, {
    tableName: 'order_items',
    timestamps: true,
    indexes: [
      {
        fields: ['orderId'],
      },
      {
        fields: ['productId'],
      },
    ],
    hooks: {
      // Calculate subtotal before creating/updating
      beforeValidate: (orderItem) => {
        if (orderItem.price && orderItem.quantity) {
          orderItem.subtotal = (
            parseFloat(orderItem.price) * parseInt(orderItem.quantity)
          ).toFixed(2);
        }
      },
    },
  });

  // Define associations
  OrderItem.associate = (models) => {
    OrderItem.belongsTo(models.Order, {
      foreignKey: 'orderId',
      as: 'order',
      onDelete: 'CASCADE',
    });

    OrderItem.belongsTo(models.Product, {
      foreignKey: 'productId',
      as: 'product',
      onDelete: 'RESTRICT',
    });
  };

  return OrderItem;
};
