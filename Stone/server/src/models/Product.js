import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    itemCode: {
      type: String,
      required: [true, "Item code is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
    },
    type: {
      // Raw Material, Finished Good, Fuel, Equipment Part
      type: String,
      required: [true, "Item type is required"],
      enum: ["Raw Material", "Finished Good", "Fuel", "Equipment Part"], // Enforce specific types
      trim: true,
    },
    unitOfMeasurement: {
      // e.g., Kg, Liters, Pieces, Meters
      type: String,
      required: [true, "Unit of Measurement (UOM) is required"],
      trim: true,
    },
    hsnSacCode: {
      // Harmonized System of Nomenclature / Service Accounting Code
      type: String,
      trim: true,
      maxLength: 8, // Typical HSN/SAC code length
    },
    taxRate: {
      // GST percentage (e.g., 5, 12, 18, 28)
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    description: {
      type: String,
      trim: true,
    },
    // isActive: {
    //   type: Boolean,
    //   default: true,
    // },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Compound unique index for name and type if needed, but itemCode is usually unique enough
// ProductSchema.index({ name: 1, type: 1 }, { unique: true });

const Product = mongoose.model("Product", ProductSchema);

export default Product;
