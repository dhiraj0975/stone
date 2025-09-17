const db = require("../config/db.js");

// Find user by email
const findByEmail = (email, callback) => {
  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) return callback(err, null);
    callback(null, results[0]); // ek hi user return karega
  });
};

// Find user by ID
const findById = (id, callback) => {
  db.query(
    "SELECT id, name, email, role, created_at FROM users WHERE id = ?",
    [id],
    (err, results) => {
      if (err) return callback(err, null);
      callback(null, results[0]);
    }
  );
};

// Create new user
const createUser = (name, email, hashedPassword, role, callback) => {
  db.query(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
    [name, email, hashedPassword, role],
    (err, result) => {
      if (err) return callback(err, null);
      callback(null, result.insertId); // naya user ka id return karega
    }
  );
};

module.exports = {
  findByEmail,
  findById,
  createUser,
};
