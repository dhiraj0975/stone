const db = require('../config/db');

const SaleItems = {
  create: async (data) => {
    // data = array of items [{ sale_id, product_id, rate, qty, unit }]
    const values = data.map(item => [item.sale_id, item.product_id, item.rate, item.qty, item.unit || 'PCS']);
    const [result] = await db.query(
      'INSERT INTO sale_items (sale_id, product_id, rate, qty, unit) VALUES ?',
      [values]
    );
    return result;
  },

  getBySaleId: async (sale_id) => {
    const [rows] = await db.execute(
      `SELECT si.*, p.product_name 
       FROM sale_items si
       JOIN products p ON si.product_id = p.id
       WHERE si.sale_id = ?`,
      [sale_id]
    );
    return rows;
  },

  deleteBySaleId: async (sale_id) => {
    const [result] = await db.execute('DELETE FROM sale_items WHERE sale_id=?', [sale_id]);
    return result;
  }
};

module.exports = SaleItems;
