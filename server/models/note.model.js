const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: "",
    trim: true,
  },
  subject: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  topic: {
    type: String,
    default: "General",
    trim: true,
  },
  category: {
    type: String,
    enum: ["Lecture Notes", "Reference Book", "Question Bank", "Lab Manual", "Syllabus", "Other"],
    default: "Lecture Notes",
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
    default: "0 MB",
  },
  fileType: {
    type: String,
    default: "pdf",
  },
  cloudinaryPublicId: {
    type: String,
    default: "",
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,
    index: true,
  },
  teacherName: {
    type: String,
    required: true,
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    index: true,
  },
  downloadCount: {
    type: Number,
    default: 0,
  },
  isLowBandwidthOptimized: {
    type: Boolean,
    default: true,
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

noteSchema.index({ subject: 1, topic: 1 });
noteSchema.index({ classId: 1, createdAt: -1 });

// Query helpers [Manish Regar]
noteSchema.statics.findBySubject = function (subject) {
  return this.find({ subject: new RegExp(subject, "i") }).sort({ createdAt: -1 });
};

noteSchema.statics.incrementDownload = function (noteId) {
  return this.findByIdAndUpdate(noteId, { $inc: { downloadCount: 1 } }, { new: true });
};

const noteModel = mongoose.model("Note", noteSchema);

module.exports = noteModel;
