const express = require("express");
const { fetchPurchaseOrders, fetchPurchaseOrder, addPurchaseOrder, editPurchaseOrder, removePurchaseOrder } = require("../controllers/purchaseOrder.controller");
const PurchaseOrderRouter = express.Router();

PurchaseOrderRouter.get("/", fetchPurchaseOrders);
PurchaseOrderRouter.get("/:id", fetchPurchaseOrder);
PurchaseOrderRouter.post("/", addPurchaseOrder);
PurchaseOrderRouter.put("/:id", editPurchaseOrder);
PurchaseOrderRouter.delete("/:id", removePurchaseOrder);

module.exports = PurchaseOrderRouter;
