// src/components/chat/ChatHistory.jsx
import React, { useEffect, useRef } from "react";
import { Box, Typography, IconButton, Tooltip, Stack } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ChatMessage from "./ChatMessage";

const ChatHistory = ({ messages, isLoading, onClearConversation }) => {
  const containerRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages?.length]);

  const hasMessages = messages && messages.length > 0;

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        border: "1px solid rgba(148,163,184,0.35)",
        backgroundColor: "rgba(15,23,42,0.98)",
      }}
    >
      {/* Header row with optional delete button */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          px: 1.5,
          py: 1,
          borderBottom: "1px solid rgba(148,163,184,0.3)",
        }}
      >
        <Box>
          <Typography variant="subtitle2" sx={{ opacity: 0.85 }}>
            Conversation
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.6 }}>
            Your questions and the tutor’s answers are stored per account
            (locally in this browser).
          </Typography>
        </Box>

        {hasMessages && onClearConversation && (
          <Tooltip title="Delete entire conversation">
            <IconButton
              size="small"
              onClick={onClearConversation}
              sx={{
                color: "rgba(248,113,113,0.9)",
                "&:hover": {
                  bgcolor: "rgba(248,113,113,0.15)",
                },
              }}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Stack>

      {/* Scrollable messages area */}
      <Box
        ref={containerRef}
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          px: 1.5,
          py: 1,
        }}
      >
        {!hasMessages && !isLoading && (
          <Typography
            variant="body2"
            sx={{ opacity: 0.7, textAlign: "center", mt: 4 }}
          >
            Ask your first question to start a conversation.
          </Typography>
        )}

        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
      </Box>
    </Box>
  );
};

export default ChatHistory;
