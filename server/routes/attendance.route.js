const express = require("express");
const router = express.Router();
const { markAttendance, getClassAttendance, getStudentAttendance, recordLiveAttendance, getClassAttendanceSummary, syncMeetingAttendance } = require("../contollers/attendance.controller");
const authTeacherToken = require("../middleware/authTeacherToken");
const authStudentToken = require("../middleware/authStudentToken");

router.post("/mark", authTeacherToken, markAttendance);
router.get("/summary/:classId", authTeacherToken, getClassAttendanceSummary);
router.get("/class/:classId", getClassAttendance);
router.get("/student", authStudentToken, getStudentAttendance);
router.post("/record-live", authStudentToken, recordLiveAttendance);
router.post("/meeting-sync/:classId", authStudentToken, syncMeetingAttendance);

module.exports = router;
