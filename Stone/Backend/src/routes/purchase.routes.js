const express = require("express");
const PurchaseRouter = express.Router();
const purchaseController = require("../controllers/purchase.controller");

// ✅ Routes
PurchaseRouter.post("/", purchaseController.create);
PurchaseRouter.get("/", purchaseController.getAll);
PurchaseRouter.get("/:id", purchaseController.getById);

module.exports = PurchaseRouter;
