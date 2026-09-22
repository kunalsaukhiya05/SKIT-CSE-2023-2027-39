const mongoose = require("mongoose");

const ClassSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  subject: { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  date: { type: Date, required: true },
  duration: { type: Number, default: 60 }, // minutes
  roomId: { type: String },
  maxCapacity: { type: Number, default: 100 },
  isLive: { type: Boolean, default: false },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
  },
  teacherName: { type: String, required: true },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  }],
  status: {
    type: String,
    enum: ["scheduled", "live", "completed", "cancelled"],
    default: "scheduled",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

ClassSchema.index({ teacherId: 1 });
ClassSchema.index({ date: -1 });
ClassSchema.index({ status: 1 });


ClassSchema.index({ teacherId: 1, status: 1 });

// Classroom enrollment methods [Manish Regar]
ClassSchema.methods.isStudentEnrolled = function (studentId) {
  return this.students.some((id) => id.toString() === studentId.toString());
};

ClassSchema.methods.enrollStudent = function (studentId) {
  if (this.isStudentEnrolled(studentId)) {
    return { success: false, message: "Student is already enrolled in this class" };
  }
  if (this.students.length >= (this.maxCapacity || 100)) {
    return { success: false, message: "Classroom capacity reached" };
  }
  this.students.push(studentId);
  return { success: true, message: "Student enrolled successfully" };
};


// Active session tracking and status transitions [Manish Regar]
ClassSchema.methods.startLiveSession = function () {
  this.status = "live";
  this.isLive = true;
  this.updatedAt = new Date();
  return this.save();
};

ClassSchema.methods.endLiveSession = function () {
  this.status = "completed";
  this.isLive = false;
  this.updatedAt = new Date();
  return this.save();
};

ClassSchema.index({ status: 1, date: -1 });

const classModel = mongoose.model("Class", ClassSchema);

module.exports = classModel;
