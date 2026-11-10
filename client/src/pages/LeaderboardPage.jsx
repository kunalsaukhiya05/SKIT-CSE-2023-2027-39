/**
 * LeaderboardPage.jsx
 * Full-page classroom leaderboard for students and teachers.
 * Supports tab switching between Overall / Quiz / Attendance categories
 * and an optional week-range filter.
 *
 * Sprint Week 13 (Nov 6-12, 2026) — Rishabh Jain
 */

import React, { useState, useContext } from 'react';
import { useLeaderboard } from '../hooks/useLeaderboard';
import LeaderboardCard from '../components/classroom/LeaderboardCard';
import { AppContext } from '../context/context';

const CATEGORIES = [
  { key: 'overall',    label: 'Overall' },
  { key: 'quiz',       label: 'Quiz'    },
  { key: 'attendance', label: 'Attendance' },
];

function LeaderboardPage() {
  const { user, selectedClass } = useContext(AppContext);
  const classId = selectedClass?._id ?? selectedClass?.id ?? '';

  const [category, setCategory] = useState('overall');
  const [from, setFrom] = useState('');
  const [to,   setTo  ] = useState('');

  const { entries, loading, error, refresh } = useLeaderboard({ classId, category, from, to });

  /* ── Render ─────────────────────────────────────────────── */
  return (
    <div style={styles.page}>
      {/* Page header */}
      <div style={styles.header}>
        <h1 style={styles.title}>🏆 Leaderboard</h1>
        {selectedClass && (
          <span style={styles.className}>{selectedClass.name ?? selectedClass.className}</span>
        )}
        <button onClick={refresh} style={styles.refreshBtn} title="Refresh leaderboard">
          ⟳ Refresh
        </button>
      </div>

      {/* Category tabs */}
      <div style={styles.tabs}>
        {CATEGORIES.map(cat => (
          <button
            key={cat.key}
            onClick={() => setCategory(cat.key)}
            style={{ ...styles.tab, ...(category === cat.key ? styles.tabActive : {}) }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Date range filters */}
      <div style={styles.filters}>
        <label style={styles.filterLabel}>
          From
          <input
            type="date"
            value={from}
            onChange={e => setFrom(e.target.value)}
            style={styles.dateInput}
          />
        </label>
        <label style={styles.filterLabel}>
          To
          <input
            type="date"
            value={to}
            onChange={e => setTo(e.target.value)}
            style={styles.dateInput}
          />
        </label>
      </div>

      {/* Content */}
      <div style={styles.content}>
        {loading && <p style={styles.statusMsg}>Loading leaderboard…</p>}

        {error && !loading && (
          <p style={{ ...styles.statusMsg, color: '#ef4444' }}>Error: {error}</p>
        )}

        {!loading && !error && entries.length === 0 && (
          <p style={styles.statusMsg}>No leaderboard data available for this period.</p>
        )}

        {!loading && entries.map(entry => (
          <LeaderboardCard
            key={entry.studentId}
            entry={entry}
            isCurrentUser={entry.studentId === user?._id || entry.studentId === user?.id}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Inline styles ─────────────────────────────────────────── */
const styles = {
  page: {
    maxWidth: '720px',
    margin: '0 auto',
    padding: '24px 16px',
    fontFamily: 'Inter, system-ui, sans-serif',
    color: '#f1f5f9',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  title: {
    margin: 0,
    fontSize: '22px',
    fontWeight: 700,
    color: '#f8fafc',
  },
  className: {
    fontSize: '13px',
    backgroundColor: '#334155',
    padding: '4px 10px',
    borderRadius: '999px',
    color: '#94a3b8',
  },
  refreshBtn: {
    marginLeft: 'auto',
    padding: '6px 14px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#334155',
    color: '#94a3b8',
    cursor: 'pointer',
    fontSize: '13px',
    transition: 'background-color 0.2s',
  },
  tabs: {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px',
  },
  tab: {
    padding: '7px 18px',
    borderRadius: '8px',
    border: '1px solid #334155',
    backgroundColor: 'transparent',
    color: '#94a3b8',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 500,
    transition: 'all 0.15s',
  },
  tabActive: {
    backgroundColor: '#6366f1',
    color: '#fff',
    borderColor: '#6366f1',
  },
  filters: {
    display: 'flex',
    gap: '16px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  filterLabel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    fontSize: '12px',
    color: '#64748b',
  },
  dateInput: {
    padding: '6px 10px',
    borderRadius: '8px',
    border: '1px solid #334155',
    backgroundColor: '#1e293b',
    color: '#f1f5f9',
    fontSize: '13px',
    outline: 'none',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
  },
  statusMsg: {
    textAlign: 'center',
    color: '#64748b',
    padding: '32px 0',
    fontSize: '14px',
  },
};

export default LeaderboardPage;
