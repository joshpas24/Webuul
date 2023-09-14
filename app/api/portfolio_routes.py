from flask import Blueprint, request
from ..models import db, Stock, Holding, Transaction, User
from ..forms.holding_form import HoldingForm
from flask_login import login_required, current_user
import requests
import os
from sqlalchemy import and_
import datetime

portfolio_routes = Blueprint("portfolio", __name__)


def validation_errors_to_error_messages(validation_errors):
    """
    Simple function that turns the WTForms validation errors into a simple list
    """
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(f'{field} : {error}')
    return errorMessages


@portfolio_routes.route("/current", methods=["GET"])
@login_required
def get_current_holdings():
    user = User.query.get(current_user.id)
    holdings = Holding.query.filter(Holding.user_id == current_user.id).all()
    transactions = Transaction.query.filter(Transaction.user_id == current_user.id).all()

    return { "holdings": [holding.to_dict() for holding in holdings], "transactions": [transaction.to_dict() for transaction in transactions], "cash": user.cash }


@portfolio_routes.route("/purchase/<symbol>/<float:price>", methods=["POST"])
@login_required
def purchase_holding(symbol, price):
    stonk_to_purchase = Stock.query.filter(Stock.symbol == symbol).first()
    # existing_holding = Holding.query.filter(Holding.user_id == current_user.id and Holding.symbol == symbol).first()

    form = HoldingForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    user = User.query.get(current_user.id)
    purchase_amount = form.data["shares"] * price

    if form.validate_on_submit():
        if user.cash >= purchase_amount:
            user.cash -= purchase_amount

            new_holding = Holding(
                user_id = current_user.id,
                stock_id = stonk_to_purchase.id,
                name = stonk_to_purchase.name,
                symbol = stonk_to_purchase.symbol,
                shares = form.data["shares"],
                purchase_price = price,
                current_price = price,
                purchase_date = datetime.datetime.now()
            )
            db.session.add(new_holding)
            db.session.commit()

            purchase_transaction = Transaction(
                user_id = current_user.id,
                holding_id = new_holding.id,
                shares = form.data["shares"],
                price = price,
                type = "BUY",
                date = datetime.datetime.now(),
            )

            db.session.add(purchase_transaction)
            db.session.commit()

            return { "message": "Purchase successful" }
        else:
            return { "message": "Insufficient funds" }
    if form.errors:
        return { "errors": validation_errors_to_error_messages(form.errors) }


@portfolio_routes.route("/sell/<int:holdingId>/<float:price>", methods=["POST"])
@login_required
def sell_holding(holdingId, price):
    holding_to_sell = Holding.query.filter(Holding.id == holdingId).first()
    user = User.query.get(current_user.id)
    sale_amount = holding_to_sell.shares * price

    user.cash += sale_amount

    sale_transaction = Transaction(
        user_id = current_user.id,
        holding_id = holding_to_sell.id,
        shares = holding_to_sell.shares,
        price = price,
        type = "SELL",
        date = datetime.datetime.now(),
    )

    db.session.add(sale_transaction)
    db.session.commit()

    holding_to_sell.shares = 0
    db.session.commit()

    return { "message": "Sale successful"}
