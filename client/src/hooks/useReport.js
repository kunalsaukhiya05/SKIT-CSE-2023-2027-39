// client/src/hooks/useReport.js
// Week 15 — Custom React hook for student progress reports and CSV export
// Rishabh Jain | SKIT CSE 2023-2027 Group 39

import { useState, useCallback } from "react";
import api from "../utils/api";

/**
 * useReport — Hook to fetch student progress data, trigger CSV export,
 *             and email the report.
 *
 * @param {string} studentId   - The student's ID (from auth context or props)
 * @param {string} [classId]   - Optional class ID for CSV gradebook export
 */
export default function useReport(studentId, classId) {
  const [progressData, setProgressData]   = useState(null);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState(null);
  const [emailStatus, setEmailStatus]     = useState(null); // null | 'sending' | 'sent' | 'failed'

  /**
   * fetchProgressReport — loads grade + attendance summary for the student.
   */
  const fetchProgressReport = useCallback(async () => {
    if (!studentId) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/reports/student-progress/${studentId}`);
      setProgressData(data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load progress report");
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  /**
   * downloadGradebookCSV — triggers browser download of the class gradebook CSV.
   * Only available for teachers (classId must be provided).
   */
  const downloadGradebookCSV = useCallback(async () => {
    if (!classId) return;
    try {
      const response = await api.get(`/reports/class-gradebook-csv/${classId}`, {
        responseType: "blob",
      });
      const url      = window.URL.createObjectURL(new Blob([response.data]));
      const link     = document.createElement("a");
      link.href      = url;
      link.setAttribute("download", `gradebook_class_${classId}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err?.response?.data?.message || "CSV download failed");
    }
  }, [classId]);

  /**
   * emailProgressReport — sends the progress report to the student's email.
   */
  const emailProgressReport = useCallback(async () => {
    if (!studentId) return;
    setEmailStatus("sending");
    try {
      await api.post(`/reports/email-progress/${studentId}`);
      setEmailStatus("sent");
    } catch (err) {
      setEmailStatus("failed");
      setError(err?.response?.data?.message || "Failed to email report");
    }
  }, [studentId]);

  return {
    progressData,
    loading,
    error,
    emailStatus,
    fetchProgressReport,
    downloadGradebookCSV,
    emailProgressReport,
  };
}
