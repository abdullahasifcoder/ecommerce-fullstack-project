const { verifyAccessToken } = require('../utils/jwt');
const db = require('../models');

/**
 * Middleware to authenticate users with JWT token
 * Verifies token from cookies and attaches user to request object
 */
const authenticateUser = async (req, res, next) => {
  try {
    // Get token from cookies
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // Verify token
    const decoded = verifyAccessToken(token);

    // Check if user exists and is active
    const user = await db.User.findByPk(decoded.userId);

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token or user no longer exists.'
      });
    }

    // Attach user to request object (without password)
    req.user = user.toSafeObject();
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token.'
    });
  }
};

/**
 * Middleware to authenticate admins with JWT token
 * Verifies token from cookies and attaches admin to request object
 */
const authenticateAdmin = async (req, res, next) => {
  try {
    // Get token from cookies
    const token = req.cookies.adminToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No admin token provided.'
      });
    }

    // Verify token
    const decoded = verifyAccessToken(token);

    // Check if admin exists and is active
    const admin = await db.Admin.findByPk(decoded.adminId);

    if (!admin || !admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token or admin no longer exists.'
      });
    }

    // Attach admin to request object (without password)
    req.admin = admin.toSafeObject();
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired admin token.'
    });
  }
};

/**
 * Middleware to check if admin has specific role
 * @param {Array} roles - Array of allowed roles
 */
const checkAdminRole = (roles) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions.'
      });
    }

    next();
  };
};

/**
 * Optional authentication middleware
 * Attaches user if token exists but doesn't fail if no token
 */
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (token) {
      const decoded = verifyAccessToken(token);
      const user = await db.User.findByPk(decoded.userId);

      if (user && user.isActive) {
        req.user = user.toSafeObject();
      }
    }
  } catch (error) {
    // Silently fail - authentication is optional
  }
  next();
};

module.exports = {
  authenticateUser,
  authenticateAdmin,
  checkAdminRole,
  optionalAuth,
};
