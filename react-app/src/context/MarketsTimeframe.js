import React, { createContext, useContext, useState, useEffect } from 'react';

const MarketsContext = createContext();

export function MarketsProvider({children}) {
    const [timeframe, setTimeframe] = useState('INTRADAY');

    return (
        <MarketsContext.Provider value={{ timeframe, setTimeframe }}>
            {children}
        </MarketsContext.Provider>
    );
}

export function useMarketsContext() {
    return useContext(MarketsContext);
}
