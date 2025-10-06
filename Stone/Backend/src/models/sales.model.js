const db = require('../config/db');

const Sales = {
  // --- CREATE SALE ---
  create: async (data) => {
    let {
      customer_id,
      bill_no,
      bill_date,
      status = 'Active',
      payment_status = 'Unpaid',
      payment_method = 'Cash',
      remarks = '',
      items = []
    } = data;

    // Auto-generate bill_no agar nahi diya
    if (!bill_no) {
      const [lastSale] = await db.execute('SELECT bill_no FROM sales ORDER BY id DESC LIMIT 1');
      let lastNo = 0;
      if (lastSale.length) {
        const parts = lastSale[0].bill_no.split('-');
        lastNo = parseInt(parts[1]) || 0;
      }
      bill_no = `BILL-${String(lastNo + 1).padStart(3, '0')}`;
    }

    // Insert sale first
    const [saleResult] = await db.execute(
      `INSERT INTO sales (customer_id, bill_no, bill_date, status, payment_status, payment_method, remarks)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [customer_id, bill_no, bill_date, status, payment_status, payment_method, remarks]
    );
    const sale_id = saleResult.insertId;

    // Prepare sale_items & totals
    let total_taxable = 0, total_gst = 0, total_amount = 0;
    const itemValues = [];

    for (const item of items) {
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
  Number(item.sale_id), // ensure integer for foreign key
  Number(item.product_id), // optional, safety ke liye
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

    // Update totals in sales table
    await db.execute(
      `UPDATE sales SET total_taxable=?, total_gst=?, total_amount=? WHERE id=?`,
      [total_taxable, total_gst, total_amount, sale_id]
    );

    return { sale_id, bill_no, total_taxable, total_gst, total_amount };
  },

  // --- GET ALL SALES WITH CUSTOMER NAME ---
  getAll: async () => {
    const [rows] = await db.execute(`
      SELECT s.*, c.name AS customer_name
      FROM sales s
      LEFT JOIN customers c ON s.customer_id = c.id
      ORDER BY s.id DESC
    `);
    return rows;
  },

  // --- GET SINGLE SALE BY ID WITH CUSTOMER NAME ---
  getById: async (id) => {
    const [sale] = await db.execute(`
      SELECT s.*, c.name AS customer_name
      FROM sales s
      LEFT JOIN customers c ON s.customer_id = c.id
      WHERE s.id=?
    `, [id]);
    return sale[0];
  },

  // --- UPDATE SALE (BASIC FIELDS) ---
// --- UPDATE SALE ---
  // --- UPDATE SALE (model-level, db only, no req/res) ---
  // --- UPDATE SALE ---
  update: async (id, data) => {
    let { customer_id, bill_no, bill_date, status, payment_status, payment_method, remarks, total_taxable, total_gst, total_amount } = data;

    // Ensure customer_id is valid
    customer_id = Number(customer_id);
    if (!customer_id || isNaN(customer_id)) throw new Error('customer_id is required');

    const [result] = await db.execute(
      `UPDATE sales 
       SET customer_id=?, bill_no=?, bill_date=?, status=?, payment_status=?, payment_method=?, remarks=?,
           total_taxable=?, total_gst=?, total_amount=?
       WHERE id=?`,
      [
        customer_id,
        bill_no ?? null,
        bill_date ?? null,
        status ?? 'Active',
        payment_status ?? 'Unpaid',
        payment_method ?? 'Cash',
        remarks ?? null,
        total_taxable ?? 0,
        total_gst ?? 0,
        total_amount ?? 0,
        id
      ]
    );

    return result;
  },


  // --- UPDATE SALE (controller-level) ---
  updateSaleHandler: async (req, res) => {
    try {
      const sale_id = req.params.id;
      let { customer_id, bill_no, bill_date, items, status, payment_status, payment_method, remarks } = req.body;

      customer_id = customer_id ?? null;
      bill_no = bill_no ?? null;
      bill_date = bill_date ?? null;
      status = status || 'Active';
      payment_status = payment_status || 'Unpaid';
      payment_method = payment_method || 'Cash';
      remarks = remarks ?? null;

      // 1️⃣ Update sale info
      await Sales.update(sale_id, { customer_id, bill_no, bill_date, status, payment_status, payment_method, remarks });

      let total_taxable = 0, total_gst = 0, total_amount = 0;

      // 2️⃣ Update items
      if (items && items.length) {
        await SaleItems.deleteBySaleId(sale_id);
        const totals = await SaleItems.create(items.map(i => ({ ...i, sale_id })));
        total_taxable = totals.total_taxable;
        total_gst = totals.total_gst;
        total_amount = totals.total_amount;

        // 3️⃣ Update totals
        await Sales.update(sale_id, { total_taxable, total_gst, total_amount });
      }

      res.json({ message: 'Sale updated successfully', total_taxable, total_gst, total_amount });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server Error' });
    }
  }



,

  // --- DELETE SALE ---
  delete: async (id) => {
    await db.execute('DELETE FROM sale_items WHERE sale_id=?', [id]);
    const [result] = await db.execute('DELETE FROM sales WHERE id=?', [id]);
    return result;
  },

  // --- GET NEW BILL NO ---
  getNewBillNo: async () => {
    const [lastSale] = await db.execute('SELECT bill_no FROM sales ORDER BY id DESC LIMIT 1');
    let lastNo = 0;
    if (lastSale.length) {
      const parts = lastSale[0].bill_no.split('-');
      lastNo = parseInt(parts[1]) || 0;
    }
    return `BILL-${String(lastNo + 1).padStart(3, '0')}`;
  },

  // --- GET SALES BY CUSTOMER ID ---
  getByCustomerId: async (customer_id) => {
    const [rows] = await db.execute(`
      SELECT s.*, c.name AS customer_name
      FROM sales s
      LEFT JOIN customers c ON s.customer_id = c.id
      WHERE s.customer_id=?
      ORDER BY s.id DESC
    `, [customer_id]);

    // Attach sale items
    for (let sale of rows) {
      const [items] = await db.execute(`
        SELECT si.*, p.product_name AS item_name, p.hsn_code
        FROM sale_items si
        JOIN products p ON si.product_id = p.id
        WHERE si.sale_id=?
      `, [sale.id]);
      sale.items = items;
    }

    return rows;
  }
};

module.exports = Sales;
