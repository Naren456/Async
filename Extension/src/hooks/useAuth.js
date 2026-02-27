import { useState, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { launchGoogleAuth } from '../services/auth';
import { api } from '../services/api';

export const useAuth = () => {
  const { login, logout, currentUser, isAuthenticated } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGoogleLogin = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Step 1: Launch OAuth flow and get ID token
      const idToken = await launchGoogleAuth();

      // Step 2: Send ID token to backend for verification
      const response = await api.googleSignIn(idToken);

      // Step 3: Save to context and storage
      await login(response.token, response.user);

      return { success: true };
    } catch (err) {
      const errorMessage = err.message || 'Authentication failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [login]);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, [logout]);

  return {
    login: handleGoogleLogin,
    logout: handleLogout,
    currentUser,
    isAuthenticated,
    loading,
    error,
  };
};
