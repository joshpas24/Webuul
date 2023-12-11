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

function StockDetailsPage() {
    const dispatch = useDispatch();
    const history = useHistory();

    const { symbol } = useParams();
    const [isLoaded, setIsLoaded] = useState(false)
    const [searchVal, setSearchVal] = useState("")
    const [showSearchList, setShowSearchList] = useState(false)

    const { setNavView } = useNavigation()

    useEffect(() => {
        setNavView('markets')
        dispatch(thunkGetStockPrices(symbol.toString(), 'INTRADAY'))
        dispatch(thunkGetStockInfo(symbol))
        setIsLoaded(true)
    }, [dispatch])

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

    if (pricesObj[symbol]) {
        pricesArr = Object.values(pricesObj[`${symbol}`])
    }

    const getStockDetails = (symbol) => {
        dispatch(thunkGetStockInfo(symbol))
        dispatch(thunkGetStockPrices(symbol, 'INTRADAY'))
        history.push(`/markets/${symbol}`)
        return;
    }

    const formatCurrentPrice = (priceStr) => {
        const priceNum = parseFloat(priceStr)
        return priceNum.toFixed(2)
    }

    const calculateStockReturn = (prices) => {
        // console.log('PRICES ARG: ', prices)
        const openStr = prices[0]['4. close']
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
                                        <div className="markets-text">{symbol}</div>
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
                                    <div className="details-search-results">
                                        {searchResults && searchResults.length > 0 && searchVal.length > 0 ?
                                            searchResults.map((item) => (
                                                <li key={item['1. symbol']} onClick={() => getStockDetails(item['1. symbol'])}>
                                                    <div>{item['2. name']}</div>
                                                    <div>{item['1. symbol']}</div>
                                                </li>
                                            )
                                        ) : (
                                            <li className={showSearchList ? "" : "hidden-search"}>No matches found</li>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="details-top-content">
                                <div className="info-top">
                                    <div className="stock-title">
                                        <h1>{symbol}</h1>
                                        <div className="stock-title-right">
                                            <h5>{info["Name"]}</h5>
                                            <h5>{info["Exchange"]}</h5>
                                        </div>
                                    </div>
                                    <div className="stock-sector">
                                        {info["Sector"]} • {info["Industry"]}
                                    </div>
                                    <div className="details-return">
                                        <div id="details-price">{formatCurrentPrice(pricesArr[pricesArr.length - 1]['4. close'])}</div>
                                        <div id={calculateStockReturn(pricesArr) > 0 ? "detail-positive" : "detail-negative"} className="details-return-percent">
                                            {calculateStockReturn(pricesArr)}%
                                        </div>
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
                            <IndexPriceChart dataObj={pricesObj[`${symbol}`]} title="" lineColor="#008A05" />
                        </div>
                    </div>
                    <div className="about-section">
                        <h3>Description</h3>
                        <p>{info["Description"]}</p>
                    </div>
                </div>
            ) : (
                <LoadingComponent />
            )}
        </>
    )
}

export default StockDetailsPage;
