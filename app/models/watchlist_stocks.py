from .db import db, environment, SCHEMA, add_prefix_for_prod


watchlist_stocks = db.Table(
    "watchlist_stocks",
    db.Model.metadata,
    db.Column("watchlist_id", db.Integer, db.ForeignKey("watchlists.id"), primary_key=True),
    db.Column("stock_id", db.Integer, db.ForeignKey("stocks.id"), primary_key=True)
)

if environment == "production":
    watchlist_stocks.schema = SCHEMA
