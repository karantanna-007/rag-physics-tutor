# app/rag/tools/sql_tool.py
from typing import Any, Dict, List

from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.models.formula import Formula
from app.models.topic import Topic


"""
SQL tool for NeonDB (PostgreSQL).

Here we implement a helper that finds relevant formulas and topics based
on a natural language question.

For now, we use simple LIKE/ILIKE filters on:
- Formula.name
- Formula.expression
- Formula.description
- Topic.name
- Topic.description
"""


def query_relevant_formulas_and_topics(
    db: Session,
    question: str,
    limit: int = 5,
) -> List[Dict[str, Any]]:
    """
    Query the physics_formulas and physics_topics tables for entries that
    match the given question text.

    Returns a list of dicts, each including:
    - id
    - name
    - expression
    - description
    - topic_id
    - topic_name
    - difficulty
    """
    # Simple text search using ILIKE
    q = f"%{question}%"

    formulas = (
        db.query(Formula, Topic)
        .outerjoin(Topic, Formula.topic_id == Topic.id)
        .filter(
            or_(
                Formula.name.ilike(q),
                Formula.expression.ilike(q),
                Formula.description.ilike(q),
                Topic.name.ilike(q),
                Topic.description.ilike(q),
            )
        )
        .limit(limit)
        .all()
    )

    results: List[Dict[str, Any]] = []
    for formula, topic in formulas:
        results.append(
            {
                "id": formula.id,
                "name": formula.name,
                "expression": formula.expression,
                "description": formula.description,
                "topic_id": formula.topic_id,
                "topic_name": topic.name if topic else None,
                "difficulty": formula.difficulty,
            }
        )

    return results
