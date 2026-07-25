from __future__ import annotations


class AgenticBaseError(Exception):
    status_code: int = 500
    error_code: str = "INTERNAL_ERROR"

    def __init__(self, message: str, *, details: dict | None = None) -> None:
        super().__init__(message)
        self.message = message
        self.details = details or {}

    def to_dict(self) -> dict:
        payload: dict = {"error_code": self.error_code, "message": self.message}
        if self.details:
            payload["details"] = self.details
        return payload


class ValidationError(AgenticBaseError):
    """HTTP 422 — user input failed business-rule validation."""
    status_code = 422
    error_code = "VALIDATION_ERROR"


class WorkflowError(AgenticBaseError):
    """HTTP 500 — planning orchestration failure."""
    status_code = 500
    error_code = "WORKFLOW_ERROR"


class NotFoundError(AgenticBaseError):
    """HTTP 404 — requested resource does not exist."""
    status_code = 404
    error_code = "NOT_FOUND"


class ServiceUnavailableError(AgenticBaseError):
    """HTTP 503 — external dependency unreachable."""
    status_code = 503
    error_code = "SERVICE_UNAVAILABLE"
