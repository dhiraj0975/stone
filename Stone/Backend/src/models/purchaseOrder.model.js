const db = require("../config/db");

// Get all POs
 const getPurchaseOrders = async () => {
  const [rows] = await db.query(`
    SELECT po.id, v.name AS vendor_name, p.product_name, po.qty, po.rate, po.total, po.status, po.created_at
    FROM purchase_orders po
    JOIN vendors v ON po.vendor_id = v.id
    JOIN products p ON po.product_id = p.id
  `);
  return rows;
};

// Get PO by ID
 const getPurchaseOrderById = async (id) => {
  const [rows] = await db.query("SELECT * FROM purchase_orders WHERE id = ?", [id]);
  return rows[0];
};

// Create PO
 const createPurchaseOrder = async (data) => {
  const { vendor_id, product_id, qty, rate } = data;
  const total = qty * rate;
  const [result] = await db.query(
    "INSERT INTO purchase_orders (vendor_id, product_id, qty, rate, total) VALUES (?, ?, ?, ?, ?)",
    [vendor_id, product_id, qty, rate, total]
  );
  return result;
};

// Update PO
 const updatePurchaseOrder = async (id, data) => {
  const { vendor_id, product_id, qty, rate, status } = data;
  const total = qty * rate;
  const [result] = await db.query(
    "UPDATE purchase_orders SET vendor_id=?, product_id=?, qty=?, rate=?, total=?, status=? WHERE id=?",
    [vendor_id, product_id, qty, rate, total, status, id]
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
  deletePurchaseOrder
};
