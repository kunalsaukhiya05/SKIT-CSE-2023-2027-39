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

const teacherModel = mongoose.model("Teacher", teacherSchema);

module.exports =  teacherModel;
