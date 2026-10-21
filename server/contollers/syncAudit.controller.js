/**
 * Offline Sync Audit & Conflict Resolution Controller
 * Author: Kunal Saukhiya <hgkunal@gmail.com>
 * Sprint 5 / Week 11: Idempotent queue reconciliation and timestamp resolution
 */

const auditLogBuffer = [];

const reconcileOfflineSyncQueue = async (req, res) => {
  try {
    const { items, clientDeviceId } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "Sync items array is required" });
    }

    const processed = [];
    const conflicts = [];

    for (const item of items) {
      const { trackingId, entityType, action, timestamp, payload } = item;
      const clientTime = new Date(timestamp || Date.now()).getTime();
      const serverTime = Date.now();

      // Detect skew (> 7 days or in future)
      const isSkewed = Math.abs(serverTime - clientTime) > 7 * 24 * 60 * 60 * 1000;

      if (isSkewed) {
        conflicts.push({
          trackingId,
          reason: "Timestamp outside tolerance window",
          resolvedAction: "discarded_for_manual_review",
        });
      } else {
        processed.push({
          trackingId,
          entityType,
          action,
          status: "reconciled",
          reconciledAt: new Date(serverTime).toISOString(),
        });
      }

      auditLogBuffer.unshift({
        trackingId,
        clientDeviceId: clientDeviceId || "unknown",
        entityType,
        status: isSkewed ? "conflict" : "reconciled",
        timestamp: new Date().toISOString(),
      });
      if (auditLogBuffer.length > 200) auditLogBuffer.pop();
    }

    return res.status(200).json({
      success: true,
      message: `Reconciled ${processed.length} items with ${conflicts.length} conflicts`,
      reconciledCount: processed.length,
      conflictCount: conflicts.length,
      processed,
      conflicts,
    });
  } catch (err) {
    console.error("Error in reconcileOfflineSyncQueue:", err);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
  }
};

const getSyncAuditLogs = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      totalAudited: auditLogBuffer.length,
      logs: auditLogBuffer.slice(0, 50),
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
  }
};

module.exports = {
  reconcileOfflineSyncQueue,
  getSyncAuditLogs,
};
