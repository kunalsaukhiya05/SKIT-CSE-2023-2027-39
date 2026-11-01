/**
 * analytics.route.js
 * Routes for classroom analytics endpoints.
 * All routes require authenticated teacher or admin token.
 * Week 13 — Rishabh Jain | Remote Classroom for Rural Colleges
 */

const express = require("express");
const router = express.Router();
const {
  getClassroomEngagement,
  getQuizScoreTrend,
  getAttendanceHeatmap,
  getGradeDistribution,
} = require("../contollers/analytics.controller");
const authTeacherToken = require("../middleware/authTeacherToken");

// GET /api/analytics/classroom/:classroomId/engagement
router.get(
  "/classroom/:classroomId/engagement",
  authTeacherToken,
  getClassroomEngagement
);

// GET /api/analytics/classroom/:classroomId/quiz-trend
router.get(
  "/classroom/:classroomId/quiz-trend",
  authTeacherToken,
  getQuizScoreTrend
);

// GET /api/analytics/classroom/:classroomId/attendance-heatmap
router.get(
  "/classroom/:classroomId/attendance-heatmap",
  authTeacherToken,
  getAttendanceHeatmap
);

// GET /api/analytics/classroom/:classroomId/grade-distribution
router.get(
  "/classroom/:classroomId/grade-distribution",
  authTeacherToken,
  getGradeDistribution
);

module.exports = router;
