const fs = require("fs");
const path = require("path");

/**
 * BandwidthStreamer - Optimized resource streaming utility for low-bandwidth rural networks.
 * Calculates optimal chunk sizes based on network conditions and pipes stream responses.
 */
class BandwidthStreamer {
  static DEFAULT_CHUNK_SIZE = 64 * 1024; // 64KB chunks for 2G/3G connections

  /**
   * Determine optimal chunk size from network quality header or query parameter
   * @param {string} networkQuality - '2g' | '3g' | '4g'
   */
  static getOptimalChunkSize(networkQuality = "3g") {
    switch (networkQuality.toLowerCase()) {
      case "2g":
        return 32 * 1024; // 32KB
      case "3g":
        return 64 * 1024; // 64KB
      case "4g":
      default:
        return 256 * 1024; // 256KB
    }
  }

  /**
   * Stream file buffer or readable stream with chunked range headers
   */
  static streamChunkedResponse(req, res, filePath, networkQuality = "3g") {
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Requested resource file not found on server" });
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    const chunkSize = this.getOptimalChunkSize(networkQuality);

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : Math.min(start + chunkSize - 1, fileSize - 1);

      const chunklen = end - start + 1;
      const fileStream = fs.createReadStream(filePath, { start, end });

      const head = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunklen,
        "Content-Type": "application/octet-stream",
        "X-Bandwidth-Chunk-Size": `${chunklen} bytes`,
        "X-Network-Tier": networkQuality,
      };

      res.writeHead(206, head);
      fileStream.pipe(res);
    } else {
      const head = {
        "Content-Length": fileSize,
        "Content-Type": "application/octet-stream",
        "X-Network-Tier": networkQuality,
      };
      res.writeHead(200, head);
      fs.createReadStream(filePath).pipe(res);
    }
  }
}

module.exports = BandwidthStreamer;
