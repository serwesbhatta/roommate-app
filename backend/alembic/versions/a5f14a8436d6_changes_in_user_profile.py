"""changes in user profile

Revision ID: a5f14a8436d6
Revises: 5aa7e816c531
Create Date: 2025-04-14 02:58:20.460223

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a5f14a8436d6'
down_revision: Union[str, None] = '5aa7e816c531'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index('ix_user_responses_id', table_name='user_responses')
    op.drop_table('user_responses')
    op.add_column('user_profiles', sa.Column('age', sa.Integer(), nullable=True))
    op.add_column('user_profiles', sa.Column('gender', sa.String(length=20), nullable=True))
    op.add_column('user_profiles', sa.Column('move_in_date', sa.DateTime(timezone=True), nullable=True))
    op.add_column('user_profiles', sa.Column('bio', sa.String(length=800), nullable=True))
    op.add_column('user_profiles', sa.Column('majors', sa.String(length=255), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('user_profiles', 'majors')
    op.drop_column('user_profiles', 'bio')
    op.drop_column('user_profiles', 'move_in_date')
    op.drop_column('user_profiles', 'gender')
    op.drop_column('user_profiles', 'age')
    op.create_table('user_responses',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('user_profile_id', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('question_id', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('selected_option', sa.VARCHAR(), autoincrement=False, nullable=False),
    sa.ForeignKeyConstraint(['question_id'], ['questions.id'], name='user_responses_question_id_fkey', ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['user_profile_id'], ['user_profiles.id'], name='user_responses_user_profile_id_fkey', ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id', name='user_responses_pkey')
    )
    op.create_index('ix_user_responses_id', 'user_responses', ['id'], unique=False)
    # ### end Alembic commands ###
