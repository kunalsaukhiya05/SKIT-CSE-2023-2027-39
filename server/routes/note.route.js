const express = require("express");
const router = express.Router();
const {
  uploadNote,
  getNotes,
  getDistinctSubjects,
  getNoteById,
} = require("../contollers/note.controller");
const authTeacherToken = require("../middleware/authTeacherToken");

router.get("/subjects", getDistinctSubjects);
router.get("/:id", getNoteById);
router.get("/", getNotes);
router.post("/upload", authTeacherToken, uploadNote);

module.exports = router;
