import axios from "axios";

// Use same-origin relative base to avoid cross-site cookie issues in dev
const API = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

export default API;
