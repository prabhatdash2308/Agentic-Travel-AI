from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Annotated

from pydantic import BaseModel, Field, field_validator, model_validator


class WorkflowStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"


class BudgetTier(str, Enum):
    BUDGET = "budget"
    MID_RANGE = "mid-range"
    LUXURY = "luxury"


class TravelPreferences(BaseModel):
    budget: BudgetTier | None = Field(default=None, examples=["mid-range"])
    travel_style: list[str] | None = Field(default=None, examples=[["cultural", "foodie"]])
    duration_days: Annotated[int, Field(ge=1, le=90)] | None = Field(default=None, examples=[7])
    origin: str | None = Field(default=None, max_length=100, examples=["New Delhi"])
    destinations: list[str] | None = Field(default=None, max_length=10, examples=[["Tokyo", "Kyoto"]])

    @field_validator("travel_style", "destinations", mode="before")
    @classmethod
    def strip_empty_strings(cls, v: list[str] | None) -> list[str] | None:
        if v is None:
            return v
        return [item.strip() for item in v if item and item.strip()]


class WorkflowRequest(BaseModel):
    query: Annotated[str, Field(min_length=10, max_length=1000)] = Field(
        ...,
        description="Free-text travel intent.",
        examples=["Plan a 7-day budget-friendly trip to Japan in October."],
    )
    user_id: str | None = Field(default=None, examples=["user-abc123"])
    preferences: TravelPreferences | None = Field(default=None)

    @field_validator("query", mode="before")
    @classmethod
    def strip_query(cls, v: str) -> str:
        return v.strip()

    @model_validator(mode="after")
    def cross_field_validation(self) -> "WorkflowRequest":
        if self.preferences and self.preferences.destinations:
            if len(self.preferences.destinations) > 5:
                raise ValueError(
                    "A single workflow supports at most 5 destinations."
                )
        return self


class WorkflowResponse(BaseModel):
    workflow_id: str = Field(..., description="UUID4 identifier for this workflow run.")
    status: WorkflowStatus = Field(..., description="Current lifecycle state.")
    message: str = Field(..., description="Human-readable status message.")
    created_at: datetime = Field(..., description="UTC timestamp of creation.")
    estimated_steps: list[str] = Field(default_factory=list, description="Ordered planning steps.")

    model_config = {"use_enum_values": True}
