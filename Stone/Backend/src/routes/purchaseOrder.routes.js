const express = require("express");
const PurchaseOrderRouter = express.Router();
const purchaseOrderController = require("../controllers/purchaseOrder.controller");

// ✅ Create Purchase Order
PurchaseOrderRouter.post("/", purchaseOrderController.create);

// ✅ Get All Purchase Orders
PurchaseOrderRouter.get("/", purchaseOrderController.getAll);

// ✅ Get Single Purchase Order by ID
PurchaseOrderRouter.get("/:id", purchaseOrderController.getById);

// ✅ Delete Purchase Order
PurchaseOrderRouter.delete("/:id", purchaseOrderController.delete);

module.exports = PurchaseOrderRouter;
