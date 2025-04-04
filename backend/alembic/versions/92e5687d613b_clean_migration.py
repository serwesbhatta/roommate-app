"""Clean migration

Revision ID: 92e5687d613b
Revises: 578cb962b73c
Create Date: 2025-04-04 04:53:54.069814

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '92e5687d613b'
down_revision: Union[str, None] = '578cb962b73c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('events')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('events',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('title', sa.VARCHAR(length=100), autoincrement=False, nullable=False),
    sa.Column('description', sa.VARCHAR(length=500), autoincrement=False, nullable=False),
    sa.Column('date', postgresql.TIMESTAMP(), autoincrement=False, nullable=False),
    sa.Column('status', sa.VARCHAR(length=50), autoincrement=False, nullable=False),
    sa.Column('approved_by', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('requested_by', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('created_at', postgresql.TIMESTAMP(), autoincrement=False, nullable=True),
    sa.Column('updated_at', postgresql.TIMESTAMP(), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['approved_by'], ['user_profiles.id'], name='events_approved_by_fkey'),
    sa.ForeignKeyConstraint(['requested_by'], ['user_profiles.id'], name='events_requested_by_fkey'),
    sa.PrimaryKeyConstraint('id', name='events_pkey'),
    sa.UniqueConstraint('title', name='events_title_key')
    )
    # ### end Alembic commands ###
