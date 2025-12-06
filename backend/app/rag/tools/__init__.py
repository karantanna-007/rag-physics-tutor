# app/rag/tools/__init__.py
"""
Tool layer for the RAG Physics Tutor.

These are small, focused utilities that can be used by:
- the RAG retrievers (local docs + web + SQL)
- a LangChain agent (if you later build a tool-using agent)

Tools:
- pinecone_tool: direct vector search helpers (if needed)
- tavily_tool:   web search using Tavily API
- sql_tool:      SQL-based lookup for formulas and topics in NeonDB
"""

from . import pinecone_tool, tavily_tool, sql_tool  # noqa: F401

__all__ = ["pinecone_tool", "tavily_tool", "sql_tool"]
