const db = require("../config/db");

// ✅ Purchase Orders Model (Promise-based)
const PurchaseOrder = {
  create: async (data) => {
    const sql = `
      INSERT INTO purchase_orders 
      (po_no, vendor_id, date, bill_date, address, mobile_no, gst_no, place_of_supply, terms_condition, total_amount, gst_amount, final_amount) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // Make sure vendor_id is a number
    const vendorId = parseInt(data.vendor_id);
    if (isNaN(vendorId)) throw new Error("vendor_id must be a valid integer");

    const values = [
      data.po_no || "",
      vendorId,
      data.date || null,
      data.bill_date || null,
      data.address || "",
      data.mobile_no || "",
      data.gst_no || "",
      data.place_of_supply || "",
      data.terms_condition || "",
      data.total_amount || 0,
      data.gst_amount || 0,
      data.final_amount || 0,
    ];

    const [result] = await db.query(sql, values);
    return result;
  },

  getAll: async () => {
    const sql = `
      SELECT po.*, v.name as vendor_name 
      FROM purchase_orders po 
      JOIN vendors v ON po.vendor_id = v.id
    `;
    const [rows] = await db.query(sql);
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query(`SELECT * FROM purchase_orders WHERE id = ?`, [id]);
    return rows;
  },

  update: async (id, data) => {
    const sql = `
      UPDATE purchase_orders SET
      po_no = ?, vendor_id = ?, date = ?, bill_date = ?, address = ?, mobile_no = ?, 
      gst_no = ?, place_of_supply = ?, terms_condition = ?, total_amount = ?, gst_amount = ?, final_amount = ?
      WHERE id = ?
    `;

    const vendorId = parseInt(data.vendor_id);
    if (isNaN(vendorId)) throw new Error("vendor_id must be a valid integer");

    const values = [
      data.po_no || "",
      vendorId,
      data.date || null,
      data.bill_date || null,
      data.address || "",
      data.mobile_no || "",
      data.gst_no || "",
      data.place_of_supply || "",
      data.terms_condition || "",
      data.total_amount || 0,
      data.gst_amount || 0,
      data.final_amount || 0,
      id,
    ];

    const [result] = await db.query(sql, values);
    return result;
  },

  delete: async (id) => {
    const [result] = await db.query(`DELETE FROM purchase_orders WHERE id = ?`, [id]);
    return result;
  },
};

module.exports = PurchaseOrder;
