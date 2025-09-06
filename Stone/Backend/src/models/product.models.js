const db = require("../config/db");

// Get all products
 const getProducts = async () => {
  const [rows] = await db.query("SELECT * FROM products");
  return rows;
};

// Get single product
 const getProductById = async (id) => {
  const [rows] = await db.query("SELECT * FROM products WHERE id = ?", [id]);
  return rows[0];
};

// Create product
 const createProduct = async (data) => {
  const { product_name, mrp, purchase_rate, sales_rate, qty, min_qty, remark, weight_per_packet, status } = data;
  const [result] = await db.query(
    "INSERT INTO products (product_name, mrp, purchase_rate, sales_rate, qty, min_qty, remark, weight_per_packet, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [product_name, mrp, purchase_rate, sales_rate, qty, min_qty, remark, weight_per_packet, status || "Active"]
  );
  return result;
};

// Update product
 const updateProduct = async (id, data) => {
  const { product_name, mrp, purchase_rate, sales_rate, qty, min_qty, remark, weight_per_packet, status } = data;
  const [result] = await db.query(
    "UPDATE products SET product_name=?, mrp=?, purchase_rate=?, sales_rate=?, qty=?, min_qty=?, remark=?, weight_per_packet=?, status=? WHERE id=?",
    [product_name, mrp, purchase_rate, sales_rate, qty, min_qty, remark, weight_per_packet, status, id]
  );
  return result;
};

// Delete product
 const deleteProduct = async (id) => {
  const [result] = await db.query("DELETE FROM products WHERE id = ?", [id]);
  return result;
};


module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
