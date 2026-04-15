import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const AUTH_TOKEN_KEY = "flash_auth_token";
const AUTH_USER_KEY = "flash_auth_user";
const GEMINI_API_KEY = "flash_gemini_api_key";

async function getStoredValue(key) {
  if (Platform.OS === "web") {
    return localStorage.getItem(key);
  }
  return SecureStore.getItemAsync(key);
}

async function setStoredValue(key, value) {
  if (Platform.OS === "web") {
    localStorage.setItem(key, value);
    return;
  }
  await SecureStore.setItemAsync(key, value);
}

async function deleteStoredValue(key) {
  if (Platform.OS === "web") {
    localStorage.removeItem(key);
    return;
  }
  await SecureStore.deleteItemAsync(key);
}

export async function persistSession({ token, user }) {
  await setStoredValue(AUTH_TOKEN_KEY, token);
  await setStoredValue(AUTH_USER_KEY, JSON.stringify(user));
}

export async function loadSession() {
  const token = await getStoredValue(AUTH_TOKEN_KEY);
  const userText = await getStoredValue(AUTH_USER_KEY);
  if (!token || !userText) {
    return null;
  }

  try {
    return {
      token,
      user: JSON.parse(userText),
    };
  } catch (_error) {
    await clearSession();
    return null;
  }
}

export async function clearSession() {
  await deleteStoredValue(AUTH_TOKEN_KEY);
  await deleteStoredValue(AUTH_USER_KEY);
}

export async function getGeminiApiKey() {
  return (await getStoredValue(GEMINI_API_KEY)) || "";
}

export async function setGeminiApiKey(value) {
  await setStoredValue(GEMINI_API_KEY, value.trim());
}

export async function clearGeminiApiKey() {
  await deleteStoredValue(GEMINI_API_KEY);
}
