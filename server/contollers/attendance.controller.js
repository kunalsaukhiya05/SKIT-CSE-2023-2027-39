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

module.exports = { markAttendance, getClassAttendance, getStudentAttendance };
