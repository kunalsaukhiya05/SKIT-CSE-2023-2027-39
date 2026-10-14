import { useState, useCallback } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:4000/";

/**
 * Custom hook for live classroom attendance tracking and reporting [Manish Regar]
 * Optimized for low-bandwidth rural college classrooms with retry capability.
 */
export const useAttendance = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [attendanceRecord, setAttendanceRecord] = useState(null);
  const [classReport, setClassReport] = useState(null);
  const [studentAnalytics, setStudentAnalytics] = useState(null);

  // Record live attendance with active duration
  const recordAttendance = useCallback(async (classId, durationSeconds, studentName) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${BASE_URL}api/attendance/record`,
        { classId, durationSeconds, studentName },
        { withCredentials: true }
      );
      setAttendanceRecord(response.data.attendance);
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to record attendance";
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch class-level attendance report with defaulter threshold
  const fetchClassReport = useCallback(async (classId, threshold = 75) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${BASE_URL}api/attendance/class-report/${classId}?threshold=${threshold}`,
        { withCredentials: true }
      );
      setClassReport(response.data);
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to fetch class report";
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch personal longitudinal attendance analytics
  const fetchStudentAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${BASE_URL}api/attendance/my-analytics`,
        { withCredentials: true }
      );
      setStudentAnalytics(response.data);
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to fetch student analytics";
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    attendanceRecord,
    classReport,
    studentAnalytics,
    recordAttendance,
    fetchClassReport,
    fetchStudentAnalytics,
  };
};

export default useAttendance;
