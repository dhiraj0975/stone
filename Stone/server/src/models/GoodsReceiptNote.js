import mongoose from "mongoose";

const GoodsReceiptItemSchema = new mongoose.Schema(
  {
    product: {
      // Reference to the Product model (Raw Material)
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    receivedQuantity: {
      type: Number,
      required: true,
      min: 0.001,
    },
    unitPriceAtReceipt: {
      // Price at the time of receipt, could differ from PO
      type: Number,
      required: true,
      min: 0,
    },
    totalReceiptPrice: {
      // receivedQuantity * unitPriceAtReceipt
      type: Number,
      default: 0,
    },
    // Optional: qualityCheck: { type: String, enum: ['Pass', 'Fail'], default: 'Pass' },
    // Optional: remarks: { type: String, trim: true }
  },
  { _id: false }
);

const GoodsReceiptNoteSchema = new mongoose.Schema(
  {
    grnNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    purchaseOrder: {
      // Link to the PO it's fulfilling
      type: mongoose.Schema.Types.ObjectId,
      ref: "PurchaseOrder",
      required: false, // Not required if it's a direct receipt without a PO
      index: true,
    },
    vendor: {
      // Redundant if PO is required, but good for direct receipts or quick lookup
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    receivedBy: {
      // User who recorded the GRN
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // You'll need a User model for authentication later
      required: true,
    },
    receiptDate: {
      type: Date,
      default: Date.now,
    },
    items: [GoodsReceiptItemSchema],
    totalReceivedAmount: {
      // Sum of all item prices received
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Pending QA", "Received", "Cancelled", "Returned"],
      default: "Received",
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to calculate totalReceivedAmount
GoodsReceiptNoteSchema.pre("save", function (next) {
  let total = 0;
  this.items.forEach((item) => {
    item.totalReceiptPrice = item.receivedQuantity * item.unitPriceAtReceipt;
    total += item.totalReceiptPrice;
  });
  this.totalReceivedAmount = total;
  next();
});

const GoodsReceiptNote = mongoose.model(
  "GoodsReceiptNote",
  GoodsReceiptNoteSchema
);

export default GoodsReceiptNote;
//
