const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
    index: true,
  },
  studentName: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    default: "General",
    trim: true,
    index: true,
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    default: null,
  },
  query: {
    type: String,
    required: true,
    trim: true,
  },
  response: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    enum: ["en", "hi", "bilingual"],
    default: "en",
  },
  model: {
    type: String,
    default: "gemini-1.5-flash",
  },
  source: {
    type: String,
    enum: ["gemini", "fallback", "offline_cache"],
    default: "gemini",
  },
  tokensUsed: {
    type: Number,
    default: 0,
  },
  latencyMs: {
    type: Number,
    default: 0,
  },
  feedback: {
    type: String,
    enum: ["helpful", "unhelpful", "pending"],
    default: "pending",
  },
  feedbackComment: {
    type: String,
    default: "",
  },
  tags: [{
    type: String,
    trim: true,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

chatSchema.index({ studentId: 1, createdAt: -1 });
chatSchema.index({ subject: 1, createdAt: -1 });

// Static query helpers [Manish Regar]
chatSchema.statics.getRecentStudentHistory = function (studentId, limit = 10) {
  return this.find({ studentId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select("query response subject language source feedback createdAt");
};

chatSchema.statics.clearStudentHistory = function (studentId) {
  return this.deleteMany({ studentId });
};

const chatModel = mongoose.model("Chat", chatSchema);

module.exports = chatModel;
