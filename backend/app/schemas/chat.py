# app/schemas/chat.py
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, ConfigDict


class SourceCitationSchema(BaseModel):
    """
    Represents a single source used in generating an answer.

    Can be:
    - a local document chunk (file_id, page_number)
    - a web result (url)
    - a SQL-based reference (e.g., formula/topic)
    """
    id: Optional[str] = None  # e.g., vector_id or some unique reference
    source_type: Optional[str] = None  # "document" | "web" | "sql" | "other"
    title: Optional[str] = None  # file name, web page title, formula name, etc.
    snippet: Optional[str] = None  # short preview text
    url: Optional[str] = None  # for web results
    file_id: Optional[int] = None  # if local file
    page_number: Optional[int] = None
    extra: Optional[Dict[str, Any]] = None  # for any additional metadata


class ChatMessageSchema(BaseModel):
    """
    Represents a single message in the chat response.

    - role: "user" | "assistant" | "system"
    - content: the message text
    - sources: optional list of SourceCitationSchema for assistant messages
    """
    id: Optional[str] = None
    role: str
    content: str
    sources: Optional[List[SourceCitationSchema]] = None


class ChatSettingsSchema(BaseModel):
    """
    Optional settings that can influence how the RAG tutor answers.

    These may be filled from the SettingsPage later.
    """
    difficulty: Optional[int] = None  # 1=beginner, 2=intermediate, 3=advanced
    topics: Optional[List[str]] = None
    show_step_by_step: Optional[bool] = True
    show_sources: Optional[bool] = True
    prefer_local_docs: Optional[bool] = True


class ChatRequest(BaseModel):
    """
    Request body for /chat endpoint.

    - message: student's question
    - conversation_id: optional existing conversation id (for follow-ups)
    - settings: optional per-request tutor settings/preferences
    """
    message: str
    conversation_id: Optional[int | str] = None
    settings: Optional[ChatSettingsSchema] = None


class ChatResponse(BaseModel):
    """
    Response from /chat endpoint.

    - conversation_id: identifier of the conversation (string or int)
    - reply: the assistant's reply as ChatMessageSchema
    """
    conversation_id: str
    reply: ChatMessageSchema

    model_config = ConfigDict(from_attributes=True)
