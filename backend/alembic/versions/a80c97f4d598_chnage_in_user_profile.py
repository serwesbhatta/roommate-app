"""chnage in user profile

Revision ID: a80c97f4d598
Revises: 0ada9425fbae
Create Date: 2025-04-21 01:55:02.792579

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'a80c97f4d598'
down_revision: Union[str, None] = '0ada9425fbae'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index('ix_feedback_id', table_name='feedback')
    op.drop_table('feedback')
    op.add_column('user_profiles', sa.Column('last_login', sa.DateTime(timezone=True), nullable=True))
    op.add_column('user_profiles', sa.Column('is_logged_in', sa.Boolean(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('user_profiles', 'is_logged_in')
    op.drop_column('user_profiles', 'last_login')
    op.create_table('feedback',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('giver_user_id', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('receiver_user_id', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('rating', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('feedback_text', sa.VARCHAR(length=1000), autoincrement=False, nullable=True),
    sa.Column('created_at', postgresql.TIMESTAMP(), autoincrement=False, nullable=True),
    sa.Column('updated_at', postgresql.TIMESTAMP(), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['giver_user_id'], ['user_profiles.id'], name='feedback_giver_user_id_fkey', ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['receiver_user_id'], ['user_profiles.id'], name='feedback_receiver_user_id_fkey', ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id', name='feedback_pkey')
    )
    op.create_index('ix_feedback_id', 'feedback', ['id'], unique=False)
    # ### end Alembic commands ###
