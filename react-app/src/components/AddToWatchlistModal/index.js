import React, { useState, useEffect} from "react";
import { useSelector, useDispatch } from "react-redux";
import { thunkCreateWatchlist, thunkAddStock, thunkGetWatchlists } from "../../store/watchlists";
import { useModal } from "../../context/Modal";
import './AddToWatchlist.css'

function AddToWatchlist({ symbol }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal()

    const lists = useSelector(state=>state.watchlists)

    const [checkedLists, setCheckedLists] = useState([])
    const [newList, setNewList] = useState(false)
    const [listName, setListName] = useState("")

    useEffect(() => {
        dispatch(thunkGetWatchlists())
    }, [])

    const handleCheckboxChange = (watchlistId) => {
        // console.log(watchlistId)
        if (checkedLists.includes(watchlistId)) {
            setCheckedLists(checkedLists.filter((id) => id !== watchlistId));
            // console.log(checkedLists)
        } else {
            setCheckedLists([...checkedLists, watchlistId]);
            // console.log(checkedLists)
        }
    };

    const addStockToWatchlist = (symbol) => {
        checkedLists.forEach((watchlistId) => {
            dispatch(thunkAddStock(watchlistId, symbol));
        });

        setCheckedLists([]);
        closeModal();
    };

    const createNewList = () => {
        dispatch(thunkCreateWatchlist(listName))
        setNewList(false)
        setListName("")
    }


    return (
        <div className="add-watchlist-container">
            <div className="add-watchlist-header">
                <h3>Watchlists</h3>
                {lists.length > 0 && (
                    <button onClick={() => setNewList(true)}>
                        <i class="fa-solid fa-plus"></i>
                    </button>
                )}
            </div>
            {!lists.length ? (
                <h5>Create a new list below</h5>
            ) : (
                <h5>Select lists you would like to include {symbol}</h5>
            )}
            {newList && (
                <div className="list-form">
                    <input
                        type="text"
                        placeholder="name"
                        value={listName}
                        onChange={(e) => setListName(e.target.value)}
                        className="new-list-input"
                    />
                    <button onClick={(e) => {createNewList(); e.stopPropagation()}} id="create-list">
                        Create
                    </button>
                    <button onClick={(e) => {setNewList(false); e.stopPropagation()}} id="cancel-list">
                        Cancel
                    </button>
                </div>
            )}
            {lists && lists.length> 0 ? (
                <div>
                    <div className="add-watchlist-lists">
                        {lists.map((list, index) => (
                            <div className="add-watchlist-list-item">
                                <input
                                    type="checkbox"
                                    name={list.name}
                                    checked={checkedLists.includes(list.id)}
                                    onChange={() => handleCheckboxChange(list.id)}
                                />
                                <label for={list.name}>{list.name}</label>
                            </div>
                        ))}
                    </div>
                    <div className="add-watchlist-button-container">
                        <button onClick={() => {addStockToWatchlist(symbol)}} className="add-watchlist-button">
                            Add to Watchlist
                        </button>
                    </div>
                </div>
            ) : (
                <div className="list-form">
                    <input
                        type="text"
                        placeholder="name"
                        value={listName}
                        onChange={(e) => setListName(e.target.value)}
                        className="new-list-input"
                    />
                    <button onClick={(e) => {createNewList(); e.stopPropagation()}} id="create-list">
                        Create
                    </button>
                    <button onClick={(e) => {setNewList(false); e.stopPropagation()}} id="cancel-list">
                        Cancel
                    </button>
                </div>
            )}
        </div>
    )
}

export default AddToWatchlist;
