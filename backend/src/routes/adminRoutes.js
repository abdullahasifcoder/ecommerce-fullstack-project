const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const productController = require('../controllers/productController');
const categoryController = require('../controllers/categoryController');
const orderController = require('../controllers/orderController');
const { authenticateAdmin } = require('../middleware/auth');
const { loginValidation, productValidation, categoryValidation, idValidation, orderStatusValidation } = require('../utils/validators');
const { authLimiter } = require('../middleware/rateLimit');

// Public routes
router.post('/auth/login', authLimiter, loginValidation, adminController.adminLogin);

// Protected routes
router.post('/auth/logout', authenticateAdmin, adminController.adminLogout);
router.get('/auth/me', authenticateAdmin, adminController.getAdminProfile);
router.get('/dashboard/stats', authenticateAdmin, adminController.getDashboardStats);

// Admin Product Management
router.get('/products', authenticateAdmin, productController.getProducts);
router.get('/products/:id', authenticateAdmin, idValidation, productController.getProductById);
router.post('/products', authenticateAdmin, productValidation, productController.createProduct);
router.put('/products/:id', authenticateAdmin, idValidation, productValidation, productController.updateProduct);
router.delete('/products/:id', authenticateAdmin, idValidation, productController.deleteProduct);

// Admin Category Management
router.get('/categories', authenticateAdmin, categoryController.getCategories);
router.get('/categories/:id', authenticateAdmin, idValidation, categoryController.getCategoryById);
router.post('/categories', authenticateAdmin, categoryValidation, categoryController.createCategory);
router.put('/categories/:id', authenticateAdmin, idValidation, categoryValidation, categoryController.updateCategory);
router.delete('/categories/:id', authenticateAdmin, idValidation, categoryController.deleteCategory);

// Admin Order Management
router.get('/orders', authenticateAdmin, orderController.getAllOrders);
router.get('/orders/:id', authenticateAdmin, idValidation, orderController.getOrderById);
router.put('/orders/:id/status', authenticateAdmin, idValidation, orderStatusValidation, orderController.updateOrderStatus);

module.exports = router;
