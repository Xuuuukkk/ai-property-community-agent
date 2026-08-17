"""CI gate: run the agent evaluation suite against the test database.

Indexes the Markdown knowledge base into the isolated test DB (deterministic
384-d embeddings, resized by conftest), runs the evaluation suites that do not
depend on embedding quality, and asserts minimum quality gates.

Note: RAG retrieval/answer gates are intentionally NOT asserted here because
deterministic embeddings are hash-based (no semantics), so retrieval scores in
CI are meaningless. Run the full suite with a real embedding model locally
(`python -m app.agents.evaluation`).
"""

from sqlalchemy.orm import Session

from app.agents.evaluation.runner import AgentEvaluator
from app.core.paths import KNOWLEDGE_BASE_DIR, REPO_ROOT
from app.services.knowledge_indexer import index_documents


def test_agent_evaluation_gates(db: Session, test_database) -> None:
    """Index knowledge and evaluate; assert the embedding-free gates hold."""
    # The test DB's knowledge tables are truncated by conftest, so (re)index.
    index_documents(db, KNOWLEDGE_BASE_DIR, repo_root=REPO_ROOT)
    db.commit()

    report = AgentEvaluator(db).run()
    data = report.to_dict()

    intent = data["intent"]["accuracy"]
    tool = data["tool"]["tool_accuracy"]

    print(f"\n=== CI 评估门禁 ===\n  intent: {intent:.2%}\n  tool: {tool:.2%}")

    assert intent >= 0.9, f"intent accuracy {intent:.2%} below gate 90%"
    assert tool >= 0.6, f"tool accuracy {tool:.2%} below gate 60%"
