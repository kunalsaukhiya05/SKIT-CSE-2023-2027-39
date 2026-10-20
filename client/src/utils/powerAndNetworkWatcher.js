/**
 * Rural Device Power & Metered Network Mode Detector
 * Author: Kunal Saukhiya <hgkunal@gmail.com>
 * Sprint 5 / Week 11: Smart throttling for rural mobile devices with limited battery/data
 */

export const subscribeToDeviceConstraints = (onConstraintChange) => {
  const state = {
    isLowBattery: false,
    isMetered: false,
    batteryLevel: 100,
    saveData: false,
  };

  const notify = () => {
    if (typeof onConstraintChange === "function") {
      onConstraintChange({ ...state });
    }
  };

  // Inspect Network Information API
  if (typeof navigator !== "undefined" && navigator.connection) {
    const conn = navigator.connection;
    state.saveData = !!conn.saveData;
    state.isMetered = conn.saveData || conn.effectiveType === "2g" || conn.effectiveType === "slow-2g";

    conn.addEventListener("change", () => {
      state.saveData = !!conn.saveData;
      state.isMetered = conn.saveData || conn.effectiveType === "2g" || conn.effectiveType === "slow-2g";
      notify();
    });
  }

  // Inspect Battery Status API
  if (typeof navigator !== "undefined" && navigator.getBattery) {
    navigator.getBattery().then((battery) => {
      const updateBattery = () => {
        state.batteryLevel = Math.round(battery.level * 100);
        state.isLowBattery = !battery.charging && state.batteryLevel <= 20;
        notify();
      };

      updateBattery();
      battery.addEventListener("levelchange", updateBattery);
      battery.addEventListener("chargingchange", updateBattery);
    }).catch(() => {
      // Battery API not permitted or supported
    });
  }

  notify();
  return state;
};

export const shouldThrottleMediaStreaming = () => {
  if (typeof navigator === "undefined") return false;
  const isConnSlow =
    navigator.connection &&
    (navigator.connection.saveData ||
      navigator.connection.effectiveType === "2g" ||
      navigator.connection.effectiveType === "slow-2g");
  return Boolean(isConnSlow);
};
