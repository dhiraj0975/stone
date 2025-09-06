import express from "express";

import {
  getVendors,
  getVendorById,
  createVendor,
  updateVendor,
  deleteVendor,
} from "../controllers/vendorController.js";

const router = express.Router();

router.route("/").get(getVendors).post(createVendor);

router.route("/:id").get(getVendorById).put(updateVendor).delete(deleteVendor);

export default router;
