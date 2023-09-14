from ..models import db, Transaction, Watchlist, Holding, WatchlistStock


def undo_transactions_watchlists_holdings():
    # Delete all test entries
    Transaction.query.delete()
    Watchlist.query.delete()
    Holding.query.delete()
    WatchlistStock.query.delete()

    db.session.commit()
