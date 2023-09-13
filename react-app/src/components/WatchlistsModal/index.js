import React, { useEffect, useState, useRef } from "react"
import './WatchlistsModal.css'
import { useSelector, useDispatch } from "react-redux";
import { thunkCreateWatchlist, thunkGetWatchlists } from "../../store/watchlists";


function WatchlistsModal() {
    const ulRef = useRef();
    const dispatch = useDispatch();

    const [showModal, setShowModal] = useState(false);
    const [listVisibility, setListVisibility] = useState({});
    const [newList, setNewList] = useState(false)
    const [listName, setListName] = useState("")

    const lists = useSelector(state=>state.watchlists)

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

    useEffect(() => {
        dispatch(thunkGetWatchlists())
        console.log(lists)
    }, [dispatch])


    const toggleWatchlists = () => {
        setShowModal(!showModal)
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

    const ulClassName = "watchlist-modal" + (showModal ? "" : " hidden");

    return (
        <>
            <button className='nav-button'
                id='nav-no-fill'
                onClick={() => toggleWatchlists()}
            >
                WATCHLISTS
            </button>
            <div>
                {showModal && (
                    <div className={ulClassName} ref={ulRef}>
                        <div className="watchlist-container">
                            <button onClick={() => setShowModal(false)} id='exit-watchlist'>
                                <i class="fa-solid fa-x"></i>
                            </button>
                            <div className="watchlists-dropdown">
                                <div className="watchlist-header">
                                    <div className="watchlist-header-left">
                                        WATCHLISTS
                                    </div>
                                    <button onClick={() => setNewList(true)}
                                        ref={ulRef}
                                    >
                                        <i class="fa-solid fa-plus"></i>
                                    </button>
                                </div>
                                {newList && (
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="name"
                                            value={listName}
                                            onChange={(e) => setListName(e.target.value)}
                                        />
                                        <button onClick={() => createNewList()}
                                            ref={ulRef}
                                        >
                                            CREATE
                                        </button>
                                        <button onClick={() => setNewList(false)}
                                            ref={ulRef}
                                        >
                                            CANCEL
                                        </button>
                                    </div>
                                )}
                                {lists && lists.length > 0 ? (
                                    <div>
                                        {lists.map((list) => (
                                            <li>
                                                <div>
                                                    <div>{list.name}</div>
                                                    <button onClick={() => toggleList(list.name)}>
                                                        {listVisibility[list.name] ? <i class="fa-solid fa-caret-down"></i> : <i class="fa-solid fa-caret-up"></i>}
                                                    </button>
                                                </div>
                                            </li>
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
