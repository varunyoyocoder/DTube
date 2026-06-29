import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const accesToken = localStorage.getItem("accessToken");

  if (accesToken) {
    config.headers.Authorization = `Bearer ${accesToken}`;
  }

  return config;
});


// api.interceptors.response.use(
//   (response) => response,
//   async (errorRequest) => {
//     if (request.response?.status === 401) {
//       try {
//         const response = await axios.post("http://localhost:3000/auth/token", {
//           refreshToken,
//         });

//         localStorage.setItem("accessToken", response.data.accessToken);

//         errorRequest.config.headers.Authorization = `Bearer ${response.data.accessToken}`;

//         return api(errorRequest.config);
//       } catch (err) {
//         if (err.response?.status === 401 || err.response?.status === 403) {
//           // Refresh token is invalid or expired

//           localStorage.removeItem("accessToken");
//           localStorage.removeItem("refreshToken");

//           window.location.href = "/login";
//         }
//       }
//     }
//     return Promise.reject(request);
//   },
// );

export default api;

