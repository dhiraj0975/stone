// const db = require("../config/db"); // promise pool

// const Purchase = {
//   // ✅ Create Purchase
//   create: async (data) => {
//     const { vendor_id, bill_no, bill_time, total_amount, status } = data;
//     const query = `
//       INSERT INTO purchases (vendor_id, bill_no, bill_time, total_amount, status)
//       VALUES (?, ?, ?, ?, ?)
//     `;
//     const [result] = await db.query(query, [
//       vendor_id,
//       bill_no,
//       bill_time,
//       total_amount,
//       status || "Active",
//     ]);
//     return result.insertId;
//   },

//   // ✅ Get all purchases with vendor + products info
//   findAll: async () => {
//     const query = `
//       SELECT 
//         p.id,
//         p.vendor_id,
//         p.bill_no,
//         p.bill_time,
//         p.total_amount,
//         p.status,
//         v.name AS vendor_name,
//         v.firm_name,
//         GROUP_CONCAT(pr.product_name SEPARATOR ', ') AS products
//       FROM purchases p
//       JOIN vendors v 
//         ON p.vendor_id = v.id
//       LEFT JOIN purchase_items pi 
//         ON p.id = pi.purchase_id
//       LEFT JOIN products pr 
//         ON pi.product_id = pr.id
//       GROUP BY 
//         p.id, p.vendor_id, p.bill_no, p.bill_time, p.total_amount, p.status, v.name, v.firm_name
//       ORDER BY p.id DESC
//     `;
//     const [rows] = await db.query(query);
//     return rows;
//   },

//   // ✅ Get single purchase by ID with vendor + products info
//   findById: async (id) => {
//     const query = `
//       SELECT 
//         p.id,
//         p.vendor_id,
//         p.bill_no,
//         p.bill_time,
//         p.total_amount,
//         p.status,
//         v.name AS vendor_name,
//         v.firm_name,
//         GROUP_CONCAT(pr.product_name SEPARATOR ', ') AS products
//       FROM purchases p
//       JOIN vendors v 
//         ON p.vendor_id = v.id
//       LEFT JOIN purchase_items pi 
//         ON p.id = pi.purchase_id
//       LEFT JOIN products pr 
//         ON pi.product_id = pr.id
//       WHERE p.id = ?
//       GROUP BY 
//         p.id, p.vendor_id, p.bill_no, p.bill_time, p.total_amount, p.status, v.name, v.firm_name
//     `;
//     const [rows] = await db.query(query, [id]);
//     return rows[0];
//   },
// };

// module.exports = Purchase;



const db = require("../config/db"); // mysql2/promise pool

const Purchase = {
  // 1️⃣ Create new purchase with items
  create: async (data) => {
    const { vendor_id, bill_no, bill_time, total_amount, status, items } = data;

    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // Insert purchase
      const [purchaseResult] = await conn.query(
        `INSERT INTO purchases (vendor_id, bill_no, bill_time, total_amount, status)
         VALUES (?, ?, ?, ?, ?)`,
        [vendor_id, bill_no, bill_time, total_amount, status || "Active"]
      );
      const purchaseId = purchaseResult.insertId;

      // Insert purchase items
      for (const item of items) {
        const { product_id, rate, qty, unit } = item;
        await conn.query(
          `INSERT INTO purchase_items (purchase_id, product_id, rate, qty, unit, status)
           VALUES (?, ?, ?, ?, ?, 'Active')`,
          [purchaseId, product_id, rate, qty, unit]
        );
      }

      await conn.commit();
      conn.release();
      return purchaseId;
    } catch (err) {
      await conn.rollback();
      conn.release();
      throw err;
    }
  },

  // 2️⃣ Get all purchases with vendor + products
  findAll: async () => {
    const [rows] = await db.query(`
      SELECT 
  p.id, p.bill_no, p.bill_date, p.total_amount, p.status,
  v.name AS vendor_name, v.firm_name,
  GROUP_CONCAT(pr.product_name SEPARATOR ', ') AS products
FROM purchases p
JOIN vendors v ON p.vendor_id = v.id
LEFT JOIN purchase_items pi ON p.id = pi.purchase_id
LEFT JOIN products pr ON pi.product_id = pr.id
GROUP BY p.id
ORDER BY p.id DESC

    `);
    return rows;
  },

  // 3️⃣ Get single purchase with items
  findById: async (id) => {
    // Purchase info + vendor
    const [purchaseRows] = await db.query(
      `SELECT p.*, v.name AS vendor_name, v.firm_name
       FROM purchases p
       JOIN vendors v ON p.vendor_id = v.id
       WHERE p.id = ?`,
      [id]
    );

    if (purchaseRows.length === 0) return null;
    const purchase = purchaseRows[0];

    // Purchase items + product detail
    const [itemRows] = await db.query(
      `SELECT pi.id, pi.product_id, pr.product_name, pi.rate, pi.qty, pi.unit, pi.status
       FROM purchase_items pi
       JOIN products pr ON pi.product_id = pr.id
       WHERE pi.purchase_id = ?`,
      [id]
    );

    purchase.items = itemRows;
    return purchase;
  },
};

module.exports = Purchase;
