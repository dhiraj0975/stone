//const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require("../models/product.models");
const db = require("../config/db"); // for category validation
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
// POST create product
const addProduct = async (req, res) => {
  try {
    const { category_id } = req.body;

    // Category ID check
    if (!category_id) {
      return res.status(400).json({ success: false, message: "Category ID is required" });
    }

    // Category validation
    const [category] = await db.query(
      "SELECT id FROM categories WHERE id = ?", 
      [category_id]
    );

    if (!category || category.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid category_id" });
    }

    // Create product
    const result = await createProduct(req.body);

    // Check if insert succeeded
    if (!result.insertId) {
      return res.status(500).json({ success: false, message: "Failed to create product" });
    }

    // Fetch the newly created product
    const newProduct = await getProductById(result.insertId);

    res.status(201).json({ success: true, message: "Product created", data: newProduct });

  } catch (err) {
    console.error("Add Product Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT update product
const editProduct = async (req, res) => {
  try {
    const productId = parseInt(req.params.id, 10);
    if (isNaN(productId)) return res.status(400).json({ success: false, message: "Invalid product ID" });

    const existingProduct = await getProductById(productId);
    if (!existingProduct) return res.status(404).json({ success: false, message: "Product not found" });

    const {
      category_id, product_name, mrp, purchase_rate, sales_rate, qty, min_qty, remark, weight_per_packet, status
    } = req.body;

    const updatedData = {
      product_name: product_name ?? existingProduct.product_name,
      category_id: category_id ?? existingProduct.category_id,
      mrp: mrp !== undefined ? parseFloat(mrp) : existingProduct.mrp,
      purchase_rate: purchase_rate !== undefined ? parseFloat(purchase_rate) : existingProduct.purchase_rate,
      sales_rate: sales_rate !== undefined ? parseFloat(sales_rate) : existingProduct.sales_rate,
      qty: qty !== undefined ? parseInt(qty, 10) : existingProduct.qty,
      min_qty: min_qty !== undefined ? parseInt(min_qty, 10) : existingProduct.min_qty,
      remark: remark ?? existingProduct.remark,
      weight_per_packet: weight_per_packet ?? existingProduct.weight_per_packet,
      status: status ?? existingProduct.status
    };

    await updateProduct(productId, updatedData);

    // Fetch updated product
    const updatedProduct = await getProductById(productId);

    res.status(200).json({ success: true, message: "Product updated", data: updatedProduct });

  } catch (err) {
    console.error("Update Product Error:", err);
    res.status(500).json({ success: false, message: err.message });
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