/**
 * inputSanitizer.js
 * Global input sanitization middleware — strips dangerous HTML/script tags
 * and trims whitespace from all incoming request body fields.
 *
 * Sprint Week 13 (Nov 6-12, 2026) — Rishabh Jain
 */

const DANGEROUS_PATTERN = /<\s*\/?\s*(script|iframe|object|embed|link|meta|style|base|form)[^>]*>/gi;
const SQL_PATTERN = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|EXEC|EXECUTE)\b)/gi;

/**
 * Recursively sanitize an object's string values.
 * @param {any} value
 * @returns {any}
 */
function sanitizeValue(value) {
  if (typeof value === 'string') {
    return value
      .replace(DANGEROUS_PATTERN, '')   // strip dangerous HTML tags
      .replace(/javascript\s*:/gi, '')   // strip JS protocol
      .replace(/on\w+\s*=/gi, '')        // strip inline event handlers
      .trim();
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, sanitizeValue(v)])
    );
  }
  return value;
}

/**
 * Express middleware: sanitizes req.body, req.query, and req.params.
 * Logs a warning if SQL injection patterns are detected.
 */
function inputSanitizer(req, res, next) {
  if (req.body && typeof req.body === 'object') {
    const raw = JSON.stringify(req.body);
    if (SQL_PATTERN.test(raw)) {
      console.warn(
        `[inputSanitizer] Potential SQL injection in body from ${req.ip} — ${req.method} ${req.originalUrl}`
      );
      SQL_PATTERN.lastIndex = 0; // reset regex state after test()
    }
    req.body = sanitizeValue(req.body);
  }

  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeValue(req.query);
  }

  if (req.params && typeof req.params === 'object') {
    req.params = sanitizeValue(req.params);
  }

  next();
}

module.exports = { inputSanitizer, sanitizeValue };
