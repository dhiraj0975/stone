import Inventory from "../models/Inventory.js";
import InventoryTransaction from "../models/InventoryTransaction.js";
import Product from "../models/Product.js";
import GoodsReceiptNote from "../models/GoodsReceiptNote.js"; // To update GRN status and link

// Helper function to update inventory and create transaction
const updateInventoryAndCreateTransaction = async (
  productId,
  quantity,
  transactionType,
  referenceDocument,
  referenceDocumentType,
  recordedBy,
  notes = ""
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let inventory = await Inventory.findOne({ product: productId }).session(
      session
    );

    if (!inventory) {
      // Create initial inventory record if it doesn't exist
      inventory = await Inventory.create(
        [{ product: productId, currentStock: 0 }],
        { session }
      );
      inventory = inventory[0]; // create returns an array
    }

    let newStock;
    if (
      transactionType.includes("Inward") ||
      transactionType.includes("Add") ||
      transactionType.includes("Initial")
    ) {
      newStock = inventory.currentStock + quantity;
    } else if (
      transactionType.includes("Outward") ||
      transactionType.includes("Subtract")
    ) {
      newStock = inventory.currentStock - quantity;
      if (newStock < 0) {
        throw new Error(
          `Insufficient stock for product ${productId}. Available: ${inventory.currentStock}, Requested: ${quantity}`
        );
      }
    } else {
      throw new Error("Invalid transaction type for stock calculation.");
    }

    inventory.currentStock = newStock;
    inventory.lastUpdated = Date.now();
    await inventory.save({ session });

    const transaction = await InventoryTransaction.create(
      [
        {
          product: productId,
          quantity: quantity,
          transactionType: transactionType,
          referenceDocument: referenceDocument,
          referenceDocumentType: referenceDocumentType,
          recordedBy: recordedBy,
          notes: notes,
          currentStockAfterTransaction: newStock,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    return { inventory, transaction: transaction[0] };
  } catch (error) {
    await session.abortTransaction();
    throw error; // Re-throw the error to be caught by the calling function
  } finally {
    session.endSession();
  }
};

// @desc    Get all inventory items
// @route   GET /api/inventory
export const getAllInventory = async (req, res) => {
  try {
    const inventoryItems = await Inventory.find().populate(
      "product",
      "name itemCode unitOfMeasurement type"
    );
    res.status(200).json({ success: true, data: inventoryItems });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get inventory for a specific product
// @route   GET /api/inventory/:productId
export const getProductInventory = async (req, res) => {
  try {
    const inventory = await Inventory.findOne({
      product: req.params.productId,
    }).populate("product", "name itemCode unitOfMeasurement type");
    if (!inventory) {
      return res.status(404).json({
        success: false,
        error: "Inventory record not found for this product.",
      });
    }
    res.status(200).json({ success: true, data: inventory });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get all inventory transactions
// @route   GET /api/inventory/transactions
export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await InventoryTransaction.find()
      .populate("product", "name itemCode unitOfMeasurement")
      .populate("recordedBy", "username") // Assuming 'username' field in User model
      .sort({ transactionDate: -1 });
    res.status(200).json({ success: true, data: transactions });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get transactions for a specific product
// @route   GET /api/inventory/:productId/transactions
export const getProductTransactions = async (req, res) => {
  try {
    const transactions = await InventoryTransaction.find({
      product: req.params.productId,
    })
      .populate("product", "name itemCode unitOfMeasurement")
      .populate("recordedBy", "username")
      .sort({ transactionDate: -1 });
    res.status(200).json({ success: true, data: transactions });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Initialize or adjust stock for a product (e.g., initial setup, manual corrections)
// @route   POST /api/inventory/adjust
export const adjustInventory = async (req, res) => {
  try {
    const { productId, quantity, transactionType, notes, recordedBy } =
      req.body; // recordedBy will come from auth later

    if (
      !productId ||
      quantity === undefined ||
      !["Adjustment (Add)", "Adjustment (Subtract)", "Initial Stock"].includes(
        transactionType
      )
    ) {
      return res.status(400).json({
        success: false,
        error:
          "Product ID, quantity, and a valid adjustment type are required.",
      });
    }
    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        error: "Quantity must be positive for adjustment.",
      });
    }

    const productExists = await Product.findById(productId);
    if (!productExists) {
      return res
        .status(404)
        .json({ success: false, error: "Product not found." });
    }

    const { inventory, transaction } =
      await updateInventoryAndCreateTransaction(
        productId,
        quantity,
        transactionType,
        null, // No specific document reference for manual adjustments
        "Manual",
        recordedBy || "60d0fe4f5311236168a109ca", // Placeholder User ID (REPLACE THIS WITH AUTH)
        notes
      );

    res.status(200).json({ success: true, data: { inventory, transaction } });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Important: Intercept GRN creation to update inventory
// This function needs to be called from the GRN controller after a GRN is successfully created
export const handleGrnInward = async (grnId, items, recordedBy) => {
  try {
    for (const item of items) {
      await updateInventoryAndCreateTransaction(
        item.product,
        item.receivedQuantity,
        "Inward from GRN",
        grnId,
        "GRN",
        recordedBy // The user who created the GRN
      );
    }
    // Optionally update the GRN status to 'Received' or 'Completed' here if it wasn't already
    await GoodsReceiptNote.findByIdAndUpdate(grnId, { status: "Received" });

    console.log(`Inventory updated for GRN ${grnId}`);
  } catch (error) {
    console.error(`Error updating inventory for GRN ${grnId}:`, error);
    // In a real system, you might want to log this failure, alert admins,
    // or have a retry mechanism. For now, we'll just log.
  }
};
