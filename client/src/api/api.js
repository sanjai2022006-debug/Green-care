import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// DEBUG VERSION
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  console.log("TOKEN FROM STORAGE:", token); // debug

  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  console.log("HEADERS SENT:", config.headers); // debug

  return config;
});

export default api;