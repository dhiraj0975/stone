const Sales = require('../models/sales.model');
const SaleItems = require('../models/saleItems.model');

const SalesController = {
  // --- CREATE SALE ---
  createSale: async (req, res) => {
    try {
      const { customer_id, bill_no, bill_date, items, status, payment_status, payment_method, remarks } = req.body;

      if (!customer_id || !bill_no || !bill_date || !items || !items.length) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      // 1️⃣ Create sale
      const saleResult = await Sales.create({
        customer_id,
        bill_no,
        bill_date,
        status,
        payment_status,
        payment_method,
        remarks,
        items // pass items for totals calculation
      });
      
      const { sale_id, total_taxable, total_gst, total_amount } = saleResult;

      res.json({ 
        message: 'Sale created successfully', 
        sale_id, 
        total_taxable, 
        total_gst, 
        total_amount 
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server Error' });
    }
  },

  // --- GET ALL SALES ---
  getSales: async (req, res) => {
    try {
      const sales = await Sales.getAll();
      res.json(sales);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server Error' });
    }
  },

  // --- GET SALE BY ID ---
  getSaleById: async (req, res) => {
    try {
      const sale_id = req.params.id;
      const sale = await Sales.getById(sale_id);
      if (!sale) return res.status(404).json({ error: 'Sale not found' });

      const items = await SaleItems.getBySaleId(sale_id);
      res.json({ ...sale, items });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server Error' });
    }
  },

  // --- UPDATE SALE ---
  updateSale: async (req, res) => {
    try {
      const sale_id = req.params.id;
      const { customer_id, bill_no, bill_date, items, status, payment_status, payment_method, remarks } = req.body;

      // 1️⃣ Update sale basic info first
      await Sales.update(sale_id, {
        customer_id,
        bill_no,
        bill_date,
        status,
        payment_status,
        payment_method,
        remarks,
        total_amount: 0 // will recalc below
      });

      // 2️⃣ If items are provided, delete old & insert new
      let total_taxable = 0, total_gst = 0, total_amount = 0;
      if (items && items.length) {
        await SaleItems.deleteBySaleId(sale_id);
        const totals = await SaleItems.create(items.map(i => ({ ...i, sale_id })));
        total_taxable = totals.total_taxable;
        total_gst = totals.total_gst;
        total_amount = totals.total_amount;

        // 3️⃣ Update sale totals
        await Sales.update(sale_id, { total_taxable, total_gst, total_amount });
      }

      res.json({ message: 'Sale updated successfully', total_taxable, total_gst, total_amount });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server Error' });
    }
  },

  // --- DELETE SALE ---
  deleteSale: async (req, res) => {
    try {
      const sale_id = req.params.id;
      await Sales.delete(sale_id);
      res.json({ message: 'Sale deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server Error' });
    }
  },
  // --- GET NEW BILL NO ---
getNewBillNo :  async (req, res) => {
  try {
    const bill_no = await Sales.getNewBillNo();
    res.json({ bill_no });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
};

module.exports = SalesController;
