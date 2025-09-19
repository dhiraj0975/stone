const Purchase = require("../models/purchase.model");

const purchaseController = {
  create: async (req, res) => {
    try {
      const { vendor_id, bill_no, bill_time, total_amount, items } = req.body;

      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: "items must be a non-empty array" });
      }

      const purchaseId = await Purchase.create({
        vendor_id,
        bill_no,
        bill_time,
        total_amount,
        status: "Active",
        items,
      });

      res.status(201).json({
        message: "Purchase created successfully",
        purchase_id: purchaseId,
      });
    } catch (err) {
      console.log("Purchase creation error:", err);
      res.status(500).json({ error: err.message });
    }
  },

  getAll: async (req, res) => {
    try {
      const purchases = await Purchase.findAll();
      res.json(purchases);
    } catch (err) {
      console.log("GetAll purchases error:", err);
      res.status(500).json({ error: err.message });
    }
  },

  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const purchase = await Purchase.findById(id);

      if (!purchase) return res.status(404).json({ message: "Purchase not found" });

      res.json(purchase);
    } catch (err) {
      console.log("GetById purchase error:", err);
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = purchaseController;
