from .db import db, environment, SCHEMA


class Watchlist(db.Model):
    __tablename__ = 'watchlists'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=False)
    user_id = db.Column(db.Integer, nullable=False)
    name = db.Column(db.String(50), nulllable=False)

    watchlist_stocks = db.relationship('WatchlistStock', back_populates='watchlist_rel', cascade="all, delete-orphan")
    users_rel = db.relationship('User', back_populates='watchlist_rel')

    def to_dict(self):
        return {
            'id': self.id,
            'userId': self.user_id,
            'name': self.name,
            'stocks': 'poop'
        }
