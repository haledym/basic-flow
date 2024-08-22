import axios from "axios";

// import.meta.env.VITE_REACT_APP_BASE_URL,
const API_URL = import.meta.env.VITE_API_URL || "https://dym-tasks-dev-be.vercel.app/v1";

export const axiosInstance = axios.create({
  baseURL: API_URL,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken && config?.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
