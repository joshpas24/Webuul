import axios from 'axios'

const polygon = process.env.POLYGON
let alphaVantage = process.env.ALPHA_VANTAGE

const GET_INDEX_PRICES = "markets/GET_INDEX_PRICES"
const GET_STOCK_PRICES = "markets/GET_PRICES"
const SET_LISTS = "markets/SET_LISTS"
// const SET_DOW = "markets/SET_DOW"

const getIndexPrices = (data) => ({
    type: GET_INDEX_PRICES,
    data
})

const getStockPrice = (pricesObj) => ({
    type: GET_STOCK_PRICES,
    pricesObj
})

const setLists = (data) => ({
    type: SET_LISTS,
    data
})

export const thunkGetIndexPrices = (symbol, timeframe) => async (dispatch) => {
    const res = await fetch(`/api/markets/${symbol}/${timeframe}`, {
        method: "GET"
    })

    if (res.ok) {
        try {
            const data = await res.json();
            console.log(data); // Log the data
            dispatch(getIndexPrices(data))
            return data;
        } catch (error) {
            console.error('Error parsing JSON:', error);
        }
    }
}

export const thunkGetStockPrices = (symbol, timeframe) => async (dispatch) => {
    const res = await fetch(`/api/markets/${symbol}/${timeframe}`, {
        method: "GET"
    })

    if (res.ok) {
        try {
            const data = await res.json();
            // console.log(data); // Log the data
            dispatch(getStockPrice(data))
            return data;
        } catch (error) {
            console.error('Error parsing JSON:', error);
        }
    }
}

export const thunkGetTop10 = () => async (dispatch) => {
    console.log("API Key:", alphaVantage);
    const url = `https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&entitlement=delayed&apikey=UKZYTRW4O1WVGICE`

    try {
        const response = await axios.get(url);

        if (response.status === 200) {
            const data = response.data;
            console.log("DATA FROM URL REQUEST IN THUNK: ", data)
            dispatch(setLists(data));
            return data;
        } else {
            console.log('Status:', response.status);
        }
    } catch (error) {
        console.error('Error:', error);
    }

}


let initialState = { stockInfo: {}, stockPrice: {}, winners: [], losers: [], mostActive: [], indices: {} }

export default function marketsReducer(state = initialState, action) {
    let newState;
    switch (action.type) {
        case GET_INDEX_PRICES:
            if (action.data['DIA']) {
                newState = { ...state, indices: { ...state.indices, 'DIA': {}}}
                newState.indices['DIA'] = action.data['DIA']
                return newState
            }
            if (action.data['SPY']) {
                newState = { ...state, indices: { ...state.indices, 'SPY': {}}}
                newState.indices['SPY'] = action.data['SPY']
                return newState
            }
            if (action.data['QQQ']) {
                newState = { ...state, indices: { ...state.indices, 'QQQ': {}}}
                newState.indices['QQQ'] = action.data['QQQ']
                return newState
            }
        case GET_STOCK_PRICES:
            newState = { ...state, stockPrice: {}}
            newState.stockPrice = action.data
            return newState;
        case SET_LISTS:
            newState = { ...state, winners: [], losers: [], mostActive: []}
            for (let i = 0; i < 10; i++) {
                newState.winners.push(action.data["top_gainers"][i])
                newState.losers.push(action.data["top_losers"][i])
                newState.mostActive.push(action.data["most_actively_traded"][i])
            }
            return newState
        default:
            return state;
    }
}