const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateUser } = require('../middleware/auth');
const { registerValidation, loginValidation, updateProfileValidation } = require('../utils/validators');
const { authLimiter } = require('../middleware/rateLimit');

// Public routes with rate limiting
router.post('/register', authLimiter, registerValidation, authController.register);
router.post('/login', authLimiter, loginValidation, authController.login);

// Protected routes
router.post('/logout', authenticateUser, authController.logout);
router.get('/me', authenticateUser, authController.getMe);
router.put('/profile', authenticateUser, updateProfileValidation, authController.updateProfile);

module.exports = router;
