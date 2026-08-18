const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["assignment", "class", "announcement", "grade", "resource", "system"],
    default: "system",
  },
  recipientType: {
    type: String,
    enum: ["student", "teacher", "all"],
    required: true,
  },
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    default: null,
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  senderName: {
    type: String,
    default: "System",
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  link: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

notificationSchema.index({ recipientId: 1, isRead: 1 });
notificationSchema.index({ recipientType: 1, createdAt: -1 });

const notificationModel = mongoose.model("Notification", notificationSchema);

module.exports = notificationModel;
