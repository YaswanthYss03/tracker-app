# Local test logins

Frontend: http://localhost:3000   Backend: http://localhost:3001/api/v1

Password for every user below: Rehearsal@2026

## Demo database (eos_finance_demo) — the default, clean demo data

Sri Eshwar College of Engineering (demo): 5 departments, 60 students, 10 faculty,
10 vendors, Financial Year 2026–27. All names and numbers are made up.

| Role | Email | Use it to |
|---|---|---|
| Finance | lakshmi.finance@sece.example | Enter bills, record payments, propose budgets |
| Finance (second person) | rajesh.finance@sece.example | Approve what Lakshmi entered |
| Admin | admin@sece.example | Activate years, switch fee posting on, reopen |
| Principal | principal@sece.example | Decide budgets, approve bills held over budget |
| Billing | kavitha.billing@sece.example | Fee counter, request refunds |
| HR payroll | suresh.hr@sece.example | Enter salaries |
| Higher Education | anitha.higheredu@sece.example | Scholarship awards |
| HoD (CSE) | ramya.venkatesan@sece.example | Department head |
| Student | aarav.kumar1@student.sece.example | A student's own fees |

State now (10 Oct 2026): **blank Finance set-up**, rebuilt with `--no-money` to test the
whole flow from the start. Only Stage 0 is there: logins, 5 departments, 60 students
with their fee demands, 10 faculty, 10 vendors. No financial year, accounts, banks,
budgets or money. Follow `EOSbackend1/docs/finance-guide/00-finance-flow.md` from Stage 1.

To go back to the full demo with money: rebuild without `--no-money`, or run
`node eos-test-db/demo/02-seed.mjs` on a blank one (after restarting the backend).

Rebuild it from nothing at any time: `bash eos-test-db/demo/00-rebuild.sh --no-money`,
restart the backend, then `node eos-test-db/demo/02-seed.mjs`.

## Rehearsal database (eos_finance_rehearsal_test) — the automated tests' data

Full of test records. Start the backend on it with
`EOS_DB=eos_finance_rehearsal_test bash eos-test-db/start-backend.sh`.

| Role | Email |
|---|---|
| Finance | finance.one@eos.example.test |
| Finance (second person) | finance.two@eos.example.test |
| Admin | admin@eos.example.test |
| Principal | principal@eos.example.test |
| Billing | billing@eos.example.test |
| HR payroll | hr@eos.example.test |
| Higher Education | higheredu@eos.example.test |

## Starting everything after a restart

  docker start eos-finance-rehearsal-pg17
  backend:  bash /home/yashwanth/EIS/eos-test-db/start-backend.sh   (demo database by default)
  frontend: cd EOS-web-frontend && npm run dev   (its .env already points at :3001)

Login is limited to 5 attempts a minute per email.
