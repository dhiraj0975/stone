const db = require("../config/db");

// Get all POs
const getPurchaseOrders = async () => {
  const [rows] = await db.query(`
    SELECT 
      po.id,
      po.vendor_id,
      po.product_id,
      v.name AS vendor_name,
      p.product_name,
      po.qty,
      po.rate,
      (po.qty * po.rate) AS total,
      po.status,
      po.created_at
    FROM purchase_orders po
    JOIN vendors v ON po.vendor_id = v.id
    JOIN products p ON po.product_id = p.id
    ORDER BY po.id DESC
  `);
  return rows;
};

// Get PO by ID
const getPurchaseOrderById = async (id) => {
  const [rows] = await db.query("SELECT * FROM purchase_orders WHERE id = ?", [id]);
  return rows[0];
};

// Create PO
const createPurchaseOrder = async ({ vendor_id, product_id, qty, rate }) => {
  const [result] = await db.query(
    "INSERT INTO purchase_orders (vendor_id, product_id, qty, rate) VALUES (?, ?, ?, ?)",
    [vendor_id, product_id, qty, rate]
  );
  return result;
};

// Update PO
const updatePurchaseOrder = async (id, { vendor_id, product_id, qty, rate, status }) => {
  const [result] = await db.query(
    "UPDATE purchase_orders SET vendor_id=?, product_id=?, qty=?, rate=?, status=? WHERE id=?",
    [vendor_id, product_id, qty, rate, status, id]
  );
  return result;
};

// Delete PO
const deletePurchaseOrder = async (id) => {
  const [result] = await db.query("DELETE FROM purchase_orders WHERE id = ?", [id]);
  return result;
};

module.exports = {
  getPurchaseOrders,
  getPurchaseOrderById,
  createPurchaseOrder,
  updatePurchaseOrder,
  deletePurchaseOrder,
};
