import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Auto handle errors with retry for sleeping Render server
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const message = error.response?.data?.message || "Something went wrong";
    // Retry once if server is waking up (no response = server sleeping)
    if (!error.response && error.config && !error.config._retry) {
      error.config._retry = true;
      await new Promise(resolve => setTimeout(resolve, 3000));
      return api(error.config);
    }
    return Promise.reject(new Error(message));
  }
);

export default api;