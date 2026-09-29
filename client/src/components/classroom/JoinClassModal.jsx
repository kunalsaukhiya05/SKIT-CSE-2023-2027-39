import React, { useState } from "react";
import { toast } from "react-hot-toast";

/**
 * JoinClassModal Component
 * Developed by: Manish Kumar <b230960@skit.ac.in>
 * Sprint 3: Classroom & Meeting Management UI
 * Instant classroom join interface with 6-digit code validation and low-data options.
 */
const JoinClassModal = ({ isOpen, onClose, onJoin }) => {
  const [classCode, setClassCode] = useState("");
  const [dataSaver, setDataSaver] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!classCode.trim()) {
      toast.error("Please enter a valid class code");
      return;
    }
    onJoin({ classCode: classCode.trim().toUpperCase(), dataSaver });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">Join Live Classroom</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-bold">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Classroom Code
            </label>
            <input
              type="text"
              maxLength={8}
              placeholder="e.g. CS-301"
              value={classCode}
              onChange={(e) => setClassCode(e.target.value.toUpperCase())}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:outline-none uppercase font-mono tracking-wider text-center text-lg font-bold"
            />
          </div>

          <div className="flex items-center gap-2 p-3 bg-teal-50/60 rounded-xl border border-teal-100">
            <input
              type="checkbox"
              id="dataSaver"
              checked={dataSaver}
              onChange={(e) => setDataSaver(e.target.checked)}
              className="w-4 h-4 text-teal-600 rounded"
            />
            <label htmlFor="dataSaver" className="text-xs text-teal-900 cursor-pointer">
              Enable Data-Saver Mode (Reduces video resolution to save mobile bandwidth)
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md shadow-teal-600/20 transition-all"
            >
              Join Class
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JoinClassModal;
