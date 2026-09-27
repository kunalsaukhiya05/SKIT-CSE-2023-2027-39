import React, { useState } from "react";
import { toast } from "react-hot-toast";

/**
 * MeetingLobby Pre-Join Interface
 * Developed by: Manish Kumar <b230960@skit.ac.in>
 * Sprint 3: Classroom & Meeting Management UI
 * Allows rural students to test network connectivity and mic/cam before joining WebRTC session.
 */
const MeetingLobby = ({ classTitle = "Live Class", onJoin }) => {
  const [micActive, setMicActive] = useState(false);
  const [camActive, setCamActive] = useState(false);
  const [networkQuality, setNetworkQuality] = useState("Good (3G/4G)");

  const handleToggleMic = () => {
    setMicActive((prev) => !prev);
    toast.success(!micActive ? "Microphone enabled" : "Microphone muted");
  };

  const handleToggleCam = () => {
    setCamActive((prev) => !prev);
    toast.success(!camActive ? "Camera enabled" : "Camera turned off");
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 max-w-md mx-auto">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">{classTitle}</h3>
        <p className="text-sm text-gray-500 mt-1">Pre-join hardware & connectivity check</p>
      </div>

      <div className="aspect-video bg-gray-900 rounded-xl flex items-center justify-center relative overflow-hidden mb-6">
        {camActive ? (
          <div className="text-emerald-400 text-sm font-medium">Camera Feed Active</div>
        ) : (
          <div className="text-gray-400 text-sm">Camera is Off (Preserving Bandwidth)</div>
        )}
        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded text-xs text-white">
          📶 {networkQuality}
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 mb-6">
        <button
          onClick={handleToggleMic}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            micActive ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {micActive ? "🎙️ Mic On" : "🔇 Mic Off"}
        </button>
        <button
          onClick={handleToggleCam}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            camActive ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {camActive ? "📹 Camera On" : "🚫 Camera Off"}
        </button>
      </div>

      <button
        onClick={onJoin}
        className="w-full py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg shadow-teal-600/20 transition-all text-sm"
      >
        Join Classroom Now
      </button>
    </div>
  );
};

export default MeetingLobby;
