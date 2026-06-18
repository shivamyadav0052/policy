import axios from "axios";

const BASE_URL = "http://localhost:8183/auth";

export const registerUser = (user) => {
  return axios.post(`${BASE_URL}/register`, user);
};

export const loginUser = (credentials) => {
  return axios.post(`${BASE_URL}/login`, credentials);
};