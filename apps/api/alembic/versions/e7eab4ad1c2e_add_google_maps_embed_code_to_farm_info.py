"""add google_maps_embed_code to farm_info

Revision ID: e7eab4ad1c2e
Revises: 0568d5d28e4f
Create Date: 2026-07-13 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "e7eab4ad1c2e"
down_revision: Union[str, None] = "0568d5d28e4f"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("farm_info", sa.Column("google_maps_embed_code", sa.Text(), nullable=True))
    op.alter_column("farm_info", "latitude", existing_type=sa.Float(), nullable=True)
    op.alter_column("farm_info", "longitude", existing_type=sa.Float(), nullable=True)


def downgrade() -> None:
    op.drop_column("farm_info", "google_maps_embed_code")
    op.alter_column("farm_info", "latitude", existing_type=sa.Float(), nullable=False)
    op.alter_column("farm_info", "longitude", existing_type=sa.Float(), nullable=False)
