from .db import db, environment, SCHEMA, add_prefix_for_prod
import os
import requests

alphaVantage = os.environ.get("ALPHA_VANTAGE")

class Holding(db.Model):
    __tablename__ = 'holdings'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    stock_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('stocks.id')), nullable=False)
    name = db.Column(db.String, nullable=False)
    symbol = db.Column(db.Integer, nullable=False)
    shares = db.Column(db.Float, nullable=False)
    purchase_price = db.Column(db.Float, nullable=False)
    current_price = db.Column(db.Float, nullable=False)
    purchase_date = db.Column(db.Date, nullable=False)

    user_rel = db.relationship("User", back_populates='holding_rel')
    stock_rel = db.relationship("Stock", back_populates='holding_rel')
    transaction_rel = db.relationship("Transaction", back_populates='holding_rel')

    def to_dict(self):

        url = f'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol={self.symbol}&interval=5min&entitlement=delayed&apikey={alphaVantage}'
        r = requests.get(url)
        data = r.json()

        time_series = data.get('Time Series (5min)', {})
        last_timestamp = list(time_series.keys())[0]
        last_close_price_str = time_series[last_timestamp]['4. close']
        last_close_price = float(last_close_price_str)

        return {
            'id': self.id,
            'userId': self.user_id,
            'stockId': self.stock_id,
            'name': self.name,
            'symbol': self.symbol,
            'shares': self.shares,
            'purchasePrice': self.purchase_price,
            "currentPrice": last_close_price,
            "purchaseDate": self.purchase_date
        }
