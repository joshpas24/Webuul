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

### Auth
| Request                        | Purpose                | Return Value  |
| :----------------------------- | :--------------------: | :------------------------------ |
| GET /api/auth/        | This fetch is sent upon initial app load and on subsequent refreshes.<br>It returns an object representing the current user, if user is logged in.                                 | {<br>&nbsp;&nbsp;&nbsp;'id': INT,<br>&nbsp;&nbsp;&nbsp;'username': STRING,<br>&nbsp;&nbsp;&nbsp;'email': STRING,<br>}<br><br>Status: 200<br>|
| POST /api/auth/unauthorized      | This endpoint will be routed to in the case that a protected route does not pass validations for the current user.<br>It returns an object with an errors property, which is an array with the value 'Unauthorized'          | {<br>&nbsp;&nbsp;&nbsp;'errors': ARRAY[STRINGS]<br>}<br><br>Status: 401<br>|
| POST /api/auth/signup        | This fetch sends the form data signup from data to the backend to process the creation of a new user.<br>It returns an object representing the current user, after logging them in, if account creation succeeds.                                 | {<br>&nbsp;&nbsp;&nbsp;'id': INT,<br>&nbsp;&nbsp;&nbsp;'username': STRING,<br>&nbsp;&nbsp;&nbsp;'email': STRING,<br>}<br><br>Status: 200<br>|
| POST /api/auth/login | This fetch attempts to login a user with the provided credentials.<br>It returns an object representing the current user, if validation succeeds.                                 | {<br>&nbsp;&nbsp;&nbsp;'id': INT,<br>&nbsp;&nbsp;&nbsp;'username': STRING,<br>&nbsp;&nbsp;&nbsp;'email': STRING,<br>}<br><br>Status: 200<br>|
| POST /api/auth/logout | This fetch will logout the current user.<br>It returns an object with the message 'User logged Out' if it succeeds.                                 | {<br>&nbsp;&nbsp;&nbsp;'message': STRING<br>}<br><br>Status: 200<br>|

### Markets
| Request                        | Purpose                |
| :----------------------------- | :--------------------: |
| GET /api/:symbol/prices/:timeframe   | This endpoint will return an array of price data objects, specified to the exact timestamp of the price.    |
| GET /api/:symbol/info     | This fetch will return a large object of current security stats including: Symbol, EPS, Beta, EBITDA, PERatio, Sector, Exchange, ROA, ROA, etc. |
