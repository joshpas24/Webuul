import React, { useEffect, useState, useRef } from "react"
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { thunkDeleteWatchlist, thunkGetWatchlists, thunkRemoveStock } from "../../store/watchlists";

import './WatchlistsModal.css'

function WatchlistsModal() {
    const ulRef = useRef();
    const dispatch = useDispatch();
    const history = useHistory()

    const [listVisibility, setListVisibility] = useState({});
    const [viewWatchlist, setViewWatchlist] = useState(false)

    const lists = useSelector(state=>state.watchlists)

    useEffect(() => {
        dispatch(thunkGetWatchlists())
    }, [dispatch])

    useEffect(() => {
        if (!viewWatchlist) return;

        const closeWatchlists = (e) => {
            if (!ulRef.current) return
            if (!ulRef.current.contains(e.target)) {
                setViewWatchlist(false);
            }
        };

        document.addEventListener("click", closeWatchlists);

        return () => document.removeEventListener("click", closeWatchlists);
    }, [viewWatchlist]);

    const toggleWatchlists = () => {
        setViewWatchlist(!viewWatchlist)
    }

    const toggleList = (listName) => {
        setListVisibility((prevState) => ({
          ...prevState,
          [listName]: !prevState[listName] || false,
        }));
    };

    const handleDeleteList = (watchlistId) => {
        dispatch(thunkDeleteWatchlist(watchlistId))
    }

    const handleRemoveStock = (listId, symbol) => {
        dispatch(thunkRemoveStock(listId, symbol))
    }

    const ulClassName = "watchlist-modal" + (viewWatchlist ? "" : " hidden");

    return (
        <>
            <button className='nav-button'
                id='nav-no-fill'
                onClick={() => toggleWatchlists()}
            >
                WATCHLISTS
            </button>
            <div>
                {viewWatchlist && (
                    <div className={ulClassName} ref={ulRef}>
                        <div className="watchlist-container">
                            <button onClick={() => setViewWatchlist(false)} id='exit-watchlist'>
                                <i class="fa-solid fa-x"></i>
                            </button>
                            <div className="watchlists-dropdown">
                                <div className="watchlist-header">
                                    WATCHLISTS
                                </div>
                                {lists && lists.length > 0 ? (
                                    <div className="lists-container">
                                        {lists.map((list) => (
                                            <div className="single-list-container">
                                                <div className="single-list-header">
                                                    <div className="single-list-header-left">
                                                        <button onClick={() => toggleList(list.name)}>
                                                            {listVisibility[list.name] ? (
                                                                <i class="fa-solid fa-caret-up"></i>
                                                            ) : (
                                                                <i class="fa-solid fa-caret-down"></i>
                                                            )}
                                                        </button>
                                                        <div>{list.name}</div>
                                                    </div>
                                                    <div className="single-list-header-right">
                                                        <button onClick={() => handleDeleteList(list.id)}>
                                                            <i class="fa-solid fa-trash"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            {listVisibility[list.name] && (
                                                <div className="list-elements">
                                                    {list.stocks.map((stock, index) => (
                                                        <div className="list-item-line">
                                                            <div onClick={() => history.push(`/markets/${stock.symbol}`)} id="symbol-link">
                                                                {stock.symbol}
                                                            </div>
                                                            <div>
                                                                <button onClick={() => handleRemoveStock(list.id, stock.symbol)}>
                                                                    Remove
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div>
                                        Navigate to a stock's page to add/create a watchlist!
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default WatchlistsModal;
