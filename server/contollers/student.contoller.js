const studentModel = require("../models/student.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2;

const studentSignup = async (req, res) => {
 const { fullName, email, phone, password, course, currentYear } = req.body;

  try {
    // 1. Validate required fields
    if (!fullName || !email || !phone || !course || !currentYear || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2. Check if student already exists
    const studentExist = await studentModel.findOne({ email });
    if (studentExist) {
      return res.status(409).json({ message: "Student already exists" });
    }

    // 3. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // 4. Create new student
    const newStudent = await studentModel.create({
      fullName,
      email,
      phone,
      password: hashPassword,
      course,
      currentYear,
    });

    // 5. Generate JWT token
    const token = jwt.sign(
      { id: newStudent._id, email: newStudent.email },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    // 6. Set cookie securely
    res.cookie("StudentToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // only HTTPS in production
      sameSite: "Strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // 7. Send success response (excluding password)
    return res.status(201).json({
      message: "Student successfully registered",
      student: {
        _id: newStudent._id,
        fullName: newStudent.fullName,
        email: newStudent.email,
        phone: newStudent.phone,
        course: newStudent.course,
        currentYear: newStudent.currentYear,
      },
      token,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({
      message: "Internal Server Error in Student Signup",
      error: error.message,
    });
  }
};





const studentLogin = async(req,res) => {
    const { email, password } = req.body;

  try {
    // 1. Check student exists
    const studentExist = await studentModel.findOne({ email });
    if (!studentExist) {
      return res.status(404).json({ message: "Student doesn't exist" });
    }

    // 2. Verify password
    const checkPassword = await bcrypt.compare(password, studentExist.password);
    if (!checkPassword) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    // 3. Generate JWT token
    const token = jwt.sign(
      { id: studentExist._id, email: studentExist.email },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    // 4. Set cookie securely
    res.cookie("StudentToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // 5. Send success response (exclude password from response)
    const { password: pwd, ...studentWithoutPassword } = studentExist._doc;

    return res.status(200).json({
      message: "Student successfully logged in",
      student: studentWithoutPassword,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "Internal Server Error in Student login",
      error: error.message,
    });
  }
}


const studentsDetails = async(req,res) => {
    try{
        const studentId = req.studentId;

         // Check if StudentId is available (should be set by auth middleware)
    if (!studentId) {
      return res.status(401).json({ error: "Unauthorized: Student ID missing from token" });
    }

     // Fetch student without password field
    const student = await studentModel.findById(studentId).select("-password");


    // if student not found

    if(!student){
        res.status(404).json({message:"Stuednt Not Found"});
        return
    }

        return res.status(200).json({
      message: "Student details retrieved successfully",
      student,
    });

    }catch(error){
          console.error("Error fetching Student details:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
    });
    }
}



const studentProfileEdit = async (req, res) => {
  try {
    const userId = req.params?.id;
    const updatedData = req.body;

    // 1. Check if student exists
    const existingUser = await studentModel.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "Student not found" });
    }

    // 2. Handle profile image upload if file is provided
    if (req.files?.profileImage) {
      const file = req.files.profileImage;

      // Cloudinary will automatically detect and accept any image type
      const uploadResponse = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "user_profiles",
      });

      updatedData.profileImage = uploadResponse.secure_url;
    }

    // 3. Update student data
    const updatedStudent = await studentModel.findByIdAndUpdate(
      userId,
      updatedData,
      { new: true }
    );

    return res.status(200).json({
      message: "Profile updated successfully",
      student: updatedStudent,
    });
  } catch (err) {
    console.error("Error In Edit Student Profile:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};





const studentLogout = (req,res) => {
    try{
        res.clearCookie("StudentToken", {
            httpOnly:true,
            secure:true,
            sameSite:"None"
        });

        res.status(200).json({message:"Logged Out"});


    }catch(error){
        res.status(500).json({message:"Internal Server Error"}, error);
    }
}


module.exports = {studentSignup, studentLogin, studentsDetails, studentProfileEdit, studentLogout};