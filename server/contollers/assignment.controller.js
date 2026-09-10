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

// Submit assignment (Student only)
const submitAssignment = async (req, res) => {
  try {
    const studentId = req.studentId;
    const { assignmentId, submissionText, studentName } = req.body;

    if (!assignmentId) {
      return res.status(400).json({ message: "Assignment ID is required" });
    }

    // Check if assignment exists
    const assignment = await assignmentModel.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    // Check if already submitted
    const existingSubmission = await submissionModel.findOne({
      assignmentId,
      studentId,
    });

    if (existingSubmission) {
      return res.status(409).json({ message: "You have already submitted this assignment" });
    }

    let fileUrl = "";
    let fileName = "";

    if (req.files?.file) {
      const file = req.files.file;
      const uploadResponse = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "submissions",
        resource_type: "auto",
      });
      fileUrl = uploadResponse.secure_url;
      fileName = file.name;
    }

    // Check if submission is late
    const isLate = new Date() > new Date(assignment.deadline);

    const submission = await submissionModel.create({
      assignmentId,
      studentId,
      studentName: studentName || "Student",
      submissionText: submissionText || "",
      fileUrl,
      fileName,
      status: isLate ? "late" : "submitted",
    });

    return res.status(201).json({
      message: isLate ? "Assignment submitted (late)" : "Assignment submitted successfully",
      submission,
    });
  } catch (err) {
    console.error("Error submitting assignment:", err);
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
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

// Grade a submission (Teacher)
const gradeSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { grade, marks, feedback } = req.body;

    const submission = await submissionModel.findByIdAndUpdate(
      submissionId,
      {
        grade,
        marks,
        feedback,
        status: "graded",
        gradedAt: new Date(),
      },
      { new: true }
    );

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    // Notify student about grade
    await notificationModel.create({
      title: "Assignment Graded",
      message: `Your assignment has been graded. Grade: ${grade}${marks ? `, Marks: ${marks}` : ""}`,
      type: "grade",
      recipientType: "student",
      recipientId: submission.studentId,
    });

    return res.status(200).json({
      message: "Submission graded successfully",
      submission,
    });
  } catch (err) {
    console.error("Error grading submission:", err);
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
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

module.exports = {
  createAssignment,
  getAssignments,
  getAssignmentById,
  submitAssignment,
  getSubmissions,
  getStudentSubmissions,
  gradeSubmission,
  deleteAssignment,
};
