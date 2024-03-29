import React, { useState, useEffect} from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import { thunkGetStockInfo, thunkGetStockPrices, thunkGetSearchResults } from "../../store/markets";
import OpenModalButton from "../OpenModalButton";
import AddToWatchlist from "../AddToWatchlistModal";
import IndexPriceChart from "../LineChart";
import { useNavigation } from "../../context/NavigationView";
import "./StockDetailsPage.css"
import LoadingComponent from "../LoadingVid";
import background from "./adien.png"
import StockPriceChart from "../LineChart/stock";
import anime from 'animejs'

function StockDetailsPage() {
    const dispatch = useDispatch();
    const history = useHistory();

    const { symbol } = useParams();
    const [isLoaded, setIsLoaded] = useState(false)
    const [searchVal, setSearchVal] = useState("")
    const [showSearchList, setShowSearchList] = useState(false)
    const [timeframe, setTimeframe] = useState('1D')
    const [disableIntra, setDisableIntra] = useState(false)
    const [disable5Y, setDisable5Y] = useState(false)

    const { setNavView } = useNavigation()

    let ticker;
    if (symbol[symbol.length - 1] === '+') {
        ticker = symbol.slice(0, symbol.length - 1)
    } else {
        ticker = symbol
    }

    useEffect(() => {
        setNavView('markets')
        dispatch(thunkGetStockInfo(ticker))
        const fetchPrices = async () => {
            try {
                const fiveYear = await dispatch(thunkGetStockPrices(ticker, 'MONTHLY'));

                // Check if five-year data is available based on your specific condition
                if (!hasFiveYearData(fiveYear)) {
                    setDisable5Y(true);
                }

                const intradayPrices = await dispatch(thunkGetStockPrices(ticker, 'INTRADAY'));

                // Check if intradayPrices contains data
                if (intradayPrices && intradayPrices[ticker] && Object.keys(intradayPrices[ticker]).length > 0) {
                    // Intraday prices are available
                    setTimeframe('1D');
                } else {
                    // Intraday prices not available, try fetching daily prices
                    const dailyPrices = await dispatch(thunkGetStockPrices(ticker, 'DAILY'));

                    // Check if dailyPrices contains data
                    if (dailyPrices && dailyPrices[ticker] && Object.keys(dailyPrices[ticker]).length > 0) {
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
        setIsLoaded(true)
    }, [dispatch])

    const hasFiveYearData = (data) => {
        // Add your specific condition here based on the data structure
        // For example, check if there are at least 60 data points for the last five years
        return data && data[ticker] && Object.keys(data[ticker]).length >= 60;
    };

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

    const info = useSelector(state=>state.markets.stockInfo);
    const pricesObj = useSelector(state=>state.markets.stockPrices);
    const searchResults = useSelector(state=>state.markets.searchResults)

    let pricesArr;

    if (pricesObj[ticker]) {
        pricesArr = Object.values(pricesObj[`${ticker}`])
    }

    useEffect(() => {
        // console.log('TIMEFRAME: ', timeframe)

        if (timeframe === ('ALL')) {
            dispatch(thunkGetStockPrices(ticker, 'MONTHLY'))
        }

        if (timeframe === ('5Y')) {
            dispatch(thunkGetStockPrices(ticker, 'MONTHLY'))
        }

        if (timeframe === '1Y') {
            dispatch(thunkGetStockPrices(ticker, 'WEEKLY'))
        }

        if (timeframe === '1M' || timeframe === '3M') {
            dispatch(thunkGetStockPrices(ticker, 'DAILY'))
        }

        if (timeframe === '1W') {
            dispatch(thunkGetStockPrices(ticker, '1WEEK'))
        }

        if (timeframe === ('1D')) {
            dispatch(thunkGetStockPrices(ticker, 'INTRADAY'))
        }
    }, [timeframe])

    // useEffect(() => {
    //     if (timeframe === '5Y' && pricesArr.length < 62) {
    //         setDisable5Y(true)
    //         setTimeframe('ALL')
    //     }
    // }, [pricesArr])

    const getStockDetails = (ticker) => {
        dispatch(thunkGetStockInfo(ticker))
        dispatch(thunkGetStockPrices(ticker, 'INTRADAY'))
        history.push(`/markets/${ticker}`)
        return;
    }

    const formatCurrentPrice = (priceStr) => {
        const priceNum = parseFloat(priceStr)
        return priceNum.toFixed(2)
    }

    const calculateStockReturn = (prices) => {
        if (!prices || prices.length === 0) {
            return 0;
        }

        let openIdx;

        if (timeframe === '1M' && prices.length >= 25) {
            openIdx = prices.length - 25;
        } else if (timeframe === '3M' && prices.length >= 76) {
            openIdx = prices.length - 76;
        } else if (timeframe === '1Y' && prices.length >= 53) {
            openIdx = prices.length - 53;
        } else if (timeframe === '5Y' && prices.length >= 62) {
            openIdx = prices.length - 62;
        } else if (timeframe === '1D' || timeframe === '1W' || timeframe === 'ALL') {
            openIdx = 0;
        } else {
            return 0;
        }

        const openStr = prices[openIdx]['4. close']
        const closeStr = prices[prices.length - 1]['4. close']
        const open = parseFloat(openStr)
        const close = parseFloat(closeStr)

        const percentChange = ((close - open) / open) * 100;
        return percentChange.toFixed(2)
    }

    const formatBillions = (numStr) => {
        const num = parseInt(numStr)
        const million = num / 10000000000;
        return million.toFixed(2)
    }

    return (
        <>
            {isLoaded && pricesArr ? (
                <div className="details-page-container">
                    <div className="details-top">
                        <div className="details-top-inner">
                            <div className="details-nav">
                                <div className="details-nav-left">
                                    <div className="markets-back" onClick={() => history.push("/markets")}>
                                        <div className="markets-text">MARKETS</div>
                                    </div>
                                    <i class="fa-solid fa-caret-right"></i>
                                    <div>
                                        <div className="markets-text">{ticker}</div>
                                    </div>
                                </div>
                                <div className="details-searchbar-div">
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
                                    <div className={searchVal.length > 0 ? "details-search-results" : null}>
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
                            </div>
                            <div className="details-top-content">
                                <div className="info-top">
                                    <div className="stock-title">
                                        <h1>{ticker}</h1>
                                        <div className="stock-title-right">
                                            <h5>{info["Name"]}</h5>
                                            <h5>{info["Exchange"]}</h5>
                                        </div>
                                    </div>
                                    <div className="stock-sector">
                                        {info["Sector"]} • {info["Industry"]}
                                    </div>
                                    <div className="details-price-return">
                                        <div className="details-return">
                                            <div id="details-price">{formatCurrentPrice(pricesArr[pricesArr.length - 1]['4. close'])}</div>
                                            <div id={calculateStockReturn(pricesArr) > 0 ? "detail-positive" : "detail-negative"} className="details-return-percent">
                                                {calculateStockReturn(pricesArr)}%
                                            </div>
                                        </div>
                                        {timeframe === '1D' ? null :
                                            <div className="return-warning">
                                                <i class="fa-solid fa-circle-info"></i>
                                                <span>Return is calculated based on timeframe selected below. Prices may vary.</span>
                                            </div>
                                        }
                                    </div>
                                    <div className="details-buttons">
                                        <OpenModalButton modalComponent={<AddToWatchlist symbol={symbol} />}
                                            buttonText={(
                                                <>
                                                    <i class="fa-regular fa-star"></i>
                                                    <span>Add to Watchlist</span>
                                                </>
                                            )}
                                        />
                                        <button onClick={() => history.push(`/trading/${symbol}`)} id="trade-button">
                                            <i class="fa-solid fa-chart-line"></i>
                                            <span> Trade</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="info-stats">
                                    <div className="info-stats-col">
                                        <div className="info-stat-item">
                                            <h4>Market Cap</h4>
                                            <h5>{formatBillions(info["MarketCapitalization"])}B</h5>
                                        </div>
                                        <div className="info-stat-item">
                                            <h4>52 Week Low</h4>
                                            <h5>{info["52WeekLow"]}</h5>
                                        </div>
                                        <div className="info-stat-item">
                                            <h4>52 Week High</h4>
                                            <h5>{info["52WeekHigh"]}</h5>
                                        </div>
                                        <div className="info-stat-item">
                                            <h4>Analyst Target Price</h4>
                                            <h5>{info["AnalystTargetPrice"]}</h5>
                                        </div>
                                        <div className="info-stat-item">
                                            <h4>Beta</h4>
                                            <h5>{info["Beta"]}</h5>
                                        </div>
                                        <div className="info-stat-item">
                                            <h4>PE Ratio (TTM)</h4>
                                            <h5>{info["PERatio"]}</h5>
                                        </div>
                                        <div className="info-stat-item">
                                            <h4>Forward PE</h4>
                                            <h5>{info["ForwardPE"]}</h5>
                                        </div>
                                    </div>
                                    <div className="info-stats-col">
                                        <div className="info-stat-item">
                                            <h4>EV/EBITDA</h4>
                                            <h5>{info["EVToEBITDA"]}</h5>
                                        </div>
                                        <div className="info-stat-item">
                                            <h4>Price/Book Ratio</h4>
                                            <h5>{info["PriceToBookRatio"]}</h5>
                                        </div>
                                        <div className="info-stat-item">
                                            <h4>Return on Assets</h4>
                                            <h5>{info["ReturnOnAssetsTTM"]}</h5>
                                        </div>
                                        <div className="info-stat-item">
                                            <h4>Return on Equity</h4>
                                            <h5>{info["ReturnOnEquityTTM"]}</h5>
                                        </div>
                                        <div className="info-stat-item">
                                            <h4>Dividend Per Share</h4>
                                            <h5>{info["DividendPerShare"]}</h5>
                                        </div>
                                        <div className="info-stat-item">
                                            <h4>Dividend Yield</h4>
                                            <h5>{info["DividendYield"]}</h5>
                                        </div>
                                        <div className="info-stat-item">
                                            <h4>Ex-Dividend Date</h4>
                                            <h5>{info["ExDividendDate"]}</h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="info-graph-container">
                        <div className="graph-container">
                            <div className="graph-buttons">
                                <button onClick={() => setTimeframe("1D")} className={timeframe === '1D' ? 'active-timeframe' : null} disabled={disableIntra}>1D</button>
                                <button onClick={() => setTimeframe("1W")} className={timeframe === '1W' ? 'active-timeframe' : null} disabled={disableIntra}>1W</button>
                                <button onClick={() => setTimeframe("1M")} className={timeframe === '1M' ? 'active-timeframe' : null}>1M</button>
                                <button onClick={() => setTimeframe("3M")} className={timeframe === '3M' ? 'active-timeframe' : null}>3M</button>
                                <button onClick={() => setTimeframe("1Y")} className={timeframe === '1Y' ? 'active-timeframe' : null}>1Y</button>
                                <button onClick={() => setTimeframe("5Y")} className={timeframe === '5Y' ? 'active-timeframe' : null} disabled={disable5Y}>5Y</button>
                                <button onClick={() => setTimeframe("ALL")} className={timeframe === 'ALL' ? 'active-timeframe' : null}>ALL</button>
                            </div>
                            <StockPriceChart dataObj={pricesObj[`${ticker}`]} timeframe={timeframe} lineColor="rgb(0, 200, 0)" />
                        </div>
                        <div className="about-section">
                            <h3>About</h3>
                            <p>{info["Description"]}</p>
                        </div>
                    </div>
                </div>
            ) : (
                <LoadingComponent />
            )}
        </>
    )
}

export default StockDetailsPage;
