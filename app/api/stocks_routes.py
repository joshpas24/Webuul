from flask import Blueprint, request
from ..models import Stock
from flask_login import login_required, current_user
import requests
import os

alphaVantage = os.environ.get("ALPHA_VANTAGE")

market_routes = Blueprint("markets", __name__)

@market_routes.route("/<symbol>/prices/<timeframe>", methods=["GET"])
@login_required
def get_stock_price(symbol, timeframe):

    if timeframe == '1WEEK':
        url = f'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol={symbol}&interval=60min&entitlement=delayed&apikey={alphaVantage}'
    elif timeframe == 'INTRADAY':
        url = f'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol={symbol}&interval=5min&apikey={alphaVantage}'
    else:
        url = f'https://www.alphavantage.co/query?function=TIME_SERIES_{timeframe}&symbol={symbol}&entitlement=delayed&apikey={alphaVantage}'

    r = requests.get(url)
    data = r.json()

    if data.get('Error Message'):
        return data, 500

    if timeframe == 'WEEKLY' or timeframe == 'MONTHLY':
        return { f"{symbol}" : data[f'{timeframe.title()} Time Series']}
    elif timeframe == 'DAILY':
        return { f"{symbol}" : data['Time Series (Daily)']}
    elif timeframe == '1WEEK':
        return { f"{symbol}" : data['Time Series (60min)']}
    else:
        # return data
        return { f"{symbol}" : data['Time Series (5min)']}


@market_routes.route("/<symbol>/info", methods=["GET"])
@login_required
def get_stock_info(symbol):
    url = f'https://www.alphavantage.co/query?function=OVERVIEW&symbol={symbol}&apikey={alphaVantage}'
    r = requests.get(url)
    data = r.json()
    return data


@market_routes.route("/top10", methods=["GET"])
@login_required
def get_winners_losers():
    url = f'https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey={alphaVantage}'
    r = requests.get(url)
    data = r.json()
    return data


@market_routes.route("/search/<keywords>", methods=["GET"])
@login_required
def get_search_results(keywords):
    url = f'https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords={keywords}&apikey={alphaVantage}'
    r = requests.get(url)
    data = r.json()
    # return data
    return [ obj for obj in data['bestMatches'] if obj['4. region'] == "United States" and obj['3. type'] == "Equity"]

@market_routes.route("/GDP/<interval>", methods=["GET"])
@login_required
def get_GDP(interval):
    url = f'https://www.alphavantage.co/query?function=REAL_GDP&interval={interval}&apikey={alphaVantage}'
    r = requests.get(url)
    data = r.json()
    # sends array
    return data['data']

@market_routes.route("/treasury_yield/<interval>", methods=["GET"])
@login_required
def get_treasury_yield(interval):
    url = f'https://www.alphavantage.co/query?function=TREASURY_YIELD&interval={interval}&maturity=10year&apikey={alphaVantage}'
    r = requests.get(url)
    data = r.json()
    return data['data']

@market_routes.route("/interest_rate/<interval>")
@login_required
def get_interest_rate(interval):
    url = f'https://www.alphavantage.co/query?function=FEDERAL_FUNDS_RATE&interval={interval}&apikey={alphaVantage}'
    r = requests.get(url)
    data = r.json()
