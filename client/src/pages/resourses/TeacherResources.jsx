import React, { useState } from "react";
import { toast } from "react-hot-toast";

const INITIAL_UPLOADS = [
  { id: "up-1", title: "Lecture 14 Slides: IP Addressing & NAT Traversal", subject: "Computer Networks", size: "3.5 MB", uploadedAt: "2026-10-28", downloads: 42 },
  { id: "up-2", title: "Practice Problem Set 4: Concurrency and Serializability", subject: "Database Management Systems", size: "1.1 MB", uploadedAt: "2026-11-01", downloads: 38 },
];

const TeacherResources = () => {
  const [uploads, setUploads] = useState(INITIAL_UPLOADS);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("Computer Networks");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = (e) => {
    e.preventDefault();
    if (!title.trim() || !selectedFile) {
      toast.error("Please enter a title and select a resource file to upload");
      return;
    }

    setIsUploading(true);
    setTimeout(() => {
      const newEntry = {
        id: `up-${Date.now()}`,
        title: title.trim(),
        subject,
        size: `${(Math.random() * 2 + 1).toFixed(1)} MB`,
        uploadedAt: new Date().toISOString().split("T")[0],
        downloads: 0,
      };

      setUploads([newEntry, ...uploads]);
      setTitle("");
      setSelectedFile(null);
      setIsUploading(false);
      toast.success("Study resource uploaded and distributed to student feeds!");
    }, 800);
  };

  const handleDelete = (id) => {
    setUploads((prev) => prev.filter((u) => u.id !== id));
    toast.success("Resource removed from repository");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900">Faculty Resource Management & Uploads</h1>
          <p className="text-sm text-gray-500 mt-1">Publish lecture slides, reference PDFs, and formula cheatsheets for rural students</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Upload New Academic Resource</h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full text-sm border border-gray-300 rounded-lg p-2.5 focus:ring-1 focus:ring-teal-500"
                >
                  <option>Computer Networks</option>
                  <option>Database Management Systems</option>
                  <option>Operating Systems</option>
                  <option>Design & Analysis of Algorithms</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Document / Topic Title</label>
                <input
                  type="text"
                  placeholder="e.g. Unit 3 Dijkstra Routing Algorithm Notes"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-sm border border-gray-300 rounded-lg p-2.5 focus:ring-1 focus:ring-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">File Attachment (Max 25MB)</label>
              <input
                type="file"
                onChange={(e) => setSelectedFile(e.target.files[0] || null)}
                className="text-xs text-gray-600 file:mr-2 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
              />
            </div>

            <button
              type="submit"
              disabled={isUploading}
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-semibold transition shadow-sm disabled:opacity-50"
            >
              {isUploading ? "Uploading..." : "ðŸš€ Publish Study Resource"}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-gray-200">
            <h2 className="text-base font-bold text-gray-900">Uploaded Course Materials</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {uploads.map((up) => (
              <div key={up.id} className="p-4 sm:p-5 flex items-center justify-between hover:bg-gray-50 transition">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700">{up.subject}</span>
                    <span className="text-xs text-gray-500">{up.size} â€¢ Uploaded {up.uploadedAt}</span>
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 mt-1">{up.title}</h3>
                  <p className="text-xs text-gray-500">{up.downloads} student downloads</p>
                </div>
                <button
                  onClick={() => handleDelete(up.id)}
                  className="text-xs text-red-600 hover:text-red-800 font-semibold px-3 py-1.5 rounded hover:bg-red-50 transition"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherResources;
