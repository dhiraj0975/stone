const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");


const app = express();

// ===============  CORS Configuration =================

// Allowed origins (local + env)
const allowedOrigins = [
  process.env.FRONTEND_URL,   // e.g. https://myapp.com
  "http://localhost:3000",    // React local dev
  "http://127.0.0.1:3000"     // Another localhost option
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like Postman or server-to-server)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS: " + origin));
      }
    },
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true
  })
);

// ===============  Middleware =================
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

// ===============  Routes =================
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/vendors", require("./routes/vendor.routes"));
app.use("/api/products", require("./routes/product.routes"));
app.use("/api/purchase-orders", require("./routes/purchaseOrder.routes"));

// Export app
module.exports = app;
