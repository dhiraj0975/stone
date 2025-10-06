const express = require('express');
const router = express.Router();
const SalePaymentsController = require('../controllers/salePayments.controller');
const SalePayments = require('../models/salePayments.model');

// Add payment
router.post('/', SalePaymentsController.addPayment);

// Get customer ledger
router.get('/:customer_id/ledger', SalePaymentsController.getCustomerLedger);

// Customer payment summary
router.get('/:customer_id/summary', SalePaymentsController.getCustomerSummary);

// Get all payments for a specific sale
router.get('/sale/:sale_id', async (req, res) => {
  try {
    const payments = await SalePayments.getBySaleId(req.params.sale_id);
    res.json(payments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch payments" });
  }
});



module.exports = router;
