import React, { useState, useEffect } from "react";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import CustomerDashboard from "./pages/CustomerDashboard";
import AgentDashboard from "./pages/AgentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import "./styles/form.css";

function App() {
  const [activePage, setActivePage] = useState("login");
  const [userRole, setUserRole] = useState("");

  // ✅ Restore session on refresh (token OR auth supported)
  useEffect(() => {
    const role = localStorage.getItem("role");
    const token =
      localStorage.getItem("token") || localStorage.getItem("auth"); // ✅ FIX

    if (role && token) {
      handleRoleRedirect(role);
    } else {
      setActivePage("login");
    }
  }, []);

  // ✅ Role-based routing
  const handleRoleRedirect = (role) => {
    const normalized = (role || "").toUpperCase();

    if (normalized.includes("ADMIN")) {
      setActivePage("admin-dashboard");
      setUserRole("ADMIN");
    } else if (normalized.includes("AGENT")) {
      setActivePage("agent-dashboard");
      setUserRole("AGENT");
    } else {
      setActivePage("customer-dashboard");
      setUserRole("CUSTOMER");
    }
  };

  // ✅ Called after login
  const onLoginSuccess = (role) => {
    handleRoleRedirect(role);
  };

  // ✅ Logout (clear everything safely)
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("auth");   // ✅ FIX
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    setUserRole("");
    setActivePage("login");
  };

  // ✅ Dashboard routing
  if (activePage === "customer-dashboard") {
    return <CustomerDashboard onLogout={logout} />;
  }

  if (activePage === "agent-dashboard") {
    return <AgentDashboard onLogout={logout} />;
  }

  if (activePage === "admin-dashboard") {
    return <AdminDashboard onLogout={logout} />;
  }

  // ✅ Auth Pages
  return (
    <div className="app-shell">
      <header className="top-nav">
        <button
          className={activePage === "register" ? "active" : ""}
          onClick={() => setActivePage("register")}
        >
          Register
        </button>

        <button
          className={activePage === "login" ? "active" : ""}
          onClick={() => setActivePage("login")}
        >
          Login
        </button>
      </header>

      {activePage === "register" ? (
        <RegisterPage />
      ) : (
        <LoginPage
          onLoginSuccess={onLoginSuccess}
          onChangePage={setActivePage}
        />
      )}
    </div>
  );
}

export default App;