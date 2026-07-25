from __future__ import annotations

from langchain_core.messages import HumanMessage, SystemMessage
from langchain_google_genai import ChatGoogleGenerativeAI

from app.agent.state import PlannerState
from app.core import get_logger

logger = get_logger(__name__)


# ── Shared prompt helpers ─────────────────────────────────────────────────────

def _prefs_block(state: PlannerState) -> str:
    """Build a compact preferences summary to embed in prompts."""
    lines = []
    if state.get("budget"):
        lines.append(f"- Budget tier: {state['budget']}")
    if state.get("duration_days"):
        lines.append(f"- Duration: {state['duration_days']} days")
    if state.get("origin"):
        lines.append(f"- Departing from: {state['origin']}")
    if state.get("destinations"):
        lines.append(f"- Destinations: {', '.join(state['destinations'])}")
    if state.get("travel_style"):
        lines.append(f"- Travel style: {', '.join(state['travel_style'])}")
    return "\n".join(lines) if lines else "No specific preferences provided."


# ── Node 1: Parse intent ──────────────────────────────────────────────────────

async def parse_intent(state: PlannerState, llm: ChatGoogleGenerativeAI) -> dict:
    """
    Extract the core travel intent from the raw user query.
    Identifies: who, where, when, why, what kind of trip.
    """
    logger.debug("Node: parse_intent")
    messages = [
        SystemMessage(content=(
            "You are a travel planning assistant. "
            "Extract the core travel intent from the user's query in 2-3 concise sentences. "
            "Identify: who is travelling, destination(s), approximate timing, and trip purpose."
        )),
        HumanMessage(content=f"User query: {state['query']}\n\nPreferences:\n{_prefs_block(state)}"),
    ]
    response = await llm.ainvoke(messages)
    return {
        "parsed_intent": response.content,
        "completed_steps": ["Parse and understand travel intent"],
    }


# ── Node 2: Extract requirements ──────────────────────────────────────────────

async def extract_requirements(state: PlannerState, llm: ChatGoogleGenerativeAI) -> dict:
    """
    Identify key constraints, must-haves, and potential challenges.
    """
    logger.debug("Node: extract_requirements")
    messages = [
        SystemMessage(content=(
            "You are a travel planning assistant. "
            "Based on the travel intent and preferences, list the key requirements, "
            "constraints, and potential challenges for this trip. Be concise and structured."
        )),
        HumanMessage(content=(
            f"Travel intent: {state['parsed_intent']}\n\n"
            f"Preferences:\n{_prefs_block(state)}"
        )),
    ]
    response = await llm.ainvoke(messages)
    return {
        "requirements": response.content,
        "completed_steps": ["Identify key requirements and constraints"],
    }


# ── Node 3: Research destinations ─────────────────────────────────────────────

async def research_destinations(state: PlannerState, llm: ChatGoogleGenerativeAI) -> dict:
    """
    Generate highlights, must-see attractions, and local insights for destinations.
    """
    logger.debug("Node: research_destinations")
    dest_str = (
        ", ".join(state["destinations"]) if state.get("destinations")
        else "the destination mentioned in the query"
    )
    messages = [
        SystemMessage(content=(
            "You are a knowledgeable travel guide. "
            "Provide a rich overview of the destination(s) including: "
            "top attractions, neighbourhoods, local culture, best time to visit, "
            "and insider tips. Be specific and practical."
        )),
        HumanMessage(content=(
            f"Destinations: {dest_str}\n"
            f"Travel style: {', '.join(state.get('travel_style', [])) or 'general'}\n"
            f"Trip context: {state['parsed_intent']}"
        )),
    ]
    response = await llm.ainvoke(messages)
    return {
        "destination_research": response.content,
        "completed_steps": ["Research destination highlights and attractions"],
    }


# ── Node 4: Draft itinerary ───────────────────────────────────────────────────

async def draft_itinerary(state: PlannerState, llm: ChatGoogleGenerativeAI) -> dict:
    """
    Create a structured day-by-day itinerary.
    """
    logger.debug("Node: draft_itinerary")
    days = state.get("duration_days") or "the appropriate number of"
    messages = [
        SystemMessage(content=(
            "You are an expert travel planner. "
            f"Create a detailed day-by-day itinerary for {days} days. "
            "For each day include: morning, afternoon, and evening activities, "
            "recommended restaurants/cafes, and any logistics notes. "
            "Format clearly with 'Day N:' headers."
        )),
        HumanMessage(content=(
            f"Trip intent: {state['parsed_intent']}\n\n"
            f"Requirements: {state['requirements']}\n\n"
            f"Destination insights:\n{state['destination_research']}\n\n"
            f"Preferences:\n{_prefs_block(state)}"
        )),
    ]
    response = await llm.ainvoke(messages)
    return {
        "itinerary_draft": response.content,
        "completed_steps": ["Draft a day-by-day itinerary"],
    }


# ── Node 5: Estimate costs ────────────────────────────────────────────────────

async def estimate_costs(state: PlannerState, llm: ChatGoogleGenerativeAI) -> dict:
    """
    Provide a realistic budget breakdown for the trip.
    """
    logger.debug("Node: estimate_costs")
    messages = [
        SystemMessage(content=(
            "You are a travel budget expert. "
            "Provide a realistic cost breakdown for the trip covering: "
            "flights, accommodation per night, daily food budget, activities/entrance fees, "
            "local transport, and a recommended total budget range. "
            "Use the budget tier as a guide. Provide estimates in USD."
        )),
        HumanMessage(content=(
            f"Budget tier: {state.get('budget', 'mid-range')}\n"
            f"Duration: {state.get('duration_days', 'unknown')} days\n"
            f"Origin: {state.get('origin', 'unknown')}\n"
            f"Destinations: {', '.join(state.get('destinations', [])) or 'as per itinerary'}\n\n"
            f"Itinerary summary:\n{state['itinerary_draft'][:800]}"
        )),
    ]
    response = await llm.ainvoke(messages)
    return {
        "cost_estimate": response.content,
        "completed_steps": ["Estimate costs and budget breakdown"],
    }


# ── Node 6: Compile tips ──────────────────────────────────────────────────────

async def compile_tips(state: PlannerState, llm: ChatGoogleGenerativeAI) -> dict:
    """
    Gather practical tips: culture, safety, packing, and local etiquette.
    """
    logger.debug("Node: compile_tips")
    dest_str = (
        ", ".join(state["destinations"]) if state.get("destinations")
        else "the destination"
    )
    messages = [
        SystemMessage(content=(
            "You are a seasoned traveller. Provide practical travel advice including: "
            "cultural etiquette, safety tips, packing essentials, local transport tips, "
            "useful phrases if applicable, and any important health or visa notes. "
            "Keep it practical and actionable."
        )),
        HumanMessage(content=(
            f"Destination(s): {dest_str}\n"
            f"Travel style: {', '.join(state.get('travel_style', [])) or 'general'}\n"
            f"Duration: {state.get('duration_days', 'unknown')} days"
        )),
    ]
    response = await llm.ainvoke(messages)
    return {
        "tips": response.content,
        "completed_steps": ["Compile local tips, cultural notes, and packing advice"],
    }


# ── Node 7: Assemble final plan ───────────────────────────────────────────────

async def assemble_plan(state: PlannerState, llm: ChatGoogleGenerativeAI) -> dict:
    """
    Combine all node outputs into the final polished travel plan document.
    """
    logger.debug("Node: assemble_plan")
    messages = [
        SystemMessage(content=(
            "You are a professional travel writer. "
            "Compile all the provided information into a single, beautifully formatted "
            "travel plan document. Structure it with clear sections: "
            "Overview, Day-by-Day Itinerary, Budget Summary, and Travel Tips. "
            "Make it inspiring, practical, and ready to share."
        )),
        HumanMessage(content=(
            f"=== TRIP OVERVIEW ===\n{state['parsed_intent']}\n\n"
            f"=== REQUIREMENTS & CONSTRAINTS ===\n{state['requirements']}\n\n"
            f"=== DESTINATION HIGHLIGHTS ===\n{state['destination_research']}\n\n"
            f"=== DAY-BY-DAY ITINERARY ===\n{state['itinerary_draft']}\n\n"
            f"=== BUDGET BREAKDOWN ===\n{state['cost_estimate']}\n\n"
            f"=== TRAVEL TIPS ===\n{state['tips']}"
        )),
    ]
    response = await llm.ainvoke(messages)
    return {
        "final_plan": response.content,
        "completed_steps": ["Assemble and format the final travel plan"],
    }
