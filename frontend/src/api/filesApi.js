// src/api/filesApi.js
import axiosClient from "./axiosClient";

/**
 * uploadFiles
 *
 * @param {File[]} files
 * @returns {Promise<any>}
 */
export const uploadFiles = async (files) => {
  const formData = new FormData();

  // FastAPI backend expects the field name "uploaded_files"
  files.forEach((file) => {
    formData.append("uploaded_files", file);
  });

  const response = await axiosClient.post("/files/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    // give ingestion enough time (3 minutes)
    timeout: 180000,
  });

  return response.data;
};

/**
 * listFiles
 *
 * @returns {Promise<Array<any>>}
 */
export const listFiles = async () => {
  const response = await axiosClient.get("/files/", {
    // listing can also be a bit slow right after ingestion
    timeout: 60000,
  });
  return response.data;
};

/**
 * deleteFile
 *
 * @param {string | number} fileId
 * @returns {Promise<any>}
 */
export const deleteFile = async (fileId) => {
  const response = await axiosClient.delete(`/files/${fileId}`, {
    timeout: 60000,
  });
  return response.data;
};

export default {
  uploadFiles,
  listFiles,
  deleteFile,
};
