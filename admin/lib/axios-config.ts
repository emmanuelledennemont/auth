import axios from "axios";
import Cookies from "js-cookie";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:3001",
  withCredentials: true,
});

// Intercepter le cookies pour chaque requête
axiosInstance.interceptors.request.use((config) => {
  const token = Cookies.get("EMMANUELLE-AUTH");
  if (token) {
    config.headers["X-EMMANUELLE-AUTH"] = token;
  }
  return config;
});
