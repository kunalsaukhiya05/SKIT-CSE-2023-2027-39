const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  password:{
    type:String,
    required:true
  },
  course: {
    type: String,
    required: true,
  },
  currentYear: {
    type: Number, // Example: 1, 2, 3, 4
    required: true,
  },
  profileImage:{
    type:String,
    // default:"https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
  },
  role: {
    type: String,
    enum: ["student"],
    default: "student",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


// Compound indexes for fast query resolution
studentSchema.index({ email: 1, phone: 1 });
studentSchema.index({ course: 1, currentYear: 1 });
studentSchema.index({ role: 1 });

// Multi-field credential lookup helper
studentSchema.statics.findByCredentials = function (identifier) {
  return this.findOne({
    $or: [{ email: identifier }, { phone: isNaN(identifier) ? undefined : Number(identifier) }],
  });
};

// Instance method to check profile completeness
studentSchema.methods.isProfileComplete = function () {
  return Boolean(this.fullName && this.email && this.phone && this.course && this.currentYear);
};

const studentModel = mongoose.model("Student", studentSchema);

module.exports = studentModel;
