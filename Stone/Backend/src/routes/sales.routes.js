const express = require('express');
const router = express.Router();
const SalesController = require('../controllers/sales.controller');

// Routes
router.post('/', SalesController.createSale);
router.get('/', SalesController.getSales);
router.get('/:id', SalesController.getSaleById);
router.put('/:id', SalesController.updateSale);
router.delete('/:id', SalesController.deleteSale);

module.exports = router;
