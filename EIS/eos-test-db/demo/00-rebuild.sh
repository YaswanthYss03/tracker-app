#!/bin/bash
# Rebuilds the local demo database (eos_finance_demo) from nothing:
#   production structure snapshot -> the 22 Finance SQL files -> app role rights
#   -> base records (01-base.sql) -> money through the app (02-seed.mjs).
# LOCAL ONLY. The backend must be running against eos_finance_demo on :3001
# for the last step (bash ../start-backend.sh).
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
set -a; . "$HERE/../rehearsal-db.env"; set +a
U=$(node -e "console.log(new URL(process.env.TEST_DATABASE_URL).username)")
export PGPASSWORD=$(node -e "console.log(decodeURIComponent(new URL(process.env.TEST_DATABASE_URL).password))")
PSQL=(docker exec -i -e PGPASSWORD eos-finance-rehearsal-pg17 psql -h 127.0.0.1 -p 5441 -U "$U" -q -v ON_ERROR_STOP=1)

"${PSQL[@]}" -d postgres -c "select pg_terminate_backend(pid) from pg_stat_activity where datname='eos_finance_demo' and pid <> pg_backend_pid()" >/dev/null
"${PSQL[@]}" -d postgres -c "DROP DATABASE IF EXISTS eos_finance_demo" -c "CREATE DATABASE eos_finance_demo"
"${PSQL[@]}" -d eos_finance_demo -c "DROP SCHEMA public CASCADE" -c "CREATE SCHEMA public" -c "CREATE EXTENSION IF NOT EXISTS citext SCHEMA public" 2>/dev/null
grep -v "^CREATE SCHEMA public;" "$HERE/../schema-baseline.sql" | "${PSQL[@]}" -d eos_finance_demo >/dev/null
echo "structure loaded"
for f in finance_module finance_module_reapproval_fix finance_proposal_assignments finance_financial_years finance_fund_financial_year_link finance_fund_insert_guard finance_accounting finance_fee_receipt_integrity finance_fee_gateway_integrity finance_fee_gateway_recovery finance_fee_account_mappings finance_fee_posting finance_vendor_bills finance_budgets finance_banking finance_payroll finance_assets finance_grants finance_scholarships finance_statements finance_budget_departments finance_briefing finance_fee_dues finance_fee_plans_late_fees finance_gateway_feed hr_salary hr_salary_payslip hr_salary_controls hr_salary_statutory hr_salary_structure hr_salary_attendance finance_payroll_disbursement hr_salary_eps; do
  "${PSQL[@]}" -d eos_finance_demo < "/home/yashwanth/EIS/EOSbackend1/prisma/migrations/$f.sql" >/dev/null
done
echo "26 Finance files applied"
"${PSQL[@]}" -d eos_finance_demo -c "GRANT CONNECT ON DATABASE eos_finance_demo TO eos_finance_app" -c "GRANT USAGE ON SCHEMA public TO eos_finance_app" -c "GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO eos_finance_app" -c "GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO eos_finance_app"
"${PSQL[@]}" -d eos_finance_demo < "$HERE/01-base.sql"
echo "base records loaded"
# The backend's open connections die with the old database: restart it before
# the money step, or pass --no-money and run 02-seed.mjs after restarting.
[ "${1:-}" = "--no-money" ] && { echo "now restart the backend, then: node $HERE/02-seed.mjs"; exit 0; }
node "$HERE/02-seed.mjs"
