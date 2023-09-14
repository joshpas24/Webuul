from .db import db, environment, SCHEMA, add_prefix_for_prod


class WatchlistStock(db.Model):
    __tablename__ = 'watchlist_stocks'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    watchlist_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('watchlists.id')), nullable=False, primary_key=True)
    stock_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('stocks.id')), nullable=False, primary_key=True)

    # def to_dict(self):
    #     return {
    #         'id': self.id,
    #         'symbol': self.symbol,
    #     }
