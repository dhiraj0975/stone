const db = require('../config/db'); // mysql2/promise config

const Customer = {
  // 1️⃣ Get all customers with formatted date/time
  getAll: async () => {
    const [rows] = await db.query(
      `SELECT *, 
        DATE_FORMAT(created_at, '%Y-%m-%d %h:%i:%s %p') AS created_at_formatted, 
        DATE_FORMAT(updated_at, '%Y-%m-%d %h:%i:%s %p') AS updated_at_formatted 
       FROM customers 
       ORDER BY id DESC`
    );
    return rows;
  },

  // 2️⃣ Get customer by ID with formatted date/time
  getById: async (id) => {
    const [rows] = await db.query(
      `SELECT *, 
        DATE_FORMAT(created_at, '%Y-%m-%d %h:%i:%s %p') AS created_at_formatted, 
        DATE_FORMAT(updated_at, '%Y-%m-%d %h:%i:%s %p') AS updated_at_formatted 
       FROM customers WHERE id = ?`,
      [id]
    );
    return rows[0];
  },

  // 3️⃣ Create new customer
  create: async (data) => {
    const { name, email, phone, address, status } = data;
    const [result] = await db.query(
      `INSERT INTO customers (name, email, phone, address, status, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
      [name, email || "", phone || "", address || "", status || "Active"]
    );
    return { id: result.insertId, name, email, phone, address, status: status || "Active" };
  },

  // 4️⃣ Update customer
  update: async (id, data) => {
    const { name, email, phone, address, status } = data;
    const [result] = await db.query(
      `UPDATE customers SET name=?, email=?, phone=?, address=?, status=?, updated_at=NOW() WHERE id=?`,
      [name, email || "", phone || "", address || "", status || "Active", id]
    );
    return result.affectedRows;
  },

  // 5️⃣ Delete customer
  delete: async (id) => {
    const [result] = await db.query("DELETE FROM customers WHERE id=?", [id]);
    return result.affectedRows;
  },

  // 6️⃣ Toggle status Active/Inactive
  toggleStatus: async (id, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    const [result] = await db.query(
      "UPDATE customers SET status=?, updated_at=NOW() WHERE id=?",
      [newStatus, id]
    );
    return newStatus;
  },
};

module.exports = Customer;
