const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");


const app = express();

// ===============  CORS Configuration =================

// Allowed origins (local + env)
const allowedOrigins = [
  process.env.FRONTEND_URL,   // e.g. https://myapp.com
  "",
  ""    // React local dev
    // Another localhost option
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.filter(Boolean).includes(origin)
      ) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS: " + origin));
    },
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// Note: cors() will automatically handle OPTIONS preflight for configured routes

// ===============  Middleware =================
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

// ===============  Routes =================
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/vendors", require("./routes/vendor.routes"));
app.use("/api/products", require("./routes/product.routes"));
app.use("/api/purchase-orders", require("./routes/purchaseOrder.routes"));
app.use("/api/categories", require("./routes/category.routes"));

// Export app
module.exports = app;
