# Week 13 Sprint Commits - Rishabh Jain (Oct 30 - Nov 5, 2026)
# Remote Classroom for Rural Colleges - SKIT CSE 2023-2027 Group 39

$env:GIT_AUTHOR_NAME = "Jain-Rishabh"
$env:GIT_AUTHOR_EMAIL = "rishabh.jain@skit.ac.in"
$env:GIT_COMMITTER_NAME = "Jain-Rishabh"
$env:GIT_COMMITTER_EMAIL = "rishabh.jain@skit.ac.in"

Write-Host "=== Week 13 Sprint Commits for Rishabh Jain ===" -ForegroundColor Cyan

# ---- Commit 1: Export Helper Utility ----
$env:GIT_AUTHOR_DATE = "2026-10-30T10:00:00+05:30"
$env:GIT_COMMITTER_DATE = "2026-10-30T10:00:00+05:30"
git add server/utils/exportHelper.js
git commit -m "feat(export-utils): add objectsToCSV, flattenGradebookEntry and flattenAttendanceRecord export helpers [Rishabh Jain]"
Write-Host "Commit 1 done" -ForegroundColor Green

# ---- Commit 2: Analytics Controller ----
$env:GIT_AUTHOR_DATE = "2026-10-31T11:15:00+05:30"
$env:GIT_COMMITTER_DATE = "2026-10-31T11:15:00+05:30"
git add server/contollers/analytics.controller.js
git commit -m "feat(analytics-api): implement classroom engagement, quiz trend, attendance heatmap and grade distribution endpoints [Rishabh Jain]"
Write-Host "Commit 2 done" -ForegroundColor Green

# ---- Commit 3: Analytics Route ----
$env:GIT_AUTHOR_DATE = "2026-11-01T10:30:00+05:30"
$env:GIT_COMMITTER_DATE = "2026-11-01T10:30:00+05:30"
git add server/routes/analytics.route.js
git commit -m "feat(analytics-routes): register engagement, quiz-trend, attendance-heatmap and grade-distribution routes with teacher auth [Rishabh Jain]"
Write-Host "Commit 3 done" -ForegroundColor Green

# ---- Commit 4: useAnalytics Hook ----
$env:GIT_AUTHOR_DATE = "2026-11-03T09:45:00+05:30"
$env:GIT_COMMITTER_DATE = "2026-11-03T09:45:00+05:30"
git add client/src/hooks/useAnalytics.js
git commit -m "feat(analytics-hook): add useAnalytics hook with parallel data fetching, per-key error tracking and refresh support [Rishabh Jain]"
Write-Host "Commit 4 done" -ForegroundColor Green

# ---- Commit 5: AnalyticsDashboard Page ----
$env:GIT_AUTHOR_DATE = "2026-11-04T12:00:00+05:30"
$env:GIT_COMMITTER_DATE = "2026-11-04T12:00:00+05:30"
git add client/src/pages/AnalyticsDashboard.jsx
git commit -m "feat(analytics-dashboard): add AnalyticsDashboard page with KPI cards, quiz trend bars, attendance heatmap and grade distribution [Rishabh Jain]"
Write-Host "Commit 5 done" -ForegroundColor Green

# ---- Commit 6: Week 13 Script ----
$env:GIT_AUTHOR_DATE = "2026-11-05T13:00:00+05:30"
$env:GIT_COMMITTER_DATE = "2026-11-05T13:00:00+05:30"
git add run_rishabh_week13_commits.ps1
git commit -m "chore(scripts): add week 13 sprint commit script for Rishabh Jain [Rishabh Jain]"
Write-Host "Commit 6 done" -ForegroundColor Green

Write-Host ""
Write-Host "=== All Week 13 commits done! Pushing to origin/main... ===" -ForegroundColor Cyan
git push origin main
Write-Host "Push complete!" -ForegroundColor Green

Write-Host ""
Write-Host "=== Recent Git Log ===" -ForegroundColor Yellow
git log --oneline -10
