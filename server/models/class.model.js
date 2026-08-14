const mongoose = require("mongoose");

const ClassSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  subject: { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  date: { type: Date, required: true },
  duration: { type: Number, default: 60 }, // minutes
  roomId: { type: String },
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

const classModel = mongoose.model("Class", ClassSchema);

module.exports = classModel;
