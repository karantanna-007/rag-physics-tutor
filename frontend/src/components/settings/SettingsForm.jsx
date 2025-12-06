// src/components/settings/SettingsForm.jsx
import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Slider,
  Switch,
  FormControlLabel,
  TextField,
  Chip,
  Stack,
  IconButton,
  Tooltip,
  Divider,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const difficultyMarks = [
  { value: 1, label: "Beginner" },
  { value: 2, label: "Intermediate" },
  { value: 3, label: "Advanced" },
];

/**
 * SettingsForm
 *
 * Props:
 * - settings: {
 *     difficulty: 1 | 2 | 3,
 *     topics: string[],
 *     showStepByStep: boolean,
 *     showSources: boolean,
 *     preferLocalDocs: boolean,
 *   }
 * - onChange: (updatedSettings) => void
 */
const SettingsForm = ({ settings, onChange }) => {
  const [topicInput, setTopicInput] = useState("");

  const handleDifficultyChange = (_, value) => {
    onChange({
      ...settings,
      difficulty: value,
    });
  };

  const handleToggle = (field) => (_, checked) => {
    onChange({
      ...settings,
      [field]: checked,
    });
  };

  const handleTopicAdd = () => {
    const trimmed = topicInput.trim();
    if (!trimmed) return;
    if (settings.topics.includes(trimmed)) {
      setTopicInput("");
      return;
    }
    onChange({
      ...settings,
      topics: [...settings.topics, trimmed],
    });
    setTopicInput("");
  };

  const handleTopicDelete = (topic) => () => {
    onChange({
      ...settings,
      topics: settings.topics.filter((t) => t !== topic),
    });
  };

  const handleTopicInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleTopicAdd();
    }
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 3,
        p: 3,
        backgroundColor: "rgba(15,23,42,0.95)",
        borderColor: "rgba(148,163,184,0.35)",
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      {/* Difficulty */}
      <Box>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            Explanation Level
          </Typography>
          <Tooltip title="Controls how detailed and advanced the explanations are.">
            <InfoOutlinedIcon sx={{ fontSize: 18, opacity: 0.8 }} />
          </Tooltip>
        </Stack>

        <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
          Select how deep you want the tutor to go in explanations.
        </Typography>

        <Slider
          value={settings.difficulty || 1}
          min={1}
          max={3}
          step={1}
          marks={difficultyMarks}
          onChange={handleDifficultyChange}
          sx={{ maxWidth: 400 }}
        />
      </Box>

      <Divider sx={{ borderColor: "rgba(148,163,184,0.3)" }} />

      {/* Topics */}
      <Box>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            Focus Topics (Optional)
          </Typography>
          <Tooltip title="Add topics you are currently studying to slightly bias retrieval and prompts.">
            <InfoOutlinedIcon sx={{ fontSize: 18, opacity: 0.8 }} />
          </Tooltip>
        </Stack>

        <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
          Examples: &quot;Electrostatics&quot;, &quot;SHM&quot;,
          &quot;Rotational Motion&quot;. This helps the tutor know your current
          syllabus focus.
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
          <TextField
            size="small"
            label="Add topic"
            variant="outlined"
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
            onKeyDown={handleTopicInputKeyDown}
            sx={{ maxWidth: 300 }}
          />
          <IconButton
            color="primary"
            onClick={handleTopicAdd}
            disabled={!topicInput.trim()}
          >
            <AddCircleOutlineIcon />
          </IconButton>
        </Stack>

        {settings.topics?.length > 0 && (
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {settings.topics.map((topic) => (
              <Chip
                key={topic}
                label={topic}
                onDelete={handleTopicDelete(topic)}
                variant="outlined"
                sx={{ mb: 0.5 }}
              />
            ))}
          </Stack>
        )}
      </Box>

      <Divider sx={{ borderColor: "rgba(148,163,184,0.3)" }} />

      {/* Retrieval preferences */}
      <Box>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            Retrieval Preferences
          </Typography>
          <Tooltip
            title={
              "Decide whether to prioritize your uploaded notes (Pinecone), " +
              "and whether to use web search and DB formulas when needed."
            }
          >
            <InfoOutlinedIcon sx={{ fontSize: 18, opacity: 0.8 }} />
          </Tooltip>
        </Stack>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.preferLocalDocs}
                onChange={handleToggle("preferLocalDocs")}
              />
            }
            label={
              <Box>
                <Typography variant="body2" fontWeight={500}>
                  Prefer local documents first
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  When ON, the tutor will try to answer using your uploaded PDFs
                  and notes via Pinecone before relying on web search.
                </Typography>
              </Box>
            }
          />

          <FormControlLabel
            control={
              <Switch
                checked={settings.showStepByStep}
                onChange={handleToggle("showStepByStep")}
              />
            }
            label={
              <Box>
                <Typography variant="body2" fontWeight={500}>
                  Show step-by-step reasoning
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  When ON, answers will be more detailed with intermediate
                  steps, derivations and explanations.
                </Typography>
              </Box>
            }
          />

          <FormControlLabel
            control={
              <Switch
                checked={settings.showSources}
                onChange={handleToggle("showSources")}
              />
            }
            label={
              <Box>
                <Typography variant="body2" fontWeight={500}>
                  Show sources (Docs / Web / DB)
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  When ON, the tutor will show which PDFs (local), web results,
                  or DB formulas were used. Irrelevant sources are filtered on
                  the backend.
                </Typography>
              </Box>
            }
          />
        </Box>
      </Box>
    </Paper>
  );
};

export default SettingsForm;
