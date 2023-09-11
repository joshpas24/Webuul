import React, { useState, useEffect} from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import { thunkGetStockInfo, thunkGetStockPrices } from "../../store/markets";


function StockDetailsPage() {
    const dispatch = useDispatch();
    const history = useDispatch();

    const { symbol } = useParams();
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        dispatch(thunkGetStockPrices(symbol, 'INTRADAY'))
        dispatch(thunkGetStockInfo(symbol))
        setIsLoaded(true)
    }, [dispatch])

    const info = useSelector(state=>state.markets.stockInfo);
    const pricesObj = useSelector(state=>state.markets.stockPrices);

    let pricesArr;

    if (pricesObj) {
        pricesArr = Object.values(pricesObj[symbol])
    }

    return (
        <>
            {isLoaded && pricesArr && (<div className="info-graph-container">
                <div className="info-container">
                    <div className="info-top">
                        <div>
                            <h4>{info["Name"]} ({symbol})</h4>
                            <h5>{info["Exchange"]} • {info["Sector"]}</h5>
                        </div>
                        <div>
                            <div>{pricesArr[pricesArr.length - 1]['4. close']}</div>
                        </div>
                    </div>
                </div>
                <div className="graph-container">

                </div>
            </div>)}
        </>
    )
}

export default StockDetailsPage;
