const db = require("../config/db");

// Create Vendor
const createVendor = (vendorData, callback) => {
  const sql = `INSERT INTO vendors 
    (name, mobile_no, firm_name, gst, balance, status, email) 
    VALUES (?, ?, ?, ?, ?, ?, ?)`;

  db.query(sql, [
    vendorData.name,
    vendorData.mobile_no,
    vendorData.firm_name,
    vendorData.gst,
    vendorData.balance,
    vendorData.status,
    vendorData.email
  ], callback);
};

// Get All Vendors
const getVendors = (callback) => {
  db.query("SELECT * FROM vendors ORDER BY id DESC", callback);
};

// Get Vendor by ID
const getVendorById = (id, callback) => {
  db.query("SELECT * FROM vendors WHERE id = ?", [id], callback);
};

// Update Vendor
const updateVendor = (id, vendorData, callback) => {
  const sql = `UPDATE vendors SET 
    name = ?, mobile_no = ?, firm_name = ?, gst = ?, 
    balance = ?, status = ?, email = ? WHERE id = ?`;

  db.query(sql, [
    vendorData.name,
    vendorData.mobile_no,
    vendorData.firm_name,
    vendorData.gst,
    vendorData.balance,
    vendorData.status,
    vendorData.email,
    id
  ], callback);
};

// Delete Vendor
const deleteVendor = (id, callback) => {
  db.query("DELETE FROM vendors WHERE id = ?", [id], callback);
};

module.exports = {
  createVendor,
  getVendors,
  getVendorById,
  updateVendor,
  deleteVendor
};
    