const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: "",
  },
  subject: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    enum: ["PDF", "Video", "Document", "Presentation", "Other"],
    default: "Other",
  },
  fileUrl: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  fileSize: {
    type: String,
    default: "",
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
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

resourceSchema.index({ teacherId: 1 });
resourceSchema.index({ subject: 1 });

const resourceModel = mongoose.model("Resource", resourceSchema);

module.exports = resourceModel;
