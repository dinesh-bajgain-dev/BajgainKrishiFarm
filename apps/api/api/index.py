"""Vercel's Python runtime looks for an ASGI/WSGI app named `app` in this file."""

from app.main import app

__all__ = ["app"]
