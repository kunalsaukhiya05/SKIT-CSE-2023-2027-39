const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  otpHash: {
    type: String,
    required: true,
  },
  purpose: {
    type: String,
    enum: ["login", "registration", "password_reset"],
    default: "login",
  },
  role: {
    type: String,
    enum: ["student", "teacher"],
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600, // Document automatically deletes after 10 minutes (TTL index)
  },
});

// Fast lookup compound indexes
otpSchema.index({ phoneNumber: 1, createdAt: -1 });
otpSchema.index({ email: 1, createdAt: -1 });

const otpModel = mongoose.model("OTP", otpSchema);

module.exports = otpModel;
