from flask import Blueprint, request
from ..models import db, Stock, Watchlist, WatchlistStock
from ..forms.watchlist_form import WatchlistForm
from flask_login import login_required, current_user
import requests
import os
from sqlalchemy import and_

watchlist_routes = Blueprint("watchlists", __name__)

def validation_errors_to_error_messages(validation_errors):
    """
    Simple function that turns the WTForms validation errors into a simple list
    """
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(f'{field} : {error}')
    return errorMessages

@watchlist_routes.route("/current", methods=["GET"])
@login_required
def get_user_watchlists():
    watchlists = Watchlist.query.filter(Watchlist.user_id == current_user.id).all()
    return [ watchlist.to_dict() for watchlist in watchlists ]


@watchlist_routes.route("/create", methods=["POST"])
@login_required
def create_watchlist():
    form = WatchlistForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        new_list = Watchlist(
            user_id = current_user.id,
            name = form.data["name"]
        )
        db.session.add(new_list)
        db.session.commit()
        res = new_list.to_dict()
        return res
    if form.errors:
        return { "errors": validation_errors_to_error_messages(form.errors) }


@watchlist_routes.route("/<int:id>/delete", methods=["DELETE"])
@login_required
def delete_watchlist(id):
    watchlist_to_delete = Watchlist.query.get(id)

    db.session.delete(watchlist_to_delete)
    db.session.commit()

    return { "message": "Successfully deleted"}


@watchlist_routes.route("/<int:id>/add/<symbol>", methods=["GET"])
@login_required
def add_to_watchlist(id, symbol):
    stonk = Stock.query.filter(Stock.symbol == symbol).first()

    new_watchlist_stock = WatchlistStock(
        watchlist_id = id,
        stock_id = stonk.id
    )
    db.session.add(new_watchlist_stock)
    db.session.commit()

    watchlist = Watchlist.query.get(id)
    return watchlist.to_dict()

@watchlist_routes.route("/<int:id>/remove/<symbol>", methods=["DELETE"])
@login_required
def remove_from_watchlist(id, symbol):
    stonk = Stock.query.filter(Stock.symbol == symbol).first()
    watchlist_stonk = WatchlistStock.query.filter(and_(WatchlistStock.watchlist_id == id, WatchlistStock.stock_id == stonk.id)).first()
    db.session.delete(watchlist_stonk)
    db.session.commit()

    updated_watchlist = Watchlist.query.get(id)
    return updated_watchlist.to_dict()
