const express = require("express");
const router = express.Router();
const { toggleLowBandwidthMode, createClassroom, AllClassess, getClassById, joinClass, getTeacherClasses, leaveClass, verifyRoomAccess, getClassroomStats, endClassroomSession, joinClassByCode, meetingHeartbeat } = require("../contollers/classroom.controller");
const authTeacherToken = require("../middleware/authTeacherToken");
const authStudentToken = require("../middleware/authStudentToken");

router.post("/create", authTeacherToken, createClassroom);
router.get("/stats/summary", authTeacherToken, getClassroomStats);
router.get("/all-classes", AllClassess);
router.get("/teacher-classes", authTeacherToken, getTeacherClasses);
router.get(":id", getClassById);
router.patch("/bandwidth-mode/:id", authTeacherToken, toggleLowBandwidthMode);
router.post("/join/:classId", authStudentToken, joinClass);
router.post("/leave/:classId", authStudentToken, leaveClass);
router.post("/join-by-code", authStudentToken, joinClassByCode);
router.post("/end-session/:classId", authTeacherToken, endClassroomSession);
router.get("/verify-room/:roomId", authStudentToken, verifyRoomAccess);
router.post("/meeting/:roomId/heartbeat", authStudentToken, meetingHeartbeat);

module.exports = router;
// Classroom API Route Security & Role Access Validation [Kunal Saukhiya]


