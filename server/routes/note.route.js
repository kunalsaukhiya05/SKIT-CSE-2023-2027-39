const express = require("express");
const router = express.Router();
const {
  uploadNote,
  getNotes,
  getDistinctSubjects,
  getNoteById,
  downloadNote,
  deleteNote,
  getNotesStats,
} = require("../contollers/note.controller");
const authTeacherToken = require("../middleware/authTeacherToken");

router.get("/subjects", getDistinctSubjects);
router.get("/stats", getNotesStats);
router.get("/download/:id", downloadNote);
router.get("/:id", getNoteById);
router.delete("/:id", authTeacherToken, deleteNote);
router.get("/", getNotes);
router.post("/upload", authTeacherToken, uploadNote);

module.exports = router;
