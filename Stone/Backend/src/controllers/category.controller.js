const Category = require('../models/category.model');

// Get all categories
const getAllCategories = async (req, res) => {
    try {
        const [rows] = await Category.getAll();
        res.status(200).json({ success: true, data: rows });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Get category by ID
const getCategoryById = async (req, res) => {
    try {
        const id = req.params.id;
        const [rows] = await Category.getById(id);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }
        res.status(200).json({ success: true, data: rows[0] });
    } catch (error) {
        console.error('Error fetching category:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Create new category
// Create new category
const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    const [result] = await Category.create(name);

    // Abhi insertId milega
    const [newCategory] = await Category.getById(result.insertId);

    res.status(201).json({
      success: true,
      data: newCategory[0],  // 👈 ye new category bhej do
      message: 'Category created successfully',
    });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};


// PUT update product
const updateCategory = async (req, res) => {
  try {
    const productId = parseInt(req.params.id, 10);

    // Fetch existing product
    const existingProduct = await getProductById(productId);
    if (!existingProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const { category_id, product_name, mrp, purchase_rate, sales_rate, qty, min_qty, remark, weight_per_packet, status } = req.body;

    // Validate category_id if provided
    if (category_id !== undefined && category_id !== null) {
      const [category] = await db.query("SELECT id FROM categories WHERE id = ?", [category_id]);
      if (category.length === 0) {
        return res.status(400).json({ success: false, message: "Invalid category_id" });
      }
    }

    // Merge existing values with new data
    const updatedData = {
      product_name: product_name ?? existingProduct.product_name,
   category_id: [null, undefined, ""].includes(category_id) ? existingProduct.category_id : category_id,
      mrp: mrp ?? existingProduct.mrp,
      purchase_rate: purchase_rate ?? existingProduct.purchase_rate,
      sales_rate: sales_rate ?? existingProduct.sales_rate,
      qty: qty ?? existingProduct.qty,
      min_qty: min_qty ?? existingProduct.min_qty,
      remark: remark ?? existingProduct.remark,
      weight_per_packet: weight_per_packet ?? existingProduct.weight_per_packet,
      status: status ?? existingProduct.status,
    };

    await updateProduct(productId, updatedData);

    res.status(200).json({ success: true, message: "Product updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};


// Delete category
const deleteCategory = async (req, res) => {
    try {
        const id = req.params.id;
        await Category.delete(id);
        res.status(200).json({ success: true, message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};