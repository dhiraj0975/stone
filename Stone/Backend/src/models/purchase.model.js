const db = require("../config/db"); // promise pool

const Purchase = {
  // ✅ Create Purchase
  create: async (data) => {
    const { vendor_id, bill_no, bill_date, total_amount, status } = data;
    const query = `
      INSERT INTO purchases (vendor_id, bill_no, bill_date, total_amount, status)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(query, [
      vendor_id,
      bill_no,
      bill_date,
      total_amount,
      status || "Active",
    ]);
    return result.insertId;
  },

  // ✅ Get all purchases with vendor info
  findAll: async () => {
    const query = `
      SELECT p.*, v.name AS vendor_name, v.firm_name
      FROM purchases p
      JOIN vendors v ON p.vendor_id = v.id
      ORDER BY p.id DESC
    `;
    const [rows] = await db.query(query);
    return rows;
  },

  // ✅ Get purchase by ID
  findById: async (id) => {
    const query = `
      SELECT p.*, v.name AS vendor_name, v.firm_name
      FROM purchases p
      JOIN vendors v ON p.vendor_id = v.id
      WHERE p.id = ?
    `;
    const [rows] = await db.query(query, [id]);
    return rows[0];
  },
};

module.exports = Purchase;
