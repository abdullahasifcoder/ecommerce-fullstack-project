const db = require('../models');
const { generateAccessToken } = require('../utils/jwt');
const { COOKIE_OPTIONS } = require('../config/jwt');
const { asyncHandler } = require('../middleware/error');

/**
 * @route   POST /api/admin/auth/login
 * @desc    Login admin
 * @access  Public
 */
const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find admin by email
  const admin = await db.Admin.findOne({ where: { email } });

  if (!admin) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }

  // Check if admin is active
  if (!admin.isActive) {
    return res.status(403).json({
      success: false,
      message: 'Your account has been deactivated'
    });
  }

  // Validate password
  const isPasswordValid = await admin.validatePassword(password);

  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }

  // Update last login
  await admin.update({ lastLogin: new Date() });

  // Generate JWT token
  const token = generateAccessToken({ adminId: admin.id, email: admin.email });

  // Set token in httpOnly cookie
  res.cookie('adminToken', token, COOKIE_OPTIONS);

  res.json({
    success: true,
    message: 'Login successful',
    admin: admin.toSafeObject(),
    token
  });
});

/**
 * @route   POST /api/admin/auth/logout
 * @desc    Logout admin
 * @access  Private (Admin)
 */
const adminLogout = asyncHandler(async (req, res) => {
  // Clear cookie
  res.clearCookie('adminToken');

  res.json({
    success: true,
    message: 'Logout successful'
  });
});

/**
 * @route   GET /api/admin/auth/me
 * @desc    Get current admin profile
 * @access  Private (Admin)
 */
const getAdminProfile = asyncHandler(async (req, res) => {
  const admin = await db.Admin.findByPk(req.admin.id);

  res.json({
    success: true,
    admin: admin.toSafeObject()
  });
});

/**
 * @route   GET /api/admin/dashboard/stats
 * @desc    Get dashboard statistics
 * @access  Private (Admin)
 */
const getDashboardStats = asyncHandler(async (req, res) => {
  const { Op } = require('sequelize');

  // Get total counts
  const totalUsers = await db.User.count();
  const totalProducts = await db.Product.count();
  const totalOrders = await db.Order.count();
  const totalCategories = await db.Category.count();

  // Get revenue statistics
  const totalRevenue = await db.Order.sum('total', {
    where: { paymentStatus: 'paid' }
  }) || 0;

  const pendingOrders = await db.Order.count({
    where: { status: 'pending' }
  });

  // Get recent orders (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentRevenue = await db.Order.sum('total', {
    where: {
      paymentStatus: 'paid',
      createdAt: { [Op.gte]: thirtyDaysAgo }
    }
  }) || 0;

  // Get low stock products
  const lowStockProducts = await db.Product.count({
    where: {
      stock: { [Op.lte]: db.Sequelize.col('lowStockThreshold') }
    }
  });

  // Get monthly revenue (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyRevenue = await db.Order.findAll({
    attributes: [
      [db.Sequelize.fn('DATE_TRUNC', 'month', db.Sequelize.col('createdAt')), 'month'],
      [db.Sequelize.fn('SUM', db.Sequelize.col('total')), 'revenue'],
      [db.Sequelize.fn('COUNT', db.Sequelize.col('id')), 'orders']
    ],
    where: {
      paymentStatus: 'paid',
      createdAt: { [Op.gte]: sixMonthsAgo }
    },
    group: [db.Sequelize.fn('DATE_TRUNC', 'month', db.Sequelize.col('createdAt'))],
    order: [[db.Sequelize.fn('DATE_TRUNC', 'month', db.Sequelize.col('createdAt')), 'ASC']],
    raw: true
  });

  // Get top selling products
  const topProducts = await db.Product.findAll({
    attributes: ['id', 'name', 'salesCount', 'price', 'stock'],
    order: [['salesCount', 'DESC']],
    limit: 5
  });

  res.json({
    success: true,
    stats: {
      totalUsers,
      totalProducts,
      totalOrders,
      totalCategories,
      totalRevenue: parseFloat(totalRevenue).toFixed(2),
      recentRevenue: parseFloat(recentRevenue).toFixed(2),
      pendingOrders,
      lowStockProducts,
      monthlyRevenue,
      topProducts
    }
  });
});

module.exports = {
  adminLogin,
  adminLogout,
  getAdminProfile,
  getDashboardStats
};
