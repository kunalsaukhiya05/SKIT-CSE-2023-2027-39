/**
 * analytics.controller.js
 * Provides aggregated analytics for teachers and admins:
 *   - Classroom engagement metrics
 *   - Quiz performance trends over time
 *   - Attendance heatmap data
 *   - Assignment submission rates
 * Week 13 — Rishabh Jain | Remote Classroom for Rural Colleges
 */

const QuizAttempt = require("../models/quizAttempt.model");
const Attendance = require("../models/attendance.model");
const Assignment = require("../models/assignment.model");
const Submission = require("../models/submission.model");
const GradebookEntry = require("../models/gradebook.model");
const Classroom = require("../models/class.model");

/**
 * GET /api/analytics/classroom/:classroomId/engagement
 * Returns weekly engagement score: average quiz score, attendance %, submission rate.
 */
const getClassroomEngagement = async (req, res) => {
  try {
    const { classroomId } = req.params;

    const classroom = await Classroom.findById(classroomId).lean();
    if (!classroom) {
      return res.status(404).json({ message: "Classroom not found" });
    }

    // Average quiz score across all attempts in this classroom
    const quizAgg = await QuizAttempt.aggregate([
      { $match: { classroom: classroom._id } },
      {
        $group: {
          _id: null,
          avgScore: { $avg: "$score" },
          totalAttempts: { $sum: 1 },
        },
      },
    ]);

    // Attendance percentage
    const attendanceAgg = await Attendance.aggregate([
      { $match: { classroom: classroom._id } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          present: {
            $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] },
          },
        },
      },
    ]);

    // Assignment submission rate
    const totalAssignments = await Assignment.countDocuments({
      classroom: classroom._id,
    });

    const avgScore =
      quizAgg.length > 0 ? Math.round(quizAgg[0].avgScore * 10) / 10 : 0;
    const attendancePct =
      attendanceAgg.length > 0
        ? Math.round(
            (attendanceAgg[0].present / attendanceAgg[0].total) * 100
          )
        : 0;

    res.json({
      classroomId,
      classroomName: classroom.name,
      avgQuizScore: avgScore,
      totalQuizAttempts: quizAgg.length > 0 ? quizAgg[0].totalAttempts : 0,
      attendancePercent: attendancePct,
      totalAssignments,
    });
  } catch (err) {
    console.error("[analytics] getClassroomEngagement error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /api/analytics/classroom/:classroomId/quiz-trend
 * Returns quiz score trend grouped by week (ISO week).
 */
const getQuizScoreTrend = async (req, res) => {
  try {
    const { classroomId } = req.params;

    const trend = await QuizAttempt.aggregate([
      { $match: { classroom: require("mongoose").Types.ObjectId(classroomId) } },
      {
        $group: {
          _id: {
            year: { $isoWeekYear: "$createdAt" },
            week: { $isoWeek: "$createdAt" },
          },
          avgScore: { $avg: "$score" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.week": 1 } },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          week: "$_id.week",
          avgScore: { $round: ["$avgScore", 1] },
          count: 1,
        },
      },
    ]);

    res.json({ classroomId, trend });
  } catch (err) {
    console.error("[analytics] getQuizScoreTrend error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /api/analytics/classroom/:classroomId/attendance-heatmap
 * Returns attendance counts per day-of-week for heatmap rendering.
 */
const getAttendanceHeatmap = async (req, res) => {
  try {
    const { classroomId } = req.params;

    const heatmap = await Attendance.aggregate([
      { $match: { classroom: require("mongoose").Types.ObjectId(classroomId) } },
      {
        $group: {
          _id: { dayOfWeek: { $dayOfWeek: "$date" } },
          present: {
            $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] },
          },
          total: { $sum: 1 },
        },
      },
      { $sort: { "_id.dayOfWeek": 1 } },
      {
        $project: {
          _id: 0,
          dayOfWeek: "$_id.dayOfWeek",
          present: 1,
          total: 1,
          rate: {
            $round: [{ $multiply: [{ $divide: ["$present", "$total"] }, 100] }, 1],
          },
        },
      },
    ]);

    res.json({ classroomId, heatmap });
  } catch (err) {
    console.error("[analytics] getAttendanceHeatmap error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /api/analytics/classroom/:classroomId/grade-distribution
 * Returns count of students per letter grade bucket.
 */
const getGradeDistribution = async (req, res) => {
  try {
    const { classroomId } = req.params;

    const distribution = await GradebookEntry.aggregate([
      { $match: { classroom: require("mongoose").Types.ObjectId(classroomId) } },
      {
        $group: {
          _id: "$letterGrade",
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, grade: "$_id", count: 1 } },
    ]);

    res.json({ classroomId, distribution });
  } catch (err) {
    console.error("[analytics] getGradeDistribution error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /api/analytics/student/:studentId/attendance
 * MongoDB Aggregation Pipeline for student attendance percentage, monthly trend & warning indicators.
 * Week 15 — Manish Regar | Remote Classroom for Rural Colleges
 */
const getStudentAttendanceAnalytics = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { classId } = req.query;
    const mongoose = require("mongoose");

    const matchStage = {
      studentId: new mongoose.Types.ObjectId(studentId),
    };
    if (classId) {
      matchStage.classId = new mongoose.Types.ObjectId(classId);
    }

    const attendanceStats = await Attendance.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$studentId",
          totalSessions: { $sum: 1 },
          presentCount: {
            $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] },
          },
          lateCount: {
            $sum: { $cond: [{ $eq: ["$status", "late"] }, 1, 0] },
          },
          absentCount: {
            $sum: { $cond: [{ $eq: ["$status", "absent"] }, 1, 0] },
          },
          lastSessionDate: { $max: "$date" },
        },
      },
      {
        $project: {
          _id: 0,
          studentId: "$_id",
          totalSessions: 1,
          presentCount: 1,
          lateCount: 1,
          absentCount: 1,
          effectiveAttendance: { $add: ["$presentCount", { $multiply: ["$lateCount", 0.5] }] },
          attendancePercentage: {
            $cond: [
              { $gt: ["$totalSessions", 0] },
              {
                $round: [
                  {
                    $multiply: [
                      {
                        $divide: [
                          { $add: ["$presentCount", { $multiply: ["$lateCount", 0.5] }] },
                          "$totalSessions",
                        ],
                      },
                      100,
                    ],
                  },
                  1,
                ],
              },
              0,
            ],
          },
          lastSessionDate: 1,
        },
      },
      {
        $addFields: {
          isAtRisk: { $lt: ["$attendancePercentage", 75] },
          statusBadge: {
            $cond: [
              { $gte: ["$attendancePercentage", 85] },
              "Excellent",
              {
                $cond: [
                  { $gte: ["$attendancePercentage", 75] },
                  "Satisfactory",
                  "Low Attendance Warning",
                ],
              },
            ],
          },
        },
      },
    ]);

    const monthlyTrend = await Attendance.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
          total: { $sum: 1 },
          present: {
            $sum: { $cond: [{ $in: ["$status", ["present", "late"]] }, 1, 0] },
          },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          total: 1,
          present: 1,
          rate: {
            $round: [{ $multiply: [{ $divide: ["$present", "$total"] }, 100] }, 1],
          },
        },
      },
    ]);

    const result = attendanceStats.length > 0
      ? attendanceStats[0]
      : {
          studentId,
          totalSessions: 0,
          presentCount: 0,
          lateCount: 0,
          absentCount: 0,
          effectiveAttendance: 0,
          attendancePercentage: 0,
          isAtRisk: false,
          statusBadge: "No Records",
        };

    return res.status(200).json({
      success: true,
      stats: result,
      monthlyTrend,
    });
  } catch (err) {
    console.error("[analytics] getStudentAttendanceAnalytics error:", err);
    return res.status(500).json({ success: false, message: "Internal server error", error: err.message });
  }
};

/**
 * GET /api/analytics/student/:studentId/assignments
 * MongoDB Aggregation Pipeline for student assignment completion rate, on-time ratio & grading metrics.
 * Week 15 — Manish Regar | Remote Classroom for Rural Colleges
 */
const getStudentAssignmentCompletionAnalytics = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { classId } = req.query;
    const mongoose = require("mongoose");

    const studentObjId = new mongoose.Types.ObjectId(studentId);

    // 1. Fetch total assignments published for the class/all classes
    const assignmentFilter = { status: { $ne: "draft" } };
    if (classId) {
      assignmentFilter.classId = new mongoose.Types.ObjectId(classId);
    }
    const totalAssignments = await Assignment.countDocuments(assignmentFilter);

    // 2. Aggregate student submissions
    const submissionStats = await Submission.aggregate([
      {
        $match: {
          studentId: studentObjId,
        },
      },
      {
        $lookup: {
          from: "assignments",
          localField: "assignmentId",
          foreignField: "_id",
          as: "assignmentDetails",
        },
      },
      { $unwind: "$assignmentDetails" },
      ...(classId
        ? [
            {
              $match: {
                "assignmentDetails.classId": new mongoose.Types.ObjectId(classId),
              },
            },
          ]
        : []),
      {
        $group: {
          _id: "$studentId",
          totalSubmitted: { $sum: 1 },
          gradedCount: {
            $sum: { $cond: [{ $eq: ["$status", "graded"] }, 1, 0] },
          },
          lateSubmissions: {
            $sum: {
              $cond: [
                {
                  $or: [
                    { $eq: ["$status", "late"] },
                    { $gt: ["$submittedAt", "$assignmentDetails.deadline"] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          onTimeSubmissions: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $ne: ["$status", "late"] },
                    { $lte: ["$submittedAt", "$assignmentDetails.deadline"] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          avgScore: {
            $avg: {
              $cond: [{ $ne: ["$marks", null] }, "$marks", "$$REMOVE"],
            },
          },
          lastSubmissionDate: { $max: "$submittedAt" },
        },
      },
      {
        $project: {
          _id: 0,
          studentId: "$_id",
          totalSubmitted: 1,
          gradedCount: 1,
          lateSubmissions: 1,
          onTimeSubmissions: 1,
          avgScore: { $round: [{ $ifNull: ["$avgScore", 0] }, 1] },
          lastSubmissionDate: 1,
        },
      },
    ]);

    const submitted = submissionStats.length > 0 ? submissionStats[0].totalSubmitted : 0;
    const pending = Math.max(0, totalAssignments - submitted);
    const completionPct = totalAssignments > 0
      ? Math.round((submitted / totalAssignments) * 1000) / 10
      : 0;

    const baseStats = submissionStats.length > 0
      ? submissionStats[0]
      : {
          studentId,
          totalSubmitted: 0,
          gradedCount: 0,
          lateSubmissions: 0,
          onTimeSubmissions: 0,
          avgScore: 0,
          lastSubmissionDate: null,
        };

    return res.status(200).json({
      success: true,
      stats: {
        ...baseStats,
        totalAssigned: totalAssignments,
        pendingAssignments: pending,
        completionPercentage: completionPct,
        onTimeRate: submitted > 0
          ? Math.round((baseStats.onTimeSubmissions / submitted) * 1000) / 10
          : 0,
        isPunctual: baseStats.lateSubmissions === 0,
      },
    });
  } catch (err) {
    console.error("[analytics] getStudentAssignmentCompletionAnalytics error:", err);
    return res.status(500).json({ success: false, message: "Internal server error", error: err.message });
  }
};

/**
 * GET /api/analytics/classroom/:classroomId/performance-summary
 * Multi-stage MongoDB Facet Aggregation for Teacher Dashboard.
 * Returns overall classroom attendance %, assignment submission completion %, and at-risk student roster.
 * Week 15 — Manish Regar | Remote Classroom for Rural Colleges
 */
const getClassroomPerformanceSummary = async (req, res) => {
  try {
    const { classroomId } = req.params;
    const mongoose = require("mongoose");
    const classObjId = new mongoose.Types.ObjectId(classroomId);

    // 1. Classroom Attendance Aggregation
    const attendanceStats = await Attendance.aggregate([
      { $match: { classId: classObjId } },
      {
        $group: {
          _id: null,
          totalRecords: { $sum: 1 },
          presentRecords: {
            $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] },
          },
          lateRecords: {
            $sum: { $cond: [{ $eq: ["$status", "late"] }, 1, 0] },
          },
          uniqueStudents: { $addToSet: "$studentId" },
        },
      },
      {
        $project: {
          _id: 0,
          totalRecords: 1,
          presentRecords: 1,
          lateRecords: 1,
          totalEnrolled: { $size: "$uniqueStudents" },
          overallAttendancePct: {
            $cond: [
              { $gt: ["$totalRecords", 0] },
              {
                $round: [
                  {
                    $multiply: [
                      {
                        $divide: [
                          { $add: ["$presentRecords", { $multiply: ["$lateRecords", 0.5] }] },
                          "$totalRecords",
                        ],
                      },
                      100,
                    ],
                  },
                  1,
                ],
              },
              0,
            ],
          },
        },
      },
    ]);

    // 2. Classroom Assignment Completion Aggregation
    const totalAssignments = await Assignment.countDocuments({
      classId: classObjId,
      status: { $ne: "draft" },
    });

    const assignmentSubmissions = await Submission.aggregate([
      {
        $lookup: {
          from: "assignments",
          localField: "assignmentId",
          foreignField: "_id",
          as: "assignment",
        },
      },
      { $unwind: "$assignment" },
      { $match: { "assignment.classId": classObjId } },
      {
        $group: {
          _id: null,
          totalSubmissions: { $sum: 1 },
          onTimeCount: {
            $sum: {
              $cond: [
                { $lte: ["$submittedAt", "$assignment.deadline"] },
                1,
                0,
              ],
            },
          },
          gradedCount: {
            $sum: { $cond: [{ $eq: ["$status", "graded"] }, 1, 0] },
          },
          avgScore: { $avg: "$marks" },
        },
      },
    ]);

    // 3. At-Risk Students Aggregation (Attendance < 75%)
    const atRiskStudents = await Attendance.aggregate([
      { $match: { classId: classObjId } },
      {
        $group: {
          _id: "$studentId",
          studentName: { $first: "$studentName" },
          total: { $sum: 1 },
          attended: {
            $sum: { $cond: [{ $in: ["$status", ["present", "late"]] }, 1, 0] },
          },
        },
      },
      {
        $project: {
          _id: 0,
          studentId: "$_id",
          studentName: 1,
          total: 1,
          attended: 1,
          percentage: {
            $round: [{ $multiply: [{ $divide: ["$attended", "$total"] }, 100] }, 1],
          },
        },
      },
      { $match: { percentage: { $lt: 75 } } },
      { $sort: { percentage: 1 } },
      { $limit: 10 },
    ]);

    const attSummary = attendanceStats[0] || {
      totalRecords: 0,
      presentRecords: 0,
      lateRecords: 0,
      totalEnrolled: 0,
      overallAttendancePct: 0,
    };

    const subSummary = assignmentSubmissions[0] || {
      totalSubmissions: 0,
      onTimeCount: 0,
      gradedCount: 0,
      avgScore: 0,
    };

    const expectedSubmissions = attSummary.totalEnrolled * totalAssignments;
    const assignmentCompletionPct = expectedSubmissions > 0
      ? Math.round((subSummary.totalSubmissions / expectedSubmissions) * 1000) / 10
      : 0;

    return res.status(200).json({
      success: true,
      classroomId,
      attendance: attSummary,
      assignments: {
        totalAssignments,
        totalSubmissions: subSummary.totalSubmissions,
        assignmentCompletionPct,
        onTimeSubmissions: subSummary.onTimeCount,
        averageScore: Math.round((subSummary.avgScore || 0) * 10) / 10,
      },
      atRiskStudents,
    });
  } catch (err) {
    console.error("[analytics] getClassroomPerformanceSummary error:", err);
    return res.status(500).json({ success: false, message: "Internal server error", error: err.message });
  }
};

module.exports = {
  getClassroomEngagement,
  getQuizScoreTrend,
  getAttendanceHeatmap,
  getGradeDistribution,
  getStudentAttendanceAnalytics,
  getStudentAssignmentCompletionAnalytics,
  getClassroomPerformanceSummary,
};
