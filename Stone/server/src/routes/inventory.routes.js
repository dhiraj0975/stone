import express from "express";

import {
  getAllInventory,
  getProductInventory,
  getAllTransactions,
  getProductTransactions,
  adjustInventory, // For manual adjustments / initial stock
} from "../controllers/inventoryController.js";

const router = express.Router();

router.route("/").get(getAllInventory); // Get all current stock levels

router.route("/transactions").get(getAllTransactions); // Get all transaction history

router.route("/:productId").get(getProductInventory); // Get specific product's current stock

router.route("/:productId/transactions").get(getProductTransactions); // Get specific product's transaction history

router.route("/adjust").post(adjustInventory); // Manual stock adjustment endpoint

export default router;
