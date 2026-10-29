import React, { useState, useEffect } from "react";
import axios from "axios";

const RuralTelemetryPill = ({ classId = "general" }) => {
  const [latencyMs, setLatencyMs] = useState(48);
  const [tier, setTier] = useState("WiFi / 4G");
  const [dataSaverActive, setDataSaverActive] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const pingCheck = async () => {
      try {
        const start = Date.now();
        const res = await axios.post(
          `${import.meta.env.VITE_BASE_URL || "/"}api/telemetry/ping`,
          {
            clientTimestamp: start,
            classId,
            effectiveType: navigator.connection?.effectiveType || "4g",
            downlinkSpeed: navigator.connection?.downlink || 5,
          },
          { timeout: 4000 }
        );

        if (!isMounted) return;

        const rtt = res.data?.latencyMs || Date.now() - start;
        setLatencyMs(rtt);

        if (rtt > 450) {
          setTier("Rural 2G Edge");
          setDataSaverActive(true);
        } else if (rtt > 180) {
          setTier("3G Mobile");
        } else {
          setTier("WiFi / 4G");
        }
      } catch (err) {
        if (!isMounted) return;
        setLatencyMs(550);
        setTier("Rural Edge (Offline/High Jitter)");
        setDataSaverActive(true);
      }
    };

    pingCheck();
    const interval = setInterval(pingCheck, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [classId]);

  const getPillColor = () => {
    if (latencyMs > 400) return "bg-red-500 text-white";
    if (latencyMs > 180) return "bg-amber-500 text-white";
    return "bg-emerald-600 text-white";
  };

  return (
    <div
      className="relative inline-block text-xs font-sans"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`flex items-center gap-1.5 px-3 py-1 rounded-full shadow-sm cursor-pointer transition ${getPillColor()}`}
      >
        <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
        <span className="font-bold">{latencyMs} ms</span>
        <span className="hidden sm:inline opacity-90">â€¢ {tier}</span>
        {dataSaverActive && <span className="bg-white/20 px-1.5 py-0.2 rounded font-mono text-[10px]">SAVER</span>}
      </div>

      {isHovered && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white text-gray-800 rounded-lg shadow-xl border border-gray-200 p-3 z-50">
          <p className="font-bold text-gray-900 border-b pb-1 mb-2">Network Health Telemetry</p>
          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span className="text-gray-500">Latency (RTT):</span>
              <span className="font-semibold">{latencyMs} ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Effective Tier:</span>
              <span className="font-semibold">{tier}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Data Saver Mode:</span>
              <span className="font-semibold text-teal-600">{dataSaverActive ? "Enabled" : "Disabled"}</span>
            </div>
          </div>
          <button
            onClick={() => setDataSaverActive(!dataSaverActive)}
            className="w-full mt-3 py-1 px-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-[11px] font-semibold rounded transition"
          >
            {dataSaverActive ? "Turn Off Data Saver" : "Enable Data Saver (Audio Only)"}
          </button>
        </div>
      )}
    </div>
  );
};

export default RuralTelemetryPill;
