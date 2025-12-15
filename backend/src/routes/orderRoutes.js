const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticateUser, authenticateAdmin } = require('../middleware/auth');
const { idValidation, orderStatusValidation } = require('../utils/validators');

// Stripe webhook (must be before body parser middleware)
router.post('/webhook', express.raw({ type: 'application/json' }), orderController.stripeWebhook);

// User routes
router.get('/', authenticateUser, orderController.getOrders);
router.get('/:id', authenticateUser, idValidation, orderController.getOrderById);
router.post('/checkout', authenticateUser, orderController.createCheckoutSession);

// Admin routes
router.get('/admin/all', authenticateAdmin, orderController.getAllOrders);
router.put('/admin/:id/status', authenticateAdmin, idValidation, orderStatusValidation, orderController.updateOrderStatus);

module.exports = router;
