
const GET_INDEX_PRICES = "markets/GET_INDEX_PRICES"
const GET_STOCK_PRICES = "markets/GET_PRICES"
const GET_STOCK_INFO = "markets/GET_STOCK_INFO"
const SET_LISTS = "markets/SET_LISTS"
const SEARCH_RESULTS = "markets/SEARCH_RESULTS"
const GET_GDP = "markets/GET_GDP"
const GET_TREASURY = "markets/GET_TREASURY"
const GET_INTEREST_RATES = "markets/GET_INTEREST_RATES"
const GET_INFLATION = "markets/GET_INFLATION"
const GET_COMMODITIES = "markets/GET_COMMODITIES"
const GET_UNEMPLOYMENT = "markets/GET_UNEMPLOYMENT"

const getIndexPrices = (data) => ({
    type: GET_INDEX_PRICES,
    data
})

const getStockPrice = (data) => ({
    type: GET_STOCK_PRICES,
    data
})

const getStockInfo = (data) => ({
    type: GET_STOCK_INFO,
    data
})

const setLists = (data) => ({
    type: SET_LISTS,
    data
})

const getSearchResults = (data) => ({
    type: SEARCH_RESULTS,
    data
})

const getGDP = (data) => ({
    type: GET_GDP,
    data
})
const getTreasury = (data) => ({
    type: GET_TREASURY,
    data
})
const getInterestRates = (data) => ({
    type: GET_INTEREST_RATES,
    data
})
const getInflation = (data) => ({
    type: GET_INFLATION,
    data
})
const getCommodities = (data) => ({
    type: GET_COMMODITIES,
    data
})
const getUnemployment = (data) => ({
    type: GET_UNEMPLOYMENT,
    data
})

export const thunkGetIndexPrices = (symbol, timeframe) => async (dispatch) => {
    const res = await fetch(`/api/markets/${symbol}/prices/${timeframe}`, {
        method: "GET"
    })

    if (res.ok) {
        try {
            const data = await res.json();
            dispatch(getIndexPrices(data))
            return data;
        } catch (error) {
            console.error('Error parsing JSON:', error);
        }
    }
}

export const thunkGetStockPrices = (symbol, timeframe) => async (dispatch) => {
    const res = await fetch(`/api/markets/${symbol}/prices/${timeframe}`, {
        method: "GET"
    })

    if (res.ok) {
        try {
            const data = await res.json();
            dispatch(getStockPrice(data))
            return data;
        } catch (error) {
            console.error('Error parsing JSON:', error);
        }
    }
}

export const thunkGetStockInfo = (symbol) => async (dispatch) => {
    const res = await fetch(`/api/markets/${symbol}/info`, {
        method: "GET"
    })

    if (res.ok) {
        try {
            const data = await res.json();
            dispatch(getStockInfo(data));
            return data;
        } catch (error) {
            console.error('Error parsing JSON:', error);
        }
    }
}

export const thunkGetTop10 = () => async (dispatch) => {
    const res = await fetch("/api/markets/top10", {
        method: "GET"
    })

    if (res.ok) {
        try {
            const data = await res.json();
            dispatch(setLists(data));
            return data;
        } catch (error) {
            console.error('Error parsing JSON:', error);
        }
    }

}

export const thunkGetSearchResults = (keywords) => async dispatch => {
    const res = await fetch(`/api/markets/search/${keywords}`, {
        method: "GET"
    });

    if (res.ok) {
        const data = await res.json()
        dispatch(getSearchResults(data))
        return data
    }
}

export const thunkGetGDP = (interval) => async (dispatch) => {
    const res = await fetch(`/api/markets/GDP/${interval.toLowerCase()}`, {
        method: "GET"
    })

    if (res.ok) {
        const data = await res.json()
        dispatch(getGDP(data))
        return data
    }
}

export const thunkGetTreasuryYield = (interval) => async (dispatch) => {
    const res = await fetch(`/api/markets/treasury_yield/${interval.toLowerCase()}`, {
        method: "GET"
    })

    if (res.ok) {
        const data = await res.json()
        dispatch(getTreasury(data))
        return data
    }
}

export const thunkGetInterestRates = (interval) => async (dispatch) => {
    const res = await fetch(`/api/markets/interest_rates/${interval.toLowerCase()}`, {
        method: "GET"
    })

    if (res.ok) {
        const data = await res.json()
        dispatch(getInterestRates(data))
        return data
    }
}

export const thunkGetInflation = () => async (dispatch) => {
    const res = await fetch(`/api/markets/inflation`, {
        method: "GET"
    })

    if (res.ok) {
        const data = await res.json()
        dispatch(getInflation(data))
        return data
    }
}

export const thunkGetCommodities = (interval) => async (dispatch) => {
    const res = await fetch(`/api/markets/commodities/${interval}`, {
        method: "GET"
    })

    if (res.ok) {
        const data = await res.json()
        dispatch(getCommodities(data))
        return data
    }
}

export const thunkGetUnemployment = () => async (dispatch) => {
    const res = await fetch(`/api/markets/unemployment`, {
        method: "GET"
    })

    if (res.ok) {
        const data = await res.json()
        dispatch(getUnemployment(data))
        return data
    }
}

let initialState = {
    stockInfo: {},
    stockPrices: {},
    winners: [],
    losers: [],
    mostActive: [],
    indices: {},
    searchResults: [],
    gdp: [],
    treasury_yield: [],
    interest_rate: [],
    inflation: [],
    commodities: [],
    unemployment: []
}

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
            newState = { ...state, stockPrices: {} }
            newState.stockPrices = action.data
            return newState;
        case GET_STOCK_INFO:
            newState = { ...state, stockInfo: {} }
            newState.stockInfo = action.data
            return newState;
        case SET_LISTS:
            newState = { ...state, winners: [], losers: [], mostActive: []}
            for (let i = 0; i < 10; i++) {
                newState.winners.push(action.data["top_gainers"][i])
                newState.losers.push(action.data["top_losers"][i])
                newState.mostActive.push(action.data["most_actively_traded"][i])
            }
            return newState;
        case SEARCH_RESULTS:
            newState = { ...state, searchResults: [] }
            newState.searchResults = action.data
            return newState;
        case GET_GDP:
            newState = { ...state, gdp: [] }
            newState.gdp = action.data
            return newState
        case GET_TREASURY:
            newState = { ...state, treasury_yield: [] }
            newState.treasury_yield = action.data
            return newState
        case GET_INTEREST_RATES:
            newState = { ...state, interest_rate: [] }
            newState.interest_rate = action.data
            return newState
        case GET_INFLATION:
            newState = { ...state, inflation: [] }
            newState.inflation = action.data
            return newState
        case GET_COMMODITIES:
            newState = { ...state, commodities: [] }
            newState.commodities = action.data
            return newState
        case GET_UNEMPLOYMENT:
            newState = { ...state, unemployment: [] }
            newState.unemployment = action.data
            return newState
        default:
            return state;
    }
}
