const express = require("express");
const router = express.Router();
const { uploadResource, getLightweightResources, streamResource, getResources, deleteResource } = require("../contollers/resource.controller");
const authTeacherToken = require("../middleware/authTeacherToken");

router.post("/upload", authTeacherToken, uploadResource);
router.get("/lightweight", getLightweightResources);
router.get("/stream/:id", streamResource);
router.get("/list", getResources);
router.delete("/:id", authTeacherToken, deleteResource);

module.exports = router;


