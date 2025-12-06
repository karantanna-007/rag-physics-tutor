# app/api/v1/routes_chat.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_db, get_current_user
from app.schemas.chat import ChatRequest, ChatResponse
from app.services import chat_service
from app.models.user import User

router = APIRouter(prefix="/chat")


@router.post("/", response_model=ChatResponse)
async def chat_with_tutor(
    payload: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ChatResponse:
    """
    Main RAG chat endpoint.

    Flow (in chat_service.chat_with_rag):
    - Use current_user.id and payload (message, conversation_id, settings)
    - Retrieve relevant local chunks from Pinecone
    - Optionally use Tavily web search
    - Optionally use SQL tool for formulas/topics from Neon
    - Compose prompt and call Groq LLM
    - Store conversation + messages in NeonDB
    - Return answer with citation metadata
    """
    if not payload.message or not payload.message.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Message cannot be empty",
        )

    response = await chat_service.chat_with_rag(
        db=db,
        user=current_user,
        chat_request=payload,
    )

    if response is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate a response from the physics tutor",
        )

    return response
