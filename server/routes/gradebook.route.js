const express = require("express");
const router = express.Router();
const {
  syncGradebook,
  getClassGradebook,
  getStudentGradebook,
  updateAttendance,
} = require("../contollers/gradebook.controller");
const { verifyTeacher, verifyStudent } = require("../middleware/auth.middleware");

// Teacher routes [Rishabh Jain]
// POST /api/gradebook/sync — sync gradebook from quiz attempts + submissions
router.post("/sync", verifyTeacher, syncGradebook);

// GET /api/gradebook/class?classId=&subject= — full class gradebook
router.get("/class", verifyTeacher, getClassGradebook);

// PUT /api/gradebook/attendance — update attendance % for a student
router.put("/attendance", verifyTeacher, updateAttendance);

// Student routes [Rishabh Jain]
// GET /api/gradebook/student — student's own grades across all subjects
router.get("/student", verifyStudent, getStudentGradebook);

module.exports = router;
