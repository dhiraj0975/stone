//const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require("../models/product.models");
//const db = require("../config/db"); // for category validation
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require("../models/product.models");

// GET all products
const fetchProducts = async (req, res) => {
  try {
    const products = await getProducts();
    res.status(200).json({ success: true, data: products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};


// GET single product by ID
const fetchProduct = async (req, res) => {
  try {
    const product = await getProductById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.status(200).json({ success: true, data: product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// POST create product
const addProduct = async (req, res) => {
  try {
    const { category_id } = req.body;

    // Validate category_id
    const [category] = await db.query("SELECT id FROM categories WHERE id = ?", [category_id]);
    if (category.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid category_id" });
    }

    const result = await createProduct(req.body);
    res.status(201).json({ success: true, message: "Product created", id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// PUT update product
const editProduct = async (req, res) => {
  try {
    const { category_id } = req.body;

    // Validate category_id
    if (category_id) {
      const [category] = await db.query("SELECT id FROM categories WHERE id = ?", [category_id]);
      if (category.length === 0) {
        return res.status(400).json({ success: false, message: "Invalid category_id" });
      }
    }

    await updateProduct(req.params.id, req.body);
    res.status(200).json({ success: true, message: "Product updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// DELETE product
const removeProduct = async (req, res) => {
  try {
    await deleteProduct(req.params.id);
    res.status(200).json({ success: true, message: "Product deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  fetchProducts,
  fetchProduct,
  addProduct,
  editProduct,
  removeProduct
};