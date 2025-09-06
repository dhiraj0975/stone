import mongoose from "mongoose";

const InventoryTransactionSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    transactionType: {
      // e.g., 'Inward from GRN', 'Outward for Production', 'Outward for Sales', 'Adjustment (Add)', 'Adjustment (Subtract)'
      type: String,
      required: true,
      enum: [
        "Inward from GRN",
        "Outward for Production",
        "Outward for Sales",
        "Adjustment (Add)",
        "Adjustment (Subtract)",
        "Initial Stock",
      ],
    },
    quantity: {
      // The quantity of this specific transaction
      type: Number,
      required: true,
      min: 0.001, // Transaction quantity must be positive
    },
    transactionDate: {
      type: Date,
      default: Date.now,
    },
    referenceDocument: {
      // ID of the document that caused this transaction (e.g., GRN ID, Production Order ID)
      type: mongoose.Schema.Types.ObjectId,
      required: false, // Not all transactions might have a direct document (e.g., manual adjustment)
    },
    referenceDocumentType: {
      // e.g., 'GRN', 'ProductionOrder', 'SalesOrder', 'Manual'
      type: String,
      required: false,
      enum: ["GRN", "PurchaseOrder", "ProductionOrder", "SalesOrder", "Manual"], // Add more as modules come online
    },
    recordedBy: {
      // User who initiated the transaction
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Requires a User model
      required: false, // Optional for now, but recommended with auth
    },
    notes: {
      type: String,
      trim: true,
    },
    currentStockAfterTransaction: {
      // Snapshot of stock after this transaction for easy audit
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const InventoryTransaction = mongoose.model(
  "InventoryTransaction",
  InventoryTransactionSchema
);

export default InventoryTransaction;
