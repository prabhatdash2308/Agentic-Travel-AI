from __future__ import annotations

from functools import partial

from langgraph.graph import StateGraph, START, END
from langchain_groq import ChatGroq

from app.agent.state import PlannerState
from app.agent.nodes import (
    parse_intent,
    extract_requirements,
    research_destinations,
    draft_itinerary,
    estimate_costs,
    compile_tips,
    assemble_plan,
)
from app.core import get_logger

logger = get_logger(__name__)


def build_planner_graph(llm: ChatGroq) -> StateGraph:
    """
    Construct and compile the LangGraph travel planner pipeline.

    Graph topology (linear sequential pipeline):

        START
          │
          ▼
        parse_intent
          │
          ▼
        extract_requirements
          │
          ▼
        research_destinations
          │
          ▼
        draft_itinerary
          │
          ▼
        estimate_costs
          │
          ▼
        compile_tips
          │
          ▼
        assemble_plan
          │
          ▼
         END

    Each node receives the full PlannerState and returns a partial dict
    that is merged back into the state by LangGraph's reducer.

    The LLM client is injected at graph-build time via functools.partial
    so nodes remain pure async functions (easier to test).
    """
    graph = StateGraph(PlannerState)

    # Wrap each node with the injected LLM
    graph.add_node("parse_intent",           partial(parse_intent,           llm=llm))
    graph.add_node("extract_requirements",   partial(extract_requirements,   llm=llm))
    graph.add_node("research_destinations",  partial(research_destinations,  llm=llm))
    graph.add_node("draft_itinerary",        partial(draft_itinerary,        llm=llm))
    graph.add_node("estimate_costs",         partial(estimate_costs,         llm=llm))
    graph.add_node("compile_tips",           partial(compile_tips,           llm=llm))
    graph.add_node("assemble_plan",          partial(assemble_plan,          llm=llm))

    # Linear edges
    graph.add_edge(START,                    "parse_intent")
    graph.add_edge("parse_intent",           "extract_requirements")
    graph.add_edge("extract_requirements",   "research_destinations")
    graph.add_edge("research_destinations",  "draft_itinerary")
    graph.add_edge("draft_itinerary",        "estimate_costs")
    graph.add_edge("estimate_costs",         "compile_tips")
    graph.add_edge("compile_tips",           "assemble_plan")
    graph.add_edge("assemble_plan",          END)

    compiled = graph.compile()
    logger.info("Planner graph compiled successfully")
    return compiled
