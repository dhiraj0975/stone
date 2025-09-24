import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  withCredentials: true,
});

const CustomerAPI = {
  getAll: () => api.get("/customers"),          // GET all customers
  getById: (id) => api.get(`/customers/${id}`),// GET single customer
  create: (data) => api.post("/customers", data), // CREATE new customer
  update: (id, data) => api.put(`/customers/${id}`, data), // UPDATE customer
  delete: (id) => api.delete(`/customers/${id}`), // DELETE customer
};

export default CustomerAPI;
