const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  assignmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Assignment",
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  studentName: {
    type: String,
    required: true,
  },
  submissionText: {
    type: String,
    default: "",
  },
  fileUrl: {
    type: String,
    default: "",
  },
  fileName: {
    type: String,
    default: "",
  },
  grade: {
    type: String,
    default: "",
  },
  marks: {
    type: Number,
    default: null,
  },
  feedback: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    enum: ["submitted", "graded", "late", "resubmitted"],
    default: "submitted",
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  gradedAt: {
    type: Date,
    default: null,
  },
});

submissionSchema.index({ assignmentId: 1, studentId: 1 }, { unique: true });
submissionSchema.index({ studentId: 1 });

const submissionModel = mongoose.model("Submission", submissionSchema);

module.exports = submissionModel;
