'use strict';

module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: {
        msg: 'Category name already exists',
      },
      validate: {
        notEmpty: { msg: 'Category name is required' },
        len: {
          args: [2, 100],
          msg: 'Category name must be between 2 and 100 characters',
        },
      },
    },
    slug: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: {
        msg: 'Category slug already exists',
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING(500),
      allowNull: true,
      validate: {
        isUrl: {
          msg: 'Must be a valid URL',
        },
      },
    },
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'categories',
        key: 'id',
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
  }, {
    tableName: 'categories',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['slug'],
      },
      {
        fields: ['name'],
      },
      {
        fields: ['parentId'],
      },
    ],
    hooks: {
      // Auto-generate slug from name before creating
      beforeValidate: (category) => {
        if (category.name && !category.slug) {
          category.slug = category.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
        }
      },
    },
  });

  // Define associations
  Category.associate = (models) => {
    // Self-referential association for nested categories
    Category.belongsTo(models.Category, {
      foreignKey: 'parentId',
      as: 'parent',
      onDelete: 'SET NULL',
    });

    Category.hasMany(models.Category, {
      foreignKey: 'parentId',
      as: 'children',
      onDelete: 'SET NULL',
    });

    Category.hasMany(models.Product, {
      foreignKey: 'categoryId',
      as: 'products',
      onDelete: 'RESTRICT', // Prevent category deletion if it has products
    });
  };

  return Category;
};
