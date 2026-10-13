import { useState, useCallback } from "react";
import axios from "axios";

/**
 * useStudentAnalytics — Custom hook to fetch and compute student performance analytics.
 * Aggregates quiz scores, assignment submissions, and attendance for a dashboard view.
 * [Rishabh Jain] Week 10 Sprint
 */
const useStudentAnalytics = (studentId) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAnalytics = useCallback(async () => {
    if (!studentId) return;
    setLoading(true);
    setError(null);

    try {
      const [quizRes, submissionRes] = await Promise.all([
        axios.get(`/api/quiz/attempt/mine`, { withCredentials: true }),
        axios.get(`/api/assignment/student/submissions`, { withCredentials: true }),
      ]);

      const quizAttempts = quizRes.data?.attempts || [];
      const submissions = submissionRes.data?.submissions || [];

      // Compute average quiz score [Rishabh Jain]
      const avgQuizScore =
        quizAttempts.length > 0
          ? Math.round(
              quizAttempts.reduce((acc, a) => acc + (a.percentage || 0), 0) /
                quizAttempts.length
            )
          : 0;

      // Submission on-time rate
      const onTimeSubmissions = submissions.filter((s) => s.status === "submitted").length;
      const lateSubmissions = submissions.filter((s) => s.status === "late").length;
      const submissionRate =
        submissions.length > 0
          ? Math.round((onTimeSubmissions / submissions.length) * 100)
          : 0;

      // Best quiz performance
      const bestQuiz =
        quizAttempts.length > 0
          ? quizAttempts.reduce((best, a) =>
              a.percentage > best.percentage ? a : best
            )
          : null;

      setAnalytics({
        totalQuizzesTaken: quizAttempts.length,
        avgQuizScore,
        submissionRate,
        onTimeSubmissions,
        lateSubmissions,
        totalSubmissions: submissions.length,
        bestQuiz,
        recentQuizzes: quizAttempts.slice(0, 5),
        recentSubmissions: submissions.slice(0, 5),
      });
    } catch (err) {
      console.error("Error fetching student analytics:", err);
      setError(err?.response?.data?.message || "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  return { analytics, loading, error, fetchAnalytics };
};

export default useStudentAnalytics;
