from .db import db, environment, SCHEMA, add_prefix_for_prod


class Transaction(db.Model):
    __tablename__ = 'transactions'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}


    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    holding_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('holdings.id')), nullable=False)
    shares = db.Column(db.Float, nullable=False)
    price = db.Column(db.Float, nullable=False)
    type = db.Column(db.String, nullable=False)
    date = db.Column(db.Date, nullable=False)

    user_rel = db.relationship("User", back_populates="transaction_rel")
    holding_rel = db.relationship("Holding", back_populates="transaction_rel")

    def to_dict(self):
        return {
            'id': self.id,
            'userId': self.user_id,
            'holdingId': self.holding_id,
            'shares': self.shares,
            'price': self.price,
            'type': self.type,
            'date': self.date
        }
