const Notification = require('../models/notification.model');

/**
 * Dispatch a notification to one or multiple recipients.
 * @param {Object|Object[]} payload - Single or array of notification payloads
 */
async function dispatchNotification(payload) {
  try {
    const notifications = Array.isArray(payload) ? payload : [payload];
    const docs = notifications.map((n) => ({
      recipient: n.recipient,
      type: n.type,
      title: n.title,
      message: n.message,
      link: n.link || null,
      classroom: n.classroom || null,
      metadata: n.metadata || {},
    }));
    await Notification.insertMany(docs, { ordered: false });
  } catch (err) {
    console.error('[NotificationHelper] Failed to dispatch notifications:', err.message);
  }
}

/**
 * Notify all students in a classroom.
 * @param {string[]} studentIds
 * @param {Object} notifData - { type, title, message, link, classroom, metadata }
 */
async function notifyClassroom(studentIds, notifData) {
  const payloads = studentIds.map((id) => ({ recipient: id, ...notifData }));
  await dispatchNotification(payloads);
}

/**
 * Mark all notifications read for a user.
 * @param {string} userId
 */
async function markAllReadForUser(userId) {
  return Notification.markAllRead(userId);
}

module.exports = { dispatchNotification, notifyClassroom, markAllReadForUser };
