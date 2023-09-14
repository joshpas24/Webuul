from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()


# watchlist_stocks = db.Table(
#     "watchlist_stocks",
#     db.Model.metadata,
#     db.Column("watchlist_id", db.Integer, db.ForeignKey("watchlists.id"), primary_key=True),
#     db.Column("stock_id", db.Integer, db.ForeignKey("stocks.id"), primary_key=True))

# if environment == "production":
#     watchlist_stocks.schema = SCHEMA

class WatchlistStock(db.Model):
    __tablename__ = 'watchlist_stocks'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    watchlist_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('watchlists.id')), nullable=False, primary_key=True)
    stock_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('stocks.id')), nullable=False, primary_key=True)

    def to_dict(self):
        return {
            'id': self.id,
            'symbol': self.symbol,
        }
