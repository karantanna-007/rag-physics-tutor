// src/utils/validators.js

/**
 * Validate email format (very basic)
 * @param {string} email
 * @returns {string | null} error message, or null if valid
 */
export const validateEmail = (email) => {
  if (!email || !email.trim()) return "Email is required.";
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email.trim())) return "Please enter a valid email address.";
  return null;
};

/**
 * Validate password strength (basic rules)
 * @param {string} password
 * @returns {string | null}
 */
export const validatePassword = (password) => {
  if (!password || !password.trim()) return "Password is required.";
  if (password.length < 6) {
    return "Password should be at least 6 characters long.";
  }
  return null;
};

/**
 * Validate required text field
 * @param {string} value
 * @param {string} fieldLabel
 * @returns {string | null}
 */
export const validateRequired = (value, fieldLabel = "This field") => {
  if (!value || !value.trim()) return `${fieldLabel} is required.`;
  return null;
};

/**
 * Validate registration payload
 * @param {{ name: string, email: string, password: string, confirmPassword?: string }} payload
 * @returns {string | null} first error found, or null if valid
 */
export const validateRegisterPayload = (payload) => {
  const { name, email, password, confirmPassword } = payload;

  const nameErr = validateRequired(name, "Full name");
  if (nameErr) return nameErr;

  const emailErr = validateEmail(email);
  if (emailErr) return emailErr;

  const pwErr = validatePassword(password);
  if (pwErr) return pwErr;

  if (typeof confirmPassword === "string" && password !== confirmPassword) {
    return "Passwords do not match.";
  }

  return null;
};

/**
 * Validate login payload
 * @param {{ email: string, password: string }} payload
 * @returns {string | null}
 */
export const validateLoginPayload = (payload) => {
  const emailErr = validateEmail(payload.email);
  if (emailErr) return emailErr;

  const pwErr = validatePassword(payload.password);
  if (pwErr) return pwErr;

  return null;
};

/**
 * -------------------------------
 *  NEW: Topic String Validator
 * -------------------------------
 *
 * Validate topic names added in SettingsPage
 * (e.g., "Gauss's Law", "SHM", "Electromagnetism")
 *
 * @param {string} topic
 * @returns {string | null}
 */
export const validateTopicString = (topic) => {
  const trimmed = topic.trim();

  if (!trimmed) return "Topic cannot be empty.";
  if (trimmed.length < 2) return "Topic should be at least 2 characters.";
  if (trimmed.length > 80) return "Topic should be at most 80 characters.";

  // Allow: letters, numbers, space, comma, period, apostrophe, dash, parentheses
  const invalidChars = /[^a-zA-Z0-9\s.,'’\-()]/;
  if (invalidChars.test(trimmed)) {
    return "Topic contains invalid characters.";
  }

  return null; // valid
};
