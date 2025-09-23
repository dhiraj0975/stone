const express = require("express");
const PurchaseOrderRouter = express.Router();
const purchaseOrderController = require("../controllers/purchaseOrder.controller.js");

// ✅ Create Purchase Order
PurchaseOrderRouter.post("/", purchaseOrderController.create);

// ✅ Get All Purchase Orders
PurchaseOrderRouter.get("/", purchaseOrderController.getAll);

// ✅ Get Single Purchase Order by ID
PurchaseOrderRouter.get("/:id", purchaseOrderController.getById);

// ✅ Delete Purchase Order
PurchaseOrderRouter.delete("/:id", purchaseOrderController.delete);
// ✅ Update Purchase Order
PurchaseOrderRouter.put("/:id", purchaseOrderController.update); //

PurchaseOrderRouter.get("/:id/invoice", purchaseOrderController.getInvoice); // ✅ NEW


module.exports = PurchaseOrderRouter;
