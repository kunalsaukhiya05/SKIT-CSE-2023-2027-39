// server/controllers/report.controller.js
// Week 15 — Report generation controller (progress, attendance, gradebook exports)
// Rishabh Jain | SKIT CSE 2023-2027 Group 39

const Student    = require("../models/student.model");
const Gradebook  = require("../models/gradebook.model");
const Attendance = require("../models/attendance.model");
const { objectsToCSV } = require("../utils/exportHelper");
const { sendEmail }    = require("../utils/emailHelper");

/**
 * GET /api/reports/student-progress/:studentId
 * Returns a combined JSON payload of grade summary + attendance summary.
 */
async function getStudentProgressReport(req, res) {
  try {
    const { studentId } = req.params;

    const [entries, attendance] = await Promise.all([
      Gradebook.find({ student: studentId }).lean(),
      Attendance.find({ student: studentId }).lean(),
    ]);

    const totalMarks    = entries.reduce((s, e) => s + (e.marksObtained || 0), 0);
    const maxMarks      = entries.reduce((s, e) => s + (e.maxMarks || 0), 0);
    const percentage    = maxMarks > 0 ? ((totalMarks / maxMarks) * 100).toFixed(2) : "N/A";

    const present       = attendance.filter((a) => a.status === "present").length;
    const attendancePct = attendance.length > 0
      ? ((present / attendance.length) * 100).toFixed(2)
      : "N/A";

    res.json({
      studentId,
      gradeSummary: { totalMarks, maxMarks, percentage, entriesCount: entries.length },
      attendanceSummary: { total: attendance.length, present, attendancePct },
    });
  } catch (err) {
    console.error("[report.controller] getStudentProgressReport:", err);
    res.status(500).json({ message: "Failed to generate progress report", error: err.message });
  }
}

/**
 * GET /api/reports/class-gradebook-csv/:classId
 * Streams a CSV export of all gradebook entries for a class.
 */
async function exportClassGradebookCSV(req, res) {
  try {
    const { classId } = req.params;
    const entries = await Gradebook.find({ class: classId })
      .populate("student", "name email rollNumber")
      .lean();

    const rows = entries.map((e) => ({
      Name:          e.student?.name || "",
      Email:         e.student?.email || "",
      RollNumber:    e.student?.rollNumber || "",
      Subject:       e.subject || "",
      MarksObtained: e.marksObtained ?? "",
      MaxMarks:      e.maxMarks ?? "",
      Grade:         e.grade || "",
      Date:          e.createdAt ? new Date(e.createdAt).toLocaleDateString("en-IN") : "",
    }));

    const csv = objectsToCSV(rows);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="gradebook_class_${classId}.csv"`);
    res.send(csv);
  } catch (err) {
    console.error("[report.controller] exportClassGradebookCSV:", err);
    res.status(500).json({ message: "CSV export failed", error: err.message });
  }
}

/**
 * POST /api/reports/email-progress/:studentId
 * Sends the student progress report to the student's email.
 */
async function emailStudentProgressReport(req, res) {
  try {
    const { studentId } = req.params;
    const student = await Student.findById(studentId).lean();
    if (!student) return res.status(404).json({ message: "Student not found" });

    const [entries, attendance] = await Promise.all([
      Gradebook.find({ student: studentId }).lean(),
      Attendance.find({ student: studentId }).lean(),
    ]);

    const totalMarks    = entries.reduce((s, e) => s + (e.marksObtained || 0), 0);
    const maxMarks      = entries.reduce((s, e) => s + (e.maxMarks || 0), 0);
    const percentage    = maxMarks > 0 ? ((totalMarks / maxMarks) * 100).toFixed(2) : "N/A";
    const present       = attendance.filter((a) => a.status === "present").length;
    const attendancePct = attendance.length > 0
      ? ((present / attendance.length) * 100).toFixed(2)
      : "N/A";

    await sendEmail({
      to: student.email,
      subject: `[GyaanSetu] Your Progress Report`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto">
          <h2 style="color:#1a73e8">GyaanSetu — Progress Report</h2>
          <p>Hi <strong>${student.name}</strong>,</p>
          <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%">
            <tr><th>Metric</th><th>Value</th></tr>
            <tr><td>Total Marks Obtained</td><td>${totalMarks} / ${maxMarks}</td></tr>
            <tr><td>Overall Percentage</td><td>${percentage}%</td></tr>
            <tr><td>Classes Attended</td><td>${present} / ${attendance.length}</td></tr>
            <tr><td>Attendance %</td><td>${attendancePct}%</td></tr>
          </table>
          <p style="margin-top:20px;font-size:12px;color:#757575">SKIT CSE 2023-2027 | Group 39 — GyaanSetu</p>
        </div>`,
    });

    res.json({ message: "Progress report emailed successfully", to: student.email });
  } catch (err) {
    console.error("[report.controller] emailStudentProgressReport:", err);
    res.status(500).json({ message: "Failed to email progress report", error: err.message });
  }
}

module.exports = {
  getStudentProgressReport,
  exportClassGradebookCSV,
  emailStudentProgressReport,
};
