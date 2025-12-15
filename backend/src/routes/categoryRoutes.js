const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticateAdmin } = require('../middleware/auth');
const { categoryValidation, idValidation } = require('../utils/validators');

// Public routes
router.get('/', categoryController.getCategories);
router.get('/:id', idValidation, categoryController.getCategoryById);
router.get('/slug/:slug', categoryController.getCategoryBySlug);

// Admin routes
router.post('/', authenticateAdmin, categoryValidation, categoryController.createCategory);
router.put('/:id', authenticateAdmin, idValidation, categoryValidation, categoryController.updateCategory);
router.delete('/:id', authenticateAdmin, idValidation, categoryController.deleteCategory);

module.exports = router;
