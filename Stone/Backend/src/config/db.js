const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  port: process.env.DB_PORT || 3306,
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "stone_sortwork",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ✅ Test connection immediately
(async () => {
  try {
    const connection = await db.getConnection();
    console.log("MySQL Connection Successful!");
    connection.release();
  } catch (err) {
    console.error("MySQL Connection Failed:", err.message);
  }
})();

module.exports = db;
