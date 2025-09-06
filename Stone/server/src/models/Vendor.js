import mongoose from "mongoose";

const VendorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Vendor name is required"],
      trim: true,
      unique: true, // Ensure unique vendor names
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true, // Allows null values to be unique
    },
    contact: {
      type: String,
      trim: true,
    },
    gstin: {
      type: String,
      trim: true,
      uppercase: true,
      unique: true,
      sparse: true, // Allows null values to be unique
    },
    paymentTerms: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

// Optional: Add pre-save hook for validation or other logic
VendorSchema.pre("save", async function (next) {
  if (this.email === "") this.email = undefined; // Convert empty string to undefined for sparse unique
  if (this.gstin === "") this.gstin = undefined;
  next();
});

const Vendor = mongoose.model("Vendor", VendorSchema);
export default Vendor;
