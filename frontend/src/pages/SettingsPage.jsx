// src/pages/SettingsPage.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  FormControlLabel,
  Switch,
  Slider,
  TextField,
  Chip,
  Stack,
  Button,
  Alert,
} from "@mui/material";

import useChat from "../hooks/useChat";
import { validateTopicString } from "../utils/validators";

const difficultyMarks = [
  { value: 1, label: "Beginner" },
  { value: 2, label: "Intermediate" },
  { value: 3, label: "Advanced" },
];

const SettingsPage = () => {
  const { settings, updateSettings } = useChat();
  const [localSettings, setLocalSettings] = useState(settings || {});
  const [topicInput, setTopicInput] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setLocalSettings(settings || {});
  }, [settings]);

  const handleToggle = (field) => (event) => {
    const value = event.target.checked;
    const next = { ...localSettings, [field]: value };
    setLocalSettings(next);
    updateSettings(next);
  };

  const handleDifficultyChange = (_, value) => {
    const next = { ...localSettings, difficulty: value };
    setLocalSettings(next);
    updateSettings(next);
  };

  const handleTopicAdd = () => {
    const trimmed = topicInput.trim();
    if (!trimmed) return;
    const errMsg = validateTopicString(trimmed);
    if (errMsg) {
      setError(errMsg);
      return;
    }
    setError("");
    const existing = localSettings.topics || [];
    if (existing.includes(trimmed)) {
      setTopicInput("");
      return;
    }
    const nextTopics = [...existing, trimmed];
    const next = { ...localSettings, topics: nextTopics };
    setLocalSettings(next);
    updateSettings(next);
    setTopicInput("");
  };

  const handleTopicDelete = (topic) => () => {
    const existing = localSettings.topics || [];
    const nextTopics = existing.filter((t) => t !== topic);
    const next = { ...localSettings, topics: nextTopics };
    setLocalSettings(next);
    updateSettings(next);
  };

  const handleReset = () => {
    const defaults = {
      difficulty: 1,
      topics: [],
      show_step_by_step: true,
      show_sources: true,
      prefer_local_docs: true,
    };
    setLocalSettings(defaults);
    updateSettings(defaults);
    setTopicInput("");
    setError("");
  };

  return (
    <Box sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h5" fontWeight="bold">
          Tutor Settings
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.75 }}>
          Customize how the Physics Tutor explains answers and which sources it
          prefers (local PDFs vs. web vs. DB).
        </Typography>
      </Box>

      {error && (
        <Alert
          severity="warning"
          sx={{ mb: 2 }}
          onClose={() => setError("")}
        >
          {error}
        </Alert>
      )}

      <Paper
        variant="outlined"
        sx={{
          borderRadius: 3,
          p: 2,
          mb: 2,
          backgroundColor: "rgba(15,23,42,0.96)",
          borderColor: "rgba(148,163,184,0.3)",
        }}
      >
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Difficulty Level
        </Typography>
        <Slider
          min={1}
          max={3}
          step={1}
          marks={difficultyMarks}
          value={localSettings.difficulty || 1}
          onChange={handleDifficultyChange}
        />
      </Paper>

      <Paper
        variant="outlined"
        sx={{
          borderRadius: 3,
          p: 2,
          mb: 2,
          backgroundColor: "rgba(15,23,42,0.96)",
          borderColor: "rgba(148,163,184,0.3)",
        }}
      >
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Source Preferences
        </Typography>

        <FormControlLabel
          control={
            <Switch
              checked={Boolean(localSettings.show_step_by_step)}
              onChange={handleToggle("show_step_by_step")}
            />
          }
          label="Show step-by-step solution"
        />

        <FormControlLabel
          control={
            <Switch
              checked={Boolean(localSettings.show_sources)}
              onChange={handleToggle("show_sources")}
            />
          }
          label="Show which sources were used"
        />

        <FormControlLabel
          control={
            <Switch
              checked={Boolean(localSettings.prefer_local_docs)}
              onChange={handleToggle("prefer_local_docs")}
            />
          }
          label="Prefer local PDFs over web search when possible"
        />
      </Paper>

      <Paper
        variant="outlined"
        sx={{
          borderRadius: 3,
          p: 2,
          mb: 2,
          backgroundColor: "rgba(15,23,42,0.96)",
          borderColor: "rgba(148,163,184,0.3)",
        }}
      >
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Focus Topics (optional)
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.75, mb: 1 }}>
          Add topics you’re currently revising (e.g., “Gauss&apos;s Law”,
          “SHM”, “Electromagnetism”). This helps you remember context, and you
          can reuse them in questions.
        </Typography>

        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
          <TextField
            size="small"
            fullWidth
            placeholder="Add topic (e.g., Gauss's Law)"
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
          />
          <Button variant="contained" onClick={handleTopicAdd}>
            Add
          </Button>
        </Stack>

        <Stack direction="row" spacing={1} flexWrap="wrap">
          {(localSettings.topics || []).map((topic) => (
            <Chip
              key={topic}
              label={topic}
              onDelete={handleTopicDelete(topic)}
              sx={{ mb: 0.5 }}
            />
          ))}
          {(!localSettings.topics || localSettings.topics.length === 0) && (
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
              No topics added yet.
            </Typography>
          )}
        </Stack>
      </Paper>

      <Box sx={{ textAlign: "right", mt: "auto" }}>
        <Button variant="outlined" size="small" onClick={handleReset}>
          Reset to defaults
        </Button>
      </Box>
    </Box>
  );
};

export default SettingsPage;
