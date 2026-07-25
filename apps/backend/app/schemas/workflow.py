"""
app/schemas/workflow.py
------------------------
Pydantic v2 schemas for the /api/workflow endpoints.

Hierarchy:
    TravelPreferences   (optional nested object inside WorkflowRequest)
    WorkflowRequest     (POST /api/workflow/run  — inbound)
    WorkflowStatus      (enum shared by request & response)
    WorkflowResponse    (POST & GET responses — outbound)
"""

from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Annotated

from pydantic import BaseModel, Field, field_validator, model_validator


# ── Enums ─────────────────────────────────────────────────────────────────────

class WorkflowStatus(str, Enum):
    """Lifecycle state of a planning workflow."""

    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"


class BudgetTier(str, Enum):
    BUDGET = "budget"
    MID_RANGE = "mid-range"
    LUXURY = "luxury"


# ── Sub-schemas ───────────────────────────────────────────────────────────────

class TravelPreferences(BaseModel):
    """
    Optional traveller preferences to enrich the planning context.
    All fields are optional — the planner will apply sensible defaults.
    """

    budget: BudgetTier | None = Field(
        default=None,
        description="Preferred spend tier: budget, mid-range, or luxury.",
        examples=["mid-range"],
    )
    travel_style: list[str] | None = Field(
        default=None,
        description="Travel style tags e.g. ['adventure', 'cultural', 'relaxation'].",
        examples=[["cultural", "foodie"]],
        min_length=0,
        max_length=10,
    )
    duration_days: Annotated[int, Field(ge=1, le=90)] | None = Field(
        default=None,
        description="Total trip length in days (1–90).",
        examples=[7],
    )
    origin: str | None = Field(
        default=None,
        description="Departure city or airport code.",
        examples=["New Delhi"],
        max_length=100,
    )
    destinations: list[str] | None = Field(
        default=None,
        description="Target destination(s).",
        examples=[["Tokyo", "Kyoto", "Osaka"]],
        max_length=10,
    )

    @field_validator("travel_style", "destinations", mode="before")
    @classmethod
    def strip_empty_strings(cls, v: list[str] | None) -> list[str] | None:
        """Remove blank entries from list fields."""
        if v is None:
            return v
        return [item.strip() for item in v if item and item.strip()]


# ── Request ───────────────────────────────────────────────────────────────────

class WorkflowRequest(BaseModel):
    """
    Inbound payload for POST /api/workflow/run.

    `query` is the free-text travel intent from the user.
    `preferences` is an optional structured supplement.
    """

    query: Annotated[str, Field(min_length=10, max_length=1000)] = Field(
        ...,
        description="Free-text travel intent, e.g. 'Plan a 7-day trip to Japan'.",
        examples=["Plan a 7-day budget-friendly trip to Japan in October."],
    )
    user_id: str | None = Field(
        default=None,
        description="Optional authenticated user identifier.",
        examples=["user-abc123"],
    )
    preferences: TravelPreferences | None = Field(
        default=None,
        description="Optional structured travel preferences.",
    )

    @field_validator("query", mode="before")
    @classmethod
    def strip_query(cls, v: str) -> str:
        return v.strip()

    @model_validator(mode="after")
    def cross_field_validation(self) -> "WorkflowRequest":
        """
        Business rules that span multiple fields.
        Add more cross-field checks here as requirements evolve.
        """
        if self.preferences and self.preferences.destinations:
            if len(self.preferences.destinations) > 5:
                raise ValueError(
                    "A single workflow supports at most 5 destinations. "
                    "Split into multiple requests for larger itineraries."
                )
        return self


# ── Response ──────────────────────────────────────────────────────────────────

class WorkflowResponse(BaseModel):
    """
    Outbound payload for POST /api/workflow/run and GET /api/status/{id}.
    """

    workflow_id: str = Field(
        ...,
        description="UUID4 identifier for this workflow run.",
        examples=["3fa85f64-5717-4562-b3fc-2c963f66afa6"],
    )
    status: WorkflowStatus = Field(
        ...,
        description="Current lifecycle state of the workflow.",
        examples=[WorkflowStatus.PENDING],
    )
    message: str = Field(
        ...,
        description="Human-readable status message.",
        examples=["Workflow accepted and queued for planning."],
    )
    created_at: datetime = Field(
        ...,
        description="UTC timestamp when the workflow was created.",
    )
    estimated_steps: list[str] = Field(
        default_factory=list,
        description="Ordered list of planning steps the agent will execute.",
        examples=[
            [
                "Parse and understand travel intent",
                "Research destination highlights",
                "Draft day-by-day itinerary",
                "Estimate costs and budget breakdown",
                "Compile final travel plan",
            ]
        ],
    )

    model_config = {"use_enum_values": True}
