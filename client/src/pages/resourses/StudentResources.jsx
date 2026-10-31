import React, { useState } from "react";
import { toast } from "react-hot-toast";

const SAMPLE_RESOURCES = [
  { id: "res-1", title: "Unit 1: OSI 7-Layer Model & TCP/IP Architecture", subject: "Computer Networks", size: "2.1 MB", downloads: 84, format: "PDF", type: "Lecture Notes" },
  { id: "res-2", title: "Unit 2: ER Modeling and Relational Algebra Formulas", subject: "Database Management Systems", size: "1.4 MB", downloads: 72, format: "PDF", type: "Cheat Sheet" },
  { id: "res-3", title: "Unit 3: Process Synchronization & Deadlock Banker's Algorithm", subject: "Operating Systems", size: "3.2 MB", downloads: 91, format: "PDF", type: "Handwritten Notes" },
  { id: "res-4", title: "Unit 4: Asymptotic Notations & Master Theorem Guide", subject: "Design & Analysis of Algorithms", size: "850 KB", downloads: 65, format: "PDF", type: "Lecture Notes" },
];

const StudentResources = () => {
  const [resources, setResources] = useState(SAMPLE_RESOURCES);
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [savedOffline, setSavedOffline] = useState({});

  const handleDownload = (res) => {
    toast.success(`Downloading "${res.title}" (${res.size})`);
  };

  const handleToggleOfflineSave = (resId) => {
    setSavedOffline((prev) => {
      const updated = { ...prev, [resId]: !prev[resId] };
      toast.success(!prev[resId] ? "Saved note to offline browser storage!" : "Removed from offline storage.");
      return updated;
    });
  };

  const filtered = resources.filter((r) => {
    const matchSubject = selectedSubject === "All" || r.subject === selectedSubject;
    const matchQuery = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || r.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSubject && matchQuery;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Student Study Material & Digital Library</h1>
              <p className="text-sm text-gray-500 mt-1">
                Browse semester handouts, compressed offline revision notes, and syllabus blueprints
              </p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-teal-500"
              />
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-teal-500"
              >
                <option value="All">All Subjects</option>
                <option value="Computer Networks">Computer Networks</option>
                <option value="Database Management Systems">Database Management Systems</option>
                <option value="Operating Systems">Operating Systems</option>
                <option value="Design & Analysis of Algorithms">Design & Analysis of Algorithms</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col justify-between hover:shadow-md transition">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700">{item.subject}</span>
                  <span className="text-xs font-mono text-gray-500">{item.size} â€¢ {item.format}</span>
                </div>
                <h3 className="text-base font-bold text-gray-900 mt-1">{item.title}</h3>
                <p className="text-xs text-gray-500 mt-1">Category: {item.type} â€¢ {item.downloads} downloads</p>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                <button
                  onClick={() => handleToggleOfflineSave(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    savedOffline[item.id] ? "bg-amber-100 text-amber-900 border border-amber-300" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {savedOffline[item.id] ? "âœ“ Offline Available" : "ðŸ’¾ Cache Offline"}
                </button>
                <button
                  onClick={() => handleDownload(item)}
                  className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold transition shadow-sm"
                >
                  ðŸ“¥ Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentResources;
