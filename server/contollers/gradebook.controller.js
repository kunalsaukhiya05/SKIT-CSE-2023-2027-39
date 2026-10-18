const gradebookModel = require("../models/gradebook.model");
const quizAttemptModel = require("../models/quizAttempt.model");
const submissionModel = require("../models/submission.model");

// Sync gradebook from quiz attempts and assignment submissions [Rishabh Jain]
const syncGradebook = async (req, res) => {
  try {
    const { classId, subject, teacherId } = req.body;

    if (!classId || !subject || !teacherId) {
      return res.status(400).json({ message: "classId, subject, and teacherId are required" });
    }

    // Fetch all quiz attempts for this class [Rishabh Jain]
    const quizAttempts = await quizAttemptModel
      .find({ classId })
      .populate("quizId", "title subject classId");

    // Fetch all assignment submissions for this class [Rishabh Jain]
    const submissions = await submissionModel.find({ classId }).lean();

    // Group by student
    const studentMap = {};

    for (const attempt of quizAttempts) {
      const sid = attempt.studentId;
      if (!studentMap[sid]) {
        studentMap[sid] = { studentId: sid, studentName: attempt.studentName, quizScores: [], assignmentScores: [] };
      }
      studentMap[sid].quizScores.push({
        quizId: attempt.quizId?._id?.toString(),
        quizTitle: attempt.quizId?.title || "Quiz",
        score: attempt.score,
        totalMarks: attempt.totalMarks,
        percentage: attempt.percentage,
        attemptedAt: attempt.submittedAt,
      });
    }

    for (const sub of submissions) {
      const sid = sub.studentId;
      if (!studentMap[sid]) {
        studentMap[sid] = { studentId: sid, studentName: sub.studentName || "Student", quizScores: [], assignmentScores: [] };
      }
      if (sub.grade !== undefined && sub.totalMarks) {
        studentMap[sid].assignmentScores.push({
          assignmentId: sub.assignmentId?.toString(),
          assignmentTitle: sub.assignmentTitle || "Assignment",
          score: sub.grade,
          totalMarks: sub.totalMarks,
          gradedAt: sub.gradedAt || sub.updatedAt,
        });
      }
    }

    // Upsert gradebook entries [Rishabh Jain]
    const results = [];
    for (const sid of Object.keys(studentMap)) {
      const data = studentMap[sid];
      const entry = await gradebookModel.findOneAndUpdate(
        { studentId: sid, classId, subject },
        {
          $set: {
            studentName: data.studentName,
            teacherId,
            subject,
            classId,
            quizScores: data.quizScores,
            assignmentScores: data.assignmentScores,
          },
        },
        { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
      );
      results.push(entry);
    }

    return res.status(200).json({ message: "Gradebook synced successfully", count: results.length });
  } catch (err) {
    console.error("Error syncing gradebook:", err);
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

// Get full gradebook for a class and subject (Teacher view) [Rishabh Jain]
const getClassGradebook = async (req, res) => {
  try {
    const { classId, subject } = req.query;
    if (!classId) {
      return res.status(400).json({ message: "classId is required" });
    }

    const query = { classId };
    if (subject) query.subject = subject;

    const entries = await gradebookModel
      .find(query)
      .sort({ overallPercentage: -1 })
      .lean();

    return res.status(200).json({ message: "Gradebook fetched", entries });
  } catch (err) {
    console.error("Error fetching class gradebook:", err);
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

// Get a student's own gradebook across all subjects [Rishabh Jain]
const getStudentGradebook = async (req, res) => {
  try {
    const studentId = req.studentId;

    const entries = await gradebookModel
      .find({ studentId })
      .sort({ subject: 1 })
      .lean();

    // Compute overall across all subjects
    const overalls = entries.map((e) => e.overallPercentage);
    const cumulative =
      overalls.length > 0
        ? Math.round(overalls.reduce((s, p) => s + p, 0) / overalls.length)
        : 0;

    return res.status(200).json({
      message: "Student gradebook fetched",
      entries,
      cumulativePercentage: cumulative,
    });
  } catch (err) {
    console.error("Error fetching student gradebook:", err);
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

// Update attendance percentage for a student in a class [Rishabh Jain]
const updateAttendance = async (req, res) => {
  try {
    const { studentId, classId, subject, attendancePercent } = req.body;

    if (!studentId || !classId || !subject || attendancePercent === undefined) {
      return res.status(400).json({ message: "studentId, classId, subject, and attendancePercent are required" });
    }

    const entry = await gradebookModel.findOneAndUpdate(
      { studentId, classId, subject },
      { $set: { attendancePercent, lastUpdated: new Date() } },
      { new: true, upsert: true }
    );

    return res.status(200).json({ message: "Attendance updated", entry });
  } catch (err) {
    console.error("Error updating attendance:", err);
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

module.exports = {
  syncGradebook,
  getClassGradebook,
  getStudentGradebook,
  updateAttendance,
};
