const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateAdmin } = require('../middleware/auth');
const { productValidation, idValidation } = require('../utils/validators');

// Public routes
router.get('/', productController.getProducts);
router.get('/:id', idValidation, productController.getProductById);
router.get('/slug/:slug', productController.getProductBySlug);
router.get('/:id/recommendations', idValidation, productController.getRecommendations);

// Admin routes
router.post('/', authenticateAdmin, productValidation, productController.createProduct);
router.put('/:id', authenticateAdmin, idValidation, productValidation, productController.updateProduct);
router.delete('/:id', authenticateAdmin, idValidation, productController.deleteProduct);

module.exports = router;
