/**
 * Offline Sync Queue Utility for Rural Collages
 * Developed by: Rishabh Jain <rishabhjain230306@gmail.com>
 * Allows students with intermittent 2G/3G connectivity to queue assignment submissions
 */

const QUEUE_STORAGE_KEY = "gyaansetu_offline_submission_queue";

export const getOfflineQueue = () => {
  try {
    const raw = localStorage.getItem(QUEUE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Failed to read offline queue", e);
    return [];
  }
};

export const enqueueSubmission = (submissionItem) => {
  try {
    const current = getOfflineQueue();
    const item = {
      ...submissionItem,
      id: "queue_" + Date.now(),
      queuedAt: new Date().toISOString(),
      syncStatus: "pending",
    };
    current.push(item);
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(current));
    return item;
  } catch (e) {
    console.error("Failed to enqueue submission", e);
    return null;
  }
};

export const clearSyncedSubmission = (itemId) => {
  try {
    const current = getOfflineQueue();
    const filtered = current.filter((item) => item.id !== itemId);
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error("Failed to clear offline item", e);
  }
};
