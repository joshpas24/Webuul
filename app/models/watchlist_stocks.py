from .db import db, environment, SCHEMA


class WatchlistStocks(db.Model):
    __tablename__ = 'watchlist_stocks'

    watchlist_id = db.Column(db.Integer, nullable=False)
    stock_id = db.Column(db.Integer, nullable=False)

    watchlist_rel = db.Relationship('Watchlist', back_populates='watchlist_stocks')
    stock_rel = db.Relationship('Stock', back_populates='watchlist_stocks')

    def to_dict(self):
        return 'hello'
