# app/rag/agent.py
import json
from functools import lru_cache
from typing import Any, Dict, Optional, List

from groq import Groq
from sqlalchemy.orm import Session

from app.core.config import settings as app_settings
from app.models.user import User
from app.models.conversation import Conversation
from app.schemas.chat import ChatSettingsSchema, SourceCitationSchema
from app.rag import retrievers


"""
RAG Agent:
- Retrieves context
- Builds the system + user prompt
- Calls Groq LLM
- Returns answer + sources
"""


@lru_cache
def get_groq_client() -> Groq:
    if not app_settings.GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY missing in environment")
    return Groq(api_key=app_settings.GROQ_API_KEY)


async def generate_rag_answer(
    db: Session,
    user: User,
    conversation: Conversation,
    question: str,
    chat_settings: Optional[ChatSettingsSchema] = None,
) -> Optional[Dict[str, Any]]:

    # -------------------------
    # 1. Retrieve context
    # -------------------------
    context = await retrievers.retrieve_context(
        db=db,
        user=user,
        question=question,
        settings=chat_settings,
    )

    docs = context.get("docs", [])
    web_results = context.get("web_results", [])
    formulas = context.get("formulas", [])

    # -------------------------
    # 2. Build prompts
    # -------------------------
    system_prompt = _build_system_prompt(chat_settings)
    user_prompt = _build_user_prompt(
        question=question,
        docs=docs,
        web_results=web_results,
        formulas=formulas,
        chat_settings=chat_settings,
    )

    # -------------------------
    # 3. Call Groq LLM
    # -------------------------
    client = get_groq_client()

    completion = client.chat.completions.create(
        model=app_settings.GROQ_MODEL_NAME,   # ⭐ ALWAYS USE CONFIG MODEL
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        temperature=0.3,
    )

    if not completion.choices:
        return None

    answer = completion.choices[0].message.content

    # -------------------------
    # 4. Build sources info
    # -------------------------
    sources = _build_sources_from_context(docs, web_results, formulas)
    sources_json = json.dumps(
        [s.model_dump() for s in sources],
        ensure_ascii=False,
    )

    return {
        "answer": answer,
        "sources": sources,
        "sources_json": sources_json,
    }


def _build_system_prompt(chat_settings: Optional[ChatSettingsSchema]) -> str:
    difficulty_str = ""
    if chat_settings and chat_settings.difficulty:
        mapping = {1: "beginner", 2: "intermediate", 3: "advanced"}
        difficulty_str = mapping.get(chat_settings.difficulty, "beginner")

    base = (
        "You are a helpful, step-by-step Physics Tutor using Retrieval-Augmented Generation (RAG).\n"
        "- Explain concepts clearly in simple language.\n"
        "- Show reasoning steps.\n"
        "- Prefer local context.\n"
        "- Use web or formulas only if needed.\n"
        "- Only answer physics-related questions.\n"
    )

    if difficulty_str:
        base += f"\nExplain at a {difficulty_str} level.\n"

    return base


def _build_user_prompt(
    question: str,
    docs: List[Any],
    web_results: List[Dict[str, Any]],
    formulas: List[Dict[str, Any]],
    chat_settings: Optional[ChatSettingsSchema],
) -> str:

    parts = [f"Student's question:\n{question}\n"]

    if docs:
        parts.append("\nContext from uploaded documents:\n")
        for i, doc in enumerate(docs, start=1):
            md = doc.metadata or {}
            file_name = md.get("file_name") or md.get("original_filename") or "Unknown file"
            page = md.get("page_number")
            page_info = f" (page {page})" if page else ""
            parts.append(f"[DOC {i}] From {file_name}{page_info}:\n{doc.page_content}\n")

    if web_results:
        parts.append("\nRelevant web results:\n")
        for i, item in enumerate(web_results, start=1):
            parts.append(f"[WEB {i}] {item.get('title')}:\n{item.get('snippet')}\n")

    if formulas:
        parts.append("\nRelevant formulas:\n")
        for i, f in enumerate(formulas, start=1):
            parts.append(
                f"[FORMULA {i}] {f.get('name')}:\n"
                f"Expression: {f.get('expression')}\n"
                f"Description: {f.get('description')}\n"
            )

    parts.append(
        "\nUsing the above context, answer step-by-step. "
        "If missing information, say so briefly.\n"
    )

    if chat_settings and chat_settings.show_sources:
        parts.append("At the end, list which [DOC], [WEB], or [FORMULA] you used.\n")

    return "\n".join(parts)


def _build_sources_from_context(docs, web_results, formulas):
    sources = []

    for doc in docs:
        md = doc.metadata or {}
        sources.append(
            SourceCitationSchema(
                id=str(md.get("vector_id") or ""),
                source_type="document",
                title=md.get("file_name"),
                snippet=doc.page_content[:200],
                file_id=md.get("file_id"),
                page_number=md.get("page_number"),
                extra=md,
            )
        )

    for item in web_results:
        sources.append(
            SourceCitationSchema(
                id=item.get("id"),
                source_type="web",
                title=item.get("title"),
                snippet=item.get("snippet")[:200],
                url=item.get("url"),
                extra=item,
            )
        )

    for f in formulas:
        sources.append(
            SourceCitationSchema(
                id=str(f.get("id")),
                source_type="sql",
                title=f.get("name"),
                snippet=f.get("expression"),
                extra=f,
            )
        )

    return sources
