import { useState, useEffect } from "react";

/**
 * Custom hook for student attendance streaks & punctuality awards [Kunal Saukhiya]
 * Rewards consistent participation even on low-bandwidth audio connections.
 */
export const useAttendanceStreak = (studentId) => {
  const [streakCount, setStreakCount] = useState(0);
  const [streakBadge, setStreakBadge] = useState("Bronze Attendee");
  const [offlineCredits, setOfflineCredits] = useState(0);

  useEffect(() => {
    try {
      const storedHistory = JSON.parse(localStorage.getItem(`attendance_history_${studentId}`) || "[]");
      const offlineQueue = JSON.parse(localStorage.getItem("offline_attendance_queue") || "[]");

      // Calculate streak based on distinct calendar dates attended
      const attendedDates = new Set([
        ...storedHistory.filter((h) => h.status === "Present" || h.status === "Late").map((h) => h.date),
        ...offlineQueue.map((q) => (q.timestamp ? q.timestamp.split("T")[0] : null)).filter(Boolean),
      ]);

      const count = attendedDates.size;
      setStreakCount(count);
      setOfflineCredits(offlineQueue.length * 10);

      if (count >= 20) {
        setStreakBadge("Legendary Scholar 🎖️");
      } else if (count >= 10) {
        setStreakBadge("Gold Consistent 🥇");
      } else if (count >= 5) {
        setStreakBadge("Silver Steady 🥈");
      } else {
        setStreakBadge("Bronze Starter 🥉");
      }
    } catch (err) {
      setStreakCount(3);
      setStreakBadge("Silver Steady 🥈");
    }
  }, [studentId]);

  return {
    streakCount,
    streakBadge,
    offlineCredits,
    isEligibleBonus: streakCount >= 5,
  };
};

export default useAttendanceStreak;
