import React, { useEffect, useState, useRef } from "react"
import { useSelector, useDispatch } from "react-redux";
import StockDetailsPage from "../StockDetailsPage";
import { thunkGetPortfolioInfo } from "../../store/portfolio";


function PortfolioPage() {
    const dispatch = useDispatch()

    // const [portfolioView, setPortfolioView] = useState("allocation")
    const [listVisibility, setListVisibility] = useState({});

    const holdings = useSelector(state=>state.portfolio["holdings"])
    const cash = useSelector(state=>state.portfolio["cash"])
    const transactions = useSelector(state=>state.portfolio["transactions"])

    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        dispatch(thunkGetPortfolioInfo())
        setIsLoaded(true)
    }, [dispatch])

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

    if (activeHoldingsObj) {
        activeHoldings = Object.values(activeHoldingsObj)
    }

    let cumulativeHoldings = [];

    if (activeHoldings && activeHoldings.length > 0) {
        activeHoldings.forEach((holdingArr) => {
            if (holdingArr.length > 1) {
                let newObj = holdingArr[0]
                for (let i = 1; i < holdingArr.length; i++) {
                    newObj.shares += holdingArr[i].shares
                }
                cumulativeHoldings.push(newObj)
            } else {
                cumulativeHoldings.push(holdingArr[0])
            }
        })
    }


    const getHoldingName = (holdingId) => {
        if (holdings) {
            let holding = holdings.find(obj => obj.id == holdingId)
            return holding.symbol
        }
    }

    const getTotal = (shares, price) => {
        const total = shares * price
        return total
    }

    const getReturn = (purchasePrice, currentPrice) => {
        const percentReturn = ((currentPrice - purchasePrice) / currentPrice) * 100
        return percentReturn
    }

    // const toggleList = (symbol) => {
    //     setListVisibility((prevState) => ({
    //       ...prevState,
    //       [symbol]: !prevState[symbol] || false,
    //     }));
    // };

    return (
        <>
            {isLoaded && activeHoldingsObj && (<div className="portfolio-container">
                <div className="portfolio-allocation">
                    <div className="allocation-box">
                        <h4>Allocation</h4>
                        <div>
                            Chart
                        </div>
                    </div>
                    <div className="allocation-box">
                    <h4>Transactions</h4>
                        <ul>
                            {transactions && transactions.length > 0 ? (
                                [...transactions].reverse().map((transaction) => (
                                    <li key={transaction.id}>
                                        <div>{transaction.date}</div>
                                        <div>{transaction.type}</div>
                                        {/* <div>{transaction.type}</div> */}
                                        <div>{getHoldingName(transaction.holdingId)}</div>
                                        <div>{transaction.shares}</div>
                                        <div>{() => getTotal(transaction.shares, transaction.price)}</div>
                                    </li>
                                ))
                            ) : (
                                <div>
                                    No transactions made
                                </div>
                            )}
                        </ul>
                    </div>
                </div>
                <div className="portfolio-transactions">
                    <h4>Holdings</h4>
                        <ul>
                            <div>
                                <div>Available Cash</div>
                                <div>{cash}</div>
                            </div>
                            {holdings && holdings.length > 0 ? (
                                cumulativeHoldings.map((holding) => (
                                    <div className="holding-header">
                                        <div>{holding.symbol}</div>
                                        <div>{holding.shares * holding.currentPrice}</div>
                                        <div>{() => getReturn(holding.purchasePrice, holding.currentPrice)}</div>
                                    </div>
                                ))
                            ) : (
                                <li>
                                    Your portfolio is empty
                                </li>
                            )}
                        </ul>
                </div>
            </div>)}
        </>
    )
}

export default PortfolioPage;
