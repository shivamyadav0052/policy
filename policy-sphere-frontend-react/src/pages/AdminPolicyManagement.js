import React, { useEffect, useState } from "react";
import api from "../utils/api";
import "../styles/admin-policy-management.css";

const AdminPolicyManagement = ({ onBack }) => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("view");
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  const [policyForm, setPolicyForm] = useState({
    policyName: "",
    premiumAmount: "",
    description: "",
    coverageType: "",
    duration: "",
    terms: ""
  });

  useEffect(() => {
    loadPolicies();
  }, []);

  const loadPolicies = async () => {
    try {
      setLoading(true);
      const res = await api.get("/policy/admin/policies");
      console.log("🔥 POLICIES:", res.data);
      setPolicies(res.data);
    } catch (err) {
      alert("❌ Failed to load policies");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setPolicyForm({
      policyName: "",
      premiumAmount: "",
      description: "",
      coverageType: "",
      duration: "",
      terms: ""
    });
  };

  const createPolicy = async (e) => {
    e.preventDefault();

    const payload = {
      policyName: policyForm.policyName,
      premiumAmount: Number(policyForm.premiumAmount),
      duration: policyForm.duration ? Number(policyForm.duration) : null,
      description: policyForm.description,
      coverageType: policyForm.coverageType?.toUpperCase(),
      terms: policyForm.terms
    };

    try {
      await api.post("/policy/create", payload);
      alert("✅ Policy Created");

      resetForm();
      await loadPolicies();
      setActiveTab("view");

    } catch (err) {
      alert("❌ Create failed");
    }
  };

  const deletePolicy = async (id) => {
    if (!window.confirm("Delete this policy?")) return;

    try {
      await api.delete(`/policy/admin/policies/${id}`);
      alert("✅ Deleted");
      loadPolicies();
    } catch {
      alert("❌ Delete failed");
    }
  };

  const startEdit = (p) => {
    setSelectedPolicy(p);
    setPolicyForm(p);
    setActiveTab("edit");
  };

  const updatePolicy = async (e) => {
    e.preventDefault();

    const payload = {
      policyName: policyForm.policyName,
      premiumAmount: Number(policyForm.premiumAmount),
      duration: policyForm.duration ? Number(policyForm.duration) : null,
      description: policyForm.description,
      coverageType: policyForm.coverageType?.toUpperCase(),
      terms: policyForm.terms
    };

    try {
      await api.put(`/policy/admin/policies/${selectedPolicy.id}`, payload);
      alert("✅ Updated");

      resetForm();
      setSelectedPolicy(null);
      loadPolicies();
      setActiveTab("view");

    } catch {
      alert("❌ Update failed");
    }
  };

  return (
    <div className="dashboard-container">

      <div className="header">
        <h2>⚙️ Policy Management</h2>
        <button onClick={onBack}>⬅ Back</button>
      </div>

      <div className="tabs">
        <button onClick={() => setActiveTab("view")}>📋 View</button>
        <button onClick={() => setActiveTab("create")}>➕ Create</button>
      </div>

      {/* ================= VIEW ================= */}
      {activeTab === "view" && (
        <>
          {loading ? (
            <p>Loading...</p>
          ) : policies.length === 0 ? (
            <p>No policies found</p>
          ) : (
            <div className="table-container">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Premium</th>
                    <th>Type</th>
                    <th>Duration</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {policies.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <b>{p.policyName}</b>
                        <div style={{ fontSize: "12px", color: "#666" }}>
                          {p.description}
                        </div>
                      </td>
                      <td>₹{p.premiumAmount}</td>
                      <td>{p.coverageType}</td>
                      <td>{p.duration}</td>
                      <td>
                        <button onClick={() => startEdit(p)}>✏️</button>
                        <button onClick={() => deletePolicy(p.id)}>🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* ================= CREATE ================= */}
      {activeTab === "create" && (
        <form className="form" onSubmit={createPolicy}>
          <h3>Create Policy</h3>

          <input placeholder="Policy Name"
            value={policyForm.policyName}
            onChange={(e) => setPolicyForm({ ...policyForm, policyName: e.target.value })}
            required
          />

          <input type="number" placeholder="Premium"
            value={policyForm.premiumAmount}
            onChange={(e) => setPolicyForm({ ...policyForm, premiumAmount: e.target.value })}
            required
          />

          <select
            value={policyForm.coverageType}
            onChange={(e) => setPolicyForm({ ...policyForm, coverageType: e.target.value })}
          >
            <option value="">Select Type</option>
            <option value="Health">Health</option>
            <option value="Life">Life</option>
            <option value="Vehicle">Vehicle</option>
          </select>

          <input type="number" placeholder="Duration (months)"
            value={policyForm.duration}
            onChange={(e) => setPolicyForm({ ...policyForm, duration: e.target.value })}
          />

          <textarea placeholder="Description"
            value={policyForm.description}
            onChange={(e) => setPolicyForm({ ...policyForm, description: e.target.value })}
          />

          <textarea placeholder="Terms"
            value={policyForm.terms}
            onChange={(e) => setPolicyForm({ ...policyForm, terms: e.target.value })}
          />

          <button type="submit">Create Policy</button>
        </form>
      )}

      {/* ================= EDIT ================= */}
      {activeTab === "edit" && (
        <form className="form" onSubmit={updatePolicy}>
          <h3>Edit Policy</h3>

          <input
            value={policyForm.policyName}
            onChange={(e) => setPolicyForm({ ...policyForm, policyName: e.target.value })}
          />

          <input type="number"
            value={policyForm.premiumAmount}
            onChange={(e) => setPolicyForm({ ...policyForm, premiumAmount: e.target.value })}
          />

          <button type="submit">Update</button>
        </form>
      )}

    </div>
  );
};

export default AdminPolicyManagement;