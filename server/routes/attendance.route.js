const express = require("express");
const router = express.Router();
const { markAttendance, getClassAttendance, getStudentAttendance, recordLiveAttendance, getClassAttendanceSummary, syncMeetingAttendance, recordAttendance, getClassAttendanceReport } = require("../contollers/attendance.controller");
const authTeacherToken = require("../middleware/authTeacherToken");
const authStudentToken = require("../middleware/authStudentToken");

router.post("/mark", authTeacherToken, markAttendance);
router.get("/summary/:classId", authTeacherToken, getClassAttendanceSummary);
router.get("/class-report/:classId", getClassAttendanceReport);
router.get("/class/:classId", getClassAttendance);
router.get("/student", authStudentToken, getStudentAttendance);
router.post("/record", authStudentToken, recordAttendance);
router.post("/record-live", authStudentToken, recordLiveAttendance);
router.post("/meeting-sync/:classId", authStudentToken, syncMeetingAttendance);

module.exports = router;
