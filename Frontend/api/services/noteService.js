import client from '../client';
import { ENDPOINTS } from '../endpoints';

export const UploadNote = async (formData) => {
  try {
    const response = await client.post(ENDPOINTS.NOTES.UPLOAD, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('UploadNote Error:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to upload note' };
  }
};

export const DeleteNote = async (noteId) => {
  try {
    const response = await client.delete(ENDPOINTS.NOTES.BY_ID(noteId));
    return response.data;
  } catch (error) {
    console.error('DeleteNote Error:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to delete note' };
  }
};
