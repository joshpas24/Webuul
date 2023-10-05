from flask import Blueprint, request
from ..models import db, Stock, Holding, Transaction, User
from ..forms.holding_form import HoldingForm
from flask_login import login_required, current_user
import requests
import os
from sqlalchemy import and_
import datetime

alphaVantage = os.environ.get("ALPHA_VANTAGE")

news_routes = Blueprint("news", __name__)


@news_routes.route("/latest", methods=["GET"])
def get_latest_news():

    url = f"https://www.alphavantage.co/query?function=NEWS_SENTIMENT&sort=LATEST&apikey={alphaVantage}"

    r = requests.get(url)
    data = r.json()

    return data['feed']

@news_routes.route("/topics", methods=["POST"])
def get_news_query():
    topics = request.json.get('topics', [])

    query = '.'.join(topics)

    url = f"https://www.alphavantage.co/query?function=NEWS_SENTIMENT&sort=LATEST&topics={query}&apikey={alphaVantage}"

    r = requests.get(url)
    data = r.json()

    return data['feed']
