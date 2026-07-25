from __future__ import annotations

from typing import Annotated, TypedDict
import operator


class PlannerState(TypedDict):
    """
    Shared state that flows through every node of the LangGraph planner graph.

    Each list field uses `operator.add` as the reducer so nodes can append
    to it without overwriting previous data.
    """

    # ── Input ─────────────────────────────────────────────────────────────────
    query: str                          # raw user travel intent
    user_id: str | None                 # optional authenticated user

    # Flattened preference fields (easier to pass to prompt templates)
    budget: str | None                  # "budget" | "mid-range" | "luxury"
    travel_style: list[str]             # e.g. ["cultural", "foodie"]
    duration_days: int | None           # 1–90
    origin: str | None                  # departure city
    destinations: list[str]             # target destination(s)

    # ── Intermediate node outputs ─────────────────────────────────────────────
    parsed_intent: str                  # node: parse_intent
    requirements: str                   # node: extract_requirements
    destination_research: str           # node: research_destinations
    itinerary_draft: str                # node: draft_itinerary
    cost_estimate: str                  # node: estimate_costs
    tips: str                           # node: compile_tips

    # ── Final output ──────────────────────────────────────────────────────────
    final_plan: str                     # node: assemble_plan
    completed_steps: Annotated[list[str], operator.add]   # accumulates step names
    errors: Annotated[list[str], operator.add]            # accumulates any errors
