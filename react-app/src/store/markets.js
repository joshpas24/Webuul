import axios from 'axios'

const polygon = process.env.POLYGON
let alphaVantage = process.env.ALPHA_VANTAGE

const GET_STOCK_PRICES = "markets/GET_PRICES"
const SET_LISTS = "markets/SET_LISTS"
// const SET_DOW = "markets/SET_DOW"

const getStockPrice = (pricesObj) => ({
    type: GET_STOCK_PRICES,
    pricesObj
})

const setLists = (data) => ({
    type: SET_LISTS,
    data
})

// const setDow = (valuesArr) => ({
//     type: SET_DOW,
//     valuesArr
// })

export const thunkGetStockPrices = (symbol, timeframe) => async (dispatch) => {
    console.log("API KEY: ", alphaVantage)
    let url;
    if (timeframe === 'INTRADAY') {
        url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&entitlement=delayed&apikey=${alphaVantage}`
    } else {
        url = `https://www.alphavantage.co/query?function=TIME_SERIES_${timeframe}&symbol=${symbol}&entitlement=delayed&apikey=UKZYTRW4O1WVGICE${alphaVantage}`
    }

    try {
        const response = await axios.get(url);
        const data = response.data;
        console.log("DATA FROM URL REQUEST IN THUNK: ", data)
        // dispatch(getStockPrice())
    } catch (error) {
        console.error('Error:', error);
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



// export const thunkGetIndexValues = (symbol) => async (dispatch) => {
//     const date = new Date()
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const day = String(date.getDate()).padStart(2, '0');
//     const formattedDateString = `${year}-${month}-${day}`;

//     const res = await fetch(`https://api.polygon.io/v2/aggs/ticker/I:${symbol}/range/1/MINUTE/${formattedDateString}/${formattedDateString}?sort=desc&limit=120&apiKey=${polygon}`)

// }


// let initialState = { indices: { dji: [], gspc: [], ixic: [] }, stock: {} }
let initialState = { stock: {}, winners: [], losers: [], mostActive: [] }

export default function marketsReducer(state = initialState, action) {
    let newState;
    switch (action.type) {
        case GET_STOCK_PRICES:
            // newState = { ...state, indices: {...state.indices}, stock: {}}
            newState = { ...state, stock: {}}
            newState.stock = action.payload
            return newState;
        case SET_LISTS:
            newState = { ...state, winners: [], losers: [], mostActive: []}
            // console.log(action.data)
            for (let i = 0; i < 10; i++) {
                newState.winners.push(action.data["top_gainers"][i])
                newState.losers.push(action.data["top_losers"][i])
                newState.mostActive.push(action.data["most_actively_traded"][i])
            }
            return newState
        // case SET_DOW:
        //     newState = { ...state, indices: {...state.indices, dji: []}, stock: {}}
        //     newState.indices.dji = action.payload
        //     return newState
        default:
            return state;
    }
}
