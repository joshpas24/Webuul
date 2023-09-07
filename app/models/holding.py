from .db import db, environment, SCHEMA


class Holding(db.Model):
    __tablename__ = 'holdings'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    stock_id = db.Column(db.Integer, nullable=False)
    shares = db.Column(db.Float, nullable=False)
    purchase_date = db.Column(db.Float, nullable=False)

    users_rel = db.Relationship("User", back_populates='holding_rel')
    stocks_rel = db.Relationship("Stock", back_populates='holding_rel')

    def to_dict(self):
        return {
            'id': self.id,
            'userId': self.user_id,
            'stockId': self.stock_id,
            'shares': self.shares,
            'purchaseDate': self.purchase_date
        }
