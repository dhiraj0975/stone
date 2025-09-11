const {
  getPurchaseOrders,
  getPurchaseOrderById,
  createPurchaseOrder,
  updatePurchaseOrder,
  deletePurchaseOrder,
} = require("../models/purchaseOrder.model");

// GET all POs
const fetchPurchaseOrders = async (req, res) => {
  try {
    const orders = await getPurchaseOrders();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET single PO
const fetchPurchaseOrder = async (req, res) => {
  try {
    const order = await getPurchaseOrderById(req.params.id);
    if (!order) return res.status(404).json({ message: "Purchase Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE PO
const addPurchaseOrder = async (req, res) => {
  try {
    const result = await createPurchaseOrder(req.body);
    res.status(201).json({ message: "Purchase Order created", id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE PO
const editPurchaseOrder = async (req, res) => {
  try {
    await updatePurchaseOrder(req.params.id, req.body);
    res.json({ message: "Purchase Order updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE PO
const removePurchaseOrder = async (req, res) => {
  try {
    await deletePurchaseOrder(req.params.id);
    res.json({ message: "Purchase Order deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  fetchPurchaseOrders,
  fetchPurchaseOrder,
  addPurchaseOrder,
  editPurchaseOrder,
  removePurchaseOrder,
};
