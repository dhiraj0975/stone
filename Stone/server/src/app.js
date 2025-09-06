import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";

//Import
import ErrorHandler from "./middleware/ErrorMiddleware.js";

// Import Routes
import authRoutes from "./routes/auth.routes.js";
import vendorRoutes from "./routes/vendor.routes.js";
import clientRoutes from "./routes/client.routes.js";
import productRoutes from "./routes/product.routes.js";
import purchaseRoutes from "./routes/purchase.routes.js";
import grnRoutes from "./routes/grn.routes.js";
import inventoryRoutes from "./routes/inventory.routes.js";
import Config from "./config/env.config.js";

// Mount Routers
const app = express();

//middleware
app.use(
  cors({
    origin: Config.CLIENT_URL, // Allow requests from the client URL
    credentials: true, // Allow cookies to be sent
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

//routes
app.use("/api/auth", authRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/products", productRoutes);
app.use("/api/purchase-orders", purchaseRoutes); // Add Purchase Order routes
app.use("/api/grns", grnRoutes);
app.use("/api/inventory", inventoryRoutes);

// Error handling middleware
app.use(ErrorHandler);
// 404 handler
app.use((req, res, next) => {
  res.status(404).send(`REQ URL Not Found: ${req.originalUrl}`);
});

export default app;
