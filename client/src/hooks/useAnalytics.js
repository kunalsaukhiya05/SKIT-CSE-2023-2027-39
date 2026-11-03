/**
 * useAnalytics.js
 * Custom hook for fetching and caching classroom analytics data.
 * Supports parallel data fetching with individual loading states.
 * Week 13 — Rishabh Jain | Remote Classroom for Rural Colleges
 */

import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const BASE = "/api/analytics";

/**
 * @param {string} classroomId - MongoDB ObjectId of the classroom.
 * @returns {{
 *   engagement: object|null,
 *   quizTrend: object[]|null,
 *   heatmap: object[]|null,
 *   gradeDistribution: object[]|null,
 *   loading: boolean,
 *   errors: object,
 *   refresh: () => void
 * }}
 */
const useAnalytics = (classroomId) => {
  const [engagement, setEngagement] = useState(null);
  const [quizTrend, setQuizTrend] = useState(null);
  const [heatmap, setHeatmap] = useState(null);
  const [gradeDistribution, setGradeDistribution] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const fetchAll = useCallback(async () => {
    if (!classroomId) return;

    setLoading(true);
    setErrors({});

    const endpoints = [
      {
        key: "engagement",
        url: `${BASE}/classroom/${classroomId}/engagement`,
        setter: setEngagement,
      },
      {
        key: "quizTrend",
        url: `${BASE}/classroom/${classroomId}/quiz-trend`,
        setter: (data) => setQuizTrend(data.trend),
      },
      {
        key: "heatmap",
        url: `${BASE}/classroom/${classroomId}/attendance-heatmap`,
        setter: (data) => setHeatmap(data.heatmap),
      },
      {
        key: "gradeDistribution",
        url: `${BASE}/classroom/${classroomId}/grade-distribution`,
        setter: (data) => setGradeDistribution(data.distribution),
      },
    ];

    const newErrors = {};

    await Promise.allSettled(
      endpoints.map(async ({ key, url, setter }) => {
        try {
          const res = await axios.get(url);
          setter(res.data);
        } catch (err) {
          newErrors[key] =
            err.response?.data?.message || "Failed to load data";
        }
      })
    );

    setErrors(newErrors);
    setLoading(false);
  }, [classroomId]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return {
    engagement,
    quizTrend,
    heatmap,
    gradeDistribution,
    loading,
    errors,
    refresh: fetchAll,
  };
};

export default useAnalytics;
