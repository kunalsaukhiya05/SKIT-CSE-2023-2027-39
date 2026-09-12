const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
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
  subjectSpecialization: {
    type: String,
    required: true,
  },
  profileImage:{
    type:String,
    // default:"https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
  },
  role: {
    type: String,
    enum: ["teacher"],
    default: "teacher",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


// Compound indexes for fast query resolution
teacherSchema.index({ email: 1, phone: 1 });
teacherSchema.index({ subjectSpecialization: 1 });
teacherSchema.index({ role: 1 });

// Multi-field credential lookup helper
teacherSchema.statics.findByCredentials = function (identifier) {
  return this.findOne({
    $or: [{ email: identifier }, { phone: isNaN(identifier) ? undefined : Number(identifier) }],
  });
};

// Instance method to check profile completeness
teacherSchema.methods.isProfileComplete = function () {
  return Boolean(this.fullName && this.email && this.phone && this.subjectSpecialization);
};

const teacherModel = mongoose.model("Teacher", teacherSchema);

module.exports =  teacherModel;
