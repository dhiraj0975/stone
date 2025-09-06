import Client from "../models/Client.js";

// @route   GET /api/clients
export const getClients = async (req, res, next) => {
  try {
    const clients = await Client.find().sort({ name: 1 });
    res.status(200).json({ success: true, data: clients });
  } catch (err) {
    next(err);
  }
};

// @route   GET /api/clients/:id
export const getClientById = async (req, res, next) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res
        .status(404)
        .json({ success: false, error: "Client not found" });
    }
    res.status(200).json({ success: true, data: client });
  } catch (err) {
    next(err);
  }
};

// @route   POST /api/clients
export const createClient = async (req, res, next) => {
  try {
    const client = await Client.create(req.body);
    res.status(201).json({ success: true, data: client });
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      const value = err.keyValue[field];
      return res
        .status(400)
        .json({ success: false, error: `${field} '${value}' already exists.` });
    }
    res.status(400).json({ success: false, error: err.message });
  }
};

// @route   PUT /api/clients/:id
export const updateClient = async (req, res, next) => {
  try {
    const client = await Client.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!client) {
      return res
        .status(404)
        .json({ success: false, error: "Client not found" });
    }
    res.status(200).json({ success: true, data: client });
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      const value = err.keyValue[field];
      return res
        .status(400)
        .json({ success: false, error: `${field} '${value}' already exists.` });
    }
    res.status(400).json({ success: false, error: err.message });
  }
};

// @route   DELETE /api/clients/:id
export const deleteClient = async (req, res, next) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) {
      return res
        .status(404)
        .json({ success: false, error: "Client not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Client deleted successfully" });
  } catch (err) {
    next(err);
  }
};
