const notificationModel = require("../models/notification.model");

// Get notifications for a user
const getNotifications = async (req, res) => {
  try {
    const { recipientType, recipientId } = req.query;

    let query = {};
    
    if (recipientId) {
      // Get notifications targeted to this specific user OR to all users of their type
      query = {
        $or: [
          { recipientId: recipientId },
          { recipientType: recipientType, recipientId: null },
          { recipientType: "all", recipientId: null },
        ],
      };
    } else if (recipientType) {
      query = {
        $or: [
          { recipientType: recipientType },
          { recipientType: "all" },
        ],
      };
    }

    const notifications = await notificationModel
      .find(query)
      .sort({ createdAt: -1 })
      .limit(50);

    return res.status(200).json({
      message: "Notifications fetched successfully",
      notifications,
    });
  } catch (err) {
    console.error("Error fetching notifications:", err);
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

// Mark notification as read
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await notificationModel.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    return res.status(200).json({
      message: "Notification marked as read",
      notification,
    });
  } catch (err) {
    console.error("Error marking notification as read:", err);
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

// Mark all notifications as read
const markAllAsRead = async (req, res) => {
  try {
    const { recipientId, recipientType } = req.body;

    let query = { isRead: false };
    if (recipientId) {
      query.$or = [
        { recipientId },
        { recipientType, recipientId: null },
        { recipientType: "all", recipientId: null },
      ];
    }

    await notificationModel.updateMany(query, { isRead: true });

    return res.status(200).json({ message: "All notifications marked as read" });
  } catch (err) {
    console.error("Error marking all as read:", err);
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

// Create announcement (Teacher/Admin)
const createAnnouncement = async (req, res) => {
  try {
    const { title, message, recipientType, senderName, classId } = req.body;

    if (!title || !message) {
      return res.status(400).json({ message: "Title and message are required" });
    }

    const notification = await notificationModel.create({
      title,
      message,
      type: "announcement",
      recipientType: recipientType || "all",
      senderId: req.teacherId || req.adminId,
      senderName: senderName || "System",
      classId: classId || null,
    });

    return res.status(201).json({
      message: "Announcement created successfully",
      notification,
    });
  } catch (err) {
    console.error("Error creating announcement:", err);
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

module.exports = { getNotifications, markAsRead, markAllAsRead, createAnnouncement };
