import axios from "axios";
import * as SecureStore from 'expo-secure-store';


const Local = "http://192.168.1.68:8000";
const Local1 ="http://10.185.142.169:8000"

export const API_BASE_URL = process.env.PRODUCTION_BACKEND_URL || Local;


const api = axios.create({
  baseURL: API_BASE_URL,
});


api.interceptors.request.use(async (config) => {
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


export default api;