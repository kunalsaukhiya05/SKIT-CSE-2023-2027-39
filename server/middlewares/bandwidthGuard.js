/**
 * Rural Low-Bandwidth Adaptation & Rate Guard Middleware
 * Author: Kunal Saukhiya <hgkunal@gmail.com>
 * Sprint 5 / Week 11: Throttle bulky payloads and inject rural optimization headers
 */

const bandwidthGuard = (options = {}) => {
  const defaultThreshold = options.maxPayloadKb || 512;

  return (req, res, next) => {
    const isSaveData = req.headers["save-data"] === "on";
    const clientECT = req.headers["ect"] || "unknown";

    const isRural2G = isSaveData || clientECT === "2g" || clientECT === "slow-2g";

    // Set rural optimization response headers
    res.setHeader("X-Rural-Network-Guard", "active");
    if (isRural2G) {
      res.setHeader("X-Bandwidth-Adapted", "low-payload-mode");
      res.setHeader("Cache-Control", "public, max-age=1800, stale-while-revalidate=3600");
    }

    req.isRuralNetwork = isRural2G;
    req.bandwidthThresholdKb = isRural2G ? Math.min(defaultThreshold, 128) : defaultThreshold;

    next();
  };
};

module.exports = bandwidthGuard;
