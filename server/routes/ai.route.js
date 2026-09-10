const express = require("express");
const router = express.Router();
const { aiChat } = require("../contollers/ai.controller");

router.post("/chat", aiChat);

module.exports = router;
