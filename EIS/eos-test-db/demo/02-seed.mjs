// Demo database — everything with money, entered THROUGH THE RUNNING APP as
// the people who would do it, so the books are built exactly as real use
// builds them. LOCAL DEMO DATA ONLY.
//
// usage: node 02-seed.mjs        (backend on http://localhost:3001, demo database)
// Reads reference ids (fee heads, demands, faculty, vendors, departments)
// straight from the demo database; writes nothing there itself.
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire('/home/yashwanth/EIS/EOSbackend1/package.json');
const { Client } = require('pg');

const API = 'http://localhost:3001/api/v1';
const PASSWORD = readFileSync(new URL('../walkthrough-logins.md', import.meta.url), 'utf8').match(/Rehearsal@\d+/)[0];
const env = Object.fromEntries(
  readFileSync(new URL('../rehearsal-db.env', import.meta.url), 'utf8')
    .split('\n').filter((l) => l.includes('=')).map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1).replace(/^"|"$/g, '')]),
);
const ownerUrl = new URL(env.TEST_DATABASE_URL);
ownerUrl.pathname = '/eos_finance_demo';
const db = new Client({ connectionString: ownerUrl.toString() });
await db.connect();
const rows = async (sql, ...p) => (await db.query(sql, p)).rows;

const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date());
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let steps = 0;
function done(what) {
  steps++;
  console.log(`ok  ${what}`);
}

async function login(email) {
  for (let i = 0; i < 6; i++) {
    const r = await fetch(`${API}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password: PASSWORD }) });
    if (r.status === 429) { await sleep(15000); continue; }
    const b = await r.json();
    if (!b.success) throw new Error(`login ${email}: ${b.errorCode} ${b.message}`);
    return b.data.accessToken;
  }
  throw new Error(`login ${email}: rate limited`);
}
async function call(token, method, path, body) {
  let r;
  // A person cannot type faster than the request limit (100 a minute each);
  // this script can, so it waits when told to slow down.
  for (let attempt = 0; ; attempt++) {
    r = await fetch(API + path, { method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: body === undefined ? undefined : JSON.stringify(body) });
    if (r.status !== 429 || attempt > 10) break;
    await sleep(10000);
  }
  const b = await r.json().catch(() => ({}));
  if (r.status >= 300) throw new Error(`${method} ${path} -> ${r.status} ${b.errorCode ?? ''} ${typeof b.message === 'string' ? b.message : JSON.stringify(b.message)}`);
  return b.data;
}

const T = {
  admin: await login('admin@sece.example'),
  principal: await login('principal@sece.example'),
  fin1: await login('lakshmi.finance@sece.example'),
  fin2: await login('rajesh.finance@sece.example'),
  billing: await login('kavitha.billing@sece.example'),
  hr: await login('suresh.hr@sece.example'),
};

// ---------------------------------------------------------------- the year
const year = await call(T.fin1, 'POST', '/finance/years', { start_date: '2026-04-01', end_date: '2027-03-31', name: 'Financial Year 2026–27' });
await call(T.admin, 'POST', `/finance/years/${year.id}/activate`);
const periods = (await call(T.fin1, 'GET', '/finance/years/current')).periods ?? (await rows('select id, start_date::text s from finance_accounting_periods where financial_year_id = $1 order by sequence', year.id));
for (const p of await rows('select id from finance_accounting_periods where financial_year_id = $1 and start_date <= $2::date order by sequence', year.id, today)) {
  await call(T.fin1, 'POST', `/finance/periods/${p.id}/open`);
}
done(`financial year ${year.name ?? year.code} active; periods up to this month open (${periods.length} in the year)`);

// ------------------------------------------------------ chart of accounts
const A = {};
async function account(key, code, name, type, parent, postable = true) {
  A[key] = (await call(T.fin1, 'POST', '/finance/accounts', { code, name, account_type: type, ...(parent ? { parent_id: A[parent] } : {}), ...(postable ? {} : { is_postable: false }) })).id;
}
await account('assetsG', '1000', 'Current assets', 'asset', null, false);
await account('cash', '1010', 'Cash in hand', 'asset', 'assetsG');
await account('sbi', '1020', 'State Bank — Current account', 'asset', 'assetsG');
await account('canara', '1030', 'Canara Bank — Savings account', 'asset', 'assetsG');
await account('fixedG', '1500', 'Fixed assets', 'asset', null, false);
await account('computers', '1510', 'Computers and peripherals', 'asset', 'fixedG');
await account('labEq', '1520', 'Laboratory equipment', 'asset', 'fixedG');
await account('furniture', '1530', 'Furniture and fittings', 'asset', 'fixedG');
await account('liabG', '2000', 'Current liabilities', 'liability', null, false);
await account('vendorPay', '2010', 'Payable to vendors', 'liability', 'liabG');
await account('tdsPay', '2020', 'TDS payable — vendors', 'liability', 'liabG');
await account('salPay', '2100', 'Salaries payable', 'liability', 'liabG');
await account('pfPay', '2110', 'PF payable', 'liability', 'liabG');
await account('esiPay', '2120', 'ESI payable', 'liability', 'liabG');
await account('ptPay', '2130', 'Professional tax payable', 'liability', 'liabG');
await account('salTds', '2140', 'TDS payable — salaries', 'liability', 'liabG');
await account('otherDed', '2150', 'Other salary deductions payable', 'liability', 'liabG');
await account('grantsUnspent', '2200', 'Unspent grants', 'liability', 'liabG');
await account('fundG', '3000', 'Funds', 'equity', null, false);
await account('genFund', '3010', 'General fund', 'equity', 'fundG');
await account('incomeG', '4000', 'Fee income', 'income', null, false);
await account('tuition', '4010', 'Tuition fee', 'income', 'incomeG');
await account('development', '4020', 'Development fee', 'income', 'incomeG');
await account('exam', '4030', 'Examination fee', 'income', 'incomeG');
await account('grantIncome', '4100', 'Grant income', 'income', null);
await account('expG', '5000', 'Running expenses', 'expense', null, false);
await account('salaries', '5010', 'Salaries', 'expense', 'expG');
await account('employer', '5020', 'Employer PF and ESI', 'expense', 'expG');
await account('electricity', '5100', 'Electricity', 'expense', 'expG');
await account('water', '5110', 'Water', 'expense', 'expG');
await account('repairs', '5200', 'Repairs and maintenance', 'expense', 'expG');
await account('labCons', '5210', 'Laboratory consumables', 'expense', 'expG');
await account('stationery', '5300', 'Printing and stationery', 'expense', 'expG');
await account('internet', '5400', 'Internet and telephone', 'expense', 'expG');
await account('travel', '5500', 'Travel and conveyance', 'expense', 'expG');
await account('housekeeping', '5600', 'Housekeeping', 'expense', 'expG');
await account('security', '5700', 'Security', 'expense', 'expG');
done(`chart of accounts: ${Object.keys(A).length} accounts under 6 headings`);

// ------------------------------------------------------------ mappings
await call(T.fin1, 'PUT', '/finance/payable-accounts', { account_key: 'vendor_payable', account_id: A.vendorPay });
await call(T.fin1, 'PUT', '/finance/payable-accounts', { account_key: 'tds_payable', account_id: A.tdsPay });
for (const [key, acc] of [['salary_expense', 'salaries'], ['salaries_payable', 'salPay'], ['pf_payable', 'pfPay'], ['esi_payable', 'esiPay'], ['professional_tax_payable', 'ptPay'], ['salary_tds_payable', 'salTds'], ['other_deductions_payable', 'otherDed'], ['employer_contributions_expense', 'employer']]) {
  await call(T.fin1, 'PUT', '/finance/payroll/accounts', { account_key: key, account_id: A[acc] });
}
for (const c of await rows('select id, name from demand_categories')) {
  const acc = c.name.startsWith('Tuition') ? A.tuition : c.name.startsWith('Development') ? A.development : A.exam;
  await call(T.fin1, 'PUT', '/finance/fee-account-mappings', { fee_head: 'demand_category', demand_category_id: c.id, account_id: acc });
}
for (const key of ['cash', 'card', 'upi', 'dd', 'netbanking', 'online']) {
  await call(T.fin1, 'PUT', '/finance/fee-settlement-accounts', { settlement_key: key, account_id: key === 'cash' ? A.cash : A.sbi });
}
await call(T.fin1, 'POST', '/finance/bank-accounts', { account_id: A.sbi, bank_name: 'State Bank of India', branch: 'Coimbatore Main', ifsc: 'SBIN0000001' });
await call(T.fin1, 'POST', '/finance/bank-accounts', { account_id: A.canara, bank_name: 'Canara Bank', branch: 'Peelamedu', ifsc: 'CNRB0000002' });
await call(T.fin1, 'POST', '/finance/statements/cash-accounts', { account_id: A.cash });
await call(T.admin, 'POST', '/finance/fee-posting/activate');
await call(T.fin1, 'POST', '/finance/fund', { academic_year: '2026-27', total_amount: 2500000, notes: 'Purchase and service order fund 2026–27' });
done('payables, payroll, fee heads, settlement and bank accounts set; fee posting switched on; order fund ₹25 L');

// ---------------------------------------------------------------- budgets
const depts = Object.fromEntries((await rows('select id, code from departments')).map((d) => [d.code, d.id]));
const budgets = [
  ['electricity', null, 1800000, 'Campus electricity for the year'],
  ['water', null, 360000, 'Water supply for the year'],
  ['security', null, 900000, 'Security contract'],
  ['housekeeping', null, 720000, 'Housekeeping contract'],
  ['internet', null, 300000, 'Campus internet'],
  ['labCons', 'CSE', 150000, 'CSE lab consumables'],
  ['labCons', 'ECE', 200000, 'ECE lab consumables'],
  ['labCons', 'MECH', 250000, 'Workshop consumables'],
  ['repairs', 'CIVIL', 120000, 'Civil lab repairs'],
  ['repairs', null, 400000, 'Campus repairs'],
  ['stationery', null, 100000, 'Office stationery'],
  ['travel', 'CSE', 30000, 'Conference travel — CSE'],
];
for (const [acc, dept, amount, reason] of budgets) {
  const p = await call(T.fin1, 'POST', '/finance/budgets/proposals', { financial_year_id: year.id, account_id: A[acc], ...(dept ? { department_id: depts[dept] } : {}), amount, reason });
  await call(T.principal, 'POST', `/finance/budgets/proposals/${p.id}/approve`, {});
}
// One proposal left for the Principal to decide.
await call(T.fin1, 'POST', '/finance/budgets/proposals', { financial_year_id: year.id, account_id: A.travel, department_id: depts.ECE, amount: 25000, reason: 'Conference travel — ECE' });
done(`${budgets.length} budgets approved by the Principal; 1 proposal waiting`);

// ------------------------------------------------------------------- fees
const demands = await rows(`
  select d.id, d.student_id, q.name quota,
         json_agg(json_build_object('item', i.id, 'head', c.name, 'amount', i.amount) order by c.name) items
    from student_fee_demand_mapping d join students s on s.id = d.student_id join quotas q on q.id = s.quota_id
    join fee_structure_items i on i.fee_structure_id = d.fee_structure_id join demand_categories c on c.id = i.demand_category_id
   group by d.id, d.student_id, q.name order by d.id`);
const modes = ['cash', 'upi', 'netbanking', 'card', 'dd'];
const receipts = [];
for (const [n, d] of demands.entries()) {
  // Most pay in full; every fifth pays tuition only; every eighth has not paid.
  if (n % 8 === 7) continue;
  for (const it of d.items) {
    if (n % 5 === 4 && !it.head.startsWith('Tuition')) continue;
    const r = await call(T.billing, 'POST', `/student-fee-demand-mappings/${d.id}/payments`, { fee_structure_item_id: it.item, amount_paid: Number(it.amount), payment_mode: modes[n % modes.length] });
    receipts.push(r);
  }
}
done(`${receipts.length} fee receipts at the counter, posted to the books`);

// Refunds: two decided, three waiting for Finance.
const tuitionReceipts = receipts.filter((r) => Number(r.amount_paid ?? r.amount) >= 25000);
for (const [i, r] of tuitionReceipts.slice(0, 5).entries()) {
  const req = await call(T.billing, 'POST', '/fee-refunds', { fee_payment_id: r.id, amount: 2500, reason: i < 2 ? 'Scholarship credited after payment' : 'Paid twice by mistake' });
  if (i < 2) await call(T.fin1, 'POST', `/fee-refunds/${req.id}/approve`, { payment_mode: 'netbanking', payment_reference: `NEFT-REF-${1001 + i}`, fee_due_again: false });
}
done('5 fee refunds requested: 2 approved, 3 waiting for Finance');

// --------------------------------------------------------------- vendor bills
const V = Object.fromEntries((await rows('select id, name from vendors')).map((v) => [v.name, v.id]));
let inv = 100;
async function bill({ vendor, account, dept, taxable, gst = 0, tds = 0, what, approve = true, pay = 0 }) {
  const b = await call(T.fin1, 'POST', '/finance/vendor-bills', {
    bill_kind: 'direct', vendor_id: V[vendor], vendor_invoice_no: `INV/26-27/${++inv}`, vendor_invoice_date: today,
    taxable_amount: taxable, ...(gst ? { gst_amount: gst } : {}), ...(tds ? { tds_section: '194C', tds_amount: tds } : {}),
    expense_account_id: A[account], ...(dept ? { department_id: depts[dept] } : {}), description: what,
  });
  if (!approve) return b;
  const a = await call(T.fin2, 'POST', `/finance/vendor-bills/${b.id}/approve`, {});
  if (pay > 0) await call(T.fin1, 'POST', `/finance/vendor-bills/${b.id}/payments`, { amount: pay, paid_from_account_id: A.sbi, payment_mode: 'bank_transfer', payment_reference: `UTR${Date.now() % 1e9}${inv}` });
  return a;
}
await bill({ vendor: 'Kovai Power Electricals', account: 'electricity', taxable: 142000, gst: 0, what: 'Electricity — September 2026', pay: 142000 });
await bill({ vendor: 'Western Ghats Water Supply', account: 'water', taxable: 28000, gst: 1400, what: 'Water supply — September 2026', pay: 29400 });
await bill({ vendor: 'Shield Security Services', account: 'security', taxable: 70000, gst: 12600, tds: 1400, what: 'Security — September 2026', pay: 81200 });
await bill({ vendor: 'Green Campus Housekeeping', account: 'housekeeping', taxable: 55000, gst: 9900, tds: 1100, what: 'Housekeeping — September 2026', pay: 30000 });
await bill({ vendor: 'Swift Net Broadband', account: 'internet', taxable: 22000, gst: 3960, what: 'Internet — October 2026' });
await bill({ vendor: 'Sri Murugan Lab Instruments', account: 'labCons', dept: 'ECE', taxable: 38000, gst: 6840, what: 'Oscilloscope probes and breadboards' });
await bill({ vendor: 'Annai Stationery Mart', account: 'stationery', taxable: 12500, gst: 2250, what: 'Answer booklets and registers', pay: 14750 });
await bill({ vendor: 'Velan Civil Contractors', account: 'repairs', dept: 'CIVIL', taxable: 64000, gst: 11520, tds: 1280, what: 'Survey lab roof repair' });
await bill({ vendor: 'Kongu Computers', account: 'labCons', dept: 'CSE', taxable: 18500, gst: 3330, what: 'Keyboards and mice for CSE lab 2', approve: false });
await bill({ vendor: 'Lakshmi Travels', account: 'travel', dept: 'CSE', taxable: 8400, what: 'Faculty travel — IEEE conference, Chennai', approve: false });
await bill({ vendor: 'Kovai Power Electricals', account: 'repairs', taxable: 9600, gst: 1728, what: 'Generator servicing', approve: false });
// Over budget: CSE travel budget is ₹30,000.
const over = await call(T.fin1, 'POST', '/finance/vendor-bills', { bill_kind: 'direct', vendor_id: V['Lakshmi Travels'], vendor_invoice_no: `INV/26-27/${++inv}`, vendor_invoice_date: today, taxable_amount: 26000, expense_account_id: A.travel, department_id: depts.CSE, description: 'Student team travel — Smart India Hackathon finals' });
done('12 vendor bills: 8 approved (5 paid, 1 part-paid), 4 awaiting approval, 1 of them over budget');
void over;

// ---------------------------------------------------------------- payroll
const faculty = await rows('select id, designation from faculty order by id');
const ym = today.slice(0, 7);
const [y, m] = ym.split('-').map(Number);
const prevMonth = m === 1 ? `${y - 1}-12` : `${y}-${String(m - 1).padStart(2, '0')}`;
for (const f of faculty) {
  const head = f.designation.includes('Head');
  const basic = head ? 95000 : f.designation.includes('Associate') ? 72000 : 58000;
  await call(T.hr, 'POST', '/me/hr-payroll', {
    faculty_id: f.id, month: prevMonth, basic_salary: basic, hra: Math.round(basic * 0.2), da: Math.round(basic * 0.1),
    pf_deduction: 1800, esi_deduction: 0, professional_tax: 208, tds_deduction: head ? 9500 : 4200, other_deductions: 0,
    employer_pf: 1800, employer_esi: 0,
  });
}
const [py, pm] = prevMonth.split('-').map(Number);
const run = await call(T.fin1, 'POST', '/finance/payroll/runs', { year: py, month: pm });
const approved = await call(T.fin2, 'POST', `/finance/payroll/runs/${run.id}/approve`, {});
await call(T.fin1, 'POST', `/finance/payroll/runs/${run.id}/payments`, { amount: Number(approved.net_total), paid_from_account_id: A.sbi, payment_mode: 'bank_transfer', payment_reference: `SAL-${prevMonth}` });
done(`payroll for ${prevMonth}: ${faculty.length} salaries by HR, run approved and paid (net ₹${approved.net_total})`);

// ----------------------------------------------------------------- grants
const g1 = await call(T.fin1, 'POST', '/finance/grants', { title: 'AICTE MODROBS — Embedded systems lab', funder: 'AICTE', sanction_reference: 'AICTE/MODROBS/2026/114', sanctioned_amount: 1500000, sanctioned_on: '2026-07-15', department_id: depts.ECE, unspent_account_id: A.grantsUnspent, income_account_id: A.grantIncome });
await call(T.fin1, 'POST', `/finance/grants/${g1.id}/money`, { kind: 'received', amount: 750000, bank_account_id: A.sbi, money_date: today, bank_reference: 'AICTE-REL-1' });
await call(T.fin1, 'POST', `/finance/grants/${g1.id}/uses`, { amount: 210000, description: 'Embedded development kits, first lot' });
const g2 = await call(T.fin1, 'POST', '/finance/grants', { title: 'DST FIST — Materials testing', funder: 'Department of Science and Technology', sanction_reference: 'DST/FIST/2026/31', sanctioned_amount: 2000000, sanctioned_on: '2026-08-20', department_id: depts.CIVIL, unspent_account_id: A.grantsUnspent, income_account_id: A.grantIncome });
void g2;
done('2 grants: AICTE ₹15 L (₹7.5 L received, ₹2.1 L used); DST ₹20 L sanctioned, nothing received yet');

console.log(`\n${steps} steps done.`);
await db.end();
