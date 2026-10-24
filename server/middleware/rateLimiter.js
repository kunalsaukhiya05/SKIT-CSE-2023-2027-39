/**
 * Simple in-memory token-bucket rate limiter middleware.
 * For production, replace the store with a Redis-backed solution.
 *
 * Usage:
 *   const { rateLimiter } = require('../middleware/rateLimiter');
 *   router.use(rateLimiter({ windowMs: 60000, max: 30 }));
 */

const requestCounts = new Map();

/**
 * @param {Object} options
 * @param {number} options.windowMs  - Time window in ms (default: 60 000 = 1 min)
 * @param {number} options.max       - Max requests per window (default: 60)
 * @param {string} options.message   - Error message (default: 'Too many requests')
 */
function rateLimiter({ windowMs = 60_000, max = 60, message = 'Too many requests, please try again later.' } = {}) {
  return (req, res, next) => {
    const key = req.user ? String(req.user._id) : req.ip;
    const now = Date.now();
    const record = requestCounts.get(key);

    if (!record || now - record.start > windowMs) {
      requestCounts.set(key, { count: 1, start: now });
      return next();
    }

    record.count += 1;

    if (record.count > max) {
      const retryAfter = Math.ceil((record.start + windowMs - now) / 1000);
      res.set('Retry-After', retryAfter);
      return res.status(429).json({ success: false, message });
    }

    next();
  };
}

// Cleanup stale entries every 5 minutes to prevent memory leaks
setInterval(() => {
  const cutoff = Date.now() - 5 * 60_000;
  for (const [key, val] of requestCounts) {
    if (val.start < cutoff) requestCounts.delete(key);
  }
}, 5 * 60_000);

module.exports = { rateLimiter };
