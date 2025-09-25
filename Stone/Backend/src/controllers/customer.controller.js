const Customer = require('../models/customer.model.js');

const CustomerController = {
  // 1️⃣ Get all customers
  getAll: async (req, res) => {
    try {
      const customers = await Customer.getAll();
      res.json(customers);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch customers" });
    }
  },

  // 2️⃣ Get customer by ID
  getById: async (req, res) => {
    try {
      const customer = await Customer.getById(req.params.id);
      if (!customer) return res.status(404).json({ message: "Customer not found" });
      res.json(customer);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch customer" });
    }
  },

  // 3️⃣ Create new customer
  create: async (req, res) => {
    try {
      if (!req.body.name) return res.status(400).json({ message: "Name is required" });
      const customer = await Customer.create(req.body);
      res.status(201).json(customer);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to create customer" });
    }
  },

  // 4️⃣ Update customer
  update: async (req, res) => {
    try {
      if (!req.body.name) return res.status(400).json({ message: "Name is required" });
      const affectedRows = await Customer.update(req.params.id, req.body);
      if (!affectedRows) return res.status(404).json({ message: "Customer not found" });
      res.json({ id: req.params.id, ...req.body });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to update customer" });
    }
  },

  // 5️⃣ Delete customer
  delete: async (req, res) => {
    try {
      const affectedRows = await Customer.delete(req.params.id);
      if (!affectedRows) return res.status(404).json({ message: "Customer not found" });
      res.json({ message: "Customer deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to delete customer" });
    }
  },

  // 6️⃣ Toggle status Active/Inactive
  toggleStatus: async (req, res) => {
    try {
      const { currentStatus } = req.body;
      const newStatus = await Customer.toggleStatus(req.params.id, currentStatus);
      res.json({ id: req.params.id, status: newStatus });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to update status" });
    }
  },
};

module.exports = CustomerController;
