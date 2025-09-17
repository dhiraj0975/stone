import api from "./axios";

const PurchaseAPI = {
  getAll: () => api.get("/purchases"),
  getById: (id) => api.get(`/purchases/${id}`),
  create: (data) => api.post("/purchases", data),
};

export default PurchaseAPI;
