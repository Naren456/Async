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
    console.error('GetAllUsers Error:', error);
    throw error.response?.data || { message: 'Something went wrong' };
  }
};
