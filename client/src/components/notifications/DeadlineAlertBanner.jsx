import React from "react";

const DeadlineAlertBanner = ({ pendingAssignments = [], onSelectAssignment }) => {
  if (!pendingAssignments || pendingAssignments.length === 0) {
    return null;
  }

  const nearest = pendingAssignments[0];

  const getTimeRemainingStr = (deadlineDate) => {
    const total = Date.parse(deadlineDate) - Date.parse(new Date());
    if (total <= 0) return "Due Now";
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    if (days > 0) return `${days} day${days > 1 ? "s" : ""} left`;
    return `${hours} hour${hours > 1 ? "s" : ""} left`;
  };

  return (
    <div className="deadline-alert-banner bg-amber-50 border-l-4 border-amber-500 p-4 mb-4 rounded shadow-sm flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-amber-100 rounded-full text-amber-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-amber-900">
            Upcoming Deadline Alert: {nearest.title || "Pending Assignment"}
          </h4>
          <p className="text-xs text-amber-700">
            Subject: {nearest.subject || "General"} | Due: {getTimeRemainingStr(nearest.deadline)}
          </p>
        </div>
      </div>
      {onSelectAssignment && (
        <button
          onClick={() => onSelectAssignment(nearest)}
          className="text-xs font-medium bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded transition"
        >
          View & Submit
        </button>
      )}
    </div>
  );
};

export default DeadlineAlertBanner;
