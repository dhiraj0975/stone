const express = require('express');
const router = express.Router();
const SalesController = require('../controllers/sales.controller');

// --- SALES ROUTES ---
// Create a new sale (with items)
router.post('/', SalesController.createSale);

// Get all sales
router.get('/', SalesController.getSales);

// Get single sale by ID (with items)
router.get('/new-bill', SalesController.getNewBillNo);

// Update sale (including items)
router.put('/:id', SalesController.updateSale);

// Delete sale (including items)
router.delete('/:id', SalesController.deleteSale);

router.get('/:id', SalesController.getSaleById);
module.exports = router;
