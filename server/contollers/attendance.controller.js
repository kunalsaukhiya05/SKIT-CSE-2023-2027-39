const attendanceModel = require("../models/attendance.model");

// Mark attendance (Teacher)
const markAttendance = async (req, res) => {
  try {
    const teacherId = req.teacherId;
    const { classId, students } = req.body;
    // students: [{ studentId, studentName, status }]

    if (!classId || !students || !Array.isArray(students)) {
      return res.status(400).json({ message: "Class ID and students array are required" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendanceRecords = [];
    for (const student of students) {
      try {
        const record = await attendanceModel.findOneAndUpdate(
          {
            classId,
            studentId: student.studentId,
            date: {
              $gte: today,
              $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
            },
          },
          {
            classId,
            studentId: student.studentId,
            studentName: student.studentName,
            status: student.status || "present",
            markedBy: teacherId,
            date: new Date(),
          },
          { upsert: true, new: true }
        );
        attendanceRecords.push(record);
      } catch (dupErr) {
        // Skip duplicates
        console.log("Duplicate attendance entry, skipping:", dupErr.message);
      }
    }

    return res.status(201).json({
      message: "Attendance marked successfully",
      attendance: attendanceRecords,
    });
  } catch (err) {
    console.error("Error marking attendance:", err);
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

// Get attendance for a class
const getClassAttendance = async (req, res) => {
  try {
    const { classId } = req.params;
    const { date } = req.query;

    let query = { classId };
    if (date) {
      const targetDate = new Date(date);
      targetDate.setHours(0, 0, 0, 0);
      query.date = {
        $gte: targetDate,
        $lt: new Date(targetDate.getTime() + 24 * 60 * 60 * 1000),
      };
    }

    const attendance = await attendanceModel.find(query).sort({ date: -1 });

    return res.status(200).json({
      message: "Attendance fetched successfully",
      attendance,
    });
  } catch (err) {
    console.error("Error fetching attendance:", err);
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

// Get student's attendance record
const getStudentAttendance = async (req, res) => {
  try {
    const studentId = req.studentId;

    const attendance = await attendanceModel
      .find({ studentId })
      .populate("classId", "title subject date")
      .sort({ date: -1 });

    const total = attendance.length;
    const present = attendance.filter((a) => a.status === "present").length;
    const absent = attendance.filter((a) => a.status === "absent").length;
    const late = attendance.filter((a) => a.status === "late").length;
    const percentage = total > 0 ? ((present + late) / total * 100).toFixed(1) : 0;

    return res.status(200).json({
      message: "Student attendance fetched successfully",
      attendance,
      stats: { total, present, absent, late, percentage },
    });
  } catch (err) {
    console.error("Error fetching student attendance:", err);
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};


// Live Classroom Auto Attendance Recording [Manish Regar]
const recordLiveAttendance = async (req, res) => {
  try {
    const studentId = req.studentId;
    const { classId, durationSeconds, studentName } = req.body;

    if (!classId) {
      return res.status(400).json({ message: "Class ID is required" });
    }

    // Must attend for at least 10 minutes (600 seconds) to be marked present, else late
    const attendanceStatus = (durationSeconds && durationSeconds >= 600) ? "present" : "late";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const record = await attendanceModel.findOneAndUpdate(
      {
        classId,
        studentId,
        date: {
          $gte: today,
          $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
      },
      {
        classId,
        studentId,
        studentName: studentName || "Student",
        status: attendanceStatus,
        date: new Date(),
      },
      { upsert: true, new: true }
    );

    res.status(200).json({
      message: "Live attendance recorded successfully",
      record,
    });
  } catch (err) {
    console.error("Error recording live attendance:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};


// Class Attendance Summary & Statistics [Manish Regar]
const getClassAttendanceSummary = async (req, res) => {
  try {
    const { classId } = req.params;

    const records = await attendanceModel.find({ classId });
    const totalRecords = records.length;
    const presentCount = records.filter((r) => r.status === "present").length;
    const lateCount = records.filter((r) => r.status === "late").length;
    const absentCount = records.filter((r) => r.status === "absent").length;
    const overallRate = totalRecords > 0
      ? Number(((presentCount + lateCount) / totalRecords * 100).toFixed(1))
      : 0;

    res.status(200).json({
      message: "Class attendance summary generated",
      summary: {
        totalRecords,
        presentCount,
        lateCount,
        absentCount,
        overallRate,
      },
    });
  } catch (err) {
    console.error("Error generating attendance summary:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};


// Meeting Departure Auto-Sync Attendance [Manish Regar]
const syncMeetingAttendance = async (req, res) => {
  try {
    const { classId } = req.params;
    const { studentId, studentName, durationSeconds } = req.body;

    if (!classId || !studentId) {
      return res.status(400).json({ message: "Class ID and Student ID are required" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const duration = Number(durationSeconds) || 0;
    const status = duration >= 600 ? "present" : duration >= 180 ? "late" : "absent";

    const record = await attendanceModel.findOneAndUpdate(
      {
        classId,
        studentId,
        date: {
          $gte: today,
          $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
      },
      {
        classId,
        studentId,
        studentName: studentName || "Student",
        status,
        date: new Date(),
      },
      { upsert: true, new: true }
    );

    res.status(200).json({
      message: "Meeting departure attendance synced successfully",
      record,
    });
  } catch (err) {
    console.error("Error syncing meeting attendance:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};


// Direct Live Attendance Recording endpoint [Manish Regar]
const recordAttendance = async (req, res) => {
  try {
    const studentId = req.studentId;
    const { classId, durationSeconds, studentName } = req.body;

    if (!classId) {
      return res.status(400).json({ success: false, message: "Class ID is required" });
    }

    const duration = Math.max(0, parseInt(durationSeconds) || 0);
    const status = duration >= 600 ? "present" : duration >= 180 ? "late" : "absent";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const record = await attendanceModel.findOneAndUpdate(
      {
        classId,
        studentId,
        date: {
          $gte: today,
          $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
      },
      {
        classId,
        studentId,
        studentName: studentName || "Student",
        status,
        date: new Date(),
      },
      { upsert: true, new: true }
    );

    return res.status(200).json({
      success: true,
      message: `Attendance recorded as ${status} (${Math.round(duration / 60)} mins attended)`,
      attendance: record,
      status,
      durationSeconds: duration,
    });
  } catch (err) {
    console.error("Error in recordAttendance:", err);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
  }
};


// Comprehensive Class Attendance Report with Defaulter Detection [Manish Regar]
const getClassAttendanceReport = async (req, res) => {
  try {
    const { classId } = req.params;
    const { threshold = 75, startDate, endDate } = req.query;

    if (!classId) {
      return res.status(400).json({ success: false, message: "Class ID is required" });
    }

    const filter = { classId };
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.date.$lte = end;
      }
    }

    const records = await attendanceModel
      .find(filter)
      .populate("studentId", "fullName email")
      .sort({ date: -1 });

    const studentMap = {};
    for (const r of records) {
      const sId = r.studentId?._id?.toString() || r.studentId?.toString() || r.studentName;
      if (!studentMap[sId]) {
        studentMap[sId] = {
          studentId: sId,
          studentName: r.studentName || r.studentId?.fullName || "Student",
          totalSessions: 0,
          attendedSessions: 0,
          lateSessions: 0,
          absentSessions: 0,
        };
      }
      studentMap[sId].totalSessions += 1;
      if (r.status === "present") studentMap[sId].attendedSessions += 1;
      else if (r.status === "late") studentMap[sId].lateSessions += 1;
      else studentMap[sId].absentSessions += 1;
    }

    const requiredThreshold = Number(threshold) || 75;
    const studentSummaries = Object.values(studentMap).map((s) => {
      const rate = s.totalSessions > 0
        ? Number(((s.attendedSessions + s.lateSessions) / s.totalSessions * 100).toFixed(1))
        : 0;
      return {
        ...s,
        attendanceRate: rate,
        isDefaulter: rate < requiredThreshold,
      };
    });

    const defaulters = studentSummaries.filter((s) => s.isDefaulter);
    const overallClassAverage = studentSummaries.length > 0
      ? Number((studentSummaries.reduce((acc, s) => acc + s.attendanceRate, 0) / studentSummaries.length).toFixed(1))
      : 0;

    return res.status(200).json({
      success: true,
      classId,
      totalStudents: studentSummaries.length,
      totalClassRecords: records.length,
      overallClassAverage,
      defaulterCount: defaulters.length,
      defaulterThreshold: requiredThreshold,
      defaulters,
      students: studentSummaries,
    });
  } catch (err) {
    console.error("Error generating class attendance report:", err);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
  }
};


// Student Longitudinal Attendance Analytics & Monthly Breakdown [Manish Regar]
const getStudentAttendanceAnalytics = async (req, res) => {
  try {
    const studentId = req.studentId || req.params.studentId;
    if (!studentId) {
      return res.status(400).json({ success: false, message: "Student ID required" });
    }

    const records = await attendanceModel
      .find({ studentId })
      .populate("classId", "title subject")
      .sort({ date: 1 });

    const total = records.length;
    let present = 0;
    let late = 0;
    let absent = 0;
    const monthlyMap = {};
    const subjectMap = {};

    for (const r of records) {
      if (r.status === "present") present += 1;
      else if (r.status === "late") late += 1;
      else absent += 1;

      const d = new Date(r.date);
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (!monthlyMap[monthKey]) {
        monthlyMap[monthKey] = { month: monthKey, total: 0, attended: 0 };
      }
      monthlyMap[monthKey].total += 1;
      if (r.status === "present" || r.status === "late") monthlyMap[monthKey].attended += 1;

      const sub = r.classId?.subject || "General";
      if (!subjectMap[sub]) {
        subjectMap[sub] = { subject: sub, total: 0, attended: 0 };
      }
      subjectMap[sub].total += 1;
      if (r.status === "present" || r.status === "late") subjectMap[sub].attended += 1;
    }

    const overallRate = total > 0 ? Number(((present + late) / total * 100).toFixed(1)) : 0;
    const monthlyTrends = Object.values(monthlyMap).map((m) => ({
      ...m,
      rate: Number(((m.attended / m.total) * 100).toFixed(1)),
    }));
    const subjectBreakdown = Object.values(subjectMap).map((s) => ({
      ...s,
      rate: Number(((s.attended / s.total) * 100).toFixed(1)),
      needsAttention: Number(((s.attended / s.total) * 100).toFixed(1)) < 75,
    }));

    return res.status(200).json({
      success: true,
      studentId,
      summary: {
        totalClasses: total,
        present,
        late,
        absent,
        overallRate,
        isAtRisk: overallRate < 75,
      },
      monthlyTrends,
      subjectBreakdown,
    });
  } catch (err) {
    console.error("Error fetching student attendance analytics:", err);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
  }
};


// Batch Attendance Summary Export Formatter for Audits & Reports [Manish Regar]
const exportClassAttendance = async (req, res) => {
  try {
    const { classId } = req.params;
    const { format = "json" } = req.query;

    const records = await attendanceModel
      .find({ classId })
      .populate("classId", "title subject")
      .populate("studentId", "fullName email")
      .sort({ date: -1 });

    if (format === "csv") {
      const header = "Date,Class Title,Subject,Student Name,Status\n";
      const rows = records.map((r) => {
        const dateStr = new Date(r.date).toISOString().slice(0, 10);
        const title = (r.classId?.title || "").replace(/,/g, " ");
        const subject = (r.classId?.subject || "").replace(/,/g, " ");
        const name = (r.studentName || r.studentId?.fullName || "Student").replace(/,/g, " ");
        return `${dateStr},${title},${subject},${name},${r.status}`;
      }).join("\n");

      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", `attachment; filename=attendance-${classId}.csv`);
      return res.status(200).send(header + rows);
    }

    return res.status(200).json({
      success: true,
      classId,
      recordCount: records.length,
      exportedAt: new Date().toISOString(),
      records: records.map((r) => ({
        id: r._id,
        date: r.date,
        studentName: r.studentName,
        status: r.status,
        subject: r.classId?.subject,
      })),
    });
  } catch (err) {
    console.error("Error exporting class attendance:", err);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
  }
};


// Offline Attendance Queue Reconciliation & Batch Sync [Kunal Saukhiya]
const syncBatchOfflineAttendance = async (req, res) => {
  try {
    const studentId = req.studentId;
    const { batch } = req.body;

    if (!Array.isArray(batch) || batch.length === 0) {
      return res.status(400).json({ success: false, message: "Batch array of attendance items required" });
    }

    const results = [];
    for (const item of batch) {
      const { classId, timestamp, durationSeconds, studentName } = item;
      if (!classId) continue;

      const recordDate = timestamp ? new Date(timestamp) : new Date();
      const startOfDay = new Date(recordDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(recordDate);
      endOfDay.setHours(23, 59, 59, 999);

      const duration = Math.max(0, parseInt(durationSeconds) || 0);
      const status = duration >= 600 ? "present" : duration >= 180 ? "late" : "present";

      const record = await attendanceModel.findOneAndUpdate(
        {
          classId,
          studentId,
          date: { $gte: startOfDay, $lte: endOfDay },
        },
        {
          classId,
          studentId,
          studentName: studentName || "Student",
          status,
          date: recordDate,
        },
        { upsert: true, new: true }
      );
      results.push(record);
    }

    return res.status(200).json({
      success: true,
      message: Successfully synchronized ${results.length} offline attendance records,
      syncedCount: results.length,
      records: results,
    });
  } catch (err) {
    console.error("Error in syncBatchOfflineAttendance:", err);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
  }
};

module.exports = { syncBatchOfflineAttendance,  markAttendance, getClassAttendance, getStudentAttendance, recordLiveAttendance, getClassAttendanceSummary, syncMeetingAttendance, recordAttendance, getClassAttendanceReport, getStudentAttendanceAnalytics, exportClassAttendance };

