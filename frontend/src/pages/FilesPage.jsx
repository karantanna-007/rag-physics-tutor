// src/pages/FilesPage.jsx
import React from "react";
import { Box, Typography, Paper, Divider } from "@mui/material";

import useFileUpload from "../hooks/useFileUpload";
import FileUpload from "../components/files/FileUpload";
import FileList from "../components/files/FileList";
import Loader from "../components/common/Loader";

const FilesPage = () => {
  const {
    files,
    isLoading,
    isUploading,
    error,
    loadFiles,
    uploadFiles,
    deleteFile,
    // setError, // we no longer show a raw error Alert here
  } = useFileUpload();

  const handleUpload = async (fileList) => {
    try {
      await uploadFiles(fileList);
      // loadFiles is already called by the hook after successful upload,
      // so no extra refresh needed here.
    } catch (err) {
      // Error is already handled + normalized inside the hook & FileUpload.
      console.error("Upload error at FilesPage:", err);
    }
  };

  const handleDelete = async (fileId) => {
    try {
      await deleteFile(fileId);
      // We optimistically update in the hook; loadFiles can be triggered
      // manually with the refresh button in FileList if needed.
    } catch (err) {
      console.error("Delete file error at FilesPage:", err);
    }
  };

  return (
    <Box
      sx={{
        p: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {/* Page header */}
      <Box>
        <Typography variant="h5" fontWeight="bold">
          Your Physics Documents
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.75, mt: 0.5 }}>
          Upload class notes, NCERT PDFs, question banks, or reference books.
          They will be indexed into the vector database (Pinecone) and used by
          the RAG Physics Tutor during chat.
        </Typography>
      </Box>

      {/* Global loading overlay (for initial list load) */}
      {isLoading && files.length === 0 && (
        <Box sx={{ mt: 2 }}>
          <Loader text="Loading your files..." />
        </Box>
      )}

      {/* Upload panel */}
      <Paper
        variant="outlined"
        sx={{
          borderRadius: 3,
          p: 2,
          backgroundColor: "rgba(15,23,42,0.95)",
          borderColor: "rgba(148,163,184,0.3)",
        }}
      >
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
          Upload & Index
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.75, display: "block", mb: 1 }}>
          Upload one or more documents. They’ll be chunked, embedded and stored
          with their metadata in NeonDB + Pinecone for retrieval.
        </Typography>

        <FileUpload
          onUpload={handleUpload}
          isUploading={isUploading}
          error={error}
        />
      </Paper>

      {/* Files list panel */}
      <Paper
        variant="outlined"
        sx={{
          flex: 1,
          minHeight: 0,
          borderRadius: 3,
          p: 2,
          backgroundColor: "rgba(15,23,42,0.98)",
          borderColor: "rgba(148,163,184,0.35)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Indexed Files
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.7, mb: 1 }}>
          These files are already ingested into Pinecone. New uploads may take a
          bit of time for text extraction and indexing, especially for scanned PDFs.
        </Typography>
        <Divider sx={{ mb: 1 }} />

        <Box sx={{ flex: 1, minHeight: 0 }}>
          <FileList
            files={files}
            isLoading={isLoading}
            error={error}
            onRefresh={loadFiles}
            onDeleteFile={handleDelete}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default FilesPage;
