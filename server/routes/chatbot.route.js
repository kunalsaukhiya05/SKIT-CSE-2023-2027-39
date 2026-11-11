const express = require("express");
const router = express.Router();
const {
  askQuestion,
  getChatHistory,
  clearChatHistory,
  getSuggestedPrompts,
  getCurriculumSubjects,
  submitFeedback,
} = require("../contollers/chatbot.controller");
const authStudentToken = require("../middleware/authStudentToken");

// Form-3B Primary Endpoint: /api/chatbot/ask
router.post("/ask", authStudentToken, askQuestion);
router.get("/history", authStudentToken, getChatHistory);
router.delete("/history", authStudentToken, clearChatHistory);
router.get("/suggested-prompts", getSuggestedPrompts);
router.get("/subjects", getCurriculumSubjects);
router.post("/feedback/:chatId", authStudentToken, submitFeedback);

module.exports = router;
