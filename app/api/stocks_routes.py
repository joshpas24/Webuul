from flask import Blueprint, request
from ..models import Stock
from flask_login import login_required, current_user
import requests


market_routes = Blueprint("markets", __name__)


@market_routes.route("/<symbol>/<timeframe>", methods=["GET"])
@login_required
def get_stock_price(symbol, timeframe):

    if timeframe == 'INTRADAY':
        url = f'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol={symbol}&interval=5min&apikey=PVIKY67GN8NUSXEF'
    else:
        url = f'https://www.alphavantage.co/query?function=TIME_SERIES_{timeframe}&symbol={symbol}&apikey=PVIKY67GN8NUSXEF'

    r = requests.get(url)
    data = r.json()

    if timeframe == 'WEEKLY' or timeframe == 'MONTHLY':
        return data[f'{timeframe.title()} Time Series']
    elif timeframe == 'DAILY':
        return data['Time Series (Daily)']
    else:
        return data['Time Series (5min)']
