const db = require('../config/db'); // assume mysql/promise config

const CustomerController = {

  getAll: async (req, res) => {
    try {
      const [rows] = await db.query("SELECT * FROM customers ORDER BY id DESC");
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch customers" });
    }
  },

  getById: async (req, res) => {
    const { id } = req.params;
    try {
      const [rows] = await db.query("SELECT * FROM customers WHERE id = ?", [id]);
      if (!rows.length) return res.status(404).json({ message: "Customer not found" });
      res.json(rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch customer" });
    }
  },

  create: async (req, res) => {
    const { name, email, phone, address } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });
    try {
      const [result] = await db.query(
        "INSERT INTO customers (name, email, phone, address) VALUES (?, ?, ?, ?)",
        [name, email || "", phone || "", address || ""]
      );
      res.status(201).json({ id: result.insertId, name, email, phone, address });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to create customer" });
    }
  },

  update: async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, address } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });
    try {
      const [result] = await db.query(
        "UPDATE customers SET name=?, email=?, phone=?, address=? WHERE id=?",
        [name, email || "", phone || "", address || "", id]
      );
      if (result.affectedRows === 0) return res.status(404).json({ message: "Customer not found" });
      res.json({ id, name, email, phone, address });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to update customer" });
    }
  },

  delete: async (req, res) => {
    const { id } = req.params;
    try {
      const [result] = await db.query("DELETE FROM customers WHERE id=?", [id]);
      if (result.affectedRows === 0) return res.status(404).json({ message: "Customer not found" });
      res.json({ message: "Customer deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to delete customer" });
    }
  },

};

module.exports = CustomerController;
