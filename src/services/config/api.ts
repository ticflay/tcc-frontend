import axios from "axios";
import { SERVER_URL } from "./server";

const getSession = () => {
  const state = localStorage.getItem("token");
  if (state) {
    return JSON.parse(state);
  }
  return null;
};

const api = axios.create({
  baseURL: SERVER_URL,
  // timeout: 2000,w
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (config.url?.endsWith("login") || config.url?.endsWith("register")) {
    return config;
  }
  const token = getSession();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    return Promise.resolve(response);
  },
  async (error) => {
    const { url } = error.config;
    const { status } = error.response;
    console.log('oi o erro aq', error);
    if (url.endsWith("logout") || url.endsWith("validate_token")) {
      return;
    }

    if(status === 401 && window.location.pathname !== '/login') {
      localStorage.removeItem("token");
      // window.location.pathname = "login";
      return;
    }
    
    Promise.reject(error);
    throw error;
  }
);

export default api;
