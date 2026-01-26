import { useState, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';

export const useAssignments = () => {
  const { currentUser, authToken, assignments, setAssignments } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAssignments = useCallback(async () => {
    if (!authToken || !currentUser?.cohortNo) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await api.getAssignments(authToken, currentUser.cohortNo);
      setAssignments(data.assignments || []);
      return { success: true };
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch assignments';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [authToken, currentUser, setAssignments]);

  const toggleCompletion = useCallback(async (assignmentId) => {
    if (!authToken) {
      return { success: false, error: 'Not authenticated' };
    }

    // Optimistic update
    const previousAssignments = [...assignments];

    setAssignments(prev =>
      prev.map(assignment => {
        if (assignment.id === assignmentId) {
          return { ...assignment, Completed: !assignment.Completed };
        }
        return assignment;
      })
    );

    try {
      const result = await api.toggleCompletion(authToken, assignmentId);
      
      // Update with server source of truth
      setAssignments(prev =>
        prev.map(assignment =>
          assignment.id === assignmentId
            ? { ...assignment, Completed: result.completed }
            : assignment
        )
      );

      return { success: true };
    } catch (err) {
      // Revert on error
      setAssignments(previousAssignments);
      
      const errorMessage = err.message || 'Failed to toggle completion';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [authToken, assignments, setAssignments]);

  return {
    assignments,
    fetchAssignments,
    toggleCompletion,
    loading,
    error,
  };
};
