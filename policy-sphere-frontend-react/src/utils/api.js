import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8183",
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