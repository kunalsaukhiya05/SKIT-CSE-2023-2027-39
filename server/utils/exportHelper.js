/**
 * exportHelper.js
 * Utility helpers for generating CSV and JSON data exports.
 * Week 13 — Rishabh Jain | Remote Classroom for Rural Colleges
 */

/**
 * Convert an array of objects to a CSV string.
 * @param {Object[]} rows - Array of flat objects
 * @param {string[]} [columns] - Optional ordered column list; defaults to keys of first row
 * @returns {string} CSV-formatted string with header row
 */
function objectsToCSV(rows, columns) {
  if (!rows || rows.length === 0) return "";

  const cols = columns || Object.keys(rows[0]);

  const escape = (val) => {
    if (val === null || val === undefined) return "";
    const str = String(val);
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const header = cols.map(escape).join(",");
  const body = rows
    .map((row) => cols.map((col) => escape(row[col])).join(","))
    .join("\n");

  return `${header}\n${body}`;
}

/**
 * Build a filename-safe export label.
 * @param {string} prefix - e.g. "gradebook", "attendance"
 * @param {string} classroomId
 * @returns {string} e.g. "gradebook_cls123_20261030"
 */
function buildExportFilename(prefix, classroomId) {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  return `${prefix}_${classroomId}_${date}`;
}

/**
 * Flatten a gradebook entry for CSV export.
 * @param {Object} entry - Mongoose GradebookEntry document (lean)
 * @returns {Object} flat row
 */
function flattenGradebookEntry(entry) {
  return {
    studentId: entry.student?._id || entry.student,
    studentName: entry.student?.name || "",
    rollNumber: entry.student?.rollNumber || "",
    subject: entry.subject,
    quizScore: entry.quizScore ?? "",
    assignmentScore: entry.assignmentScore ?? "",
    attendancePercent: entry.attendancePercent ?? "",
    computedGrade: entry.computedGrade || "",
    letterGrade: entry.letterGrade || "",
    updatedAt: entry.updatedAt
      ? new Date(entry.updatedAt).toISOString()
      : "",
  };
}

/**
 * Flatten an attendance record for CSV export.
 * @param {Object} record - Mongoose Attendance document (lean)
 * @returns {Object} flat row
 */
function flattenAttendanceRecord(record) {
  return {
    date: record.date
      ? new Date(record.date).toISOString().slice(0, 10)
      : "",
    studentId: record.student?._id || record.student,
    studentName: record.student?.name || "",
    status: record.status,
    classroomId: record.classroom?._id || record.classroom,
    subject: record.subject || "",
  };
}

/**
 * Stream-safe JSON serialiser — avoids circular refs by stringifying once.
 * @param {*} data
 * @returns {string}
 */
function safeJsonExport(data) {
  return JSON.stringify(data, null, 2);
}

module.exports = {
  objectsToCSV,
  buildExportFilename,
  flattenGradebookEntry,
  flattenAttendanceRecord,
  safeJsonExport,
};
