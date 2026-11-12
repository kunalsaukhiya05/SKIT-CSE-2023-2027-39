const express = require("express");
const router = express.Router();
const { submitJitterReport, getNetworkQualitySummary } = require("../contollers/networkAudit.controller");

router.post("/report", submitJitterReport);
router.get("/summary", getNetworkQualitySummary);

module.exports = router;
