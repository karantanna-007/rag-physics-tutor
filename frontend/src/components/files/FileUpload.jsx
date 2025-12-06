// src/components/files/FileUpload.jsx
import React, { useRef, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Stack,
  IconButton,
  Chip,
  Alert,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CloseIcon from "@mui/icons-material/Close";

/**
 * FileUpload
 *
 * Props:
 * - onUpload(files: File[]): Promise<void> | void   // called when user clicks Upload
 * - isUploading?: boolean
 * - error?: string | null | any
 * - maxFiles?: number
 * - maxSizeMB?: number
 * - accept?: string
 */
const FileUpload = ({
  onUpload,
  isUploading = false,
  error = null,
  maxFiles = 10,
  maxSizeMB = 15,
  accept = ".pdf,.doc,.docx,.txt",
}) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [localError, setLocalError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const normalizeError = (err) => {
    if (!err) return "";
    if (typeof err === "string") return err;
    if (err.message) return err.message;
    if (err.detail) return err.detail;
    if (Array.isArray(err)) {
      return err.map((e) => `${e.loc?.join(".") || "field"}: ${e.msg}`).join("; ");
    }
    return "File upload failed. Please try again.";
  };

  const handleFilesSelected = (fileList) => {
    setLocalError("");
    if (!fileList || fileList.length === 0) {
      setSelectedFiles([]);
      return;
    }

    const filesArray = Array.from(fileList);

    // Basic validation: count limit
    if (filesArray.length > maxFiles) {
      setLocalError(`You can upload at most ${maxFiles} files at once.`);
      setSelectedFiles([]);
      return;
    }

    // Size validation
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    const oversized = filesArray.find((f) => f.size > maxSizeBytes);
    if (oversized) {
      setLocalError(
        `Each file should be smaller than ${maxSizeMB} MB. "${oversized.name}" is too large.`
      );
      setSelectedFiles([]);
      return;
    }

    setSelectedFiles(filesArray);
  };

  const handleInputChange = (e) => {
    if (!e.target.files) return;
    handleFilesSelected(e.target.files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (!e.dataTransfer.files) return;
    handleFilesSelected(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const clearSelection = () => {
    setSelectedFiles([]);
    setLocalError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleUploadClick = async () => {
    if (!selectedFiles.length || isUploading) return;
    setLocalError("");

    try {
      await onUpload(selectedFiles);
      clearSelection();
    } catch (err) {
      // The parent hook will set its own error; we just avoid crashing here.
      console.error("Upload error from FileUpload:", err);
    }
  };

  const externalError = normalizeError(error);
  const showError = localError || externalError;

  return (
    <Box>
      {/* Drop zone */}
      <Box
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        sx={{
          border: `2px dashed ${
            isDragging ? "rgba(96,165,250,0.9)" : "rgba(148,163,184,0.8)"
          }`,
          borderRadius: 4,
          p: 3,
          textAlign: "center",
          background:
            "radial-gradient(circle at top left, rgba(37,99,235,0.18), rgba(15,23,42,0.95))",
          cursor: "pointer",
          transition: "all 0.2s ease",
          mb: 2,
          "&:hover": {
            borderColor: "rgba(96,165,250,1)",
          },
        }}
        onClick={() => inputRef.current && inputRef.current.click()}
      >
        <UploadFileIcon sx={{ fontSize: 44, color: "primary.main", mb: 1 }} />
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          Drag & drop physics documents here
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.75, mt: 0.5 }}>
          Supported: PDF, DOC, DOCX, TXT &nbsp;•&nbsp; Max {maxFiles} files,{" "}
          {maxSizeMB} MB each
        </Typography>

        <Button
          variant="outlined"
          size="small"
          sx={{ mt: 2 }}
          onClick={(e) => {
            e.stopPropagation();
            inputRef.current && inputRef.current.click();
          }}
          disabled={isUploading}
        >
          Browse files
        </Button>

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple
          hidden
          onChange={handleInputChange}
        />
      </Box>

      {/* Error section */}
      {showError && (
        <Alert severity="error" sx={{ mb: 1.5 }}>
          {localError || externalError}
        </Alert>
      )}

      {/* Selected files list */}
      {selectedFiles.length > 0 && (
        <Box
          sx={{
            mb: 2,
            p: 2,
            borderRadius: 3,
            backgroundColor: "rgba(15,23,42,0.95)",
            border: "1px solid rgba(148,163,184,0.4)",
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 1 }}
          >
            <Typography variant="subtitle2">
              {selectedFiles.length} file(s) selected
            </Typography>
            <IconButton size="small" onClick={clearSelection}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Stack>

          <Stack direction="row" spacing={1} flexWrap="wrap">
            {selectedFiles.map((file, idx) => (
              <Chip
                key={idx}
                label={`${file.name} (${Math.round(file.size / 1024)} KB)`}
                size="small"
                sx={{
                  maxWidth: "100%",
                }}
              />
            ))}
          </Stack>
        </Box>
      )}

      {/* Upload button */}
      <Box sx={{ textAlign: "right" }}>
        <Button
          variant="contained"
          onClick={handleUploadClick}
          disabled={isUploading || selectedFiles.length === 0}
        >
          {isUploading ? "Uploading & indexing..." : "Upload & Index"}
        </Button>
      </Box>
    </Box>
  );
};

export default FileUpload;
