
const GET_PORTFOLIO_STATS = "portfolio/GET_PORTFOLIO_STATS"

const getPortfolioInfo = (data) => ({
    type: GET_PORTFOLIO_STATS,
    data
});

export const thunkGetPortfolioInfo = () => async (dispatch) => {
    const res = await fetch("/api/portfolio/current", {
        method: "GET"
    });

    if (res.ok) {
        const data = await res.json()
        dispatch(getPortfolioInfo(data))
        return data
    }
}

export const thunkPurchase = (symbol, shares, price) => async (dispatch) => {
    const res = await fetch(`/api/portfolio/purchase/${symbol}/${price}`, {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({
            shares: shares
        })
    })

    if (res.ok) {
        const data = await res.json()
        dispatch(thunkGetPortfolioInfo())
        return data
    }
}

export const thunkSell = (holdingId, price) => async (dispatch) => {
    const res = await fetch(`/api/portfolio/${holdingId}/${price}`, {
        method: "PUT"
    })

    if (res.ok) {
        const data = await res.json()
        dispatch(thunkGetPortfolioInfo())
        return data
    }
}

let initialState = {}

export default function portfolioReducer(state = initialState, action) {
    let newState;
    switch (action.type) {
        case GET_PORTFOLIO_STATS:
            newState = action.data
            return newState
        default:
            return state
    }
}
