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


meetingSchema.index({ classId: 1, status: 1 });

// Participant tracking and duration aggregation methods [Manish Regar]
meetingSchema.methods.recordParticipantJoin = function (userId, userModel, userName) {
  const existing = this.participants.find(
    (p) => p.userId.toString() === userId.toString() && !p.leftAt
  );
  if (!existing) {
    this.participants.push({
      userId,
      userModel,
      userName,
      joinedAt: new Date(),
    });
    this.totalAttendeesCount = this.participants.length;
  }
  return this.save();
};

meetingSchema.methods.recordParticipantLeave = function (userId, leftTime = new Date()) {
  const participant = this.participants.find(
    (p) => p.userId.toString() === userId.toString() && !p.leftAt
  );
  if (participant) {
    participant.leftAt = leftTime;
    participant.durationSeconds = Math.max(
      0,
      Math.round((new Date(leftTime) - new Date(participant.joinedAt)) / 1000)
    );
  }
  return this.save();
};

meetingSchema.statics.findActiveByMeetingCode = function (meetingCode) {
  return this.findOne({ meetingCode, status: "active" }).populate(
    "hostTeacherId",
    "fullName email subjectSpecialization"
  );
};

const meetingModel = mongoose.model("Meeting", meetingSchema);

module.exports = meetingModel;
