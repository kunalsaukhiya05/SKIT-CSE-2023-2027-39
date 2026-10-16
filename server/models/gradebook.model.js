const mongoose = require("mongoose");

// GradebookEntry Schema — stores aggregated marks per student per subject [Rishabh Jain]
const gradebookEntrySchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true, index: true },
    studentName: { type: String, default: "Student" },
    classId: { type: String, required: true, index: true },
    subject: { type: String, required: true, trim: true },
    teacherId: { type: String, required: true },
    quizScores: [
      {
        quizId: { type: String },
        quizTitle: { type: String },
        score: { type: Number, default: 0 },
        totalMarks: { type: Number, default: 0 },
        percentage: { type: Number, default: 0 },
        attemptedAt: { type: Date, default: Date.now },
      },
    ],
    assignmentScores: [
      {
        assignmentId: { type: String },
        assignmentTitle: { type: String },
        score: { type: Number, default: 0 },
        totalMarks: { type: Number, default: 0 },
        gradedAt: { type: Date, default: Date.now },
      },
    ],
    overallPercentage: { type: Number, default: 0 },
    grade: {
      type: String,
      enum: ["A+", "A", "B+", "B", "C", "D", "F"],
      default: "F",
    },
    attendancePercent: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Auto-compute overallPercentage and letter grade before save [Rishabh Jain]
gradebookEntrySchema.pre("save", function (next) {
  const allScores = [
    ...this.quizScores.map((q) => q.percentage),
    ...this.assignmentScores.map((a) =>
      a.totalMarks > 0 ? Math.round((a.score / a.totalMarks) * 100) : 0
    ),
  ];

  if (allScores.length > 0) {
    const avg = allScores.reduce((sum, s) => sum + s, 0) / allScores.length;
    this.overallPercentage = Math.round(avg);
  }

  const p = this.overallPercentage;
  if (p >= 90) this.grade = "A+";
  else if (p >= 80) this.grade = "A";
  else if (p >= 70) this.grade = "B+";
  else if (p >= 60) this.grade = "B";
  else if (p >= 50) this.grade = "C";
  else if (p >= 40) this.grade = "D";
  else this.grade = "F";

  this.lastUpdated = new Date();
  next();
});

// Compound index: one entry per student per subject per class [Rishabh Jain]
gradebookEntrySchema.index({ studentId: 1, classId: 1, subject: 1 }, { unique: true });

module.exports = mongoose.model("GradebookEntry", gradebookEntrySchema);
