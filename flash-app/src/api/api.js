import axios from "axios";
import { API_URL } from "@env";
import { getGeminiApiKey } from "../utils/storage";

const resolvedApiUrl = (API_URL || "http://localhost:8000").replace(/\/$/, "");

const api = axios.create({
  baseURL: `${resolvedApiUrl}/api`,
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Token ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

export async function getRequiredAiHeaders(message) {
  const apiKey = await getGeminiApiKey();
  if (!apiKey) {
    throw new Error(message);
  }
  return {
    "X-Gemini-Api-Key": apiKey,
  };
}

export default api;
