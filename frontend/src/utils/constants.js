// src/utils/constants.js

// Backend base URL – keep in sync with axiosClient.
export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8000/api/v1";

// LocalStorage keys (shared usage; token & theme resolved in storage.js)
export const LS_KEYS = {
  token: "rag_physics_tutor_token",
  theme: "rag_physics_tutor_theme",
  // Chat history keys are generated dynamically:
  chatPrefix: "rag_physics_tutor_chat",
};

// Roles – future admin panel can use this
export const USER_ROLES = {
  USER: "user",
  ADMIN: "admin",
};

// Difficulty levels for physics explanations
export const DIFFICULTY_LEVELS = [
  { value: "beginner", label: "Beginner Friendly" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced / IIT-JEE" },
];

// Chat sources – these correspond to what backend sends in meta.tools_used
export const SOURCE_TYPES = {
  VECTORSTORE: "vectorstore", // Pinecone / embeddings
  WEB_SEARCH: "web_search", // Tavily / web
  SQL_DB: "sql_db", // NeonDB / RDBMS queries
};

// Simple route constants (optional but nice to keep consistent)
export const ROUTES = {
  HOME: "/",
  CHAT: "/chat",
  FILES: "/files",
  SETTINGS: "/settings",
  LOGIN: "/login",
  REGISTER: "/register",
};
