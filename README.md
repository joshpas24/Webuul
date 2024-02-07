## About

Webuul is a financial site with design inspirations from Webull. It allows users to view real-time market data, including up-to-the-minute pricing, investment metrics, macroeconomic news articles, and company information, as well as create personalized watchlists to track their favorite securities.

## Live Link
https://webuul.onrender.com

## Tech Stack

### Frameworks and Libraries
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54) ![Flask](https://img.shields.io/badge/flask-%23000.svg?style=for-the-badge&logo=flask&logoColor=white) ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white) ![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white) ![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)

 ### Database:
 ![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)

 ### Hosting:
 ![Render](https://img.shields.io/badge/Render-%46E3B7.svg?style=for-the-badge&logo=render&logoColor=white)

## Wiki Links

- [Database Schema](https://github.com/joshpas24/Webuul/wiki/DB-Schema) 
- [User Stories](https://github.com/joshpas24/Webuul/wiki/User-Stories) 
- [Wireframes](https://github.com/joshpas24/Webuul/wiki/Wireframes)

## Feature List

1. Portfolio
2. Watchlists
3. Stock Details
4. Search
5. News

## Endpoints

### Markets
| Request                        | Purpose                |
| :----------------------------- | :--------------------: |
| GET /api/stocks/:symbol/prices/:timeframe   | This endpoint will return an array of price data objects, specified to the exact timestamp of the price.    |
| GET /api/stocks/:symbol/info     | This fetch will return a large object of current security stats including: Symbol, EPS, Beta, EBITDA, PERatio, Sector, Exchange, ROA, ROA, etc. |
| GET /api/stocks/top10 | This endpoint will return an array for the top gainers, losers, and most actively traded stocks at the current timestamp |
| GET /api/stocks/search/:keywords | This fetch will return an array of stocks and stock symbols which include the characters in the keywords.   |

<img width="1238" alt="Screen Shot 2024-02-07 at 2 03 46 PM" src="https://github.com/joshpas24/Webuul/assets/125530122/6fdaa887-1b68-4b41-aabd-a170625ce47b">

<img width="1235" alt="Screen Shot 2024-02-07 at 2 04 03 PM" src="https://github.com/joshpas24/Webuul/assets/125530122/638370eb-2b20-4f1b-8797-eca23f8e063d">

### Portfolio
| Request                        | Purpose                |
| :----------------------------- | :--------------------: |
| GET /api/portfolio/current  | This endpoint will return an object containing the user's current holdings, past transactions, and cash balance. | 
| POST /api/portfolio/purchase/:symbol/:price | This fetch will allow the user to purcahse a stock. Purchasing the stock will create a new holding and transaction. |
| POST /api/portfolio/sell/:symbol/:price | This fetch will allow the user to sell a current holding. The sale of the stock will create a update the number of shares of the holding and create a new transaction. |

<img width="1205" alt="Screen Shot 2024-02-07 at 2 07 23 PM" src="https://github.com/joshpas24/Webuul/assets/125530122/00082c98-3cc7-475c-9880-b8cd0c76f696">

### Watchlists
| Request                        | Purpose                |
| :----------------------------- | :--------------------: |
| GET /api/watchlists/current    | This endpoint will return an array of objects for all the current user's watchlists. |
| POST /api/watchlists/create    | This fetch will create a new watchlist. |
| DELETE /api/watchlists/:id/delete    | This fetch will delete a user's watchlist by ID. |
| GET /api/watchlists/:watchlistId/add/:symbol | This endpoint will add a symbol to a watchlist by watchlist ID. |
| GET /api/watchlists/:watchlistId/remove/:symbol | This endpoint will remove a symbol from a watchlist by watchlist ID. |

### News
| Request                        | Purpose                |
| :----------------------------- | :--------------------: |
| GET /api/news/latest   | This fetch will make a fetch call to the third party API and return an array of objects containing the latest news articles, sorted from latest to oldest, with no filter. |
| GET /api/news/topic    | This fetch will This fetch will make a fetch call to the third party API and return an array of objects containing the news articles that pertain to the user-selected topics.  |

<img width="1215" alt="Screen Shot 2024-02-07 at 2 07 55 PM" src="https://github.com/joshpas24/Webuul/assets/125530122/ffca2645-4354-4c57-8c8b-050494f628f1">

### Auth
| Request                        | Purpose                | Return Value  |
| :----------------------------- | :--------------------: | :------------------------------ |
| GET /api/auth/        | This fetch is sent upon initial app load and on subsequent refreshes.<br>It returns an object representing the current user, if user is logged in.                                 | {<br>&nbsp;&nbsp;&nbsp;'id': INT,<br>&nbsp;&nbsp;&nbsp;'username': STRING,<br>&nbsp;&nbsp;&nbsp;'email': STRING,<br>}<br><br>Status: 200<br>|
| POST /api/auth/unauthorized      | This endpoint will be routed to in the case that a protected route does not pass validations for the current user.<br>It returns an object with an errors property, which is an array with the value 'Unauthorized'          | {<br>&nbsp;&nbsp;&nbsp;'errors': ARRAY[STRINGS]<br>}<br><br>Status: 401<br>|
| POST /api/auth/signup        | This fetch sends the form data signup from data to the backend to process the creation of a new user.<br>It returns an object representing the current user, after logging them in, if account creation succeeds.                                 | {<br>&nbsp;&nbsp;&nbsp;'id': INT,<br>&nbsp;&nbsp;&nbsp;'username': STRING,<br>&nbsp;&nbsp;&nbsp;'email': STRING,<br>}<br><br>Status: 200<br>|
| POST /api/auth/login | This fetch attempts to login a user with the provided credentials.<br>It returns an object representing the current user, if validation succeeds.                                 | {<br>&nbsp;&nbsp;&nbsp;'id': INT,<br>&nbsp;&nbsp;&nbsp;'username': STRING,<br>&nbsp;&nbsp;&nbsp;'email': STRING,<br>}<br><br>Status: 200<br>|
| POST /api/auth/logout | This fetch will logout the current user.<br>It returns an object with the message 'User logged Out' if it succeeds.                                 | {<br>&nbsp;&nbsp;&nbsp;'message': STRING<br>}<br><br>Status: 200<br>|
