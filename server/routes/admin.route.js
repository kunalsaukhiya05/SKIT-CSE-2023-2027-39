const express = require("express");
const router = express.Router();
const {
  adminLogin,
  adminSignup,
  adminLogout,
  getDashboardStats,
  getAllStudents,
  getAllTeachers,
  deleteUser,
  getStudentPerformance,
  getAttendanceAnalytics,
} = require("../contollers/admin.controller");
const authAdminToken = require("../middleware/authAdminToken");

router.post("/signup", adminSignup);
router.post("/login", adminLogin);
router.get("/logout", adminLogout);

// Protected admin routes
router.get("/dashboard-stats", authAdminToken, getDashboardStats);
router.get("/students", authAdminToken, getAllStudents);
router.get("/teachers", authAdminToken, getAllTeachers);
router.delete("/user/:role/:id", authAdminToken, deleteUser);
router.get("/analytics/performance", authAdminToken, getStudentPerformance);
router.get("/analytics/attendance", authAdminToken, getAttendanceAnalytics);

module.exports = router;
