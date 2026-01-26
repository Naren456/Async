import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for stored auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const stored = await chrome.storage.local.get(['authToken', 'currentUser']);
        if (stored.authToken && stored.currentUser) {
          setAuthToken(stored.authToken);
          setCurrentUser(stored.currentUser);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
      }
    };
    checkAuth();
  }, []);

  const login = async (token, user) => {
    await chrome.storage.local.set({ authToken: token, currentUser: user });
    setAuthToken(token);
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await chrome.storage.local.remove(['authToken', 'currentUser']);
    setAuthToken(null);
    setCurrentUser(null);
    setIsAuthenticated(false);
    setAssignments([]);
  };

  const value = {
    currentUser,
    authToken,
    assignments,
    setAssignments,
    loading,
    setLoading,
    error,
    setError,
    isAuthenticated,
    login,
    logout,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
