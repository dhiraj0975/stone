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


// Update category
// Update category
const updateCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    await Category.update(id, name);

    // updated record fetch karo
    const [updatedCategory] = await Category.getById(id);

    res.status(200).json({
      success: true,
      data: updatedCategory[0],  // 👈 ye bhejo
      message: 'Category updated successfully',
    });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
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