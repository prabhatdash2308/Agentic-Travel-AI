import logging
import sys
from app.core.config import settings


class _StructuredFormatter(logging.Formatter):
    FMT = "%(asctime)s | %(levelname)-8s | %(name)s | %(message)s"
    DATEFMT = "%Y-%m-%d %H:%M:%S"

    def __init__(self) -> None:
        super().__init__(fmt=self.FMT, datefmt=self.DATEFMT)


def _configure_root_logger() -> None:
    root = logging.getLogger()
    if root.handlers:
        return
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(_StructuredFormatter())
    root.addHandler(handler)
    root.setLevel(settings.LOG_LEVEL)


_configure_root_logger()


def get_logger(name: str) -> logging.Logger:
    return logging.getLogger(name)
