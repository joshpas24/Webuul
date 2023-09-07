from flask_wtf import FlaskForm
from wtforms import StringField, FloatField, IntegerField
from wtforms.validators import DataRequired, Email, ValidationError


class HoldingForm(FlaskForm):
    shares = FloatField("shares", validators = [DataRequired()])
    user_id = IntegerField("user_id",validators = [DataRequired()])
