const express = require('express');
const router = express.Router();
const SalesController = require('../controllers/sales.controller');
const SaleItems = require('../models/saleItems.model');

// --- SALES ROUTES ---

// Create a new sale (with items)
router.post('/', SalesController.createSale);

// Get all sales with items
router.get('/', SalesController.getAllSalesWithItems);

// Get new bill number
router.get('/new-bill', SalesController.getNewBillNo);

// Update sale (including items)
router.put('/:id', SalesController.updateSale);

// Delete sale (including items)
router.delete('/:id', SalesController.deleteSale);

// Get single sale by ID (with items)
router.get('/:id', SalesController.getSaleByIdWithItems);

// Optional: Get only items of a sale
router.get('/:id/items', async (req, res) => {
  try {
    const sale_id = req.params.id;
    const items = await SaleItems.getBySaleId(sale_id);
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch sale items" });
  }
});

module.exports = router;
