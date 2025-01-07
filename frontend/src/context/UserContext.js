import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import WebApp from '@twa-dev/sdk';

const UserContext = createContext();
const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const hasInitialized = useRef(false);

    useEffect(() => {
        const fetchUser = async () => {
            if (hasInitialized.current) return;
            hasInitialized.current = true;
            try {
                WebApp.ready();
                const tgUser = WebApp.initDataUnsafe.user || { id: 1, first_name: 'Test', last_name: 'User', username: 'test' };

                if (tgUser) {
                    const linkHash = WebApp.initDataUnsafe.start_param;
                    // Send user data to the backend
                    // const response = await fetch('https://touch-the-beauty-ai.shop/api/users', {
                    const response = await fetch(`${apiUrl}/users`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            telegramId: tgUser.id,
                            firstName: tgUser.first_name,
                            lastName: tgUser.last_name,
                            username: tgUser.username,
                            linkHash: linkHash,
                        }),
                    });

                    const userData = await response.json();
                    setUser(userData);
                }
            } catch (error) {
                console.error('Error initializing user:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const setOnboarded = async ({ selectedCategories }) => {
        if (!user) return;

        const payload = {
            isOnboarded: true,
            checkCare: selectedCategories.checkCare,
            checkDecorate: selectedCategories.checkDecorate,
            checkWeight: selectedCategories.checkWeight,
            checkAccessories: selectedCategories.checkAccessories,
        };

        try {
            // const response = await fetch(`https://touch-the-beauty-ai.shop/api/users/${user._id}`, {
            const response = await fetch(`${apiUrl}/users/${user._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const updatedUser = await response.json();
                setUser(updatedUser); // Update local user state with the new data
            } else {
                console.error('Failed to update user:', response.statusText);
            }
        } catch (error) {
            console.error('Error setting onboarded:', error);
        }
    };

    return (
        <UserContext.Provider value={{ user, setUser, loading, setOnboarded }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    return useContext(UserContext);
};
