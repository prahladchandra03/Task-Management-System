import axios from "axios";

// 1. Apna Backend URL set karein
// Local development ke liye localhost, Production ke liye Vercel URL use karein
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://task-management-system-7mtg-qnhfk8d3s.vercel.app/api"; 

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. Request Interceptor: Request bhejne se pehle ye chalta hai
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    
    // Debugging ke liye: Console me check karein ki token mil raha hai ya nahi
    if (token) {
      console.log("🟢 Attaching Token to request:", config.url); // Ye line console me dikhegi
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.log("🔴 No Token found for request:", config.url);
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// 3. Response Interceptor: Error handle karne ke liye
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Agar error 401 (Unauthorized) hai aur humne already retry nahi kiya hai
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log("🔄 Token expired! Attempting refresh...");
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No refresh token");

        // Naya access token mangwana
        const { data } = await axios.post(`${API_URL}/auth/refresh-token`, {
          token: refreshToken,
        });

        console.log("✅ Token Refreshed!");

        // Naya token save karna
        localStorage.setItem("accessToken", data.accessToken);

        // Fail hui request ko naye token ke sath dobara bhejna
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Agar refresh bhi fail ho jaye, to logout kar do
        console.log("❌ Refresh failed. Logging out.");
        localStorage.clear();
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;