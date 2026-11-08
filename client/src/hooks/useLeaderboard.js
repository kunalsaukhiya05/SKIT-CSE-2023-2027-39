/**
 * useLeaderboard.js
 * Custom React hook for fetching and managing classroom leaderboard data.
 * Supports filtering by classId, date range, and category (quiz / attendance / overall).
 *
 * Sprint Week 13 (Nov 6-12, 2026) — Rishabh Jain
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useContext } from 'react';
import { AppContext } from '../context/context';

const BASE_URL = import.meta.env.VITE_API_URL || '';

/** How long (ms) to cache leaderboard data before re-fetching */
const CACHE_TTL = 60_000;

/**
 * @typedef {Object} LeaderboardEntry
 * @property {number}  rank
 * @property {string}  studentId
 * @property {string}  name
 * @property {number}  score          Overall score (0-100)
 * @property {number}  quizAvg        Average quiz score (0-100)
 * @property {number}  attendancePct  Attendance percentage (0-100)
 * @property {string}  badge          'gold' | 'silver' | 'bronze' | ''
 * @property {number}  delta          Rank change since last week (positive = improved)
 */

/**
 * useLeaderboard
 *
 * @param {Object} options
 * @param {string}  options.classId   Required classroom ID
 * @param {string} [options.category] 'overall' | 'quiz' | 'attendance'  (default: 'overall')
 * @param {string} [options.from]     ISO date string (inclusive)
 * @param {string} [options.to]       ISO date string (inclusive)
 * @returns {{ entries: LeaderboardEntry[], loading: boolean, error: string|null, refresh: Function }}
 */
export function useLeaderboard({ classId, category = 'overall', from = '', to = '' } = {}) {
  const { token } = useContext(AppContext);

  const [entries, setEntries] = useState([]);
  const [loading, setLoading]  = useState(false);
  const [error,   setError]    = useState(null);

  /** Simple in-memory cache keyed by request params */
  const cache = useRef({});

  const fetchLeaderboard = useCallback(async () => {
    if (!classId) return;

    const cacheKey = `${classId}|${category}|${from}|${to}`;
    const cached   = cache.current[cacheKey];
    if (cached && Date.now() - cached.ts < CACHE_TTL) {
      setEntries(cached.data);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({ category });
      if (from) params.set('from', from);
      if (to)   params.set('to', to);

      const res = await fetch(
        `${BASE_URL}/api/analytics/leaderboard/${classId}?${params}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `HTTP ${res.status}`);
      }

      const data = await res.json(); // { leaderboard: LeaderboardEntry[] }
      const ranked = (data.leaderboard ?? []).map((entry, idx) => ({
        ...entry,
        rank:  entry.rank  ?? idx + 1,
        badge: idx === 0 ? 'gold' : idx === 1 ? 'silver' : idx === 2 ? 'bronze' : '',
        delta: entry.delta ?? 0,
      }));

      cache.current[cacheKey] = { data: ranked, ts: Date.now() };
      setEntries(ranked);
    } catch (err) {
      console.error('[useLeaderboard]', err);
      setError(err.message || 'Failed to fetch leaderboard');
    } finally {
      setLoading(false);
    }
  }, [classId, category, from, to, token]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  return { entries, loading, error, refresh: fetchLeaderboard };
}
