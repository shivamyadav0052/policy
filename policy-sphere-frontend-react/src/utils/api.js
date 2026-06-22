import axios from "axios";

// Determine API base URL based on environment
const getBaseURL = () => {
  // In production (Render), use relative path or environment variable
  if (process.env.NODE_ENV === "production") {
    return process.env.REACT_APP_API_URL || "/api";
  }
  // In development, use localhost
  return process.env.REACT_APP_API_URL || "http://localhost:8183";
};

const api = axios.create({
  baseURL: getBaseURL(),
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