import React, { useEffect, useState} from "react"



function WatchlistsModal() {

    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (!showModal) return;

        const closeWatchlists = (e) => {
            if (!ulRef.current) return
            if (!ulRef.current.contains(e.target)) {
                setShowModal(false);
            }
        };

        document.addEventListener("click", closeWatchlists);

        return () => document.removeEventListener("click", closeWatchlists);
    }, [showModal]);

    const toggleWatchlists = () => {
        setShowModal(!showModal)
    }

    return (
        <>
            <button className='nav-button'
                id='nav-no-fill'
                onClick={() => toggleWatchlists()}
            >
                WATCHLISTS
            </button>
            {showModal && (
                <div className="watchlist-container">
                    <button onClick={() => setShowModal(false)}>
                        <i class="fa-solid fa-x"></i>
                    </button>
                    <div className="watchlists-dropdown">
                        <div className="watchlist-header">
                            <div className="watchlist-header-left">
                                MY LISTS
                            </div>
                            <button>
                                <i class="fa-solid fa-plus"></i>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
