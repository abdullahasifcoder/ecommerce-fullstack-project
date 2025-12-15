const db = require('../models');
const { asyncHandler } = require('../middleware/error');
const { Op } = require('sequelize');

/**
 * @route   GET /api/products
 * @desc    Get all products with filtering, sorting, and pagination
 * @access  Public
 */
const getProducts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 12,
    categoryId,
    search,
    minPrice,
    maxPrice,
    sortBy = 'createdAt',
    order = 'DESC',
    featured
  } = req.query;

  const offset = (page - 1) * limit;
  const where = { isActive: true };

  // Filter by category
  if (categoryId) {
    where.categoryId = categoryId;
  }

  // Filter by search term
  if (search) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { description: { [Op.iLike]: `%${search}%` } },
      { tags: { [Op.contains]: [search] } }
    ];
  }

  // Filter by price range
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price[Op.gte] = minPrice;
    if (maxPrice) where.price[Op.lte] = maxPrice;
  }

  // Filter by featured
  if (featured === 'true') {
    where.isFeatured = true;
  }

  const { count, rows: products } = await db.Product.findAndCountAll({
    where,
    include: [{
      model: db.Category,
      as: 'category',
      attributes: ['id', 'name', 'slug']
    }],
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [[sortBy, order]],
    distinct: true
  });

  res.json({
    success: true,
    products,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: count,
      pages: Math.ceil(count / limit)
    }
  });
});

/**
 * @route   GET /api/products/:id
 * @desc    Get single product by ID
 * @access  Public
 */
const getProductById = asyncHandler(async (req, res) => {
  const product = await db.Product.findOne({
    where: { id: req.params.id, isActive: true },
    include: [{
      model: db.Category,
      as: 'category',
      attributes: ['id', 'name', 'slug']
    }]
  });

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  // Increment view count
  await product.increment('viewCount');

  res.json({
    success: true,
    product
  });
});

/**
 * @route   GET /api/products/slug/:slug
 * @desc    Get single product by slug
 * @access  Public
 */
const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await db.Product.findOne({
    where: { slug: req.params.slug, isActive: true },
    include: [{
      model: db.Category,
      as: 'category',
      attributes: ['id', 'name', 'slug']
    }]
  });

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  // Increment view count
  await product.increment('viewCount');

  res.json({
    success: true,
    product
  });
});

/**
 * @route   GET /api/products/:id/recommendations
 * @desc    Get product recommendations (related & trending)
 * @access  Public
 */
const getRecommendations = asyncHandler(async (req, res) => {
  const product = await db.Product.findByPk(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  // Get related products (same category, exclude current)
  const relatedProducts = await db.Product.findAll({
    where: {
      categoryId: product.categoryId,
      id: { [Op.ne]: product.id },
      isActive: true
    },
    order: [['salesCount', 'DESC']],
    limit: 4,
    include: [{
      model: db.Category,
      as: 'category',
      attributes: ['id', 'name', 'slug']
    }]
  });

  // Get trending products (top sellers globally)
  const trendingProducts = await db.Product.findAll({
    where: {
      isActive: true,
      id: { [Op.ne]: product.id }
    },
    order: [['salesCount', 'DESC']],
    limit: 4,
    include: [{
      model: db.Category,
      as: 'category',
      attributes: ['id', 'name', 'slug']
    }]
  });

  res.json({
    success: true,
    recommendations: {
      related: relatedProducts,
      trending: trendingProducts
    }
  });
});

/**
 * @route   POST /api/admin/products
 * @desc    Create new product
 * @access  Private (Admin)
 */
const createProduct = asyncHandler(async (req, res) => {
  const product = await db.Product.create(req.body);

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    product
  });
});

/**
 * @route   PUT /api/admin/products/:id
 * @desc    Update product
 * @access  Private (Admin)
 */
const updateProduct = asyncHandler(async (req, res) => {
  const product = await db.Product.findByPk(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  await product.update(req.body);

  res.json({
    success: true,
    message: 'Product updated successfully',
    product
  });
});

/**
 * @route   DELETE /api/admin/products/:id
 * @desc    Delete product (soft delete by setting isActive to false)
 * @access  Private (Admin)
 */
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await db.Product.findByPk(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  // Soft delete
  await product.update({ isActive: false });

  res.json({
    success: true,
    message: 'Product deleted successfully'
  });
});

module.exports = {
  getProducts,
  getProductById,
  getProductBySlug,
  getRecommendations,
  createProduct,
  updateProduct,
  deleteProduct
};
