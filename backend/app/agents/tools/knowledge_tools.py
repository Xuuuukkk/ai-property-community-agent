"""Knowledge tools exposed to the Knowledge Agent.

These are placeholders for Phase 6 (RAG). The current implementation returns
a polite fallback so the agent can respond without hallucinating.
"""


def search_knowledge(query: str) -> dict:
    """Search the knowledge base for documents matching the query."""
    return {
        "query": query,
        "results": [],
        "message": "知识库检索功能将在 Phase 6（RAG 系统）中实现。当前无法回答该问题，建议联系物业服务中心。",
    }


def retrieve_document(document_id: str) -> dict:
    """Retrieve a specific knowledge document by ID."""
    return {
        "document_id": document_id,
        "content": None,
        "message": "知识库检索功能将在 Phase 6（RAG 系统）中实现。",
    }
