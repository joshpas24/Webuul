"""empty message

Revision ID: 55543c6e410f
Revises: 4a8e419edbb1
Create Date: 2023-09-13 13:18:08.583444

"""
from alembic import op
import sqlalchemy as sa

import os
environment = os.getenv("FLASK_ENV")
SCHEMA = os.environ.get("SCHEMA")

# revision identifiers, used by Alembic.
revision = '55543c6e410f'
down_revision = '4a8e419edbb1'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('holdings', schema=None) as batch_op:
        batch_op.drop_column('purchase_date')

    if environment == "production":
        op.execute(f"ALTER TABLE holdings SET SCHEMA {SCHEMA};")

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('holdings', schema=None) as batch_op:
        batch_op.add_column(sa.Column('purchase_date', sa.DATE(), nullable=False))

    # ### end Alembic commands ###
