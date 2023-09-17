import React, { createContext, useContext, useState, useEffect } from 'react';

const NavigationContext = createContext();

export function NavigationProvider({children}) {
    const [navView, setNavView] = useState("");

    return (
        <NavigationContext.Provider value={{ navView, setNavView }}>
            {children}
        </NavigationContext.Provider>
    );
}

export function useNavigation() {
    return useContext(NavigationContext);
}
