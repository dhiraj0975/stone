const db = require("../config/db");

// Create Vendor
const createVendor = async (vendorData) => {
  const sql = `
    INSERT INTO vendors (name, mobile_no, firm_name, gst, balance, status, email)
    VALUES (?, ?, ?, ?, ?, ?, ?)`;

  const [result] = await db.query(sql, [
    vendorData.name,
    vendorData.mobile_no,
    vendorData.firm_name,
    vendorData.gst,
    vendorData.balance,
    vendorData.status,
    vendorData.email,
  ]);

  return result;
};

// Get All Vendors
const getVendors = async () => {
  const [rows] = await db.query("SELECT * FROM vendors ORDER BY id DESC");
  return rows;
};

// Get Vendor by ID
const getVendorById = async (id) => {
  const [rows] = await db.query("SELECT * FROM vendors WHERE id = ?", [id]);
  return rows;
};

// Update Vendor
const updateVendor = async (id, vendorData) => {
  const sql = `
    UPDATE vendors SET
    name = ?, mobile_no = ?, firm_name = ?, gst = ?,
    balance = ?, status = ?, email = ? WHERE id = ?`;

  const [result] = await db.query(sql, [
    vendorData.name,
    vendorData.mobile_no,
    vendorData.firm_name,
    vendorData.gst,
    vendorData.balance,
    vendorData.status,
    vendorData.email,
    id,
  ]);

  return result;
};

// Delete Vendor
const deleteVendor = async (id) => {
  const [result] = await db.query("DELETE FROM vendors WHERE id = ?", [id]);
  return result;
};

module.exports = {
  createVendor,
  getVendors,
  getVendorById,
  updateVendor,
  deleteVendor,
};
