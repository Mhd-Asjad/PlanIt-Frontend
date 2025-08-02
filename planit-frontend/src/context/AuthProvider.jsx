import React, { createContext, useContext, useState } from 'react'
const authContext = createContext()

export function AuthProvider({ children }) {
    const [access_token , setToken] = useState(localStorage.getItem('access_token') || null);
    console.log(access_token, 'token in AuthProvider');
    const [user , setUser] = useState(null);

    const isAuthenticated = !!access_token;

    const saveToken = (token) => {
        setToken(token);
        localStorage.setItem('access_token' , token);
    }

    const logout = () => {
        setToken(null);
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        setUser(null);
    }

    const saveUser = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    }

    return (
        <authContext.Provider value={{ saveToken , logout , saveUser , isAuthenticated }} >
            {children}
        </authContext.Provider>
    )
}

export const useAuth = () => useContext(authContext);