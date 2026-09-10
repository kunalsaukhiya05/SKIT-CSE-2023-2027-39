const adminModel = require("../models/admin.model");
const studentModel = require("../models/student.model");
const teacherModel = require("../models/teacher.model");
const classModel = require("../models/class.model");
const assignmentModel = require("../models/assignment.model");
const submissionModel = require("../models/submission.model");
const attendanceModel = require("../models/attendance.model");
const resourceModel = require("../models/resource.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Admin Login
const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await adminModel.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const checkPassword = await bcrypt.compare(password, admin.password);
    if (!checkPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: "admin" },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    res.cookie("AdminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    const { password: pwd, ...adminData } = admin._doc;
    return res.status(200).json({
      message: "Admin logged in successfully",
      admin: adminData,
      token,
    });
  } catch (err) {
    console.error("Admin login error:", err);
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

// Admin Signup (should be restricted in production)
const adminSignup = async (req, res) => {
  const { fullName, email, phone, password } = req.body;
  try {
    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await adminModel.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Admin already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newAdmin = await adminModel.create({
      fullName,
      email,
      phone,
      password: hashPassword,
    });

    const token = jwt.sign(
      { id: newAdmin._id, email: newAdmin.email, role: "admin" },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    res.cookie("AdminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    const { password: pwd, ...adminData } = newAdmin._doc;
    return res.status(201).json({
      message: "Admin registered successfully",
      admin: adminData,
      token,
    });
  } catch (err) {
    console.error("Admin signup error:", err);
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

// Admin Logout
const adminLogout = (req, res) => {
  try {
    res.clearCookie("AdminToken", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    res.status(200).json({ message: "Admin logged out" });
  } catch (err) {
    res.status(500).json({ message: "Error in admin logout" });
  }
};

// Dashboard Statistics
const getDashboardStats = async (req, res) => {
  try {
    const [
      totalStudents,
      totalTeachers,
      totalClasses,
      totalAssignments,
      totalResources,
      totalSubmissions,
    ] = await Promise.all([
      studentModel.countDocuments(),
      teacherModel.countDocuments(),
      classModel.countDocuments(),
      assignmentModel.countDocuments(),
      resourceModel.countDocuments(),
      submissionModel.countDocuments(),
    ]);

    // Recent activity — last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [recentStudents, recentClasses, recentAssignments] = await Promise.all([
      studentModel.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      classModel.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      assignmentModel.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
    ]);

    // Attendance statistics
    const attendanceStats = await attendanceModel.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Submission statistics
    const submissionStats = await submissionModel.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Classes by status
    const classStats = await classModel.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    return res.status(200).json({
      message: "Dashboard stats fetched successfully",
      stats: {
        totalStudents,
        totalTeachers,
        totalClasses,
        totalAssignments,
        totalResources,
        totalSubmissions,
        recentStudents,
        recentClasses,
        recentAssignments,
        attendanceStats,
        submissionStats,
        classStats,
      },
    });
  } catch (err) {
    console.error("Error fetching dashboard stats:", err);
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

// Get all students
const getAllStudents = async (req, res) => {
  try {
    const students = await studentModel.find().select("-password").sort({ createdAt: -1 });
    return res.status(200).json({ message: "Students fetched", students });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

// Get all teachers
const getAllTeachers = async (req, res) => {
  try {
    const teachers = await teacherModel.find().select("-password").sort({ createdAt: -1 });
    return res.status(200).json({ message: "Teachers fetched", teachers });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

// Delete a user (student or teacher)
const deleteUser = async (req, res) => {
  try {
    const { id, role } = req.params;

    if (role === "student") {
      await studentModel.findByIdAndDelete(id);
    } else if (role === "teacher") {
      await teacherModel.findByIdAndDelete(id);
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    return res.status(200).json({ message: `${role} deleted successfully` });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

// Analytics — Student Performance
const getStudentPerformance = async (req, res) => {
  try {
    // Average grades per student
    const performance = await submissionModel.aggregate([
      { $match: { status: "graded", marks: { $ne: null } } },
      {
        $group: {
          _id: "$studentId",
          studentName: { $first: "$studentName" },
          averageMarks: { $avg: "$marks" },
          totalSubmissions: { $sum: 1 },
          gradedCount: { $sum: 1 },
        },
      },
      { $sort: { averageMarks: -1 } },
    ]);

    return res.status(200).json({
      message: "Student performance fetched",
      performance,
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

// Analytics — Attendance Overview
const getAttendanceAnalytics = async (req, res) => {
  try {
    const overview = await attendanceModel.aggregate([
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            status: "$status",
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.date": -1 } },
      { $limit: 100 },
    ]);

    const studentAttendance = await attendanceModel.aggregate([
      {
        $group: {
          _id: "$studentId",
          studentName: { $first: "$studentName" },
          total: { $sum: 1 },
          present: {
            $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] },
          },
          absent: {
            $sum: { $cond: [{ $eq: ["$status", "absent"] }, 1, 0] },
          },
          late: {
            $sum: { $cond: [{ $eq: ["$status", "late"] }, 1, 0] },
          },
        },
      },
      {
        $addFields: {
          percentage: {
            $round: [
              { $multiply: [{ $divide: [{ $add: ["$present", "$late"] }, "$total"] }, 100] },
              1,
            ],
          },
        },
      },
      { $sort: { percentage: -1 } },
    ]);

    return res.status(200).json({
      message: "Attendance analytics fetched",
      overview,
      studentAttendance,
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

module.exports = {
  adminLogin,
  adminSignup,
  adminLogout,
  getDashboardStats,
  getAllStudents,
  getAllTeachers,
  deleteUser,
  getStudentPerformance,
  getAttendanceAnalytics,
};
