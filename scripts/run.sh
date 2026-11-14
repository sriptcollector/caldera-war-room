#!/usr/bin/env bash
# One war-room cycle: snapshot -> branch -> commits -> PR -> green CI -> merge -> daily release.
set -euo pipefail
cd "$(dirname "$0")/.."
exec >> run.log 2>&1
echo "=== $(date -Is) start"
git checkout -q main && git pull -q --rebase
stamp=$(TZ=America/Los_Angeles date +%Y%m%d-%H%M)
day=$(TZ=America/Los_Angeles date +%Y-%m-%d)
branch="snapshot/$stamp"
git checkout -q -b "$branch"
npm run -s snapshot
git add data/$day/leaderboard-*.json && git commit -q -m "Leaderboard snapshot $stamp"
git add data/$day/report.md && git commit -q -m "Rival report $stamp"
git add data/history.csv && git commit -q -m "History row $stamp"
git push -q -u origin "$branch"
gh pr create --fill --base main --head "$branch" >/dev/null
sleep 20
gh pr checks "$branch" --watch --fail-fast >/dev/null
gh pr merge "$branch" --rebase --delete-branch >/dev/null
git checkout -q main && git pull -q --rebase && git branch -D "$branch" -q 2>/dev/null || true
tag="v${day//-/.}"
if ! gh release view "$tag" >/dev/null 2>&1; then
  gh release create "$tag" --title "War room $day" --notes-file "data/$day/report.md" >/dev/null
  echo "released $tag"
fi
echo "=== $(date -Is) done $branch"
