const express = require("express");
const router = express.Router();
const { createClassroom, AllClassess, getClassById, joinClass, getTeacherClasses, leaveClass, verifyRoomAccess } = require("../contollers/classroom.controller");
const authTeacherToken = require("../middleware/authTeacherToken");
const authStudentToken = require("../middleware/authStudentToken");

router.post("/create", authTeacherToken, createClassroom);
router.get("/all-classes", AllClassess);
router.get("/teacher-classes", authTeacherToken, getTeacherClasses);
router.get("/:id", getClassById);
router.post("/join/:classId", authStudentToken, joinClass);
router.post("/leave/:classId", authStudentToken, leaveClass);
router.get("/verify-room/:roomId", authStudentToken, verifyRoomAccess);

module.exports = router;
// Classroom API Route Security & Role Access Validation [Kunal Saukhiya]

