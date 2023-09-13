
const GET_WATCHLISTS = "watchlists/GET_WATCHLISTS"
const CREATE_WATCHLIST = "watchlists/CREATE_WATCHLIST"
const UPDATE_WATCHLIST = "watchlists/UPDATE_WATCHLIST"
const DELETE_WATCHLIST = "watchlists/DELETE_WATCHLIST"

const getWatchlists = (data) => ({
    type: GET_WATCHLISTS,
    data
})

const createWatchlist = (data) => ({
    type: CREATE_WATCHLIST,
    data
})

const updateWatchlist = (data) => ({
    type: UPDATE_WATCHLIST,
    data
})

const deleteWatchlist = (data) => ({
    type: DELETE_WATCHLIST,
    data
})


export const thunkGetWatchlists = () => async (dispatch) => {
    const res = await fetch("/api/watchlists", {
        method: "GET"
    })

    if (res.ok) {
        const data = await res.json()
        dispatch(getWatchlists(data))
        return data
    }
};

export const thunkCreateWatchlist = (name) => async (dispatch) => {
    const res = await fetch("/api/watchlists/create", {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({
            name: name
        })
    });

    if (res.ok) {
        const data = await res.json()
        dispatch(createWatchlist(data))
        return data
    }
}

export const thunkAddStock = (watchlistId, symbol) => async (dispatch) => {
    const res = await fetch(`/api/watchlists/${watchlistId}/add/${symbol}`, {
        method: "GET"
    })

    if (res.ok) {
        const data = await res.json()
        dispatch(updateWatchlist(data))
        return data
    }
}

export const thunkRemoveStock = (watchlistId, symbol) => async (dispatch) => {
    const res = await fetch(`/api/watchlists/${watchlistId}/remove/${symbol}`, {
        method: "DELETE"
    })

    if (res.ok) {
        const data = await res.json()
        dispatch(updateWatchlist(data))
        return data;
    }
}

export const thunkDeleteWatchlist = (watchlistId) => async (dispatch) => {
    const res = await fetch(`/api/watchlists/${watchlistId}/delete`, {
        method: "DELETE"
    })

    if (res.ok) {
        const data = await res.json()
        dispatch(thunkGetWatchlists())
        return data
    }
}

let initialState = []

export default function watchlistsReducer(state = initialState, action) {
    let newState;
    switch (action.type) {
        case GET_WATCHLISTS:
            newState = action.data
            return newState;
        case CREATE_WATCHLIST:
            newState = [ ...state ]
            newState.push(action.data)
            return newState;
        case UPDATE_WATCHLIST:
            newState = [ ...state ]
            newState.map((list) => {
                if (list.id === action.data.id) {
                    list.stocks = action.data.stocks
                }
            })
            return newState;
        default:
            return state;
    }
}
