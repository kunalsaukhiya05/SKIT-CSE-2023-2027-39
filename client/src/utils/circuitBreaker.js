/**
 * Rural Network Circuit Breaker & Battery Protection Utility
 * Author: Kunal Saukhiya <hgkunal@gmail.com>
 * Sprint 6 / Week 12: Prevents rapid retry storms and data drain during cellular drops
 */

const STATE = {
  CLOSED: "CLOSED",       // Normal operation, requests flow through
  OPEN: "OPEN",           // Tripped, calls fail fast to save client resources
  HALF_OPEN: "HALF_OPEN", // Trial state after cooldown
};

class RuralCircuitBreaker {
  constructor(options = {}) {
    this.failureThreshold = options.failureThreshold || 3;
    this.cooldownPeriodMs = options.cooldownPeriodMs || 15000;
    this.state = STATE.CLOSED;
    this.failureCount = 0;
    this.lastFailureTime = null;
  }

  async execute(asyncFn, fallbackFn = null) {
    const now = Date.now();

    // Check if cooldown has elapsed to enter HALF_OPEN
    if (this.state === STATE.OPEN) {
      if (now - this.lastFailureTime > this.cooldownPeriodMs) {
        this.state = STATE.HALF_OPEN;
      } else {
        if (typeof fallbackFn === "function") {
          return fallbackFn(new Error("Circuit breaker is OPEN (Rural network protection active)"));
        }
        throw new Error("Circuit breaker is OPEN. Fast-failing to preserve battery & data.");
      }
    }

    try {
      const result = await asyncFn();
      this.onSuccess();
      return result;
    } catch (err) {
      this.onFailure(err);
      if (typeof fallbackFn === "function") {
        return fallbackFn(err);
      }
      throw err;
    }
  }

  onSuccess() {
    this.failureCount = 0;
    this.state = STATE.CLOSED;
  }

  onFailure(err) {
    this.failureCount += 1;
    this.lastFailureTime = Date.now();

    if (this.state === STATE.HALF_OPEN || this.failureCount >= this.failureThreshold) {
      this.state = STATE.OPEN;
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("gyansetu:circuit-trip", {
            detail: {
              failureCount: this.failureCount,
              cooldownRemainingMs: this.cooldownPeriodMs,
              reason: err?.message || "Repeated network failures",
            },
          })
        );
      }
    }
  }

  getState() {
    return this.state;
  }

  reset() {
    this.state = STATE.CLOSED;
    this.failureCount = 0;
    this.lastFailureTime = null;
  }
}

export const defaultCircuitBreaker = new RuralCircuitBreaker();
export default RuralCircuitBreaker;
