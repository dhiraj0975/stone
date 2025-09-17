const Purchase = require("../models/purchase.model");
const PurchaseItem = require("../models/purchaseItem.model");

const purchaseController = {
  // ✅ Create Purchase + Items
  create: async (req, res) => {
    try {
      const { vendor_id, bill_no, bill_date, total_amount, items } = req.body;

      // Purchase create
      const purchase_id = await Purchase.create({
        vendor_id,
        bill_no,
        bill_date,
        total_amount,
        status: "Active",
      });

      // Items create
      if (items && items.length > 0) {
        for (const item of items) {
          await PurchaseItem.create({
            purchase_id,
            product_id: item.product_id,
            rate: item.rate,
            qty: item.qty,
            unit: item.unit || "PCS",
            status: "Active",
          });
        }
      }

      res.status(201).json({
        message: "Purchase created successfully",
        purchase_id,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // ✅ Get All Purchases
  getAll: async (req, res) => {
    try {
      const purchases = await Purchase.findAll();
      res.json(purchases);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // ✅ Get Purchase + Items by ID
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const purchase = await Purchase.findById(id);
      if (!purchase) return res.status(404).json({ message: "Purchase not found" });

      const items = await PurchaseItem.findByPurchaseId(id);
      res.json({ purchase, items });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = purchaseController;
