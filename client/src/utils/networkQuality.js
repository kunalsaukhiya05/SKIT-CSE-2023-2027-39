/**
 * Network Quality & Rural Connectivity Diagnostics Utility
 * Author: Kunal Saukhiya <hgkunal@gmail.com>
 * Sprint 4 / Week 9: Dynamic bandwidth adaptation for rural 2G/3G/4G zones
 */

export const getNetworkInfo = () => {
  if (typeof navigator === "undefined" || !navigator.connection) {
    return {
      effectiveType: "unknown",
      downlink: 10,
      rtt: 50,
      saveData: false,
      isRuralLowBandwidth: false,
    };
  }

  const { effectiveType, downlink, rtt, saveData } = navigator.connection;
  const isRuralLowBandwidth =
    effectiveType === "slow-2g" ||
    effectiveType === "2g" ||
    effectiveType === "3g" ||
    saveData === true ||
    (downlink && downlink < 1.0);

  return {
    effectiveType: effectiveType || "unknown",
    downlink: downlink || 0,
    rtt: rtt || 0,
    saveData: Boolean(saveData),
    isRuralLowBandwidth,
  };
};

export const subscribeNetworkQuality = (callback) => {
  if (typeof navigator === "undefined" || !navigator.connection) return () => {};

  const handler = () => callback(getNetworkInfo());
  navigator.connection.addEventListener("change", handler);
  return () => navigator.connection.removeEventListener("change", handler);
};
