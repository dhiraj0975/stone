const db = require('../config/db'); // db connection

const Category = {
    // Get all categories
    getAll: () => {
        return db.query('SELECT * FROM categories ORDER BY id DESC');
    },

    // Get category by ID
    getById: (id) => {
        return db.query('SELECT * FROM categories WHERE id = ?', [id]);
    },

    // Create new category
    create: (name) => {
        return db.query('INSERT INTO categories (name) VALUES (?)', [name]);
    },

    // Update category by ID
    update: (id, name) => {
        return db.query('UPDATE categories SET name = ? WHERE id = ?', [name, id]);
    },

    // Delete category by ID
    delete: (id) => {
        return db.query('DELETE FROM categories WHERE id = ?', [id]);
    }
};

module.exports = Category;