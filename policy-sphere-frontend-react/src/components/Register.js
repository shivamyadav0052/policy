import React, { useState } from "react";
import { registerUser } from "../services/authService";

const Register = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "ROLE_CUSTOMER",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await registerUser(user);
      setMessage("Registration completed successfully! 🎉");
      setMessageType("success");

      setUser({
        name: "",
        email: "",
        password: "",
        role: "ROLE_CUSTOMER",
      });
    } catch (error) {
      setMessage("Registration failed. Please check your details and try again." );
      setMessageType("error");
    }
  };

  return (
    <div className="form-container">
      <div className="brand-area">
        <div className="badge">✨</div>
        <h2>Insurance Policy Management</h2>
        <p>Create your account to get started with policy tracking.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="field-group">
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            type="text"
            name="name"
            placeholder="John Doe"
            value={user.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field-group">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="you@example.com"
            value={user.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Strong password"
            value={user.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field-group">
          <label htmlFor="role">Role</label>
          <select id="role" name="role" value={user.role} onChange={handleChange}>
            <option value="ROLE_CUSTOMER">Customer</option>
            <option value="ROLE_AGENT">Agent</option>
            <option value="ROLE_ADMIN">Admin</option>
          </select>
        </div>

        <button type="submit" className="btn-primary">Register</button>
      </form>

      {message && (
        <p className={`message message-${messageType}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default Register;