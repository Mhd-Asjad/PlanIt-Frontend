import React, { createContext, useContext, useState } from 'react';

const authContext = createContext();

export function AuthProvider({ children }) {
  const [access_token, setToken] = useState(localStorage.getItem('access_token') || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

  const isAuthenticated = !!access_token;

  const saveToken = (token) => {
    setToken(token);
    localStorage.setItem('access_token', token);
  };

  const saveUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  };

  return (
    <authContext.Provider value={{ access_token, saveToken, saveUser, logout, isAuthenticated, user }}>
      {children}
    </authContext.Provider>
  );
}

export const useAuth = () => useContext(authContext);
