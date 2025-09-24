const db = require('../config/db');

// Sales
const Sales = {
  create: async (data) => {
    const { customer_id, bill_no, bill_date, total_amount, status } = data;
    const [result] = await db.execute(
      `INSERT INTO sales (customer_id, bill_no, bill_date, total_amount, status)
       VALUES (?, ?, ?, ?, ?)`,
      [customer_id, bill_no, bill_date, total_amount || 0, status || 'Active']
    );
    return result;
  },

  getAll: async () => {
    const [rows] = await db.execute('SELECT * FROM sales ORDER BY id DESC');
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.execute('SELECT * FROM sales WHERE id = ?', [id]);
    return rows[0];
  },

  update: async (id, data) => {
    const { customer_id, bill_no, bill_date, total_amount, status } = data;
    const [result] = await db.execute(
      `UPDATE sales 
       SET customer_id=?, bill_no=?, bill_date=?, total_amount=?, status=?
       WHERE id=?`,
      [customer_id, bill_no, bill_date, total_amount, status, id]
    );
    return result;
  },

  delete: async (id) => {
    const [result] = await db.execute('DELETE FROM sales WHERE id=?', [id]);
    return result;
  }
};

module.exports = Sales;
