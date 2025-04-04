"""Updated schema

Revision ID: a38fadc56c60
Revises: eb1e21b32b54
Create Date: 2025-04-03 20:23:31.405139

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'a38fadc56c60'
down_revision: Union[str, None] = 'eb1e21b32b54'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('questions')
    op.drop_table('events')
    op.drop_table('options')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('options',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('option_text', sa.VARCHAR(length=300), autoincrement=False, nullable=False),
    sa.Column('question_id', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.ForeignKeyConstraint(['question_id'], ['questions.id'], name='options_question_id_fkey'),
    sa.PrimaryKeyConstraint('id', name='options_pkey')
    )
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
    sa.ForeignKeyConstraint(['approved_by'], ['auth_users.id'], name='events_approved_by_fkey'),
    sa.ForeignKeyConstraint(['requested_by'], ['auth_users.id'], name='events_requested_by_fkey'),
    sa.PrimaryKeyConstraint('id', name='events_pkey'),
    sa.UniqueConstraint('title', name='events_title_key')
    )
    op.create_table('questions',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('question_text', sa.VARCHAR(length=500), autoincrement=False, nullable=False),
    sa.Column('category', sa.VARCHAR(length=100), autoincrement=False, nullable=False),
    sa.PrimaryKeyConstraint('id', name='questions_pkey')
    )
    # ### end Alembic commands ###
