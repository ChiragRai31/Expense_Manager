import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://expense-manager3.onrender.com",
  withCredentials: true, // ✅ send cookies
});

export default api;
