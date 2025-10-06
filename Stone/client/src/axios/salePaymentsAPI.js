import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

// ✅ Sale Payments API (backend ke hisaab se)
const paymentsAPI = {
  // GET payment by ID
  getById: (id) => api.get(`/payments/${id}`),

  // GET all payments for a specific sale (agar future me backend route add ho)
  getBySaleId: (sale_id) => api.get(`/payments/sale/${sale_id}`),

  // GET ledger for a specific customer
  getLedgerByCustomer: (customer_id) => api.get(`/payments/${customer_id}/ledger`),

  // GET summary for a specific customer
  getSummaryByCustomer: (customer_id) => api.get(`/payments/${customer_id}/summary`),

  // POST new payment
  create: (data) => api.post("/payments", data),

  // PUT update payment (backend me add karna hoga)
  update: (id, data) => api.put(`/payments/${id}`, data),

  // DELETE payment
  delete: (id) => api.delete(`/payments/${id}`),
};

export default paymentsAPI;
