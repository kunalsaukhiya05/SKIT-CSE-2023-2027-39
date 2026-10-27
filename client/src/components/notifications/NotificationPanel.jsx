import React from 'react';
import { useNotifications } from '../../hooks/useNotifications';

const TYPE_ICONS = {
  grade_posted: '📊',
  assignment_due: '📝',
  quiz_scheduled: '📋',
  announcement: '📢',
  resource_uploaded: '📁',
};

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

/**
 * NotificationPanel — slide-in panel showing all notifications.
 * Props:
 *  isOpen   - boolean
 *  onClose  - fn()
 */
export default function NotificationPanel({ isOpen, onClose }) {
  const { notifications, unreadCount, loading, markRead, markAllRead } = useNotifications();

  if (!isOpen) return null;

  return (
    <div className="notif-overlay" onClick={onClose}>
      <aside className="notif-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="notif-header">
          <h3>
            Notifications{' '}
            {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
          </h3>
          <div className="notif-header-actions">
            {unreadCount > 0 && (
              <button className="btn-text" onClick={markAllRead}>
                Mark all read
              </button>
            )}
            <button className="btn-icon" onClick={onClose} aria-label="Close">
              ✕
            </button>
          </div>
        </div>

        {/* Body */}
        <ul className="notif-list">
          {loading && <li className="notif-empty">Loading…</li>}
          {!loading && notifications.length === 0 && (
            <li className="notif-empty">You're all caught up! 🎉</li>
          )}
          {!loading &&
            notifications.map((n) => (
              <li
                key={n._id}
                className={`notif-item${n.isRead ? '' : ' notif-unread'}`}
                onClick={() => !n.isRead && markRead(n._id)}
              >
                <span className="notif-icon">{TYPE_ICONS[n.type] || '🔔'}</span>
                <div className="notif-content">
                  <p className="notif-title">{n.title}</p>
                  <p className="notif-message">{n.message}</p>
                  <span className="notif-time">{timeAgo(n.createdAt)}</span>
                </div>
                {!n.isRead && <span className="notif-dot" />}
              </li>
            ))}
        </ul>
      </aside>
    </div>
  );
}
