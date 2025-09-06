import express from "express";

import {
  getGRNs,
  getGRNById,
  createGRN,
  updateGRN,
  deleteGRN,
} from "../controllers/grnController.js";

const router = express.Router();

router.route("/").get(getGRNs).post(createGRN);

router.route("/:id").get(getGRNById).put(updateGRN).delete(deleteGRN);

export default router;
