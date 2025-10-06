const SalePayments = require('../models/salePayments.model');
const Sales = require('../models/sales.model');

const SalePaymentsController = {
  // Add payment
  addPayment: async (req, res) => {
    try {
      const { sale_id, customer_id, payment_date, amount, method, remarks } = req.body;
     if (!sale_id || !customer_id || !payment_date || !amount || Number(amount) <= 0) {
  return res.status(400).json({ error: "Sale, Customer, Date & Positive Amount required" });
}

      const paymentId = await SalePayments.create({ sale_id, customer_id, payment_date, amount, method, remarks });
      res.json({ message: 'Payment recorded', paymentId });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server Error' });
    }
  },

  // Get payments by customer with ledger calculation
getCustomerLedger: async (req, res) => {
  try {
    const customer_id = req.params.customer_id;

    // 1️⃣ Get all sales of customer
    const sales = await Sales.getByCustomerId(customer_id);

    // 2️⃣ Get all payments of customer
    const payments = await SalePayments.getByCustomerId(customer_id);

    let ledger = [];
    let totalSale = 0, totalPaid = 0, totalPending = 0;

    // Merge sales and payments chronologically
    for (const sale of sales) {
      const salePayments = payments.filter(p => p.sale_id === sale.id);
      const paidAmount = salePayments.reduce((a, p) => a + Number(p.amount), 0);

      // Pending should never be negative
      const pending = Math.max(Number(sale.total_amount) - paidAmount, 0);

      totalSale += Number(sale.total_amount);
      totalPaid += paidAmount;
      totalPending += pending;

      ledger.push({
        sale_id: sale.id,
        bill_no: sale.bill_no,
        date: sale.bill_date,
        total_amount: Number(sale.total_amount),
        paid: paidAmount,
        pending,
        payments: salePayments
      });
    }

    res.json({ ledger, totalSale, totalPaid, totalPending });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch customer ledger" });
  }
},

// Total paid, pending, lent (if extra column added)
getCustomerSummary: async (req, res) => {
  try {
    const customer_id = req.params.customer_id;
    const sales = await Sales.getByCustomerId(customer_id);
    const payments = await SalePayments.getByCustomerId(customer_id);

    let totalSale = 0, totalPaid = 0, totalPending = 0;

    sales.forEach(sale => {
      const paidAmount = payments
        .filter(p => p.sale_id === sale.id)
        .reduce((a,p) => a + Number(p.amount), 0);

      totalSale += Number(sale.total_amount);
      totalPaid += paidAmount;
      totalPending += Math.max(Number(sale.total_amount) - paidAmount, 0);
    });

    res.json({ totalSale, totalPaid, totalPending });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch summary" });
  }
}


};

module.exports = SalePaymentsController;
