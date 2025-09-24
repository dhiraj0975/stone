const Sales = require('../models/sales.model');
const SaleItems = require('../models/saleItems.model');

const SalesController = {
  createSale: async (req, res) => {
    try {
      const { customer_id, bill_no, bill_date, items } = req.body;

      if (!customer_id || !bill_no || !bill_date || !items || !items.length) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      // create sale
      const saleResult = await Sales.create({ customer_id, bill_no, bill_date });
      const sale_id = saleResult.insertId;

      // create sale items
      const itemsWithSaleId = items.map(i => ({ ...i, sale_id }));
      await SaleItems.create(itemsWithSaleId);

      res.json({ message: 'Sale created successfully', sale_id });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server Error' });
    }
  },

  getSales: async (req, res) => {
    try {
      const sales = await Sales.getAll();
      res.json(sales);
    } catch (err) {
      res.status(500).json({ error: 'Server Error' });
    }
  },

  getSaleById: async (req, res) => {
    try {
      const sale_id = req.params.id;
      const sale = await Sales.getById(sale_id);
      if (!sale) return res.status(404).json({ error: 'Sale not found' });

      const items = await SaleItems.getBySaleId(sale_id);
      res.json({ ...sale, items });
    } catch (err) {
      res.status(500).json({ error: 'Server Error' });
    }
  },

  updateSale: async (req, res) => {
    try {
      const sale_id = req.params.id;
      const { customer_id, bill_no, bill_date, items, status } = req.body;

      await Sales.update(sale_id, { customer_id, bill_no, bill_date, total_amount: 0, status });

      if (items && items.length) {
        await SaleItems.deleteBySaleId(sale_id);
        const itemsWithSaleId = items.map(i => ({ ...i, sale_id }));
        await SaleItems.create(itemsWithSaleId);
      }

      res.json({ message: 'Sale updated successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Server Error' });
    }
  },

  deleteSale: async (req, res) => {
    try {
      const sale_id = req.params.id;
      await Sales.delete(sale_id);
      res.json({ message: 'Sale deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Server Error' });
    }
  }
};

module.exports = SalesController;
