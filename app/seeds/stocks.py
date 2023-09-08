from app.models import db, Stock, environment, SCHEMA
from sqlalchemy.sql import text
import csv
import requests

def seed_stocks():

    CSV_URL = 'https://www.alphavantage.co/query?function=LISTING_STATUS&apikey=PVIKY67GN8NUSXEF'

    with requests.Session() as s:
        download = s.get(CSV_URL)
        decoded_content = download.content.decode('utf-8')
        cr = csv.reader(decoded_content.splitlines(), delimiter=',')
        my_list = list(cr)
        for row in my_list:
            if len(row[0]) > 0 and len(row[1]) > 0:
                newStock = Stock(name=row[1], symbol=row[0])
                db.session.add(newStock)

    db.session.commit()


def undo_stocks():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.stocks RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM stocks"))

    db.session.commit()
