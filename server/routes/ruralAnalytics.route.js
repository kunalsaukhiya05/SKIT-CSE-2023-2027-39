const express = require("express");
const router = express.Router();
const { getClassroomConnectivityReport } = require("../contollers/ruralAnalytics.controller");

router.get("/report/:classId?", getClassroomConnectivityReport);

module.exports = router;
