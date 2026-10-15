/**
 * Rural Classroom Quiz Offline AutoSave & Draft Recovery Manager
 * Author: Kunal Saukhiya <hgkunal@gmail.com>
 * Sprint 4 / Week 10: Ensures answers are never lost when cellular network cuts out
 */

const QUIZ_DRAFT_PREFIX = "gyaansetu_quiz_draft_";

export const saveQuizDraft = (quizId, answers, timeRemainingSeconds) => {
  try {
    const payload = {
      quizId,
      answers,
      timeRemainingSeconds,
      lastSavedAt: new Date().toISOString(),
    };
    localStorage.setItem(QUIZ_DRAFT_PREFIX + quizId, JSON.stringify(payload));
    return true;
  } catch (err) {
    console.warn("Unable to save quiz draft locally:", err);
    return false;
  }
};

export const getQuizDraft = (quizId) => {
  try {
    const item = localStorage.getItem(QUIZ_DRAFT_PREFIX + quizId);
    if (!item) return null;
    return JSON.parse(item);
  } catch (err) {
    console.warn("Unable to retrieve quiz draft:", err);
    return null;
  }
};

export const clearQuizDraft = (quizId) => {
  try {
    localStorage.removeItem(QUIZ_DRAFT_PREFIX + quizId);
  } catch (err) {
    console.warn("Unable to clear quiz draft:", err);
  }
};
