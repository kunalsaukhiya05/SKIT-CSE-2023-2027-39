/**
 * OfflineSyncQueue Utility
 * Manages local storage persistence for offline assignment submissions in low-connectivity rural regions.
 */

const STORAGE_KEY = "gyaansetu_offline_submissions";

export class OfflineSyncQueue {
  static getQueue() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Failed to read offline queue from localStorage", e);
      return [];
    }
  }

  static enqueue(submissionData) {
    const queue = this.getQueue();
    const item = {
      id: `offline_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      data: submissionData,
      timestamp: new Date().toISOString(),
      retryCount: 0,
      status: "pending",
    };

    queue.push(item);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
    return item;
  }

  static dequeue(id) {
    const queue = this.getQueue();
    const updated = queue.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  static updateStatus(id, status, retryCount = 0) {
    const queue = this.getQueue();
    const item = queue.find((i) => i.id === id);
    if (item) {
      item.status = status;
      item.retryCount = retryCount;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
    }
  }

  static async processQueue(onProgress) {
    if (!navigator.onLine) {
      console.log("Device is offline. Skipping queue processing.");
      return;
    }

    const queue = this.getQueue();
    const pendingItems = queue.filter((item) => item.status === "pending" || item.status === "failed");

    for (const item of pendingItems) {
      try {
        this.updateStatus(item.id, "syncing", item.retryCount);
        if (onProgress) onProgress(item, "syncing");

        // Simulate API sync request with backoff
        await new Promise((resolve) => setTimeout(resolve, 1000));

        this.dequeue(item.id);
        if (onProgress) onProgress(item, "completed");
      } catch (err) {
        console.error(`Sync failed for item ${item.id}`, err);
        this.updateStatus(item.id, "failed", item.retryCount + 1);
        if (onProgress) onProgress(item, "failed");
      }
    }
  }
}
