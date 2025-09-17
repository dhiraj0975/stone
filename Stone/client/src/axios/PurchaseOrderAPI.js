import api from "./axios";

// ✅ Purchase Order API
const PurchaseOrderAPI = {
  getAll: () => api.get("/purchase-orders"), // GET all POs
  getById: (id) => api.get(`/purchase-orders/${id}`), // GET PO by ID
  create: (data) => api.post("/purchase-orders", data), // POST new PO
  delete: (id) => api.delete(`/purchase-orders/${id}`), // DELETE PO
};

export default PurchaseOrderAPI;
