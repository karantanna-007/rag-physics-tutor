# app/rag/retrievers.py
from typing import Any, Dict, List, Optional

from sqlalchemy.orm import Session
from langchain_core.documents import Document

from app.models.user import User
from app.rag.vectorstore import get_retriever
from app.schemas.chat import ChatSettingsSchema
from app.rag.tools import tavily_tool, sql_tool  # will implement later


"""
High-level retrieval logic.

This module combines:
- Local document retrieval (Pinecone)
- Web search (Tavily)
- SQL-based retrieval (formulas/topics from NeonDB)

The result is a dictionary with:
- docs: List[Document]
- web_results: List[dict]
- formulas: List[dict]
"""


async def retrieve_context(
    db: Session,
    user: User,
    question: str,
    settings: Optional[ChatSettingsSchema] = None,
) -> Dict[str, Any]:
    """
    Retrieve all relevant context for a given question.

    - Local vector-based docs
    - Web search results (Tavily) when needed
    - Structured formulas/topics from SQL
    """
    # 1) Local docs via Pinecone retriever
    docs = await _retrieve_local_docs(question=question, k=5)

    # 2) Should we call web search?
    call_web = False
    if not docs or len(docs) < 2:
        call_web = True
    if settings and settings.prefer_local_docs is False:
        call_web = True

    web_results: List[Dict[str, Any]] = []
    if call_web:
        web_results = await tavily_tool.search_web(
            query=question,
            max_results=5,
        )

    # 3) SQL-based retrieval (formulas, topics) from NeonDB
    formulas: List[Dict[str, Any]] = sql_tool.query_relevant_formulas_and_topics(
        db=db,
        question=question,
        limit=5,
    )

    return {
        "docs": docs,
        "web_results": web_results,
        "formulas": formulas,
    }


async def _retrieve_local_docs(question: str, k: int = 5) -> List[Document]:
    """
    Use the Pinecone-based retriever to fetch the top-k relevant documents.

    Supports both the new runnable API (ainvoke) and older
    get_relevant_documents/aget_relevant_documents methods.
    """
    retriever = get_retriever(k=k)

    # Prefer new LangChain runnable API
    try:
        docs: List[Document] = await retriever.ainvoke(question)
        return docs
    except AttributeError:
        # Fallback for older async API
        try:
            docs = await retriever.aget_relevant_documents(question)  # type: ignore[attr-defined]
            return docs
        except AttributeError:
            # Final fallback: synchronous retrieval
            docs = retriever.get_relevant_documents(question)
            return docs
