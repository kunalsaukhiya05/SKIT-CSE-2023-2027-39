const express = require("express");
const router = express.Router();
const { getNotifications, markAsRead, markAllAsRead, createAnnouncement } = require("../contollers/notification.controller");
const authTeacherToken = require("../middleware/authTeacherToken");

router.get("/list", getNotifications);
router.put("/read/:id", markAsRead);
router.put("/read-all", markAllAsRead);
router.post("/announce", authTeacherToken, createAnnouncement);

module.exports = router;
