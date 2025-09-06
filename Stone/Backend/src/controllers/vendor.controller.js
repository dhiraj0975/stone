const VendorModel = require("../models/vendor.model");

// Create
// Create
exports.createVendor = (req, res) => {
  const { name, mobile_no, firm_name, gst, balance, status, email } = req.body;

  if (!name || !mobile_no || !firm_name) {
    return res
      .status(400)
      .json({ error: "Name, Mobile No, and Firm Name are required" });
  }

  VendorModel.createVendor(req.body, (err, result) => {
    if (err) {
      console.error("Create Vendor Error:", err);
      return res
        .status(500)
        .json({ error: err.sqlMessage || "Database error" });
    }

    // ✅ Naya vendor fetch karo taaki created_at bhi mile
    VendorModel.getVendorById(result.insertId, (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      if (rows.length === 0) {
        return res
          .status(404)
          .json({ error: "Vendor not found after insert" });
      }

      res.status(201).json(rows[0]); // pura vendor object with created_at
    });
  });
};




// Get All
exports.getVendors = (req, res) => {
  VendorModel.getVendors((err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// Get by ID
exports.getVendorById = (req, res) => {
  VendorModel.getVendorById(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.length === 0) return res.status(404).json({ message: "Vendor not found" });
    res.json(result[0]);
  });
};

// Update
exports.updateVendor = (req, res) => {
  VendorModel.updateVendor(req.params.id, req.body, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Vendor updated successfully" });
  });
};

// Delete
exports.deleteVendor = (req, res) => {
  VendorModel.deleteVendor(req.params.id, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Vendor deleted successfully" });
  });
};
