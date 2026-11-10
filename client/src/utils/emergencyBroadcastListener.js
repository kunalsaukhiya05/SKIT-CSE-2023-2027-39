/**
 * Rural Emergency Broadcast Listener Daemon
 * Author: Kunal Saukhiya <hgkunal@gmail.com>
 * Sprint 7 / Week 14: Resilient push alert subscriber for campus power/weather updates
 */

class EmergencyBroadcastListener {
  constructor() {
    this.subscribers = new Set();
    this.cachedAlerts = [];
    this.eventSource = null;
    this.reconnectTimer = null;
  }

  init(baseUrl) {
    if (typeof window === "undefined") return;

    try {
      const stored = localStorage.getItem("gyaansetu_emergency_alerts");
      if (stored) this.cachedAlerts = JSON.parse(stored);
    } catch (e) {}

    this.connect(baseUrl);
  }

  connect(baseUrl) {
    if (!baseUrl) return;

    try {
      const url = `${baseUrl}api/notification/emergency-stream`;
      this.eventSource = new EventSource(url, { withCredentials: true });

      this.eventSource.onmessage = (event) => {
        try {
          const alert = JSON.parse(event.data);
          this.handleIncomingAlert(alert);
        } catch (err) {
          console.warn("Broadcast parse err:", err);
        }
      };

      this.eventSource.onerror = () => {
        if (this.eventSource) this.eventSource.close();
        // Exponential backoff reconnect
        clearTimeout(this.reconnectTimer);
        this.reconnectTimer = setTimeout(() => this.connect(baseUrl), 15000);
      };
    } catch (err) {
      console.warn("EventSource not supported or blocked, fallback active:", err);
    }
  }

  handleIncomingAlert(alert) {
    const enriched = { ...alert, receivedAt: new Date().toISOString() };
    this.cachedAlerts.unshift(enriched);
    if (this.cachedAlerts.length > 20) this.cachedAlerts.pop();

    try {
      localStorage.setItem("gyaansetu_emergency_alerts", JSON.stringify(this.cachedAlerts));
    } catch (e) {}

    this.subscribers.forEach((callback) => callback(enriched));
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  getRecentAlerts() {
    return this.cachedAlerts;
  }
}

export const broadcastListener = new EmergencyBroadcastListener();
export default broadcastListener;
