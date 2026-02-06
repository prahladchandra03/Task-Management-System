import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://task-management-system-5-cx3p.onrender.com/api";

// 1. Check if running in browser
const isBrowser = typeof window !== "undefined";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Refresh Token variables
let isRefreshing = false;
let failedQueue: any[] = [];

// Helper function to process the queue
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// --- LOGOUT HELPER ---
export const logoutUser = () => {
  if (isBrowser) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    // Aap chaho to localStorage.clear() bhi kar sakte ho
    window.location.href = "/auth/login";
  }
};

// --- REQUEST INTERCEPTOR ---
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (isBrowser) {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// --- RESPONSE INTERCEPTOR ---
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // 1. Handle 401 Unauthorized (Token Expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Agar pehle se ek refresh request chal rahi hai, toh baaki sab queue me daldo
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = isBrowser ? localStorage.getItem("refreshToken") : null;
        if (!refreshToken) throw new Error("No Refresh Token Found");

        // Request new access token using refresh token
        const { data } = await axios.post(`${API_URL}/auth/refresh-token`, {
          token: refreshToken,
        });

        const newToken = data.accessToken;
        if (isBrowser) localStorage.setItem("accessToken", newToken);

        processQueue(null, newToken);
        
        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);

      } catch (refreshError) {
        processQueue(refreshError, null);
        logoutUser(); // Token refresh fail hua toh direct logout
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // 2. Handle 403 Forbidden (Permission Issue)
    if (error.response?.status === 403) {
      console.error("⛔ Access Denied: You don't have permission.");
    }

    return Promise.reject(error);
  }
);

export default api;