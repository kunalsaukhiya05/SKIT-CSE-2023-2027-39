import React, { useState } from "react";
import { toast } from "react-hot-toast";

const SAMPLE_ASSIGNMENTS = [
  {
    id: "asg-1",
    title: "Subnetting and CIDR Routing Implementation",
    subject: "Computer Networks",
    dueDate: "2026-10-31",
    submissionsCount: 26,
    totalStudents: 32,
    maxMarks: 25,
    status: "Active",
  },
  {
    id: "asg-2",
    title: "B+ Tree Indexing and Query Optimization",
    subject: "Database Management Systems",
    dueDate: "2026-11-04",
    submissionsCount: 18,
    totalStudents: 32,
    maxMarks: 20,
    status: "Active",
  },
  {
    id: "asg-3",
    title: "Round Robin CPU Scheduling Simulation",
    subject: "Operating Systems",
    dueDate: "2026-10-22",
    submissionsCount: 30,
    totalStudents: 32,
    maxMarks: 30,
    status: "Grading Complete",
  },
];

const TeacherAssignments = () => {
  const [assignments, setAssignments] = useState(SAMPLE_ASSIGNMENTS);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSubject, setNewSubject] = useState("Computer Networks");
  const [newDueDate, setNewDueDate] = useState("");
  const [newMaxMarks, setNewMaxMarks] = useState(25);

  const handleCreateAssignment = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDueDate) {
      toast.error("Please fill in all assignment fields");
      return;
    }

    const created = {
      id: `asg-${Date.now()}`,
      title: newTitle.trim(),
      subject: newSubject,
      dueDate: newDueDate,
      submissionsCount: 0,
      totalStudents: 32,
      maxMarks: Number(newMaxMarks),
      status: "Active",
    };

    setAssignments([created, ...assignments]);
    setShowCreateModal(false);
    setNewTitle("");
    setNewDueDate("");
    toast.success("Assignment created and distributed to class queue!");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Faculty Assignment & Evaluation Portal</h1>
              <p className="text-sm text-gray-500 mt-1">
                Design coursework, evaluate student uploads, and batch grade submissions
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-semibold transition shadow-sm"
            >
              + Create New Assignment
            </button>
          </div>
        </div>

        {/* Assignments List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignments.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col justify-between hover:shadow-md transition"
            >
              <div>
                <div className="flex justify-between items-start gap-2 mb-2">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded bg-teal-50 text-teal-700 border border-teal-100">
                    {item.subject}
                  </span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      item.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <h3 className="text-base font-bold text-gray-900 mt-2">{item.title}</h3>
                <p className="text-xs text-gray-500 mt-1">Due: {item.dueDate}</p>
              </div>

              <div className="mt-5 pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center text-xs text-gray-600 mb-2">
                  <span>Submissions:</span>
                  <span className="font-bold text-gray-900">
                    {item.submissionsCount} / {item.totalStudents} ({Math.round((item.submissionsCount / item.totalStudents) * 100)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div
                    className="bg-teal-600 h-2 rounded-full"
                    style={{ width: `${(item.submissionsCount / item.totalStudents) * 100}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-gray-500">Max: {item.maxMarks} Marks</span>
                  <button
                    onClick={() => toast.success(`Viewing submissions for ${item.title}`)}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md text-xs font-semibold transition"
                  >
                    Review Submissions
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Create New Coursework Assignment</h2>
              <form onSubmit={handleCreateAssignment} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Subject</label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full text-sm border border-gray-300 rounded-lg p-2 focus:ring-1 focus:ring-teal-500"
                  >
                    <option>Computer Networks</option>
                    <option>Database Management Systems</option>
                    <option>Operating Systems</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Assignment Title</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Dijkstra Shortest Path Algorithm"
                    className="w-full text-sm border border-gray-300 rounded-lg p-2 focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Due Date</label>
                    <input
                      type="date"
                      value={newDueDate}
                      onChange={(e) => setNewDueDate(e.target.value)}
                      className="w-full text-sm border border-gray-300 rounded-lg p-2 focus:ring-1 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Max Marks</label>
                    <input
                      type="number"
                      value={newMaxMarks}
                      onChange={(e) => setNewMaxMarks(e.target.value)}
                      className="w-full text-sm border border-gray-300 rounded-lg p-2 focus:ring-1 focus:ring-teal-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-semibold transition shadow-sm"
                  >
                    Publish Assignment
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherAssignments;
