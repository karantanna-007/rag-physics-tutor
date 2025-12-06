// src/utils/storage.js

// --- Auth token + theme -------------------------------------------------

const TOKEN_KEY = "ragpt_auth_token_v1";
const THEME_KEY = "ragpt_theme_v1";

export const getToken = () => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token) => {
  if (typeof window === "undefined") return;
  if (token) {
    window.localStorage.setItem(TOKEN_KEY, token);
  } else {
    window.localStorage.removeItem(TOKEN_KEY);
  }
};

export const clearToken = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
};

export const getSavedTheme = () => {
  if (typeof window === "undefined") return "dark";
  return window.localStorage.getItem(THEME_KEY) || "dark";
};

export const saveTheme = (theme) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(THEME_KEY, theme);
};

// --- Per-user keys (chat + settings) ------------------------------------

const STORAGE_PREFIX = "ragpt_v1";

const normalizeUserKey = (userKey) => {
  if (!userKey) return "anon";
  return String(userKey);
};

const chatKey = (userKey) =>
  `${STORAGE_PREFIX}:chat:${normalizeUserKey(userKey)}`;

const settingsKey = (userKey) =>
  `${STORAGE_PREFIX}:settings:${normalizeUserKey(userKey)}`;

// --- Chat history helpers ----------------------------------------------

// shape: { messages: [], conversationId: string | null }
export const loadChatHistory = (userKey) => {
  if (typeof window === "undefined") {
    return { messages: [], conversationId: null };
  }

  try {
    const raw = window.localStorage.getItem(chatKey(userKey));
    if (!raw) return { messages: [], conversationId: null };

    const parsed = JSON.parse(raw);
    return {
      messages: Array.isArray(parsed.messages) ? parsed.messages : [],
      conversationId:
        parsed.conversationId === undefined ? null : parsed.conversationId,
    };
  } catch (err) {
    console.error("loadChatHistory failed:", err);
    return { messages: [], conversationId: null };
  }
};

export const saveChatHistory = (userKey, chatState) => {
  if (typeof window === "undefined") return;

  try {
    const safe = {
      messages: Array.isArray(chatState?.messages)
        ? chatState.messages
        : [],
      conversationId:
        chatState?.conversationId === undefined
          ? null
          : chatState.conversationId,
    };
    window.localStorage.setItem(chatKey(userKey), JSON.stringify(safe));
  } catch (err) {
    console.error("saveChatHistory failed:", err);
  }
};

export const clearChatHistoryForUser = (userKey) => {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.removeItem(chatKey(userKey));
  } catch (err) {
    console.error("clearChatHistoryForUser failed:", err);
  }
};

// --- Settings helpers (per user) ----------------------------------------
// shape:
// {
//   difficulty: 1|2|3,
//   topics: string[],
//   show_step_by_step: boolean,
//   show_sources: boolean,
//   prefer_local_docs: boolean,
// }

export const loadSettingsForUser = (userKey) => {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(settingsKey(userKey));
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error("loadSettingsForUser failed:", err);
    return null;
  }
};

export const saveSettingsForUser = (userKey, settings) => {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(
      settingsKey(userKey),
      JSON.stringify(settings || {})
    );
  } catch (err) {
    console.error("saveSettingsForUser failed:", err);
  }
};
