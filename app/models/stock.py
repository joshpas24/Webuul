from .db import db, environment, SCHEMA, add_prefix_for_prod


class Stock(db.Model):
    __tablename__ = 'stocks'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    symbol = db.Column(db.String(10), nullable=False)

    holdings_rel = db.Relationship("Holding", back_populates='stocks_rel')
    watchlist_stocks = db.relationship('WatchlistStocks', back_populates='stock_rel')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'symbol': self.symbol
        }
