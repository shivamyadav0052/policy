import React, { useEffect, useState } from "react";
import api from "../utils/api";
import "../styles/agent-dashboard-modern.css";

const AgentDashboard = ({ onLogout }) => {
  const [customers, setCustomers] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [agentEmail, setAgentEmail] = useState("");
  const [agentName, setAgentName] = useState("Agent");
  const [greeting, setGreeting] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [claims, setClaims] = useState([]);
  const [viewedClaims, setViewedClaims] = useState({});

  const [customerForm, setCustomerForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [assignForm, setAssignForm] = useState({
    customerId: "",
    policyId: "",
  });

  const [assignments, setAssignments] = useState([]);


  // ✅ Load data
  useEffect(() => {
    loadData();
    loadAgentInfo();
    updateGreetingAndDate();
  }, []);

  // ✅ Update greeting and date every minute
  useEffect(() => {
    const interval = setInterval(updateGreetingAndDate, 60000);
    return () => clearInterval(interval);
  }, []);

  //claim pending
  useEffect(() => {
    const interval = setInterval(() => {
      api.get("/claim/pending")
        .then(res => setClaims(res.data))
        .catch(() => { });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const updateGreetingAndDate = () => {
    const now = new Date();
    const hour = now.getHours();

    // ✅ Determine greeting based on time
    let greetingMsg = "";
    if (hour < 12) {
      greetingMsg = "Good Morning";
    } else if (hour < 18) {
      greetingMsg = "Good Afternoon";
    } else {
      greetingMsg = "Good Evening";
    }

    setGreeting(greetingMsg);

    // ✅ Format current date
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    setCurrentDate(now.toLocaleDateString("en-US", options));
  };

  const loadAgentInfo = () => {
    // ✅ Extract email from auth token
    const authToken = localStorage.getItem("auth");
    if (authToken) {
      try {
        const decodedAuth = atob(authToken); // Decode base64 (email:password)
        const email = decodedAuth.split(":")[0];
        setAgentEmail(email);
      } catch (err) {
        console.error("Error decoding auth token:", err);
      }
    }

    // ✅ Get agent name from localStorage if available, otherwise use email
    const storedName = localStorage.getItem("agentName");
    if (storedName) {
      setAgentName(storedName);
    } else if (agentEmail) {
      setAgentName(agentEmail.split("@")[0]);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);

      const [customersRes, policiesRes, assignmentsRes, claimsRes] = await Promise.all([
        api.get("/agent/customers"),
        api.get("/agent/policies"),
        api.get("/agent/assignments"),
        api.get("/claim/pending") // 👈 ONLY ADD THIS
      ]);

      const assignmentMap = assignmentsRes.data.reduce((map, assignment) => {
        if (assignment.customer?.id) {
          map[assignment.customer.id] = assignment;
        }
        return map;
      }, {});

      const customersWithAssignments = customersRes.data.map((customer) => {
        const assignment = assignmentMap[customer.id];
        return {
          ...customer,
          assignedPolicy: assignment?.policy,
          assignmentStatus: assignment?.status,
          assignmentStartDate: assignment?.startDate,
          assignmentEndDate: assignment?.endDate,
        };
      });

      setCustomers(customersWithAssignments);
      setPolicies(policiesRes.data);
      setAssignments(assignmentsRes.data);
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Create Customer
  const createCustomer = async (e) => {
    e.preventDefault();

    if (!customerForm.name || !customerForm.email || !customerForm.phone) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await api.post("/agent/createCustomers", customerForm);
      alert(`✅ Customer created successfully!\n\nGenerated Password: ${response.data.generatedPassword}\n\nPlease share this password with the customer securely.`);

      setCustomerForm({ name: "", email: "", phone: "" });
      loadData();
    } catch (err) {
      console.error("Error creating customer:", err);
      const errorMsg = err.response?.data || "Failed to create customer";
      alert(`❌ ${errorMsg}`);
    }
  };



  const approveClaim = async (id) => {
    await api.post(`/claim/approve/${id}`);
    loadData();
  };

  const rejectClaim = async (id) => {
    await api.post(`/claim/reject/${id}`);
    loadData();
  };

  const requestDocs = async (id) => {
    const message = prompt("Enter message for customer");
    if (!message) return;

    await api.post(`/claim/request-docs/${id}`, null, {
      params: { message }
    });

    loadData();
  };

  // ✅ Assign Policy
  const assignPolicy = async (e) => {
    e.preventDefault();

    if (!assignForm.customerId || !assignForm.policyId) {
      alert("Please select both customer and policy");
      return;
    }

    try {
      await api.post("/agent/assign", null, {
        params: {
          customerId: assignForm.customerId,
          policyId: assignForm.policyId
        }
      });

      alert("✅ Policy assigned successfully!");
      setAssignForm({ customerId: "", policyId: "" });
      loadData();

    } catch (err) {
      console.error("FULL ERROR:", err);
      console.log("STATUS:", err.response?.status);
      console.log("DATA:", err.response?.data);
      const errorMsg = err.response?.data || "Failed to assign policy";
      alert(`❌ ${errorMsg}`);
    }
  };

  const logout = () => {
    localStorage.clear();
    onLogout();
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <div className="greeting-section">
              <h1 className="dashboard-title">
                <span className="icon">🧑‍💼</span>
                Agent Dashboard
              </h1>
              <div className="agent-info">
                <p className="greeting-text">
                  {greeting}, <span className="agent-name">{agentName}</span>! 👋
                </p>
                <p className="agent-email">📧 {agentEmail}</p>
                <p className="current-date">📅 {currentDate}</p>
              </div>
            </div>
            <p className="dashboard-subtitle">
              Manage customers and policies
            </p>
          </div>

          <button onClick={logout} className="logout-btn">
            🚪 Logout
          </button>
        </div>

        {/* Navigation Tabs */}
        <nav className="dashboard-nav">
          <button
            className={`nav-tab ${activeTab === "dashboard" ? "active" : ""
              }`}
            onClick={() => setActiveTab("dashboard")}
          >
            📊 Overview
          </button>

          <button
            className={`nav-tab ${activeTab === "customers" ? "active" : ""
              }`}
            onClick={() => setActiveTab("customers")}
          >
            👥 Customers ({customers.length})
          </button>

          <button
            className={`nav-tab ${activeTab === "policies" ? "active" : ""
              }`}
            onClick={() => setActiveTab("policies")}
          >
            📋 Policies ({policies.length})
          </button>

          <button
            className={`nav-tab ${activeTab === "actions" ? "active" : ""
              }`}
            onClick={() => setActiveTab("actions")}
          >
            ⚡ Actions
          </button>


          <button
            className={`nav-tab ${activeTab === "claims" ? "active" : ""}`}
            onClick={() => setActiveTab("claims")}
          >
            📄 Claims {claims.length > 0 && <span style={{ color: "red" }}>({claims.length})</span>}
          </button>
        </nav>
      </header>

      {/* Main */}
      <main className="dashboard-main">
        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="content-section">
            <h2>📊 Dashboard Overview</h2>
            <p className="section-subtitle">Your key metrics at a glance</p>

            <div className="stats-grid-modern">
              <div className="stat-card-modern">
                <div className="stat-icon">👥</div>
                <div className="stat-content">
                  <h3 className="stat-number">{customers.length}</h3>
                  <p className="stat-label">Total Customers</p>
                  <span className="stat-trend">Active customers</span>
                </div>
              </div>

              <div className="stat-card-modern">
                <div className="stat-icon">📋</div>
                <div className="stat-content">
                  <h3 className="stat-number">{policies.length}</h3>
                  <p className="stat-label">Policies Available</p>
                  <span className="stat-trend">Insurance options</span>
                </div>
              </div>

              <div className="stat-card-modern">
                <div className="stat-icon">💰</div>
                <div className="stat-content">
                  <h3 className="stat-number">
                    ₹{policies.reduce((sum, p) => sum + (p.premiumAmount || 0), 0).toLocaleString()}
                  </h3>
                  <p className="stat-label">Total Premium Value</p>
                  <span className="stat-trend">All policies combined</span>
                </div>
              </div>

              <div className="stat-card-modern">
                <div className="stat-icon">📈</div>
                <div className="stat-content">
                  <h3 className="stat-number">
                    {policies.length > 0
                      ? Math.round((customers.length / policies.length) * 100)
                      : 0}%
                  </h3>
                  <p className="stat-label">Coverage Ratio</p>
                  <span className="stat-trend">Customers to policies</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions-section">
              <h3>🚀 Quick Actions</h3>
              <div className="quick-actions-buttons">
                <button onClick={() => setActiveTab("customers")} className="quick-action-btn">
                  <span className="btn-icon">👥</span>
                  <span className="btn-text">View All Customers</span>
                </button>
                <button onClick={() => setActiveTab("policies")} className="quick-action-btn">
                  <span className="btn-icon">📋</span>
                  <span className="btn-text">Browse Policies</span>
                </button>
                <button onClick={() => setActiveTab("actions")} className="quick-action-btn">
                  <span className="btn-icon">➕</span>
                  <span className="btn-text">Add Customer</span>
                </button>
                <button onClick={() => setActiveTab("actions")} className="quick-action-btn">
                  <span className="btn-icon">🔗</span>
                  <span className="btn-text">Assign Policy</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CUSTOMERS */}
        {activeTab === "customers" && (
          <div className="content-section">
            <div className="section-header">
              <div>
                <h2>👥 Customers</h2>
                <p className="section-subtitle">Manage and view all your customers</p>
              </div>
              <div className="header-badge">{customers.length} Total</div>
            </div>

            {customers.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">👤</div>
                <h3>No Customers Yet</h3>
                <p>Start by creating your first customer to get going!</p>
              </div>
            ) : (
              <div className="customers-table-wrapper">
                <table className="modern-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Assigned Policy</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((c) => (
                      <tr key={c.id}>
                        <td><strong>{c.name}</strong></td>
                        <td>{c.email}</td>
                        <td>{c.phone}</td>
                        <td>{c.assignedPolicy ? c.assignedPolicy.policyName : "None"}</td>
                        <td>
                          {c.assignedPolicy ? (
                            <span className="badge-primary">{c.assignmentStatus || "Assigned"}</span>
                          ) : (
                            <span className="badge-secondary">No Policy</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* POLICIES */}
        {activeTab === "policies" && (
          <div className="content-section">
            <div className="section-header">
              <div>
                <h2>📋 Policies</h2>
                <p className="section-subtitle">View all available insurance policies</p>
              </div>
              <div className="header-badge">{policies.length} Total</div>
            </div>

            {policies.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📄</div>
                <h3>No Policies Available</h3>
                <p>Policies will appear here once they are added to the system</p>
              </div>
            ) : (
              <div className="policies-grid">
                {policies.map((p) => (
                  <div key={p.id} className="policy-card-modern">
                    <div className="policy-header-modern">
                      <h3>{p.policyName}</h3>
                      <span className="policy-badge">Active</span>
                    </div>
                    <div className="policy-details-modern">
                      <div className="detail-row">
                        <span className="label">Premium Amount:</span>
                        <span className="value">₹{p.premiumAmount || 0}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Policy ID:</span>
                        <span className="value">#{p.id}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ACTIONS */}
        {activeTab === "actions" && (
          <div className="content-section">
            <h2>⚡ Quick Actions</h2>
            <p className="section-subtitle">Create customers and assign policies</p>

            <div className="actions-grid">
              {/* Create Customer Card */}
              <div className="action-card-modern">
                <div className="card-header-modern">
                  <h3>➕ Add New Customer</h3>
                  <p className="card-subtitle">Register a new customer</p>
                </div>

                <form onSubmit={createCustomer} className="modern-form">
                  <div className="form-group">
                    <label htmlFor="customer-name">Full Name</label>
                    <input
                      id="customer-name"
                      type="text"
                      placeholder="Enter customer name"
                      value={customerForm.name}
                      onChange={(e) =>
                        setCustomerForm({
                          ...customerForm,
                          name: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="customer-email">Email Address</label>
                    <input
                      id="customer-email"
                      type="email"
                      placeholder="customer@example.com"
                      value={customerForm.email}
                      onChange={(e) =>
                        setCustomerForm({
                          ...customerForm,
                          email: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="customer-phone">Phone Number</label>
                    <input
                      id="customer-phone"
                      type="tel"
                      placeholder="9876543210"
                      value={customerForm.phone}
                      onChange={(e) =>
                        setCustomerForm({
                          ...customerForm,
                          phone: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <button type="submit" className="btn-primary-modern">
                    ✨ Create Customer
                  </button>
                </form>
              </div>

              {/* Assign Policy Card */}
              <div className="action-card-modern">
                <div className="card-header-modern">
                  <h3>🔗 Assign Policy</h3>
                  <p className="card-subtitle">Link a policy to a customer</p>
                </div>

                <form onSubmit={assignPolicy} className="modern-form">
                  <div className="form-group">
                    <label htmlFor="select-customer">Select Customer</label>
                    <select
                      id="select-customer"
                      value={assignForm.customerId}
                      onChange={(e) =>
                        setAssignForm({
                          ...assignForm,
                          customerId: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="">-- Choose a customer --</option>
                      {customers.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="select-policy">Select Policy</label>
                    <select
                      id="select-policy"
                      value={assignForm.policyId}
                      onChange={(e) =>
                        setAssignForm({
                          ...assignForm,
                          policyId: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="">-- Choose a policy --</option>
                      {policies.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.policyName} (₹{p.premiumAmount})
                        </option>
                      ))}
                    </select>
                  </div>

                  <button type="submit" className="btn-primary-modern">
                    🚀 Assign Policy
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {activeTab === "claims" && (
          <div className="content-section">
            <h2>📄 Claim Requests</h2>

            {claims.length === 0 ? (
              <p>No pending claims</p>
            ) : (
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Policy</th>
                    <th>Document</th>
                    <th>Status</th>
                    <th>Message</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {claims.map((c) => (
                    <tr key={c.id}>
                      <td>{c.customer?.name}</td>
                      <td>{c.policyAssignment?.policy?.policyName}</td>
                      <td>
                        {/* 👇 View Button */}
                        <button
                          className="btn-secondary-modern"
                          onClick={() =>
                            setViewedClaims((prev) => ({
                              ...prev,
                              [c.id]: !prev[c.id],
                            }))
                          }
                        >
                          📄 View Docs
                        </button>

                        {/* 👇 Show only when clicked */}
                        {viewedClaims[c.id] && (
                          <div style={{ marginTop: "10px" }}>
                            {c.documentPath?.split(",").map((path, index) => {
                              const fileUrl = "http://localhost:8183/uploads/" + path;

                              return (
                                <div key={index} style={{ marginBottom: "10px" }}>

                                  {/* PDF */}
                                  {fileUrl.endsWith(".pdf") ? (
                                    <>
                                      <iframe
                                        src={fileUrl}
                                        width="300px"
                                        height="200px"
                                        title="PDF Preview"
                                      />

                                      <br />

                                      <a href={fileUrl} download>
                                        <button className="btn-primary-modern">
                                          ⬇️ Download PDF
                                        </button>
                                      </a>
                                    </>
                                  ) : (
                                    <>
                                      <img
                                        src={fileUrl}
                                        alt="doc"
                                        style={{ width: "200px" }}
                                      />

                                      <br />

                                      <a href={fileUrl} download>
                                        <button className="btn-primary-modern">
                                          ⬇️ Download Image
                                        </button>
                                      </a>
                                    </>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </td>
                      <td>{c.status}</td>
                      <td>{c.agentMessage || "-"}</td>
                      <td>
                        <button onClick={() => approveClaim(c.id)}>✅</button>
                        <button onClick={() => rejectClaim(c.id)}>❌</button>
                        <button onClick={() => requestDocs(c.id)}>📄</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AgentDashboard;