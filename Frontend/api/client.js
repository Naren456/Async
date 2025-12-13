import axios from "axios";
import * as SecureStore from 'expo-secure-store';
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

const client = axios.create({
  baseURL: API_BASE_URL,
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

export default client;
