const express = require("express");
const router = express.Router();
const { reconcileOfflineSyncQueue, getSyncAuditLogs } = require("../contollers/syncAudit.controller");

router.post("/reconcile", reconcileOfflineSyncQueue);
router.get("/logs", getSyncAuditLogs);

module.exports = router;
