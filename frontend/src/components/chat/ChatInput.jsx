// src/components/chat/ChatInput.jsx
import React, { useState } from "react";
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Tooltip,
  InputAdornment,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

const ChatInput = ({ onSend, isSending = false }) => {
  const [value, setValue] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || isSending) return;
    onSend(trimmed);
    setValue("");
  };

  return (
    <Paper
      elevation={3}
      sx={{
        borderRadius: 3,
        p: 1.5,
        background:
          "radial-gradient(circle at top left, rgba(37,99,235,0.4), rgba(15,23,42,0.95))",
        border: "1px solid rgba(148,163,184,0.45)",
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          alignItems: "flex-end",
          gap: 1,
        }}
      >
        <TextField
          multiline
          maxRows={4}
          fullWidth
          placeholder="Ask any physics question: 'Explain Newton’s first law with a real-life example'…"
          variant="outlined"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={isSending}
          InputProps={{
            sx: {
              borderRadius: 2.5,
              backgroundColor: "rgba(15,23,42,0.9)",
            },
            startAdornment: (
              <InputAdornment position="start">
                <AutoAwesomeIcon
                  sx={{ fontSize: 20, color: "rgba(148,163,184,0.9)" }}
                />
              </InputAdornment>
            ),
          }}
        />

        <Tooltip title={isSending ? "Generating answer..." : "Send"}>
          <span>
            <IconButton
              type="submit"
              color="primary"
              disabled={isSending || !value.trim()}
              sx={{
                bgcolor: "primary.main",
                color: "#0f172a",
                "&:hover": {
                  bgcolor: "primary.light",
                },
              }}
            >
              <SendIcon />
            </IconButton>
          </span>
        </Tooltip>
      </Box>
    </Paper>
  );
};

export default ChatInput;
