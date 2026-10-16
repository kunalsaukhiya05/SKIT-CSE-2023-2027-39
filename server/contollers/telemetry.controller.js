/**
 * Rural Network Telemetry & Node Health Controller
 * Author: Kunal Saukhiya <hgkunal@gmail.com>
 * Sprint 5 / Week 11: Real-time latency tracking and node heartbeat diagnostics
 */

// In-memory ping trace ring buffer (capped to prevent memory bloat in rural servers)
const pingBuffer = [];
const MAX_BUFFER_SIZE = 100;

const recordNodePing = async (req, res) => {
  try {
    const { clientTimestamp, studentId, classId, effectiveType, downlinkSpeed } = req.body;
    const serverReceivedAt = Date.now();
    const roundTripEst = clientTimestamp ? Math.max(0, serverReceivedAt - parseInt(clientTimestamp)) : 0;

    const record = {
      studentId: studentId || "anonymous",
      classId: classId || "general",
      effectiveType: effectiveType || "unknown",
      downlinkSpeed: downlinkSpeed || 0,
      roundTripEst,
      receivedAt: new Date(serverReceivedAt).toISOString(),
    };

    pingBuffer.unshift(record);
    if (pingBuffer.length > MAX_BUFFER_SIZE) {
      pingBuffer.pop();
    }

    return res.status(200).json({
      success: true,
      serverTime: serverReceivedAt,
      latencyMs: roundTripEst,
      suggestAudioOnly: roundTripEst > 450 || effectiveType === "2g" || effectiveType === "slow-2g",
    });
  } catch (err) {
    console.error("Error in recordNodePing:", err);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
  }
};

const getNodeHealthSummary = async (req, res) => {
  try {
    const avgLatency =
      pingBuffer.length > 0
        ? Math.round(pingBuffer.reduce((sum, item) => sum + item.roundTripEst, 0) / pingBuffer.length)
        : 0;

    const slowNodesCount = pingBuffer.filter(
      (item) => item.effectiveType === "2g" || item.effectiveType === "slow-2g" || item.roundTripEst > 400
    ).length;

    return res.status(200).json({
      success: true,
      activeNodesTracked: pingBuffer.length,
      averageLatencyMs: avgLatency,
      ruralSlowNodesCount: slowNodesCount,
      recentTelemetry: pingBuffer.slice(0, 15),
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Error in getNodeHealthSummary:", err);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
  }
};

module.exports = {
  recordNodePing,
  getNodeHealthSummary,
};
