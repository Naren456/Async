import client from '../client';
import { ENDPOINTS } from '../endpoints';

export const GetAssignments = async (cohort) => {
  try {
    const response = await client.get(ENDPOINTS.ASSIGNMENTS.COURSERA(cohort));
    
    return response.data;
  } catch (error) {
    console.error("Error in GetAssignments:", error);
    if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
      throw new Error("Cannot connect to server. Please check your internet connection.");
    }
    return {};
  }
};

export const CreateAssignment = async (assignmentData) => {
  try {
    const response = await client.post(ENDPOINTS.ASSIGNMENTS.BASE, assignmentData);
    return response.data;
  } catch (error) {
    console.error('CreateAssignment Error:', error);
    throw error.response?.data || { message: 'Something went wrong' };
  }
};

export const UpdateAssignment = async (id, assignmentData) => {
  try {
    const response = await client.put(ENDPOINTS.ASSIGNMENTS.BY_ID(id), assignmentData);
    return response.data;
  } catch (error) {
    console.error('UpdateAssignment Error:', error);
    throw error.response?.data || { message: 'Something went wrong' };
  }
};

export const DeleteAssignment = async (assignmentId) => {
  try {
    const response = await client.delete(ENDPOINTS.ASSIGNMENTS.BY_ID(assignmentId));
    return response.data;
  } catch (error) {
    console.error('DeleteAssignment Error:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to delete assignment' };
  }
};

export const GetAssignmentsByCohort = async (cohortNo) => {
  try {
    const response = await client.get(ENDPOINTS.ASSIGNMENTS.BY_COHORT(cohortNo));
    return response.data;
  } catch (error) {
    console.error('GetAssignmentsByCohort Error:', error);
    if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
      throw new Error('Cannot connect to server. Please check your internet connection.');
    }
    throw error.response?.data || { message: 'Something went wrong' };
  }
};

export const toggleAssignmentCompletion = async (assignmentId) => {
  try {
    const response = await client.post(`${ENDPOINTS.ASSIGNMENTS.BASE}/toggle-completion`,{assignmentId});
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update status' };
  }
};