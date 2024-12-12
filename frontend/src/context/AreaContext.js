import React, { createContext, useContext, useState } from 'react';

const AreaContext = createContext();

export const AreaProvider = ({ children }) => {
    const [location, setLocation] = useState({ sigungu: "해운대구", emd: "" }); 

    return (
        <LocationContext.Provider value={{ location, setLocation }}>
            {children}
        </LocationContext.Provider>
    );
};

export const useLocation = () => useContext(LocationContext);