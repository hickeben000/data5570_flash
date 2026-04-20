import axios from "axios";
import { API_URL } from "@env";
import { getOpenAIApiKey } from "../utils/storage";

// EXPO_PUBLIC_* is inlined by Expo Metro from .env (reliable on web + Expo Go).
// @env (Babel) is a fallback. If both are missing, localhost only works when Django runs locally.
const resolvedApiUrl = (
  process.env.EXPO_PUBLIC_API_URL ||
  API_URL ||
  "http://localhost:8000"
).replace(/\/$/, "");

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
  const apiKey = await getOpenAIApiKey();
  if (!apiKey) {
    throw new Error(message);
  }
  return {
    "X-OpenAI-Api-Key": apiKey,
  };
}

export default api;
