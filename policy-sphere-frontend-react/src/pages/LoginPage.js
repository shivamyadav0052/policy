import React from "react";
import Login from "../components/Login";

const LoginPage = ({ onLoginSuccess, onChangePage }) => {
  return <Login onLoginSuccess={onLoginSuccess} onChangePage={onChangePage} />;
};

export default LoginPage;
