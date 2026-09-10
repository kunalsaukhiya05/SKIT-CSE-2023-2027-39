const express = require("express");
const router = express.Router();
const {
  createAssignment,
  getAssignments,
  getAssignmentById,
  submitAssignment,
  getSubmissions,
  getStudentSubmissions,
  gradeSubmission,
  deleteAssignment,
} = require("../contollers/assignment.controller");
const authTeacherToken = require("../middleware/authTeacherToken");
const authStudentToken = require("../middleware/authStudentToken");

// Teacher routes
router.post("/create", authTeacherToken, createAssignment);
router.get("/list", getAssignments);
router.get("/:id", getAssignmentById);
router.get("/submissions/:assignmentId", authTeacherToken, getSubmissions);
router.put("/grade/:submissionId", authTeacherToken, gradeSubmission);
router.delete("/:id", authTeacherToken, deleteAssignment);

// Student routes
router.post("/submit", authStudentToken, submitAssignment);
router.get("/student/submissions", authStudentToken, getStudentSubmissions);

module.exports = router;
