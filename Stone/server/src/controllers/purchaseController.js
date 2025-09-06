

import PurchaseOrder from "../models/PurchaseOrder.js";
import Vendor from "../models/Vendor.js";
import Product from "../models/Product.js";

// @desc    Get all Purchase Orders
// @route   GET /api/purchase-orders
export const getPurchaseOrders = async (req, res) => {
  try {
    const purchaseOrders = await PurchaseOrder.find()
      .populate("vendor", "name") // Populate vendor name only
      .populate("items.product", "name itemCode unitOfMeasurement") // Populate product details for each item
      .sort({ orderDate: -1 });
    res.status(200).json({ success: true, data: purchaseOrders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get single Purchase Order by ID
// @route   GET /api/purchase-orders/:id
export const getPurchaseOrderById = async (req, res) => {
  try {
    const po = await PurchaseOrder.findById(req.params.id)
      .populate("vendor", "name")
      .populate("items.product", "name itemCode unitOfMeasurement");
    if (!po) {
      return res
        .status(404)
        .json({ success: false, error: "Purchase Order not found" });
    }
    res.status(200).json({ success: true, data: po });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Create new Purchase Order
// @route   POST /api/purchase-orders
export const createPurchaseOrder = async (req, res) => {
  try {
    const {
      vendor,
      items,
      deliveryDate,
      poNumber,
      committedPaymentDate,
      notes,
    } = req.body;

    // Basic validation for vendor and items
    if (!vendor || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Vendor and at least one item are required.",
      });
    }

    // Validate vendor exists
    const existingVendor = await Vendor.findById(vendor);
    if (!existingVendor) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid Vendor ID." });
    }

    // Validate products and check type (must be raw material for POs)
    for (let i = 0; i < items.length; i++) {
      const product = await Product.findById(items[i].product);
      if (!product) {
        return res.status(400).json({
          success: false,
          error: `Product ID ${items[i].product} not found.`,
        });
      }
      if (product.type !== "Raw Material") {
        return res.status(400).json({
          success: false,
          error: `Product '${product.name}' is not a Raw Material. Only Raw Materials can be ordered.`,
        });
      }
    }

    const po = await PurchaseOrder.create({
      poNumber,
      vendor,
      items,
      deliveryDate,
      committedPaymentDate,
      notes,
    });
    res.status(201).json({ success: true, data: po });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        error: `PO Number '${req.body.poNumber}' already exists.`,
      });
    }
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((val) => val.message);
      return res
        .status(400)
        .json({ success: false, error: messages.join(", ") });
    }
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Update Purchase Order
// @route   PUT /api/purchase-orders/:id
export const updatePurchaseOrder = async (req, res) => {
  try {
    const {
      vendor,
      items,
      deliveryDate,
      status,
      committedPaymentDate,
      notes,
      isPaid,
      paidAmount,
    } = req.body;

    // Basic validation for items if they are being updated
    if (items && items.length > 0) {
      for (let i = 0; i < items.length; i++) {
        const product = await Product.findById(items[i].product);
        if (!product) {
          return res.status(400).json({
            success: false,
            error: `Product ID ${items[i].product} not found.`,
          });
        }
        if (product.type !== "Raw Material") {
          return res.status(400).json({
            success: false,
            error: `Product '${product.name}' is not a Raw Material.`,
          });
        }
      }
    }

    const po = await PurchaseOrder.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("vendor", "name")
      .populate("items.product", "name itemCode unitOfMeasurement");

    if (!po) {
      return res
        .status(404)
        .json({ success: false, error: "Purchase Order not found" });
    }
    res.status(200).json({ success: true, data: po });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        error: `PO Number '${req.body.poNumber}' already exists.`,
      });
    }
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((val) => val.message);
      return res
        .status(400)
        .json({ success: false, error: messages.join(", ") });
    }
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Delete Purchase Order
// @route   DELETE /api/purchase-orders/:id
export const deletePurchaseOrder = async (req, res) => {
  try {
    const po = await PurchaseOrder.findByIdAndDelete(req.params.id);
    if (!po) {
      return res
        .status(404)
        .json({ success: false, error: "Purchase Order not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Purchase Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
