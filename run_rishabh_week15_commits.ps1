# Week 15 Sprint Commits — Rishabh Jain (Nov 13-19, 2026)
# Remote Classroom for Rural Colleges — SKIT CSE 2023-2027 Group 39

$env:GIT_AUTHOR_NAME    = "Jain-Rishabh"
$env:GIT_AUTHOR_EMAIL   = "rishabh.jain@skit.ac.in"
$env:GIT_COMMITTER_NAME = "Jain-Rishabh"
$env:GIT_COMMITTER_EMAIL= "rishabh.jain@skit.ac.in"

Write-Host "=== Week 15 Sprint Commits for Rishabh Jain ===" -ForegroundColor Cyan

# ---- Commit 1: Email Helper Utility ----
$env:GIT_AUTHOR_DATE    = "2026-11-13T10:20:00+05:30"
$env:GIT_COMMITTER_DATE = "2026-11-13T10:20:00+05:30"
git add server/utils/emailHelper.js
git commit -m "feat(email-utils): add sendEmail, sendBulkEmails and sendDeadlineReminder helpers with SMTP transport and dev-mode fallback [Rishabh Jain]"
Write-Host "Commit 1 done" -ForegroundColor Green

# ---- Commit 2: Report Controller ----
$env:GIT_AUTHOR_DATE    = "2026-11-14T11:00:00+05:30"
$env:GIT_COMMITTER_DATE = "2026-11-14T11:00:00+05:30"
git add server/contollers/report.controller.js
git commit -m "feat(report-api): implement getStudentProgressReport, exportClassGradebookCSV and emailStudentProgressReport endpoints [Rishabh Jain]"
Write-Host "Commit 2 done" -ForegroundColor Green

# ---- Commit 3: Report Route ----
$env:GIT_AUTHOR_DATE    = "2026-11-15T09:45:00+05:30"
$env:GIT_COMMITTER_DATE = "2026-11-15T09:45:00+05:30"
git add server/routes/report.route.js
git commit -m "feat(report-routes): register student-progress, class-gradebook-csv and email-progress routes with role-based auth guards [Rishabh Jain]"
Write-Host "Commit 3 done" -ForegroundColor Green

# ---- Commit 4: useReport Hook ----
$env:GIT_AUTHOR_DATE    = "2026-11-16T10:30:00+05:30"
$env:GIT_COMMITTER_DATE = "2026-11-16T10:30:00+05:30"
git add client/src/hooks/useReport.js
git commit -m "feat(report-hook): add useReport hook with fetchProgressReport, downloadGradebookCSV and emailProgressReport actions [Rishabh Jain]"
Write-Host "Commit 4 done" -ForegroundColor Green

# ---- Commit 5: ProgressReportCard Component ----
$env:GIT_AUTHOR_DATE    = "2026-11-17T12:15:00+05:30"
$env:GIT_COMMITTER_DATE = "2026-11-17T12:15:00+05:30"
git add client/src/components/classroom/ProgressReportCard.jsx
git commit -m "feat(report-ui): implement ProgressReportCard with grade and attendance summary chips, email trigger and CSV download [Rishabh Jain]"
Write-Host "Commit 5 done" -ForegroundColor Green

# ---- Commit 6: ReportPage ----
$env:GIT_AUTHOR_DATE    = "2026-11-18T11:00:00+05:30"
$env:GIT_COMMITTER_DATE = "2026-11-18T11:00:00+05:30"
git add client/src/pages/ReportPage.jsx
git commit -m "feat(report-page): build ReportPage with student progress view and teacher class-selector, gradebook CSV export and per-student card list [Rishabh Jain]"
Write-Host "Commit 6 done" -ForegroundColor Green

# ---- Commit 7: Week 15 Script ----
$env:GIT_AUTHOR_DATE    = "2026-11-19T13:30:00+05:30"
$env:GIT_COMMITTER_DATE = "2026-11-19T13:30:00+05:30"
git add run_rishabh_week15_commits.ps1
git commit -m "chore(scripts): add week 15 sprint commit script for Rishabh Jain [Rishabh Jain]"
Write-Host "Commit 7 done" -ForegroundColor Green

Write-Host ""
Write-Host "=== All Week 15 commits done! Pushing to origin/main... ===" -ForegroundColor Cyan
git push origin main
Write-Host "Push complete!" -ForegroundColor Green

Write-Host ""
Write-Host "=== Recent Git Log ===" -ForegroundColor Yellow
git log --oneline -10
