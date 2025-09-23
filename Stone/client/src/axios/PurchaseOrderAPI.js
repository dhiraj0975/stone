import api from "./axios";

// ✅ Purchase Order API
const PurchaseOrderAPI = {
  getAll: () => api.get("/purchase-orders"), // GET all POs
  getById: (id) => api.get(`/purchase-orders/${id}`), // GET PO by ID
  create: (data) => api.post("/purchase-orders", data), // POST new PO
   update: (id, data) => api.put(`/purchase-orders/${id}`, data), // ✅ PUT update PO
  delete: (id) => api.delete(`/purchase-orders/${id}`), // DELETE PO
   getInvoice: (id) => api.get(`/purchase-orders/${id}/invoice`), // ✅ GET Invoice by PO ID
};

export default PurchaseOrderAPI;
