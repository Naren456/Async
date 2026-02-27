import client from '../client';
import { ENDPOINTS } from '../endpoints';

export const GetSubjects = async () => {
  try {
    const response = await client.get(ENDPOINTS.SUBJECTS.BASE);
    return response.data;
  } catch (error) {
    console.error('GetSubjects Error:', error);
    if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
      throw new Error('Cannot connect to server. Please check your internet connection.');
    }
    throw error.response?.data || { message: 'Something went wrong' };
  }
};

export const GetUserSubjectsWithNotes = async (userId, opts = {}) => {
  try {
    const params = new URLSearchParams();
    if (opts.semester !== undefined && opts.term !== undefined) {
      params.set('semester', String(opts.semester));
      params.set('term', String(opts.term));
    }
    const qs = params.toString();
    const url = qs ? `${ENDPOINTS.SUBJECTS.USER(userId)}?${qs}` : ENDPOINTS.SUBJECTS.USER(userId);
    const response = await client.get(url);
    return response.data;
  } catch (error) {
    console.error('GetUserSubjectsWithNotes Error:', error);
    throw error.response?.data || { message: 'Something went wrong' };
  }
};

export const GetSubjectById = async (subjectId) => {
  try {
    const response = await client.get(ENDPOINTS.SUBJECTS.BY_ID(subjectId));
    return response.data;
  } catch (error) {
    console.error('GetSubjectById Error:', error);
    throw error.response?.data || { message: 'Something went wrong' };
  }
};

export const CreateSubject = async (subject) => {
  try {
    const response = await client.post(ENDPOINTS.SUBJECTS.BASE, subject);
    return response.data;
  } catch (error) {
    console.error('CreateSubject Error:', error);
    throw error.response?.data || { message: 'Something went wrong' };
  }
};

export const UpdateSubject = async (code, updates) => {
  try {
    const response = await client.put(ENDPOINTS.SUBJECTS.BY_ID(code), updates);
    return response.data;
  } catch (error) {
    console.error('UpdateSubject Error:', error);
    throw error.response?.data || { message: 'Something went wrong' };
  }
};

export const DeleteSubject = async (subjectId) => {
  try {
    const response = await client.delete(ENDPOINTS.SUBJECTS.BY_ID(subjectId));
    return response.data;
  } catch (error) {
    console.error('DeleteSubject Error:', error);
    throw error.response?.data || { message: 'Something went wrong' };
  }
};
