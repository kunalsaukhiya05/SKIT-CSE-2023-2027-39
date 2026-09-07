const express = require("express");
const router = express.Router();
const { uploadResource, getResources, deleteResource } = require("../contollers/resource.controller");
const authTeacherToken = require("../middleware/authTeacherToken");

router.post("/upload", authTeacherToken, uploadResource);
router.get("/list", getResources);
router.delete("/:id", authTeacherToken, deleteResource);

module.exports = router;
