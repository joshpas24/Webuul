const GET_STOCK_PRICES = "markets/GET_PRICES"


const getStockPrice = () => ({
    type: GET_STOCK_PRICES
})

export const thunkGetStockPrices = (symbol, timeframe) => async (dispatch) => {
    const res = await fetch(`/api/markets/${symbol}/${timeframe}`, {
        method: "GET"
    });

    
}
