import mongoose from "mongoose";

const InventorySchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      unique: true, // Ensures only one inventory record per product
    },
    currentStock: {
      type: Number,
      required: true,
      default: 0,
      min: 0, // Stock cannot be negative
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    // Optional: Add fields like reorder level, maximum stock level, warehouse location if needed later
    // reorderLevel: { type: Number, default: 0 },
    // maxStockLevel: { type: Number, default: 0 },
    // location: { type: String, trim: true }
  },
  {
    timestamps: true, // Tracks createdAt and updatedAt
  }
);

const Inventory = mongoose.model("Inventory", InventorySchema);

export default Inventory;
