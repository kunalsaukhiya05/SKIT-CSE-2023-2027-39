const mongoose = require("mongoose");

// Quiz Attempt Schema — stores student responses and auto-graded results [Rishabh Jain]
const quizAttemptSchema = new mongoose.Schema(
  {
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
    studentId: { type: String, required: true },
    studentName: { type: String, default: "Student" },
    answers: { type: [Number], required: true }, // Array of selected option indices
    gradedAnswers: [
      {
        questionIndex: Number,
        submitted: Number,
        correct: Number,
        isCorrect: Boolean,
      },
    ],
    score: { type: Number, default: 0 },
    totalMarks: { type: Number },
    percentage: { type: Number, default: 0 },
    timeTakenSeconds: { type: Number, default: 0 },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Compound index to prevent duplicate attempts [Rishabh Jain]
quizAttemptSchema.index({ quizId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model("QuizAttempt", quizAttemptSchema);
