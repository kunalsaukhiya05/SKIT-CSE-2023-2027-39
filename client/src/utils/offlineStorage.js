/**
 * Offline Storage & Local Cache Utility for Rural Remote Classroom
 * Author: Kunal Saukhiya <hgkunal@gmail.com>
 * Sprint 4 / Week 9: Cache study resources, roster, and notes for intermittent connectivity
 */

const STORAGE_PREFIX = "gyaansetu_offline_";

export const setOfflineCache = (key, data, ttlMinutes = 1440) => {
  try {
    const payload = {
      data,
      expiry: Date.now() + ttlMinutes * 60 * 1000,
    };
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(payload));
  } catch (err) {
    console.warn("Offline cache storage error:", err);
  }
};

export const getOfflineCache = (key) => {
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    if (!item) return null;
    const parsed = JSON.parse(item);
    if (Date.now() > parsed.expiry) {
      localStorage.removeItem(STORAGE_PREFIX + key);
      return null;
    }
    return parsed.data;
  } catch (err) {
    console.warn("Offline cache retrieval error:", err);
    return null;
  }
};

export const clearOfflineCache = (key) => {
  try {
    if (key) {
      localStorage.removeItem(STORAGE_PREFIX + key);
    } else {
      Object.keys(localStorage)
        .filter((k) => k.startsWith(STORAGE_PREFIX))
        .forEach((k) => localStorage.removeItem(k));
    }
  } catch (err) {
    console.warn("Offline cache cleanup error:", err);
  }
};
