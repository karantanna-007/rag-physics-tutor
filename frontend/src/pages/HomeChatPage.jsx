// src/pages/HomeChatPage.jsx
import React from "react";
import {
  Box,
  Paper,
  Typography,
  Divider,
  Alert,
  Stack,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import useChat from "../hooks/useChat";
import ChatInput from "../components/chat/ChatInput";
import ChatHistory from "../components/chat/ChatHistory";
import SourceCitations from "../components/chat/SourceCitations";
import Loader from "../components/common/Loader";

const HomeChatPage = () => {
  const {
    messages,
    isLoading,
    error,
    sendMessage,
    clearHistory,
    settings,
    updateSettings,
    lastSourcesSummary,
  } = useChat();

  const handleSend = async (text) => {
    if (!text.trim()) return;
    await sendMessage(text.trim());
  };

  const handleClearConversation = () => {
    const ok = window.confirm(
      "This will delete the entire chat history for this browser. Are you sure?"
    );
    if (!ok) return;
    clearHistory(); // <- now a real function from useChat
  };

  return (
    <Box sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h5" fontWeight="bold">
          RAG Physics Tutor
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.75 }}>
          Ask conceptual or numerical questions. The tutor will combine
          <strong> local PDFs</strong>, <strong> physics formula DB</strong>, and
          <strong> web search</strong> (when needed).
        </Typography>
      </Box>

      {/* Info about retrieval sources from last answer */}
      {lastSourcesSummary && (
        <Paper
          variant="outlined"
          sx={{
            mb: 2,
            p: 1.5,
            borderRadius: 3,
            borderColor: "rgba(96,165,250,0.6)",
            background:
              "linear-gradient(90deg, rgba(15,23,42,0.95), rgba(30,64,175,0.6))",
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
            Latest answer used:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {lastSourcesSummary.usedLocal && (
              <Chip
                size="small"
                label="Local PDFs (Pinecone)"
                sx={{ fontSize: 11 }}
              />
            )}
            {lastSourcesSummary.usedWeb && (
              <Chip size="small" label="Web Search" sx={{ fontSize: 11 }} />
            )}
            {lastSourcesSummary.usedSql && (
              <Chip
                size="small"
                label="Physics DB (RDBMS)"
                sx={{ fontSize: 11 }}
              />
            )}
            {!lastSourcesSummary.usedLocal &&
              !lastSourcesSummary.usedWeb &&
              !lastSourcesSummary.usedSql && (
                <Chip
                  size="small"
                  label="No external context (LLM only)"
                  sx={{ fontSize: 11 }}
                />
              )}
          </Stack>
        </Paper>
      )}

      {/* Error + loader */}
      {error && (
        <Alert severity="error" sx={{ mb: 1.5 }}>
          {error}
        </Alert>
      )}
      {isLoading && <Loader text="Thinking with physics context..." />}

      {/* Chat area */}
      <Paper
        variant="outlined"
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
          borderRadius: 3,
          backgroundColor: "rgba(15,23,42,0.98)",
          borderColor: "rgba(148,163,184,0.35)",
          mb: 1.5,
        }}
      >
        <Box
          sx={{
            p: 1.5,
            borderBottom: "1px solid rgba(148,163,184,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
            Conversation
          </Typography>

          <Tooltip title="Delete entire chat history for this browser">
            <IconButton
              size="small"
              onClick={handleClearConversation}
              sx={{ color: "rgba(248,113,113,0.9)" }}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        <Box sx={{ flex: 1, minHeight: 0, p: 1.5, pb: 0 }}>
          <ChatHistory messages={messages} />
        </Box>

        {/* Sources area for the latest assistant message */}
        <Box
          sx={{
            borderTop: "1px solid rgba(148,163,184,0.25)",
            p: 1.25,
            maxHeight: 130,
            overflowY: "auto",
          }}
        >
          <SourceCitations messages={messages} />
        </Box>
      </Paper>

      <Divider sx={{ mb: 1.5 }} />

      {/* Chat input */}
      <ChatInput
        onSend={handleSend}
        isSending={isLoading}
        onClear={clearHistory}
      />
    </Box>
  );
};

export default HomeChatPage;
