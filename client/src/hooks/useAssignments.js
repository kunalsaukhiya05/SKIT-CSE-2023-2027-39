import { useState, useCallback } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:4000/";

/**
 * Custom hook for student submissions, teacher grading, and assignment stats [Manish Regar]
 * Includes draft autosave and offline resilience for rural colleges.
 */
export const useAssignments = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [myGrades, setMyGrades] = useState(null);
  const [classStats, setClassStats] = useState(null);

  // Submit assignment with draft fallback
  const submitAssignment = useCallback(async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${BASE_URL}api/assignment/submit`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Submission failed";
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Grade student submission (Teacher)
  const gradeSubmission = useCallback(async (submissionId, gradeData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(
        `${BASE_URL}api/assignment/grade/${submissionId}`,
        gradeData,
        { withCredentials: true }
      );
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Grading failed";
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch class-wide assignment statistics
  const fetchClassStats = useCallback(async (classId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${BASE_URL}api/assignment/class-stats/${classId}`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setClassStats(response.data);
      }
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to fetch stats";
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch personal assignment grades & feedback (Student)
  const fetchMyGrades = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${BASE_URL}api/assignment/student/my-grades`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setMyGrades(response.data);
      }
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to fetch grades";
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    myGrades,
    classStats,
    submitAssignment,
    gradeSubmission,
    fetchClassStats,
    fetchMyGrades,
  };
};

export default useAssignments;
