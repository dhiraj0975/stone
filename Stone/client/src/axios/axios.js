import axios from "axios";

// Use same-origin relative base to avoid cross-site cookie issues in dev
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  withCredentials: true,
});

export default API;
