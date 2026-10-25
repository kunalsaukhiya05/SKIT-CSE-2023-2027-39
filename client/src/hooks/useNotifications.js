import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || '';

/**
 * useNotifications — fetches, polls, and manages notification state.
 *
 * Returns:
 *  notifications  - array of notification objects
 *  unreadCount    - number of unread notifications
 *  loading        - boolean
 *  markRead       - fn(id) mark a single notification read
 *  markAllRead    - fn() mark all notifications read
 *  refresh        - fn() manually re-fetch
 */
export function useNotifications(pollIntervalMs = 30_000) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API}/api/notifications`, { withCredentials: true });
      if (data.success) setNotifications(data.notifications || []);
    } catch (err) {
      console.error('[useNotifications] fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, pollIntervalMs);
    return () => clearInterval(interval);
  }, [fetchNotifications, pollIntervalMs]);

  const markRead = useCallback(async (id) => {
    try {
      await axios.patch(`${API}/api/notifications/${id}/read`, {}, { withCredentials: true });
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error('[useNotifications] markRead error:', err.message);
    }
  }, []);

  const markAllRead = useCallback(async () => {
    try {
      await axios.patch(`${API}/api/notifications/read-all`, {}, { withCredentials: true });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('[useNotifications] markAllRead error:', err.message);
    }
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return { notifications, unreadCount, loading, markRead, markAllRead, refresh: fetchNotifications };
}
