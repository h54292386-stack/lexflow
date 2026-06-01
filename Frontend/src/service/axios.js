import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes(
      "refresh-token"
    )
    ) {
      originalRequest._retry = true;

      try {
        const role =
          localStorage.getItem("role");

        let refreshUrl =
          "/client/refresh-token";

        if (role === "lawyer") {

          refreshUrl =
            "/lawyer/refresh-token";

        } else if (
          role === "admin"
        ) {

          refreshUrl =
            "/admin/refresh-token";
        }

        const res =
          await api.post(refreshUrl);

        const newAccessToken = res.data.accessToken;

        localStorage.setItem("accessToken", newAccessToken);

        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newAccessToken}`,
        };
        return api(originalRequest);

      } catch (err) {
        console.log("Session expired. Please login again.");

        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        localStorage.removeItem("caseDraft");
        const role =
          localStorage.getItem("role");

        localStorage.clear();

        if (role === "admin") {

          window.location.href =
            "/admin/login";

        } else if (
          role === "lawyer"
        ) {

          window.location.href =
            "/lawyer/login";

        } else {

          window.location.href =
            "/login";
        }

        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;