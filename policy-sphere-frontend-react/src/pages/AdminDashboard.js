import React, { useState } from "react";
import AdminPolicyManagement from "./AdminPolicyManagement";
import "../styles/admin-dashboard.css";

const AdminDashboard = ({ onLogout }) => {
  const [activePage, setActivePage] = useState("dashboard");

  // If viewing policy management, show that component
  if (activePage === "policies") {
    return <AdminPolicyManagement onBack={() => setActivePage("dashboard")} />;
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <div className="greeting-section">
              <h1 className="dashboard-title">
                <span className="icon">🛡️</span>
                Admin Dashboard
              </h1>
              <p className="dashboard-subtitle">
                Manage users, policies, and system settings
              </p>
            </div>
          </div>

          <button onClick={onLogout} className="logout-btn">
            🚪 Logout
          </button>
        </div>

        {/* Navigation Tabs */}
        <nav className="dashboard-nav">
          <button
            className={`nav-tab ${activePage === "dashboard" ? "active" : ""}`}
            onClick={() => setActivePage("dashboard")}
          >
            📊 Overview
          </button>

          <button
            className={`nav-tab ${activePage === "policies" ? "active" : ""}`}
            onClick={() => setActivePage("policies")}
          >
            📋 Policy Management
          </button>

          <button
            className={`nav-tab ${activePage === "users" ? "active" : ""}`}
            onClick={() => setActivePage("users")}
          >
            👥 User Management
          </button>

          <button
            className={`nav-tab ${activePage === "reports" ? "active" : ""}`}
            onClick={() => setActivePage("reports")}
          >
            📈 Reports
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* DASHBOARD OVERVIEW */}
        {activePage === "dashboard" && (
          <div className="content-section">
            <h2>📊 System Overview</h2>
            <p className="section-subtitle">Monitor your insurance management system</p>

            <div className="stats-grid-modern">
              <div className="stat-card-modern">
                <div className="stat-icon">👥</div>
                <div className="stat-content">
                  <h3 className="stat-number">--</h3>
                  <p className="stat-label">Total Users</p>
                  <span className="stat-trend">Active users in system</span>
                </div>
              </div>

              <div className="stat-card-modern">
                <div className="stat-icon">📋</div>
                <div className="stat-content">
                  <h3 className="stat-number">--</h3>
                  <p className="stat-label">Active Policies</p>
                  <span className="stat-trend">Available policies</span>
                </div>
              </div>

              <div className="stat-card-modern">
                <div className="stat-icon">💰</div>
                <div className="stat-content">
                  <h3 className="stat-number">--</h3>
                  <p className="stat-label">Total Premium Value</p>
                  <span className="stat-trend">All policies combined</span>
                </div>
              </div>

              <div className="stat-card-modern">
                <div className="stat-icon">📈</div>
                <div className="stat-content">
                  <h3 className="stat-number">--%</h3>
                  <p className="stat-label">System Health</p>
                  <span className="stat-trend">Overall performance</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions-section">
              <h3>🚀 Quick Actions</h3>
              <div className="quick-actions-buttons">
                <button onClick={() => setActivePage("policies")} className="quick-action-btn">
                  <span className="btn-icon">📋</span>
                  <span className="btn-text">Manage Policies</span>
                </button>
                <button onClick={() => setActivePage("users")} className="quick-action-btn">
                  <span className="btn-icon">👥</span>
                  <span className="btn-text">View Users</span>
                </button>
                <button onClick={() => setActivePage("reports")} className="quick-action-btn">
                  <span className="btn-icon">📊</span>
                  <span className="btn-text">Generate Reports</span>
                </button>
                <button onClick={() => alert("System settings coming soon!")} className="quick-action-btn">
                  <span className="btn-icon">⚙️</span>
                  <span className="btn-text">System Settings</span>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="recent-activity-section">
              <h3>📝 Recent Activity</h3>
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-icon">🔄</div>
                  <div className="activity-content">
                    <p>System initialized successfully</p>
                    <small>Just now</small>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">👤</div>
                  <div className="activity-content">
                    <p>Admin logged in</p>
                    <small>Today</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* USERS MANAGEMENT */}
        {activePage === "users" && (
          <div className="content-section">
            <div className="section-header">
              <div>
                <h2>👥 User Management</h2>
                <p className="section-subtitle">Manage system users and permissions</p>
              </div>
            </div>

            <div className="empty-state">
              <div className="empty-icon">👤</div>
              <h3>User Management</h3>
              <p>This feature is coming soon! You'll be able to manage users, roles, and permissions here.</p>
            </div>
          </div>
        )}

        {/* REPORTS */}
        {activePage === "reports" && (
          <div className="content-section">
            <div className="section-header">
              <div>
                <h2>📈 Reports & Analytics</h2>
                <p className="section-subtitle">Generate insights and reports</p>
              </div>
            </div>

            <div className="empty-state">
              <div className="empty-icon">📊</div>
              <h3>Reports & Analytics</h3>
              <p>This feature is coming soon! You'll be able to generate detailed reports and analytics here.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
