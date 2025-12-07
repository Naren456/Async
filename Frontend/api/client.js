import axios from "axios";
import * as SecureStore from 'expo-secure-store';

const Production = "https://async-vr1z.onrender.com";
const Local = "http://10.51.6.234:8000";

export const API_BASE_URL = Production;

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
