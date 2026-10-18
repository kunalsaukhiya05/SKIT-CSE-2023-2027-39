import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/**
 * useStudentGrades — fetches and aggregates a student's gradebook
 * across all enrolled subjects. [Rishabh Jain]
 *
 * @param {string} token  — JWT auth token for the student
 * @returns {{ grades, cumulativePercentage, loading, error, refetch }}
 */
const useStudentGrades = (token) => {
  const [grades, setGrades] = useState([]);
  const [cumulativePercentage, setCumulativePercentage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchGrades = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(`${BASE_URL}/api/gradebook/student`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGrades(data.entries || []);
      setCumulativePercentage(data.cumulativePercentage || 0);
    } catch (err) {
      console.error("useStudentGrades error:", err);
      setError(err?.response?.data?.message || "Failed to load grades");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchGrades();
  }, [fetchGrades]);

  // Derived: best and worst subject by overallPercentage [Rishabh Jain]
  const bestSubject = grades.length
    ? grades.reduce((a, b) => (a.overallPercentage >= b.overallPercentage ? a : b))
    : null;

  const worstSubject = grades.length
    ? grades.reduce((a, b) => (a.overallPercentage <= b.overallPercentage ? a : b))
    : null;

  // Quiz average across all subjects [Rishabh Jain]
  const quizAverage = (() => {
    const allScores = grades.flatMap((g) => g.quizScores.map((q) => q.percentage));
    return allScores.length
      ? Math.round(allScores.reduce((s, p) => s + p, 0) / allScores.length)
      : 0;
  })();

  return {
    grades,
    cumulativePercentage,
    loading,
    error,
    bestSubject,
    worstSubject,
    quizAverage,
    refetch: fetchGrades,
  };
};

export default useStudentGrades;
