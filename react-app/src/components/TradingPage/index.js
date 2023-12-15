import React, { useState, useEffect} from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import { thunkGetStockInfo, thunkGetStockPrices, thunkGetSearchResults } from "../../store/markets";
import OpenModalButton from "../OpenModalButton";
import AddToWatchlist from "../AddToWatchlistModal";
import IndexPriceChart from "../LineChart";
// import "./StockDetailsPage.css"
import "../StockDetailsPage/StockDetailsPage.css"
import "./TradingPage.css"
import { thunkGetPortfolioInfo, thunkPurchase, thunkSell } from "../../store/portfolio";
import { thunkAddStock } from "../../store/watchlists";
import { useNavigation } from '../../context/NavigationView';
import LoadingComponent from "../LoadingVid";
import StockPriceChart from "../LineChart/stock";

function TradingPage() {
    const dispatch = useDispatch();
    const history = useHistory();
    const {symbol} = useParams()

    const { setNavView } = useNavigation()

    const cash = useSelector(state=>state.portfolio['cash'])
    const info = useSelector(state=>state.markets.stockInfo);
    const pricesObj = useSelector(state=>state.markets.stockPrices);
    const searchResults = useSelector(state=>state.markets.searchResults)
    const holdings = useSelector(state=>state.portfolio["holdings"])

    const [isLoaded, setIsLoaded] = useState(false)
    const [searchVal, setSearchVal] = useState("")
    const [showSearchList, setShowSearchList] = useState(false)
    const [currentMV, setCurrentMV] = useState("")
    const [transactionType, setTransactionType] = useState("BUY")
    const [quantityType, setQuantityType] = useState("shares")
    const [numShares, setNumShares] = useState("")
    const [numDollars, setNumDollars] = useState("")
    const [totalCost, setTotalCost] = useState(0)
    const [totalShares, setTotalShares] = useState(0)
    const [postTransactionCash, setPostTransactionCash] = useState(0)
    const [disabled, setDisabled] = useState(false)
    const [errors, setErrors] = useState({})
    const [sellId, setSellId] = useState("")
    const [selectedTranche, setSelectedTranche] = useState(null);
    const [timeframe, setTimeframe] = useState('1D')
    const [disableIntra, setDisableIntra] = useState(false)

    useEffect(() => {
        setNavView('trading')
        // dispatch(thunkGetStockPrices(symbol.toString(), 'INTRADAY'))
        // if (pricesObj && pricesArr && pricesArr.length) {
        //     setCurrentMV(pricesArr[pricesArr.length - 1]['4. close'])
        // }
        const fetchPrices = async () => {
            try {
                const intradayPrices = await dispatch(thunkGetStockPrices(symbol.toString(), 'INTRADAY'));

                // Check if intradayPrices contains data
                if (intradayPrices && intradayPrices[symbol] && Object.keys(intradayPrices[symbol]).length > 0) {
                    // Intraday prices are available
                    setTimeframe('1D');
                } else {
                    // Intraday prices not available, try fetching daily prices
                    const dailyPrices = await dispatch(thunkGetStockPrices(symbol.toString(), 'DAILY'));

                    // Check if dailyPrices contains data
                    if (dailyPrices && dailyPrices[symbol] && Object.keys(dailyPrices[symbol]).length > 0) {
                        setTimeframe('1M');
                        setDisableIntra(true);
                    } else {
                        // Handle the case when no pricing data is available
                        console.error('No pricing data available for the selected stock.');
                    }
                }
            } catch (error) {
                // Handle errors that may occur during the dispatch
                console.error('Error fetching pricing data:', error);
            }
        }
        fetchPrices()
        dispatch(thunkGetStockInfo(symbol))
        dispatch(thunkGetPortfolioInfo())
        setPostTransactionCash(cash)
        setIsLoaded(true)
    }, [dispatch])

    useEffect(() => {
        // console.log('TIMEFRAME: ', timeframe)

        if (timeframe === ('5Y')) {
            dispatch(thunkGetStockPrices(symbol.toString(), 'MONTHLY'))
        }

        if (timeframe === '1Y') {
            dispatch(thunkGetStockPrices(symbol.toString(), 'WEEKLY'))
        }

        if (timeframe === '1M' || timeframe === '3M') {
            dispatch(thunkGetStockPrices(symbol.toString(), 'DAILY'))
        }

        if (timeframe === '1W') {
            dispatch(thunkGetStockPrices(symbol.toString(), '1WEEK'))
        }

        if (timeframe === ('1D')) {
            dispatch(thunkGetStockPrices(symbol.toString(), 'INTRADAY'))
        }
    }, [timeframe])

    useEffect(() => {
        if (searchVal.length > 0) {
            dispatch(thunkGetSearchResults(searchVal))
            setShowSearchList(true)
        } else {
            setShowSearchList(false)
        }

        if (searchVal.length < 1) {
            setSearchVal("")
            setShowSearchList(false)
        }
    }, [searchVal])

    useEffect(() => {

        let marketPrice;

        if (pricesArr) {
            marketPrice = formatCurrentPrice(pricesArr[pricesArr.length - 1]['4. close'])

            if (quantityType === 'shares') {
                let total = marketPrice * numShares
                let roundedTotal = total.toFixed(2)
                if (numShares) {
                    setTotalCost(roundedTotal)
                    setPostTransactionCash(cash-roundedTotal)
                } else {
                    setTotalCost(0)
                    setPostTransactionCash(cash)
                }
            } else {
                let total = numDollars / marketPrice
                setTotalShares(total.toFixed(2))
                setPostTransactionCash(cash - numDollars)
            }
        }
    }, [numShares, numDollars])

    useEffect(() => {
        if (postTransactionCash < 0) {
            setDisabled(true)
            let err = { "message": "Insufficient cash"}
            setErrors(err)
        } else {
            setDisabled(false)
            setErrors({})
        }
    }, [postTransactionCash])

    useEffect(() => {
        if (pricesArr) {
            setCurrentMV(pricesArr[pricesArr.length - 1]['4. close'])
        }

        if (transactionType === 'BUY') {
            setErrors({})
            setTotalCost(0)
        }

        if (transactionType === 'SELL' && !activeSymbols.includes(symbol)) {
            setDisabled(true)
            let err = { "message": `You do not currently own ${symbol}`}
            setErrors(err)
        } else {
            if (activeHoldingsObj[symbol]) {
                //INITIALIZES SELLID TO THE FIRST HOLDING
                let firstHolding = activeHoldingsObj[symbol][0]
                setSellId(firstHolding.id)
                let total = firstHolding.shares * currentMV
                let roundedTotal = parseFloat(total).toFixed(2)
                setTotalCost(roundedTotal)
            }
        }
    }, [transactionType, symbol])

    useEffect(() => {
        if (sellId && activeHoldingsObj[symbol]) {
            let holding = activeHoldingsObj[symbol].find( obj => obj.id == sellId)
            setSelectedTranche(holding)
        }
    }, [sellId])

    useEffect(() => {
        if (selectedTranche && currentMV) {
            let estTotal = selectedTranche.shares * currentMV
            setTotalCost(parseFloat(estTotal).toFixed(2))
        }
    }, [selectedTranche])

    useEffect(() => {
        if (transactionType === 'SELL') {
            let postCash = parseFloat(cash) + parseFloat(totalCost)
            let decimalCash = parseFloat(postCash).toFixed(2)
            setPostTransactionCash(decimalCash)
        }
    }, [totalCost])


    let activeHoldingsObj = {};

    if (holdings && holdings.length > 0) {
        holdings.forEach((holding) => {
            if (holding.shares > 0) {
                if (activeHoldingsObj[holding.symbol]) {
                    activeHoldingsObj[holding.symbol] = [...activeHoldingsObj[holding.symbol], holding]
                } else {
                    activeHoldingsObj[holding.symbol] = [holding]
                }
            }
        })
    }

    let activeHoldings;
    let activeSymbols;

    if (activeHoldingsObj) {
        activeHoldings = Object.values(activeHoldingsObj)
        activeSymbols = Object.keys(activeHoldingsObj)
    }

    let pricesArr;

    if (pricesObj[symbol]) {
        pricesArr = Object.values(pricesObj[`${symbol}`])
    }

    const getStockDetails = (symbol) => {
        dispatch(thunkGetStockInfo(symbol))
        dispatch(thunkGetStockPrices(symbol, 'INTRADAY'))
        history.push(`/trading/${symbol}`)
        setSearchVal("")
        return;
    }

    const formatCurrentPrice = (priceStr) => {
        const priceNum = Number.parseFloat(priceStr).toFixed(2)
        return priceNum
    }

    const calculateStockReturn = (prices) => {
        let openIdx;
        if (timeframe === '1M') openIdx = prices.length - 25
        if (timeframe === '3M') openIdx = prices.length - 76
        if (timeframe === '1Y') openIdx = prices.length - 53
        if (timeframe === '5Y') openIdx = prices.length - 62
        if (timeframe === '1D' || timeframe === '1W') openIdx = 0

        const openStr = prices[openIdx]['4. close']
        const closeStr = prices[prices.length - 1]['4. close']
        const open = parseFloat(openStr)
        const close = parseFloat(closeStr)

        const percentChange = ((close - open) / open) * 100;
        return percentChange.toFixed(2)
    }

    const formatBillions = (numStr) => {
        if (numStr === 'None') {
            return "N/A"
        } else {
            const num = parseInt(numStr)
            const million = num / 10000000000;
            return million.toFixed(2) + "B"
        }
    }

    const handleSelectChange = (e) => {
        setQuantityType(e.target.value);
    };

    const handleSelectTranche = (e) => {
        const selectedId = e.target.value;
        setSellId(selectedId);
    }

    const handleQuantity = (val) => {
        if (val < 0) {
            setDisabled(true)
            let err = { "value": "Value must be greater than 0"}
            setErrors(err)
            // console.log("errors: ", errors)
        } else {
            setErrors({})
            if (quantityType === "shares") {
                setNumShares(val)
            } else {
                setNumDollars(val)
            }
        }
    }

    function formatOption(dateString, shares) {
        const date = new Date(dateString);

        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Add 1 because months are zero-based
        const day = date.getDate().toString().padStart(2, '0');

        const formattedDate = `${year}-${month}-${day} (${shares} shares)`;

        return formattedDate;
    }

    function formatDate(dateStr) {
        const date = new Date(dateStr)
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');

        const formattedDate = `${month}-${day}-${year}`;
        return formattedDate
    }

    const handleSubmit = () => {

        if (transactionType === "BUY") {
            let price = pricesArr[pricesArr.length - 1]['4. close']
            if (quantityType === 'shares') {
                dispatch(thunkPurchase(symbol, numShares, price))
                setTotalCost(0)
                setTotalShares(0)
                history.push("/portfolio")
            } else {
                dispatch(thunkPurchase(symbol, totalShares, price))
                setTotalCost(0)
                setTotalShares(0)
                history.push("/portfolio")
            }
        }

        if (transactionType === 'SELL') {
            dispatch(thunkSell(sellId, currentMV, numShares))
            history.push("/portfolio")
            setTotalCost(0)
            setTotalShares(0)
        }

    }

    return (
        <>
            {isLoaded && pricesArr && cash ? (
                    <div className="trading-page-container">
                        <div className="trading-page-left">
                            <div className="trading-searchbar-div">
                                <div className="details-searchbar-container">
                                    <div className="details-searcbar-icon">
                                        <i class="fa-solid fa-magnifying-glass"></i>
                                    </div>
                                    <input
                                        type="text"
                                        value={searchVal}
                                        placeholder="search by name or ticker"
                                        onChange={(e) => setSearchVal(e.target.value)}
                                    />
                                </div>
                                <div className={searchVal.length > 0 ? "trading-search-results" : null}>
                                    {searchResults && searchResults.length > 0 && searchVal.length > 0 ?
                                        searchResults.map((item) => (
                                            <li key={item['1. symbol']} onClick={() => getStockDetails(item['1. symbol'])}>
                                                <div>{item['2. name']}</div>
                                                <div>{item['1. symbol']}</div>
                                            </li>
                                        )
                                    ) : (
                                        null
                                    )}
                                </div>
                            </div>
                            <div className="trading-info-top">
                                <div>
                                    <div className="trading-stock-title">
                                        <h4>{info["Name"]} ({symbol})</h4>
                                        <OpenModalButton modalComponent={<AddToWatchlist symbol={symbol} />}
                                            buttonText={(
                                                <>
                                                    <i class="fa-regular fa-star"></i>
                                                    <span>Add to Watchlist</span>
                                                </>
                                            )}
                                        />
                                    </div>
                                    <h5>{info["Exchange"]} • {info["Sector"]} • {info["Industry"]}</h5>
                                </div>
                                <div className="stock-return">
                                    <h4>{formatCurrentPrice(pricesArr[pricesArr.length - 1]['4. close'])}</h4>
                                    <div id={calculateStockReturn(pricesArr) > 0 ? "return-positive" : "return-negative"}>
                                        {calculateStockReturn(pricesArr)}%
                                    </div>
                                </div>
                            </div>
                            <div className="trading-graph-container">
                                <div className="graph-buttons">
                                    <button onClick={() => setTimeframe("1D")} className={timeframe === '1D' ? 'active-timeframe' : null} disabled={disableIntra}>1D</button>
                                    <button onClick={() => setTimeframe("1W")} className={timeframe === '1W' ? 'active-timeframe' : null} disabled={disableIntra}>1W</button>
                                    <button onClick={() => setTimeframe("1M")} className={timeframe === '1M' ? 'active-timeframe' : null}>1M</button>
                                    <button onClick={() => setTimeframe("3M")} className={timeframe === '3M' ? 'active-timeframe' : null}>3M</button>
                                    <button onClick={() => setTimeframe("1Y")} className={timeframe === '1Y' ? 'active-timeframe' : null}>1Y</button>
                                    <button onClick={() => setTimeframe("5Y")} className={timeframe === '5Y' ? 'active-timeframe' : null}>5Y</button>
                                </div>
                                <StockPriceChart dataObj={pricesObj[`${symbol}`]} timeframe={timeframe} lineColor="rgb(0, 200, 0)" />
                            </div>
                            <div className="trading-info-stats">
                                <div className="trading-info-stats-col">
                                    <div className="trading-info-stat-item">
                                        <h4>Market Cap</h4>
                                        <h5>{formatBillions(info["MarketCapitalization"])}</h5>
                                    </div>
                                    <div className="trading-info-stat-item">
                                        <h4>52 Week Low</h4>
                                        <h5>{info["52WeekLow"]}</h5>
                                    </div>
                                    <div className="trading-info-stat-item">
                                        <h4>52 Week High</h4>
                                        <h5>{info["52WeekHigh"]}</h5>
                                    </div>
                                    <div className="trading-info-stat-item">
                                        <h4>Analyst Target Price</h4>
                                        <h5>{info["AnalystTargetPrice"]}</h5>
                                    </div>
                                    <div className="trading-info-stat-item">
                                        <h4>Beta</h4>
                                        <h5>{info["Beta"]}</h5>
                                    </div>
                                    <div className="trading-info-stat-item">
                                        <h4>PE Ratio (TTM)</h4>
                                        <h5>{info["PERatio"]}</h5>
                                    </div>
                                    <div className="trading-info-stat-item">
                                        <h4>Forward PE</h4>
                                        <h5>{info["ForwardPE"]}</h5>
                                    </div>
                                </div>
                                <div className="trading-info-stats-col">
                                    <div className="trading-info-stat-item">
                                        <h4>EV/EBITDA</h4>
                                        <h5>{info["EVToEBITDA"]}</h5>
                                    </div>
                                    <div className="trading-info-stat-item">
                                        <h4>Price/Book Ratio</h4>
                                        <h5>{info["PriceToBookRatio"]}</h5>
                                    </div>
                                    <div className="trading-info-stat-item">
                                        <h4>Return on Assets</h4>
                                        <h5>{info["ReturnOnAssetsTTM"]}</h5>
                                    </div>
                                    <div className="trading-info-stat-item">
                                        <h4>Return on Equity</h4>
                                        <h5>{info["ReturnOnEquityTTM"]}</h5>
                                    </div>
                                    <div className="trading-info-stat-item">
                                        <h4>Dividend Per Share</h4>
                                        <h5>{info["DividendPerShare"]}</h5>
                                    </div>
                                    <div className="trading-info-stat-item">
                                        <h4>Dividend Yield</h4>
                                        <h5>{info["DividendYield"]}</h5>
                                    </div>
                                    <div className="trading-info-stat-item">
                                        <h4>Ex-Dividend Date</h4>
                                        <h5>{info["ExDividendDate"]}</h5>
                                    </div>
                                </div>
                            </div>
                            <div className="about-section">
                                <h3>Description</h3>
                                <p>{info["Description"]}</p>
                            </div>
                        </div>
                        <div className="trading-page-right">
                            <div className="trading-transaction-container">
                                <div className="transaction-top">
                                    <button onClick={() => setTransactionType('BUY')} className={transactionType=='BUY'?"active-transaction":""} id="buy-button">
                                        BUY
                                    </button>
                                    <button onClick={() => setTransactionType('SELL')} className={transactionType=='SELL'?"active-transaction":""} id="sell-button">
                                        SELL
                                    </button>
                                </div>
                                <div className="transaction-content">
                                    <div>
                                        <h4>Available Cash</h4>
                                        <div>${cash.toFixed(2)}</div>
                                    </div>
                                    {transactionType === "BUY" ? (
                                        <div>
                                            <h4>
                                                Buy
                                            </h4>
                                            <select value={quantityType} onChange={handleSelectChange}>
                                                <option value="quantity">Quantity</option>
                                                <option value="shares">Shares</option>
                                            </select>
                                        </div>
                                    ) : (
                                        <div>
                                            <h4>
                                                Tranche
                                            </h4>
                                            {activeHoldingsObj[symbol] ? (
                                                <select value={sellId} onChange={handleSelectTranche}>
                                                    {activeHoldingsObj[symbol].map((obj) => (
                                                        <option value={obj.id}>
                                                            {formatOption(obj.purchaseDate, obj.shares)}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <div>
                                                    No tranches availables
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {transactionType === 'SELL' && selectedTranche && (
                                        <div className="tranche-info">
                                                <div>
                                                    <div>Price</div>
                                                    <div id="tranche-info-right">${selectedTranche.purchasePrice}</div>
                                                </div>
                                                <div>
                                                    <div># of Shares</div>
                                                    <div id="tranche-info-right">{selectedTranche.shares}</div>
                                                </div>
                                                <div>
                                                    <div>Purchase Date</div>
                                                    <div id="tranche-info-right">{formatDate(selectedTranche.purchaseDate)}</div>
                                                </div>
                                        </div>
                                    )}
                                    {transactionType === 'SELL' && selectedTranche && (
                                        <div>
                                            <h4>
                                                Shares
                                            </h4>
                                            <div>
                                                <input
                                                    type="number"
                                                    value={numShares}
                                                    onChange={(e) => {
                                                        const newValue = parseFloat(e.target.value);
                                                        if (!isNaN(newValue) && newValue <= selectedTranche.shares) {
                                                            setNumShares(newValue);
                                                        }
                                                    }}
                                                    placeholder={`Max ${selectedTranche.shares}`}
                                                    className="quantity-input"
                                                />
                                            </div>
                                    </div>
                                    )}
                                    {transactionType === "BUY" && (
                                        <div>
                                            <h4>
                                                {quantityType === "shares" ? "Shares" : "Dollar Amount"}
                                            </h4>
                                            <div>
                                                {quantityType === "shares" ? (
                                                    <div className="quantity-select">
                                                        <input type="text"
                                                            value={numShares}
                                                            onChange={(e) => handleQuantity(e.target.value)}
                                                            placeholder="0"
                                                            className="quantity-input"
                                                        />
                                                        {errors.value && (<p>{errors.value}</p>)}
                                                    </div>
                                                ) : (
                                                    <div className="quantity-select">
                                                        <input type="text"
                                                            value={numDollars}
                                                            onChange={(e) => handleQuantity(e.target.value)}
                                                            placeholder="$0.00"
                                                            className="quantity-input"
                                                        />
                                                        {errors.value && (<p>{errors.value}</p>)}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    <div>
                                        {quantityType === "shares" && (
                                            <>
                                                <h4>Market Price</h4>
                                                <div>{formatCurrentPrice(pricesArr[pricesArr.length - 1]['4. close'])}</div>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="transaction-totals">
                                    <div>
                                        <h4>
                                            {quantityType === "shares" ? "Est. Amount" : "Est. Shares"}
                                        </h4>
                                        <div>
                                            {quantityType === "shares" ? "$" + totalCost : totalShares}
                                        </div>
                                    </div>
                                    <div>
                                        <h4>Est. cash after {transactionType === "BUY" ? "purchase" : "sale"}</h4>
                                        <div>
                                            ${postTransactionCash ? parseFloat(postTransactionCash).toFixed(2) : "-"}
                                        </div>
                                    </div>
                                </div>
                                <div className="transaction-bottom">
                                    <button
                                        disabled={disabled}
                                        onClick={() => handleSubmit()}>
                                        {transactionType === "BUY" ? "PURCHASE" : "SELL"}
                                    </button>
                                    {errors && (<p>{errors.message}</p>)}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <LoadingComponent />
                )
            }
        </>
    )
}

export default TradingPage;
