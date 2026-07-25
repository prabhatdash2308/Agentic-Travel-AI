"""
app/core/exceptions.py
-----------------------
Custom exception hierarchy for Agentic Travel AI.

Every domain exception maps to an HTTP status code so the global
exception handler in main.py can convert them uniformly.
"""

from __future__ import annotations


class AgenticBaseError(Exception):
    """
    Base class for all domain exceptions.

    Attributes:
        message: Human-readable description of the error.
        status_code: Corresponding HTTP status code.
        error_code: Machine-readable string identifier (for API clients).
    """

    status_code: int = 500
    error_code: str = "INTERNAL_ERROR"

    def __init__(self, message: str, *, details: dict | None = None) -> None:
        super().__init__(message)
        self.message = message
        self.details = details or {}

    def to_dict(self) -> dict:
        payload: dict = {
            "error_code": self.error_code,
            "message": self.message,
        }
        if self.details:
            payload["details"] = self.details
        return payload


class ValidationError(AgenticBaseError):
    """
    Raised when user-supplied data fails business-rule validation
    (beyond Pydantic field validation).

    HTTP 422 — matches FastAPI's own unprocessable-entity convention.
    """

    status_code = 422
    error_code = "VALIDATION_ERROR"


class WorkflowError(AgenticBaseError):
    """
    Raised when the planning orchestration pipeline encounters
    an unrecoverable failure.

    HTTP 500
    """

    status_code = 500
    error_code = "WORKFLOW_ERROR"


class NotFoundError(AgenticBaseError):
    """
    Raised when a requested resource (e.g. workflow ID) does not exist.

    HTTP 404
    """

    status_code = 404
    error_code = "NOT_FOUND"


class ServiceUnavailableError(AgenticBaseError):
    """
    Raised when an external dependency (LLM, DB, cache) is unreachable.

    HTTP 503 — allows the caller to retry.
    """

    status_code = 503
    error_code = "SERVICE_UNAVAILABLE"
