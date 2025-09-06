import mongoose from "mongoose";

const PurchaseOrderItemSchema = new mongoose.Schema(
  {
    product: {
      // Reference to the Product model (Raw Material)
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0.001, // Must be a positive quantity
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0, // Price cannot be negative
    },
    totalItemPrice: {
      // quantity * unitPrice
      type: Number,
      default: 0,
    },
  },
  { _id: false }
); // Don't create a separate ID for subdocuments

const PurchaseOrderSchema = new mongoose.Schema(
  {
    poNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    vendor: {
      // Reference to the Vendor model
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    items: [PurchaseOrderItemSchema], // Array of raw materials in the PO
    orderDate: {
      type: Date,
      default: Date.now,
    },
    deliveryDate: {
      type: Date,
      required: true, // Expected delivery date
    },
    status: {
      type: String,
      enum: [
        "Draft",
        "Sent",
        "Received",
        "Partially Received",
        "Closed",
        "Cancelled",
      ],
      default: "Draft",
    },
    totalAmount: {
      // Sum of all item prices
      type: Number,
      default: 0,
    },
    committedPaymentDate: {
      // Date by which payment is committed
      type: Date,
      required: false, // Optional, can be set later
    },
    isPaid: {
      type: Boolean,
      default: false, // Tracks if the PO is fully paid
    },
    paidAmount: {
      type: Number,
      default: 0,
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

// Pre-save hook to calculate totalAmount and totalItemPrice
PurchaseOrderSchema.pre("save", function (next) {
  let total = 0;
  this.items.forEach((item) => {
    item.totalItemPrice = item.quantity * item.unitPrice;
    total += item.totalItemPrice;
  });
  this.totalAmount = total;
  next();
});

const PurchaseOrder = mongoose.model("PurchaseOrder", PurchaseOrderSchema);

export default PurchaseOrder;
