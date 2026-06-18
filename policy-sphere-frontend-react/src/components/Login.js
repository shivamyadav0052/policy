import React, { useState } from "react";
import api from "../utils/api";

const Login = ({ onLoginSuccess }) => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!data.email || !data.password) {
      setError("Please enter email and password");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await api.post("/auth/login", data);

      // ✅ Basic Auth token
      const basicAuth = btoa(data.email + ":" + data.password);

      // ✅ Store
      localStorage.setItem("auth", basicAuth);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("userId", res.data.id);

      console.log("Login successful! Role:", res.data.role);

      onLoginSuccess(res.data.role);

    } catch (err) {
      console.error("Login Failed", err);
      const errorMsg =
        err.response?.data?.message ||
        "Login failed. Please check your credentials.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>

      {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}

      <input
        placeholder="Email"
        value={data.email}
        onChange={(e) => setData({ ...data, email: e.target.value })}
        onKeyPress={handleKeyPress}
        disabled={loading}
      />

      <input
        type="password"
        placeholder="Password"
        value={data.password}
        onChange={(e) => setData({ ...data, password: e.target.value })}
        onKeyPress={handleKeyPress}
        disabled={loading}
      />

      <button onClick={handleLogin} disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
    </div>
  );
};

export default Login;