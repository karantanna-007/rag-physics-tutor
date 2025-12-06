// src/hooks/useChat.js
import { useState, useEffect, useCallback } from "react";
import * as chatApi from "../api/chatApi";
import { useAuthContext } from "../context/AuthContext";
import {
  loadChatHistory,
  saveChatHistory,
  clearChatHistoryForUser,
  loadSettingsForUser,
  saveSettingsForUser,
} from "../utils/storage";

// Default settings if nothing stored yet for this user
const DEFAULT_SETTINGS = {
  difficulty: 1,
  topics: [],
  show_step_by_step: true,
  show_sources: true,
  prefer_local_docs: true,
};

const getUserStorageKey = (user) => {
  if (!user) return "anon";
  if (user.id !== undefined && user.id !== null) return String(user.id);
  if (user.email) return String(user.email).toLowerCase();
  return "anon";
};

const useChat = () => {
  const { token, user } = useAuthContext();

  // ---------- which user are we storing for? ----------------------------
  const [userKey, setUserKey] = useState(() => getUserStorageKey(user));

  // ---------- initial chat + settings from localStorage -----------------
  const [chatState, setChatState] = useState(() =>
    loadChatHistory(getUserStorageKey(user))
  );
  const [settings, setSettings] = useState(() => {
    const stored = loadSettingsForUser(getUserStorageKey(user));
    return stored ? { ...DEFAULT_SETTINGS, ...stored } : DEFAULT_SETTINGS;
  });

  const { messages, conversationId } = chatState;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastSourcesSummary, setLastSourcesSummary] = useState(null);

  // ---------- when the logged-in user changes, switch buckets -----------

  useEffect(() => {
    const newKey = getUserStorageKey(user);

    setUserKey((prevKey) => {
      if (prevKey === newKey) return prevKey;

      // Load this user's chat + settings from storage
      const loadedChat = loadChatHistory(newKey);
      const loadedSettings = loadSettingsForUser(newKey);

      setChatState(
        loadedChat || {
          messages: [],
          conversationId: null,
        }
      );

      setSettings(
        loadedSettings
          ? { ...DEFAULT_SETTINGS, ...loadedSettings }
          : DEFAULT_SETTINGS
      );

      setLastSourcesSummary(null);
      return newKey;
    });
  }, [user]);

  // ---------- persist chat & settings whenever they change --------------

  useEffect(() => {
    saveChatHistory(userKey, chatState);
  }, [chatState, userKey]);

  useEffect(() => {
    saveSettingsForUser(userKey, settings);
  }, [settings, userKey]);

  // ---------- helper to summarize sources (for chips) -------------------

  const buildSourcesSummary = (sources) => {
    const summary = {
      usedLocal: false,
      usedWeb: false,
      usedSql: false,
    };

    if (!Array.isArray(sources)) return summary;

    sources.forEach((src) => {
      const t = (src?.source_type || "").toLowerCase();
      if (
        t.includes("local") ||
        t.includes("pdf") ||
        t.includes("vector") ||
        t.includes("pinecone")
      ) {
        summary.usedLocal = true;
      } else if (t.includes("web")) {
        summary.usedWeb = true;
      } else if (t.includes("sql") || t.includes("db") || t.includes("rdbms")) {
        summary.usedSql = true;
      }
    });

    return summary;
  };

  // ---------- send a new message ----------------------------------------

  const sendMessage = useCallback(
    async (text) => {
      const trimmed = text?.trim();
      if (!trimmed) {
        setError("Question cannot be empty.");
        return;
      }

      if (!token) {
        setError("You need to be logged in to chat with the tutor.");
        return;
      }

      setIsLoading(true);
      setError(null);

      const userMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: trimmed,
        createdAt: new Date().toISOString(),
      };

      // optimistic append
      setChatState((prev) => ({
        ...prev,
        messages: [...prev.messages, userMessage],
      }));

      try {
        // prepare settings in the shape backend expects
        const settingsPayload = {
          difficulty: settings.difficulty ?? 1,
          topics: settings.topics || [],
          show_step_by_step: !!settings.show_step_by_step,
          show_sources: !!settings.show_sources,
          prefer_local_docs: !!settings.prefer_local_docs,
        };

        const response = await chatApi.sendChatMessage({
          message: trimmed,
          conversationId,
          token,
          settings: settingsPayload,
        });

        const reply = response?.reply;

        const assistantMessage = {
          id: reply?.id || `assistant-${Date.now()}`,
          role: reply?.role || "assistant",
          content: reply?.content || "",
          createdAt: new Date().toISOString(),
          sources: reply?.sources || [],
        };

        setChatState((prev) => ({
          messages: [...prev.messages, assistantMessage],
          conversationId:
            response?.conversation_id ?? prev.conversationId ?? null,
        }));

        setLastSourcesSummary(buildSourcesSummary(reply?.sources));
      } catch (err) {
        console.error("sendChatMessage failed:", err);
        setError(
          err?.response?.data?.detail ||
            err?.response?.data?.message ||
            err?.message ||
            "Failed to send message. Please try again."
        );

        // rollback optimistic user message
        setChatState((prev) => ({
          ...prev,
          messages: prev.messages.filter((m) => m.id !== userMessage.id),
        }));
      } finally {
        setIsLoading(false);
      }
    },
    [token, conversationId, settings]
  );

  // ---------- clear conversation (delete-chat button) -------------------

  const clearChat = useCallback(() => {
    setChatState({ messages: [], conversationId: null });
    setLastSourcesSummary(null);
    clearChatHistoryForUser(userKey); // only current user's history
  }, [userKey]);

  // alias used by HomeChatPage / ChatInput
  const clearHistory = clearChat;

  // ---------- settings updater (used by SettingsPage) -------------------

  const updateSettings = useCallback((nextSettings) => {
    setSettings((prev) => ({
      ...prev,
      ...(typeof nextSettings === "function"
        ? nextSettings(prev)
        : nextSettings),
    }));
  }, []);

  return {
    // chat
    messages,
    conversationId,
    isLoading,
    error,
    sendMessage,
    clearChat,
    clearHistory,

    // settings
    settings,
    updateSettings,

    // UI helper
    lastSourcesSummary,
  };
};

export default useChat;
