const express = require("express");
const router = express.Router();
const { recordNodePing, getNodeHealthSummary } = require("../contollers/telemetry.controller");

router.post("/ping", recordNodePing);
router.get("/health-summary", getNodeHealthSummary);

module.exports = router;
