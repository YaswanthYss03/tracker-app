#!/usr/bin/env bash
# Database backup: compressed pg_dump into ./backups, keeps BACKUP_KEEP_DAYS
# days, optionally copies to S3 (BACKUP_S3_BUCKET in .env).
#
#   scripts/backup.sh
#
# Nightly on the server (crontab -e):
#   30 2 * * * cd ~/gps-server && scripts/backup.sh >> backups/backup.log 2>&1
set -euo pipefail
cd "$(dirname "$0")/.."

env_value() { grep -E "^$1=" .env 2>/dev/null | tail -1 | cut -d= -f2- || true; }
KEEP_DAYS="$(env_value BACKUP_KEEP_DAYS)"; KEEP_DAYS="${KEEP_DAYS:-14}"
S3_BUCKET="$(env_value BACKUP_S3_BUCKET)"

mkdir -p backups
FILE="backups/gps-$(date -u +%Y%m%dT%H%M%SZ).dump"

echo "$(date -u +%FT%TZ) backup -> $FILE"
# TimescaleDB's internal catalog makes pg_dump warn about "circular foreign-key
# constraints" (continuous_agg); it's harmless and filtered out here.
docker compose exec -T db pg_dump -U gps -d gps -Fc 2> >(grep -vE "circular foreign-key|continuous_agg|disable-triggers|data-only dump" >&2) > "$FILE.tmp"
if [ ! -s "$FILE.tmp" ]; then
  echo "backup FAILED: empty dump" >&2
  rm -f "$FILE.tmp"
  exit 1
fi
mv "$FILE.tmp" "$FILE"
echo "  size: $(du -h "$FILE" | cut -f1)"

if [ -n "$S3_BUCKET" ]; then
  aws s3 cp "$FILE" "s3://$S3_BUCKET/$(basename "$FILE")" --only-show-errors
  echo "  copied to s3://$S3_BUCKET/"
fi

find backups -name 'gps-*.dump' -mtime +"$KEEP_DAYS" -print -delete | sed 's/^/  deleted old: /'
echo "  done"
