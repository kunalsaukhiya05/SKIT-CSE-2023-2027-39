const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "participants.userModel",
  },
  userModel: {
    type: String,
    required: true,
    enum: ["Student", "Teacher"],
  },
  userName: {
    type: String,
    required: true,
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
  leftAt: {
    type: Date,
  },
  durationSeconds: {
    type: Number,
    default: 0,
  },
});

const meetingSchema = new mongoose.Schema({
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true,
    index: true,
  },
  meetingCode: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  hostTeacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  subject: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["waiting", "active", "ended"],
    default: "waiting",
    index: true,
  },
  startTime: {
    type: Date,
  },
  endTime: {
    type: Date,
  },
  participants: [participantSchema],
  totalAttendeesCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Composite indexing for active meeting lookups
meetingSchema.index({ status: 1, startTime: -1 });
meetingSchema.index({ hostTeacherId: 1, createdAt: -1 });

const meetingModel = mongoose.model("Meeting", meetingSchema);

module.exports = meetingModel;
