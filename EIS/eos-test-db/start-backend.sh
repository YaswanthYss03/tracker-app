#!/bin/bash
# Local backend: a local database only, nothing external reachable.
cd /home/yashwanth/EIS/EOSbackend1
set -a; . /home/yashwanth/EIS/eos-test-db/rehearsal-db.env; set +a
# EOS_DB picks the database: eos_finance_demo (clean demo data, the default) or
# eos_finance_rehearsal_test (what the automated tests use).
EOS_DB="${EOS_DB:-eos_finance_demo}"
APP_URL="$(node -e 'const u=new URL(process.env.REHEARSAL_APP_DATABASE_URL);u.pathname="/"+process.argv[1];console.log(u.toString())' "$EOS_DB")"
export DATABASE_URL="$APP_URL" DIRECT_URL="$APP_URL"
echo "[start-backend] database: $EOS_DB" >&2
unset TEST_DATABASE_URL REHEARSAL_APP_DATABASE_URL REHEARSAL_RLS_DATABASE_URL
export PORT="${PORT:-3001}" ALLOWED_ORIGINS="${ALLOWED_ORIGINS:-http://localhost:3000,http://localhost:3101}" NODE_ENV=development
export JWT_SECRET="$(cat /home/yashwanth/EIS/eos-test-db/jwt.secret)"
export RAZORPAY_KEY_ID="" RAZORPAY_KEY_SECRET="" RAZORPAY_WEBHOOK_SECRET="" FEE_GATEWAY_RECONCILE_ENABLED=false
# Razorpay: off unless razorpay-test.env holds TEST-mode keys. Live keys are refused.
if [ -f /home/yashwanth/EIS/eos-test-db/razorpay-test.env ]; then
  set -a; . /home/yashwanth/EIS/eos-test-db/razorpay-test.env; set +a
  case "$RAZORPAY_KEY_ID" in
    rzp_test_*) export NET_GUARD_ALLOW="${NET_GUARD_ALLOW:+$NET_GUARD_ALLOW,}api.razorpay.com" FEE_GATEWAY_RECONCILE_ENABLED=true; echo "[start-backend] Razorpay: TEST mode" >&2 ;;
    *) echo "[start-backend] razorpay-test.env does not hold a test key; refusing to start" >&2; exit 1 ;;
  esac
fi
export SUPABASE_URL="http://127.0.0.1:9" SUPABASE_SERVICE_KEY="local-none" SUPABASE_STORAGE_BUCKET="local-none"
export SUPABASE_S3_ENDPOINT="http://127.0.0.1:9" SUPABASE_S3_ACCESS_KEY_ID="local-none" SUPABASE_S3_SECRET_ACCESS_KEY="local-none" SUPABASE_S3_BUCKET="local-none" SUPABASE_S3_REGION="local"
export TWILIO_ACCOUNT_SID="" TWILIO_AUTH_TOKEN="" TWILIO_VERIFY_SERVICE_SID=""
# Real SMS and email for fee reminders: only when messaging.env exists (see messaging.env.example).
if [ -f /home/yashwanth/EIS/eos-test-db/messaging.env ]; then
  set -a; . /home/yashwanth/EIS/eos-test-db/messaging.env; set +a
  [ "$SMS_PROVIDER" = "twilio" ] && export NET_GUARD_ALLOW="${NET_GUARD_ALLOW:+$NET_GUARD_ALLOW,}api.twilio.com"
  [ "$EMAIL_PROVIDER" = "gmail" ] && export NET_GUARD_ALLOW="${NET_GUARD_ALLOW:+$NET_GUARD_ALLOW,}smtp.gmail.com"
  echo "[start-backend] messaging: SMS=${SMS_PROVIDER:-off} email=${EMAIL_PROVIDER:-off}" >&2
fi
export ATTENDANCE_CV_API_KEY="" ATTENDANCE_CV_BASE_URL="http://127.0.0.1:9"
exec node -r /home/yashwanth/EIS/eos-test-db/net-guard.js -r @swc-node/register src/main.ts
