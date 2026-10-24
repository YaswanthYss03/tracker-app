#!/usr/bin/env bash
# Restore a backup made by scripts/backup.sh.
#
#   scripts/restore.sh backups/gps-XXXX.dump            # TEST: restores into a scratch
#                                                       # database, prints counts, drops it
#   CONFIRM=yes scripts/restore.sh backups/gps-XXXX.dump gps
#                                                       # REAL: replaces the live database
#                                                       # (stops the app while restoring)
#
# TimescaleDB needs timescaledb_pre_restore()/post_restore() around pg_restore.
set -euo pipefail
cd "$(dirname "$0")/.."

DUMP="${1:?usage: scripts/restore.sh <dump file> [target database]}"
TARGET="${2:-gps_restore_check}"
[ -s "$DUMP" ] || { echo "No such backup: $DUMP" >&2; exit 1; }
[[ "$TARGET" =~ ^[a-z_][a-z0-9_]*$ ]] || { echo "Bad database name: $TARGET" >&2; exit 1; }

psql_db() { docker compose exec -T db psql -U gps -v ON_ERROR_STOP=1 -q -d "$1" "${@:2}"; }

if [ "$TARGET" = "gps" ]; then
  if [ "${CONFIRM:-}" != "yes" ]; then
    echo "This REPLACES the live database. Run again with CONFIRM=yes to proceed." >&2
    exit 1
  fi
  echo "Stopping the app..."
  docker compose stop app caddy
fi

echo "Creating database $TARGET"
psql_db postgres -c "DROP DATABASE IF EXISTS $TARGET WITH (FORCE)" -c "CREATE DATABASE $TARGET"
psql_db "$TARGET" -c "CREATE EXTENSION IF NOT EXISTS timescaledb" -c "SELECT timescaledb_pre_restore()" > /dev/null

echo "Restoring $DUMP"
# pg_restore reports harmless errors for objects the extension already created;
# the counts below are the real check.
docker compose exec -T db pg_restore -U gps -d "$TARGET" --no-owner < "$DUMP" 2> /tmp/gps-restore.log || true
psql_db "$TARGET" -c "SELECT timescaledb_post_restore()" > /dev/null
ERRORS=$(grep -c "error:" /tmp/gps-restore.log || true)
echo "pg_restore messages: $ERRORS (details in /tmp/gps-restore.log)"

echo "Contents:"
psql_db "$TARGET" -c "
  SELECT (SELECT count(*) FROM users)     AS users,
         (SELECT count(*) FROM devices)   AS devices,
         (SELECT count(*) FROM positions) AS positions,
         (SELECT count(*) FROM trips)     AS trips,
         (SELECT count(*) FROM events)    AS events,
         (SELECT count(*) FROM _prisma_migrations) AS migrations,
         (SELECT count(*) FROM timescaledb_information.jobs WHERE hypertable_name = 'positions') AS ts_policies"

if [ "$TARGET" = "gps" ]; then
  echo "Starting the app..."
  docker compose start app caddy
else
  psql_db postgres -c "DROP DATABASE $TARGET WITH (FORCE)"
  echo "Test restore OK; scratch database removed."
fi
