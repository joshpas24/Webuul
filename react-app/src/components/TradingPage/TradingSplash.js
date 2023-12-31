import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { thunkGetSearchResults, thunkGetStockInfo, thunkGetStockPrices } from "../../store/markets";
import video from './trading-splash.mp4'
import './TradingSplash.css'
import '../MarketsPage/MarketsPage.css'
import { useNavigation } from '../../context/NavigationView';

function TradingSplash() {
    const dispatch = useDispatch()
    const history = useHistory()

    const { setNavView } = useNavigation()

    const [searchVal, setSearchVal] = useState("")
    const [showSearchList, setShowSearchList] = useState(false)

    useEffect(() => {
        setNavView('trading')
    }, [])

    useEffect(() => {
        if (user) {
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
        }

    }, [searchVal])

    const searchResults = useSelector(state=>state.markets.searchResults)
    const user = useSelector(state=>state.session.user)

    const getStockDetails = (symbol) => {
        dispatch(thunkGetStockInfo(symbol))
        dispatch(thunkGetStockPrices(symbol, 'INTRADAY'))
        history.push(`/trading/${symbol}`)
        return;
    }

    return (
        <div className="trading-splash-container">
            <video autoPlay controlsList="nodownload nofullscreen noremoteplayback" loop muted playsInline preload="auto" id="trading-video-background">
                <source src={video} type="video/mp4" />
            </video>
            <div className="searchbar-div">
                <div className="searchbar-container">
                    <div className="searcbar-icon">
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </div>
                    <input
                        type="text"
                        value={searchVal}
                        placeholder={user ? "search by name or ticker" : "you must be logged into to search"}
                        onChange={(e) => setSearchVal(e.target.value)}
                    />
                </div>
                <div className="search-results">
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
    )
}

export default TradingSplash
