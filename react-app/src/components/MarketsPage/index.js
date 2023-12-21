import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { useHistory } from 'react-router-dom'
import { thunkGetSearchResults, thunkGetIndexPrices, thunkGetStockInfo, thunkGetStockPrices, thunkGetTop10, thunkGetGDP, thunkGetCommodities, thunkGetInflation, thunkGetInterestRates, thunkGetTreasuryYield, thunkGetUnemployment } from "../../store/markets";
import './MarketsPage.css'
import IndexPriceChart from "../LineChart";
import LoadingComponent from "../LoadingVid";
import { useNavigation } from "../../context/NavigationView";
import EconomicBarChart from "../LineChart/indicator-bar";
import EconomicLineChart from "../LineChart/indicator-line";

function MarketsPage() {
    const history = useHistory();
    const dispatch = useDispatch();

    const { navView, setNavView } = useNavigation()

    const [isLoaded, setIsLoaded] = useState(false)
    const [searchVal, setSearchVal] = useState("")
    const [showSearchList, setShowSearchList] = useState(false)
    const [gdpTimeframe, setGDPTimeframe] = useState('QTR')
    const [commodityTimeframe, setCommodityTimeframe] = useState('MNTH')
    const [irTimeframe, setIRTimeframe] = useState('DAY')
    const [treasuryTimeframe, setTreasuryTimeframe] = useState('DAY')

    useEffect(() => {
        setNavView('markets')
        dispatch(thunkGetTop10())
        dispatch(thunkGetIndexPrices('DIA', 'INTRADAY'))
        dispatch(thunkGetIndexPrices('SPY', 'INTRADAY'))
        dispatch(thunkGetIndexPrices('QQQ', 'INTRADAY'))
        dispatch(thunkGetGDP('quarterly'))
        dispatch(thunkGetTreasuryYield('daily'))
        dispatch(thunkGetInterestRates('weekly'))
        dispatch(thunkGetCommodities('monthly'))
        dispatch(thunkGetUnemployment())
        dispatch(thunkGetInflation())
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

    // const user = useSelector(state=>state.session.user)
    const GDP = useSelector(state=>state.markets.gdp)
    const treasury_yield = useSelector(state=>state.markets.treasury_yield)
    const interest_rate = useSelector(state=>state.markets.interest_rate)
    const commodities = useSelector(state=>state.markets.commodities)
    const unemployment = useSelector(state=>state.markets.unemployment)
    const inflation = useSelector(state=>state.markets.inflation)
    const searchResults = useSelector(state=>state.markets.searchResults)
    const winners = useSelector(state=>state.markets.winners)
    const losers = useSelector(state=>state.markets.losers)
    const mostActive = useSelector(state=>state.markets.mostActive)
    const dowJones = useSelector(state=>state.markets.indices['DIA'])
    const spy500 = useSelector(state=>state.markets.indices['SPY'])
    const nasdaq = useSelector(state=>state.markets.indices['QQQ'])

    let diaPrices;
    let spyPrices;
    let qqqPrices;

    if (dowJones && spy500 && nasdaq) {
        diaPrices = Object.values(dowJones)
        spyPrices = Object.values(spy500)
        qqqPrices = Object.values(nasdaq)
    }

    const getStockDetails = (symbol) => {
        dispatch(thunkGetStockInfo(symbol))
        dispatch(thunkGetStockPrices(symbol, 'INTRADAY'))
        history.push(`/markets/${symbol}`)
        return;
    }

    const calculateIndexReturn = (prices) => {
        // console.log('PRICES ARG: ', prices)
        const openStr = prices[0]['4. close']
        const closeStr = prices[prices.length - 1]['4. close']
        const open = parseFloat(openStr)
        const close = parseFloat(closeStr)

        const percentChange = ((close - open) / open) * 100;
        return percentChange.toFixed(2)
    }

    const getLastPrice = (prices) => {
        const priceStr = prices[prices.length - 1]['4. close']
        const price = parseFloat(priceStr)
        return price.toFixed(2)
    }

    const formatVolume = (numStr) => {
        const num = parseFloat(numStr)
        const newNum = num / 1000000
        return newNum.toFixed(2)
    }

    return (
        <>
            {isLoaded && qqqPrices ? (<div className="markets-container">
                <div className="markets-top-div">
                    <h2>Markets</h2>
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
                <div className="three-col-container">
                    <div className="index-box">
                        <div className="index-box-top">
                            <div>
                                <div>
                                    <h4>Dow Jones Industrial</h4>
                                    <h5>SPDR Dow Jones Industrial Average ETF (DIA)</h5>
                                </div>
                            </div>
                            <div className="index-box-top-right">
                                <h4>${getLastPrice(diaPrices)}</h4>
                                <div id={calculateIndexReturn(diaPrices) >= 0 ? "return-positive" : "return-negative"}>
                                    {calculateIndexReturn(diaPrices)}%
                                </div>
                            </div>
                        </div>
                        <IndexPriceChart dataObj={dowJones} title="DIA" lineColor="#00D7FF" />
                    </div>
                    <div className="index-box">
                        <div className="index-box-top">
                            <div>
                                <h4>S&P 500</h4>
                                <h5>SPDR S&P 500 ETF (SPY)</h5>
                            </div>
                            <div className="index-box-top-right">
                                <h4>${getLastPrice(spyPrices)}</h4>
                                <div id={calculateIndexReturn(spyPrices) >= 0 ? "return-positive" : "return-negative"}>
                                    {calculateIndexReturn(spyPrices)}%
                                </div>
                            </div>
                        </div>
                        <IndexPriceChart dataObj={spy500} title="SPY" lineColor="#FF00E0" />
                    </div>
                    <div className="index-box">
                        <div className="index-box-top">
                            <div>
                                <h4>NASDAQ</h4>
                                <h5>Invesco QQQ Trust (QQQ)</h5>
                            </div>
                            <div className="index-box-top-right">
                                <h4>${getLastPrice(qqqPrices)}</h4>
                                <div id={calculateIndexReturn(qqqPrices) >= 0 ? "return-positive" : "return-negative"}>
                                    {calculateIndexReturn(qqqPrices)}%
                                </div>
                            </div>
                        </div>
                        <IndexPriceChart dataObj={nasdaq} title="QQQ" lineColor="#002CFF" />
                    </div>
                </div>
                <div className="three-col-container">
                    <div className="list-container">
                        <h4>Top Gainers</h4>
                        <div className="list-header">
                            <div>No.</div>
                            <div>Symbol/Name</div>
                            <div className="list-right">(%) Change</div>
                            <div className="list-right">Price</div>
                        </div>
                        <div className="list-content">
                            {winners.length && winners.map((winner, index) => (
                                <div key={index} className="list-item">
                                    <div>{index + 1}</div>
                                    <div onClick={() => history.push(`/markets/${winner.ticker}`)}
                                        id="symbol-link"
                                    >{winner.ticker}</div>
                                    <div className="list-right"
                                        id={parseFloat(winner.change_percentage) >= 0 ? "return-positive" : "return-negative"}
                                    >
                                        {"+" + parseFloat(winner.change_percentage).toFixed(1) + '%'}
                                    </div>
                                    <div className="list-right">{parseFloat(winner.price).toFixed(2)}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="list-container">
                        <h4>Top Losers</h4>
                        <div className="list-header">
                            <div>No.</div>
                            <div>Symbol/Name</div>
                            <div className="list-right">(%) Change</div>
                            <div className="list-right">Price</div>
                        </div>
                        <div className="list-content">
                            {losers.length && losers.map((loser, index) => (
                                <div key={index} className="list-item">
                                    <div>{index + 1}</div>
                                    <div onClick={() => history.push(`/markets/${loser.ticker}`)}
                                        id="symbol-link"
                                    >
                                        {loser.ticker}
                                    </div>
                                    <div className="list-right"
                                        id={parseFloat(loser.change_percentage) >= 0 ? "return-positive" : "return-negative"}
                                    >
                                        {parseFloat(loser.change_percentage).toFixed(1) + '%'}
                                    </div>
                                    <div className="list-right">{parseFloat(loser.price).toFixed(2)}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="list-container">
                        <h4>Most Active</h4>
                        <div className="list-header">
                            <div>No.</div>
                            <div>Symbol/Name</div>
                            <div className="list-right">Volume</div>
                            <div className="list-right">Price</div>
                        </div>
                        <div className="list-content">
                            {mostActive.length && mostActive.map((stonk, index) => (
                                <div key={index} className="list-item">
                                    <div>{index + 1}</div>
                                    <div onClick={() => history.push(`/markets/${stonk.ticker}`)}
                                        id="symbol-link"
                                    >{stonk.ticker}</div>
                                    <div className="list-right">
                                        {formatVolume(stonk.volume) + "M"}
                                    </div>
                                    <div className="list-right">{parseFloat(stonk.price).toFixed(2)}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* <button onClick={() => dispatch(thunkGetStockPrices('TSLA', 'DAILY'))}>Stonk Data</button> */}
                </div>
                <h2>Economic Indicators</h2>
                <div className="two-col-container">
                    <div className="indicator-box">
                        <div className="indicator-box-top">
                            <h4>Real GDP</h4>
                            <div className="indicator-timeframe">
                                <button className={gdpTimeframe === 'QTR' ? 'active-timeframe' : null}

                                >QTR</button>
                                <button className={gdpTimeframe === 'YEAR' ? 'active-timeframe' : null}>YEAR</button>
                            </div>
                        </div>
                        <div className="indicator-graph">
                                {GDP && GDP.length > 0 ? (
                                    <EconomicBarChart data={GDP.reverse()} timeframe={gdpTimeframe} lineColor="#52A955" />
                                ) : (
                                    <LoadingComponent />
                                )}
                        </div>
                    </div>
                    <div className="indicator-box">
                        <div className="indicator-box-top">
                            <h4>Global Commodities Index</h4>
                            <div className="indicator-timeframe">
                                <button className={commodityTimeframe === 'MNTH' ? 'active-timeframe' : null}

                                >
                                    MNTH
                                </button>
                                <button className={commodityTimeframe === 'QTR' ? 'active-timeframe' : null}

                                >
                                    QTR
                                </button>
                                <button className={commodityTimeframe === 'YEAR' ? 'active-timeframe' : null}

                                >
                                    YEAR
                                </button>
                            </div>
                        </div>
                        <div className="indicator-graph">
                            {commodities && commodities.length > 0 ? (
                                <EconomicLineChart data={commodities} timeframe={commodityTimeframe} lineColor="#FF9E00" title='commodities'/>
                            ) : (
                                <LoadingComponent />
                            )}
                        </div>
                    </div>
                </div>
                <div className="two-col-container">
                    <div className="indicator-box">
                        <div className="indicator-box-top">
                            <h4>Federal Funds (Interest) Rate</h4>
                            <div className="indicator-timeframe">
                                <button>WEEK</button>
                                <button>MNTH</button>
                            </div>
                        </div>
                        <div className="indicator-graph">
                            {interest_rate && interest_rate.length > 0 ? (
                                <EconomicLineChart data={interest_rate} timeframe={commodityTimeframe} lineColor="#FF9E00" title='commodities'/>
                            ) : (
                                <LoadingComponent />
                            )}
                        </div>
                    </div>
                    <div className="indicator-box">
                        <div className="indicator-box-top">
                            <h4>10 Year Treasury</h4>
                            <div className="indicator-timeframe">
                                <button>DAY</button>
                                <button>WEEK</button>
                                <button>MNTH</button>
                            </div>
                        </div>
                        <div className="indicator-graph">

                        </div>
                    </div>
                </div>
                <div className="two-col-container">
                    <div className="indicator-box">
                        <h4>Inflation</h4>
                        <div className="indicator-graph">

                        </div>
                    </div>
                    <div className="indicator-box">
                        <h4>Unemployment</h4>
                        <div className="indicator-graph">

                        </div>
                    </div>
                </div>
            </div>
            ) : (
                <LoadingComponent />
            )}
        </>
    )
}

export default MarketsPage;
