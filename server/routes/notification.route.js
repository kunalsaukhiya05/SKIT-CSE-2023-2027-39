const express = require("express");
const router = express.Router();
const { getNotifications, getUnreadCount, getClassNotifications, markAsRead, markAllAsRead, createAnnouncement } = require("../contollers/notification.controller");
const authTeacherToken = require("../middleware/authTeacherToken");

router.get("/list", getNotifications);
router.get("/unread-count", getUnreadCount);
router.get("/class/:classId", getClassNotifications);
router.put("/read/:id", markAsRead);
router.put("/read-all", markAllAsRead);
router.post("/announce", authTeacherToken, createAnnouncement);

module.exports = router;

