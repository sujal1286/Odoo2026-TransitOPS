import axios from "axios";

// Determine API base URL from environment or use default (proxied path)
const API_URL = import.meta.env.VITE_API_URL || "/api";

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Crucial for Better Auth session cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Interceptors for global error handling (e.g., redirect on 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If we get an unauthorized error and we are not already on the login page
    if (
      error.response?.status === 401 &&
      window.location.pathname !== "/login"
    ) {
      // You could clear store or redirect here, e.g. window.location.href = '/login'
      console.warn("Unauthorized access - session might be expired.");
    }
    return Promise.reject(error);
  }
);
