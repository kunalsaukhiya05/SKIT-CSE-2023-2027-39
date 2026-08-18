const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
    trim: true,
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,
  },
  teacherName: {
    type: String,
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
  fileUrl: {
    type: String,
    default: "",
  },
  fileName: {
    type: String,
    default: "",
  },
  totalMarks: {
    type: Number,
    default: 100,
  },
  status: {
    type: String,
    enum: ["active", "closed", "draft"],
    default: "active",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

assignmentSchema.index({ teacherId: 1 });
assignmentSchema.index({ classId: 1 });
assignmentSchema.index({ deadline: 1 });

const assignmentModel = mongoose.model("Assignment", assignmentSchema);

module.exports = assignmentModel;
