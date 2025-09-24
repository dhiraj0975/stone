import api from "./axios"; // pre-configured axios instance

const SalesAPI = {
  getAll: () => api.get("/sales"),
  getById: (id) => api.get(`/sales/${id}`),
  create: (data) => api.post("/sales", data),
  update: (id, data) => api.put(`/sales/${id}`, data),
  delete: (id) => api.delete(`/sales/${id}`),
  getInvoice: (id) => api.get(`/sales/${id}/invoice`),
};

export default SalesAPI;
