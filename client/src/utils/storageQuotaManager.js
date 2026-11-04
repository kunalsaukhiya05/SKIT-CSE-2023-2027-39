/**
 * Rural Storage Quota & Eviction Manager Utility
 * Author: Kunal Saukhiya <hgkunal@gmail.com>
 * Sprint 7 / Week 13: Manages client localStorage/IndexedDB footprint to prevent quota overflows on budget devices
 */

const STORAGE_KEYS = {
  NOTES: "gyaansetu_swr_",
  ATTENDANCE_QUEUE: "offline_attendance_queue",
  CHAT_CACHE: "gyaansetu_chat_cache",
  DRAFTS: "draft_",
};

export const getStorageUsageEstimate = async () => {
  if (typeof navigator !== "undefined" && navigator.storage && navigator.storage.estimate) {
    try {
      const estimate = await navigator.storage.estimate();
      const usedMB = (estimate.usage || 0) / (1024 * 1024);
      const quotaMB = (estimate.quota || 0) / (1024 * 1024);
      return {
        usedMB: Number(usedMB.toFixed(2)),
        quotaMB: Number(quotaMB.toFixed(2)),
        percentUsed: Number(((usedMB / (quotaMB || 1)) * 100).toFixed(1)),
      };
    } catch (e) {
      console.warn("Storage estimate error:", e);
    }
  }

  // Fallback estimation using localStorage length
  let totalBytes = 0;
  if (typeof localStorage !== "undefined") {
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        totalBytes += (localStorage[key].length + key.length) * 2;
      }
    }
  }
  const usedMB = totalBytes / (1024 * 1024);
  return {
    usedMB: Number(usedMB.toFixed(2)),
    quotaMB: 50, // Typical mobile browser safe budget
    percentUsed: Number(((usedMB / 50) * 100).toFixed(1)),
  };
};

export const cleanStaleCache = () => {
  if (typeof localStorage === "undefined") return 0;
  let cleanedCount = 0;
  const now = Date.now();
  const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

  for (let key in localStorage) {
    if (key.startsWith(STORAGE_KEYS.NOTES)) {
      try {
        const item = JSON.parse(localStorage.getItem(key));
        if (item.timestamp && now - item.timestamp > ONE_WEEK_MS) {
          localStorage.removeItem(key);
          cleanedCount++;
        }
      } catch (e) {}
    }
  }
  return cleanedCount;
};
