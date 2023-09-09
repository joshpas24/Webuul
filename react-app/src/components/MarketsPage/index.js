import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { useHistory } from 'react-router-dom'
import { thunkGetIndexPrices, thunkGetStockPrices, thunkGetTop10 } from "../../store/markets";
import './MarketsPage.css'
import IndexPriceChart from "../LineChart";
import LoadingComponent from "../LoadingVid";

function MarketsPage() {
    const history = useHistory();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(thunkGetTop10())
        dispatch(thunkGetIndexPrices('DIA', 'INTRADAY'))
        dispatch(thunkGetIndexPrices('SPY', 'INTRADAY'))
        dispatch(thunkGetIndexPrices('QQQ', 'INTRADAY'))

        setIsLoaded(true)
    }, [dispatch])

    const user = useSelector(state=>state.session.user)
    const winners = useSelector(state=>state.markets.winners)
    const losers = useSelector(state=>state.markets.losers)
    const mostActive = useSelector(state=>state.markets.mostActive)
    const dowJones = useSelector(state=>state.markets.indices['DIA'])
    const spy500 = useSelector(state=>state.markets.indices['SPY'])
    const nasdaq = useSelector(state=>state.markets.indices['QQQ'])

    const [isLoaded, setIsLoaded] = useState(false)

    let diaPrices;
    let spyPrices;
    let qqqPrices;

    if (dowJones && spy500 && nasdaq) {
        diaPrices = Object.values(dowJones)
        spyPrices = Object.values(spy500)
        qqqPrices = Object.values(nasdaq)
    }

    const calculateIndexReturn = (prices) => {
        // console.log('PRICES ARG: ', prices)
        const openStr = prices[0]['4. close']
        const closeStr = prices[prices.length - 1]['4. close']
        const open = parseInt(openStr)
        const close = parseInt(closeStr)

        const percentChange = ((close - open) / open) * 100;
        return percentChange.toFixed(2)
    }

    const getLastPrice = (prices) => {
        const priceStr = prices[prices.length - 1]['4. close']
        const price = parseInt(priceStr)
        return price.toFixed(2)
    }

    const formatVolume = (numStr) => {
        const num = parseInt(numStr)
        const newNum = num / 1000000
        return newNum.toFixed(2)
    }

    return (
        <>
            {isLoaded && qqqPrices && (<div className="markets-container">
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
                                <h5 id={calculateIndexReturn(diaPrices) >= 0 ? "index-positive" : "index-negative"}>
                                    {calculateIndexReturn(diaPrices)}%
                                </h5>
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
                                <h5 id={calculateIndexReturn(spyPrices) >= 0 ? "index-positive" : "index-negative"}>
                                    {calculateIndexReturn(spyPrices)}%
                                </h5>
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
                                <h5 id={calculateIndexReturn(qqqPrices) >= 0 ? "index-positive" : "index-negative"}>
                                    {calculateIndexReturn(qqqPrices)}%
                                </h5>
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
                            <div id="list-right">(%) Change</div>
                            <div id="list-right">Price</div>
                        </div>
                        <div className="list-content">
                            {winners.length && winners.map((winner, index) => (
                                <div key={index} className="list-item">
                                    <div>{index + 1}</div>
                                    <div>{winner.ticker}</div>
                                    <div id="list-right">{"+" + parseFloat(winner.change_percentage).toFixed(1) + '%'}</div>
                                    <div id="list-right">{parseFloat(winner.price).toFixed(2)}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="list-container">
                        <h4>Top Losers</h4>
                        <div className="list-header">
                            <div>No.</div>
                            <div>Symbol/Name</div>
                            <div id="list-right">(%) Change</div>
                            <div id="list-right">Price</div>
                        </div>
                        <div className="list-content">
                            {losers.length && losers.map((loser, index) => (
                                <div key={index} className="list-item">
                                    <div>{index + 1}</div>
                                    <div>{loser.ticker}</div>
                                    <div id="list-right">{parseFloat(loser.change_percentage).toFixed(1) + '%'}</div>
                                    <div id="list-right">{parseFloat(loser.price).toFixed(2)}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="list-container">
                        <h4>Most Active</h4>
                        <div className="list-header">
                            <div>No.</div>
                            <div>Symbol/Name</div>
                            <div id="list-right">Volume</div>
                            <div id="list-right">Price</div>
                        </div>
                        <div className="list-content">
                            {mostActive.length && mostActive.map((stonk, index) => (
                                <div key={index} className="list-item">
                                    <div>{index + 1}</div>
                                    <div>{stonk.ticker}</div>
                                    <div id="list-right">{formatVolume(stonk.volume) + "M"}</div>
                                    <div id="list-right">{parseFloat(stonk.price).toFixed(2)}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* <button onClick={() => dispatch(thunkGetStockPrices('TSLA', 'DAILY'))}>Stonk Data</button> */}
                </div>
            </div>)}
        </>
    )
}

export default MarketsPage;
