"""AI Agent layer for the property community platform.

The agent layer follows the design docs:

    User Input -> Router Agent -> Domain Agent -> Tools -> Services -> DB

Agents never touch the database directly. All business actions go through
the existing service/repository layer.
"""

from app.agents.graph import AgentResult, run_agent

__all__ = ["AgentResult", "run_agent"]
