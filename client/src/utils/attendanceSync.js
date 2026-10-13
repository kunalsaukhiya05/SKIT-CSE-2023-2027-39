/**
 * Offline Attendance Synchronization Utility for Rural Remote Classrooms
 * Author: Kunal Saukhiya <hgkunal@gmail.com>
 * Sprint 4 / Week 10: Buffers student attendance locally during network dropouts
 */

const ATTENDANCE_QUEUE_KEY = "gyaansetu_offline_attendance_queue";

export const getOfflineAttendanceQueue = () => {
  try {
    const data = localStorage.getItem(ATTENDANCE_QUEUE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.warn("Failed to read offline attendance queue:", err);
    return [];
  }
};

export const queueOfflineAttendance = (attendancePayload) => {
  try {
    const queue = getOfflineAttendanceQueue();
    const entry = {
      ...attendancePayload,
      localId: "att_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
      timestamp: new Date().toISOString(),
      syncStatus: "pending",
    };
    queue.push(entry);
    localStorage.setItem(ATTENDANCE_QUEUE_KEY, JSON.stringify(queue));
    return entry;
  } catch (err) {
    console.error("Failed to queue offline attendance:", err);
    return null;
  }
};

export const clearSyncedAttendance = (syncedLocalIds = []) => {
  try {
    const queue = getOfflineAttendanceQueue();
    const remaining = queue.filter((item) => !syncedLocalIds.includes(item.localId));
    localStorage.setItem(ATTENDANCE_QUEUE_KEY, JSON.stringify(remaining));
  } catch (err) {
    console.error("Failed to clear synced attendance:", err);
  }
};
