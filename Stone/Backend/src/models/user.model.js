const db = require("../config/db.js");

const findByEmail = (email, callback) => {
  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) return callback(err, null);
    callback(null, results[0]);
  });
};

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

const createUser = (name, email, hashedPassword, role, callback) => {
  db.query(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
    [name, email, hashedPassword, role],
    (err, result) => {
      if (err) return callback(err, null);
      callback(null, result.insertId);
    }
  );
};

module.exports = { findByEmail, findById, createUser };
