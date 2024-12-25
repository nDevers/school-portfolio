'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import appConfig from '@/configs/appConfig';
import { getCookie } from 'cookies-next';
import jwt from 'jsonwebtoken';
import { decryptData } from '@/util/crypto.client';

// Create a context
const UserContext = createContext();

// Custom hook to use the UserContext
export const useUser = () => {
    return useContext(UserContext);
};

// UserProvider component to wrap your app and provide the user data
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Function to update user data (used after login)
    const updateUser = () => {
        const token = getCookie(appConfig?.CurrentUserToken);
        if (!token) {
            return;
        }
        const decryptedToken = decryptData(token);
        if (decryptedToken) {
            const decodedToken = jwt.decode(decryptedToken);
            const userData = decodedToken?.currentUser;
            setUser(userData);
        } else {
            setUser(null);
        }
    };

    // Initially set the user when the app loads
    useEffect(() => {
        updateUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, updateUser }}>
            {children}
        </UserContext.Provider>
    );
};
