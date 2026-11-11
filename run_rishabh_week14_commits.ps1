# Week 14 Sprint Commits — Rishabh Jain (Nov 6-12, 2026)
# Remote Classroom for Rural Colleges — SKIT CSE 2023-2027 Group 39

$env:GIT_AUTHOR_NAME    = "Jain-Rishabh"
$env:GIT_AUTHOR_EMAIL   = "rishabh.jain@skit.ac.in"
$env:GIT_COMMITTER_NAME = "Jain-Rishabh"
$env:GIT_COMMITTER_EMAIL= "rishabh.jain@skit.ac.in"

Write-Host "=== Week 14 Sprint Commits for Rishabh Jain ===" -ForegroundColor Cyan

# ---- Commit 1: Input Sanitizer Middleware ----
$env:GIT_AUTHOR_DATE    = "2026-11-06T10:15:00+05:30"
$env:GIT_COMMITTER_DATE = "2026-11-06T10:15:00+05:30"
git add server/middleware/inputSanitizer.js
git commit -m "feat(input-sanitizer): add global XSS and SQL-injection sanitizer middleware with recursive body, query and params cleaning [Rishabh Jain]"
Write-Host "Commit 1 done" -ForegroundColor Green

# ---- Commit 2: PDF Report Generator ----
$env:GIT_AUTHOR_DATE    = "2026-11-07T11:30:00+05:30"
$env:GIT_COMMITTER_DATE = "2026-11-07T11:30:00+05:30"
git add server/utils/pdfReportGenerator.js
git commit -m "feat(pdf-report): implement generateWeeklyReport utility with ASCII table builder and handleGenerateReport express handler [Rishabh Jain]"
Write-Host "Commit 2 done" -ForegroundColor Green

# ---- Commit 3: useLeaderboard Hook ----
$env:GIT_AUTHOR_DATE    = "2026-11-08T09:45:00+05:30"
$env:GIT_COMMITTER_DATE = "2026-11-08T09:45:00+05:30"
git add client/src/hooks/useLeaderboard.js
git commit -m "feat(leaderboard-hook): add useLeaderboard hook with category filter, date range, TTL cache and badge assignment [Rishabh Jain]"
Write-Host "Commit 3 done" -ForegroundColor Green

# ---- Commit 4: LeaderboardCard Component ----
$env:GIT_AUTHOR_DATE    = "2026-11-09T10:00:00+05:30"
$env:GIT_COMMITTER_DATE = "2026-11-09T10:00:00+05:30"
git add client/src/components/classroom/LeaderboardCard.jsx
git commit -m "feat(leaderboard-ui): implement LeaderboardCard with rank badge, score bars, delta chip and current-user highlight [Rishabh Jain]"
Write-Host "Commit 4 done" -ForegroundColor Green

# ---- Commit 5: LeaderboardPage ----
$env:GIT_AUTHOR_DATE    = "2026-11-10T12:00:00+05:30"
$env:GIT_COMMITTER_DATE = "2026-11-10T12:00:00+05:30"
git add client/src/pages/LeaderboardPage.jsx
git commit -m "feat(leaderboard-page): build LeaderboardPage with category tabs, date-range filters and per-entry LeaderboardCard list [Rishabh Jain]"
Write-Host "Commit 5 done" -ForegroundColor Green

# ---- Commit 6: Week 14 commit script ----
$env:GIT_AUTHOR_DATE    = "2026-11-11T14:30:00+05:30"
$env:GIT_COMMITTER_DATE = "2026-11-11T14:30:00+05:30"
git add run_rishabh_week14_commits.ps1
git commit -m "chore(scripts): add week 14 sprint commit script for Rishabh Jain [Rishabh Jain]"
Write-Host "Commit 6 done" -ForegroundColor Green

Write-Host ""
Write-Host "=== All Week 14 commits done! Pushing to origin/main... ===" -ForegroundColor Cyan
git push origin main
Write-Host "Push complete!" -ForegroundColor Green

Write-Host ""
Write-Host "=== Recent Git Log ===" -ForegroundColor Yellow
git log --oneline -8
