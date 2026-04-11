import axios from "axios";
import { API_URL } from "@env";

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Token ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

export default api;
