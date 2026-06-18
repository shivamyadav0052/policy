import React, { useEffect, useState } from "react";
import api from "../utils/api";
import "../styles/agent-dashboard-modern.css"; // Reuse styles

const CustomerDashboard = ({ onLogout }) => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerName, setCustomerName] = useState("Customer");
  const [greeting, setGreeting] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [claims, setClaims] = useState([]);
  const [activeTab, setActiveTab] = useState("policies");
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [files, setFiles] = useState([]);
  const [openClaimId, setOpenClaimId] = useState(null);
  const [claimForm, setClaimForm] = useState({
    documentPath: "",
    bankAccountNumber: "",
    bankIfscCode: "",
    bankAccountHolder: "",
  });

  // Load data
  useEffect(() => {
    loadData();
    loadCustomerInfo();
    updateGreetingAndDate();
  }, []);

  // Update greeting and date every minute
  useEffect(() => {
    const interval = setInterval(updateGreetingAndDate, 60000);
    return () => clearInterval(interval);
  }, []);

  const updateGreetingAndDate = () => {
    const now = new Date();
    const hour = now.getHours();

    let greetingMsg = "";
    if (hour < 12) {
      greetingMsg = "Good Morning";
    } else if (hour < 18) {
      greetingMsg = "Good Afternoon";
    } else {
      greetingMsg = "Good Evening";
    }

    setGreeting(greetingMsg);

    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    setCurrentDate(now.toLocaleDateString("en-US", options));
  };

  const loadCustomerInfo = () => {
    const authToken = localStorage.getItem("auth");
    if (authToken) {
      try {
        const decodedAuth = atob(authToken);
        const email = decodedAuth.split(":")[0];
        setCustomerEmail(email);
        setCustomerName(email.split("@")[0]);
      } catch (err) {
        console.error("Error decoding auth token:", err);
      }
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      console.log("Fetching customer policies...");
      const [policiesRes, claimsRes] = await Promise.all([
        api.get("/customer/policies"),
        api.get("/claim/my-claims"),
      ]);
      console.log("Policies loaded:", policiesRes.data);
      console.log("Claims loaded:", claimsRes.data);
      setPolicies(policiesRes.data);
      setClaims(claimsRes.data);
    } catch (err) {
      console.error("Error loading data:", err);
      alert("Failed to load data. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const claimPolicy = async (assignmentId) => {
    if (
      files.length === 0 ||
      !claimForm.bankAccountNumber ||
      !claimForm.bankIfscCode ||
      !claimForm.bankAccountHolder
    ) {
      alert("Please fill all fields and upload documents");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("assignmentId", assignmentId);
      formData.append("bankAccountNumber", claimForm.bankAccountNumber);
      formData.append("bankIfscCode", claimForm.bankIfscCode);
      formData.append("bankAccountHolder", claimForm.bankAccountHolder);

      files.forEach((file) => {
        formData.append("files", file);
      });
      await api.post("/claim/submit", formData);

      alert("✅ Claim submitted successfully!");

      setFiles([]);
      setClaimForm({
        bankAccountNumber: "",
        bankIfscCode: "",
        bankAccountHolder: "",
      });

      setShowClaimForm(false);
      setSelectedAssignment(null);

      loadData();
    } catch (err) {
      console.error("Error submitting claim:", err);
      alert("❌ Failed to submit claim");
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
                <span className="icon">👤</span>
                Customer Dashboard
              </h1>
              <div className="agent-info">
                <p className="greeting-text">
                  {greeting}, <span className="agent-name">{customerName}</span>! 👋
                </p>
                <p className="agent-email">📧 {customerEmail}</p>
                <p className="current-date">📅 {currentDate}</p>
              </div>
            </div>
            <p className="dashboard-subtitle">
              View and claim your insurance policies
            </p>
          </div>

          <button onClick={logout} className="logout-btn">
            🚪 Logout
          </button>
        </div>

        {/* Navigation Tabs */}
        <nav className="dashboard-nav">
          <button
            className={`nav-tab ${activeTab === "policies" ? "active" : ""}`}
            onClick={() => setActiveTab("policies")}
          >
            📋 Policies ({policies.length})
          </button>
          <button
            className={`nav-tab ${activeTab === "claims" ? "active" : ""}`}
            onClick={() => setActiveTab("claims")}
          >
            📝 My Claims ({claims.length})
          </button>

        </nav>
      </header>

      {/* Main */}
      <main className="dashboard-main">
        {/* POLICIES TAB */}
        {activeTab === "policies" && (
          <div className="content-section">
            <h2>📋 My Policies</h2>
            <p className="section-subtitle">Policies assigned to you</p>

            {policies.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📄</div>
                <h3>No Policies Assigned</h3>
                <p>Your assigned policies will appear here</p>
              </div>
            ) : (
              <div className="policies-grid">
                {policies.map((assignment) => (
                  <div key={assignment.id} className="policy-card-modern">
                    <div className="policy-header-modern">
                      <h3>{assignment.policy.policyName}</h3>
                      <span className={`policy-badge ${assignment.status === 'CLAIMED' ? 'claimed' : 'active'}`}>
                        {assignment.status}
                      </span>
                    </div>
                    <div className="policy-details-modern">
                      <div className="detail-row">
                        <span className="label">Premium Amount:</span>
                        <span className="value">₹{assignment.policy.premiumAmount || 0}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Coverage Type:</span>
                        <span className="value">{assignment.policy.coverageType || 'N/A'}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Duration:</span>
                        <span className="value">{assignment.policy.duration || 'N/A'}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Start Date:</span>
                        <span className="value">{assignment.startDate}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">End Date:</span>
                        <span className="value">{assignment.endDate}</span>
                      </div>
                      {assignment.policy.description && (
                        <div className="detail-row">
                          <span className="label">Description:</span>
                          <span className="value">{assignment.policy.description}</span>
                        </div>
                      )}
                      {assignment.policy.terms && (
                        <div className="detail-row">
                          <span className="label">Terms:</span>
                          <span className="value">{assignment.policy.terms}</span>
                        </div>
                      )}
                    </div>
                    {(() => {
                      const claim = claims.find(
                        (c) => c.policyAssignment?.id === assignment.id
                      );

                      // ❌ अगर already PENDING है
                      if (claim && claim.status === "PENDING") {
                        return (
                          <button className="btn-secondary-modern" disabled>
                            ⏳ Claim Pending
                          </button>
                        );
                      }

                      // ✅ अगर APPROVED है
                      if (claim && claim.status === "APPROVED") {
                        return (
                          <button className="btn-success-modern" disabled>
                            ✅ Approved
                          </button>
                        );
                      }

                      // ❌ अगर REJECTED है → फिर से submit allow
                      if (claim && claim.status === "REJECTED") {
                        return (
                          <button
                            onClick={() => {
                              setSelectedAssignment(assignment);
                              setShowClaimForm(true);
                            }}
                            className="btn-danger-modern"
                          >
                            🔁 Re-submit Claim
                          </button>
                        );
                      }

                      // 🟢 Default → No claim yet
                      return (
                        <button
                          onClick={() => {
                            setSelectedAssignment(assignment);
                            setShowClaimForm(true);
                          }}
                          className="btn-primary-modern"
                        >
                          Submit Claim
                        </button>
                      );
                    })()}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* CLAIMS TAB */}
        {activeTab === "claims" && (
          <div className="content-section">
            <h2>📝 My Claims</h2>
            <p className="section-subtitle">Track your submitted claims</p>

            {claims.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📄</div>
                <h3>No Claims Yet</h3>
                <p>Submit a claim from your policies to get started</p>
              </div>
            ) : (
              <div className="policies-grid">
                {claims.map((claim) => (
                  <div key={claim.id} className="policy-card-modern">
                    <div className="policy-header-modern">
                      <h3>{claim.policyAssignment?.policy?.policyName || "Claim"}</h3>
                      <span className={`policy-badge ${claim.status}`}>
                        {claim.status}
                      </span>
                    </div>
                    <div className="policy-details-modern">
                      <div className="detail-row">
                        <span className="label">Claim Status:</span>
                        <span className="value">{claim.status}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Submitted:</span>
                        <span className="value">{claim.createdDate}</span>
                      </div>
                      <div className="detail-row">
                        <button
                          onClick={() =>
                            setOpenClaimId(openClaimId === claim.id ? null : claim.id)
                          }
                          className="btn-secondary-modern"
                        >
                          📄 View Documents
                        </button>
                      </div>

                      {openClaimId === claim.id && claim.documentPath && (
                        <div style={{ marginTop: "10px" }}>
                          {claim.documentPath.split(",").map((path, index) => {
                            const fileUrl = "http://localhost:8183/uploads/" + path;

                            return (
                              <div key={index} style={{ marginBottom: "10px" }}>

                                {/* PDF Preview */}
                                {fileUrl.endsWith(".pdf") ? (
                                  <>
                                    <iframe
                                      src={fileUrl}
                                      width="100%"
                                      height="400px"
                                      title="PDF Preview"
                                    />

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
                                      style={{ width: "100%", maxHeight: "400px" }}
                                    />

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
                      {claim.status === 'APPROVED' && (
                        <>
                          <div className="detail-row">
                            <span className="label">Approved Date:</span>
                            <span className="value">{claim.approvedDate}</span>
                          </div>

                          <div className="detail-row">
                            <span className="label">💰 Expected Payout Date:</span>
                            <span className="value">
                              {claim.payoutDate ? claim.payoutDate : "Processing..."}
                            </span>
                          </div>

                          <div className="detail-row">
                            <span className="label" style={{ color: "green" }}>
                              ✅ Amount will be credited soon
                            </span>
                          </div>
                        </>
                      )}
                      {claim.status === 'REJECTED' && (
                        <div className="detail-row">
                          <span className="label">❌ Claim Rejected</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* CLAIM FORM MODAL */}
        {showClaimForm && selectedAssignment && (
          <div className="modal-overlay" onClick={() => setShowClaimForm(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>📋 Submit Claim for {selectedAssignment.policy.policyName}</h3>
                <button onClick={() => setShowClaimForm(false)} className="close-btn">✕</button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                claimPolicy(selectedAssignment.id);
              }} className="modern-form">
                <div className="form-group">
                  <label>Upload Documents</label>

                  <input
                    type="file"
                    multiple
                    accept="image/*,application/pdf"
                    onChange={(e) => {
                      const selectedFiles = Array.from(e.target.files);

                      if (selectedFiles.length > 6) {
                        alert("Max 6 files allowed");
                        return;
                      }

                      for (let file of selectedFiles) {
                        if (file.size > 1024 * 1024) {
                          alert("Each file must be less than 1MB");
                          return;
                        }
                      }

                      setFiles(selectedFiles);
                    }}
                  />

                  {/* ✅ YE YAHI ADD KARNA HAI */}
                  <ul>
                    {files.map((f, i) => (
                      <li key={i}>{f.name}</li>
                    ))}
                  </ul>

                </div>

                <div className="form-group">
                  <label htmlFor="accountHolder">Bank Account Holder Name</label>
                  <input
                    id="accountHolder"
                    type="text"
                    placeholder="Your Full Name"
                    value={claimForm.bankAccountHolder}
                    onChange={(e) => setClaimForm({ ...claimForm, bankAccountHolder: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="accountNumber">Bank Account Number</label>
                  <input
                    id="accountNumber"
                    type="text"
                    placeholder="1234567890"
                    value={claimForm.bankAccountNumber}
                    onChange={(e) => setClaimForm({ ...claimForm, bankAccountNumber: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="ifscCode">IFSC Code</label>
                  <input
                    id="ifscCode"
                    type="text"
                    placeholder="SBIN0001234"
                    value={claimForm.bankIfscCode}
                    onChange={(e) => setClaimForm({ ...claimForm, bankIfscCode: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <button type="submit" className="btn-primary-modern">
                    ✅ Submit Claim
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowClaimForm(false)}
                    className="btn-secondary-modern"
                    style={{ marginLeft: '10px' }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CustomerDashboard;
