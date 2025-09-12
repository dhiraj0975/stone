const mysql = require("mysql2/promise");

// Create pool using environment variables with defaults
const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  port: process.env.DB_PORT || 3307,
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "stone_sortwork",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// 🔧 Optional: Immediately test the DB connection
(async () => {
  try {
    const connection = await db.getConnection();
    await connection.ping(); // ✅ Ping to confirm it's alive
    console.log("MySQL Connection Successful!");
    connection.release();
  } catch (err) {
    console.error("MySQL Connection Failed:", err.message);
    process.exit(1); // Exit if DB connection fails (optional)
  }
})();

module.exports = db;
