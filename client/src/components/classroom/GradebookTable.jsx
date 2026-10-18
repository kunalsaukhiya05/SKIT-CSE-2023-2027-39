import React, { useState } from "react";

/**
 * GradebookTable — displays a teacher's class gradebook with sortable columns,
 * letter grade badges, and per-student quiz/assignment breakdown. [Rishabh Jain]
 *
 * Props:
 *  entries      {Array}   — gradebook entries from GET /api/gradebook/class
 *  subjectLabel {string}  — e.g. "Mathematics" shown in heading
 *  onSyncClick  {func}    — callback to trigger gradebook sync
 */
const GRADE_COLORS = {
  "A+": "#10b981",
  A: "#22c55e",
  "B+": "#84cc16",
  B: "#eab308",
  C: "#f97316",
  D: "#ef4444",
  F: "#6b7280",
};

const GradebookTable = ({ entries = [], subjectLabel = "Subject", onSyncClick }) => {
  const [sortKey, setSortKey] = useState("overallPercentage");
  const [sortAsc, setSortAsc] = useState(false);
  const [search, setSearch] = useState("");

  const handleSort = (key) => {
    if (sortKey === key) setSortAsc((prev) => !prev);
    else { setSortKey(key); setSortAsc(false); }
  };

  const filtered = entries
    .filter((e) => e.studentName.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const va = a[sortKey] ?? "";
      const vb = b[sortKey] ?? "";
      if (typeof va === "number") return sortAsc ? va - vb : vb - va;
      return sortAsc
        ? String(va).localeCompare(String(vb))
        : String(vb).localeCompare(String(va));
    });

  const SortIcon = ({ col }) => (
    <span style={{ marginLeft: 4, opacity: sortKey === col ? 1 : 0.3 }}>
      {sortAsc && sortKey === col ? "↑" : "↓"}
    </span>
  );

  if (!entries.length) {
    return (
      <div style={styles.empty}>
        <p>No gradebook entries found for <strong>{subjectLabel}</strong>.</p>
        {onSyncClick && (
          <button style={styles.syncBtn} onClick={onSyncClick}>
            Sync Gradebook
          </button>
        )}
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      {/* Header */}
      <div style={styles.header}>
        <h3 style={styles.title}>Gradebook — {subjectLabel}</h3>
        <div style={styles.actions}>
          <input
            type="text"
            placeholder="Search student..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.search}
          />
          {onSyncClick && (
            <button style={styles.syncBtn} onClick={onSyncClick}>
              ↻ Sync
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.theadRow}>
              <th style={styles.th}>#</th>
              <th style={{ ...styles.th, cursor: "pointer" }} onClick={() => handleSort("studentName")}>
                Student <SortIcon col="studentName" />
              </th>
              <th style={{ ...styles.th, cursor: "pointer" }} onClick={() => handleSort("overallPercentage")}>
                Overall % <SortIcon col="overallPercentage" />
              </th>
              <th style={{ ...styles.th, cursor: "pointer" }} onClick={() => handleSort("grade")}>
                Grade <SortIcon col="grade" />
              </th>
              <th style={styles.th}>Quizzes</th>
              <th style={styles.th}>Assignments</th>
              <th style={{ ...styles.th, cursor: "pointer" }} onClick={() => handleSort("attendancePercent")}>
                Attendance % <SortIcon col="attendancePercent" />
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((entry, idx) => (
              <tr
                key={entry._id || idx}
                style={{ ...styles.row, backgroundColor: idx % 2 === 0 ? "#fff" : "#f9fafb" }}
              >
                <td style={styles.td}>{idx + 1}</td>
                <td style={{ ...styles.td, fontWeight: 600 }}>{entry.studentName}</td>
                <td style={styles.td}>
                  <div style={styles.progressWrap}>
                    <div
                      style={{
                        ...styles.progressBar,
                        width: `${entry.overallPercentage}%`,
                        backgroundColor: GRADE_COLORS[entry.grade] || "#6b7280",
                      }}
                    />
                    <span style={styles.progressLabel}>{entry.overallPercentage}%</span>
                  </div>
                </td>
                <td style={styles.td}>
                  <span
                    style={{
                      ...styles.badge,
                      backgroundColor: GRADE_COLORS[entry.grade] || "#6b7280",
                    }}
                  >
                    {entry.grade}
                  </span>
                </td>
                <td style={styles.td}>
                  {entry.quizScores.length > 0
                    ? `${entry.quizScores.length} quiz(es) · avg ${Math.round(
                        entry.quizScores.reduce((s, q) => s + q.percentage, 0) /
                          entry.quizScores.length
                      )}%`
                    : "—"}
                </td>
                <td style={styles.td}>
                  {entry.assignmentScores.length > 0
                    ? `${entry.assignmentScores.length} submission(s)`
                    : "—"}
                </td>
                <td style={styles.td}>
                  <span
                    style={{
                      color: entry.attendancePercent >= 75 ? "#10b981" : "#ef4444",
                      fontWeight: 600,
                    }}
                  >
                    {entry.attendancePercent ?? 0}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p style={styles.footer}>{filtered.length} student(s) shown</p>
    </div>
  );
};

const styles = {
  wrapper: { fontFamily: "Inter, sans-serif", backgroundColor: "#fff", borderRadius: 12, boxShadow: "0 2px 12px rgba(0,0,0,0.08)", overflow: "hidden" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid #e5e7eb" },
  title: { margin: 0, fontSize: 16, fontWeight: 700, color: "#111827" },
  actions: { display: "flex", gap: 8, alignItems: "center" },
  search: { padding: "6px 12px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 13, outline: "none" },
  syncBtn: { padding: "6px 14px", borderRadius: 8, border: "none", backgroundColor: "#4f46e5", color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600 },
  tableWrap: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 13 },
  theadRow: { backgroundColor: "#f3f4f6" },
  th: { padding: "10px 16px", textAlign: "left", fontWeight: 600, color: "#374151", whiteSpace: "nowrap" },
  row: { transition: "background 0.15s" },
  td: { padding: "10px 16px", color: "#374151", verticalAlign: "middle" },
  progressWrap: { position: "relative", backgroundColor: "#e5e7eb", borderRadius: 4, height: 18, minWidth: 100 },
  progressBar: { position: "absolute", top: 0, left: 0, height: "100%", borderRadius: 4, transition: "width 0.3s ease" },
  progressLabel: { position: "relative", zIndex: 1, paddingLeft: 6, fontSize: 11, fontWeight: 700, color: "#111827" },
  badge: { display: "inline-block", padding: "2px 10px", borderRadius: 12, color: "#fff", fontWeight: 700, fontSize: 12 },
  empty: { padding: 40, textAlign: "center", color: "#6b7280" },
  footer: { padding: "10px 20px", fontSize: 12, color: "#9ca3af", borderTop: "1px solid #e5e7eb" },
};

export default GradebookTable;
