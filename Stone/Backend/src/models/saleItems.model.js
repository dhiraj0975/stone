const db = require('../config/db');

const SaleItems = {
  create: async (items) => {
    let itemValues = [];
    let total_taxable = 0, total_gst = 0, total_amount = 0;

    for (const item of items) {
      const sale_id = Number(item.sale_id);
      if (!sale_id) throw new Error('sale_id is required for sale_item');

      const [product] = await db.execute(
        'SELECT sales_rate AS rate, gst_percent FROM products WHERE id=?',
        [item.product_id]
      );
      if (!product.length) continue;

      const rate = product[0].rate;
      const gst_percent = item.gst_percent !== undefined ? item.gst_percent : (product[0].gst_percent || 0);
      const qty = item.qty || 1;
      const discount_rate = item.discount_rate || 0;
      const discount_amount = item.discount_amount || (rate * qty * discount_rate / 100);
      const taxable_amount = rate * qty - discount_amount;
      const gst_amount = taxable_amount * gst_percent / 100;
      const net_total = taxable_amount + gst_amount;

      total_taxable += taxable_amount;
      total_gst += gst_amount;
      total_amount += net_total;

      itemValues.push([
        sale_id,
        Number(item.product_id),
        parseFloat(rate),
        parseFloat(qty),
        parseFloat(discount_rate),
        parseFloat(discount_amount),
        parseFloat(taxable_amount),
        parseFloat(gst_percent),
        parseFloat(gst_amount),
        parseFloat(net_total),
        item.unit || 'PCS'
      ]);
    }

    if (itemValues.length) {
      await db.query(
        `INSERT INTO sale_items 
        (sale_id, product_id, rate, qty, discount_rate, discount_amount, taxable_amount, gst_percent, gst_amount, net_total, unit)
        VALUES ?`,
        [itemValues]
      );
    }

    return { total_taxable, total_gst, total_amount };
  },

  deleteBySaleId: async (sale_id) => {
    const [result] = await db.execute('DELETE FROM sale_items WHERE sale_id=?', [sale_id]);
    return result;
  },

  getBySaleId: async (sale_id) => {
    const [items] = await db.execute(
      `SELECT si.*, p.product_name 
       FROM sale_items si
       JOIN products p ON si.product_id = p.id
       WHERE si.sale_id=?`,
      [sale_id]
    );
    return items;
  }
};

module.exports = SaleItems;
