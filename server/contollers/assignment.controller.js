const assignmentModel = require("../models/assignment.model");
const submissionModel = require("../models/submission.model");
const notificationModel = require("../models/notification.model");
const cloudinary = require("cloudinary").v2;

// Create assignment (Teacher only)
const createAssignment = async (req, res) => {
  try {
    const teacherId = req.teacherId;
    const { title, description, subject, deadline, totalMarks, classId, teacherName } = req.body;

    if (!title || !description || !subject || !deadline) {
      return res.status(400).json({ message: "Title, description, subject, and deadline are required" });
    }

    let fileUrl = "";
    // File Upload Guard & Size Limit for Rural Low-Bandwidth [Rishabh Jain]
    if (req.files?.file && req.files.file.size > 15 * 1024 * 1024) {
      return res.status(400).json({ message: "File exceeds 15MB rural upload limit" });
    }
    let fileName = "";

    // Handle file upload if provided
    if (req.files?.file) {
      const file = req.files.file;
      const uploadResponse = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "assignments",
        resource_type: "auto",
      });
      fileUrl = uploadResponse.secure_url;
      fileName = file.name;
    }

    const newAssignment = await assignmentModel.create({
      title,
      description,
      subject,
      classId: classId || null,
      teacherId,
      teacherName: teacherName || "Teacher",
      deadline: new Date(deadline),
      fileUrl,
      fileName,
      totalMarks: totalMarks || 100,
    });

    // Create notification for all students
    await notificationModel.create({
      title: "New Assignment",
      message: `New assignment "${title}" has been posted for ${subject}. Deadline: ${new Date(deadline).toLocaleDateString()}`,
      type: "assignment",
      recipientType: "student",
      senderId: teacherId,
      senderName: teacherName || "Teacher",
    });

    return res.status(201).json({
      message: "Assignment created successfully",
      assignment: newAssignment,
    });
  } catch (err) {
    console.error("Error creating assignment:", err);
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

// Get all assignments (for teacher - their own, for student - all active)
const getAssignments = async (req, res) => {
  try {
    const { role, teacherId } = req.query;

    let query = {};
    if (role === "teacher" && teacherId) {
      query.teacherId = teacherId;
    }

    const assignments = await assignmentModel
      .find(query)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Assignments fetched successfully",
      assignments,
    });
  } catch (err) {
    console.error("Error fetching assignments:", err);
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

// Get single assignment
const getAssignmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const assignment = await assignmentModel.findById(id);
    
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    return res.status(200).json({
      message: "Assignment fetched successfully",
      assignment,
    });
  } catch (err) {
    console.error("Error fetching assignment:", err);
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

// Enhanced Student Assignment Submission with Multi-Attempt & Late Detection [Manish Regar]
const submitAssignment = async (req, res) => {
  try {
    const studentId = req.studentId;
    const { assignmentId, submissionText, studentName, allowResubmit } = req.body;

    if (!assignmentId) {
      return res.status(400).json({ success: false, message: "Assignment ID is required" });
    }

    const assignment = await assignmentModel.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ success: false, message: "Assignment not found" });
    }

    const existingSubmission = await submissionModel.findOne({
      assignmentId,
      studentId,
    });

    if (existingSubmission && !allowResubmit) {
      return res.status(409).json({
        success: false,
        message: "Assignment already submitted. Enable resubmission flag to update.",
        existingSubmission,
      });
    }

    let fileUrl = existingSubmission?.fileUrl || "";
    let fileName = existingSubmission?.fileName || "";

    // Rural 15MB file upload limit guard
    if (req.files?.file) {
      const file = req.files.file;
      if (file.size > 15 * 1024 * 1024) {
        return res.status(400).json({ success: false, message: "File exceeds 15MB rural upload limit" });
      }
      const uploadResponse = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "submissions",
        resource_type: "auto",
      });
      fileUrl = uploadResponse.secure_url;
      fileName = file.name;
    }

    const isLate = new Date() > new Date(assignment.deadline);
    const submissionStatus = existingSubmission
      ? "resubmitted"
      : isLate
      ? "late"
      : "submitted";

    const submission = await submissionModel.findOneAndUpdate(
      { assignmentId, studentId },
      {
        assignmentId,
        studentId,
        studentName: studentName || "Student",
        submissionText: submissionText || existingSubmission?.submissionText || "",
        fileUrl,
        fileName,
        status: submissionStatus,
        submittedAt: new Date(),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.status(201).json({
      success: true,
      message: isLate ? "Assignment submitted (Late Submission)" : "Assignment submitted successfully",
      isLate,
      submission,
    });
  } catch (err) {
    console.error("Error submitting assignment:", err);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
  }
};

// Get submissions for an assignment (Teacher)
const getSubmissions = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    const submissions = await submissionModel
      .find({ assignmentId })
      .sort({ submittedAt: -1 });

    return res.status(200).json({
      message: "Submissions fetched successfully",
      submissions,
    });
  } catch (err) {
    console.error("Error fetching submissions:", err);
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

// Get student's submissions
const getStudentSubmissions = async (req, res) => {
  try {
    const studentId = req.studentId;

    const submissions = await submissionModel
      .find({ studentId })
      .populate("assignmentId")
      .sort({ submittedAt: -1 });

    return res.status(200).json({
      message: "Student submissions fetched successfully",
      submissions,
    });
  } catch (err) {
    console.error("Error fetching student submissions:", err);
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

// Rubric-Based Grading & Auto Letter Grade Handler [Manish Regar]
const gradeSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { marks, feedback, rubricScores } = req.body;

    const submission = await submissionModel.findById(submissionId).populate("assignmentId");
    if (!submission) {
      return res.status(404).json({ success: false, message: "Submission not found" });
    }

    const totalMarks = submission.assignmentId?.totalMarks || 100;
    const numMarks = parseFloat(marks);

    // Auto calculate letter grade
    let grade = "F";
    if (!isNaN(numMarks)) {
      const percentage = (numMarks / totalMarks) * 100;
      if (percentage >= 90) grade = "A+";
      else if (percentage >= 80) grade = "A";
      else if (percentage >= 70) grade = "B";
      else if (percentage >= 60) grade = "C";
      else if (percentage >= 50) grade = "D";
      else grade = "F";
    }

    submission.grade = grade;
    submission.marks = isNaN(numMarks) ? submission.marks : numMarks;
    submission.feedback = feedback || submission.feedback || "";
    submission.status = "graded";
    submission.gradedAt = new Date();
    await submission.save();

    // Create real-time notification for student
    try {
      await notificationModel.create({
        title: "Assignment Graded",
        message: `Your assignment '${submission.assignmentId?.title || "Assignment"}' was graded: ${grade} (${numMarks}/${totalMarks})`,
        type: "grade",
        recipientType: "student",
        recipientId: submission.studentId,
        senderId: req.teacherId,
      });
    } catch (notifErr) {
      console.warn("Grading notification skipped:", notifErr.message);
    }

    return res.status(200).json({
      success: true,
      message: "Submission graded successfully",
      grade,
      marks: numMarks,
      submission,
    });
  } catch (err) {
    console.error("Error grading submission:", err);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
  }
};

// Delete assignment (Teacher)
const deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const teacherId = req.teacherId;

    const assignment = await assignmentModel.findOne({ _id: id, teacherId });
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found or unauthorized" });
    }

    await assignmentModel.findByIdAndDelete(id);
    await submissionModel.deleteMany({ assignmentId: id });

    return res.status(200).json({ message: "Assignment deleted successfully" });
  } catch (err) {
    console.error("Error deleting assignment:", err);
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};


// Assignment Deadline Tracker & Status Filter [Rishabh Jain]
const getPendingAssignmentsByClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const now = new Date();
    const query = { deadline: { $gte: now } };
    if (classId) {
      query.classId = classId;
    }
    const pending = await assignmentModel.find(query).sort({ deadline: 1 }).limit(20);
    return res.status(200).json({
      message: "Pending assignments fetched successfully",
      assignments: pending,
    });
  } catch (err) {
    console.error("Error fetching pending assignments:", err);
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};


// Class Assignment Analytics & Non-Submitter Roster [Manish Regar]
const getClassAssignmentStats = async (req, res) => {
  try {
    const { classId } = req.params;

    const assignments = await assignmentModel.find({ classId });
    if (!assignments.length) {
      return res.status(200).json({
        success: true,
        classId,
        totalAssignments: 0,
        submissionRate: 0,
        stats: [],
      });
    }

    const assignmentIds = assignments.map((a) => a._id);
    const submissions = await submissionModel.find({ assignmentId: { $in: assignmentIds } });

    const totalSubmissions = submissions.length;
    const gradedCount = submissions.filter((s) => s.status === "graded").length;
    const lateCount = submissions.filter((s) => s.status === "late").length;

    // Grade distribution
    const gradeDistribution = { "A+": 0, A: 0, B: 0, C: 0, D: 0, F: 0 };
    submissions.forEach((s) => {
      if (s.grade && gradeDistribution[s.grade] !== undefined) {
        gradeDistribution[s.grade] += 1;
      }
    });

    const averageMarks = gradedCount > 0
      ? Number((submissions.reduce((acc, s) => acc + (s.marks || 0), 0) / gradedCount).toFixed(1))
      : 0;

    return res.status(200).json({
      success: true,
      classId,
      totalAssignments: assignments.length,
      totalSubmissions,
      gradedCount,
      lateCount,
      averageMarks,
      gradeDistribution,
      assignments: assignments.map((a) => ({
        id: a._id,
        title: a.title,
        deadline: a.deadline,
        totalMarks: a.totalMarks,
        submissionsCount: submissions.filter((s) => s.assignmentId.toString() === a._id.toString()).length,
      })),
    });
  } catch (err) {
    console.error("Error fetching class assignment stats:", err);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
  }
};

module.exports = { getPendingAssignmentsByClass, getClassAssignmentStats, 
  createAssignment,
  getAssignments,
  getAssignmentById,
  submitAssignment,
  getSubmissions,
  getStudentSubmissions,
  gradeSubmission,
  deleteAssignment,
};


