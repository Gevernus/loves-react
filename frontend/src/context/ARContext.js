import React, { createContext, useState, useContext } from 'react';

const ARContext = createContext();

export const ARProvider = ({ children }) => {
    const [params, setParams] = useState({
        lipsColor: "0 0 0 0",
        browsColor: "0 0 0 0",
        eyeShadow: "0 0 0 0",
        eyeLiner: "0 0 0 0",
        hair: "0 0 0 0",
        blushes: "0 0 0 0",
        eyeLashes: "0 0 0 0",
        softlight: "0.0"
    });

    const [currentSection, setCurrentSection] = useState('lips');

    const updateParams = (newParams) => {
        // setParams(prev => ({ ...prev, ...newParams }));
    };

    return (
        <ARContext.Provider value={{
            params,
            updateParams,
            currentSection,
            setCurrentSection
        }}>
            {children}
        </ARContext.Provider>
    );
};

export const useAR = () => useContext(ARContext);