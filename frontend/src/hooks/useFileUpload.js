// src/hooks/useFileUpload.js
import { useCallback, useEffect, useState } from "react";
import * as filesApi from "../api/filesApi";
import { useAuth } from "./useAuth";

export const useFileUpload = () => {
  const { isAuthenticated } = useAuth();

  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const makeFriendlyError = (err, fallback) => {
    if (!err) return fallback;

    // Axios timeout
    if (err.code === "ECONNABORTED") {
      return (
        "The server is taking longer than expected to process your documents. " +
        "They may still be uploading/indexing in the background. Wait a bit and " +
        "click the refresh icon in 'Your physics library'."
      );
    }

    return (
      err.normalizedMessage ||
      err?.response?.data?.message ||
      err?.message ||
      fallback
    );
  };

  const loadFiles = useCallback(async () => {
    setError(null);

    if (!isAuthenticated) {
      setFiles([]);
      return;
    }

    setIsLoading(true);
    try {
      const result = await filesApi.listFiles();
      setFiles(result || []);
    } catch (err) {
      console.error("Failed to load files:", err);
      setError(makeFriendlyError(err, "Failed to load files. Please try again."));
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      loadFiles();
    } else {
      setFiles([]);
    }
  }, [isAuthenticated, loadFiles]);

  const uploadFiles = useCallback(
    async (fileList) => {
      setError(null);

      if (!isAuthenticated) {
        const friendly =
          "You need to log in or register before uploading documents.";
        setError(friendly);
        throw new Error("AUTH_REQUIRED");
      }

      if (!fileList || fileList.length === 0) {
        setError("Please select at least one file to upload.");
        return;
      }

      setIsUploading(true);

      try {
        await filesApi.uploadFiles(fileList);
        // After successful upload, refresh the list
        await loadFiles();
      } catch (err) {
        console.error("File upload error:", err);
        setError(
          makeFriendlyError(
            err,
            "File upload failed. Please try again."
          )
        );
        throw err;
      } finally {
        setIsUploading(false);
      }
    },
    [isAuthenticated, loadFiles]
  );

  const deleteFile = useCallback(
    async (fileId) => {
      setError(null);

      if (!isAuthenticated) {
        const friendly =
          "You need to be logged in to delete uploaded documents.";
        setError(friendly);
        throw new Error("AUTH_REQUIRED");
      }

      if (!fileId) return;

      try {
        await filesApi.deleteFile(fileId);
        setFiles((prev) => prev.filter((f) => f.id !== fileId));
      } catch (err) {
        console.error("Delete file error:", err);
        setError(
          makeFriendlyError(
            err,
            "Failed to delete file. Please try again."
          )
        );
        throw err;
      }
    },
    [isAuthenticated]
  );

  return {
    files,
    isLoading,
    isUploading,
    error,
    setError,
    loadFiles,
    uploadFiles,
    deleteFile,
  };
};

export default useFileUpload;
