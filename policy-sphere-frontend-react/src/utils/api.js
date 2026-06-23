import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8183",
});

// ✅ Add Basic Auth header automatically
api.interceptors.request.use((config) => {
  const auth = localStorage.getItem("auth");

  if (auth) {
    config.headers.Authorization = `Basic ${auth}`; // 🔥 IMPORTANT
  }

  return config;
});

export default api;