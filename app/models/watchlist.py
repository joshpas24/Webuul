from .db import db, environment, SCHEMA


class Watchlist(db.Model):
    __tablename__ = 'watchlists'

    id = db.Column(db.Integer, primary_key=False)
    user_id = db.Column(db.Integer, nullable=False)
    name = db.Column(db.String(50), nulllable=False)

    watchlist_stocks = db.relationship('WatchlistStocks', back_populates='watchlist_rel')

    def to_dict(self):
        return {
            'id': self.id,
            'userId': self.user_id,
            'name': self.name,
            'stocks': 'poop'
        }
