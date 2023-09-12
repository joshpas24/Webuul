from .db import db, environment, SCHEMA, add_prefix_for_prod


class WatchlistStock(db.Model):
    __tablename__ = 'watchlist_stocks'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    watchlist_id = db.Column(db.Integer, db.ForeignKey('watchlists.id'), nullable=False, primary_key=True)
    stock_id = db.Column(db.Integer, db.ForeignKey('stocks.id'), nullable=False, primary_key=True)

    # Define relationships to Watchlist and Stock models
    watchlist = db.relationship('Watchlist', backref='watchlist_stocks')
    stock = db.relationship('Stock', backref='watchlist_stocks')
