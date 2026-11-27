-- ===========================================================================
-- Demo database (eos_finance_demo) — base records. LOCAL DEMO DATA ONLY.
-- Every name, number and address below is made up for testing by hand.
-- Money is NOT entered here: it is entered through the running application
-- (02-seed.mjs), so the books are built exactly as real use builds them.
--
-- Password for every login below: the walk-through test password
-- (eos-test-db/walkthrough-logins.md), stored as its SHA-256 hash.
-- ===========================================================================
BEGIN;

-- Roles the Finance walk-through needs.
INSERT INTO roles (name, description) VALUES
  ('admin', 'Administrator'), ('principal', 'Principal'), ('finance', 'Finance office'),
  ('billing', 'Fee counter'), ('hr_payroll', 'HR and payroll'), ('higheredu', 'Higher Education office'),
  ('hod', 'Head of department'), ('faculty', 'Faculty'), ('student', 'Student');

-- Staff logins.
WITH pw AS (SELECT encode(sha256('Rehearsal@2026'::bytea), 'hex') AS h)
INSERT INTO users (email, password_hash, role_id)
SELECT e, (SELECT h FROM pw), (SELECT id FROM roles WHERE name = r)
  FROM (VALUES
    ('admin@sece.example',       'admin'),
    ('principal@sece.example',   'principal'),
    ('lakshmi.finance@sece.example', 'finance'),
    ('rajesh.finance@sece.example',  'finance'),
    ('kavitha.billing@sece.example', 'billing'),
    ('suresh.hr@sece.example',       'hr_payroll'),
    ('anitha.higheredu@sece.example','higheredu')
  ) AS v(e, r);

-- Departments, one B.E. course each, and four batches.
INSERT INTO departments (name, code, office_location, contact_email) VALUES
  ('Computer Science and Engineering', 'CSE', 'Block A, 2nd floor', 'cse@sece.example'),
  ('Electronics and Communication Engineering', 'ECE', 'Block B, 1st floor', 'ece@sece.example'),
  ('Electrical and Electronics Engineering', 'EEE', 'Block B, 2nd floor', 'eee@sece.example'),
  ('Mechanical Engineering', 'MECH', 'Block C, ground floor', 'mech@sece.example'),
  ('Civil Engineering', 'CIVIL', 'Block C, 1st floor', 'civil@sece.example');

INSERT INTO courses (name, code, department_id)
SELECT 'B.E. ' || d.name, 'BE-' || d.code, d.id FROM departments d;

INSERT INTO batches (name, start_year, end_year) VALUES
  ('2023–2027', 2023, 2027), ('2024–2028', 2024, 2028), ('2025–2029', 2025, 2029), ('2026–2030', 2026, 2030);

INSERT INTO classes (batch_id, department_id, course_id, section, current_semester)
SELECT b.id, d.id, c.id, 'A', CASE b.start_year WHEN 2023 THEN 7 WHEN 2024 THEN 5 WHEN 2025 THEN 3 ELSE 1 END
  FROM batches b CROSS JOIN departments d JOIN courses c ON c.department_id = d.id;

INSERT INTO quotas (name) VALUES ('Government quota'), ('Management quota');

-- Fee heads and the 2026–27 fee structures.
INSERT INTO demand_categories (name) VALUES ('Tuition fee'), ('Development fee'), ('Examination fee');

INSERT INTO fee_structures (name, applies_to, quota_id, academic_year, due_date)
SELECT 'B.E. ' || q.name || ' 2026–27', 'quota', q.id, '2026-27', DATE '2026-08-31' FROM quotas q;

INSERT INTO fee_structure_items (fee_structure_id, demand_category_id, amount)
SELECT fs.id, dc.id,
       CASE dc.name
         WHEN 'Tuition fee'     THEN CASE WHEN q.name LIKE 'Government%' THEN 25000 ELSE 75000 END
         WHEN 'Development fee' THEN CASE WHEN q.name LIKE 'Government%' THEN 5000 ELSE 15000 END
         ELSE 2500 END
  FROM fee_structures fs JOIN quotas q ON q.id = fs.quota_id CROSS JOIN demand_categories dc;

-- Sixty students: twelve per department, across the four batches, both quotas.
WITH names(n, first_name, last_name) AS (
  SELECT row_number() OVER (), f, l FROM unnest(ARRAY[
    'Aarav','Diya','Karthik','Meera','Vishnu','Nandhini','Arjun','Keerthana','Harish','Sowmya',
    'Pranav','Divya','Gokul','Harini','Naveen','Janani','Sanjay','Pavithra','Ashwin','Swetha',
    'Rohit','Kaviya','Vignesh','Lavanya','Surya','Madhumitha','Dinesh','Priyanka','Ajay','Shalini',
    'Bharath','Monisha','Kishore','Revathi','Yuvaraj','Sangeetha','Hari','Abinaya','Manoj','Deepika',
    'Saravanan','Gayathri','Praveen','Ramya','Sathish','Nivetha','Vikram','Sruthi','Mukesh','Anusha',
    'Tharun','Kalaivani','Rahul','Bhuvana','Siddharth','Indhu','Gowtham','Pooja','Lokesh','Varsha'],
  ARRAY[
    'Kumar','Ramesh','Subramanian','Krishnan','Prakash','Murugan','Raj','Senthil','Venkatesh','Natarajan',
    'Balaji','Sundar','Ganesan','Shankar','Mohan','Arumugam','Pandian','Selvam','Rajendran','Babu',
    'Saravanan','Chandran','Elango','Gopal','Kannan','Lakshmanan','Mani','Narayanan','Palani','Ravi',
    'Sekar','Thangaraj','Velu','Anand','Bose','Dhanapal','Ezhil','Jagan','Kathir','Muthu',
    'Nagaraj','Perumal','Ramasamy','Sivakumar','Thirumalai','Vasu','Ilango','Jothi','Kumaran','Manickam',
    'Nataraj','Pon','Rangan','Sakthi','Thiyagu','Udhay','Vel','Arul','Bala','Dev']) AS u(f, l)
), ranked AS (
  SELECT n.*, d.id AS department_id, d.code, c.id AS course_id,
         (ARRAY[2023, 2024, 2025, 2026])[1 + ((n.n - 1) % 4)] AS start_year,
         CASE WHEN n.n % 3 = 0 THEN 'Management quota' ELSE 'Government quota' END AS quota
    FROM names n
    JOIN departments d ON d.code = (ARRAY['CSE','ECE','EEE','MECH','CIVIL'])[1 + ((n.n - 1) % 5)]
    JOIN courses c ON c.department_id = d.id
), apps AS (
  INSERT INTO soa_applications (first_name, last_name, student_email)
  SELECT first_name, last_name, lower(first_name) || '.' || lower(last_name) || n || '@student.sece.example'
    FROM ranked ORDER BY n
  RETURNING id, student_email
), logins AS (
  INSERT INTO users (email, password_hash, role_id)
  SELECT a.student_email, encode(sha256('Rehearsal@2026'::bytea), 'hex'), (SELECT id FROM roles WHERE name = 'student')
    FROM apps a
  RETURNING id, email
)
INSERT INTO students (soa_application_id, user_id, student_id_no, roll_no, course_id, quota_id, class_id, batch_id, student_type, dayscholar_mode, joined_academic_year)
SELECT a.id, l.id,
       right(r.start_year::text, 2) || r.code || lpad(r.n::text, 3, '0'),
       right(r.start_year::text, 2) || r.code || lpad(r.n::text, 3, '0'),
       r.course_id, q.id, cl.id, b.id,
       CASE WHEN r.n % 4 = 0 THEN 'hosteller' ELSE 'dayscholar' END::student_type_enum,
       CASE WHEN r.n % 4 = 0 THEN NULL ELSE 'transport' END::dayscholar_mode_enum,
       r.start_year || '-' || right((r.start_year + 1)::text, 2)
  FROM ranked r
  JOIN apps a ON a.student_email = lower(r.first_name) || '.' || lower(r.last_name) || r.n || '@student.sece.example'
  JOIN logins l ON l.email = a.student_email
  JOIN quotas q ON q.name = r.quota
  JOIN batches b ON b.start_year = r.start_year
  JOIN classes cl ON cl.batch_id = b.id AND cl.department_id = r.department_id;

-- Every student is billed their quota's 2026–27 fee.
INSERT INTO student_fee_demand_mapping (student_id, fee_structure_id, academic_year, total_amount)
SELECT s.id, fs.id, '2026-27', (SELECT sum(i.amount) FROM fee_structure_items i WHERE i.fee_structure_id = fs.id)
  FROM students s JOIN fee_structures fs ON fs.quota_id = s.quota_id;

-- Ten faculty, two per department, for payroll.
WITH f(first_name, last_name, designation, dept) AS (VALUES
  ('Ramya', 'Venkatesan', 'Professor and Head', 'CSE'), ('Senthil', 'Kumar', 'Assistant Professor', 'CSE'),
  ('Gowri', 'Shankar', 'Professor and Head', 'ECE'),    ('Arun', 'Prasad', 'Assistant Professor', 'ECE'),
  ('Murali', 'Krishnan', 'Professor and Head', 'EEE'),  ('Divya', 'Bharathi', 'Assistant Professor', 'EEE'),
  ('Saravanan', 'Pillai', 'Professor and Head', 'MECH'), ('Vinoth', 'Raj', 'Associate Professor', 'MECH'),
  ('Kalpana', 'Devi', 'Professor and Head', 'CIVIL'),   ('Prabhu', 'Selvaraj', 'Assistant Professor', 'CIVIL')
), logins AS (
  INSERT INTO users (email, password_hash, role_id)
  SELECT lower(first_name) || '.' || lower(last_name) || '@sece.example', encode(sha256('Rehearsal@2026'::bytea), 'hex'),
         (SELECT id FROM roles WHERE name = CASE WHEN designation LIKE '%Head%' THEN 'hod' ELSE 'faculty' END)
    FROM f
  RETURNING id, email
)
INSERT INTO faculty (user_id, first_name, last_name, designation, department_id, date_of_joining, prefix)
SELECT l.id, f.first_name, f.last_name, f.designation, d.id, DATE '2018-06-01', 'Dr.'
  FROM f JOIN logins l ON l.email = lower(f.first_name) || '.' || lower(f.last_name) || '@sece.example'
  JOIN departments d ON d.code = f.dept;

UPDATE departments d SET head_of_department_faculty_id = fa.id
  FROM faculty fa WHERE fa.department_id = d.id AND fa.designation = 'Professor and Head';

-- Ten suppliers. Made-up businesses, GSTIN and PAN in the right shape only.
INSERT INTO vendors (name, company_name, contact_info, phone, gst_no, pan, type) VALUES
  ('Kovai Power Electricals', 'Kovai Power Electricals', 'Gandhipuram, Coimbatore', '9842012345', '33AAKFK1234A1Z5', 'AAKFK1234A', 'product'),
  ('Sri Murugan Lab Instruments', 'Sri Murugan Lab Instruments Pvt Ltd', 'Peelamedu, Coimbatore', '9842023456', '33AASCS2345B1Z2', 'AASCS2345B', 'product'),
  ('Annai Stationery Mart', 'Annai Stationery Mart', 'R.S. Puram, Coimbatore', '9842034567', '33ABAFA3456C1Z9', 'ABAFA3456C', 'product'),
  ('Western Ghats Water Supply', 'Western Ghats Water Supply', 'Saravanampatti, Coimbatore', '9842045678', '33ABCFW4567D1Z6', 'ABCFW4567D', 'service'),
  ('Kongu Computers', 'Kongu Computers and Peripherals', 'Avinashi Road, Coimbatore', '9842056789', '33AADCK5678E1Z3', 'AADCK5678E', 'product'),
  ('Shield Security Services', 'Shield Security Services', 'Ukkadam, Coimbatore', '9842067890', '33AAFFS6789F1Z0', 'AAFFS6789F', 'service'),
  ('Green Campus Housekeeping', 'Green Campus Housekeeping Services', 'Saibaba Colony, Coimbatore', '9842078901', '33AAGFG7890G1Z7', 'AAGFG7890G', 'service'),
  ('Velan Civil Contractors', 'Velan Civil Contractors', 'Singanallur, Coimbatore', '9842089012', '33AAHFV8901H1Z4', 'AAHFV8901H', 'service'),
  ('Swift Net Broadband', 'Swift Net Broadband Pvt Ltd', 'Race Course, Coimbatore', '9842090123', '33AAJCS9012J1Z1', 'AAJCS9012J', 'service'),
  ('Lakshmi Travels', 'Lakshmi Travels', 'Town Hall, Coimbatore', '9842001234', '33AAKFL0123K1Z8', 'AAKFL0123K', 'service');

COMMIT;
