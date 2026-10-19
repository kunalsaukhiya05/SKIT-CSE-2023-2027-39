/**
 * Stale-While-Revalidate Local Resource & Notes Cache Utility
 * Author: Kunal Saukhiya <hgkunal@gmail.com>
 * Sprint 5 / Week 11: Instant offline rendering for rural student study materials
 */

const CACHE_PREFIX = "gyaansetu_swr_";
const DEFAULT_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours

export const getCachedResource = (key) => {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const isStale = Date.now() - parsed.timestamp > (parsed.ttl || DEFAULT_TTL_MS);
    return {
      data: parsed.data,
      isStale,
      timestamp: parsed.timestamp,
    };
  } catch (err) {
    console.warn("Error reading cached resource:", err);
    return null;
  }
};

export const setCachedResource = (key, data, ttlMs = DEFAULT_TTL_MS) => {
  try {
    const payload = {
      data,
      timestamp: Date.now(),
      ttl: ttlMs,
    };
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(payload));
    return true;
  } catch (err) {
    console.warn("Failed to write to offline resource cache:", err);
    return false;
  }
};

export const fetchWithSWR = async (key, fetcher, onBackgroundUpdated, ttlMs = DEFAULT_TTL_MS) => {
  const cached = getCachedResource(key);

  // If cache exists, return immediate cached view
  if (cached && !cached.isStale) {
    return cached.data;
  }

  // Trigger background revalidation
  fetcher()
    .then((freshData) => {
      setCachedResource(key, freshData, ttlMs);
      if (onBackgroundUpdated && typeof onBackgroundUpdated === "function") {
        onBackgroundUpdated(freshData);
      }
    })
    .catch((err) => {
      console.warn("Background cache revalidation skipped:", err.message);
    });

  if (cached) {
    return cached.data;
  }

  // If cold cache, await network
  const networkData = await fetcher();
  setCachedResource(key, networkData, ttlMs);
  return networkData;
};

export const clearStaleCache = () => {
  try {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(CACHE_PREFIX)) {
        const item = JSON.parse(localStorage.getItem(key));
        if (Date.now() - item.timestamp > (item.ttl || DEFAULT_TTL_MS) * 2) {
          keysToRemove.push(key);
        }
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  } catch (e) {
    console.warn("Error clearing stale cache:", e);
  }
};
