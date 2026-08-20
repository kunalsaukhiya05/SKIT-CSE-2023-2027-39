const teacherModel = require("../models/teacher.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2


const teacherSignup = async (req,res) => {
    const { fullName, email, phone, password, subjectSpecialization } = req.body;

  try {
    // 1. Validate fields
    if (!fullName || !email || !phone || !subjectSpecialization || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2. Check if teacher exists
    const teacherExist = await teacherModel.findOne({ email });
    if (teacherExist) {
      return res.status(409).json({ message: "Teacher already exists" });
    }

    // 3. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // 4. Create new teacher
    const newTeacher = await teacherModel.create({
      fullName,
      email,
      phone,
      password: hashPassword,
      subjectSpecialization,
    });

    // 5. Generate JWT token
    const token = jwt.sign(
      { id: newTeacher._id, email: newTeacher.email },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    // 6. Set cookie securely
    res.cookie("TeacherToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // only in HTTPS
      sameSite: "Strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // 7. Remove password from response
    const { password: pwd, ...teacherWithoutPassword } = newTeacher._doc;

    return res.status(201).json({
      message: "Teacher successfully registered",
      teacher: teacherWithoutPassword,
      token,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({
      message: "Internal Server Error in Teacher Signup",
      error: error.message,
    });
  }
}


const teacherLogin = async (req,res) => {
    const { email, password } = req.body;

  try {
    // 1. Check teacher exists
    const teacherExist = await teacherModel.findOne({ email });
    if (!teacherExist) {
      return res.status(404).json({ message: "Teacher doesn't exist" });
    }

    // 2. Verify password
    const checkPassword = await bcrypt.compare(password, teacherExist.password);
    if (!checkPassword) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    // 3. Generate JWT
    const token = jwt.sign(
      { id: teacherExist._id, email: teacherExist.email },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    // 4. Set cookie securely
    res.cookie("TeacherToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // 5. Remove password from response
    const { password: pwd, ...teacherWithoutPassword } = teacherExist._doc;

    return res.status(200).json({
      message: "Teacher successfully logged in",
      teacher: teacherWithoutPassword,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "Internal Server Error in Teacher login",
      error: error.message,
    });
  }
}


const teacherDetails = async (req,res) => {
    try{
        const teacherId = req.teacherId;

        if(!teacherId){
            return res.status(401).json({ error: "Unauthorized: Teacher ID missing from token" });
        }

           // Fetch student without password field
    const teacher = await teacherModel.findById(teacherId).select("-password");

 // if student not found

    if(!teacher){
        res.status(404).json({message:"Teacher Not Found"});
        return
    }

        return res.status(200).json({
      message: "Teacher details retrieved successfully",
      teacher,
    });


    }catch(err){
        console.error("Error Fetching Teacher Deatils", err);
        return res.status(500).json({error:"internal server error", detail:err.message});
    }
}



const teacherProfileEdit = async (req, res) => {
  try {
    const userId = req.params?.id;
    const updatedData = req.body;

    // 1. Check if teacher exists
    const existingUser = await teacherModel.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // 2. Handle profile image upload if file is provided
    if (req.files?.profileImage) {
      const file = req.files.profileImage;

      //  No format restriction — Cloudinary will handle all image formats
      const uploadResponse = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "teacher_profiles",
      });

      updatedData.profileImage = uploadResponse.secure_url;
    }

    // 3. Update teacher data
    const updatedTeacher = await teacherModel.findByIdAndUpdate(
      userId,
      updatedData,
      { new: true }
    );

    return res.status(200).json({
      message: "Profile updated successfully",
      teacher: updatedTeacher,
    });
  } catch (err) {
    console.error("Error in teacherProfileEdit:", err);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};





const teacherLogout = (req,res) => {
    try{
        res.clearCookie("TeacherToken", {
             httpOnly:true,
            secure:true,
            sameSite:"None"
        })

        res.status(200).json({message:"Logged Out"});

    }catch(error){
        res.status(500).json({message:"Error In Teacher logout"}, error);
    }
}

module.exports = {teacherSignup, teacherLogin, teacherDetails,teacherProfileEdit , teacherLogout};