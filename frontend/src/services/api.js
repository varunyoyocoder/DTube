import axios from "axios";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});
const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/token",
  "/auth/dauth/token",
  "/auth/google/token",
];

api.interceptors.request.use((config) => {
  if (!authRoutes.includes(config.url)) {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  }
  return config;
});


api.interceptors.response.use((response) => response,
  async (errorRequest) => {
    const originalRequest = errorRequest.config;
    console.log("Response interceptor:", errorRequest.response?.status);
    if (!originalRequest || authRoutes.includes(originalRequest.url) || originalRequest._retry) {
      return Promise.reject(errorRequest);
    }
  if (errorRequest.response?.status === 403 && errorRequest.response?.data?.error === "User is banned") {
      alert("Your account has been banned.");
      localStorage.clear();
      window.location.href = "/login";
      return Promise.reject(errorRequest);
    }
    if (errorRequest.response?.status === 401) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          localStorage.clear();
          window.location.href = "/login";
          return Promise.reject(errorRequest);
        }
        console.log("Access token expired. Refreshing...");
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/token`,
          {refreshToken,}
        );
        const newAccessToken = response.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);
        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;
        console.log("Retrying original request...");
        return api(originalRequest);
      } catch (err) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }
    return Promise.reject(errorRequest);
  }
);
export default api;