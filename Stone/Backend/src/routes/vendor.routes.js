const express = require("express");
const router = express.Router();
const VendorController = require("../controllers/vendor.controller");

// Routes
router.post("/", VendorController.createVendor);
router.get("/", VendorController.getVendors);
router.get("/:id", VendorController.getVendorById);
router.put("/:id", VendorController.updateVendor);
router.delete("/:id", VendorController.deleteVendor);

module.exports = router;
