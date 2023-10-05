import React, { useEffect, useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { useNavigation } from '../../context/NavigationView';
import { thunkGetNews, thunkGetNewsTopics } from '../../store/news';
import NewsCard from './NewsCard';
import LoadingComponent from '../LoadingVid';
import './News.css'


function NewsComponent() {
    const dispatch = useDispatch()
    const [topics, setTopics] = useState([])
    const [isLoaded, setIsLoaded] = useState(false)
    const { setNavView } = useNavigation()

    let newsAll = useSelector(state=>state.news.all)
    let newsQuery = useSelector(state=>state.news.query)
    let user = useSelector(state=>state.session.user)

    useEffect(() => {
        setNavView('news')
        dispatch(thunkGetNews())
    }, [dispatch])

    useEffect(() => {
        if (newsAll.length > 0 && !topics.length) {
            setIsLoaded(true)
        } else {
            setIsLoaded(false)
        }
    }, [newsAll, topics])

    useEffect(() => {
        if (newsQuery.length > 0 && topics.length) {
            setIsLoaded(true)
        } else {
            setIsLoaded(false)
        }
    }, [newsQuery, topics])

    useEffect(() => {
        if (topics.length > 0) {
            dispatch(thunkGetNewsTopics(topics))
        } else {
            dispatch(thunkGetNews())
        }

    }, [topics])

    const handleTopics = (topic) => {
        if (topics.includes(topic)) {
            let newArr = topics.filter(item => item !== topic)
            setTopics(newArr)
        } else {
            setTopics([...topics, topic])
        }
    }

    return (
        <div className='news-container'>
            <div className='news-top'>
                <h3>Filter by topic</h3>
                <div className='topic-buttons'>
                    <button className={!topics.length ? "active-topic": ""} onClick={() => setTopics([])}>
                        All
                    </button>
                    <button className={topics.includes('blockchain') ? "active-topic" : ""} onClick={() => handleTopics('blockchain')}>
                        Blockchain
                    </button>
                    <button className={topics.includes('earnings') ? "active-topic" : ""} onClick={() => handleTopics('earnings')}>
                        Earnings
                    </button>
                    <button className={topics.includes('ipo') ? "active-topic" : ""} onClick={() => handleTopics('ipo')}>
                        IPO
                    </button>
                    <button className={topics.includes('mergers_and_acquisitions') ? "active-topic" : ""} onClick={() => handleTopics('mergers_and_acquisitions')}>
                        Mergers & Acquisitions
                    </button>
                    <button className={topics.includes('economy_macro') ? "active-topic" : ""} onClick={() => handleTopics('economy_macro')}>
                        Macro
                    </button>
                    <button className={topics.includes('economy_fiscal') ? "active-topic" : ""} onClick={() => handleTopics('economy_fiscal')}>
                        Fiscal Policy
                    </button>
                    <button className={topics.includes('economy_monetary') ? "active-topic" : ""} onClick={() => handleTopics('economy_monetary')}>
                        Monetary
                    </button>
                    <button className={topics.includes('finance') ? "active-topic" : ""} onClick={() => handleTopics('finance')}>
                        Finance
                    </button>
                    <button className={topics.includes('technology') ? "active-topic" : ""} onClick={() => handleTopics('technology')}>
                        Technology
                    </button>
                </div>
            </div>
            <div className='news-list'>
                {!topics.length ? (
                    isLoaded ? (
                        newsAll.map((article) => <NewsCard article={article} />)
                    ) : (
                        <LoadingComponent />
                    )
                ) : (
                    isLoaded ? (
                        newsQuery.map((article) => <NewsCard article={article} />)
                    ) : (
                        <LoadingComponent />
                    )
                )}
            </div>
        </div>
    )
}

export default NewsComponent;
