const db = require('../config/db');

const SalePayments = {
  create: async (data) => {
    const { sale_id, customer_id, payment_date, amount, method = 'Cash', remarks = '' } = data;
    const [result] = await db.execute(
      `INSERT INTO sale_payments (sale_id, customer_id, payment_date, amount, method, remarks) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [sale_id, customer_id, payment_date, amount, method, remarks]
    );
    return result.insertId;
  },

  getBySaleId: async (sale_id) => {
    const [rows] = await db.execute(
      `SELECT * FROM sale_payments WHERE sale_id=? ORDER BY payment_date ASC`,
      [sale_id]
    );
    return rows;
  },

  getByCustomerId: async (customer_id) => {
    const [rows] = await db.execute(
      `SELECT * FROM sale_payments WHERE customer_id=? ORDER BY payment_date ASC`,
      [customer_id]
    );
    return rows;
  },

  deleteById: async (id) => {
    const [result] = await db.execute(`DELETE FROM sale_payments WHERE id=?`, [id]);
    return result;
  }
};

module.exports = SalePayments;
