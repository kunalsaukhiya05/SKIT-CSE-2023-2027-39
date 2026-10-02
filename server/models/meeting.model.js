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


// Live Meeting Lifecycle & Status Management [Manish Regar]
meetingSchema.methods.endMeeting = function (endTime = new Date()) {
  this.status = "ended";
  this.endTime = endTime;

  // Finalize all open participants who haven't logged leftAt
  this.participants.forEach((p) => {
    if (!p.leftAt) {
      p.leftAt = endTime;
      p.durationSeconds = Math.max(0, Math.round((new Date(endTime) - new Date(p.joinedAt)) / 1000));
    }
  });

  return this.save();
};

meetingSchema.statics.getMeetingSummary = async function (meetingCode) {
  const meeting = await this.findOne({ meetingCode }).populate("hostTeacherId", "fullName email");
  if (!meeting) return null;

  const totalDuration = meeting.endTime && meeting.startTime
    ? Math.round((new Date(meeting.endTime) - new Date(meeting.startTime)) / 1000)
    : 0;

  return {
    meetingCode: meeting.meetingCode,
    title: meeting.title,
    status: meeting.status,
    totalAttendees: meeting.participants.length,
    totalDurationSeconds: totalDuration,
  };
};


// Meeting duration metrics and participant aggregation [Manish Regar]
meetingSchema.methods.calculateAverageAttendanceDuration = function () {
  if (!this.participants || this.participants.length === 0) return 0;
  const totalDuration = this.participants.reduce((acc, p) => acc + (p.durationSeconds || 0), 0);
  return Math.round(totalDuration / this.participants.length);
};

meetingSchema.methods.getEligibleAttendeesForAttendance = function (minDurationSeconds = 600) {
  return this.participants
    .filter((p) => (p.durationSeconds || 0) >= minDurationSeconds && p.userModel === "Student")
    .map((p) => ({
      studentId: p.userId,
      studentName: p.userName,
      status: "present",
      durationSeconds: p.durationSeconds,
    }));
};

const meetingModel = mongoose.model("Meeting", meetingSchema);

module.exports = meetingModel;
