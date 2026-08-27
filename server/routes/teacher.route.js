const express = require("express");
const router = express.Router();
const { teacherSignup, teacherLogin, teacherDetails, teacherLogout, teacherProfileEdit } = require("../contollers/teacher.controller");
const authTeacherToken = require("../middleware/authTeacherToken");

router.post("/signup", teacherSignup);
router.post("/login", teacherLogin);
router.get("/details", authTeacherToken, teacherDetails);
router.post("/teacher-profile/edit/:id", authTeacherToken, teacherProfileEdit);
router.get("/logout", teacherLogout);

module.exports = router;