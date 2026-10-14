/**
 * Adaptive Network Reconnection & Jitter Backoff Utility
 * Author: Kunal Saukhiya <hgkunal@gmail.com>
 * Sprint 4 / Week 10: Prevents server thundering herds from rural classroom reconnects
 */

export const calculateExponentialBackoffWithJitter = (
  attempt,
  baseDelayMs = 1000,
  maxDelayMs = 30000
) => {
  const exponential = Math.min(maxDelayMs, baseDelayMs * Math.pow(2, attempt));
  const jitter = exponential * (0.75 + Math.random() * 0.5);
  return Math.round(jitter);
};

export const createResilientReconnector = (reconnectAction, options = {}) => {
  const { maxRetries = 5, onStatusChange = () => {} } = options;
  let currentAttempt = 0;
  let timerId = null;

  const tryConnect = async () => {
    try {
      onStatusChange({ status: "reconnecting", attempt: currentAttempt });
      await reconnectAction();
      currentAttempt = 0;
      onStatusChange({ status: "connected", attempt: currentAttempt });
    } catch (err) {
      currentAttempt++;
      if (currentAttempt <= maxRetries) {
        const delay = calculateExponentialBackoffWithJitter(currentAttempt);
        onStatusChange({ status: "waiting", nextRetryMs: delay, attempt: currentAttempt });
        timerId = setTimeout(tryConnect, delay);
      } else {
        onStatusChange({ status: "failed", error: err.message });
      }
    }
  };

  return {
    start: tryConnect,
    cancel: () => timerId && clearTimeout(timerId),
  };
};
