// src/components/chat/ChatMessage.jsx
import React from "react";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Stack,
  Chip,
  Tooltip,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import SmartToyIcon from "@mui/icons-material/SmartToy";

import SourceCitations from "./SourceCitations";

const ChatMessage = ({ message }) => {
  const isUser = message.role === "user";

  // Backend may send created_at; frontend may use createdAt
  const createdAtRaw = message.created_at || message.createdAt || null;
  const createdAtLabel = createdAtRaw
    ? new Date(createdAtRaw).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  // SAFETY: never let a non-string crash React
  let contentText;
  if (typeof message.content === "string") {
    contentText = message.content;
  } else if (
    message.content &&
    typeof message.content === "object" &&
    Array.isArray(message.content.detail)
  ) {
    // This is very likely a FastAPI validation error (422)
    // Format it nicely instead of crashing.
    contentText = message.content.detail
      .map((d) => d.msg || "Validation error")
      .join("; ");
  } else if (message.content && typeof message.content === "object") {
    contentText = JSON.stringify(message.content, null, 2);
  } else {
    contentText = String(message.content ?? "");
  }

  const hasSources = !isUser && Array.isArray(message.sources) && message.sources.length > 0;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        mb: 1.5,
      }}
    >
      <Stack
        direction={isUser ? "row-reverse" : "row"}
        spacing={1.5}
        sx={{ maxWidth: "100%" }}
      >
        {/* Avatar */}
        <Avatar
          sx={{
            bgcolor: isUser ? "primary.main" : "rgba(15,23,42,0.9)",
            color: isUser ? "#0f172a" : "#e5e7eb",
            width: 32,
            height: 32,
            border: isUser ? "none" : "1px solid rgba(148,163,184,0.7)",
            mt: 0.5,
          }}
        >
          {isUser ? <PersonIcon fontSize="small" /> : <SmartToyIcon />}
        </Avatar>

        {/* Bubble */}
        <Paper
          elevation={2}
          sx={{
            p: 1.5,
            borderRadius: 3,
            maxWidth: "min(700px, 100%)",
            backgroundColor: isUser
              ? "rgba(37,99,235,0.15)"
              : "rgba(15,23,42,0.95)",
            border: "1px solid rgba(148,163,184,0.45)",
          }}
        >
          <Stack spacing={0.5}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={1}
            >
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 600,
                  textTransform: "uppercase",
                  opacity: 0.8,
                }}
              >
                {isUser ? "You" : "Physics Tutor"}
              </Typography>

              {createdAtLabel && (
                <Typography
                  variant="caption"
                  sx={{ opacity: 0.6, fontSize: "0.7rem" }}
                >
                  {createdAtLabel}
                </Typography>
              )}
            </Stack>

            <Typography
              variant="body2"
              sx={{
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {contentText}
            </Typography>

            {/* For assistant messages, show sources if any */}
            {hasSources && (
              <Box sx={{ mt: 1 }}>
                <SourceCitations
                  sources={message.sources}
                  // originalQuestion is optional; fall back to empty string
                  question={message.originalQuestion || ""}
                />
              </Box>
            )}

            {/* Optional small chip to show message meta, if provided */}
            {!isUser && message.meta?.fromCache && (
              <Tooltip title="Loaded from saved conversation history">
                <Chip
                  size="small"
                  label="From history"
                  sx={{
                    mt: 0.5,
                    fontSize: "0.65rem",
                    height: 20,
                    bgcolor: "rgba(22,101,52,0.25)",
                    borderRadius: 999,
                  }}
                />
              </Tooltip>
            )}
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );
};

export default ChatMessage;
