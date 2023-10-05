import React, { useEffect, useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import './News.css'

function NewsCard({article}) {

    function handleDate(iso8601Timestamp) {
        const year = parseInt(iso8601Timestamp.slice(0, 4), 10);
        const month = parseInt(iso8601Timestamp.slice(4, 6), 10) - 1; // Month is zero-based
        const day = parseInt(iso8601Timestamp.slice(6, 8), 10);
        const hour = parseInt(iso8601Timestamp.slice(9, 11), 10);
        const minute = parseInt(iso8601Timestamp.slice(11, 13), 10);

        const parsedDate = new Date(year, month, day, hour, minute);
        const currentDate = new Date();
        const timeDifference = currentDate - parsedDate;

        if (timeDifference < 86400000) { // Less than 24 hours
          // Format the date to show only hours and minutes
          const options = { hour: 'numeric', minute: 'numeric' };
          return parsedDate.toLocaleTimeString('en-US', options);
        } else {
          // Format the date to show the full date and time
          const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
          return parsedDate.toLocaleDateString('en-US', options);
        }
    }

    const handleAuthor = (array) => {
        let res = array.join(", ")
        return res
    }


    return (
        <div className='article-container'>
            <div className='article-left'>
                <img className="article-image" src={article["banner_image"]}/>
            </div>
            <div className='article-right'>
                <div className='article-right-top'>
                    <div className='article-title'>
                        {article.title}
                    </div>
                    <div className='article-subtitle'>
                        {article.authors ? handleAuthor(article.authors) + " •" : null} {handleDate(article.time_published)}
                    </div>
                </div>
                <div className='article-summary'>
                    {article.summary}
                </div>
                <a href={article.url} target='_blank'>
                    Read More
                </a>
            </div>
        </div>
    )
}

export default NewsCard;
