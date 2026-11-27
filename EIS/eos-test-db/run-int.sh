#!/bin/bash
# usage: run-int.sh <spec name or path>   (local rehearsal database only)
cd /home/yashwanth/EIS/EOSbackend1
set -a; . /home/yashwanth/EIS/eos-test-db/rehearsal-db.env; set +a
export FEE_OPERATOR_DATABASE_URL="$TEST_DATABASE_URL" ACCOUNTING_OPERATOR_DATABASE_URL="$TEST_DATABASE_URL" SOP_POP_OPERATOR_DATABASE_URL="$TEST_DATABASE_URL"
export TEST_DATABASE_URL="$REHEARSAL_APP_DATABASE_URL"
export NODE_OPTIONS=--max-old-space-size=8192
npx jest --config test/jest-integration.json --runInBand --testTimeout=120000 "$@" 2>&1 | sed 's#postgres\(ql\)\?://[^ ]*#<url>#g'
