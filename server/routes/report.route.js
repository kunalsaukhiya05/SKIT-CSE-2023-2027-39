// server/routes/report.route.js
// Week 15 — Report API routes
// Rishabh Jain | SKIT CSE 2023-2027 Group 39

const express = require("express");
const router  = express.Router();

const {
  getStudentProgressReport,
  exportClassGradebookCSV,
  emailStudentProgressReport,
} = require("../contollers/report.controller");

const authStudentToken = require("../middleware/authStudentToken");
const authTeacherToken = require("../middleware/authTeacherToken");

// Student can fetch their own progress report
router.get("/student-progress/:studentId", authStudentToken, getStudentProgressReport);

// Teacher can download class gradebook as CSV
router.get("/class-gradebook-csv/:classId", authTeacherToken, exportClassGradebookCSV);

// Teacher can trigger emailing a student's progress report
router.post("/email-progress/:studentId", authTeacherToken, emailStudentProgressReport);

module.exports = router;
