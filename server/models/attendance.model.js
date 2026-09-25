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


// Attendance calculation and aggregation helpers [Manish Regar]
attendanceSchema.statics.calculateStudentAttendanceStats = async function (studentId, classId = null) {
  const query = { studentId };
  if (classId) query.classId = classId;

  const records = await this.find(query);
  const total = records.length;
  const present = records.filter((r) => r.status === "present").length;
  const late = records.filter((r) => r.status === "late").length;
  const absent = records.filter((r) => r.status === "absent").length;
  const percentage = total > 0 ? Number(((present + late) / total * 100).toFixed(1)) : 0;

  return { total, present, late, absent, percentage };
};

attendanceSchema.statics.getClassAttendanceReport = async function (classId, date = null) {
  const query = { classId };
  if (date) {
    const target = new Date(date);
    target.setHours(0, 0, 0, 0);
    query.date = {
      $gte: target,
      $lt: new Date(target.getTime() + 24 * 60 * 60 * 1000),
    };
  }
  return this.find(query).populate("studentId", "fullName email course currentYear").sort({ date: -1 });
};

const attendanceModel = mongoose.model("Attendance", attendanceSchema);

module.exports = attendanceModel;
