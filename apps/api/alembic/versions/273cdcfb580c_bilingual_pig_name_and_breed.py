"""bilingual pig name and breed

Revision ID: 273cdcfb580c
Revises: ca04720ef3b8
Create Date: 2026-07-13 10:22:46.288579

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '273cdcfb580c'
down_revision: Union[str, None] = 'ca04720ef3b8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Rename (not drop+add) so existing pig names/breeds are preserved as the
    # English value; Nepali starts empty and falls back to English on the site.
    op.alter_column("pigs", "name", new_column_name="name_en")
    op.alter_column("pigs", "breed", new_column_name="breed_en")
    op.add_column("pigs", sa.Column("name_ne", sa.String(), nullable=False, server_default=""))
    op.add_column("pigs", sa.Column("breed_ne", sa.String(), nullable=False, server_default=""))
    op.alter_column("pigs", "name_ne", server_default=None)
    op.alter_column("pigs", "breed_ne", server_default=None)


def downgrade() -> None:
    op.drop_column("pigs", "breed_ne")
    op.drop_column("pigs", "name_ne")
    op.alter_column("pigs", "breed_en", new_column_name="breed")
    op.alter_column("pigs", "name_en", new_column_name="name")
