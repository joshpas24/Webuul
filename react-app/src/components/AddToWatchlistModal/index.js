import React, { useState, useEffect} from "react";
import { useSelector, useDispatch } from "react-redux";
import { thunkAddStock, thunkGetWatchlists } from "../../store/watchlists";

function AddToWatchlist({ symbol }) {
    const dispatch = useDispatch();

    const lists = useSelector(state=>state.watchlists)

    const [checkedLists, setCheckedLists] = useState([])

    useEffect(() => {
        dispatch(thunkGetWatchlists())
    }, [])

    const handleCheckboxChange = (watchlistId) => {
        console.log(watchlistId)
        if (checkedLists.includes(watchlistId)) {
            setCheckedLists(checkedLists.filter((id) => id !== watchlistId));
            console.log(checkedLists)
        } else {
            setCheckedLists([...checkedLists, watchlistId]);
            console.log(checkedLists)
        }
    };

    const addStockToWatchlist = (symbol) => {
        checkedLists.forEach((watchlistId) => {
            dispatch(thunkAddStock(watchlistId, symbol));
        });

        setCheckedLists([]);
    };


    return (
        <div>
            {lists && lists.length> 0 ? (
                <div>
                    <div>
                        {lists.map((list, index) => (
                            <li key={index}>
                                <input
                                    type="checkbox"
                                    name={list.name}
                                    checked={checkedLists.includes(list.id)}
                                    onChange={() => handleCheckboxChange(list.id)}
                                />
                                <label for={list.name}>{list.name}</label>
                            </li>
                        ))}
                    </div>
                    <button onClick={() => addStockToWatchlist(symbol)}>Add to Watchlist</button>
                </div>
            ) : (
                <div>
                   Create a watchlist
                </div>
            )}
        </div>
    )
}

export default AddToWatchlist;
