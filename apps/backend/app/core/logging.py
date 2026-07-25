"""
app/core/logging.py
-------------------
Centralised logger factory.

Usage:
    from app.core.logging import get_logger
    logger = get_logger(__name__)
    logger.info("Workflow created", extra={"workflow_id": wf_id})
"""

import logging
import sys
from app.core.config import settings


# ── Formatter ────────────────────────────────────────────────────────────────

class _StructuredFormatter(logging.Formatter):
    """
    Produces human-readable, structured log lines:
        2026-07-25 10:30:00 | INFO     | app.services.planner_service | message
    """

    FMT = "%(asctime)s | %(levelname)-8s | %(name)s | %(message)s"
    DATEFMT = "%Y-%m-%d %H:%M:%S"

    def __init__(self) -> None:
        super().__init__(fmt=self.FMT, datefmt=self.DATEFMT)


# ── Root handler (configured once) ───────────────────────────────────────────

def _configure_root_logger() -> None:
    root = logging.getLogger()
    if root.handlers:
        return  # already configured

    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(_StructuredFormatter())
    root.addHandler(handler)
    root.setLevel(settings.LOG_LEVEL)


_configure_root_logger()


# ── Public factory ────────────────────────────────────────────────────────────

def get_logger(name: str) -> logging.Logger:
    """Return a named logger inheriting the root configuration."""
    return logging.getLogger(name)
