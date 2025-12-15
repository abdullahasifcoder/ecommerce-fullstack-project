'use strict';

module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Product name is required' },
        len: {
          args: [3, 255],
          msg: 'Product name must be between 3 and 255 characters',
        },
      },
    },
    slug: {
      type: DataTypes.STRING(300),
      allowNull: false,
      unique: {
        msg: 'Product slug already exists',
      },
    },
    sku: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: {
        msg: 'SKU already exists',
      },
      validate: {
        notEmpty: { msg: 'SKU is required' },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    shortDescription: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: {
          args: [0],
          msg: 'Price must be a positive number',
        },
        isDecimal: {
          msg: 'Price must be a valid decimal number',
        },
      },
    },
    comparePrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: {
          args: [0],
          msg: 'Compare price must be a positive number',
        },
      },
    },
    costPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: {
          args: [0],
          msg: 'Cost price must be a positive number',
        },
      },
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: 'Stock cannot be negative',
        },
        isInt: {
          msg: 'Stock must be an integer',
        },
      },
    },
    lowStockThreshold: {
      type: DataTypes.INTEGER,
      defaultValue: 10,
      validate: {
        min: 0,
      },
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'categories',
        key: 'id',
      },
    },
    imageUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    images: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
      allowNull: true,
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
      allowNull: true,
    },
    weight: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: 0,
      },
    },
    dimensions: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    salesCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    viewCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    metaTitle: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    metaDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'products',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['slug'],
      },
      {
        unique: true,
        fields: ['sku'],
      },
      {
        fields: ['name'],
      },
      {
        fields: ['categoryId'],
      },
      {
        fields: ['price'],
      },
      {
        fields: ['isActive'],
      },
      {
        fields: ['salesCount'],
      },
    ],
    hooks: {
      // Auto-generate slug from name before creating
      beforeValidate: (product) => {
        if (product.name && !product.slug) {
          product.slug = product.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
        }
      },
    },
    scopes: {
      // Predefined scope for active products
      active: {
        where: { isActive: true },
      },
      // Predefined scope for in-stock products
      inStock: {
        where: {
          stock: {
            [sequelize.Sequelize.Op.gt]: 0,
          },
        },
      },
      // Predefined scope for featured products
      featured: {
        where: { isFeatured: true },
      },
    },
  });

  // Define associations
  Product.associate = (models) => {
    Product.belongsTo(models.Category, {
      foreignKey: 'categoryId',
      as: 'category',
      onDelete: 'RESTRICT',
    });

    Product.hasMany(models.OrderItem, {
      foreignKey: 'productId',
      as: 'orderItems',
      onDelete: 'RESTRICT',
    });

    Product.hasMany(models.CartItem, {
      foreignKey: 'productId',
      as: 'cartItems',
      onDelete: 'CASCADE',
    });
  };

  return Product;
};
