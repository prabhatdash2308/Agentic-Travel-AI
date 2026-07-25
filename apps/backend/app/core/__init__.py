"""
app/core/__init__.py
--------------------
Re-export the most commonly used core primitives so callers can write:

    from app.core import settings, get_logger
    from app.core import AgenticBaseError, ValidationError, NotFoundError
"""

from app.core.config import settings
from app.core.logging import get_logger
from app.core.exceptions import (
    AgenticBaseError,
    ValidationError,
    WorkflowError,
    NotFoundError,
    ServiceUnavailableError,
)

__all__ = [
    "settings",
    "get_logger",
    "AgenticBaseError",
    "ValidationError",
    "WorkflowError",
    "NotFoundError",
    "ServiceUnavailableError",
]
