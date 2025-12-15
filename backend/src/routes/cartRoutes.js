const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { authenticateUser } = require('../middleware/auth');
const { cartItemValidation, idValidation } = require('../utils/validators');

// All cart routes require authentication
router.get('/', authenticateUser, cartController.getCart);
router.post('/', authenticateUser, cartItemValidation, cartController.addToCart);
router.put('/:id', authenticateUser, idValidation, cartItemValidation, cartController.updateCartItem);
router.delete('/:id', authenticateUser, idValidation, cartController.removeFromCart);
router.delete('/', authenticateUser, cartController.clearCart);

module.exports = router;
