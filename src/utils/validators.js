import { MAX_INPUT_LENGTH, MIN_JD_LENGTH, MIN_RESUME_LENGTH } from "./constants";

export function validateApiKey(key) {
  if (!key || typeof key !== "string") return false;
  const trimmed = key.trim();
  // Allow any string longer than 20 chars since Google introduces new key formats
  return trimmed.length > 20;
}

export function validateInputs(jd, resume) {
  const errors = [];
  if (!jd || jd.trim().length < MIN_JD_LENGTH) {
    errors.push(`Job description must be at least ${MIN_JD_LENGTH} characters`);
  }
  if (!resume || resume.trim().length < MIN_RESUME_LENGTH) {
    errors.push(`Resume must be at least ${MIN_RESUME_LENGTH} characters`);
  }
  if (jd && jd.length > MAX_INPUT_LENGTH) {
    errors.push(`Job description is too long — please trim to under ${MAX_INPUT_LENGTH.toLocaleString()} characters`);
  }
  if (resume && resume.length > MAX_INPUT_LENGTH) {
    errors.push(`Resume is too long — please trim to under ${MAX_INPUT_LENGTH.toLocaleString()} characters`);
  }
  return errors;
}

export function getApiKeyError(key) {
  if (!key) return null;
  if (key.length < 20) return "API key seems too short";
  return null;
}

