const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
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
  status: {
    type: String,
    enum: ["present", "absent", "late"],
    default: "present",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  markedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
  },
});

attendanceSchema.index({ classId: 1, date: 1 });
attendanceSchema.index({ studentId: 1 });
attendanceSchema.index({ classId: 1, studentId: 1, date: 1 }, { unique: true });

const attendanceModel = mongoose.model("Attendance", attendanceSchema);

module.exports = attendanceModel;
