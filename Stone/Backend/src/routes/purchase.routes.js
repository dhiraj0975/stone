const express = require("express");
const PurchaseRouter = express.Router();
const purchaseController = require("../controllers/purchase.controller.js");

// ✅ Routes
PurchaseRouter.post("/", purchaseController.create);
PurchaseRouter.get("/", purchaseController.getAll);
PurchaseRouter.get("/:id", purchaseController.getById);

module.exports = PurchaseRouter;
