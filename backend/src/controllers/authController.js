const db = require('../models');
const { generateAccessToken } = require('../utils/jwt');
const { COOKIE_OPTIONS } = require('../config/jwt');
const { asyncHandler } = require('../middleware/error');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
const register = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body;

  // Check if user already exists
  const existingUser = await db.User.findOne({ where: { email } });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User with this email already exists'
    });
  }

  // Create new user (password will be hashed by model hook)
  const user = await db.User.create({
    firstName,
    lastName,
    email,
    password,
    phone
  });

  // Generate JWT token
  const token = generateAccessToken({ userId: user.id, email: user.email });

  // Set token in httpOnly cookie
  res.cookie('token', token, COOKIE_OPTIONS);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    user: user.toSafeObject(),
    token
  });
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await db.User.findOne({ where: { email } });

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }

  // Check if user is active
  if (!user.isActive) {
    return res.status(403).json({
      success: false,
      message: 'Your account has been deactivated'
    });
  }

  // Validate password
  const isPasswordValid = await user.validatePassword(password);

  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }

  // Update last login
  await user.update({ lastLogin: new Date() });

  // Generate JWT token
  const token = generateAccessToken({ userId: user.id, email: user.email });

  // Set token in httpOnly cookie
  res.cookie('token', token, COOKIE_OPTIONS);

  res.json({
    success: true,
    message: 'Login successful',
    user: user.toSafeObject(),
    token
  });
});

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
const logout = asyncHandler(async (req, res) => {
  // Clear cookie
  res.clearCookie('token');

  res.json({
    success: true,
    message: 'Logout successful'
  });
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
  const user = await db.User.findByPk(req.user.id);

  res.json({
    success: true,
    user: user.toSafeObject()
  });
});

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile
 * @access  Private
 */
const updateProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName, phone, shippingAddress, city, state, postalCode, country } = req.body;

  const user = await db.User.findByPk(req.user.id);

  // Update fields
  await user.update({
    firstName: firstName || user.firstName,
    lastName: lastName || user.lastName,
    phone: phone || user.phone,
    shippingAddress: shippingAddress || user.shippingAddress,
    city: city || user.city,
    state: state || user.state,
    postalCode: postalCode || user.postalCode,
    country: country || user.country
  });

  res.json({
    success: true,
    message: 'Profile updated successfully',
    user: user.toSafeObject()
  });
});

module.exports = {
  register,
  login,
  logout,
  getMe,
  updateProfile
};
