const db = require("../config/db");

// ✅ Purchase Orders Model (Promise-based)
const PurchaseOrder = {
  create: async (data) => {
    const sql = `
      INSERT INTO purchase_orders 
      (po_no, vendor_id, date, bill_time, address, mobile_no, gst_no, place_of_supply, terms_condition, total_amount, gst_amount, final_amount) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // Make sure vendor_id is a number
    const vendorId = parseInt(data.vendor_id);
    if (isNaN(vendorId)) throw new Error("vendor_id must be a valid integer");

    const values = [
      data.po_no || "",
      vendorId,
      data.date || null,
      data.bill_time || null,
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
      SELECT 
    po.id AS purchase_order_id,
    po.po_no,
    po.date,
    po.bill_time,
    v.name AS vendor_name,
    po.address,
    po.mobile_no,
    po.gst_no,
    po.place_of_supply,
    po.terms_condition,
    po.total_amount AS order_total,
    po.gst_amount AS order_gst,
    po.final_amount AS order_final,
    po.status,

    poi.id AS item_id,
    poi.product_id,
    poi.hsn_code,
    poi.qty,
    poi.rate,
    poi.amount,
    poi.discount_per_qty,
    poi.discount_rate,
    poi.discount_total,
    poi.gst_percent,
    poi.gst_amount AS item_gst,
    poi.final_amount AS item_final

FROM purchase_orders po
JOIN purchase_order_items poi 
    ON po.id = poi.purchase_order_id
JOIN vendors v 
    ON po.vendor_id = v.id;

    `;
    const [rows] = await db.query(sql);
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query(`SELECT * FROM purchase_orders WHERE id = ?`, [id]);
    return rows;
  },

// Header only update
updateHeader: async (id, data) => {
    const sql = `
      UPDATE purchase_orders SET
        po_no = ?, vendor_id = ?, date = ?, bill_time = ?,
        address = ?, mobile_no = ?, gst_no = ?, place_of_supply = ?, 
        terms_condition = ?, total_amount = ?, gst_amount = ?, final_amount = ?
      WHERE id = ?
    `;
    const values = [
      data.po_no,
      data.vendor_id,
      data.date,
      data.bill_time,
      data.address,
      data.mobile_no,
      data.gst_no,
      data.place_of_supply,
      data.terms_condition,
      data.total_amount,
      data.gst_amount,
      data.final_amount,
      id,
    ];
    const [result] = await db.query(sql, values);
    return result;
  },

  // Update single PO item
  updateItem: async (id, data) => {
    if (!data.product_id) throw new Error("product_id is required for updating purchase_order_items");

    const sql = `
      UPDATE purchase_order_items SET
        product_id = ?, hsn_code = ?, qty = ?, rate = ?, amount = ?,
        discount_per_qty = ?, discount_rate = ?, discount_total = ?,
        gst_percent = ?, gst_amount = ?, final_amount = ?
      WHERE id = ?
    `;
    const values = [
      data.product_id,
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
      id,
    ];
    const [result] = await db.query(sql, values);
    return result;
  },

  // …other functions like create, delete




  delete: async (id) => {
    const [result] = await db.query(`DELETE FROM purchase_orders WHERE id = ?`, [id]);
    return result;
  },
};

module.exports = PurchaseOrder;
