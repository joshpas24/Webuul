from .db import db, environment, SCHEMA, add_prefix_for_prod
from .watchlist_stocks import watchlist_stocks


class Watchlist(db.Model):
    __tablename__ = 'watchlists'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    name = db.Column(db.String(50), nullable=False)

    stocks = db.relationship('Stock', secondary=watchlist_stocks, backref='watchlists')
    user_rel = db.relationship('User', back_populates='watchlist_rel')

    def to_dict(self):

        return {
            'id': self.id,
            'userId': self.user_id,
            'name': self.name,
            'stocks': [stock.to_dict() for stock in self.stocks]
        }
