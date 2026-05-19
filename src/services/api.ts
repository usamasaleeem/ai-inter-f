import axios from "axios";

// 🔐 Private API
const api = axios.create({
  baseURL: "https://api.hirelai.com/api",
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 🚨 Auto logout on token expiry
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 ||
        error.response.status === 403)
    ) {
      // remove token
      localStorage.removeItem("token");

      // redirect login
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

// 🌐 Public API
const publicApi = axios.create({
  baseURL: "https://api.hirelai.com/api",
});

export { api, publicApi };