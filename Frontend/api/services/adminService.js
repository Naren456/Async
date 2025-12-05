import client from '../client';
import { ENDPOINTS } from '../endpoints';

export const GetAdminStats = async () => {
  try {
    const response = await client.get(ENDPOINTS.ADMIN.STATS);
    return response.data;
  } catch (error) {
    console.error('GetAdminStats Error:', error);
    throw error.response?.data || { message: 'Something went wrong' };
  }
};

export const GetAllUsers = async () => {
  try {
    const response = await client.get(ENDPOINTS.ADMIN.USERS);
    return response.data;
  } catch (error) {
    console.error("GetAllUsers API Error:", error);
    throw error.response?.data || { message: "Something went wrong" };
  }
};

export const SendNotification = async (cohort, title, body) => {
  try {
    const response = await client.post(ENDPOINTS.ADMIN.NOTIFICATIONS, { cohort, title, body });
    return response.data;
  } catch (error) {
    console.error("SendNotification API Error:", error);
    throw error.response?.data || { message: "Something went wrong" };
  }
};
