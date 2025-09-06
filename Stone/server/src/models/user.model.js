import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Config from "../config/env.config.js";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    // enum: ["admin", "store", "production"],
    enum: [
      "Admin",
      "Inventory Manager",
      "Production User",
      "Sales User",
      "Viewer",
    ],
    default: "Viewer",
    // default: "store",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign({ _id: this._id }, Config.JWT_SECRET, {
    expiresIn: "15m",
  });

  return token;
};

const User = mongoose.model("User", userSchema);
export default User;
