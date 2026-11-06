/**
 * Offline Sync Conflict Resolver & Auto-Merge Utility
 * Author: Kunal Saukhiya <hgkunal@gmail.com>
 * Sprint 7 / Week 14: Handles three-way reconciliation for rural offline storage
 */

export const CONFLICT_STRATEGY = {
  CLIENT_WINS: "CLIENT_WINS",
  SERVER_WINS: "SERVER_WINS",
  MERGE_PRESERVE: "MERGE_PRESERVE",
};

export const resolveRecordConflict = (localRecord, serverRecord, strategy = CONFLICT_STRATEGY.MERGE_PRESERVE) => {
  if (!localRecord) return serverRecord;
  if (!serverRecord) return localRecord;

  if (strategy === CONFLICT_STRATEGY.CLIENT_WINS) {
    return { ...serverRecord, ...localRecord, _resolvedBy: "client" };
  }

  if (strategy === CONFLICT_STRATEGY.SERVER_WINS) {
    return { ...localRecord, ...serverRecord, _resolvedBy: "server" };
  }

  // Three-way field merge preserving newer edits
  const localUpdated = new Date(localRecord.updatedAt || localRecord.timestamp || 0).getTime();
  const serverUpdated = new Date(serverRecord.updatedAt || serverRecord.timestamp || 0).getTime();

  const merged = { ...serverRecord, ...localRecord };

  // For array queues (like attendance punches or quiz submissions), deduplicate by ID
  if (Array.isArray(localRecord.items) && Array.isArray(serverRecord.items)) {
    const itemMap = new Map();
    serverRecord.items.forEach((item) => itemMap.set(item.id || item._id, item));
    localRecord.items.forEach((item) => itemMap.set(item.id || item._id, item));
    merged.items = Array.from(itemMap.values());
  }

  merged._conflictResolved = true;
  merged._resolvedAt = new Date().toISOString();
  merged._primarySource = localUpdated >= serverUpdated ? "local" : "server";

  return merged;
};

export const batchResolveQueue = (localQueue = [], serverState = []) => {
  const serverMap = new Map(serverState.map((item) => [item.id || item._id, item]));
  const resolvedList = [];

  for (const localItem of localQueue) {
    const key = localItem.id || localItem._id;
    if (serverMap.has(key)) {
      resolvedList.push(resolveRecordConflict(localItem, serverMap.get(key)));
      serverMap.delete(key);
    } else {
      resolvedList.push({ ...localItem, _isNewToRemote: true });
    }
  }

  // Append remaining remote items
  for (const remaining of serverMap.values()) {
    resolvedList.push(remaining);
  }

  return resolvedList;
};
