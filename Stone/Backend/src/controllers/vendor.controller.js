const VendorModel = require("../models/vendor.model");

// Create Vendor
exports.createVendor = async (req, res) => {
  const { name, mobile_no, firm_name, gst, balance, status, email } = req.body;

  if (!name || !mobile_no || !firm_name) {
    return res
      .status(400)
      .json({ error: "Name, Mobile No, and Firm Name are required" });
  }

  try {
    const result = await VendorModel.createVendor(req.body);
    const vendors = await VendorModel.getVendorById(result.insertId);

    if (vendors.length === 0) {
      return res.status(404).json({ error: "Vendor not found after insert" });
    }

    res.status(201).json(vendors[0]);
  } catch (err) {
    console.error("Create Vendor Error:", err);
    res.status(500).json({ error: err.message || "Database error" });
  }
};

// Get All Vendors
exports.getVendors = async (req, res) => {
  try {
    const vendors = await VendorModel.getVendors();
    res.json(vendors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Vendor by ID
exports.getVendorById = async (req, res) => {
  try {
    const vendors = await VendorModel.getVendorById(req.params.id);
    if (vendors.length === 0) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    res.json(vendors[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Vendor
exports.updateVendor = async (req, res) => {
  try {
    await VendorModel.updateVendor(req.params.id, req.body);
    res.json({ message: "Vendor updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Vendor
exports.deleteVendor = async (req, res) => {
  try {
    await VendorModel.deleteVendor(req.params.id);
    res.json({ message: "Vendor deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
