

const Purchase = require("../models/purchase.model");

const purchaseController = {
  // ✅ Create Purchase
  create: async (req, res) => {
    try {
      const { vendor_id, po_id, bill_no, bill_date, items } = req.body;

      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: "items must be a non-empty array" });
      }

      const purchaseId = await Purchase.create({
        vendor_id,
        po_id,
        bill_no,
        bill_date,
        // total_amount,
        status: "Active",
        items,
      });

      res.status(201).json({
        message: "Purchase created successfully",
        purchase_id: purchaseId,
      });
    } catch (err) {
      console.error("Purchase creation error:", err);
      res.status(500).json({ error: err.message });
    }
  },

  // ✅ Get all
  getAll: async (req, res) => {
    try {
      const purchases = await Purchase.findAll();
      res.json(purchases);
    } catch (err) {
      console.error("GetAll purchases error:", err);
      res.status(500).json({ error: err.message });
    }
  },

  // ✅ Get by ID
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const purchase = await Purchase.findById(id);

      if (!purchase) return res.status(404).json({ message: "Purchase not found" });

      res.json(purchase);
    } catch (err) {
      console.error("GetById purchase error:", err);
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = purchaseController;
