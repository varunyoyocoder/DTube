import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  if (config.url !== "/auth/login" && config.url !== "/auth/register") {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (errorRequest) => {
    if (
      errorRequest.config.url === "/auth/login" ||
      errorRequest.config.url === "/auth/token"
    ) {
      return Promise.reject(errorRequest);
    }
    if (errorRequest.response?.status === 401) {
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        // if (!refreshToken) {
        //   localStorage.clear();
        //   window.location.href = "/login";
        //   return Promise.reject(errorRequest);
        // }

        console.log("accesToken invalid,creating new token");
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/token`,
          {
            refreshToken,
          },
        );

        localStorage.setItem("accessToken", response.data.accessToken);

        errorRequest.config.headers.Authorization = `Bearer ${response.data.accessToken}`;

        return api(errorRequest.config);
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          alert("You have been logged out due to inactivity");

          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");

          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(errorRequest);
  },
);

export default api;
