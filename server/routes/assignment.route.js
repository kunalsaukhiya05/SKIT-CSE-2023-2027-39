const express = require("express");
const router = express.Router();
const {
  createAssignment,
  getPendingAssignmentsByClass,
  getAssignments,
  getAssignmentById,
  submitAssignment,
  getSubmissions,
  getStudentSubmissions,
  gradeSubmission,
  deleteAssignment,
  getClassAssignmentStats,
  exportSubmissions,
  getMyAssignmentGrades,
} = require("../contollers/assignment.controller");
const authTeacherToken = require("../middleware/authTeacherToken");
const authStudentToken = require("../middleware/authStudentToken");

// Teacher routes
router.post("/create", authTeacherToken, createAssignment);
router.get("/pending", getPendingAssignmentsByClass);
router.get("/pending/:classId", getPendingAssignmentsByClass);
router.get("/class-stats/:classId", getClassAssignmentStats);
router.get("/list", getAssignments);
router.get("/:id", getAssignmentById);
router.get("/submissions/:assignmentId", authTeacherToken, getSubmissions);
router.get("/export/:assignmentId", authTeacherToken, exportSubmissions);
router.put("/grade/:submissionId", authTeacherToken, gradeSubmission);
router.delete("/:id", authTeacherToken, deleteAssignment);

// Student routes
router.post("/submit", authStudentToken, submitAssignment);
router.get("/student/submissions", authStudentToken, getStudentSubmissions);
router.get("/student/my-grades", authStudentToken, getMyAssignmentGrades);

module.exports = router;

