import axios from "axios";

const PurchaseOrderAPI = {
  getProducts: () => axios.get("/api/products"),
  getAll: () => axios.get("/api/purchase-orders"),
  create: (data) => axios.post("/api/purchase-orders", data),
  update: (id, data) => axios.put(`/api/purchase-orders/${id}`, data),
  delete: (id) => axios.delete(`/api/purchase-orders/${id}`),
};

export default PurchaseOrderAPI;