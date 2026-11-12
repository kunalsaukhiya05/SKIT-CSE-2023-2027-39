/**
 * Rural Network Jitter & Quality Audit Controller
 * Author: Kunal Saukhiya <hgkunal@gmail.com>
 * Sprint 7 / Week 14: Diagnostics and audio-priority bandwidth calibration
 */

const jitterBuffer = [];
const MAX_JITTER_RECORDS = 150;

const submitJitterReport = async (req, res) => {
  try {
    const { studentId, classId, pingSamples, packetLossPct, effectiveType } = req.body;

    const samples = Array.isArray(pingSamples) ? pingSamples : [pingSamples || 0];
    const avgPing = samples.length > 0 ? Math.round(samples.reduce((a, b) => a + b, 0) / samples.length) : 0;

    // Calculate jitter variance (mean absolute deviation)
    const jitterVariance =
      samples.length > 1
        ? Math.round(samples.reduce((acc, val) => acc + Math.abs(val - avgPing), 0) / samples.length)
        : 0;

    const auditEntry = {
      studentId: studentId || "anonymous",
      classId: classId || "general",
      avgPing,
      jitterVariance,
      packetLossPct: packetLossPct || 0,
      effectiveType: effectiveType || "unknown",
      timestamp: new Date().toISOString(),
    };

    jitterBuffer.unshift(auditEntry);
    if (jitterBuffer.length > MAX_JITTER_RECORDS) jitterBuffer.pop();

    const isSevereJitter = jitterVariance > 120 || (packetLossPct && packetLossPct > 15);
    const recommendedMode = isSevereJitter || effectiveType === "2g" ? "audio_only" : "adaptive_video";

    return res.status(200).json({
      success: true,
      jitterVariance,
      avgPing,
      recommendedMode,
      targetAudioBitrateKbps: isSevereJitter ? 16 : 32,
    });
  } catch (err) {
    console.error("Error in submitJitterReport:", err);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
  }
};

const getNetworkQualitySummary = async (req, res) => {
  try {
    const totalRecords = jitterBuffer.length;
    const avgJitter = totalRecords > 0 ? Math.round(jitterBuffer.reduce((sum, r) => sum + r.jitterVariance, 0) / totalRecords) : 0;
    const highJitterCount = jitterBuffer.filter((r) => r.jitterVariance > 120).length;

    return res.status(200).json({
      success: true,
      totalAuditedNodes: totalRecords,
      networkAvgJitterMs: avgJitter,
      severelyJitteredNodes: highJitterCount,
      audioFallbackRecommended: highJitterCount > totalRecords * 0.35,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Error in getNetworkQualitySummary:", err);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
  }
};

module.exports = {
  submitJitterReport,
  getNetworkQualitySummary,
};
