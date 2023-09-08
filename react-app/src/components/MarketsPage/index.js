import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { useHistory } from 'react-router-dom'
import { thunkGetStockPrices, thunkGetTop10 } from "../../store/markets";
import './MarketsPage.css'

function MarketsPage() {
    const history = useHistory();
    const dispatch = useDispatch();

    const user = useSelector(state=>state.session.user)
    const winners = useSelector(state=>state.markets.winners)
    const losers = useSelector(state=>state.markets.losers)
    const mostActive = useSelector(state=>state.markets.mostActive)

    useEffect(() => {
        dispatch(thunkGetTop10())
    }, [])

    return (
        <div className="markets-container">
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
                    <h4>Dow Jones Industrial</h4>
                    {/* <canvas ref={chartRef} /> */}
                </div>
                <div className="index-box">
                    <h4>S&P 500</h4>
                    {/* <canvas ref={chartRef} /> */}
                </div>
                <div className="index-box">
                    <h4>NASDAQ</h4>
                    {/* <canvas ref={chartRef} /> */}
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
                                <div id="list-right">{parseFloat(stonk.change_percentage).toFixed(1) + '%'}</div>
                                <div id="list-right">{parseFloat(stonk.price).toFixed(2)}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <button onClick={() => dispatch(thunkGetStockPrices('TSLA', 'DAILY'))}>Stonk Data</button>
            </div>
        </div>
    )
}

export default MarketsPage;
