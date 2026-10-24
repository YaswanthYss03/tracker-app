#!/usr/bin/env bash
# Push the code to the server and restart the app.
#
#   npm run deploy
#
# Uses the SSH host alias "gps-server" from ~/.ssh/config (HostName, User,
# IdentityFile), so a new server IP only needs changing there.
# Override with: DEPLOY_HOST=other-alias npm run deploy
set -euo pipefail

HOST="${DEPLOY_HOST:-gps-server}"
REMOTE_DIR="gps-server"
SSH="ssh -o ConnectTimeout=15"

cd "$(dirname "$0")/.."

echo "==> Running tests"
npm test --silent

echo "==> Checking the server's .env"
# The server keeps its own .env. Stop early if it's missing settings this version needs.
MISSING=$($SSH "$HOST" "cd ~/$REMOTE_DIR 2>/dev/null && for v in POSTGRES_PASSWORD ADMIN_API_KEY JWT_SECRET API_DOMAIN; do grep -q \"^\$v=.\" .env 2>/dev/null || echo \$v; done" || echo "UNREACHABLE")
if [ -n "$MISSING" ]; then
  echo "Server .env is missing: $MISSING"
  echo "Fix it on the server (see DEPLOY_AWS.md), then run npm run deploy again."
  exit 1
fi

echo "==> Backing up the database before deploying"
if ! $SSH "$HOST" "cd ~/$REMOTE_DIR && scripts/backup.sh" | sed 's/^/    /'; then
  echo "    WARNING: backup failed (first deploy, or database down). Continuing."
fi

echo "==> Uploading code to $HOST"
# .env, secrets/ and backups/ stay on the server (--delete would remove them otherwise).
rsync -az --delete \
  --exclude node_modules --exclude .env --exclude .git --exclude secrets --exclude backups --exclude itest --exclude web/dist --exclude admin/dist --exclude mobile \
  -e "$SSH" ./ "$HOST:~/$REMOTE_DIR/"

echo "==> Rebuilding and restarting (migrations run on start)"
$SSH "$HOST" "cd ~/$REMOTE_DIR && docker compose up -d --build && docker image prune -f >/dev/null"

echo "==> Checking health"
sleep 10
$SSH "$HOST" "cd ~/$REMOTE_DIR && docker compose ps --format '{{.Service}}: {{.Status}}' && curl -s localhost:3000/health && echo && docker compose logs app --no-log-prefix --tail 5"

echo "==> Done"
