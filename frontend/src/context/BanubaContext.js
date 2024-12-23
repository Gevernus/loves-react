import React, { createContext, useContext, useState } from 'react';
import banubaService from '../services/banubaService';

const BanubaContext = createContext(null);

export const BanubaProvider = ({ children }) => {
    const [isInitialized, setIsInitialized] = useState(false);
    const [error, setError] = useState(null);
    const [dom, setDom] = useState(null);
    const [player, setPlayer] = useState(null);
    
    const initialize = async () => {
        try {
            const { Dom, player } = await banubaService.initialize();
            setDom(Dom);
            setPlayer(player);
            setIsInitialized(true);
            return { Dom, player };
        } catch (err) {
            setError('Failed to initialize AR experience. Please try again.');
            console.error('AR initialization error:', err);
            throw err;
        }
    };

    return (
        <BanubaContext.Provider value={{
            isInitialized,
            error,
            dom,
            player,
            initialize,
            setParam: (...args) => banubaService.setParam(...args)
        }}>
            {children}
        </BanubaContext.Provider>
    );
};

export const useBanuba = () => {
    const context = useContext(BanubaContext);
    if (!context) {
        throw new Error('useBanuba must be used within a BanubaProvider');
    }
    return context;
};