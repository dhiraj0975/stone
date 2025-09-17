const db = require("../config/db");

const PurchaseItem = {
  // ✅ Create purchase item
  create: async (data) => {
    const { purchase_id, product_id, rate, qty, unit, status } = data;
    const query = `
      INSERT INTO purchase_items (purchase_id, product_id, rate, qty, unit, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(query, [
      purchase_id,
      product_id,
      rate,
      qty,
      unit || "PCS",
      status || "Active",
    ]);
    return result.insertId;
  },

  // ✅ Get all items by purchase ID
  findByPurchaseId: async (purchaseId) => {
    const query = `
      SELECT pi.*, pr.product_name
      FROM purchase_items pi
      JOIN products pr ON pi.product_id = pr.id
      WHERE pi.purchase_id = ?
    `;
    const [rows] = await db.query(query, [purchaseId]);
    return rows;
  },
};

module.exports = PurchaseItem;



