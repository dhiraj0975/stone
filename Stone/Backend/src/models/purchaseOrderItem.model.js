const db = require("../config/db");

// ✅ Purchase Order Items Model (Promise-based)
const PurchaseOrderItem = {
  create: async (data) => {
    const sql = `
      INSERT INTO purchase_order_items 
      (purchase_order_id, product_id, hsn_code, qty, rate, amount, discount_per_qty, discount_rate, discount_total, gst_percent, gst_amount, final_amount) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const productId = parseInt(data.product_id);
    const purchaseOrderId = parseInt(data.purchase_order_id);

    if (isNaN(productId)) throw new Error("product_id must be a valid integer");
    if (isNaN(purchaseOrderId)) throw new Error("purchase_order_id must be a valid integer");

    const values = [
      purchaseOrderId,
      productId,
      data.hsn_code || "",
      data.qty || 0,
      data.rate || 0,
      data.amount || 0,
      data.discount_per_qty || 0,
      data.discount_rate || 0,
      data.discount_total || 0,
      data.gst_percent || 0,
      data.gst_amount || 0,
      data.final_amount || 0,
    ];

    const [result] = await db.query(sql, values);
    return result;
  },

  getByPOId: async (purchase_order_id) => {
    const poId = parseInt(purchase_order_id);
    if (isNaN(poId)) throw new Error("purchase_order_id must be a valid integer");

    const sql = `
      SELECT poi.*, p.product_name 
      FROM purchase_order_items poi 
      JOIN products p ON poi.product_id = p.id
      WHERE poi.purchase_order_id = ?
    `;
    const [rows] = await db.query(sql, [poId]);
    return rows;
  },

  deleteByPOId: async (purchase_order_id) => {
    const poId = parseInt(purchase_order_id);
    if (isNaN(poId)) throw new Error("purchase_order_id must be a valid integer");

    const sql = `DELETE FROM purchase_order_items WHERE purchase_order_id = ?`;
    const [result] = await db.query(sql, [poId]);
    return result;
  },
};

module.exports = PurchaseOrderItem;
