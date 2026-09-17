import axios from "axios";
import * as SecureStore from '../utils/secureStore';
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
export const ORIGIN = process.env.EXPO_PUBLIC_ORIGIN;

if (!API_BASE_URL) {
  console.warn("WARNING: EXPO_PUBLIC_API_BASE_URL is not set - API calls will fail");
}

const getBaseUrl = () => {
  // On web dev localhost, force localhost:8000 even if .env points to vercel (for testing)
  if (typeof window !== "undefined" && window.location.hostname === "localhost" && API_BASE_URL?.includes("vercel.app")) {
    return "http://localhost:8000";
  }
  // Fallback for production Vercel when env not injected (common after `vercel --prod` without dashboard env)
  if (!API_BASE_URL && typeof window !== "undefined" && window.location.hostname.includes("vercel.app")) {
    return "https://async-server.vercel.app";
  }
  return API_BASE_URL || "http://localhost:8000";
};

const client = axios.create({
  baseURL: getBaseUrl(),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.request.use(async (config) => {
  try {
    const token = await SecureStore.getItemAsync('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    console.error("Error attaching auth token to request:", e);
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired - clear and redirect to welcome (avoid infinite loop)
      try {
        const token = await SecureStore.getItemAsync('authToken');
        if (token) {
          await SecureStore.deleteItemAsync('authToken');
          // Don't auto-redirect here to avoid navigation outside React context
          console.warn("401 Unauthorized - token cleared, user should re-login");
        }
      } catch {}
    }
    return Promise.reject(error);
  }
);

export default client;
