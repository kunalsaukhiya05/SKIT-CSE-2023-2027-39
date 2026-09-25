import React from "react";

/**
 * ClassStatusBadge Component
 * Developed by: Manish Kumar <b230960@skit.ac.in>
 * Sprint 3: Classroom & Meeting Management UI
 * Displays live attendance status, connection quality, and active meeting indicators.
 */
const ClassStatusBadge = ({ status = "scheduled", liveCount = 0, isLowBandwidth = false }) => {
  const getBadgeStyle = () => {
    switch (status.toLowerCase()) {
      case "live":
        return "bg-emerald-100 text-emerald-800 border-emerald-300 animate-pulse";
      case "completed":
        return "bg-gray-100 text-gray-700 border-gray-300";
      case "cancelled":
        return "bg-rose-100 text-rose-800 border-rose-300";
      default:
        return "bg-sky-100 text-sky-800 border-sky-300";
    }
  };

  return (
    <div className="inline-flex items-center gap-2">
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide border ${getBadgeStyle()}`}
      >
        {status.toUpperCase()}
      </span>
      {status.toLowerCase() === "live" && (
        <span className="text-xs font-medium text-emerald-700 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
          {liveCount} Active
        </span>
      )}
      {isLowBandwidth && (
        <span
          className="text-xs px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200"
          title="Optimized for 2G/3G Cellular Networks"
        >
          📶 Low-Bandwidth Mode
        </span>
      )}
    </div>
  );
};

export default ClassStatusBadge;
