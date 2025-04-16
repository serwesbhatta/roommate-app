"""Merge multiple heads

Revision ID: e133dbe847b6
Revises: 1d4b6eeac760, 5aa7e816c531
Create Date: 2025-04-16 22:55:11.308575

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e133dbe847b6'
down_revision: Union[str, None] = ('1d4b6eeac760', '5aa7e816c531')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
