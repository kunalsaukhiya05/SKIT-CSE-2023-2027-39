import { useState, useEffect, useCallback } from "react";
import { OfflineSyncQueue } from "../utils/offlineSyncQueue";

export const useOfflineQueue = () => {
  const [queue, setQueue] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const refreshQueue = useCallback(() => {
    setQueue(OfflineSyncQueue.getQueue());
  }, []);

  useEffect(() => {
    refreshQueue();

    const handleOnline = () => {
      setIsOnline(true);
      syncNow();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [refreshQueue]);

  const syncNow = async () => {
    setIsSyncing(true);
    await OfflineSyncQueue.processQueue(() => {
      refreshQueue();
    });
    setIsSyncing(false);
    refreshQueue();
  };

  const addOfflineSubmission = (submissionData) => {
    const item = OfflineSyncQueue.enqueue(submissionData);
    refreshQueue();
    if (navigator.onLine) {
      syncNow();
    }
    return item;
  };

  return {
    queue,
    pendingCount: queue.length,
    isSyncing,
    isOnline,
    syncNow,
    addOfflineSubmission,
  };
};
