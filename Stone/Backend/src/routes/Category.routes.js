const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');

// Get all categories
router.get('/', categoryController.getAllCategories);

// Get category by ID
router.get('/:id', categoryController.getCategoryById);

// Create new category
router.post('/', categoryController.createCategory);

// Update category by ID
router.put('/:id', categoryController.updateCategory);

// Delete category by ID
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;