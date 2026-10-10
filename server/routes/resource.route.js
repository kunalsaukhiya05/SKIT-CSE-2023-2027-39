const express = require("express");
const router = express.Router();
const { streamResourceChunk, uploadResource, getLightweightResources, streamResource, getResources, deleteResource } = require("../contollers/resource.controller");
const authTeacherToken = require("../middleware/authTeacherToken");

router.post("/upload", authTeacherToken, uploadResource);
router.get("/lightweight", getLightweightResources);
router.get("/stream/:id", streamResource);
router.get("/stream-chunk/:id", streamResourceChunk);
router.get("/list", getResources);
router.delete("/:id", authTeacherToken, deleteResource);

module.exports = router;



