/**
 * AnalyticsDashboard.jsx
 * Teacher-facing analytics dashboard page.
 * Displays: engagement KPIs, quiz score trend, attendance heatmap, grade distribution.
 * Week 13 — Rishabh Jain | Remote Classroom for Rural Colleges
 */

import React, { useState } from "react";
import useAnalytics from "../hooks/useAnalytics";
import useClassroom from "../hooks/useClassroom";

const DAY_LABELS = ["", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const GradeColors = {
  A: "#4caf50",
  B: "#8bc34a",
  C: "#ffc107",
  D: "#ff9800",
  F: "#f44336",
};

const AnalyticsDashboard = () => {
  const { classrooms } = useClassroom();
  const [selectedClassroom, setSelectedClassroom] = useState("");

  const {
    engagement,
    quizTrend,
    heatmap,
    gradeDistribution,
    loading,
    errors,
    refresh,
  } = useAnalytics(selectedClassroom);

  const handleClassroomChange = (e) => {
    setSelectedClassroom(e.target.value);
  };

  return (
    <div className="analytics-dashboard">
      {/* Header */}
      <div className="analytics-header">
        <h1>Analytics Dashboard</h1>
        <div className="classroom-selector-wrapper">
          <select
            id="classroom-select"
            value={selectedClassroom}
            onChange={handleClassroomChange}
            className="classroom-select"
          >
            <option value="">-- Select a Classroom --</option>
            {classrooms?.map((cls) => (
              <option key={cls._id} value={cls._id}>
                {cls.name}
              </option>
            ))}
          </select>
          <button
            className="refresh-btn"
            onClick={refresh}
            disabled={!selectedClassroom || loading}
            title="Refresh analytics"
          >
            ↻ Refresh
          </button>
        </div>
      </div>

      {!selectedClassroom && (
        <p className="placeholder-msg">
          Select a classroom to view analytics.
        </p>
      )}

      {loading && <div className="analytics-loader">Loading analytics…</div>}

      {selectedClassroom && !loading && (
        <>
          {/* Engagement KPI Cards */}
          {engagement && (
            <section className="kpi-section">
              <h2>Engagement Overview</h2>
              <div className="kpi-grid">
                <div className="kpi-card">
                  <span className="kpi-value">{engagement.avgQuizScore}</span>
                  <span className="kpi-label">Avg Quiz Score</span>
                </div>
                <div className="kpi-card">
                  <span className="kpi-value">
                    {engagement.attendancePercent}%
                  </span>
                  <span className="kpi-label">Attendance Rate</span>
                </div>
                <div className="kpi-card">
                  <span className="kpi-value">
                    {engagement.totalQuizAttempts}
                  </span>
                  <span className="kpi-label">Total Quiz Attempts</span>
                </div>
                <div className="kpi-card">
                  <span className="kpi-value">
                    {engagement.totalAssignments}
                  </span>
                  <span className="kpi-label">Total Assignments</span>
                </div>
              </div>
            </section>
          )}
          {errors.engagement && (
            <p className="error-msg">Engagement: {errors.engagement}</p>
          )}

          {/* Quiz Score Trend */}
          {quizTrend && (
            <section className="trend-section">
              <h2>Quiz Score Trend (by Week)</h2>
              {quizTrend.length === 0 ? (
                <p>No quiz data available.</p>
              ) : (
                <div className="trend-bar-chart">
                  {quizTrend.map((point) => (
                    <div
                      key={`${point.year}-W${point.week}`}
                      className="trend-bar-wrapper"
                      title={`Week ${point.week} ${point.year}: ${point.avgScore} avg`}
                    >
                      <div
                        className="trend-bar"
                        style={{ height: `${Math.max(point.avgScore, 4)}%` }}
                      />
                      <span className="trend-bar-label">W{point.week}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
          {errors.quizTrend && (
            <p className="error-msg">Quiz Trend: {errors.quizTrend}</p>
          )}

          {/* Attendance Heatmap */}
          {heatmap && (
            <section className="heatmap-section">
              <h2>Attendance by Day of Week</h2>
              <div className="heatmap-grid">
                {heatmap.map((cell) => (
                  <div
                    key={cell.dayOfWeek}
                    className="heatmap-cell"
                    style={{
                      opacity: 0.3 + (cell.rate / 100) * 0.7,
                      backgroundColor: "#2196f3",
                    }}
                    title={`${DAY_LABELS[cell.dayOfWeek]}: ${cell.rate}% attendance`}
                  >
                    <span className="heatmap-day">
                      {DAY_LABELS[cell.dayOfWeek]}
                    </span>
                    <span className="heatmap-rate">{cell.rate}%</span>
                  </div>
                ))}
              </div>
            </section>
          )}
          {errors.heatmap && (
            <p className="error-msg">Heatmap: {errors.heatmap}</p>
          )}

          {/* Grade Distribution */}
          {gradeDistribution && (
            <section className="grade-dist-section">
              <h2>Grade Distribution</h2>
              <div className="grade-dist-bars">
                {gradeDistribution.map((g) => (
                  <div key={g.grade} className="grade-dist-row">
                    <span
                      className="grade-label"
                      style={{ color: GradeColors[g.grade] || "#888" }}
                    >
                      {g.grade || "N/A"}
                    </span>
                    <div className="grade-dist-bar-bg">
                      <div
                        className="grade-dist-bar-fill"
                        style={{
                          width: `${Math.min(g.count * 10, 100)}%`,
                          backgroundColor: GradeColors[g.grade] || "#888",
                        }}
                      />
                    </div>
                    <span className="grade-count">{g.count}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
          {errors.gradeDistribution && (
            <p className="error-msg">
              Grade Distribution: {errors.gradeDistribution}
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
