const express = require("express");
const router = express.Router();
const { studentSignup, studentLogin, studentsDetails, studentLogout, studentProfileEdit } = require("../contollers/student.contoller");
const authStudentToken = require("../middleware/authStudentToken");

router.post("/signup", studentSignup);
router.post("/login", studentLogin);
router.get("/details", authStudentToken, studentsDetails);
router.post("/student-profile/edit/:id", authStudentToken, studentProfileEdit);
router.get("/logout", studentLogout);

module.exports = router;