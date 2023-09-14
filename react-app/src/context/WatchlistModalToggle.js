import React, { createContext, useContext, useState, useEffect } from 'react';

const WatchlistContext = createContext();

export function WatchlistProvider({children}) {
    const [viewWatchlist, setViewWatchlist] = useState(false);

    return (
        <WatchlistContext.Provider value={{ viewWatchlist, setViewWatchlist }}>
            {children}
        </WatchlistContext.Provider>
    );
}

export function useWatchlistToggle() {
    return useContext(WatchlistContext);
}
