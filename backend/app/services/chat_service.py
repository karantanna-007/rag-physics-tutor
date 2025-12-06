# app/services/chat_service.py
from typing import Optional

from sqlalchemy.orm import Session

from app.models.user import User
from app.models.conversation import Conversation
from app.models.message import Message
from app.schemas.chat import ChatRequest, ChatResponse, ChatMessageSchema
from app.rag import agent as rag_agent


async def chat_with_rag(
    db: Session,
    user: User,
    chat_request: ChatRequest,
) -> Optional[ChatResponse]:
    """
    Main orchestration function for the RAG Physics Tutor.

    Steps:
    - Resolve or create a conversation for this user
    - Store user's question as a Message (role='user')
    - Call RAG agent to generate an answer (with sources)
    - Store assistant's message in DB
    - Return ChatResponse (conversation_id + reply)
    """
    # 1) Get or create conversation
    conversation = _get_or_create_conversation(
        db=db,
        user=user,
        conversation_id=chat_request.conversation_id,
    )

    # 2) Persist user's message
    user_msg = Message(
        conversation_id=conversation.id,
        role="user",
        content=chat_request.message,
    )
    db.add(user_msg)
    db.commit()
    db.refresh(user_msg)

    # 3) Call RAG agent to generate assistant reply
    #    New signature in agent.generate_rag_answer uses `chat_settings`
    rag_result = await rag_agent.generate_rag_answer(
        db=db,
        user=user,
        conversation=conversation,
        question=chat_request.message,
        chat_settings=chat_request.settings,  # <-- updated keyword
    )
    # rag_result should be something like:
    # {
    #   "answer": str,
    #   "sources": List[SourceCitationSchema],
    #   "sources_json": str,
    # }

    if rag_result is None:
        return None

    # 4) Persist assistant's message with sources (serialized if needed)
    assistant_message = Message(
        conversation_id=conversation.id,
        role="assistant",
        content=rag_result["answer"],
        # Store JSON string of sources for later display
        sources=rag_result.get("sources_json"),
    )
    db.add(assistant_message)
    db.commit()
    db.refresh(assistant_message)

    # 5) Build ChatResponse
    reply_schema = ChatMessageSchema(
        id=str(assistant_message.id),
        role=assistant_message.role,
        content=assistant_message.content,
        sources=rag_result.get("sources"),
    )

    response = ChatResponse(
        conversation_id=str(conversation.id),
        reply=reply_schema,
    )
    return response


def _get_or_create_conversation(
    db: Session,
    user: User,
    conversation_id: Optional[int | str],
) -> Conversation:
    """
    Get an existing Conversation if conversation_id is provided,
    otherwise create a new one for this user.
    """
    if conversation_id is not None:
        # Allow string or int
        try:
            conv_id_int = int(conversation_id)
        except (ValueError, TypeError):
            conv_id_int = None

        if conv_id_int is not None:
            existing = (
                db.query(Conversation)
                .filter(
                    Conversation.id == conv_id_int,
                    Conversation.user_id == user.id,
                )
                .first()
            )
            if existing:
                return existing

    # Create new conversation
    convo = Conversation(user_id=user.id, title=None)
    db.add(convo)
    db.commit()
    db.refresh(convo)
    return convo
