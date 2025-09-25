import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api", // fallback
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

const PurchaseAPI = {
  getAll: () => api.get("/purchases"),
  getById: (id) => api.get(`/purchases/${id}`),
  create: (data) => api.post("/purchases", data),
  update: (id, data) => api.put(`/purchases/${id}`, data),
  delete: (id) => api.delete(`/purchases/${id}`),
};

export default PurchaseAPI;
