# app/rag/tools/tavily_tool.py
from typing import Any, Dict, List

import asyncio
from tavily import TavilyClient

from app.core.config import settings


"""
Tavily web search tool.

We provide an async function `search_web` that internally uses the
synchronous TavilyClient in a background thread, so it plays nicely
with FastAPI/async code.
"""


def _get_tavily_client() -> TavilyClient:
    if not settings.TAVILY_API_KEY:
        raise ValueError("TAVILY_API_KEY is not set in environment")
    return TavilyClient(api_key=settings.TAVILY_API_KEY)


async def search_web(
    query: str,
    max_results: int = 5,
) -> List[Dict[str, Any]]:
    """
    Perform a web search using Tavily and return a simplified list of results.

    Each result dict will contain:
    - id: a simple index-based ID
    - title
    - url
    - content (full text or summary)
    - snippet (shortened content, if available)
    """
    client = _get_tavily_client()

    # TavilyClient.search is synchronous, so we run it in a thread pool
    loop = asyncio.get_running_loop()
    raw_response = await loop.run_in_executor(
        None,
        lambda: client.search(
            query=query,
            max_results=max_results,
        ),
    )

    # The exact schema returned by Tavily can vary; we normalize it.
    # Typical structure: {"results": [ { "title": ..., "url": ..., "content": ... }, ... ]}
    results: List[Dict[str, Any]] = []

    raw_results = raw_response.get("results", [])
    for idx, item in enumerate(raw_results, start=1):
        title = item.get("title") or "Untitled page"
        url = item.get("url") or None
        content = item.get("content") or ""
        snippet = content[:300]

        results.append(
            {
                "id": f"web-{idx}",
                "title": title,
                "url": url,
                "content": content,
                "snippet": snippet,
            }
        )

    return results
