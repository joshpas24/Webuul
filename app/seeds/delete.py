from ..models import db, Transaction, Watchlist, Holding, WatchlistStock, environment, SCHEMA


def undo_transactions_watchlists_holdings():
    # Delete all test entries
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.transactions RESTART IDENTITY CASCADE;")
        db.session.execute(f"TRUNCATE table {SCHEMA}.watchlists RESTART IDENTITY CASCADE;")
        db.session.execute(f"TRUNCATE table {SCHEMA}.holdings RESTART IDENTITY CASCADE;")
        db.session.execute(f"TRUNCATE table {SCHEMA}.watchlist_stocks RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM transactions")
        db.session.execute("DELETE FROM watchlists")
        db.session.execute("DELETE FROM holdings")
        db.session.execute("DELETE FROM watchlist_stocks")

    # Transaction.query.delete()
    # Watchlist.query.delete()
    # Holding.query.delete()
    # WatchlistStock.query.delete()

    db.session.commit()
