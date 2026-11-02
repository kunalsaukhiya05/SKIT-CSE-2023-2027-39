const express = require("express");
const router = express.Router();
const {
  askQuestion,
  getChatHistory,
  clearChatHistory,
} = require("../contollers/chatbot.controller");
const authStudentToken = require("../middleware/authStudentToken");

// Form-3B Primary Endpoint: /api/chatbot/ask
router.post("/ask", authStudentToken, askQuestion);
router.get("/history", authStudentToken, getChatHistory);
router.delete("/history", authStudentToken, clearChatHistory);

module.exports = router;
