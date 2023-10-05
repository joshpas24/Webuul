import React, { useEffect, useState, useRef } from "react"
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import StockDetailsPage from "../StockDetailsPage";
import { thunkGetPortfolioInfo } from "../../store/portfolio";
import './Portfolio.css'
import StockPieChart from "../PieChart";
import { useNavigation } from '../../context/NavigationView';
import LoadingComponent from "../LoadingVid";

function PortfolioPage() {
    const dispatch = useDispatch()
    const history = useHistory()

    const { navView, setNavView } = useNavigation()

    const holdings = useSelector(state=>state.portfolio["holdings"])
    const cash = useSelector(state=>state.portfolio["cash"])
    const transactions = useSelector(state=>state.portfolio["transactions"])

    const [isLoaded, setIsLoaded] = useState(false)
    const [cumulativeHoldings, setCumulativeHoldings] = useState([])


    useEffect(async () => {
        setNavView('portfolio')
        await dispatch(thunkGetPortfolioInfo())
        setIsLoaded(true)
    }, [dispatch])

    useEffect(() => {
        if (holdings && holdings.length > 0) {
            const activeHoldingsObj = {};
            holdings.forEach((holding) => {
                if (holding.shares > 0) {
                    if (activeHoldingsObj[holding.symbol]) {
                        activeHoldingsObj[holding.symbol] = [...activeHoldingsObj[holding.symbol], holding]
                    } else {
                        activeHoldingsObj[holding.symbol] = [holding]
                    }
                }
            });

            const activeHoldings = Object.values(activeHoldingsObj);
            const updatedCumulativeHoldings = [];

            activeHoldings.forEach((holdingArr) => {
                if (holdingArr.length > 1) {
                    let newObj = { ...holdingArr[0] };
                    for (let i = 1; i < holdingArr.length; i++) {
                        newObj.shares += holdingArr[i].shares;
                    }
                    newObj["totalValue"] = newObj.shares * newObj.currentPrice;
                    updatedCumulativeHoldings.push(newObj);
                } else {
                    let newObj = { ...holdingArr[0] };
                    newObj["totalValue"] = newObj.shares * newObj.currentPrice;
                    updatedCumulativeHoldings.push(newObj);
                }
            });

            setCumulativeHoldings(updatedCumulativeHoldings);
        }
    }, [holdings])


    const getHoldingName = (holdingId) => {
        if (holdings) {
            let holding = holdings.find(obj => obj.id == holdingId)
            return `${holding.name} (${holding.symbol})`
        }
    }

    const getTotal = (shares, price) => {
        const total = shares * price
        return "$" + total.toFixed(2)
    }

    const getReturn = (purchasePrice, currentPrice) => {
        const percentReturn = ((currentPrice - purchasePrice) / currentPrice) * 100
        return percentReturn.toFixed(2)
    }

    function formatDate(dateStr) {
        const date = new Date(dateStr)
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');

        const formattedDate = `${month}-${day}-${year}`;
        return formattedDate
    }

    const formatCash = (num) => {
        if (cash) {
            return num.toFixed(2)
        }
    }

    // const toggleList = (symbol) => {
    //     setListVisibility((prevState) => ({
    //       ...prevState,
    //       [symbol]: !prevState[symbol] || false,
    //     }));
    // };

    return (
        <>
            {isLoaded && cumulativeHoldings ? (
                <div className="portfolio-container">
                    <div className="portfolio-left">
                        <div className="left-box">
                            <h4>Investment Allocation</h4>
                            <StockPieChart data={cumulativeHoldings} />
                        </div>
                        <div className="left-box">
                            <h4>Transaction History</h4>
                            <div>
                                <div id="transaction-header">
                                    <div className="leftmost-column">Date</div>
                                    <div className="middle-align">Type</div>
                                    <div>Symbol</div>
                                    <div className="middle-column">Shares</div>
                                    <div className="rightmost-column">Order Total</div>
                                </div>
                                {transactions && transactions.length > 0 ? (
                                    [...transactions].reverse().map((transaction) => (
                                        <div key={transaction.id} className="transaction-item">
                                            <div className="leftmost-column">{formatDate(transaction.date)}</div>
                                            <div className="middle-align">{transaction.type}</div>
                                            {/* <div>{transaction.type}</div> */}
                                            <div>{getHoldingName(transaction.holdingId)}</div>
                                            <div className="middle-column">{transaction.shares}</div>
                                            <div id="total-value" className="rightmost-column">{getTotal(transaction.shares, transaction.price)}</div>
                                        </div>
                                    ))
                                ) : (
                                    <div>
                                        No transactions made
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="portfolio-right">
                        <h4>Holdings</h4>
                            <div className="holding-header">
                                <div className="leftmost-column">Symbol</div>
                                <div className="middle-column">Market Value</div>
                                <div className="rightmost-column">Return (%)</div>
                            </div>
                            <div className="holding-list">
                                {holdings && holdings.length > 0 ? (
                                    cumulativeHoldings.map((holding) => (
                                        <div className="holding-item">
                                            <div className="leftmost-column"
                                                onClick={() => history.push(`/markets/${holding.symbol}`)}
                                                id="symbol-link"
                                            >
                                                {holding.symbol}
                                            </div>
                                            <div id="total-holding">{getTotal(holding.shares, holding.currentPrice)}</div>
                                            <div id={getReturn(holding.purchasePrice, holding.currentPrice) > 0 ? "return-postiive" : "return-negative"}
                                                className="rightmost-column"
                                            >
                                                {getReturn(holding.purchasePrice, holding.currentPrice)}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div>
                                        Your portfolio is empty
                                    </div>
                                )}
                            </div>
                            <div className="cash-balance">
                                <div>Cash Balance</div>
                                <div>${formatCash(cash)}</div>
                            </div>
                    </div>
                </div>
            ) : (
                <LoadingComponent />
            )}
        </>
    )
}

export default PortfolioPage;
