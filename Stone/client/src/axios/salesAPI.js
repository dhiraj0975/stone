import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL , // fallback
  withCredentials: true, // cookies/session ke liye
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

// ✅ Sales API
const SalesAPI = {
  getAll: () => api.get("/sales"),                     // GET all sales
  getById: (id) => api.get(`/sales/${id}`),           // GET sale by ID
  create: (data) => api.post("/sales", data),         // POST new sale
  update: (id, data) => api.put(`/sales/${id}`, data),// PUT update sale
  delete: (id) => api.delete(`/sales/${id}`),         // DELETE sale
  getInvoice: (id) => api.get(`/sales/${id}/invoice`),// GET Invoice by sale ID
  getNewBillNo: () => api.get("/sales/new-bill"),     // GET new bill number
   getItemsBySaleId: (id) => api.get(`/sales/${id}/items`), // ✅ added
};

export default SalesAPI;
