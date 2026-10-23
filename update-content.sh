#!/usr/bin/env bash
# Example cron: 0 7 * * * /opt/ssrf/update-content.sh >> /tmp/ssrf.log 2>&1
set -euo pipefail

if [[ -z "${GIT_SSH_COMMAND:-}" && -f /home/lalu/.ssh/ssrf-daily-update-key ]]; then
  export GIT_SSH_COMMAND='ssh -i /home/lalu/.ssh/ssrf-daily-update-key'
fi

cd "$(dirname "${BASH_SOURCE[0]}")"
if [[ -n "$(git status --porcelain)" ]]; then
  echo 'The worktree must be clean before updating content.' >&2
  exit 1
fi
git pull --ff-only
npm ci --include=dev
npm run populate
npm run check
git add -- metadatas src/all_videos.json
if ! git diff --cached --quiet; then
  git commit -m "chore: refresh video data $(date -u +%F)"
fi
git push
