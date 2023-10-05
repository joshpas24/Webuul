import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { useHistory } from 'react-router-dom'
import { thunkGetSearchResults, thunkGetIndexPrices, thunkGetStockInfo, thunkGetStockPrices, thunkGetTop10 } from "../../store/markets";
import './MarketsPage.css'
import IndexPriceChart from "../LineChart";
import LoadingComponent from "../LoadingVid";
import { useNavigation } from "../../context/NavigationView";

function MarketsPage() {
    const history = useHistory();
    const dispatch = useDispatch();

    const { navView, setNavView } = useNavigation()

    const [isLoaded, setIsLoaded] = useState(false)
    const [searchVal, setSearchVal] = useState("")
    const [showSearchList, setShowSearchList] = useState(false)

    useEffect(() => {
        setNavView('markets')
        dispatch(thunkGetTop10())
        dispatch(thunkGetIndexPrices('DIA', 'INTRADAY'))
        dispatch(thunkGetIndexPrices('SPY', 'INTRADAY'))
        dispatch(thunkGetIndexPrices('QQQ', 'INTRADAY'))

        setIsLoaded(true)
    }, [dispatch])

    // useEffect(() => {
    //     if (searchVal.length > 0) {
    //         dispatch(thunkGetSearchResults(searchVal))
    //         setShowSearchList(true)
    //     } else {
    //         setShowSearchList(false)
    //     }

    //     if (searchVal.length < 1) {
    //         setSearchVal("")
    //         setShowSearchList(false)
    //     }
    // }, [searchVal])

    // const user = useSelector(state=>state.session.user)
    // const searchResults = useSelector(state=>state.markets.searchResults)
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
                {/* <div className="timeframe+searchbar">
                    <div className="timeframes">
                        <button>INTRADAY</button>
                        <button>1 WEEK</button>
                        <button>1 MO</button>
                        <button>3 MO</button>
                        <button>6 MO</button>
                        <button>YTD</button>
                        <button>1 YR</button>
                        <button>MAX</button>
                    </div>
                </div> */}
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
                        <IndexPriceChart dataObj={dowJones} title="SPDR Dow Jones Industrial Average ETF (DIA)" lineColor="#00D7FF" />
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
                        <IndexPriceChart dataObj={spy500} title="SPDR S&P 500 ETF (SPY)" lineColor="#FF00E0" />
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
                        <IndexPriceChart dataObj={nasdaq} title="Invesco QQQ Trust (QQQ)" lineColor="#002CFF" />
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
                <div className="two-col-container">

                </div>
            </div>
            ) : (
                <LoadingComponent />
            )}
        </>
    )
}

export default MarketsPage;
