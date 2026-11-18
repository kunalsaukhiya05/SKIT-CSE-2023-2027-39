// client/src/pages/ReportPage.jsx
// Week 15 — Full report page: student progress + teacher CSV export
// Rishabh Jain | SKIT CSE 2023-2027 Group 39

import React, { useState } from "react";
import { useSelector } from "react-redux";
import ProgressReportCard from "../components/classroom/ProgressReportCard";
import useReport from "../hooks/useReport";

/**
 * ReportPage
 * - Student view : shows their own progress report card.
 * - Teacher view : shows a class-selector + bulk CSV download + per-student email trigger.
 */
export default function ReportPage() {
  const student = useSelector((s) => s.student?.student);
  const teacher = useSelector((s) => s.teacher?.teacher);

  const isTeacher  = Boolean(teacher);
  const isStudent  = Boolean(student);

  const [selectedClass, setSelectedClass] = useState("");
  const [classes]                         = useState(teacher?.classes || []);

  const { downloadGradebookCSV } = useReport(null, selectedClass);

  /* ---- Student View ---- */
  if (isStudent) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Progress Report</h1>
        <ProgressReportCard studentId={student._id} isTeacher={false} />
      </div>
    );
  }

  /* ---- Teacher View ---- */
  if (isTeacher) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Class Reports</h1>

        {/* Class Selector */}
        <div className="max-w-sm">
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Class</label>
          <select
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="">— choose a class —</option>
            {classes.map((c) => (
              <option key={c._id} value={c._id}>{c.name || c._id}</option>
            ))}
          </select>
        </div>

        {/* CSV Export */}
        {selectedClass && (
          <div className="bg-white rounded-2xl shadow p-5 max-w-sm space-y-3">
            <h3 className="text-base font-semibold text-gray-800">Gradebook Export</h3>
            <p className="text-sm text-gray-500">Download all student grades for this class as a CSV file.</p>
            <button
              onClick={downloadGradebookCSV}
              className="text-sm px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              ⬇ Download Gradebook CSV
            </button>
          </div>
        )}

        {/* Per-student email cards */}
        {selectedClass && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Student Progress Cards</h2>
            <p className="text-sm text-gray-500 mb-4">Select a class to load per-student progress cards.</p>
            {/* Dynamic per-student list would be rendered here from a useClassStudents hook */}
            <p className="text-sm italic text-gray-400">
              (Connect useClassStudents hook to map student IDs to &lt;ProgressReportCard isTeacher /&gt; components.)
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-500">Please log in to view reports.</p>
    </div>
  );
}
