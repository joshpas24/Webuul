const GET_STOCK_PRICES = "markets/GET_PRICES"


const getStockPrice = (pricesObj) => ({
    type: GET_STOCK_PRICES,
    pricesObj
})

export const thunkGetStockPrices = (symbol, timeframe) => async (dispatch) => {
    const res = await fetch(`/api/markets/${symbol}/${timeframe}`, {
        method: "GET"
    });

    if (res.ok) {
        const data = await res.json()
        dispatch(getStockPrice)
        return data;
    }
}




let initialState = { indices: {}, stock: {} }

export default function marketsReducer(state = initialState, action) {
    let newState;
    switch (action.type) {
        case GET_STOCK_PRICES:
            newState = { ...state, indices: {...state.indices}, stock: {}}
            newState.stock = action.payload
            return newState
        default:
            return state;
    }
}
