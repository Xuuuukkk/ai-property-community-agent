"""Redis client factory.

The client is created lazily and does not connect until a command is issued,
so importing this module never requires a live Redis server.
"""
from functools import lru_cache

import redis

from app.core.config import get_settings


@lru_cache
def get_redis() -> redis.Redis:
    """Return a cached Redis client (decode responses to str)."""
    return redis.Redis.from_url(get_settings().REDIS_URL, decode_responses=True)
