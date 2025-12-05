import client from '../client';
import { ENDPOINTS } from '../endpoints';

export const AuthsignUp = async (userData) => {
  try {
    const response = await client.post(ENDPOINTS.AUTH.SIGNUP, userData);
    return response.data;
  } catch (error) {
    console.error("Signup API Error:", error);
    if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
      throw { message: "Cannot connect to server. Please check your internet connection." };
    }
    throw error.response?.data || { message: "Something went wrong" };
  }
};

export const AuthsignIn = async (userData) => {
  try {
    const response = await client.post(ENDPOINTS.AUTH.SIGNIN, userData);
    return response.data;
  } catch (error) {
    console.error("SignIn API Error:", error);
    if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
      throw { message: "Cannot connect to server. Please check your internet connection." };
    }
    throw error.response?.data || { message: "Something went wrong" };
  }
};

export const GetMe = async () => {
  try {
    const response = await client.get(ENDPOINTS.AUTH.ME);
    return response.data;
  } catch (error) {
    console.error("GetMe API Error:", error.response?.status, error.message);
    throw error.response?.data || { message: "Token validation failed" };
  }
};

export const UpdateProfile = async (payload) => {
  try {
    const response = await client.put(ENDPOINTS.AUTH.ME, payload);
    return response.data;
  } catch (error) {
    console.error('UpdateProfile Error:', error);
    throw error.response?.data || { message: 'Something went wrong' };
  }
};

export const AuthGoogleSignIn = async (idToken) => {
  try {
    const response = await client.post(ENDPOINTS.AUTH.GOOGLE, { idToken });
    return response.data;
  } catch (error) {
    console.error('AuthGoogleSignIn Error:', error);
    throw error.response?.data || { message: 'Something went wrong' };
  }
};

export const UpdatePushToken = async (pushToken) => {
  try {
    const response = await client.put(ENDPOINTS.AUTH.PUSH_TOKEN, { pushToken });
    return response.data;
  } catch (error) {
    console.error('UpdatePushToken Error:', error);
    throw error;
  }
};
