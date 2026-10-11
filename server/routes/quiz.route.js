const express = require("express");
const router = express.Router();
const {
  createQuiz,
  getQuizzes,
  getQuizById,
  submitQuizAttempt,
  getQuizAttempts,
  getStudentQuizAttempts,
  deleteQuiz,
} = require("../contollers/quiz.controller");

// Quiz routes [Rishabh Jain]
router.post("/", createQuiz);             // Teacher: create quiz
router.get("/", getQuizzes);              // Get all quizzes (filter by classId/teacherId)
router.get("/:id", getQuizById);          // Get quiz by ID
router.delete("/:id", deleteQuiz);        // Teacher: delete quiz

// Attempt routes
router.post("/attempt/submit", submitQuizAttempt);         // Student: submit attempt
router.get("/:quizId/attempts", getQuizAttempts);          // Teacher: view all attempts
router.get("/attempt/mine", getStudentQuizAttempts);       // Student: view own attempts

module.exports = router;
