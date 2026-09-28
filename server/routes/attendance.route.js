const express = require("express");
const router = express.Router();
const { markAttendance, getClassAttendance, getStudentAttendance, recordLiveAttendance } = require("../contollers/attendance.controller");
const authTeacherToken = require("../middleware/authTeacherToken");
const authStudentToken = require("../middleware/authStudentToken");

router.post("/mark", authTeacherToken, markAttendance);
router.get("/class/:classId", getClassAttendance);
router.get("/student", authStudentToken, getStudentAttendance);
router.post("/record-live", authStudentToken, recordLiveAttendance);

module.exports = router;
