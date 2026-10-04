import React, { useState } from "react";

const MAX_FILE_SIZE_MB = 15;

const AssignmentDropzone = ({ onFileSelected, isSubmitting }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const validateAndSetFile = (file) => {
    setErrorMsg("");
    if (!file) return;

    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > MAX_FILE_SIZE_MB) {
      setErrorMsg(`File size (${fileSizeMB.toFixed(1)} MB) exceeds rural network limit of ${MAX_FILE_SIZE_MB} MB. Please compress or select a smaller file.`);
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    if (onFileSelected) {
      onFileSelected(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  return (
    <div className="assignment-dropzone-container my-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-all ${
          dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50"
        } ${isSubmitting ? "opacity-50 pointer-events-none" : ""}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="assignment-file-input"
          className="hidden"
          onChange={handleChange}
          accept=".pdf,.docx,.zip,.png,.jpg"
          disabled={isSubmitting}
        />
        <label htmlFor="assignment-file-input" className="cursor-pointer flex flex-col items-center">
          <svg
            className="w-10 h-10 text-gray-400 mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <span className="text-sm font-medium text-gray-700">
            {selectedFile ? selectedFile.name : "Drag & drop assignment file here, or click to browse"}
          </span>
          <span className="text-xs text-gray-500 mt-1">
            Max limit: 15MB (Optimized for Rural Bandwidth)
          </span>
        </label>
      </div>

      {errorMsg && (
        <div className="mt-2 p-2 text-xs text-red-700 bg-red-100 rounded border border-red-200">
          ⚠️ {errorMsg}
        </div>
      )}

      {selectedFile && !errorMsg && (
        <div className="mt-2 flex items-center justify-between text-xs text-green-700 bg-green-50 p-2 rounded border border-green-200">
          <span>Ready: {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)</span>
          <button
            type="button"
            onClick={() => {
              setSelectedFile(null);
              if (onFileSelected) onFileSelected(null);
            }}
            className="text-red-500 hover:underline ml-2"
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
};

export default AssignmentDropzone;
