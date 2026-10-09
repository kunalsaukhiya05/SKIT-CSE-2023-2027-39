const mongoose = require("mongoose");

// Quiz Question Schema [Rishabh Jain]
const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: { type: [String], required: true, validate: (v) => v.length >= 2 },
  correctOption: { type: Number, required: true }, // Index of correct option
  marks: { type: Number, default: 1 },
});

// Quiz Schema [Rishabh Jain]
const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    classId: { type: String, default: null },
    teacherId: { type: String, required: true },
    teacherName: { type: String, default: "Teacher" },
    questions: { type: [questionSchema], required: true },
    durationMinutes: { type: Number, default: 30 },
    scheduledAt: { type: Date, default: Date.now },
    totalMarks: { type: Number },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quiz", quizSchema);
