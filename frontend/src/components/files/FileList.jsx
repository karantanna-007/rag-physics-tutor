// src/components/files/FileList.jsx
import React from "react";
import {
  Box,
  Typography,
  Grid,
  Stack,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";

import FileCard from "./FileCard";

/**
 * FileList
 *
 * Props:
 * - files: array of file metadata
 * - isLoading?: boolean
 * - error?: string | null | any
 * - onRefresh?: () => void
 * - onDeleteFile?: (fileId) => void
 */
const FileList = ({
  files = [],
  isLoading = false,
  error = null,
  onRefresh,
  onDeleteFile,
}) => {
  const normalizeError = (err) => {
    if (!err) return "";
    if (typeof err === "string") return err;
    if (err.message) return err.message;
    if (err.detail) return err.detail;
    if (Array.isArray(err)) {
      return err.map((e) => `${e.loc?.join(".") || "field"}: ${e.msg}`).join("; ");
    }
    return "Failed to load files. Please try again.";
  };

  const friendlyError = normalizeError(error);
  const hasFiles = files && files.length > 0;

  return (
    <Box
      sx={{
        mt: 2,
        p: 2,
        borderRadius: 3,
        border: "1px solid rgba(148,163,184,0.45)",
        background:
          "radial-gradient(circle at top left, rgba(15,23,42,0.98), rgba(15,23,42,0.96))",
      }}
    >
      {/* Header */}
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 1.5 }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <LibraryBooksIcon sx={{ fontSize: 20, color: "primary.light" }} />
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Your physics library
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.75 }}>
              Uploaded documents are used by the tutor via Pinecone (vector DB).
            </Typography>
          </Box>
        </Stack>

        <Tooltip title="Reload file list from server">
          <span>
            <IconButton
              size="small"
              onClick={onRefresh}
              disabled={isLoading || !onRefresh}
            >
              {isLoading ? (
                <CircularProgress size={18} />
              ) : (
                <RefreshIcon fontSize="small" />
              )}
            </IconButton>
          </span>
        </Tooltip>
      </Stack>

      {/* Errors */}
      {friendlyError && (
        <Alert severity="error" sx={{ mb: 1.5 }}>
          {friendlyError}
        </Alert>
      )}

      {/* Empty state */}
      {!isLoading && !hasFiles && !friendlyError && (
        <Box sx={{ textAlign: "center", py: 4, opacity: 0.8 }}>
          <Typography variant="body2">
            No documents uploaded yet.
          </Typography>
          <Typography variant="caption" sx={{ display: "block", mt: 0.5 }}>
            Upload PDFs or notes and they’ll become part of your RAG knowledge
            base.
          </Typography>
        </Box>
      )}

      {/* Files grid */}
      {hasFiles && (
        <Grid container spacing={2}>
          {files.map((file) => (
            <Grid item xs={12} sm={6} md={4} key={file.id}>
              <FileCard file={file} onDelete={onDeleteFile} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default FileList;
