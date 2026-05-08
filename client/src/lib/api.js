import axios from "axios"; // Axios is HTTP client library.

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1",
  withCredentials: true, // sends cookies (JWT token)
  headers: {
    "Content-Type": "application/json",
  },
});

// Auto handle errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || "Something went wrong";
    return Promise.reject(new Error(message));
  }
);

export default api;