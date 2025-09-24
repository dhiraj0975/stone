


// const db = require("../config/db");
// const PurchaseItem = require("./purchaseItem.model2");

// const Purchase = {
//   // ✅ Create Purchase + Items (safe & fast)
//  create: async (data) => {
//   const { vendor_id, po_id, bill_no, bill_date, total_amount, status, items } = data;

//   if (!Array.isArray(items) || items.length === 0) {
//     throw new Error("Items must be a non-empty array");
//   }

//   const conn = await db.getConnection(); // transaction connection
//   try {
//     await conn.beginTransaction();

//     const formattedDate = bill_date ? new Date(bill_date).toISOString().split("T")[0] : null;

//     // 1️⃣ Insert purchase
// // total_amount calculate karo items se
// const total_amount = items.reduce(
//   (sum, i) => sum + (Number(i.rate || 0) * Number(i.qty || 0)),
//   0
// );

// const [purchaseResult] = await conn.query(
//   `INSERT INTO purchases (vendor_id, po_id, bill_no, bill_date, total_amount, status)
//    VALUES (?, ?, ?, ?, ?, ?)`,
//   [vendor_id, po_id || null, bill_no, formattedDate, total_amount, status || "Active"]
// );

//     const purchaseId = purchaseResult.insertId;

//     // 2️⃣ Batch insert items using same connection
// const values = items.map((i) => [
//   purchaseId,
//   i.product_id,
//   i.rate,
//   i.qty,
//   i.unit || "PCS",
//   "Active" // status
// ]);



//     if (values.length > 0) {
// await conn.query(
//   `INSERT INTO purchase_items (purchase_id, product_id, rate, qty, unit, status) VALUES ?`,
//   [values]
// );


//     }

//     await conn.commit();
//     conn.release();
//     return purchaseId;
//   } catch (err) {
//     await conn.rollback();
//     conn.release();
//     console.error("Purchase creation error:", err);
//     throw err;
//   }
// },


//   // ✅ Get all purchases with vendor + products
//   findAll: async () => {
//     const [rows] = await db.query(`
//       SELECT 
//         p.id, p.bill_no, p.bill_date, p.total_amount, p.status,
//         v.name AS vendor_name, v.firm_name,
//         GROUP_CONCAT(pr.product_name SEPARATOR ', ') AS products
//       FROM purchases p
//       JOIN vendors v ON p.vendor_id = v.id
//       LEFT JOIN purchase_items pi ON p.id = pi.purchase_id
//       LEFT JOIN products pr ON pi.product_id = pr.id
//       GROUP BY p.id
//       ORDER BY p.id DESC
//     `);
//     return rows;
//   },

//   // ✅ Get purchase by ID with items
//   findById: async (id) => {
//     const [purchaseRows] = await db.query(
//       `SELECT p.*, v.name AS vendor_name, v.firm_name
//        FROM purchases p
//        JOIN vendors v ON p.vendor_id = v.id
//        WHERE p.id = ?`,
//       [id]
//     );

//     if (purchaseRows.length === 0) return null;
//     const purchase = purchaseRows[0];

//     const items = await PurchaseItem.findByPurchaseId(id);
//     purchase.items = items;

//     return purchase;
//   },
// };

// module.exports = Purchase;



const db = require("../config/db");
const PurchaseItem = require("./purchaseItem.model2");

const Purchase = {
  // ✅ Create Purchase + Items + Update Stock
  create: async (data) => {
    const { vendor_id, po_id, bill_no, bill_date, status, items } = data;

    if (!Array.isArray(items) || items.length === 0) {
      throw new Error("Items must be a non-empty array");
    }

    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      const formattedDate = bill_date
        ? new Date(bill_date).toISOString().split("T")[0]
        : null;

      // 1️⃣ Calculate total_amount from items
      const total_amount = items.reduce(
        (sum, i) => sum + Number(i.rate || 0) * Number(i.qty || 0),
        0
      );

      // 2️⃣ Insert purchase
      const [purchaseResult] = await conn.query(
        `INSERT INTO purchases (vendor_id, po_id, bill_no, bill_date, total_amount, status)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [vendor_id, po_id || null, bill_no, formattedDate, total_amount, status || "Active"]
      );

      const purchaseId = purchaseResult.insertId;

      // 3️⃣ Batch insert purchase items
      const values = items.map((i) => [
        purchaseId,
        i.product_id,
        i.rate,
        i.qty,
        i.unit || "PCS",
        "Active",
      ]);

      if (values.length > 0) {
        await conn.query(
          `INSERT INTO purchase_items (purchase_id, product_id, rate, qty, unit, status) VALUES ?`,
          [values]
        );

        // 4️⃣ Update product stock
        for (let i of items) {
          await conn.query(
            `UPDATE products SET qty = qty + ? WHERE id = ?`,
            [i.qty, i.product_id]
          );
        }
      }

      await conn.commit();
      conn.release();
      return purchaseId;
    } catch (err) {
      await conn.rollback();
      conn.release();
      console.error("Purchase creation error:", err);
      throw err;
    }
  },

  // ✅ Get all purchases with vendor + products
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

  // ✅ Get purchase by ID with items
  findById: async (id) => {
    const [purchaseRows] = await db.query(
      `SELECT p.*, v.name AS vendor_name, v.firm_name
       FROM purchases p
       JOIN vendors v ON p.vendor_id = v.id
       WHERE p.id = ?`,
      [id]
    );

    if (purchaseRows.length === 0) return null;
    const purchase = purchaseRows[0];

    const items = await PurchaseItem.findByPurchaseId(id);
    purchase.items = items;

    return purchase;
  },
};

module.exports = Purchase;
