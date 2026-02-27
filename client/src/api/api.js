import axios from "axios";

/*
⚠️ VERY IMPORTANT
Replace the below URL with your REAL Render backend URL.
Example:
https://greencare-backend.onrender.com
*/

const api = axios.create({
  baseURL: "https://your-backend-name.onrender.com/api",
});

api.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default api;