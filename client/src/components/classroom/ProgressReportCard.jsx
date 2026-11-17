// client/src/components/classroom/ProgressReportCard.jsx
// Week 15 — Student progress report summary card component
// Rishabh Jain | SKIT CSE 2023-2027 Group 39

import React, { useEffect } from "react";
import useReport from "../../hooks/useReport";

/**
 * ProgressReportCard
 * Displays a student's grade + attendance summary and allows emailing the report.
 *
 * Props:
 *   studentId {string}  — the target student's _id
 *   classId   {string}  — optional, enables CSV download button for teachers
 *   isTeacher {boolean} — shows teacher-only actions when true
 */
export default function ProgressReportCard({ studentId, classId, isTeacher = false }) {
  const {
    progressData,
    loading,
    error,
    emailStatus,
    fetchProgressReport,
    downloadGradebookCSV,
    emailProgressReport,
  } = useReport(studentId, classId);

  useEffect(() => {
    fetchProgressReport();
  }, [fetchProgressReport]);

  /* ---- Helpers ---- */
  const pct  = (val) => (val !== undefined && val !== "N/A" ? `${val}%` : "N/A");
  const chip = (val, good = 75) => {
    const n = parseFloat(val);
    if (isNaN(n)) return "bg-gray-100 text-gray-600";
    return n >= good ? "bg-green-100 text-green-700" : n >= 50 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700";
  };

  /* ---- Render ---- */
  return (
    <div className="bg-white rounded-2xl shadow p-5 space-y-4 max-w-sm">
      <h3 className="text-base font-semibold text-gray-800">Progress Report</h3>

      {loading && <p className="text-sm text-gray-500">Loading…</p>}
      {error   && <p className="text-sm text-red-500">{error}</p>}

      {progressData && !loading && (
        <>
          {/* Grade summary */}
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Academic</p>
            <div className="flex items-center gap-2">
              <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${chip(progressData.gradeSummary?.percentage)}`}>
                {pct(progressData.gradeSummary?.percentage)}
              </span>
              <span className="text-sm text-gray-700">
                {progressData.gradeSummary?.totalMarks ?? "—"} / {progressData.gradeSummary?.maxMarks ?? "—"} marks
              </span>
            </div>
          </div>

          {/* Attendance summary */}
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Attendance</p>
            <div className="flex items-center gap-2">
              <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${chip(progressData.attendanceSummary?.attendancePct)}`}>
                {pct(progressData.attendanceSummary?.attendancePct)}
              </span>
              <span className="text-sm text-gray-700">
                {progressData.attendanceSummary?.present ?? "—"} / {progressData.attendanceSummary?.total ?? "—"} classes
              </span>
            </div>
          </div>
        </>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-2 pt-1">
        <button
          onClick={emailProgressReport}
          disabled={emailStatus === "sending"}
          className="text-xs px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 transition"
        >
          {emailStatus === "sending" ? "Sending…" : emailStatus === "sent" ? "✓ Sent" : "Email Report"}
        </button>

        {isTeacher && classId && (
          <button
            onClick={downloadGradebookCSV}
            className="text-xs px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
          >
            Download CSV
          </button>
        )}

        <button
          onClick={fetchProgressReport}
          className="text-xs px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
        >
          Refresh
        </button>
      </div>
    </div>
  );
}
