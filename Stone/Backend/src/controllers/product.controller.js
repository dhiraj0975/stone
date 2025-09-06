const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require("../models/product.models");


// GET all
 const fetchProducts = async (req, res) => {
  try {
    const products = await getProducts();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET by ID
 const fetchProduct = async (req, res) => {
  try {
    const product = await getProductById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST create
 const addProduct = async (req, res) => {
  try {
    const result = await createProduct(req.body);
    res.json({ message: "Product created", id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT update
 const editProduct = async (req, res) => {
  try {
    await updateProduct(req.params.id, req.body);
    res.json({ message: "Product updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE
 const removeProduct = async (req, res) => {
  try {
    await deleteProduct(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = {
  fetchProducts,
  fetchProduct,
  addProduct,
  editProduct,
  removeProduct
};
