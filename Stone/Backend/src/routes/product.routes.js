const express = require("express");
const  { fetchProducts, fetchProduct, addProduct, editProduct, removeProduct } = require( "../controllers/product.controller");

const productRouter = express.Router();

productRouter.get("/", fetchProducts);
productRouter.get("/:id", fetchProduct);
productRouter.post("/", addProduct);
productRouter.put("/:id", editProduct);
productRouter.delete("/:id", removeProduct);

module.exports = productRouter;
