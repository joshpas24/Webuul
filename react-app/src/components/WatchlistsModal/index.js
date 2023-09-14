import React, { useEffect, useState, useRef } from "react"
import { useSelector, useDispatch } from "react-redux";
import { thunkCreateWatchlist, thunkDeleteWatchlist, thunkGetWatchlists, thunkRemoveStock } from "../../store/watchlists";
import { useWatchlistToggle } from "../../context/WatchlistModalToggle";
import './WatchlistsModal.css'

function WatchlistsModal() {
    const ulRef = useRef();
    const dispatch = useDispatch();

    const { viewWatchlist, setViewWatchlist } = useWatchlistToggle()
    const [listVisibility, setListVisibility] = useState({});
    const [newList, setNewList] = useState(false)
    const [listName, setListName] = useState("")

    const lists = useSelector(state=>state.watchlists)

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

    useEffect(() => {
        dispatch(thunkGetWatchlists())
        console.log(lists)
    }, [dispatch])


    const toggleWatchlists = () => {
        setViewWatchlist(!viewWatchlist)
    }

    const toggleList = (listName) => {
        setListVisibility((prevState) => ({
          ...prevState,
          [listName]: !prevState[listName] || false,
        }));
    };

    const createNewList = () => {
        dispatch(thunkCreateWatchlist(listName))
        setNewList(false)
        setListName("")
    }

    const handleDeleteList = (watchlistId) => {
        dispatch(thunkDeleteWatchlist(watchlistId))
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
                                    <div className="watchlist-header-left">
                                        WATCHLISTS
                                    </div>
                                    <button onClick={(e) => {setNewList(true); e.stopPropagation()}}>
                                        <i class="fa-solid fa-plus"></i>
                                    </button>
                                </div>
                                {newList && (
                                    <div className="list-form">
                                        <input
                                            type="text"
                                            placeholder="name"
                                            value={listName}
                                            onChange={(e) => setListName(e.target.value)}
                                        />
                                        <button onClick={(e) => {createNewList(); e.stopPropagation()}}>
                                            CREATE
                                        </button>
                                        <button onClick={(e) => {setNewList(false); e.stopPropagation()}}>
                                            CANCEL
                                        </button>
                                    </div>
                                )}
                                {lists && lists.length > 0 ? (
                                    <div className="lists-container">
                                        {lists.map((list) => (
                                            <div className="single-list-container">
                                                <div>
                                                    <div>
                                                        <div>{list.name}</div>
                                                        <button onClick={() => toggleList(list.name)}>
                                                            {listVisibility[list.name] ? (
                                                                <i class="fa-solid fa-caret-up"></i>
                                                            ) : (
                                                                <i class="fa-solid fa-caret-down"></i>
                                                            )}
                                                        </button>
                                                    </div>
                                                    <div>
                                                        <button onClick={() => handleDeleteList(list.id)}>
                                                            <i class="fa-solid fa-trash"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            {listVisibility[list.name] && (
                                                <ul>
                                                    {list.stocks.map((stock, index) => (
                                                        <li key={index}>
                                                            <div>
                                                                {stock.symbol}
                                                            </div>
                                                            <div>
                                                                <button onClick={() => thunkRemoveStock(list.id, stock.symbol)}>
                                                                    <i class="fa-solid fa-trash"></i>
                                                                </button>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div>
                                        Press the plus (<span>
                                            <i class="fa-solid fa-plus"></i>
                                        </span>) button to create a list!
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
