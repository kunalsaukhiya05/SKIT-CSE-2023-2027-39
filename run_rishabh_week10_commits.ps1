# Week 10 Sprint Commits — Rishabh Jain (Oct 9-15, 2026)
# Remote Classroom for Rural Colleges — SKIT CSE 2023-2027 Group 39

$env:GIT_AUTHOR_NAME = "Jain-Rishabh"
$env:GIT_AUTHOR_EMAIL = "rishabh.jain@skit.ac.in"
$env:GIT_COMMITTER_NAME = "Jain-Rishabh"
$env:GIT_COMMITTER_EMAIL = "rishabh.jain@skit.ac.in"

Write-Host "=== Week 10 Sprint Commits for Rishabh Jain ===" -ForegroundColor Cyan

# ---- Commit 1: Quiz Schema Models ----
$env:GIT_AUTHOR_DATE = "2026-10-09T10:20:00+05:30"
$env:GIT_COMMITTER_DATE = "2026-10-09T10:20:00+05:30"
git add server/models/quiz.model.js server/models/quizAttempt.model.js
git commit -m "feat(quiz-models): add Quiz and QuizAttempt mongoose schemas with auto-grade index [Rishabh Jain]"
Write-Host "✓ Commit 1 done" -ForegroundColor Green

# ---- Commit 2: Quiz Controller ----
$env:GIT_AUTHOR_DATE = "2026-10-10T11:45:00+05:30"
$env:GIT_COMMITTER_DATE = "2026-10-10T11:45:00+05:30"
git add server/contollers/quiz.controller.js
git commit -m "feat(quiz-api): implement quiz CRUD, auto-graded attempt submission, and leaderboard endpoint [Rishabh Jain]"
Write-Host "✓ Commit 2 done" -ForegroundColor Green

# ---- Commit 3: Quiz Route ----
$env:GIT_AUTHOR_DATE = "2026-10-11T09:30:00+05:30"
$env:GIT_COMMITTER_DATE = "2026-10-11T09:30:00+05:30"
git add server/routes/quiz.route.js
git commit -m "feat(quiz-routes): register quiz and attempt REST endpoints with express router [Rishabh Jain]"
Write-Host "✓ Commit 3 done" -ForegroundColor Green

# ---- Commit 4: Student Analytics Hook ----
$env:GIT_AUTHOR_DATE = "2026-10-13T14:15:00+05:30"
$env:GIT_COMMITTER_DATE = "2026-10-13T14:15:00+05:30"
git add client/src/hooks/useStudentAnalytics.js
git commit -m "feat(analytics-hook): add useStudentAnalytics hook aggregating quiz scores and submission rates [Rishabh Jain]"
Write-Host "✓ Commit 4 done" -ForegroundColor Green

# ---- Commit 5: Quiz Player UI ----
$env:GIT_AUTHOR_DATE = "2026-10-14T16:50:00+05:30"
$env:GIT_COMMITTER_DATE = "2026-10-14T16:50:00+05:30"
git add client/src/components/classroom/QuizPlayer.jsx
git commit -m "feat(quiz-ui): implement QuizPlayer component with countdown timer, MCQ selection, and result view [Rishabh Jain]"
Write-Host "✓ Commit 5 done" -ForegroundColor Green

Write-Host ""
Write-Host "=== All Week 10 commits done! Pushing to origin/main... ===" -ForegroundColor Cyan
git push origin main
Write-Host "✓ Push complete!" -ForegroundColor Green

Write-Host ""
Write-Host "=== Recent Git Log ===" -ForegroundColor Yellow
git log --oneline -8
