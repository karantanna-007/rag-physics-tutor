// src/api/chatApi.js
import axiosClient from "./axiosClient";
import { getToken } from "../utils/storage";

/**
 * Helper to build an auth header from the stored token.
 */
function getAuthConfig(explicitToken) {
  const token = explicitToken || getToken();
  if (!token) return {};
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

/**
 * sendChatMessage
 *
 * Backend body (from Swagger):
 * {
 *   "message": "string",
 *   "conversation_id": 0,
 *   "settings": {
 *     "difficulty": 0,
 *     "topics": ["string"]
 *   },
 *   "show_step_by_step": true,
 *   "show_sources": true,
 *   "prefer_local_docs": true
 * }
 */
export const sendChatMessage = async ({
  message,
  conversationId = null,
  token = null,
  settings = {},
  showStepByStep = true,
  showSources = true,
  preferLocalDocs = true,
}) => {
  const payload = {
    message,
    conversation_id: conversationId,
    settings: {
      difficulty:
        typeof settings.difficulty === "number" ? settings.difficulty : 1,
      topics: Array.isArray(settings.topics) ? settings.topics : [],
    },
    show_step_by_step: showStepByStep,
    show_sources: showSources,
    prefer_local_docs: preferLocalDocs,
  };

  const config = getAuthConfig(token);
  const response = await axiosClient.post("/chat/", payload, config);
  return response.data; // { conversation_id, reply }
};

/**
 * fetchChatHistory
 *
 * Backend: GET /api/v1/chat/history/
 * Response:
 * {
 *   "conversation_id": "string",
 *   "messages": [
 *     { "id": "...", "role": "user|assistant", "content": "...", "created_at": "...", "sources": [...] }
 *   ]
 * }
 */
export const fetchChatHistory = async (token = null) => {
  const config = getAuthConfig(token);
  const response = await axiosClient.get("/chat/history/", config);
  return response.data;
};

/**
 * clearChatHistory
 *
 * Optional: if backend exposes DELETE /chat/history/
 * We call it, but if it 404s we silently ignore the error in the hook.
 */
export const clearChatHistory = async (token = null) => {
  const config = getAuthConfig(token);
  const response = await axiosClient.delete("/chat/history/", config);
  return response.data;
};
