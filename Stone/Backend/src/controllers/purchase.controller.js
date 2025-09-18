const Purchase = require("../models/purchase.model");
const PurchaseItem = require("../models/purchaseItem.model2");

const purchaseController = {
  // ✅ Create Purchase + Items
create: async (req, res) => {
  try {
    const { vendor_id, bill_no, bill_time, total_amount, items } = req.body;

    if (!Array.isArray(items)) {
      return res.status(400).json({ error: "items must be an array" });
    }

    // ✅ Pass items to Purchase.create
    const purchase_id = await Purchase.create({
      vendor_id,
      bill_no,
      bill_time,
      total_amount,
      status: "Active",
      items, // <-- ye pass karna important hai
    });

    res.status(201).json({
      message: "Purchase created successfully",
      purchase_id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

,
  // ✅ Get All Purchases
  // ✅ Get All Purchases
getAll: async (req, res) => {
  try {
    const purchases = await Purchase.findAll();
    res.json(purchases);
  } catch (err) {
    res.status(500).json({ error: err.message }); // ✅ sirf error bhejna hai
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
