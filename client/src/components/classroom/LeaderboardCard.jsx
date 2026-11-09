/**
 * LeaderboardCard.jsx
 * Displays a single student's leaderboard entry with rank badge,
 * score breakdown, and rank-delta indicator.
 *
 * Sprint Week 13 (Nov 6-12, 2026) — Rishabh Jain
 */

import React from 'react';

const BADGE_STYLES = {
  gold:   { bg: '#FFD700', label: '🥇' },
  silver: { bg: '#C0C0C0', label: '🥈' },
  bronze: { bg: '#CD7F32', label: '🥉' },
  '':     { bg: '#e5e7eb', label: ''    },
};

/**
 * DeltaChip — small up/down arrow with numeric rank change.
 */
function DeltaChip({ delta }) {
  if (delta === 0) return <span style={styles.deltaNeutral}>—</span>;
  const isUp = delta > 0;
  return (
    <span style={isUp ? styles.deltaUp : styles.deltaDown}>
      {isUp ? '▲' : '▼'} {Math.abs(delta)}
    </span>
  );
}

/**
 * ScoreBar — a thin horizontal progress bar.
 */
function ScoreBar({ value, color = '#6366f1' }) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div style={styles.barTrack}>
      <div style={{ ...styles.barFill, width: `${pct}%`, backgroundColor: color }} />
    </div>
  );
}

/**
 * LeaderboardCard
 *
 * @param {Object} props
 * @param {import('../hooks/useLeaderboard').LeaderboardEntry} props.entry
 * @param {boolean} [props.isCurrentUser] Highlight if the entry belongs to the logged-in student
 */
function LeaderboardCard({ entry, isCurrentUser = false }) {
  const { rank, name, score, quizAvg, attendancePct, badge, delta } = entry;
  const badgeMeta = BADGE_STYLES[badge] ?? BADGE_STYLES[''];

  return (
    <div style={{ ...styles.card, ...(isCurrentUser ? styles.cardHighlight : {}) }}>
      {/* Left: rank badge */}
      <div style={{ ...styles.rankBadge, backgroundColor: badgeMeta.bg }}>
        {badgeMeta.label || <span style={styles.rankNum}>{rank}</span>}
      </div>

      {/* Center: student info */}
      <div style={styles.info}>
        <div style={styles.nameRow}>
          <span style={styles.name}>{name}</span>
          {isCurrentUser && <span style={styles.youTag}>You</span>}
        </div>

        <div style={styles.scoreRow}>
          <span style={styles.scoreLabel}>Quiz</span>
          <ScoreBar value={quizAvg} color="#6366f1" />
          <span style={styles.scoreVal}>{quizAvg?.toFixed(1) ?? '--'}%</span>
        </div>

        <div style={styles.scoreRow}>
          <span style={styles.scoreLabel}>Attend</span>
          <ScoreBar value={attendancePct} color="#10b981" />
          <span style={styles.scoreVal}>{attendancePct?.toFixed(1) ?? '--'}%</span>
        </div>
      </div>

      {/* Right: overall score + delta */}
      <div style={styles.rightCol}>
        <span style={styles.overallScore}>{score?.toFixed(1) ?? '--'}</span>
        <DeltaChip delta={delta} />
      </div>
    </div>
  );
}

/* ── Inline styles ─────────────────────────────────────────── */
const styles = {
  card: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    marginBottom: '8px',
    borderRadius: '10px',
    backgroundColor: '#1e293b',
    boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
    transition: 'box-shadow 0.2s',
  },
  cardHighlight: {
    border: '2px solid #6366f1',
    backgroundColor: '#1e1b4b',
  },
  rankBadge: {
    minWidth: '36px',
    height: '36px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    flexShrink: 0,
  },
  rankNum: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#1e293b',
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  nameRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '4px',
  },
  name: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#f1f5f9',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  youTag: {
    fontSize: '10px',
    backgroundColor: '#6366f1',
    color: '#fff',
    borderRadius: '4px',
    padding: '1px 5px',
    fontWeight: 700,
  },
  scoreRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginTop: '3px',
  },
  scoreLabel: {
    fontSize: '11px',
    color: '#94a3b8',
    minWidth: '40px',
  },
  scoreVal: {
    fontSize: '11px',
    color: '#cbd5e1',
    minWidth: '36px',
    textAlign: 'right',
  },
  barTrack: {
    flex: 1,
    height: '5px',
    backgroundColor: '#334155',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: '3px',
    transition: 'width 0.5s ease',
  },
  rightCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '4px',
    flexShrink: 0,
  },
  overallScore: {
    fontSize: '20px',
    fontWeight: 700,
    color: '#f8fafc',
  },
  deltaUp:      { fontSize: '11px', color: '#10b981', fontWeight: 600 },
  deltaDown:    { fontSize: '11px', color: '#ef4444', fontWeight: 600 },
  deltaNeutral: { fontSize: '11px', color: '#64748b' },
};

export default LeaderboardCard;
