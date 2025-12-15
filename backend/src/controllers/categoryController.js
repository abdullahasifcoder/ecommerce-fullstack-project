const db = require('../models');
const { asyncHandler } = require('../middleware/error');

/**
 * @route   GET /api/categories
 * @desc    Get all active categories
 * @access  Public
 */
const getCategories = asyncHandler(async (req, res) => {
  const categories = await db.Category.findAll({
    where: { isActive: true },
    order: [['sortOrder', 'ASC'], ['name', 'ASC']],
    include: [{
      model: db.Category,
      as: 'children',
      where: { isActive: true },
      required: false,
      attributes: ['id', 'name', 'slug', 'image']
    }]
  });

  res.json({
    success: true,
    categories
  });
});

/**
 * @route   GET /api/categories/:id
 * @desc    Get single category by ID
 * @access  Public
 */
const getCategoryById = asyncHandler(async (req, res) => {
  const category = await db.Category.findOne({
    where: { id: req.params.id, isActive: true },
    include: [{
      model: db.Category,
      as: 'children',
      where: { isActive: true },
      required: false
    }, {
      model: db.Category,
      as: 'parent',
      attributes: ['id', 'name', 'slug']
    }]
  });

  if (!category) {
    return res.status(404).json({
      success: false,
      message: 'Category not found'
    });
  }

  // Get product count
  const productCount = await db.Product.count({
    where: { categoryId: category.id, isActive: true }
  });

  res.json({
    success: true,
    category: {
      ...category.toJSON(),
      productCount
    }
  });
});

/**
 * @route   GET /api/categories/slug/:slug
 * @desc    Get category by slug
 * @access  Public
 */
const getCategoryBySlug = asyncHandler(async (req, res) => {
  const category = await db.Category.findOne({
    where: { slug: req.params.slug, isActive: true },
    include: [{
      model: db.Category,
      as: 'children',
      where: { isActive: true },
      required: false
    }]
  });

  if (!category) {
    return res.status(404).json({
      success: false,
      message: 'Category not found'
    });
  }

  res.json({
    success: true,
    category
  });
});

/**
 * @route   POST /api/admin/categories
 * @desc    Create new category
 * @access  Private (Admin)
 */
const createCategory = asyncHandler(async (req, res) => {
  const category = await db.Category.create(req.body);

  res.status(201).json({
    success: true,
    message: 'Category created successfully',
    category
  });
});

/**
 * @route   PUT /api/admin/categories/:id
 * @desc    Update category
 * @access  Private (Admin)
 */
const updateCategory = asyncHandler(async (req, res) => {
  const category = await db.Category.findByPk(req.params.id);

  if (!category) {
    return res.status(404).json({
      success: false,
      message: 'Category not found'
    });
  }

  await category.update(req.body);

  res.json({
    success: true,
    message: 'Category updated successfully',
    category
  });
});

/**
 * @route   DELETE /api/admin/categories/:id
 * @desc    Delete category
 * @access  Private (Admin)
 */
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await db.Category.findByPk(req.params.id);

  if (!category) {
    return res.status(404).json({
      success: false,
      message: 'Category not found'
    });
  }

  // Check if category has products
  const productCount = await db.Product.count({
    where: { categoryId: category.id }
  });

  if (productCount > 0) {
    return res.status(400).json({
      success: false,
      message: 'Cannot delete category with existing products'
    });
  }

  // Soft delete
  await category.update({ isActive: false });

  res.json({
    success: true,
    message: 'Category deleted successfully'
  });
});

module.exports = {
  getCategories,
  getCategoryById,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory
};
