import React, { useState } from "react";
import { toast } from "react-hot-toast";

const INITIAL_ROSTER = [
  { rollNo: "101", name: "Aarav Sharma", tier: "4G WiFi", status: "Present" },
  { rollNo: "102", name: "Bhavya Singh", tier: "3G Mobile", status: "Present" },
  { rollNo: "103", name: "Deepak Meena", tier: "Rural 2G Edge", status: "Present" },
  { rollNo: "104", name: "Ishita Verma", tier: "4G Mobile", status: "Present" },
  { rollNo: "105", name: "Kavita Choudhary", tier: "Rural 2G Edge", status: "Late" },
  { rollNo: "106", name: "Manish Regar", tier: "3G Mobile", status: "Present" },
  { rollNo: "107", name: "Kunal Saukhiya", tier: "4G WiFi", status: "Present" },
  { rollNo: "108", name: "Rishabh Jain", tier: "4G WiFi", status: "Present" },
  { rollNo: "109", name: "Sunil Yadav", tier: "Rural 2G Edge", status: "Absent" },
  { rollNo: "110", name: "Tanvi Rathore", tier: "3G Mobile", status: "Present" },
];

const TeacherAttendance = () => {
  const [selectedClass, setSelectedClass] = useState("CS-302: Computer Networks");
  const [selectedDate, setSelectedDate] = useState("2026-10-26");
  const [roster, setRoster] = useState(INITIAL_ROSTER);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStatusChange = (rollNo, newStatus) => {
    setRoster((prev) =>
      prev.map((s) => (s.rollNo === rollNo ? { ...s, status: newStatus } : s))
    );
  };

  const handleMarkAllPresent = () => {
    setRoster((prev) => prev.map((s) => ({ ...s, status: "Present" })));
    toast.success("Marked all students as Present");
  };

  const handleSaveDraftOffline = () => {
    localStorage.setItem(
      `attendance_draft_${selectedDate}_${selectedClass}`,
      JSON.stringify(roster)
    );
    toast.success("Attendance draft saved to local offline storage!");
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(`Attendance for ${selectedClass} successfully submitted to the server!`);
    }, 600);
  };

  const exportCSV = () => {
    let csv = "RollNo,Name,ConnectivityTier,Status\n";
    roster.forEach((r) => {
      csv += `${r.rollNo},"${r.name}",${r.tier},${r.status}\n`;
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Attendance_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Exported attendance report as CSV");
  };

  const presentCount = roster.filter((r) => r.status === "Present").length;
  const lateCount = roster.filter((r) => r.status === "Late").length;
  const absentCount = roster.filter((r) => r.status === "Absent").length;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Faculty Classroom Attendance Portal</h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage student roll calls, offline local buffering, and rural connectivity tiers
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleMarkAllPresent}
                className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold transition"
              >
                âœ“ Mark All Present
              </button>
              <button
                onClick={handleSaveDraftOffline}
                className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-sm font-semibold transition"
              >
                ðŸ’¾ Save Offline Draft
              </button>
              <button
                onClick={exportCSV}
                className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-sm font-semibold transition"
              >
                ðŸ“¥ Export CSV
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-semibold transition shadow-sm disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "ðŸš€ Submit Final"}
              </button>
            </div>
          </div>

          {/* Selectors and Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Classroom</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full text-sm border border-gray-300 rounded-lg p-2 focus:ring-1 focus:ring-teal-500"
              >
                <option>CS-302: Computer Networks</option>
                <option>CS-304: Database Management Systems</option>
                <option>CS-306: Operating Systems</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Lecture Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full text-sm border border-gray-300 rounded-lg p-2 focus:ring-1 focus:ring-teal-500"
              />
            </div>
            <div className="md:col-span-2 flex items-center justify-around bg-gray-50 rounded-xl p-3 border border-gray-100">
              <div className="text-center">
                <span className="text-xs text-gray-500">Present</span>
                <p className="text-xl font-bold text-green-600">{presentCount}</p>
              </div>
              <div className="text-center">
                <span className="text-xs text-gray-500">Late</span>
                <p className="text-xl font-bold text-amber-600">{lateCount}</p>
              </div>
              <div className="text-center">
                <span className="text-xs text-gray-500">Absent</span>
                <p className="text-xl font-bold text-red-600">{absentCount}</p>
              </div>
              <div className="text-center">
                <span className="text-xs text-gray-500">Total</span>
                <p className="text-xl font-bold text-gray-800">{roster.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Student Roster Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-gray-200">
            <h2 className="text-base font-bold text-gray-900">Student Attendance Roster</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
              <thead className="bg-gray-50 text-gray-600 font-semibold text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3">Roll No</th>
                  <th className="px-6 py-3">Student Name</th>
                  <th className="px-6 py-3">Connectivity Tier</th>
                  <th className="px-6 py-3 text-center">Attendance Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {roster.map((student) => (
                  <tr key={student.rollNo} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-mono font-medium text-gray-900">{student.rollNo}</td>
                    <td className="px-6 py-4 font-medium text-gray-800">{student.name}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                          student.tier.includes("2G")
                            ? "bg-amber-100 text-amber-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {student.tier}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {["Present", "Late", "Absent"].map((status) => (
                          <button
                            key={status}
                            onClick={() => handleStatusChange(student.rollNo, status)}
                            className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                              student.status === status
                                ? status === "Present"
                                  ? "bg-green-600 text-white shadow-sm"
                                  : status === "Late"
                                  ? "bg-amber-500 text-white shadow-sm"
                                  : "bg-red-600 text-white shadow-sm"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherAttendance;
