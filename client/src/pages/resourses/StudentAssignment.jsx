import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const INITIAL_ASSIGNMENTS = [
  {
    id: "asg-1",
    title: "Subnetting and CIDR Routing Implementation",
    subject: "Computer Networks",
    dueDate: "2026-10-31",
    maxMarks: 25,
    status: "Submitted",
    submissionDate: "2026-10-30",
    grade: "23/25",
    remarks: "Good network topology diagram.",
  },
  {
    id: "asg-2",
    title: "B+ Tree Indexing and Query Optimization",
    subject: "Database Management Systems",
    dueDate: "2026-11-04",
    maxMarks: 20,
    status: "Pending",
    submissionDate: null,
    grade: "--",
    remarks: "",
  },
  {
    id: "asg-3",
    title: "Round Robin CPU Scheduling Simulation",
    subject: "Operating Systems",
    dueDate: "2026-11-08",
    maxMarks: 30,
    status: "Pending",
    submissionDate: null,
    grade: "--",
    remarks: "",
  },
];

const StudentAssignment = () => {
  const [assignments, setAssignments] = useState(INITIAL_ASSIGNMENTS);
  const [activeTab, setActiveTab] = useState("Pending");
  const [selectedAsg, setSelectedAsg] = useState(null);
  const [solutionText, setSolutionText] = useState("");
  const [fileAttached, setFileAttached] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (selectedAsg) {
      const draft = localStorage.getItem(`draft_${selectedAsg.id}`);
      if (draft) setSolutionText(draft);
      else setSolutionText("");
    }
  }, [selectedAsg]);

  const handleSaveDraft = () => {
    if (!selectedAsg) return;
    localStorage.setItem(`draft_${selectedAsg.id}`, solutionText);
    toast.success("Draft saved to offline local storage!");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!solutionText.trim() && !fileAttached) {
      toast.error("Please enter solution notes or attach a file.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setAssignments((prev) =>
        prev.map((a) =>
          a.id === selectedAsg.id
            ? {
                ...a,
                status: "Submitted",
                submissionDate: new Date().toISOString().split("T")[0],
                grade: "Pending Evaluation",
              }
            : a
        )
      );
      localStorage.removeItem(`draft_${selectedAsg.id}`);
      setIsSubmitting(false);
      setSelectedAsg(null);
      setSolutionText("");
      setFileAttached(null);
      toast.success("Assignment submitted successfully to the faculty queue!");
    }, 700);
  };

  const filtered = assignments.filter((a) =>
    activeTab === "All" ? true : a.status === activeTab
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Assignments & Submissions</h1>
              <p className="text-sm text-gray-500 mt-1">
                View coursework, upload answers, track grading feedback, and autosave offline drafts
              </p>
            </div>
            <div className="flex bg-gray-100 p-1 rounded-lg">
              {["Pending", "Submitted", "All"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-md text-xs font-semibold transition ${
                    activeTab === tab ? "bg-white text-teal-700 shadow-sm" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((asg) => (
            <div
              key={asg.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col justify-between hover:shadow-md transition"
            >
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-100">
                    {asg.subject}
                  </span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      asg.status === "Submitted" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {asg.status}
                  </span>
                </div>
                <h3 className="text-base font-bold text-gray-900 mt-2">{asg.title}</h3>
                <p className="text-xs text-gray-500 mt-1">Due Date: {asg.dueDate}</p>
                {asg.status === "Submitted" && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg text-xs border border-gray-100 space-y-1">
                    <p className="text-gray-600">Submitted on: {asg.submissionDate}</p>
                    <p className="font-semibold text-gray-800">Grade: {asg.grade}</p>
                    {asg.remarks && <p className="text-teal-700 italic">Faculty Remarks: "{asg.remarks}"</p>}
                  </div>
                )}
              </div>

              {asg.status === "Pending" && (
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-xs text-gray-500 font-medium">Max Marks: {asg.maxMarks}</span>
                  <button
                    onClick={() => setSelectedAsg(asg)}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold transition"
                  >
                    Submit Work
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {selectedAsg && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-1">Submit Assignment: {selectedAsg.title}</h2>
              <p className="text-xs text-gray-500 mb-4">{selectedAsg.subject} â€¢ Max: {selectedAsg.maxMarks} marks</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Solution / Answers Notes</label>
                  <textarea
                    rows={4}
                    value={solutionText}
                    onChange={(e) => setSolutionText(e.target.value)}
                    placeholder="Enter writeup, code snippet, or explanation..."
                    className="w-full text-sm border border-gray-300 rounded-lg p-2.5 focus:ring-1 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Attach PDF / Photo (Under 10MB)</label>
                  <input
                    type="file"
                    onChange={(e) => setFileAttached(e.target.files[0]?.name || null)}
                    className="text-xs text-gray-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                  />
                  {fileAttached && <p className="text-xs text-teal-600 mt-1">Attached: {fileAttached}</p>}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-xs font-semibold transition"
                  >
                    ðŸ’¾ Save Offline Draft
                  </button>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedAsg(null)}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold transition shadow-sm disabled:opacity-50"
                    >
                      {isSubmitting ? "Submitting..." : "ðŸš€ Submit Final"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentAssignment;
