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

const studentModel = mongoose.model("Student", studentSchema);

module.exports = studentModel;
