--
-- PostgreSQL database dump
--

\restrict c9ltqaBxWHvR6erOIghHsi9QxuqD9nmRn12r3UQzmb56rbBHvCvpJ4TEsW0XAxB

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.10 (Debian 17.10-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA public;


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- Name: achievement_media_type_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.achievement_media_type_enum AS ENUM (
    'photo',
    'video'
);


--
-- Name: address_type_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.address_type_enum AS ENUM (
    'permanent',
    'temporary'
);


--
-- Name: alumni_member_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.alumni_member_status_enum AS ENUM (
    'active',
    'inactive'
);


--
-- Name: announcement_category_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.announcement_category_enum AS ENUM (
    'academic',
    'department',
    'emergency',
    'event',
    'general'
);


--
-- Name: announcement_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.announcement_status_enum AS ENUM (
    'draft',
    'published'
);


--
-- Name: appraisal_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.appraisal_status_enum AS ENUM (
    'submitted',
    'hod_reviewed',
    'hr_scored',
    'management_approved',
    'rejected'
);


--
-- Name: approval_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.approval_status_enum AS ENUM (
    'pending',
    'approved',
    'rejected'
);


--
-- Name: attendance_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.attendance_status_enum AS ENUM (
    'present',
    'absent',
    'on_duty'
);


--
-- Name: bill_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.bill_status_enum AS ENUM (
    'pending',
    'paid'
);


--
-- Name: bonafide_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.bonafide_status_enum AS ENUM (
    'pending',
    'faculty_approved',
    'issued',
    'rejected'
);


--
-- Name: borrow_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.borrow_status_enum AS ENUM (
    'borrowed',
    'returned',
    'overdue',
    'lost',
    'damaged'
);


--
-- Name: borrower_type_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.borrower_type_enum AS ENUM (
    'student',
    'faculty',
    'staff'
);


--
-- Name: calendar_event_type_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.calendar_event_type_enum AS ENUM (
    'holiday',
    'event',
    'instruction',
    'assessment',
    'placement',
    'institution'
);


--
-- Name: certificate_request_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.certificate_request_status_enum AS ENUM (
    'pending',
    'ready_to_print',
    'printed',
    'issued'
);


--
-- Name: clearance_exception_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.clearance_exception_status_enum AS ENUM (
    'pending',
    'approved',
    'rejected'
);


--
-- Name: clearance_type_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.clearance_type_enum AS ENUM (
    'fee_due',
    'no_due',
    'library_due'
);


--
-- Name: coe_broadcast_audience_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.coe_broadcast_audience_enum AS ENUM (
    'all_students',
    'final_year_students',
    'faculty',
    'hods'
);


--
-- Name: coe_broadcast_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.coe_broadcast_status_enum AS ENUM (
    'draft',
    'scheduled',
    'published'
);


--
-- Name: condonation_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.condonation_status_enum AS ENUM (
    'requested',
    'approved',
    'rejected'
);


--
-- Name: confidential_event_type_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.confidential_event_type_enum AS ENUM (
    'strong_room_entry',
    'file_access',
    'print_run',
    'seal_break',
    'exception'
);


--
-- Name: convocation_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.convocation_status_enum AS ENUM (
    'eligible',
    'shortfall',
    'registered',
    'degree_awarded'
);


--
-- Name: coordinator_calendar_entry_type_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.coordinator_calendar_entry_type_enum AS ENUM (
    'LEAVE',
    'EVENT'
);


--
-- Name: correction_approval_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.correction_approval_status_enum AS ENUM (
    'pending',
    'approved',
    'rejected'
);


--
-- Name: course_result_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.course_result_status_enum AS ENUM (
    'computed',
    'awaiting_pass_board',
    'approved',
    'published'
);


--
-- Name: dayscholar_mode_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.dayscholar_mode_enum AS ENUM (
    'transport',
    'own_vehicle'
);


--
-- Name: dd_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.dd_status_enum AS ENUM (
    'received',
    'cleared',
    'bounced'
);


--
-- Name: department_document_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.department_document_status_enum AS ENUM (
    'pending',
    'verified',
    'missing'
);


--
-- Name: department_event_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.department_event_status_enum AS ENUM (
    'planning',
    'awaiting_approval',
    'approved',
    'completed'
);


--
-- Name: document_verification_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.document_verification_status_enum AS ENUM (
    'pending',
    'verified',
    'rejected'
);


--
-- Name: drive_application_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.drive_application_status_enum AS ENUM (
    'applied',
    'r1_cleared',
    'r2_cleared',
    'r3_cleared',
    'rejected',
    'placed'
);


--
-- Name: entry_type_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.entry_type_enum AS ENUM (
    'in',
    'out'
);


--
-- Name: exam_category_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.exam_category_enum AS ENUM (
    'regular',
    'arrear',
    'supplementary'
);


--
-- Name: exam_fee_head_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.exam_fee_head_enum AS ENUM (
    'exam_fee',
    'arrear_fee',
    'revaluation_fee',
    'certificate_fee',
    'late_fee'
);


--
-- Name: exam_fee_mode_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.exam_fee_mode_enum AS ENUM (
    'online',
    'challan',
    'counter'
);


--
-- Name: exam_fee_txn_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.exam_fee_txn_status_enum AS ENUM (
    'paid',
    'pending',
    'unpaid',
    'refunded'
);


--
-- Name: exam_registration_fee_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.exam_registration_fee_status_enum AS ENUM (
    'paid',
    'unpaid',
    'partial'
);


--
-- Name: exam_registration_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.exam_registration_status_enum AS ENUM (
    'pending',
    'approved',
    'rejected'
);


--
-- Name: exam_session_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.exam_session_enum AS ENUM (
    'FN',
    'AN'
);


--
-- Name: exam_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.exam_status_enum AS ENUM (
    'created',
    'timetable_published',
    'completed',
    'results_published'
);


--
-- Name: exam_type_category_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.exam_type_category_enum AS ENUM (
    'internal',
    'external'
);


--
-- Name: faculty_attendance_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.faculty_attendance_status_enum AS ENUM (
    'full_day',
    'half_day',
    'absent',
    'on_duty',
    'on_leave',
    'weekly_off',
    'holiday'
);


--
-- Name: faculty_employment_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.faculty_employment_status_enum AS ENUM (
    'probation',
    'confirmed',
    'on_leave',
    'resigned',
    'retired'
);


--
-- Name: faculty_employment_type_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.faculty_employment_type_enum AS ENUM (
    'full_time',
    'part_time',
    'visiting',
    'adjunct'
);


--
-- Name: fee_payment_gateway_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.fee_payment_gateway_status_enum AS ENUM (
    'pending',
    'success',
    'failed'
);


--
-- Name: fee_structure_applies_to_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.fee_structure_applies_to_enum AS ENUM (
    'quota',
    'hostel',
    'transport'
);


--
-- Name: feedback_assignment_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.feedback_assignment_status_enum AS ENUM (
    'NOT_STARTED',
    'IN_PROGRESS',
    'CLOSED'
);


--
-- Name: feedback_course_type_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.feedback_course_type_enum AS ENUM (
    'THEORY',
    'THEORY_WITH_PRACTICAL',
    'THEORY_WITH_PRACTICAL_WITH_PROJECT',
    'LABORATORY',
    'ADDITIONAL'
);


--
-- Name: feedback_form_type_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.feedback_form_type_enum AS ENUM (
    'general',
    'end_semester'
);


--
-- Name: feedback_question_type_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.feedback_question_type_enum AS ENUM (
    'rating',
    'text'
);


--
-- Name: feedback_rating_label_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.feedback_rating_label_enum AS ENUM (
    'excellent',
    'very_good',
    'good',
    'satisfactory',
    'need_improvement'
);


--
-- Name: feedback_service_type_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.feedback_service_type_enum AS ENUM (
    'food_court',
    'medical',
    'library',
    'stationary',
    'copy_center'
);


--
-- Name: finance_delivery_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.finance_delivery_status_enum AS ENUM (
    'ordered',
    'dispatched',
    'in_transit',
    'partially_delivered',
    'delivered',
    'cancelled'
);


--
-- Name: finance_ledger_entry_type_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.finance_ledger_entry_type_enum AS ENUM (
    'credit',
    'debit',
    'adjustment_increase',
    'adjustment_decrease',
    'reversal'
);


--
-- Name: finance_ledger_source_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.finance_ledger_source_enum AS ENUM (
    'opening_balance',
    'pop_approval',
    'sop_approval',
    'manual_adjustment',
    'order_cancellation'
);


--
-- Name: finance_order_kind_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.finance_order_kind_enum AS ENUM (
    'purchase',
    'service'
);


--
-- Name: higher_education_admission_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.higher_education_admission_status_enum AS ENUM (
    'interested',
    'applied',
    'admitted',
    'enrolled'
);


--
-- Name: higher_education_offer_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.higher_education_offer_status_enum AS ENUM (
    'awaited',
    'received',
    'accepted',
    'declined'
);


--
-- Name: higher_education_visa_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.higher_education_visa_status_enum AS ENUM (
    'not_applied',
    'in_progress',
    'applied',
    'approved',
    'rejected'
);


--
-- Name: hostel_complaint_category_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.hostel_complaint_category_enum AS ENUM (
    'plumbing',
    'electrical',
    'carpentry',
    'network',
    'mess',
    'facilities',
    'other'
);


--
-- Name: hostel_complaint_priority_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.hostel_complaint_priority_enum AS ENUM (
    'low',
    'medium',
    'high'
);


--
-- Name: hostel_complaint_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.hostel_complaint_status_enum AS ENUM (
    'open',
    'in_progress',
    'resolved',
    'escalated'
);


--
-- Name: hostel_quit_fee_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.hostel_quit_fee_status_enum AS ENUM (
    'pending',
    'completed'
);


--
-- Name: hostel_warden_role_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.hostel_warden_role_enum AS ENUM (
    'super_warden',
    'sub_warden'
);


--
-- Name: hostel_wing_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.hostel_wing_enum AS ENUM (
    'boys',
    'girls'
);


--
-- Name: indent_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.indent_status_enum AS ENUM (
    'submitted',
    'finance_approved',
    'hod_approved',
    'rejected',
    'order_created',
    'draft',
    'withdrawn'
);


--
-- Name: invigilation_allocation_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.invigilation_allocation_status_enum AS ENUM (
    'draft',
    'submitted',
    'published'
);


--
-- Name: invigilation_duty_type_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.invigilation_duty_type_enum AS ENUM (
    'regular',
    'relief_pool',
    'squad'
);


--
-- Name: invigilation_role_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.invigilation_role_enum AS ENUM (
    'chief',
    'relief'
);


--
-- Name: lms_resource_type_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.lms_resource_type_enum AS ENUM (
    'file',
    'link'
);


--
-- Name: malpractice_action_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.malpractice_action_enum AS ENUM (
    'reported_to_coe',
    'warning_issued',
    'paper_cancelled',
    'semester_cancelled',
    'debarred_one_year',
    'case_under_enquiry'
);


--
-- Name: malpractice_nature_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.malpractice_nature_enum AS ENUM (
    'unauthorised_material',
    'copying',
    'mobile_device',
    'impersonation',
    'misbehaviour_with_invigilator',
    'answer_script_tampering'
);


--
-- Name: media_request_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.media_request_status_enum AS ENUM (
    'pending',
    'approved',
    'rejected',
    'delivered'
);


--
-- Name: message_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.message_status_enum AS ENUM (
    'sent',
    'delivered',
    'read'
);


--
-- Name: mom_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.mom_status_enum AS ENUM (
    'scheduled',
    'recorded',
    'circulated'
);


--
-- Name: notification_type_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.notification_type_enum AS ENUM (
    'approval_request_pending',
    'approval_request_approved',
    'approval_request_rejected',
    'lms_task_assigned',
    'lms_task_graded',
    'lms_material_posted',
    'announcement_new',
    'exam_result_published',
    'hall_ticket_issued',
    'fee_due_reminder',
    'fee_payment_confirmed',
    'wallet_topup_success',
    'wallet_money_received',
    'attendance_shortage_warning',
    'library_due_reminder',
    'library_overdue_reminder',
    'placement_drive_new',
    'placement_status_updated',
    'hostel_complaint_status_updated',
    'cia_marks_posted',
    'exam_timetable_updated',
    'revaluation_status_updated',
    'invigilation_duty_assigned',
    'fee_overdue_reminder',
    'feedback_form_published',
    'direct_message_received'
);


--
-- Name: od_verification_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.od_verification_status_enum AS ENUM (
    'awaiting_documents',
    'under_review',
    'verified'
);


--
-- Name: outpass_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.outpass_status_enum AS ENUM (
    'pending',
    'approved',
    'rejected'
);


--
-- Name: parent_feedback_category_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.parent_feedback_category_enum AS ENUM (
    'about_student',
    'about_college'
);


--
-- Name: parent_relationship_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.parent_relationship_enum AS ENUM (
    'father',
    'mother',
    'guardian'
);


--
-- Name: pass_board_sheet_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.pass_board_sheet_status_enum AS ENUM (
    'draft',
    'frozen'
);


--
-- Name: pass_board_signoff_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.pass_board_signoff_status_enum AS ENUM (
    'awaiting',
    'signed'
);


--
-- Name: payee_type_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.payee_type_enum AS ENUM (
    'faculty',
    'staff'
);


--
-- Name: payment_mode_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.payment_mode_enum AS ENUM (
    'cash',
    'card',
    'upi',
    'dd',
    'netbanking',
    'razorpay'
);


--
-- Name: payslip_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.payslip_status_enum AS ENUM (
    'pending',
    'processed',
    'rejected'
);


--
-- Name: personal_calendar_entry_category_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.personal_calendar_entry_category_enum AS ENUM (
    'personal',
    'reminder',
    'meeting',
    'task',
    'deadline',
    'follow_up',
    'note'
);


--
-- Name: photocopy_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.photocopy_status_enum AS ENUM (
    'requested',
    'scanned',
    'issued',
    'rejected'
);


--
-- Name: proposal_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.proposal_status_enum AS ENUM (
    'pending',
    'finance_approved',
    'hod_approved',
    'rejected',
    'principal_approved'
);


--
-- Name: publication_type_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.publication_type_enum AS ENUM (
    'original',
    'revaluation'
);


--
-- Name: question_paper_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.question_paper_status_enum AS ENUM (
    'awaiting_upload',
    'under_moderation',
    'sealed'
);


--
-- Name: refund_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.refund_status_enum AS ENUM (
    'pending',
    'approved',
    'rejected'
);


--
-- Name: regulation_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.regulation_status_enum AS ENUM (
    'active',
    'phasing_out',
    'draft'
);


--
-- Name: result_publication_state_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.result_publication_state_enum AS ENUM (
    'embargo',
    'live',
    'held_back'
);


--
-- Name: revaluation_application_type_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.revaluation_application_type_enum AS ENUM (
    'photocopy_and_reval',
    'photocopy_only',
    'reval_only'
);


--
-- Name: revaluation_request_kind_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.revaluation_request_kind_enum AS ENUM (
    'revaluation',
    'retotaling'
);


--
-- Name: revaluation_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.revaluation_status_enum AS ENUM (
    'requested',
    'under_review',
    'revised',
    'no_change',
    'approved',
    'rejected'
);


--
-- Name: salary_payment_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.salary_payment_status_enum AS ENUM (
    'processed',
    'pending',
    'hold'
);


--
-- Name: script_archive_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.script_archive_status_enum AS ENUM (
    'in_archive',
    'issued_out',
    'due_disposal'
);


--
-- Name: script_bundle_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.script_bundle_status_enum AS ENUM (
    'allotted',
    'under_valuation',
    'submitted'
);


--
-- Name: seating_allocation_mode_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.seating_allocation_mode_enum AS ENUM (
    'automatic',
    'manual'
);


--
-- Name: seating_pattern_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.seating_pattern_enum AS ENUM (
    'sequential',
    'alternate_seat',
    'rowwise_mixed',
    'columnwise_mixed',
    'checkerboard',
    'snake_order'
);


--
-- Name: secretary_request_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.secretary_request_status_enum AS ENUM (
    'draft',
    'pending',
    'approved',
    'rejected'
);


--
-- Name: soa_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.soa_status_enum AS ENUM (
    'applied',
    'fees_paid',
    'admission_confirmed',
    'cancelled'
);


--
-- Name: sports_announcement_cat_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.sports_announcement_cat_enum AS ENUM (
    'trials',
    'facility',
    'intramural',
    'general'
);


--
-- Name: sports_athlete_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.sports_athlete_status_enum AS ENUM (
    'active',
    'injured',
    'rest'
);


--
-- Name: sports_coach_duty_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.sports_coach_duty_status_enum AS ENUM (
    'on_duty',
    'on_leave'
);


--
-- Name: sports_equipment_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.sports_equipment_status_enum AS ENUM (
    'available',
    'in_service',
    'retired'
);


--
-- Name: sports_facility_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.sports_facility_status_enum AS ENUM (
    'available',
    'under_repair',
    'closed'
);


--
-- Name: sports_facility_type_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.sports_facility_type_enum AS ENUM (
    'ground',
    'court',
    'hall',
    'gym',
    'pool',
    'other'
);


--
-- Name: sports_fitness_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.sports_fitness_status_enum AS ENUM (
    'fit',
    'rest',
    'injured'
);


--
-- Name: sports_incident_type_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.sports_incident_type_enum AS ENUM (
    'injury',
    'facility'
);


--
-- Name: sports_injury_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.sports_injury_status_enum AS ENUM (
    'open',
    'closed'
);


--
-- Name: sports_report_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.sports_report_status_enum AS ENUM (
    'draft',
    'scheduled',
    'open'
);


--
-- Name: sports_session_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.sports_session_status_enum AS ENUM (
    'pending',
    'confirmed',
    'done',
    'cancelled'
);


--
-- Name: sports_team_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.sports_team_status_enum AS ENUM (
    'pending',
    'confirmed'
);


--
-- Name: sports_trial_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.sports_trial_status_enum AS ENUM (
    'pending',
    'selected',
    'hold'
);


--
-- Name: staff_category_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.staff_category_enum AS ENUM (
    'housekeeping',
    'security',
    'lab_assistant',
    'office',
    'other'
);


--
-- Name: stationary_color_mode_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.stationary_color_mode_enum AS ENUM (
    'color',
    'bw'
);


--
-- Name: stationary_orientation_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.stationary_orientation_enum AS ENUM (
    'portrait',
    'landscape'
);


--
-- Name: stationary_pages_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.stationary_pages_enum AS ENUM (
    'all',
    'even',
    'odd'
);


--
-- Name: stationary_request_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.stationary_request_status_enum AS ENUM (
    'pending_payment',
    'paid',
    'processing',
    'ready_for_pickup',
    'completed',
    'rejected'
);


--
-- Name: stationery_category_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.stationery_category_enum AS ENUM (
    'study',
    'food',
    'care',
    'hostel',
    'college'
);


--
-- Name: stationery_order_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.stationery_order_status_enum AS ENUM (
    'pending',
    'confirmed',
    'preparing',
    'ready_for_pickup',
    'collected',
    'cancelled'
);


--
-- Name: stationery_payment_method_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.stationery_payment_method_enum AS ENUM (
    'wallet',
    'razorpay'
);


--
-- Name: stationery_payment_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.stationery_payment_status_enum AS ENUM (
    'pending',
    'paid',
    'failed',
    'refunded'
);


--
-- Name: student_leave_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.student_leave_status_enum AS ENUM (
    'pending',
    'faculty_approved',
    'hod_approved',
    'rejected',
    'warden_approved'
);


--
-- Name: student_type_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.student_type_enum AS ENUM (
    'hosteller',
    'dayscholar'
);


--
-- Name: subject_category_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.subject_category_enum AS ENUM (
    'CORE',
    'ELECTIVE',
    'OPEN_ELECTIVE',
    'MANDATORY',
    'VALUE_ADDED'
);


--
-- Name: subject_course_type_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.subject_course_type_enum AS ENUM (
    'THEORY',
    'PRACTICAL',
    'THEORY_WITH_PRACTICAL',
    'PROJECT',
    'MANDATORY',
    'AUDIT'
);


--
-- Name: target_audience_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.target_audience_enum AS ENUM (
    'parents',
    'teachers',
    'students',
    'roles',
    'edc_founders',
    'edc_inside_college',
    'edc_all_entrepreneurs'
);


--
-- Name: task_type_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.task_type_enum AS ENUM (
    'assignment',
    'quiz'
);


--
-- Name: timetable_version_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.timetable_version_status_enum AS ENUM (
    'draft',
    'ready_to_publish',
    'published',
    'superseded',
    'withdrawn'
);


--
-- Name: user_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.user_status_enum AS ENUM (
    'active',
    'inactive'
);


--
-- Name: vendor_type_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.vendor_type_enum AS ENUM (
    'product',
    'service'
);


--
-- Name: venture_registration_type_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.venture_registration_type_enum AS ENUM (
    'private_limited',
    'llp',
    'proprietorship',
    'unregistered'
);


--
-- Name: venue_booking_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.venue_booking_status_enum AS ENUM (
    'pending',
    'approved',
    'rejected',
    'alternative_offered',
    'cancelled'
);


--
-- Name: venue_type_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.venue_type_enum AS ENUM (
    'classroom',
    'lab',
    'seminar_hall',
    'auditorium',
    'exam_hall',
    'other'
);


--
-- Name: wallet_outlet_type_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.wallet_outlet_type_enum AS ENUM (
    'recharge_counter',
    'stationary',
    'photocopier',
    'canteen'
);


--
-- Name: wallet_txn_source_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.wallet_txn_source_enum AS ENUM (
    'cash',
    'razorpay',
    'adjustment',
    'purchase',
    'transfer'
);


--
-- Name: wallet_txn_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.wallet_txn_status_enum AS ENUM (
    'pending',
    'success',
    'failed'
);


--
-- Name: wallet_txn_type_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.wallet_txn_type_enum AS ENUM (
    'credit',
    'debit'
);


--
-- Name: apply_wallet_transaction(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.apply_wallet_transaction() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    BEGIN
        IF NEW.status = 'success'
           AND (TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM 'success') THEN
            UPDATE wallets
            SET balance = balance + (CASE WHEN NEW.txn_type = 'credit' THEN NEW.amount ELSE -NEW.amount END),
                updated_at = now()
            WHERE id = NEW.wallet_id;
        END IF;
        RETURN NEW;
    END;
    $$;


--
-- Name: finance_allotment_guard(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.finance_allotment_guard() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_status     "finance_delivery_status_enum";
  v_delivered  INTEGER;
  v_allotted   INTEGER;
BEGIN
  SELECT "delivery_status", "quantity_delivered" INTO v_status, v_delivered
  FROM "finance_order_tracking" WHERE "id" = NEW."tracking_id" FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'finance: tracking row % does not exist', NEW."tracking_id";
  END IF;

  IF v_status NOT IN ('delivered', 'partially_delivered') THEN
    RAISE EXCEPTION
      'finance: cannot allot an order that is not delivered (current status: %)', v_status
      USING ERRCODE = 'check_violation';
  END IF;

  SELECT COALESCE(SUM("quantity"), 0) INTO v_allotted
  FROM "finance_order_allotments"
  WHERE "tracking_id" = NEW."tracking_id"
    AND ("id" <> NEW."id" OR TG_OP = 'INSERT');

  IF v_delivered > 0 AND (v_allotted + NEW."quantity") > v_delivered THEN
    RAISE EXCEPTION
      'finance: allotting % would exceed the delivered quantity (delivered %, already allotted %)',
      NEW."quantity", v_delivered, v_allotted
      USING ERRCODE = 'check_violation';
  END IF;

  NEW."updated_at" := CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$;


--
-- Name: finance_append_only(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.finance_append_only() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  RAISE EXCEPTION
    'finance: % on % is not permitted — this table is append-only', TG_OP, TG_TABLE_NAME
    USING ERRCODE = 'insufficient_privilege';
END;
$$;


--
-- Name: finance_funds_guard(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.finance_funds_guard() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF NEW."available_amount" IS DISTINCT FROM OLD."available_amount"
     AND COALESCE(current_setting('eos.finance_ledger_ctx', true), '0') <> '1' THEN
    RAISE EXCEPTION
      'finance: available_amount is derived from the ledger and cannot be set directly — post a ledger entry instead'
      USING ERRCODE = 'insufficient_privilege';
  END IF;
  NEW."updated_at" := CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$;


--
-- Name: finance_ledger_apply(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.finance_ledger_apply() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_current  NUMERIC(14,2);
  v_locked   BOOLEAN;
  v_delta    NUMERIC(14,2);
  v_new      NUMERIC(14,2);
BEGIN
  -- Serialise concurrent movements on the same fund. Without this lock two
  -- simultaneous approvals could each read the same balance and both pass
  -- the overdraft check.
  SELECT "available_amount", "is_locked" INTO v_current, v_locked
  FROM "finance_funds" WHERE "id" = NEW."fund_id" FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'finance: fund % does not exist', NEW."fund_id";
  END IF;

  IF v_locked THEN
    RAISE EXCEPTION 'finance: fund % is locked and cannot accept further movement', NEW."fund_id";
  END IF;

  v_delta := CASE NEW."entry_type"
               WHEN 'credit'              THEN  NEW."amount"
               WHEN 'adjustment_increase' THEN  NEW."amount"
               WHEN 'reversal'            THEN  NEW."amount"
               WHEN 'debit'               THEN -NEW."amount"
               WHEN 'adjustment_decrease' THEN -NEW."amount"
             END;

  v_new := v_current + v_delta;

  -- No overdraft: Finance can never commit money the fund does not hold.
  IF v_new < 0 THEN
    RAISE EXCEPTION
      'finance: insufficient funds — available %, requested %', v_current, NEW."amount"
      USING ERRCODE = 'check_violation';
  END IF;

  NEW."balance_after" := v_new;

  -- Flag this transaction as a legitimate, trigger-driven balance change so
  -- the guard in finance_funds_guard() lets it through.
  PERFORM set_config('eos.finance_ledger_ctx', '1', true);
  UPDATE "finance_funds"
     SET "available_amount" = v_new,
         "updated_at"       = CURRENT_TIMESTAMP
   WHERE "id" = NEW."fund_id";
  PERFORM set_config('eos.finance_ledger_ctx', '0', true);

  RETURN NEW;
END;
$$;


--
-- Name: finance_tracking_on_insert(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.finance_tracking_on_insert() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO "finance_order_tracking_events"
    ("tracking_id", "from_status", "to_status", "note", "changed_by_user_id")
  VALUES
    (NEW."id", NULL, NEW."delivery_status", NEW."remarks", NEW."created_by_user_id");
  RETURN NEW;
END;
$$;


--
-- Name: finance_tracking_on_update(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.finance_tracking_on_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF NEW."delivery_status" IS DISTINCT FROM OLD."delivery_status" THEN
    -- A cancelled or fully delivered order is terminal; it must not silently
    -- go backwards to an in-flight state.
    IF OLD."delivery_status" IN ('delivered', 'cancelled')
       AND NEW."delivery_status" NOT IN ('delivered', 'cancelled') THEN
      RAISE EXCEPTION
        'finance: order tracking cannot move from % back to %', OLD."delivery_status", NEW."delivery_status"
        USING ERRCODE = 'check_violation';
    END IF;

    IF NEW."delivery_status" IN ('delivered', 'partially_delivered') AND NEW."delivered_at" IS NULL THEN
      NEW."delivered_at" := CURRENT_TIMESTAMP;
    END IF;

    INSERT INTO "finance_order_tracking_events"
      ("tracking_id", "from_status", "to_status", "note", "changed_by_user_id")
    VALUES
      (NEW."id", OLD."delivery_status", NEW."delivery_status", NEW."remarks",
       COALESCE(NEW."updated_by_user_id", NEW."created_by_user_id"));
  END IF;

  NEW."updated_at" := CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$;


--
-- Name: set_feedback_rating_label(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.set_feedback_rating_label() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.rating_label := CASE NEW.rating_value
        WHEN 5 THEN 'excellent'::feedback_rating_label_enum
        WHEN 4 THEN 'very_good'::feedback_rating_label_enum
        WHEN 3 THEN 'good'::feedback_rating_label_enum
        WHEN 2 THEN 'satisfactory'::feedback_rating_label_enum
        WHEN 1 THEN 'need_improvement'::feedback_rating_label_enum
        ELSE NULL
    END;
    RETURN NEW;
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


--
-- Name: academic_calendars; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.academic_calendars (
    id integer NOT NULL,
    batch_id integer NOT NULL,
    semester smallint NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    created_by_user_id integer
);


--
-- Name: academic_calendars_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.academic_calendars ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.academic_calendars_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: achievement_comments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.achievement_comments (
    id integer NOT NULL,
    achievement_id integer NOT NULL,
    commented_by_user_id integer NOT NULL,
    comment_text text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: achievement_comments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.achievement_comments ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.achievement_comments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: achievement_media; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.achievement_media (
    id integer NOT NULL,
    achievement_id integer NOT NULL,
    media_type public.achievement_media_type_enum NOT NULL,
    media_url character varying(500) NOT NULL,
    thumbnail_url character varying(500),
    sequence_no smallint DEFAULT 1 NOT NULL
);


--
-- Name: achievement_media_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.achievement_media ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.achievement_media_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: admission_profile_drafts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.admission_profile_drafts (
    id integer NOT NULL,
    soa_application_id integer NOT NULL,
    "values" jsonb NOT NULL,
    marks jsonb NOT NULL,
    saved_categories text[],
    updated_at timestamp(3) without time zone NOT NULL
);


--
-- Name: admission_profile_drafts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.admission_profile_drafts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: admission_profile_drafts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.admission_profile_drafts_id_seq OWNED BY public.admission_profile_drafts.id;


--
-- Name: alumni_announcements; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.alumni_announcements (
    id integer NOT NULL,
    posted_by_user_id integer NOT NULL,
    title character varying(150) NOT NULL,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: alumni_announcements_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.alumni_announcements ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.alumni_announcements_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: alumni_batches; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.alumni_batches (
    id integer NOT NULL,
    batch_id integer NOT NULL,
    group_name character varying(150) NOT NULL,
    graduated_on date DEFAULT CURRENT_DATE NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: alumni_batches_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.alumni_batches ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.alumni_batches_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: alumni_group_messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.alumni_group_messages (
    id integer NOT NULL,
    alumni_batch_id integer NOT NULL,
    posted_by_alumni_member_id integer,
    content text NOT NULL,
    attachment_url character varying(500),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    posted_by_user_id integer
);


--
-- Name: alumni_group_messages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.alumni_group_messages ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.alumni_group_messages_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: alumni_members; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.alumni_members (
    id integer NOT NULL,
    alumni_batch_id integer NOT NULL,
    student_id integer NOT NULL,
    personal_email public.citext,
    personal_phone character varying(20),
    current_company character varying(200),
    designation character varying(150),
    status public.alumni_member_status_enum DEFAULT 'active'::public.alumni_member_status_enum NOT NULL,
    joined_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: alumni_members_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.alumni_members ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.alumni_members_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: ambulance_status; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ambulance_status (
    id integer NOT NULL,
    vehicle_number character varying(30) NOT NULL,
    driver_staff_id integer,
    oxygen_cylinder_status character varying(20) DEFAULT 'full'::character varying NOT NULL,
    status character varying(20) DEFAULT 'on_call'::character varying NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT ambulance_status_oxygen_cylinder_status_check CHECK (((oxygen_cylinder_status)::text = ANY ((ARRAY['full'::character varying, 'low'::character varying, 'empty'::character varying])::text[]))),
    CONSTRAINT ambulance_status_status_check CHECK (((status)::text = ANY ((ARRAY['on_call'::character varying, 'dispatched'::character varying])::text[])))
);


--
-- Name: ambulance_status_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.ambulance_status_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ambulance_status_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.ambulance_status_id_seq OWNED BY public.ambulance_status.id;


--
-- Name: ambulance_trips; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ambulance_trips (
    id integer NOT NULL,
    case_summary character varying(200) NOT NULL,
    detail character varying(255),
    outcome character varying(20) NOT NULL,
    occurred_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT ambulance_trips_outcome_check CHECK (((outcome)::text = ANY ((ARRAY['referred'::character varying, 'returned'::character varying])::text[])))
);


--
-- Name: ambulance_trips_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.ambulance_trips_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ambulance_trips_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.ambulance_trips_id_seq OWNED BY public.ambulance_trips.id;


--
-- Name: announcement_class_mapping; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.announcement_class_mapping (
    id integer NOT NULL,
    announcement_id integer NOT NULL,
    class_id integer NOT NULL
);


--
-- Name: announcement_class_mapping_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.announcement_class_mapping_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: announcement_class_mapping_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.announcement_class_mapping_id_seq OWNED BY public.announcement_class_mapping.id;


--
-- Name: announcement_comments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.announcement_comments (
    id integer NOT NULL,
    announcement_id integer NOT NULL,
    commented_by_user_id integer NOT NULL,
    comment_text text NOT NULL,
    parent_comment_id integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: announcement_comments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.announcement_comments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: announcement_comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.announcement_comments_id_seq OWNED BY public.announcement_comments.id;


--
-- Name: announcement_media; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.announcement_media (
    id integer NOT NULL,
    announcement_id integer NOT NULL,
    media_type public.achievement_media_type_enum NOT NULL,
    storage_key character varying(500) NOT NULL,
    thumbnail_key character varying(500),
    width integer,
    height integer,
    duration_seconds integer,
    sequence_no smallint DEFAULT 1 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT announcement_media_dims_check CHECK (((width IS NULL) = (height IS NULL))),
    CONSTRAINT announcement_media_dims_positive_check CHECK (((width IS NULL) OR ((width > 0) AND (height > 0)))),
    CONSTRAINT announcement_media_duration_check CHECK (((duration_seconds IS NULL) OR (duration_seconds > 0))),
    CONSTRAINT announcement_media_seq_range_check CHECK (((sequence_no >= 1) AND (sequence_no <= 10))),
    CONSTRAINT announcement_media_thumbnail_check CHECK (((media_type = 'video'::public.achievement_media_type_enum) OR (thumbnail_key IS NULL)))
);


--
-- Name: TABLE announcement_media; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.announcement_media IS 'Photos/videos attached to an announcement, shown as an ordered carousel. Ordering is sequence_no (1-based); URLs are derived from storage_key on read, never stored.';


--
-- Name: COLUMN announcement_media.width; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.announcement_media.width IS 'Intrinsic pixel width captured at upload, so the client can reserve the right aspect ratio before the file downloads.';


--
-- Name: announcement_media_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.announcement_media_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: announcement_media_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.announcement_media_id_seq OWNED BY public.announcement_media.id;


--
-- Name: announcement_role_mapping; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.announcement_role_mapping (
    id integer NOT NULL,
    announcement_id integer NOT NULL,
    role_id integer NOT NULL
);


--
-- Name: announcement_role_mapping_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.announcement_role_mapping_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: announcement_role_mapping_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.announcement_role_mapping_id_seq OWNED BY public.announcement_role_mapping.id;


--
-- Name: announcements; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.announcements (
    id integer NOT NULL,
    posted_by_user_id integer NOT NULL,
    title character varying(150) NOT NULL,
    content text NOT NULL,
    target_audience public.target_audience_enum NOT NULL,
    batch_id integer,
    department_id integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    file_url text,
    file_name character varying(255),
    status public.announcement_status_enum DEFAULT 'published'::public.announcement_status_enum NOT NULL,
    file_key text,
    category public.announcement_category_enum,
    scheduled_at timestamp with time zone,
    priority character varying(20),
    audience_student_type public.student_type_enum
);


--
-- Name: announcements_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.announcements ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.announcements_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: appraisal_attachments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.appraisal_attachments (
    id integer NOT NULL,
    appraisal_request_id integer NOT NULL,
    division_id integer NOT NULL,
    file_url character varying(500) NOT NULL,
    file_name character varying(255) NOT NULL,
    storage_path character varying(500) NOT NULL,
    uploaded_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: appraisal_attachments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.appraisal_attachments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: appraisal_attachments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.appraisal_attachments_id_seq OWNED BY public.appraisal_attachments.id;


--
-- Name: appraisal_criteria; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.appraisal_criteria (
    id integer NOT NULL,
    division_id integer NOT NULL,
    criteria_name character varying(150) NOT NULL,
    max_score numeric(6,2) NOT NULL,
    academic_year character varying(20) NOT NULL,
    weightage_percent numeric(5,2),
    created_by_user_id integer,
    status character varying(10) DEFAULT 'active'::character varying NOT NULL,
    CONSTRAINT appraisal_criteria_status_check CHECK (((status)::text = ANY ((ARRAY['active'::character varying, 'inactive'::character varying])::text[])))
);


--
-- Name: appraisal_criteria_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.appraisal_criteria ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.appraisal_criteria_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: appraisal_cycles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.appraisal_cycles (
    id integer NOT NULL,
    academic_year character varying(20) NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_by_user_id integer NOT NULL
);


--
-- Name: appraisal_cycles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.appraisal_cycles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: appraisal_cycles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.appraisal_cycles_id_seq OWNED BY public.appraisal_cycles.id;


--
-- Name: appraisal_divisions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.appraisal_divisions (
    id integer NOT NULL,
    name character varying(100) NOT NULL
);


--
-- Name: appraisal_divisions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.appraisal_divisions ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.appraisal_divisions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: appraisal_entries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.appraisal_entries (
    id integer NOT NULL,
    appraisal_request_id integer NOT NULL,
    criteria_id integer NOT NULL,
    description text,
    score numeric(6,2)
);


--
-- Name: appraisal_entries_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.appraisal_entries ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.appraisal_entries_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: appraisal_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.appraisal_requests (
    id integer NOT NULL,
    faculty_id integer,
    academic_year character varying(20) NOT NULL,
    status public.appraisal_status_enum DEFAULT 'submitted'::public.appraisal_status_enum NOT NULL,
    hod_reviewed_by integer,
    hod_reviewed_at timestamp with time zone,
    management_approved_by integer,
    management_approved_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    hod_remarks text,
    staff_user_id integer
);


--
-- Name: appraisal_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.appraisal_requests ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.appraisal_requests_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: assignments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.assignments (
    id integer NOT NULL,
    class_id integer NOT NULL,
    subject_id integer NOT NULL,
    faculty_id integer NOT NULL,
    academic_year character varying(20) NOT NULL,
    semester smallint NOT NULL,
    sequence_no smallint NOT NULL,
    title character varying(200),
    description character varying(2000),
    due_date timestamp with time zone,
    max_marks integer,
    task_type public.task_type_enum DEFAULT 'assignment'::public.task_type_enum NOT NULL,
    attachment_url character varying(500),
    CONSTRAINT assignments_sequence_no_check CHECK (((sequence_no >= 1) AND (sequence_no <= 3)))
);


--
-- Name: assignments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.assignments ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.assignments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: attendance_record_changes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.attendance_record_changes (
    id bigint NOT NULL,
    attendance_record_id integer NOT NULL,
    from_status public.attendance_status_enum,
    to_status public.attendance_status_enum NOT NULL,
    changed_by_user_id integer NOT NULL,
    changed_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: attendance_record_changes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.attendance_record_changes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: attendance_record_changes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.attendance_record_changes_id_seq OWNED BY public.attendance_record_changes.id;


--
-- Name: attendance_records; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.attendance_records (
    id integer NOT NULL,
    student_id integer NOT NULL,
    class_id integer NOT NULL,
    subject_id integer,
    attendance_date date NOT NULL,
    status public.attendance_status_enum NOT NULL,
    marked_by_faculty_id integer,
    marked_by_user_id integer NOT NULL,
    is_published boolean DEFAULT true NOT NULL,
    published_at timestamp without time zone,
    photo_url character varying(500),
    updated_at timestamp with time zone
);


--
-- Name: attendance_records_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.attendance_records ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.attendance_records_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.audit_logs (
    id integer NOT NULL,
    entity_type character varying(50) NOT NULL,
    entity_id integer NOT NULL,
    action character varying(30) NOT NULL,
    performed_by_user_id integer NOT NULL,
    performed_at timestamp(6) with time zone DEFAULT now() NOT NULL,
    old_value jsonb,
    new_value jsonb,
    reason text
);


--
-- Name: audit_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.audit_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: audit_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.audit_logs_id_seq OWNED BY public.audit_logs.id;


--
-- Name: bank_reconciliation_entries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bank_reconciliation_entries (
    id integer NOT NULL,
    bank_reference character varying(150) NOT NULL,
    value_date date NOT NULL,
    fee_payment_gateway_order_id integer,
    amount numeric(12,2) NOT NULL,
    matched boolean DEFAULT false NOT NULL,
    matched_by_user_id integer,
    matched_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: bank_reconciliation_entries_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.bank_reconciliation_entries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: bank_reconciliation_entries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.bank_reconciliation_entries_id_seq OWNED BY public.bank_reconciliation_entries.id;


--
-- Name: batches; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.batches (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    start_year smallint NOT NULL,
    end_year smallint NOT NULL
);


--
-- Name: batches_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.batches ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.batches_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: bills; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bills (
    id integer NOT NULL,
    bill_number character varying(50) NOT NULL,
    purchase_order_id integer,
    service_order_id integer,
    vendor_id integer NOT NULL,
    quantity integer NOT NULL,
    unit_price numeric(12,2) NOT NULL,
    total_amount numeric(12,2) NOT NULL,
    remarks character varying(255),
    status public.bill_status_enum DEFAULT 'pending'::public.bill_status_enum NOT NULL,
    created_by_user_id integer,
    paid_at timestamp(6) with time zone,
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_bills_exactly_one_order CHECK (((((purchase_order_id IS NOT NULL))::integer + ((service_order_id IS NOT NULL))::integer) = 1))
);


--
-- Name: bills_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.bills_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: bills_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.bills_id_seq OWNED BY public.bills.id;


--
-- Name: bonafide_reasons; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bonafide_reasons (
    id integer NOT NULL,
    reason_text character varying(255) NOT NULL
);


--
-- Name: bonafide_reasons_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.bonafide_reasons ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.bonafide_reasons_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: bonafide_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bonafide_requests (
    id integer NOT NULL,
    student_id integer NOT NULL,
    reason_id integer NOT NULL,
    status public.bonafide_status_enum DEFAULT 'pending'::public.bonafide_status_enum NOT NULL,
    requested_at timestamp with time zone DEFAULT now() NOT NULL,
    issued_at timestamp with time zone,
    file_url character varying(500),
    approved_by_faculty_id integer,
    issued_by_hod_user_id integer
);


--
-- Name: bonafide_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.bonafide_requests ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.bonafide_requests_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: book_borrow_records; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.book_borrow_records (
    id integer NOT NULL,
    book_id integer NOT NULL,
    borrower_type public.borrower_type_enum NOT NULL,
    student_id integer,
    faculty_id integer,
    borrowed_date date DEFAULT CURRENT_DATE NOT NULL,
    due_date date NOT NULL,
    returned_date date,
    status public.borrow_status_enum DEFAULT 'borrowed'::public.borrow_status_enum NOT NULL,
    renewal_count smallint DEFAULT 0 NOT NULL,
    last_renewed_at timestamp with time zone,
    damage_lost_charge_amount numeric(10,2),
    damage_lost_collected_by_user_id integer,
    damage_lost_declared_at timestamp(6) with time zone,
    damage_lost_settled boolean DEFAULT false NOT NULL,
    damage_lost_settled_at timestamp(6) with time zone,
    fine_collected_by_user_id integer,
    fine_paid boolean DEFAULT false NOT NULL,
    fine_paid_amount numeric(10,2),
    fine_paid_at timestamp(6) with time zone,
    replacement_indent_id integer,
    staff_user_id integer,
    CONSTRAINT book_borrow_records_check CHECK ((((borrower_type = 'student'::public.borrower_type_enum) AND (student_id IS NOT NULL) AND (faculty_id IS NULL) AND (staff_user_id IS NULL)) OR ((borrower_type = 'faculty'::public.borrower_type_enum) AND (faculty_id IS NOT NULL) AND (student_id IS NULL) AND (staff_user_id IS NULL)) OR ((borrower_type = 'staff'::public.borrower_type_enum) AND (staff_user_id IS NOT NULL) AND (student_id IS NULL) AND (faculty_id IS NULL))))
);


--
-- Name: book_borrow_records_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.book_borrow_records ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.book_borrow_records_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: book_borrow_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.book_borrow_requests (
    id integer NOT NULL,
    book_id integer NOT NULL,
    student_id integer,
    status public.approval_status_enum DEFAULT 'pending'::public.approval_status_enum NOT NULL,
    requested_at timestamp with time zone DEFAULT now() NOT NULL,
    reviewed_by_user_id integer,
    reviewed_at timestamp with time zone,
    borrow_record_id integer,
    faculty_id integer,
    borrower_type public.borrower_type_enum DEFAULT 'student'::public.borrower_type_enum NOT NULL
);


--
-- Name: book_borrow_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.book_borrow_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: book_borrow_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.book_borrow_requests_id_seq OWNED BY public.book_borrow_requests.id;


--
-- Name: book_categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.book_categories (
    id integer NOT NULL,
    name character varying(150) NOT NULL
);


--
-- Name: book_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.book_categories ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.book_categories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: books; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.books (
    id integer NOT NULL,
    qr_code character varying(100) NOT NULL,
    title character varying(255) NOT NULL,
    author character varying(255),
    category_id integer NOT NULL,
    total_copies integer DEFAULT 1 NOT NULL,
    available_copies integer DEFAULT 1 NOT NULL,
    department_id integer,
    edition character varying(50),
    isbn character varying(30),
    price_per_copy numeric(10,2),
    publisher character varying(255),
    vendor_fund character varying(255),
    rack_id integer,
    deleted_at timestamp with time zone
);


--
-- Name: books_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.books ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.books_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: budget_allocations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.budget_allocations (
    id integer NOT NULL,
    head character varying(150) NOT NULL,
    academic_year character varying(20) NOT NULL,
    sanctioned_amount numeric(14,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: budget_allocations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.budget_allocations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: budget_allocations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.budget_allocations_id_seq OWNED BY public.budget_allocations.id;


--
-- Name: bus_documents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bus_documents (
    id integer NOT NULL,
    bus_id integer NOT NULL,
    doc_type character varying(30) NOT NULL,
    reference_no character varying(100),
    valid_until date NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT bus_documents_doc_type_check CHECK (((doc_type)::text = ANY ((ARRAY['insurance'::character varying, 'fitness_certificate'::character varying, 'permit'::character varying, 'pollution_certificate'::character varying, 'road_tax'::character varying])::text[])))
);


--
-- Name: bus_documents_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.bus_documents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: bus_documents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.bus_documents_id_seq OWNED BY public.bus_documents.id;


--
-- Name: bus_fuel_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bus_fuel_logs (
    id integer NOT NULL,
    bus_id integer NOT NULL,
    fill_date date DEFAULT CURRENT_DATE NOT NULL,
    litres numeric(6,2) NOT NULL,
    rate_per_litre numeric(6,2),
    station character varying(150),
    odometer_km integer,
    cost numeric(10,2),
    recorded_by_user_id integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: bus_fuel_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.bus_fuel_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: bus_fuel_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.bus_fuel_logs_id_seq OWNED BY public.bus_fuel_logs.id;


--
-- Name: bus_live_locations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bus_live_locations (
    id integer NOT NULL,
    bus_id integer NOT NULL,
    latitude numeric(10,6) NOT NULL,
    longitude numeric(10,6) NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: bus_live_locations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.bus_live_locations ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.bus_live_locations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: bus_safety_checks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bus_safety_checks (
    id integer NOT NULL,
    bus_id integer NOT NULL,
    item_key character varying(50) NOT NULL,
    status_text character varying(150) NOT NULL,
    is_ok boolean DEFAULT true NOT NULL,
    checked_date date,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: bus_safety_checks_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.bus_safety_checks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: bus_safety_checks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.bus_safety_checks_id_seq OWNED BY public.bus_safety_checks.id;


--
-- Name: bus_service_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bus_service_logs (
    id integer NOT NULL,
    bus_id integer NOT NULL,
    service_date date DEFAULT CURRENT_DATE NOT NULL,
    work_description character varying(500) NOT NULL,
    garage character varying(150),
    odometer_km integer,
    cost numeric(10,2),
    recorded_by_user_id integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: bus_service_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.bus_service_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: bus_service_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.bus_service_logs_id_seq OWNED BY public.bus_service_logs.id;


--
-- Name: buses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.buses (
    id integer NOT NULL,
    route_id integer,
    vehicle_number character varying(30) NOT NULL,
    driver_name character varying(150),
    gps_device_id character varying(100),
    bus_no text NOT NULL,
    capacity integer,
    status character varying(20) DEFAULT 'in_depot'::character varying NOT NULL,
    driver_phone character varying(20),
    driver_licence_no character varying(50),
    driver_licence_expiry date,
    attendant_name character varying(150),
    attendant_phone character varying(20),
    odometer_km integer,
    next_service_due_km integer,
    last_service_date date,
    model character varying(100),
    body_type character varying(100),
    year_of_manufacture smallint,
    fuel_emission character varying(50),
    chassis_no character varying(50),
    engine_no character varying(50),
    engine_spec character varying(100),
    wheelbase_mm integer,
    tyre_spec character varying(100),
    fuel_tank_litres integer,
    ownership character varying(100),
    rto character varying(100),
    parking_bay character varying(50),
    registered_date date,
    driver_experience_years smallint,
    driver_blood_group character varying(10),
    CONSTRAINT buses_status_check CHECK (((status)::text = ANY ((ARRAY['on_route'::character varying, 'at_campus'::character varying, 'in_depot'::character varying, 'maintenance'::character varying])::text[])))
);


--
-- Name: buses_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.buses ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.buses_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: calendar_events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.calendar_events (
    id integer NOT NULL,
    academic_calendar_id integer NOT NULL,
    event_date date NOT NULL,
    description character varying(255),
    event_type public.calendar_event_type_enum DEFAULT 'holiday'::public.calendar_event_type_enum NOT NULL,
    title character varying(200) NOT NULL,
    start_time time without time zone,
    end_time time without time zone,
    created_by_user_id integer
);


--
-- Name: calendar_holidays_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.calendar_events ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.calendar_holidays_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: campus_outing_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.campus_outing_requests (
    id integer NOT NULL,
    student_id integer NOT NULL,
    from_date date NOT NULL,
    to_date date NOT NULL,
    start_time time(6) without time zone NOT NULL,
    return_time time(6) without time zone,
    reason character varying(255),
    status public.student_leave_status_enum DEFAULT 'pending'::public.student_leave_status_enum NOT NULL,
    approved_by_faculty_id integer,
    approved_by_hod_user_id integer,
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: campus_outing_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.campus_outing_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: campus_outing_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.campus_outing_requests_id_seq OWNED BY public.campus_outing_requests.id;


--
-- Name: canteen_bills; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.canteen_bills (
    id integer NOT NULL,
    order_id integer,
    cashier_user_id integer,
    mode_of_payment character varying(20) NOT NULL,
    bill_amount numeric(10,2) NOT NULL,
    date_time timestamp with time zone DEFAULT now() NOT NULL,
    bill_type character varying(50),
    transaction_status boolean DEFAULT true NOT NULL,
    voided_at timestamp with time zone
);


--
-- Name: canteen_bills_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.canteen_bills_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: canteen_bills_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.canteen_bills_id_seq OWNED BY public.canteen_bills.id;


--
-- Name: canteen_dish_categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.canteen_dish_categories (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: canteen_dish_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.canteen_dish_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: canteen_dish_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.canteen_dish_categories_id_seq OWNED BY public.canteen_dish_categories.id;


--
-- Name: canteen_dishes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.canteen_dishes (
    id integer NOT NULL,
    name character varying(150) NOT NULL,
    category_id integer,
    price numeric(10,2) NOT NULL,
    stock_quantity integer DEFAULT 0 NOT NULL,
    image_url text,
    is_veg boolean DEFAULT true NOT NULL,
    is_available boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    parcel_available boolean DEFAULT true NOT NULL
);


--
-- Name: canteen_dishes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.canteen_dishes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: canteen_dishes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.canteen_dishes_id_seq OWNED BY public.canteen_dishes.id;


--
-- Name: canteen_expense_categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.canteen_expense_categories (
    id integer NOT NULL,
    name character varying(100) NOT NULL
);


--
-- Name: canteen_expense_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.canteen_expense_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: canteen_expense_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.canteen_expense_categories_id_seq OWNED BY public.canteen_expense_categories.id;


--
-- Name: canteen_expense_products; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.canteen_expense_products (
    id integer NOT NULL,
    category_id integer,
    product_name character varying(150) NOT NULL,
    price_per_unit numeric(10,2) NOT NULL
);


--
-- Name: canteen_expense_products_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.canteen_expense_products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: canteen_expense_products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.canteen_expense_products_id_seq OWNED BY public.canteen_expense_products.id;


--
-- Name: canteen_expenses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.canteen_expenses (
    id integer NOT NULL,
    name character varying(150) NOT NULL,
    category_id integer,
    vendor_name character varying(150),
    quantity numeric(10,2) NOT NULL,
    date timestamp with time zone DEFAULT now() NOT NULL,
    total_amount numeric(10,2) NOT NULL,
    recorded_by_user_id integer
);


--
-- Name: canteen_expenses_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.canteen_expenses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: canteen_expenses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.canteen_expenses_id_seq OWNED BY public.canteen_expenses.id;


--
-- Name: canteen_gst_rates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.canteen_gst_rates (
    id integer NOT NULL,
    category_id integer,
    gst_percentage numeric(5,2) NOT NULL
);


--
-- Name: canteen_gst_rates_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.canteen_gst_rates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: canteen_gst_rates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.canteen_gst_rates_id_seq OWNED BY public.canteen_gst_rates.id;


--
-- Name: canteen_ingredients; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.canteen_ingredients (
    id integer NOT NULL,
    name character varying(150) NOT NULL,
    stock_quantity numeric(10,2) DEFAULT 0 NOT NULL,
    price_per_unit numeric(10,2) NOT NULL,
    threshold numeric(10,2) DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: canteen_ingredients_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.canteen_ingredients_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: canteen_ingredients_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.canteen_ingredients_id_seq OWNED BY public.canteen_ingredients.id;


--
-- Name: canteen_order_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.canteen_order_items (
    id integer NOT NULL,
    order_id integer NOT NULL,
    dish_id integer,
    category_id integer,
    quantity integer NOT NULL,
    price numeric(10,2) NOT NULL,
    is_parcel boolean DEFAULT false NOT NULL
);


--
-- Name: canteen_order_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.canteen_order_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: canteen_order_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.canteen_order_items_id_seq OWNED BY public.canteen_order_items.id;


--
-- Name: canteen_orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.canteen_orders (
    id integer NOT NULL,
    placed_by_user_id integer,
    status character varying(20) DEFAULT 'pending'::character varying NOT NULL,
    payment_method character varying(50),
    total_amount numeric(10,2),
    order_source character varying(20) DEFAULT 'cashier'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    is_emergency boolean DEFAULT false NOT NULL,
    pickup_token character varying(12),
    wallet_transaction_id integer,
    payment_status character varying(20) DEFAULT 'pending'::character varying,
    razorpay_order_id character varying(100),
    razorpay_payment_id character varying(100),
    razorpay_signature character varying(255),
    token_date date
);


--
-- Name: canteen_orders_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.canteen_orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: canteen_orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.canteen_orders_id_seq OWNED BY public.canteen_orders.id;


--
-- Name: canteen_recipe_ingredients; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.canteen_recipe_ingredients (
    id integer NOT NULL,
    recipe_id integer NOT NULL,
    ingredient_id integer NOT NULL,
    quantity_needed numeric(10,2) NOT NULL,
    unit character varying(20) NOT NULL
);


--
-- Name: canteen_recipe_ingredients_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.canteen_recipe_ingredients_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: canteen_recipe_ingredients_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.canteen_recipe_ingredients_id_seq OWNED BY public.canteen_recipe_ingredients.id;


--
-- Name: canteen_recipes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.canteen_recipes (
    id integer NOT NULL,
    dish_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: canteen_recipes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.canteen_recipes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: canteen_recipes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.canteen_recipes_id_seq OWNED BY public.canteen_recipes.id;


--
-- Name: canteen_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.canteen_settings (
    id integer NOT NULL,
    gst_percentage numeric(5,2) DEFAULT 0 NOT NULL,
    parcel_charge numeric(10,2) DEFAULT 5 NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: canteen_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.canteen_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: canteen_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.canteen_settings_id_seq OWNED BY public.canteen_settings.id;


--
-- Name: canteen_stock_batches; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.canteen_stock_batches (
    id integer NOT NULL,
    product_id integer NOT NULL,
    quantity integer NOT NULL,
    remaining_quantity integer NOT NULL,
    unit_price numeric(10,2) NOT NULL,
    date_added timestamp with time zone DEFAULT now() NOT NULL,
    supplier character varying(150),
    batch_reference character varying(100),
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: canteen_stock_batches_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.canteen_stock_batches_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: canteen_stock_batches_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.canteen_stock_batches_id_seq OWNED BY public.canteen_stock_batches.id;


--
-- Name: canteen_stock_transactions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.canteen_stock_transactions (
    id integer NOT NULL,
    product_id integer NOT NULL,
    transaction_type character varying(20) NOT NULL,
    quantity integer NOT NULL,
    unit_price numeric(10,2),
    total_cost numeric(10,2),
    batch_id integer,
    reference_id character varying(100),
    reference_type character varying(50),
    transaction_date timestamp with time zone DEFAULT now() NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: canteen_stock_transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.canteen_stock_transactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: canteen_stock_transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.canteen_stock_transactions_id_seq OWNED BY public.canteen_stock_transactions.id;


--
-- Name: canteen_todays_specials; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.canteen_todays_specials (
    id integer NOT NULL,
    meal_type character varying(10) NOT NULL,
    image_url text NOT NULL,
    display_order integer DEFAULT 0 NOT NULL,
    special_date date DEFAULT CURRENT_DATE NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_by_user_id integer
);


--
-- Name: canteen_todays_specials_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.canteen_todays_specials_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: canteen_todays_specials_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.canteen_todays_specials_id_seq OWNED BY public.canteen_todays_specials.id;


--
-- Name: certificate_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.certificate_requests (
    id integer NOT NULL,
    student_id integer NOT NULL,
    certificate_type_id integer NOT NULL,
    fee_amount numeric(8,2),
    fee_paid boolean DEFAULT false NOT NULL,
    signatory_status character varying(30) DEFAULT 'awaiting'::character varying NOT NULL,
    status public.certificate_request_status_enum DEFAULT 'pending'::public.certificate_request_status_enum NOT NULL,
    requested_at timestamp with time zone DEFAULT now() NOT NULL,
    issued_at timestamp with time zone,
    copies integer DEFAULT 1 NOT NULL,
    delivery_mode character varying(30),
    reason character varying(300)
);


--
-- Name: certificate_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.certificate_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: certificate_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.certificate_requests_id_seq OWNED BY public.certificate_requests.id;


--
-- Name: certificate_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.certificate_types (
    id integer NOT NULL,
    name character varying(150) NOT NULL
);


--
-- Name: certificate_types_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.certificate_types ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.certificate_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: chat_conversations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.chat_conversations (
    id integer NOT NULL,
    user_id integer NOT NULL,
    title character varying(120) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: chat_conversations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.chat_conversations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: chat_conversations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.chat_conversations_id_seq OWNED BY public.chat_conversations.id;


--
-- Name: chat_messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.chat_messages (
    id integer NOT NULL,
    conversation_id integer NOT NULL,
    role character varying(10) NOT NULL,
    message text NOT NULL,
    intent character varying(100),
    confidence numeric(4,3),
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: chat_messages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.chat_messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: chat_messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.chat_messages_id_seq OWNED BY public.chat_messages.id;


--
-- Name: class_mentors; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.class_mentors (
    id integer NOT NULL,
    class_id integer NOT NULL,
    faculty_id integer NOT NULL,
    academic_year character varying(20) NOT NULL,
    assigned_by_user_id integer
);


--
-- Name: class_mentors_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.class_mentors ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.class_mentors_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: class_subjects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.class_subjects (
    id integer NOT NULL,
    class_id integer NOT NULL,
    subject_id integer NOT NULL,
    semester smallint NOT NULL,
    is_elective boolean DEFAULT false NOT NULL
);


--
-- Name: class_subjects_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.class_subjects ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.class_subjects_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: classes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.classes (
    id integer NOT NULL,
    batch_id integer NOT NULL,
    department_id integer NOT NULL,
    course_id integer NOT NULL,
    section character varying(10) NOT NULL,
    current_semester smallint,
    classroom character varying(50)
);


--
-- Name: classes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.classes ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.classes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: coe_notification_broadcasts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.coe_notification_broadcasts (
    id integer NOT NULL,
    posted_by_user_id integer NOT NULL,
    title character varying(150) NOT NULL,
    category public.notification_type_enum NOT NULL,
    audience public.coe_broadcast_audience_enum NOT NULL,
    send_portal boolean DEFAULT true NOT NULL,
    send_email boolean DEFAULT false NOT NULL,
    send_sms boolean DEFAULT false NOT NULL,
    message text NOT NULL,
    status public.coe_broadcast_status_enum DEFAULT 'draft'::public.coe_broadcast_status_enum NOT NULL,
    scheduled_at timestamp with time zone,
    published_at timestamp with time zone,
    recipient_count integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: coe_notification_broadcasts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.coe_notification_broadcasts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: coe_notification_broadcasts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.coe_notification_broadcasts_id_seq OWNED BY public.coe_notification_broadcasts.id;


--
-- Name: coe_profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.coe_profiles (
    id integer NOT NULL,
    user_id integer NOT NULL,
    is_senior boolean DEFAULT false NOT NULL,
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: coe_profiles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.coe_profiles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: coe_profiles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.coe_profiles_id_seq OWNED BY public.coe_profiles.id;


--
-- Name: companies; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.companies (
    id integer NOT NULL,
    name character varying(200) NOT NULL,
    profile_info text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: companies_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.companies ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.companies_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: condonation_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.condonation_requests (
    id integer NOT NULL,
    student_id integer NOT NULL,
    exam_id integer NOT NULL,
    reason character varying(255),
    status public.condonation_status_enum DEFAULT 'requested'::public.condonation_status_enum NOT NULL,
    reviewed_by_user_id integer,
    reviewed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: condonation_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.condonation_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: condonation_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.condonation_requests_id_seq OWNED BY public.condonation_requests.id;


--
-- Name: confidential_access_events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.confidential_access_events (
    id integer NOT NULL,
    event_type public.confidential_event_type_enum NOT NULL,
    person_user_id integer NOT NULL,
    object_description character varying(255) NOT NULL,
    witness_user_id integer,
    witness_description character varying(150),
    verification_method character varying(100) NOT NULL,
    occurred_at timestamp with time zone DEFAULT now() NOT NULL,
    question_paper_id integer
);


--
-- Name: confidential_access_events_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.confidential_access_events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: confidential_access_events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.confidential_access_events_id_seq OWNED BY public.confidential_access_events.id;


--
-- Name: convocation_registrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.convocation_registrations (
    id integer NOT NULL,
    student_id integer NOT NULL,
    cgpa numeric(4,2),
    arrears_count integer DEFAULT 0 NOT NULL,
    classification character varying(50),
    status public.convocation_status_enum DEFAULT 'eligible'::public.convocation_status_enum NOT NULL,
    registered_at timestamp with time zone,
    convocation_batch character varying(100),
    merit_list_eligible boolean DEFAULT true NOT NULL,
    remarks character varying(500)
);


--
-- Name: convocation_registrations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.convocation_registrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: convocation_registrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.convocation_registrations_id_seq OWNED BY public.convocation_registrations.id;


--
-- Name: coordinator_calendar_entries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.coordinator_calendar_entries (
    id integer NOT NULL,
    academic_year character varying(20) NOT NULL,
    semester smallint,
    entry_date date NOT NULL,
    entry_type public.coordinator_calendar_entry_type_enum NOT NULL,
    title character varying(200) NOT NULL,
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: coordinator_calendar_entries_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.coordinator_calendar_entries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: coordinator_calendar_entries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.coordinator_calendar_entries_id_seq OWNED BY public.coordinator_calendar_entries.id;


--
-- Name: course_outcomes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.course_outcomes (
    id integer NOT NULL,
    subject_id integer NOT NULL,
    code character varying(10) NOT NULL,
    description character varying(255) NOT NULL
);


--
-- Name: course_outcomes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.course_outcomes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: course_outcomes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.course_outcomes_id_seq OWNED BY public.course_outcomes.id;


--
-- Name: course_result_status; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.course_result_status (
    id integer NOT NULL,
    exam_subject_mapping_id integer NOT NULL,
    status public.course_result_status_enum DEFAULT 'computed'::public.course_result_status_enum NOT NULL,
    computed_at timestamp with time zone,
    approved_by_user_id integer,
    approved_at timestamp with time zone,
    withheld_reason character varying(100)
);


--
-- Name: course_result_status_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.course_result_status_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: course_result_status_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.course_result_status_id_seq OWNED BY public.course_result_status.id;


--
-- Name: courses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.courses (
    id integer NOT NULL,
    name character varying(150) NOT NULL,
    code character varying(30) NOT NULL,
    department_id integer NOT NULL,
    duration_years smallint DEFAULT 4 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    accreditation_status character varying(30),
    accreditation_valid_until date
);


--
-- Name: courses_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.courses ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.courses_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: curriculum_mappings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.curriculum_mappings (
    id integer NOT NULL,
    department_id integer NOT NULL,
    semester smallint NOT NULL,
    subject_id integer NOT NULL,
    section character varying(60) NOT NULL,
    display_order smallint DEFAULT 0 NOT NULL,
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: curriculum_mappings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.curriculum_mappings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: curriculum_mappings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.curriculum_mappings_id_seq OWNED BY public.curriculum_mappings.id;


--
-- Name: demand_categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.demand_categories (
    id integer NOT NULL,
    name character varying(100) NOT NULL
);


--
-- Name: demand_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.demand_categories ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.demand_categories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: department_achievements; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.department_achievements (
    id integer NOT NULL,
    department_id integer NOT NULL,
    posted_by_user_id integer NOT NULL,
    title character varying(200) NOT NULL,
    description text,
    achievement_date date,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: department_achievements_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.department_achievements ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.department_achievements_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: department_documents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.department_documents (
    id integer NOT NULL,
    department_id integer NOT NULL,
    name character varying(255) NOT NULL,
    category character varying(50) NOT NULL,
    file_url character varying(500),
    file_key character varying(500),
    size_bytes bigint,
    status public.department_document_status_enum DEFAULT 'pending'::public.department_document_status_enum NOT NULL,
    version integer DEFAULT 1 NOT NULL,
    uploaded_by_user_id integer NOT NULL,
    verified_by_user_id integer,
    verified_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: department_documents_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.department_documents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: department_documents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.department_documents_id_seq OWNED BY public.department_documents.id;


--
-- Name: department_events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.department_events (
    id integer NOT NULL,
    department_id integer NOT NULL,
    title character varying(255) NOT NULL,
    kind character varying(100) NOT NULL,
    event_date character varying(50) NOT NULL,
    venue_id integer,
    owner_faculty_id integer,
    status public.department_event_status_enum DEFAULT 'planning'::public.department_event_status_enum NOT NULL,
    registrations integer DEFAULT 0 NOT NULL,
    capacity integer NOT NULL,
    created_by_user_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: department_events_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.department_events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: department_events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.department_events_id_seq OWNED BY public.department_events.id;


--
-- Name: department_labs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.department_labs (
    id integer NOT NULL,
    department_id integer NOT NULL,
    name character varying(150) NOT NULL,
    incharge_faculty_id integer,
    systems_count integer,
    status character varying(30) DEFAULT 'operational'::character varying,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: department_labs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.department_labs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: department_labs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.department_labs_id_seq OWNED BY public.department_labs.id;


--
-- Name: department_meetings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.department_meetings (
    id integer NOT NULL,
    department_id integer NOT NULL,
    title character varying(255) NOT NULL,
    meeting_at timestamp with time zone NOT NULL,
    venue character varying(150),
    chair_user_id integer,
    invitee_count integer DEFAULT 0 NOT NULL,
    mom_status public.mom_status_enum DEFAULT 'scheduled'::public.mom_status_enum NOT NULL,
    mom_text text,
    created_by_user_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: department_meetings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.department_meetings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: department_meetings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.department_meetings_id_seq OWNED BY public.department_meetings.id;


--
-- Name: department_mous; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.department_mous (
    id integer NOT NULL,
    department_id integer NOT NULL,
    partner_name character varying(255) NOT NULL,
    signed_date date,
    valid_until date,
    status character varying(30) DEFAULT 'active'::character varying,
    document_url character varying(500)
);


--
-- Name: department_mous_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.department_mous_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: department_mous_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.department_mous_id_seq OWNED BY public.department_mous.id;


--
-- Name: department_research_funding; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.department_research_funding (
    id integer NOT NULL,
    department_id integer NOT NULL,
    title character varying(255) NOT NULL,
    funding_agency character varying(255),
    sanctioned_amount numeric(14,2),
    sanctioned_date date,
    status character varying(30) DEFAULT 'ongoing'::character varying
);


--
-- Name: department_research_funding_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.department_research_funding_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: department_research_funding_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.department_research_funding_id_seq OWNED BY public.department_research_funding.id;


--
-- Name: departments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.departments (
    id integer NOT NULL,
    name character varying(150) NOT NULL,
    code character varying(20) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    head_of_department_faculty_id integer,
    office_location character varying(255),
    contact_phone character varying(20),
    contact_email character varying(255)
);


--
-- Name: departments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.departments ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.departments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: designations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.designations (
    id integer NOT NULL,
    title character varying(100) NOT NULL,
    category character varying(20) NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    CONSTRAINT designations_category_check CHECK (((category)::text = ANY ((ARRAY['teaching'::character varying, 'non_teaching'::character varying])::text[])))
);


--
-- Name: designations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.designations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: designations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.designations_id_seq OWNED BY public.designations.id;


--
-- Name: device_push_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.device_push_tokens (
    id integer NOT NULL,
    user_id integer NOT NULL,
    push_token character varying(255) NOT NULL,
    platform character varying(20) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: device_push_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.device_push_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: device_push_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.device_push_tokens_id_seq OWNED BY public.device_push_tokens.id;


--
-- Name: e_resources; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.e_resources (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    url character varying(500) NOT NULL,
    category_id integer,
    concurrent_seats integer,
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    file_size_bytes integer,
    format character varying(20),
    license_type character varying(50),
    pages integer,
    publish_state character varying(20) DEFAULT 'draft'::character varying NOT NULL,
    uploaded_by_user_id integer
);


--
-- Name: e_resources_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.e_resources ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.e_resources_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: edc_documents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.edc_documents (
    id integer NOT NULL,
    student_entrepreneurship_id integer,
    document_type character varying(60) NOT NULL,
    file_name character varying(255) NOT NULL,
    file_url character varying(1000) NOT NULL,
    file_key character varying(500) NOT NULL,
    uploaded_by_user_id integer,
    uploaded_at timestamp with time zone DEFAULT now() NOT NULL,
    verification_status character varying(20) DEFAULT 'Pending'::character varying NOT NULL,
    reviewer_note character varying(500),
    reviewed_by_user_id integer,
    reviewed_at timestamp with time zone
);


--
-- Name: edc_documents_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.edc_documents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: edc_documents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.edc_documents_id_seq OWNED BY public.edc_documents.id;


--
-- Name: edc_events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.edc_events (
    id integer NOT NULL,
    title character varying(200) NOT NULL,
    event_type character varying(50) NOT NULL,
    event_date date NOT NULL,
    venue character varying(200),
    participants_count integer,
    status character varying(30) DEFAULT 'Upcoming'::character varying NOT NULL,
    created_by_user_id integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: edc_events_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.edc_events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: edc_events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.edc_events_id_seq OWNED BY public.edc_events.id;


--
-- Name: edc_funding_records; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.edc_funding_records (
    id integer NOT NULL,
    student_entrepreneurship_id integer NOT NULL,
    source_category character varying(40) NOT NULL,
    source_detail character varying(200),
    amount numeric(12,2) NOT NULL,
    disbursed_date date NOT NULL,
    utilisation_pct smallint DEFAULT 0 NOT NULL,
    status character varying(20) DEFAULT 'Pending'::character varying NOT NULL,
    created_by_user_id integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT edc_funding_records_utilisation_pct_check CHECK (((utilisation_pct >= 0) AND (utilisation_pct <= 100)))
);


--
-- Name: edc_funding_records_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.edc_funding_records_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: edc_funding_records_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.edc_funding_records_id_seq OWNED BY public.edc_funding_records.id;


--
-- Name: edc_reports; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.edc_reports (
    id integer NOT NULL,
    report_name character varying(200) NOT NULL,
    period_label character varying(60) NOT NULL,
    prepared_by_user_id integer,
    status character varying(20) DEFAULT 'In Progress'::character varying NOT NULL,
    file_url character varying(1000),
    file_key character varying(500),
    generated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: edc_reports_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.edc_reports_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: edc_reports_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.edc_reports_id_seq OWNED BY public.edc_reports.id;


--
-- Name: education_loan_dd; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.education_loan_dd (
    id integer NOT NULL,
    student_fee_demand_mapping_id integer NOT NULL,
    dd_reference_number character varying(50) NOT NULL,
    bank_name character varying(150) NOT NULL,
    amount numeric(12,2) NOT NULL,
    status public.dd_status_enum DEFAULT 'received'::public.dd_status_enum NOT NULL,
    acknowledgement_receipt_no character varying(50),
    received_by_user_id integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: education_loan_dd_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.education_loan_dd ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.education_loan_dd_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: exam_fee_transactions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.exam_fee_transactions (
    id integer NOT NULL,
    student_id integer NOT NULL,
    fee_head public.exam_fee_head_enum NOT NULL,
    amount numeric(10,2) NOT NULL,
    mode public.exam_fee_mode_enum DEFAULT 'online'::public.exam_fee_mode_enum NOT NULL,
    status public.exam_fee_txn_status_enum DEFAULT 'paid'::public.exam_fee_txn_status_enum NOT NULL,
    receipt_no character varying(30),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    reference_no character varying(60),
    reconciled_at timestamp with time zone
);


--
-- Name: exam_fee_transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.exam_fee_transactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: exam_fee_transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.exam_fee_transactions_id_seq OWNED BY public.exam_fee_transactions.id;


--
-- Name: exam_marks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.exam_marks (
    id integer NOT NULL,
    exam_subject_mapping_id integer NOT NULL,
    student_id integer NOT NULL,
    marks_obtained numeric(6,2),
    max_marks numeric(6,2) NOT NULL,
    entered_by_faculty_id integer,
    entered_at timestamp with time zone DEFAULT now() NOT NULL,
    is_absent boolean DEFAULT false NOT NULL,
    is_moderated boolean DEFAULT false NOT NULL,
    verified_at timestamp with time zone,
    verified_by_faculty_id integer
);


--
-- Name: exam_marks_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.exam_marks ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.exam_marks_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: exam_pass_rules_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.exam_pass_rules_settings (
    id integer NOT NULL,
    internal_max_marks numeric(6,2) DEFAULT 40 NOT NULL,
    external_max_marks numeric(6,2) DEFAULT 60 NOT NULL,
    pass_mark_total numeric(6,2) DEFAULT 50 NOT NULL,
    min_external_marks numeric(6,2) DEFAULT 24 NOT NULL,
    updated_at timestamp(6) with time zone DEFAULT now() NOT NULL
);


--
-- Name: exam_pass_rules_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.exam_pass_rules_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: exam_pass_rules_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.exam_pass_rules_settings_id_seq OWNED BY public.exam_pass_rules_settings.id;


--
-- Name: exam_registrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.exam_registrations (
    id integer NOT NULL,
    exam_id integer NOT NULL,
    student_id integer NOT NULL,
    fee_status public.exam_registration_fee_status_enum DEFAULT 'unpaid'::public.exam_registration_fee_status_enum NOT NULL,
    status public.exam_registration_status_enum DEFAULT 'pending'::public.exam_registration_status_enum NOT NULL,
    approved_by_user_id integer,
    approved_at timestamp with time zone,
    registered_at timestamp with time zone DEFAULT now() NOT NULL,
    reason character varying(300)
);


--
-- Name: exam_registrations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.exam_registrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: exam_registrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.exam_registrations_id_seq OWNED BY public.exam_registrations.id;


--
-- Name: exam_subject_mapping; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.exam_subject_mapping (
    id integer NOT NULL,
    exam_id integer NOT NULL,
    class_id integer NOT NULL,
    subject_id integer NOT NULL,
    is_published boolean DEFAULT false NOT NULL,
    published_at timestamp(6) with time zone,
    is_elective boolean DEFAULT false NOT NULL
);


--
-- Name: exam_subject_mapping_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.exam_subject_mapping ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.exam_subject_mapping_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: exam_timetable; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.exam_timetable (
    id integer NOT NULL,
    exam_subject_mapping_id integer NOT NULL,
    exam_date date NOT NULL,
    start_time time without time zone NOT NULL,
    end_time time without time zone NOT NULL,
    version_id integer NOT NULL,
    session public.exam_session_enum NOT NULL,
    venue_id integer
);


--
-- Name: exam_timetable_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.exam_timetable ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.exam_timetable_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: exam_timetable_versions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.exam_timetable_versions (
    id integer NOT NULL,
    exam_id integer NOT NULL,
    department_id integer,
    version_number integer NOT NULL,
    status public.timetable_version_status_enum DEFAULT 'draft'::public.timetable_version_status_enum NOT NULL,
    signature character varying(64),
    created_by_user_id integer,
    created_at timestamp(6) with time zone DEFAULT now() NOT NULL,
    published_by_user_id integer,
    published_at timestamp(6) with time zone,
    withdrawn_at timestamp(6) with time zone,
    cloned_from_version_id integer
);


--
-- Name: exam_timetable_versions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.exam_timetable_versions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: exam_timetable_versions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.exam_timetable_versions_id_seq OWNED BY public.exam_timetable_versions.id;


--
-- Name: exam_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.exam_types (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    category public.exam_type_category_enum DEFAULT 'external'::public.exam_type_category_enum NOT NULL,
    code character varying(20),
    is_university boolean DEFAULT true NOT NULL
);


--
-- Name: exam_types_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.exam_types ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.exam_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: exams; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.exams (
    id integer NOT NULL,
    exam_type_id integer NOT NULL,
    batch_id integer NOT NULL,
    academic_year character varying(20) NOT NULL,
    semester smallint NOT NULL,
    status public.exam_status_enum DEFAULT 'created'::public.exam_status_enum NOT NULL,
    created_by_user_id integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    end_date date,
    start_date date,
    title character varying(200),
    exam_category public.exam_category_enum DEFAULT 'regular'::public.exam_category_enum NOT NULL,
    registration_opens_at timestamp with time zone,
    registration_closes_at timestamp with time zone,
    fee_amount numeric(10,2),
    notes_to_students character varying(500)
);


--
-- Name: exams_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.exams ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.exams_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: expense_categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.expense_categories (
    id integer NOT NULL,
    name character varying(100) NOT NULL
);


--
-- Name: expense_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.expense_categories ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.expense_categories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: expenses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.expenses (
    id integer NOT NULL,
    category_id integer NOT NULL,
    description character varying(255),
    amount numeric(12,2) NOT NULL,
    expense_date date DEFAULT CURRENT_DATE NOT NULL,
    recorded_by_user_id integer
);


--
-- Name: expenses_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.expenses ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.expenses_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: faculty; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.faculty (
    id integer NOT NULL,
    user_id integer NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    designation character varying(100) NOT NULL,
    department_id integer NOT NULL,
    date_of_joining date,
    status public.user_status_enum DEFAULT 'active'::public.user_status_enum NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    profile_url text,
    is_mentor boolean DEFAULT false NOT NULL,
    phone_verified boolean DEFAULT false NOT NULL,
    whatsapp_verified boolean DEFAULT false NOT NULL,
    prefix character varying(10),
    gender character varying(20),
    date_of_birth date,
    personal_email character varying(255),
    whatsapp_number character varying(20),
    alternate_phone character varying(20),
    address_line character varying(255),
    city character varying(100),
    state character varying(100),
    postal_code character varying(10),
    academic_role character varying(50),
    employment_status public.faculty_employment_status_enum,
    employment_type public.faculty_employment_type_enum,
    confirmation_date date,
    probation_end_date date,
    work_location character varying(255),
    qualification character varying(100),
    specialization character varying(255),
    previous_institution character varying(255),
    previous_experience_years integer,
    office_room character varying(100),
    reports_to_faculty_id integer,
    resume_url character varying(500),
    designation_id integer,
    staff_code character varying(30),
    dayscholar_mode public.dayscholar_mode_enum
);


--
-- Name: faculty_activity_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.faculty_activity_log (
    id integer NOT NULL,
    faculty_id integer NOT NULL,
    description character varying(500) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by_user_id integer
);


--
-- Name: faculty_activity_log_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.faculty_activity_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: faculty_activity_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.faculty_activity_log_id_seq OWNED BY public.faculty_activity_log.id;


--
-- Name: faculty_attendance_corrections; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.faculty_attendance_corrections (
    id integer NOT NULL,
    faculty_id integer NOT NULL,
    attendance_date date NOT NULL,
    old_status character varying(20) NOT NULL,
    requested_status character varying(20) NOT NULL,
    reason character varying(255) NOT NULL,
    requested_by_user_id integer NOT NULL,
    hod_approval_status public.correction_approval_status_enum DEFAULT 'pending'::public.correction_approval_status_enum NOT NULL,
    hr_approval_status public.correction_approval_status_enum DEFAULT 'pending'::public.correction_approval_status_enum NOT NULL,
    created_at timestamp(6) with time zone DEFAULT now() NOT NULL,
    decided_at timestamp(6) with time zone
);


--
-- Name: faculty_attendance_corrections_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.faculty_attendance_corrections_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: faculty_attendance_corrections_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.faculty_attendance_corrections_id_seq OWNED BY public.faculty_attendance_corrections.id;


--
-- Name: faculty_awards; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.faculty_awards (
    id integer NOT NULL,
    faculty_id integer NOT NULL,
    title character varying(255) NOT NULL,
    awarded_by character varying(255),
    year integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: faculty_awards_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.faculty_awards_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: faculty_awards_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.faculty_awards_id_seq OWNED BY public.faculty_awards.id;


--
-- Name: faculty_certifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.faculty_certifications (
    id integer NOT NULL,
    faculty_id integer NOT NULL,
    platform character varying(100) NOT NULL,
    track character varying(255) NOT NULL,
    score character varying(20),
    completed_on date,
    status character varying(30) DEFAULT 'enrolled'::character varying NOT NULL,
    certificate_url character varying(500),
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: faculty_certifications_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.faculty_certifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: faculty_certifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.faculty_certifications_id_seq OWNED BY public.faculty_certifications.id;


--
-- Name: faculty_committee_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.faculty_committee_roles (
    id integer NOT NULL,
    faculty_id integer NOT NULL,
    committee_name character varying(255) NOT NULL,
    role character varying(100),
    academic_year character varying(20)
);


--
-- Name: faculty_committee_roles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.faculty_committee_roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: faculty_committee_roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.faculty_committee_roles_id_seq OWNED BY public.faculty_committee_roles.id;


--
-- Name: faculty_daily_attendance; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.faculty_daily_attendance (
    id integer NOT NULL,
    faculty_id integer,
    attendance_date date NOT NULL,
    punch_in time without time zone,
    punch_out time without time zone,
    status public.faculty_attendance_status_enum NOT NULL,
    academic_year character varying(20) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    staff_user_id integer
);


--
-- Name: faculty_daily_attendance_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.faculty_daily_attendance_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: faculty_daily_attendance_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.faculty_daily_attendance_id_seq OWNED BY public.faculty_daily_attendance.id;


--
-- Name: faculty_development_programs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.faculty_development_programs (
    id integer NOT NULL,
    faculty_id integer NOT NULL,
    program_type character varying(10) NOT NULL,
    programme_name character varying(255) NOT NULL,
    host_agency character varying(255),
    duration character varying(50),
    attended_on date,
    status character varying(30) DEFAULT 'registered'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT faculty_development_programs_program_type_check CHECK (((program_type)::text = ANY ((ARRAY['fdp'::character varying, 'sttp'::character varying])::text[])))
);


--
-- Name: faculty_development_programs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.faculty_development_programs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: faculty_development_programs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.faculty_development_programs_id_seq OWNED BY public.faculty_development_programs.id;


--
-- Name: faculty_documents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.faculty_documents (
    id integer NOT NULL,
    faculty_id integer NOT NULL,
    document_type character varying(100) NOT NULL,
    file_name character varying(255) NOT NULL,
    file_url text NOT NULL,
    uploaded_at timestamp with time zone DEFAULT now() NOT NULL,
    uploaded_by_user_id integer,
    verification_status public.document_verification_status_enum DEFAULT 'pending'::public.document_verification_status_enum NOT NULL,
    verified_by_user_id integer,
    verified_at timestamp(6) with time zone,
    expiry_date date,
    rejection_reason character varying(255)
);


--
-- Name: faculty_documents_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.faculty_documents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: faculty_documents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.faculty_documents_id_seq OWNED BY public.faculty_documents.id;


--
-- Name: faculty_feedback_forms; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.faculty_feedback_forms (
    id integer NOT NULL,
    created_by_user_id integer NOT NULL,
    department_id integer NOT NULL,
    title character varying(200) NOT NULL,
    is_published boolean DEFAULT true NOT NULL,
    created_at timestamp(6) with time zone DEFAULT now() NOT NULL
);


--
-- Name: faculty_feedback_forms_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.faculty_feedback_forms_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: faculty_feedback_forms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.faculty_feedback_forms_id_seq OWNED BY public.faculty_feedback_forms.id;


--
-- Name: faculty_feedback_questions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.faculty_feedback_questions (
    id integer NOT NULL,
    form_id integer NOT NULL,
    question_text text NOT NULL,
    sequence_no smallint,
    question_type public.feedback_question_type_enum DEFAULT 'rating'::public.feedback_question_type_enum NOT NULL
);


--
-- Name: faculty_feedback_questions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.faculty_feedback_questions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: faculty_feedback_questions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.faculty_feedback_questions_id_seq OWNED BY public.faculty_feedback_questions.id;


--
-- Name: faculty_feedback_responses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.faculty_feedback_responses (
    id integer NOT NULL,
    question_id integer NOT NULL,
    faculty_id integer NOT NULL,
    rating_value smallint,
    response_text text,
    submitted_at timestamp(6) with time zone DEFAULT now() NOT NULL,
    CONSTRAINT faculty_feedback_responses_rating_value_check CHECK (((rating_value >= 1) AND (rating_value <= 5)))
);


--
-- Name: faculty_feedback_responses_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.faculty_feedback_responses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: faculty_feedback_responses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.faculty_feedback_responses_id_seq OWNED BY public.faculty_feedback_responses.id;


--
-- Name: faculty_holiday_mapping; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.faculty_holiday_mapping (
    id integer NOT NULL,
    faculty_id integer NOT NULL,
    holiday_slot_id integer NOT NULL
);


--
-- Name: faculty_holiday_mapping_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.faculty_holiday_mapping ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.faculty_holiday_mapping_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: faculty_hostel_mapping; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.faculty_hostel_mapping (
    id integer NOT NULL,
    faculty_id integer NOT NULL,
    room_id integer NOT NULL,
    fee_structure_id integer,
    allocated_date date DEFAULT CURRENT_DATE NOT NULL
);


--
-- Name: faculty_hostel_mapping_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.faculty_hostel_mapping_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: faculty_hostel_mapping_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.faculty_hostel_mapping_id_seq OWNED BY public.faculty_hostel_mapping.id;


--
-- Name: faculty_id_card_issuances; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.faculty_id_card_issuances (
    id integer NOT NULL,
    faculty_id integer NOT NULL,
    issued_at timestamp with time zone DEFAULT now() NOT NULL,
    issued_by_user_id integer
);


--
-- Name: faculty_id_card_issuances_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.faculty_id_card_issuances_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: faculty_id_card_issuances_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.faculty_id_card_issuances_id_seq OWNED BY public.faculty_id_card_issuances.id;


--
-- Name: faculty_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.faculty ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.faculty_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: faculty_leave_balances; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.faculty_leave_balances (
    id integer NOT NULL,
    faculty_id integer NOT NULL,
    leave_type_id integer NOT NULL,
    academic_year character varying(20) NOT NULL,
    allocated smallint NOT NULL,
    used smallint DEFAULT 0 NOT NULL
);


--
-- Name: faculty_leave_balances_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.faculty_leave_balances_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: faculty_leave_balances_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.faculty_leave_balances_id_seq OWNED BY public.faculty_leave_balances.id;


--
-- Name: faculty_leaves; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.faculty_leaves (
    id integer NOT NULL,
    faculty_id integer,
    from_date date NOT NULL,
    to_date date NOT NULL,
    reason character varying(255),
    hod_approval_status public.approval_status_enum DEFAULT 'pending'::public.approval_status_enum NOT NULL,
    hr_approval_status public.approval_status_enum DEFAULT 'pending'::public.approval_status_enum NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    leave_type_id integer,
    hod_remarks character varying(255),
    hr_remarks character varying(255),
    hod_decided_at timestamp(6) with time zone,
    hr_decided_at timestamp(6) with time zone,
    hod_decided_by_user_id integer,
    hr_decided_by_user_id integer,
    attachment_url character varying(500),
    principal_approval_status public.approval_status_enum DEFAULT 'pending'::public.approval_status_enum,
    principal_decided_by_user_id integer,
    principal_decided_at timestamp with time zone,
    principal_remarks character varying(255),
    alternate_arrangement character varying(255),
    is_station_leave boolean DEFAULT false NOT NULL,
    staff_user_id integer,
    correspondent_approval_status public.approval_status_enum,
    correspondent_decided_by_user_id integer,
    correspondent_decided_at timestamp with time zone,
    correspondent_remarks character varying(255)
);


--
-- Name: faculty_leaves_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.faculty_leaves ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.faculty_leaves_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: faculty_od_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.faculty_od_requests (
    id integer NOT NULL,
    faculty_id integer,
    from_date date NOT NULL,
    to_date date NOT NULL,
    place character varying(255),
    purpose character varying(255),
    hod_approval_status public.approval_status_enum DEFAULT 'pending'::public.approval_status_enum NOT NULL,
    hr_approval_status public.approval_status_enum DEFAULT 'pending'::public.approval_status_enum NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    organization_visited character varying(255),
    students_guided integer,
    sanction_order character varying(100),
    latitude numeric(10,6),
    longitude numeric(10,6),
    photo_url character varying(500),
    photo_uploaded_at timestamp(6) with time zone,
    certificate_url character varying(500),
    certificate_uploaded_at timestamp(6) with time zone,
    verification_status public.od_verification_status_enum DEFAULT 'awaiting_documents'::public.od_verification_status_enum NOT NULL,
    email_sender character varying(255),
    email_receiver character varying(255),
    email_subject character varying(255),
    email_sent_at timestamp(6) with time zone,
    email_body text,
    admin_remarks text,
    principal_approval_status public.approval_status_enum DEFAULT 'pending'::public.approval_status_enum,
    principal_decided_by_user_id integer,
    principal_decided_at timestamp with time zone,
    principal_remarks character varying(255),
    od_type character varying(50),
    periods_affected character varying(30),
    class_adjustment character varying(255),
    staff_user_id integer,
    correspondent_approval_status public.approval_status_enum,
    correspondent_decided_by_user_id integer,
    correspondent_decided_at timestamp(6) with time zone,
    correspondent_remarks character varying(255)
);


--
-- Name: faculty_od_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.faculty_od_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: faculty_od_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.faculty_od_requests_id_seq OWNED BY public.faculty_od_requests.id;


--
-- Name: patent_inventors; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.patent_inventors (
    id integer NOT NULL,
    patent_id integer NOT NULL,
    faculty_id integer,
    role character varying(30) NOT NULL,
    student_id integer,
    CONSTRAINT patent_inventors_exactly_one_person CHECK ((((faculty_id IS NOT NULL) AND (student_id IS NULL)) OR ((faculty_id IS NULL) AND (student_id IS NOT NULL))))
);


--
-- Name: faculty_patent_inventors_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.faculty_patent_inventors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: faculty_patent_inventors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.faculty_patent_inventors_id_seq OWNED BY public.patent_inventors.id;


--
-- Name: patents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.patents (
    id integer NOT NULL,
    title character varying(500) NOT NULL,
    stage character varying(30) DEFAULT 'filed'::character varying NOT NULL,
    filed_year integer,
    stage_date date,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: faculty_patents_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.faculty_patents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: faculty_patents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.faculty_patents_id_seq OWNED BY public.patents.id;


--
-- Name: publications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.publications (
    id integer NOT NULL,
    faculty_id integer NOT NULL,
    title character varying(500) NOT NULL,
    type character varying(30) NOT NULL,
    year integer,
    venue character varying(255),
    doi character varying(100),
    citation_count integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    author_role character varying(30),
    indexing character varying(150),
    published_date date,
    status character varying(20),
    CONSTRAINT faculty_publications_type_check CHECK (((type)::text = ANY ((ARRAY['journal'::character varying, 'conference'::character varying, 'book_chapter'::character varying])::text[])))
);


--
-- Name: faculty_publications_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.faculty_publications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: faculty_publications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.faculty_publications_id_seq OWNED BY public.publications.id;


--
-- Name: research_project_members; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.research_project_members (
    id integer NOT NULL,
    project_id integer NOT NULL,
    faculty_id integer,
    role character varying(50) NOT NULL,
    joined_on date,
    student_id integer,
    CONSTRAINT research_project_members_exactly_one_person CHECK ((((faculty_id IS NOT NULL) AND (student_id IS NULL)) OR ((faculty_id IS NULL) AND (student_id IS NOT NULL))))
);


--
-- Name: faculty_research_project_members_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.faculty_research_project_members_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: faculty_research_project_members_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.faculty_research_project_members_id_seq OWNED BY public.research_project_members.id;


--
-- Name: research_projects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.research_projects (
    id integer NOT NULL,
    centre_name character varying(255) NOT NULL,
    focus_area character varying(255),
    status character varying(30) DEFAULT 'ongoing'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: faculty_research_projects_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.faculty_research_projects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: faculty_research_projects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.faculty_research_projects_id_seq OWNED BY public.research_projects.id;


--
-- Name: faculty_sensitive_info; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.faculty_sensitive_info (
    id integer NOT NULL,
    faculty_id integer NOT NULL,
    aadhar_number character varying(20),
    pan_number character varying(20),
    bank_account_number character varying(40),
    bank_ifsc character varying(20),
    bank_name character varying(100)
);


--
-- Name: faculty_sensitive_info_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.faculty_sensitive_info ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.faculty_sensitive_info_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: faculty_subject_class_mapping; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.faculty_subject_class_mapping (
    id integer NOT NULL,
    faculty_id integer NOT NULL,
    subject_id integer NOT NULL,
    class_id integer NOT NULL,
    academic_year character varying(20) NOT NULL,
    assigned_by_user_id integer,
    substitute_faculty_id integer
);


--
-- Name: faculty_subject_class_mapping_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.faculty_subject_class_mapping ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.faculty_subject_class_mapping_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: fee_concessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fee_concessions (
    id integer NOT NULL,
    fee_structure_id integer NOT NULL,
    concession_amount numeric(12,2) NOT NULL,
    is_settled boolean DEFAULT false NOT NULL,
    settled_date date
);


--
-- Name: fee_concessions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.fee_concessions ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.fee_concessions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: fee_payment_gateway_orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fee_payment_gateway_orders (
    id integer NOT NULL,
    student_fee_demand_mapping_id integer NOT NULL,
    amount numeric(10,2) NOT NULL,
    status public.fee_payment_gateway_status_enum DEFAULT 'pending'::public.fee_payment_gateway_status_enum NOT NULL,
    razorpay_order_id character varying(100) NOT NULL,
    razorpay_payment_id character varying(100),
    razorpay_signature character varying(255),
    fee_payment_id integer,
    created_by_user_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: fee_payment_gateway_orders_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.fee_payment_gateway_orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: fee_payment_gateway_orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.fee_payment_gateway_orders_id_seq OWNED BY public.fee_payment_gateway_orders.id;


--
-- Name: fee_payments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fee_payments (
    id integer NOT NULL,
    student_fee_demand_mapping_id integer NOT NULL,
    amount_paid numeric(12,2) NOT NULL,
    payment_date date DEFAULT CURRENT_DATE NOT NULL,
    payment_mode public.payment_mode_enum,
    receipt_no character varying(50) NOT NULL,
    is_partial boolean DEFAULT false NOT NULL,
    collected_by_user_id integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    fee_structure_item_id integer
);


--
-- Name: fee_payments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.fee_payments ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.fee_payments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: fee_receipt_number_payments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fee_receipt_number_payments (
    receipt_number_id integer NOT NULL,
    fee_payment_id integer NOT NULL
);


--
-- Name: fee_receipt_numbers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fee_receipt_numbers (
    id integer NOT NULL,
    print_date date NOT NULL,
    issued_by_user_id integer,
    issued_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: fee_receipt_numbers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.fee_receipt_numbers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: fee_receipt_numbers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.fee_receipt_numbers_id_seq OWNED BY public.fee_receipt_numbers.id;


--
-- Name: fee_structure_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fee_structure_items (
    id integer NOT NULL,
    fee_structure_id integer NOT NULL,
    demand_category_id integer,
    amount numeric(12,2) NOT NULL,
    hostel_room_type_id integer,
    transport_stage_id integer,
    CONSTRAINT fee_structure_items_source_check CHECK ((((
CASE
    WHEN (demand_category_id IS NOT NULL) THEN 1
    ELSE 0
END +
CASE
    WHEN (hostel_room_type_id IS NOT NULL) THEN 1
    ELSE 0
END) +
CASE
    WHEN (transport_stage_id IS NOT NULL) THEN 1
    ELSE 0
END) = 1))
);


--
-- Name: fee_structure_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.fee_structure_items ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.fee_structure_items_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: fee_structures; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fee_structures (
    id integer NOT NULL,
    name character varying(150) NOT NULL,
    applies_to public.fee_structure_applies_to_enum NOT NULL,
    quota_id integer,
    academic_year character varying(20) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    due_date date
);


--
-- Name: fee_structures_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.fee_structures ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.fee_structures_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: feedback_assignment_questions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.feedback_assignment_questions (
    id integer NOT NULL,
    assignment_id integer NOT NULL,
    question_text character varying(500) NOT NULL,
    is_optional boolean DEFAULT false NOT NULL,
    display_order smallint DEFAULT 0 NOT NULL
);


--
-- Name: feedback_assignment_questions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.feedback_assignment_questions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: feedback_assignment_questions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.feedback_assignment_questions_id_seq OWNED BY public.feedback_assignment_questions.id;


--
-- Name: feedback_assignments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.feedback_assignments (
    id integer NOT NULL,
    course_type public.feedback_course_type_enum NOT NULL,
    year_of_study smallint NOT NULL,
    department_id integer NOT NULL,
    semester smallint NOT NULL,
    class_id integer,
    status public.feedback_assignment_status_enum DEFAULT 'NOT_STARTED'::public.feedback_assignment_status_enum NOT NULL,
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: feedback_assignments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.feedback_assignments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: feedback_assignments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.feedback_assignments_id_seq OWNED BY public.feedback_assignments.id;


--
-- Name: feedback_faculty_responses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.feedback_faculty_responses (
    id integer NOT NULL,
    question_id integer NOT NULL,
    student_id integer NOT NULL,
    mapping_id integer NOT NULL,
    faculty_id integer NOT NULL,
    subject_id integer NOT NULL,
    response_text text,
    rating_value smallint,
    submitted_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: feedback_faculty_responses_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.feedback_faculty_responses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: feedback_faculty_responses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.feedback_faculty_responses_id_seq OWNED BY public.feedback_faculty_responses.id;


--
-- Name: feedback_forms; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.feedback_forms (
    id integer NOT NULL,
    created_by_user_id integer NOT NULL,
    title character varying(200) NOT NULL,
    class_id integer,
    batch_id integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    form_type public.feedback_form_type_enum DEFAULT 'general'::public.feedback_form_type_enum NOT NULL,
    rating_scale_id integer,
    category public.feedback_course_type_enum,
    is_published boolean DEFAULT true NOT NULL,
    service_type public.feedback_service_type_enum
);


--
-- Name: feedback_forms_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.feedback_forms ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.feedback_forms_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: feedback_question_templates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.feedback_question_templates (
    id integer NOT NULL,
    course_type public.feedback_course_type_enum NOT NULL,
    question_text character varying(500) NOT NULL,
    is_optional boolean DEFAULT false NOT NULL,
    display_order smallint DEFAULT 0 NOT NULL,
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: feedback_question_templates_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.feedback_question_templates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: feedback_question_templates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.feedback_question_templates_id_seq OWNED BY public.feedback_question_templates.id;


--
-- Name: feedback_questions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.feedback_questions (
    id integer NOT NULL,
    form_id integer NOT NULL,
    question_text text NOT NULL,
    sequence_no smallint,
    question_type public.feedback_question_type_enum DEFAULT 'rating'::public.feedback_question_type_enum NOT NULL
);


--
-- Name: feedback_questions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.feedback_questions ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.feedback_questions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: feedback_rating_scale_options; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.feedback_rating_scale_options (
    id integer NOT NULL,
    scale_id integer NOT NULL,
    sequence_no smallint NOT NULL,
    value smallint NOT NULL,
    label character varying(100) NOT NULL
);


--
-- Name: feedback_rating_scale_options_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.feedback_rating_scale_options_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: feedback_rating_scale_options_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.feedback_rating_scale_options_id_seq OWNED BY public.feedback_rating_scale_options.id;


--
-- Name: feedback_rating_scales; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.feedback_rating_scales (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: feedback_rating_scales_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.feedback_rating_scales_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: feedback_rating_scales_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.feedback_rating_scales_id_seq OWNED BY public.feedback_rating_scales.id;


--
-- Name: feedback_responses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.feedback_responses (
    id integer NOT NULL,
    question_id integer NOT NULL,
    student_id integer NOT NULL,
    response_text text,
    submitted_at timestamp with time zone DEFAULT now() NOT NULL,
    rating_value smallint,
    rating_label public.feedback_rating_label_enum,
    CONSTRAINT chk_feedback_response_matches_question_type CHECK ((((rating_value IS NOT NULL) AND (response_text IS NULL)) OR ((rating_value IS NULL) AND (response_text IS NOT NULL)))),
    CONSTRAINT feedback_responses_rating_value_check CHECK (((rating_value >= 1) AND (rating_value <= 5)))
);


--
-- Name: feedback_responses_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.feedback_responses ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.feedback_responses_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: finance_audit_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.finance_audit_log (
    id bigint NOT NULL,
    actor_user_id integer NOT NULL,
    action character varying(60) NOT NULL,
    entity_type character varying(60) NOT NULL,
    entity_id integer,
    before_data jsonb,
    after_data jsonb,
    ip_address inet,
    user_agent character varying(300),
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: finance_audit_log_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.finance_audit_log_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: finance_audit_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.finance_audit_log_id_seq OWNED BY public.finance_audit_log.id;


--
-- Name: finance_funds; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.finance_funds (
    id integer NOT NULL,
    academic_year character varying(20) NOT NULL,
    total_amount numeric(14,2) DEFAULT 0 NOT NULL,
    available_amount numeric(14,2) DEFAULT 0 NOT NULL,
    is_locked boolean DEFAULT false NOT NULL,
    notes character varying(500),
    created_by_user_id integer NOT NULL,
    updated_by_user_id integer,
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT finance_funds_available_amount_check CHECK ((available_amount >= (0)::numeric)),
    CONSTRAINT finance_funds_total_amount_check CHECK ((total_amount >= (0)::numeric))
);


--
-- Name: finance_funds_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.finance_funds_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: finance_funds_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.finance_funds_id_seq OWNED BY public.finance_funds.id;


--
-- Name: finance_ledger_entries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.finance_ledger_entries (
    id bigint NOT NULL,
    fund_id integer NOT NULL,
    entry_type public.finance_ledger_entry_type_enum NOT NULL,
    source public.finance_ledger_source_enum NOT NULL,
    amount numeric(14,2) NOT NULL,
    balance_after numeric(14,2) NOT NULL,
    purchase_order_proposal_id integer,
    service_order_proposal_id integer,
    narration character varying(500) NOT NULL,
    created_by_user_id integer NOT NULL,
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT finance_ledger_entries_amount_check CHECK ((amount > (0)::numeric)),
    CONSTRAINT finance_ledger_entries_source_ref_check CHECK ((((source = 'pop_approval'::public.finance_ledger_source_enum) AND (purchase_order_proposal_id IS NOT NULL) AND (service_order_proposal_id IS NULL)) OR ((source = 'sop_approval'::public.finance_ledger_source_enum) AND (service_order_proposal_id IS NOT NULL) AND (purchase_order_proposal_id IS NULL)) OR ((source = 'order_cancellation'::public.finance_ledger_source_enum) AND ((purchase_order_proposal_id IS NOT NULL) <> (service_order_proposal_id IS NOT NULL))) OR ((source = ANY (ARRAY['opening_balance'::public.finance_ledger_source_enum, 'manual_adjustment'::public.finance_ledger_source_enum])) AND (purchase_order_proposal_id IS NULL) AND (service_order_proposal_id IS NULL))))
);


--
-- Name: finance_ledger_entries_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.finance_ledger_entries_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: finance_ledger_entries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.finance_ledger_entries_id_seq OWNED BY public.finance_ledger_entries.id;


--
-- Name: finance_order_allotments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.finance_order_allotments (
    id integer NOT NULL,
    tracking_id integer NOT NULL,
    faculty_id integer NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    allotted_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    allotted_by_user_id integer NOT NULL,
    remarks character varying(500),
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT finance_order_allotments_quantity_check CHECK ((quantity > 0))
);


--
-- Name: finance_order_allotments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.finance_order_allotments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: finance_order_allotments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.finance_order_allotments_id_seq OWNED BY public.finance_order_allotments.id;


--
-- Name: finance_order_tracking; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.finance_order_tracking (
    id integer NOT NULL,
    order_kind public.finance_order_kind_enum NOT NULL,
    purchase_order_id integer,
    service_order_id integer,
    delivery_status public.finance_delivery_status_enum DEFAULT 'ordered'::public.finance_delivery_status_enum NOT NULL,
    expected_delivery_date date,
    delivered_at timestamp(6) with time zone,
    quantity_ordered integer,
    quantity_delivered integer DEFAULT 0 NOT NULL,
    tracking_reference character varying(120),
    remarks character varying(500),
    created_by_user_id integer NOT NULL,
    updated_by_user_id integer,
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT finance_order_tracking_delivered_at_check CHECK (((delivery_status <> ALL (ARRAY['delivered'::public.finance_delivery_status_enum, 'partially_delivered'::public.finance_delivery_status_enum])) OR (delivered_at IS NOT NULL))),
    CONSTRAINT finance_order_tracking_one_order_check CHECK ((((order_kind = 'purchase'::public.finance_order_kind_enum) AND (purchase_order_id IS NOT NULL) AND (service_order_id IS NULL)) OR ((order_kind = 'service'::public.finance_order_kind_enum) AND (service_order_id IS NOT NULL) AND (purchase_order_id IS NULL)))),
    CONSTRAINT finance_order_tracking_quantities_check CHECK (((quantity_delivered >= 0) AND ((quantity_ordered IS NULL) OR (quantity_ordered > 0)) AND ((quantity_ordered IS NULL) OR (quantity_delivered <= quantity_ordered))))
);


--
-- Name: finance_order_tracking_events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.finance_order_tracking_events (
    id bigint NOT NULL,
    tracking_id integer NOT NULL,
    from_status public.finance_delivery_status_enum,
    to_status public.finance_delivery_status_enum NOT NULL,
    note character varying(500),
    changed_by_user_id integer NOT NULL,
    changed_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: finance_order_tracking_events_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.finance_order_tracking_events_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: finance_order_tracking_events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.finance_order_tracking_events_id_seq OWNED BY public.finance_order_tracking_events.id;


--
-- Name: finance_order_tracking_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.finance_order_tracking_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: finance_order_tracking_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.finance_order_tracking_id_seq OWNED BY public.finance_order_tracking.id;


--
-- Name: finance_proposal_assignments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.finance_proposal_assignments (
    id integer NOT NULL,
    purchase_order_proposal_id integer,
    service_order_proposal_id integer,
    faculty_id integer NOT NULL,
    note character varying(500),
    assigned_by_user_id integer NOT NULL,
    assigned_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT finance_proposal_assignments_one_ref_check CHECK (((purchase_order_proposal_id IS NOT NULL) <> (service_order_proposal_id IS NOT NULL)))
);


--
-- Name: finance_proposal_assignments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.finance_proposal_assignments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: finance_proposal_assignments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.finance_proposal_assignments_id_seq OWNED BY public.finance_proposal_assignments.id;


--
-- Name: grade_bands; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.grade_bands (
    id integer NOT NULL,
    grade_label character varying(10) NOT NULL,
    min_percentage numeric(5,2) NOT NULL,
    grade_point numeric(3,1),
    is_pass boolean DEFAULT true NOT NULL,
    display_order integer NOT NULL
);


--
-- Name: grade_bands_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.grade_bands_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: grade_bands_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.grade_bands_id_seq OWNED BY public.grade_bands.id;


--
-- Name: grn; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.grn (
    id integer NOT NULL,
    purchase_order_id integer NOT NULL,
    quantity_received integer NOT NULL,
    received_date date DEFAULT CURRENT_DATE NOT NULL,
    issued_to_venue_id integer,
    issued_date date,
    recorded_by_user_id integer
);


--
-- Name: grn_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.grn ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.grn_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: hall_plans; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.hall_plans (
    id integer NOT NULL,
    exam_id integer NOT NULL,
    venue_id integer NOT NULL,
    exam_date date NOT NULL,
    capacity integer
);


--
-- Name: hall_plans_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.hall_plans ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.hall_plans_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: hall_ticket_clearance_exceptions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.hall_ticket_clearance_exceptions (
    id integer NOT NULL,
    student_id integer NOT NULL,
    exam_id integer NOT NULL,
    clearance_type public.clearance_type_enum NOT NULL,
    reason character varying(500),
    letter_file_url character varying(500),
    requested_at timestamp with time zone DEFAULT now() NOT NULL,
    status public.clearance_exception_status_enum DEFAULT 'pending'::public.clearance_exception_status_enum NOT NULL,
    reviewed_by_hod_user_id integer,
    reviewed_at timestamp with time zone,
    valid_until date
);


--
-- Name: hall_ticket_clearance_exceptions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.hall_ticket_clearance_exceptions ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.hall_ticket_clearance_exceptions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: hall_tickets; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.hall_tickets (
    id integer NOT NULL,
    exam_id integer NOT NULL,
    student_id integer NOT NULL,
    file_url character varying(500) NOT NULL,
    generated_at timestamp with time zone DEFAULT now() NOT NULL,
    mismatch_reported boolean DEFAULT false NOT NULL,
    mismatch_note character varying(255),
    downloaded_at timestamp with time zone
);


--
-- Name: hall_tickets_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.hall_tickets ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.hall_tickets_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: higher_education_application_students; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.higher_education_application_students (
    id integer NOT NULL,
    window_id integer NOT NULL,
    student_id integer NOT NULL,
    status character varying(20) DEFAULT 'applied'::character varying NOT NULL,
    applied_on date,
    decided_on date,
    remarks text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by_user_id integer,
    CONSTRAINT higher_education_application_students_status_check CHECK (((status)::text = ANY ((ARRAY['applied'::character varying, 'selected'::character varying, 'rejected'::character varying, 'withdrawn'::character varying])::text[])))
);


--
-- Name: TABLE higher_education_application_students; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.higher_education_application_students IS 'Which students are on a given higher-education application window, and whether they were applied or selected. The window''s applicants_count remains the historical summary.';


--
-- Name: higher_education_application_students_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.higher_education_application_students_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: higher_education_application_students_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.higher_education_application_students_id_seq OWNED BY public.higher_education_application_students.id;


--
-- Name: higher_education_application_windows; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.higher_education_application_windows (
    id integer NOT NULL,
    university character varying(255) NOT NULL,
    country character varying(100) NOT NULL,
    intake character varying(50),
    applicants_count integer DEFAULT 0 NOT NULL,
    documents_pending integer DEFAULT 0 NOT NULL,
    deadline date,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: higher_education_application_windows_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.higher_education_application_windows_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: higher_education_application_windows_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.higher_education_application_windows_id_seq OWNED BY public.higher_education_application_windows.id;


--
-- Name: higher_education_calendar_events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.higher_education_calendar_events (
    id integer NOT NULL,
    title character varying(200) NOT NULL,
    event_date date NOT NULL,
    category character varying(30),
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: higher_education_calendar_events_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.higher_education_calendar_events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: higher_education_calendar_events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.higher_education_calendar_events_id_seq OWNED BY public.higher_education_calendar_events.id;


--
-- Name: higher_education_coaching_batches; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.higher_education_coaching_batches (
    id integer NOT NULL,
    batch_name character varying(100) NOT NULL,
    detail character varying(100) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: higher_education_coaching_batches_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.higher_education_coaching_batches_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: higher_education_coaching_batches_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.higher_education_coaching_batches_id_seq OWNED BY public.higher_education_coaching_batches.id;


--
-- Name: higher_education_loans; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.higher_education_loans (
    id integer NOT NULL,
    bank_name character varying(150) NOT NULL,
    amount numeric(14,2) NOT NULL,
    status character varying(20) DEFAULT 'under_process'::character varying NOT NULL,
    reapplied boolean DEFAULT false NOT NULL,
    collateral_free boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT higher_education_loans_status_check CHECK (((status)::text = ANY ((ARRAY['sanctioned'::character varying, 'under_process'::character varying, 'rejected'::character varying])::text[])))
);


--
-- Name: higher_education_loans_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.higher_education_loans_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: higher_education_loans_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.higher_education_loans_id_seq OWNED BY public.higher_education_loans.id;


--
-- Name: higher_education_retake_watchlist; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.higher_education_retake_watchlist (
    id integer NOT NULL,
    label character varying(100) NOT NULL,
    count integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: higher_education_retake_watchlist_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.higher_education_retake_watchlist_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: higher_education_retake_watchlist_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.higher_education_retake_watchlist_id_seq OWNED BY public.higher_education_retake_watchlist.id;


--
-- Name: higher_education_standing_returns; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.higher_education_standing_returns (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    meta character varying(255),
    status character varying(20) DEFAULT 'not_started'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT higher_education_standing_returns_status_check CHECK (((status)::text = ANY ((ARRAY['filed'::character varying, 'drafting'::character varying, 'in_review'::character varying, 'not_started'::character varying])::text[])))
);


--
-- Name: higher_education_standing_returns_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.higher_education_standing_returns_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: higher_education_standing_returns_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.higher_education_standing_returns_id_seq OWNED BY public.higher_education_standing_returns.id;


--
-- Name: higher_education_test_register; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.higher_education_test_register (
    test_name character varying(50) NOT NULL,
    enrolled_count integer DEFAULT 0 NOT NULL,
    cleared_count integer DEFAULT 0 NOT NULL,
    next_window_label character varying(100),
    next_window_date date,
    readiness character varying(20) DEFAULT 'on_track'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT higher_education_test_register_readiness_check CHECK (((readiness)::text = ANY ((ARRAY['on_track'::character varying, 'watch'::character varying, 'behind'::character varying])::text[])))
);


--
-- Name: higher_education_test_students; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.higher_education_test_students (
    id integer NOT NULL,
    test_name character varying(50) NOT NULL,
    student_id integer NOT NULL,
    enrolled_on date,
    attempted_on date,
    cleared_on date,
    score character varying(50),
    remarks text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by_user_id integer,
    CONSTRAINT higher_education_test_students_cleared_requires_attempt_check CHECK (((cleared_on IS NULL) OR (attempted_on IS NOT NULL))),
    CONSTRAINT higher_education_test_students_stage_order_check CHECK ((((attempted_on IS NULL) OR (enrolled_on IS NULL) OR (attempted_on >= enrolled_on)) AND ((cleared_on IS NULL) OR (attempted_on IS NULL) OR (cleared_on >= attempted_on))))
);


--
-- Name: TABLE higher_education_test_students; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.higher_education_test_students IS 'Which students are registered for each higher-education entrance test, and how far they got. Enrolled/Attempted/Cleared are derived from the three date columns.';


--
-- Name: higher_education_test_students_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.higher_education_test_students_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: higher_education_test_students_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.higher_education_test_students_id_seq OWNED BY public.higher_education_test_students.id;


--
-- Name: higher_education_universities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.higher_education_universities (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    country character varying(100) NOT NULL,
    programmes character varying(255),
    applied_count integer DEFAULT 0 NOT NULL,
    admits_count integer DEFAULT 0 NOT NULL,
    funded_count integer DEFAULT 0 NOT NULL,
    relation character varying(20) DEFAULT 'new'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT higher_education_universities_relation_check CHECK (((relation)::text = ANY ((ARRAY['mou_active'::character varying, 'regular'::character varying, 'national'::character varying, 'affiliating'::character varying, 'new'::character varying])::text[])))
);


--
-- Name: higher_education_universities_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.higher_education_universities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: higher_education_universities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.higher_education_universities_id_seq OWNED BY public.higher_education_universities.id;


--
-- Name: holiday_slots; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.holiday_slots (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    from_date date NOT NULL,
    to_date date NOT NULL
);


--
-- Name: holiday_slots_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.holiday_slots ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.holiday_slots_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: hostel_blocks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.hostel_blocks (
    id integer NOT NULL,
    hostel_id integer NOT NULL,
    name character varying(100) NOT NULL,
    floors smallint NOT NULL,
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: hostel_blocks_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.hostel_blocks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: hostel_blocks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.hostel_blocks_id_seq OWNED BY public.hostel_blocks.id;


--
-- Name: hostel_complaints; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.hostel_complaints (
    id integer NOT NULL,
    student_id integer,
    hostel_id integer,
    category public.hostel_complaint_category_enum NOT NULL,
    title character varying(150) NOT NULL,
    description text,
    priority public.hostel_complaint_priority_enum DEFAULT 'medium'::public.hostel_complaint_priority_enum NOT NULL,
    status public.hostel_complaint_status_enum DEFAULT 'open'::public.hostel_complaint_status_enum NOT NULL,
    assigned_to character varying(150),
    resolution_note text,
    resolved_at timestamp(6) with time zone,
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    faculty_id integer
);


--
-- Name: hostel_complaints_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.hostel_complaints_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: hostel_complaints_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.hostel_complaints_id_seq OWNED BY public.hostel_complaints.id;


--
-- Name: hostel_floors; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.hostel_floors (
    id integer NOT NULL,
    block_id integer NOT NULL,
    name character varying(50) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: hostel_floors_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.hostel_floors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: hostel_floors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.hostel_floors_id_seq OWNED BY public.hostel_floors.id;


--
-- Name: hostel_goods; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.hostel_goods (
    id integer NOT NULL,
    req_date date DEFAULT CURRENT_DATE NOT NULL,
    location character varying(150) NOT NULL,
    item character varying(150) NOT NULL,
    purpose character varying(255),
    warden_id integer,
    block_id integer,
    received boolean DEFAULT false NOT NULL,
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: hostel_goods_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.hostel_goods_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: hostel_goods_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.hostel_goods_id_seq OWNED BY public.hostel_goods.id;


--
-- Name: hostel_in_out_ledger; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.hostel_in_out_ledger (
    id integer NOT NULL,
    student_id integer NOT NULL,
    entry_type public.entry_type_enum NOT NULL,
    outing_id integer,
    recorded_at timestamp with time zone DEFAULT now() NOT NULL,
    recorded_by_user_id integer
);


--
-- Name: hostel_in_out_ledger_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.hostel_in_out_ledger ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.hostel_in_out_ledger_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: hostel_mess_feedback; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.hostel_mess_feedback (
    id integer NOT NULL,
    student_id integer NOT NULL,
    hostel_id integer,
    rating smallint NOT NULL,
    comment text,
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: hostel_mess_feedback_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.hostel_mess_feedback_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: hostel_mess_feedback_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.hostel_mess_feedback_id_seq OWNED BY public.hostel_mess_feedback.id;


--
-- Name: hostel_night_attendance; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.hostel_night_attendance (
    id integer NOT NULL,
    student_id integer NOT NULL,
    attendance_date date NOT NULL,
    status character varying(20) NOT NULL,
    marked_by_user_id integer,
    marked_at timestamp with time zone DEFAULT now() NOT NULL,
    is_published boolean DEFAULT true NOT NULL,
    published_at timestamp with time zone,
    CONSTRAINT hostel_night_attendance_status_check CHECK (((status)::text = ANY ((ARRAY['present'::character varying, 'absent'::character varying])::text[])))
);


--
-- Name: COLUMN hostel_night_attendance.is_published; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.hostel_night_attendance.is_published IS 'False while the night''s roll call is still a draft visible only to the warden taking it. Mirrors attendance_records.is_published.';


--
-- Name: COLUMN hostel_night_attendance.published_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.hostel_night_attendance.published_at IS 'When the night''s roll call was published. NULL for draft rows.';


--
-- Name: hostel_night_attendance_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.hostel_night_attendance_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: hostel_night_attendance_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.hostel_night_attendance_id_seq OWNED BY public.hostel_night_attendance.id;


--
-- Name: hostel_outings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.hostel_outings (
    id integer NOT NULL,
    student_id integer NOT NULL,
    start_time time without time zone NOT NULL,
    return_time time without time zone,
    reason character varying(255),
    from_date date NOT NULL,
    to_date date NOT NULL,
    status public.approval_status_enum DEFAULT 'pending'::public.approval_status_enum NOT NULL,
    approved_by_warden_user_id integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: hostel_outings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.hostel_outings ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.hostel_outings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: hostel_quit_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.hostel_quit_requests (
    id integer NOT NULL,
    student_id integer NOT NULL,
    room_id integer NOT NULL,
    requested_date date DEFAULT CURRENT_DATE NOT NULL,
    reason character varying(255),
    fee_status public.hostel_quit_fee_status_enum DEFAULT 'pending'::public.hostel_quit_fee_status_enum NOT NULL,
    status public.approval_status_enum DEFAULT 'pending'::public.approval_status_enum NOT NULL,
    resolved_at timestamp(6) with time zone,
    resolved_by_user_id integer,
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: hostel_quit_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.hostel_quit_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: hostel_quit_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.hostel_quit_requests_id_seq OWNED BY public.hostel_quit_requests.id;


--
-- Name: hostel_room_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.hostel_room_types (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    fee_amount integer
);


--
-- Name: hostel_room_types_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.hostel_room_types ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.hostel_room_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: hostel_rooms; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.hostel_rooms (
    id integer NOT NULL,
    room_number character varying(20) NOT NULL,
    room_type_id integer NOT NULL,
    capacity smallint NOT NULL,
    hostel_id integer NOT NULL,
    block_id integer,
    floor_id integer
);


--
-- Name: hostel_rooms_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.hostel_rooms ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.hostel_rooms_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: hostel_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.hostel_settings (
    id integer NOT NULL,
    auto_approve_low_risk boolean DEFAULT true NOT NULL,
    min_attendance_for_auto_pct numeric(5,2) DEFAULT 85 NOT NULL,
    require_biometric_pop boolean DEFAULT false NOT NULL,
    sms_guardian_on_checkout boolean DEFAULT true NOT NULL,
    alert_on_overdue_return boolean DEFAULT true NOT NULL,
    weekly_arrears_reminder boolean DEFAULT true NOT NULL,
    publish_resolved_complaints boolean DEFAULT false NOT NULL,
    max_outing_days integer DEFAULT 7 NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    curfew_time time without time zone
);


--
-- Name: hostel_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.hostel_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: hostel_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.hostel_settings_id_seq OWNED BY public.hostel_settings.id;


--
-- Name: hostel_wardens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.hostel_wardens (
    id integer NOT NULL,
    user_id integer,
    name character varying(150) NOT NULL,
    emp_id character varying(30) NOT NULL,
    role public.hostel_warden_role_enum NOT NULL,
    gender character varying(20),
    designation character varying(100),
    block_id integer,
    mobile character varying(20),
    email character varying(150),
    joined_date date,
    quarters character varying(50),
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: hostel_wardens_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.hostel_wardens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: hostel_wardens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.hostel_wardens_id_seq OWNED BY public.hostel_wardens.id;


--
-- Name: hostels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.hostels (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    code character varying(20) NOT NULL,
    wing public.hostel_wing_enum NOT NULL,
    warden_user_id integer,
    phone character varying(20),
    mess_type character varying(100),
    established_year integer,
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: hostels_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.hostels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: hostels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.hostels_id_seq OWNED BY public.hostels.id;


--
-- Name: hr_payroll_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.hr_payroll_requests (
    id integer NOT NULL,
    requested_by_user_id integer NOT NULL,
    category character varying(50) NOT NULL,
    subject character varying(255) NOT NULL,
    description text,
    attachment_url character varying(500),
    status character varying(20) DEFAULT 'submitted'::character varying NOT NULL,
    assigned_hr_user_id integer,
    resolution_note character varying(255),
    resolved_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT hr_payroll_requests_status_check CHECK (((status)::text = ANY ((ARRAY['submitted'::character varying, 'under_review'::character varying, 'resolved'::character varying])::text[])))
);


--
-- Name: hr_payroll_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.hr_payroll_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: hr_payroll_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.hr_payroll_requests_id_seq OWNED BY public.hr_payroll_requests.id;


--
-- Name: hr_queries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.hr_queries (
    id integer NOT NULL,
    faculty_id integer NOT NULL,
    category character varying(100) NOT NULL,
    subject character varying(200) NOT NULL,
    description text,
    file_url character varying(500),
    status character varying(20) DEFAULT 'submitted'::character varying NOT NULL,
    assigned_to_name character varying(150),
    assigned_at timestamp with time zone,
    resolved_at timestamp with time zone,
    resolution_note text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: hr_queries_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.hr_queries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: hr_queries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.hr_queries_id_seq OWNED BY public.hr_queries.id;


--
-- Name: incubation_milestones; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.incubation_milestones (
    id integer NOT NULL,
    incubation_id integer NOT NULL,
    label character varying(150) NOT NULL,
    due_date date,
    status character varying(20) DEFAULT 'Upcoming'::character varying NOT NULL,
    progress_percent smallint DEFAULT 0 NOT NULL,
    sort_order smallint DEFAULT 0 NOT NULL,
    CONSTRAINT incubation_milestones_progress_percent_check CHECK (((progress_percent >= 0) AND (progress_percent <= 100))),
    CONSTRAINT incubation_milestones_status_check CHECK (((status)::text = ANY ((ARRAY['Upcoming'::character varying, 'In Progress'::character varying, 'Completed'::character varying])::text[])))
);


--
-- Name: incubation_milestones_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.incubation_milestones_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: incubation_milestones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.incubation_milestones_id_seq OWNED BY public.incubation_milestones.id;


--
-- Name: incubations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.incubations (
    id integer NOT NULL,
    student_entrepreneurship_id integer NOT NULL,
    intake_label character varying(50),
    seat character varying(150),
    incubated_since date,
    mentor_faculty_id integer,
    review_attendance_note character varying(150),
    last_review_note character varying(255),
    next_review_date date,
    grant_note character varying(255),
    services_note character varying(255),
    status character varying(20) DEFAULT 'Active'::character varying NOT NULL,
    progress_percent smallint DEFAULT 0 NOT NULL,
    created_by_user_id integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT incubations_progress_percent_check CHECK (((progress_percent >= 0) AND (progress_percent <= 100))),
    CONSTRAINT incubations_status_check CHECK (((status)::text = ANY ((ARRAY['Active'::character varying, 'Graduated'::character varying, 'Exited'::character varying])::text[])))
);


--
-- Name: incubations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.incubations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: incubations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.incubations_id_seq OWNED BY public.incubations.id;


--
-- Name: invigilation_allocation_batches; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.invigilation_allocation_batches (
    id integer NOT NULL,
    exam_id integer NOT NULL,
    exam_date date NOT NULL,
    session public.exam_session_enum NOT NULL,
    status public.invigilation_allocation_status_enum DEFAULT 'draft'::public.invigilation_allocation_status_enum NOT NULL,
    created_by_user_id integer,
    created_at timestamp(6) with time zone DEFAULT now() NOT NULL,
    published_by_user_id integer,
    published_at timestamp(6) with time zone
);


--
-- Name: invigilation_allocation_batches_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.invigilation_allocation_batches_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: invigilation_allocation_batches_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.invigilation_allocation_batches_id_seq OWNED BY public.invigilation_allocation_batches.id;


--
-- Name: invigilation_duties; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.invigilation_duties (
    id integer NOT NULL,
    exam_id integer NOT NULL,
    faculty_id integer NOT NULL,
    hall_plan_id integer NOT NULL,
    duty_date date NOT NULL,
    session public.exam_session_enum NOT NULL,
    role public.invigilation_role_enum DEFAULT 'relief'::public.invigilation_role_enum NOT NULL,
    allocation_batch_id integer,
    duty_type public.invigilation_duty_type_enum DEFAULT 'regular'::public.invigilation_duty_type_enum NOT NULL,
    acknowledged_at timestamp with time zone
);


--
-- Name: invigilation_duties_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.invigilation_duties ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.invigilation_duties_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: iqac_accreditation_criteria; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.iqac_accreditation_criteria (
    id integer NOT NULL,
    cycle character varying(10) NOT NULL,
    code character varying(20) NOT NULL,
    name character varying(255) NOT NULL,
    owner_faculty_id integer,
    sort_order integer DEFAULT 0 NOT NULL,
    department_id integer,
    due_date date,
    readiness_percent smallint DEFAULT 0 NOT NULL,
    status character varying(20) DEFAULT 'pending'::character varying NOT NULL,
    note text,
    CONSTRAINT iqac_accreditation_criteria_cycle_check CHECK (((cycle)::text = ANY ((ARRAY['naac'::character varying, 'aqar'::character varying, 'ssr'::character varying])::text[])))
);


--
-- Name: iqac_accreditation_criteria_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.iqac_accreditation_criteria_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: iqac_accreditation_criteria_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.iqac_accreditation_criteria_id_seq OWNED BY public.iqac_accreditation_criteria.id;


--
-- Name: iqac_accreditation_evidence_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.iqac_accreditation_evidence_items (
    id integer NOT NULL,
    criterion_id integer NOT NULL,
    label character varying(255) NOT NULL,
    done boolean DEFAULT false NOT NULL,
    updated_by_user_id integer,
    updated_at timestamp with time zone
);


--
-- Name: iqac_accreditation_evidence_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.iqac_accreditation_evidence_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: iqac_accreditation_evidence_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.iqac_accreditation_evidence_items_id_seq OWNED BY public.iqac_accreditation_evidence_items.id;


--
-- Name: iqac_metric_targets; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.iqac_metric_targets (
    id integer NOT NULL,
    metric_key character varying(40) NOT NULL,
    academic_year character varying(20) NOT NULL,
    target_value numeric(6,2) NOT NULL,
    set_by_user_id integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: iqac_metric_targets_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.iqac_metric_targets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: iqac_metric_targets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.iqac_metric_targets_id_seq OWNED BY public.iqac_metric_targets.id;


--
-- Name: leave_parent_acknowledgements; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.leave_parent_acknowledgements (
    id integer NOT NULL,
    leave_id integer NOT NULL,
    parent_user_id integer NOT NULL,
    acknowledged_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: leave_parent_acknowledgements_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.leave_parent_acknowledgements_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: leave_parent_acknowledgements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.leave_parent_acknowledgements_id_seq OWNED BY public.leave_parent_acknowledgements.id;


--
-- Name: leave_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.leave_types (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    default_annual_quota smallint DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL
);


--
-- Name: leave_types_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.leave_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: leave_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.leave_types_id_seq OWNED BY public.leave_types.id;


--
-- Name: lesson_plan_sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.lesson_plan_sessions (
    id integer NOT NULL,
    lesson_plan_id integer NOT NULL,
    session_date date NOT NULL,
    unit_title character varying(200),
    topic character varying(300) NOT NULL,
    is_covered boolean DEFAULT false NOT NULL,
    sequence_no smallint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: lesson_plan_sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.lesson_plan_sessions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: lesson_plan_sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.lesson_plan_sessions_id_seq OWNED BY public.lesson_plan_sessions.id;


--
-- Name: lesson_plans; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.lesson_plans (
    id integer NOT NULL,
    faculty_id integer NOT NULL,
    subject_id integer NOT NULL,
    class_id integer NOT NULL,
    semester smallint NOT NULL,
    content text,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: lesson_plans_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.lesson_plans ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.lesson_plans_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: library_racks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.library_racks (
    id integer NOT NULL,
    rack_code character varying(30) NOT NULL,
    shelves integer DEFAULT 1 NOT NULL,
    subject_range character varying(255),
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: library_racks_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.library_racks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: library_racks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.library_racks_id_seq OWNED BY public.library_racks.id;


--
-- Name: library_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.library_settings (
    id integer NOT NULL,
    books_per_student integer DEFAULT 3 NOT NULL,
    default_borrowing_days integer DEFAULT 14 NOT NULL,
    max_renewals integer DEFAULT 2 NOT NULL,
    renewal_extension_days integer DEFAULT 14 NOT NULL,
    fine_per_day numeric(10,2) DEFAULT 5 NOT NULL,
    lost_book_processing_fee numeric(10,2) DEFAULT 100 NOT NULL,
    damaged_book_charge_rate numeric(4,2) DEFAULT 0.40 NOT NULL,
    grace_period_days integer DEFAULT 1 NOT NULL,
    block_issue_above_fine numeric(10,2) DEFAULT 200 NOT NULL,
    barcode_format character varying(30),
    spine_label_prefix character varying(20),
    counter_opens_at character varying(10),
    counter_closes_at character varying(10),
    updated_at timestamp(3) without time zone NOT NULL
);


--
-- Name: library_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.library_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: library_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.library_settings_id_seq OWNED BY public.library_settings.id;


--
-- Name: lms_folder_classes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.lms_folder_classes (
    id integer NOT NULL,
    folder_id integer NOT NULL,
    class_id integer NOT NULL
);


--
-- Name: lms_folder_classes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.lms_folder_classes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: lms_folder_classes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.lms_folder_classes_id_seq OWNED BY public.lms_folder_classes.id;


--
-- Name: lms_folders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.lms_folders (
    id integer NOT NULL,
    subject_id integer NOT NULL,
    faculty_id integer NOT NULL,
    title character varying(200) NOT NULL,
    description character varying(1000),
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: lms_folders_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.lms_folders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: lms_folders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.lms_folders_id_seq OWNED BY public.lms_folders.id;


--
-- Name: lms_notes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.lms_notes (
    id integer NOT NULL,
    subject_id integer NOT NULL,
    class_id integer NOT NULL,
    faculty_id integer NOT NULL,
    title character varying(200) NOT NULL,
    file_url character varying(500),
    uploaded_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: lms_notes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.lms_notes ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.lms_notes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: lms_resources; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.lms_resources (
    id integer NOT NULL,
    folder_id integer NOT NULL,
    title character varying(200) NOT NULL,
    description character varying(1000),
    resource_type public.lms_resource_type_enum NOT NULL,
    file_url character varying(500),
    link_url character varying(500),
    uploaded_by_user_id integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: lms_resources_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.lms_resources_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: lms_resources_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.lms_resources_id_seq OWNED BY public.lms_resources.id;


--
-- Name: main_gate_in_out_ledger; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.main_gate_in_out_ledger (
    id integer NOT NULL,
    student_id integer NOT NULL,
    roll_no character varying(30) NOT NULL,
    entry_type public.entry_type_enum NOT NULL,
    recorded_at timestamp with time zone DEFAULT now() NOT NULL,
    recorded_by_user_id integer,
    sms_sent_parent boolean DEFAULT false NOT NULL,
    sms_sent_student boolean DEFAULT false NOT NULL
);


--
-- Name: main_gate_in_out_ledger_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.main_gate_in_out_ledger ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.main_gate_in_out_ledger_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: malpractice_incidents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.malpractice_incidents (
    id integer NOT NULL,
    student_id integer NOT NULL,
    exam_id integer NOT NULL,
    exam_subject_mapping_id integer,
    venue_id integer,
    incident_date date NOT NULL,
    session public.exam_session_enum NOT NULL,
    seat_number character varying(20),
    nature public.malpractice_nature_enum NOT NULL,
    action_taken public.malpractice_action_enum NOT NULL,
    invigilator_remarks character varying(1000),
    reported_by_faculty_id integer,
    recorded_by_user_id integer,
    created_at timestamp(6) with time zone DEFAULT now() NOT NULL,
    enquiry_stage character varying(20) DEFAULT 'reported'::character varying NOT NULL,
    committee_sitting_at timestamp with time zone,
    appeal_status character varying(20)
);


--
-- Name: malpractice_incidents_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.malpractice_incidents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: malpractice_incidents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.malpractice_incidents_id_seq OWNED BY public.malpractice_incidents.id;


--
-- Name: marks_entry_locks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.marks_entry_locks (
    id integer NOT NULL,
    exam_id integer NOT NULL,
    department_id integer NOT NULL,
    is_locked boolean DEFAULT false NOT NULL,
    locked_by_user_id integer,
    locked_at timestamp(6) with time zone,
    is_published boolean DEFAULT false NOT NULL,
    published_by_user_id integer,
    published_at timestamp(6) with time zone
);


--
-- Name: marks_entry_locks_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.marks_entry_locks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: marks_entry_locks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.marks_entry_locks_id_seq OWNED BY public.marks_entry_locks.id;


--
-- Name: marksheets; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.marksheets (
    id integer NOT NULL,
    exam_id integer NOT NULL,
    student_id integer NOT NULL,
    file_url character varying(500) NOT NULL,
    generated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: marksheets_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.marksheets ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.marksheets_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: media_equipment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.media_equipment (
    id integer NOT NULL,
    asset_tag character varying(30),
    name character varying(150) NOT NULL,
    category character varying(30) NOT NULL,
    serial_no character varying(100),
    condition character varying(20) DEFAULT 'good'::character varying NOT NULL,
    status character varying(20) DEFAULT 'available'::character varying NOT NULL,
    checked_out_to character varying(150),
    purchased_on date,
    invoice_value numeric(12,2),
    warranty_till date,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by_user_id integer
);


--
-- Name: media_equipment_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.media_equipment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: media_equipment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.media_equipment_id_seq OWNED BY public.media_equipment.id;


--
-- Name: media_equipment_movements; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.media_equipment_movements (
    id integer NOT NULL,
    equipment_id integer NOT NULL,
    moved_at timestamp with time zone DEFAULT now() NOT NULL,
    note character varying(255) NOT NULL,
    created_by_user_id integer
);


--
-- Name: media_equipment_movements_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.media_equipment_movements_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: media_equipment_movements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.media_equipment_movements_id_seq OWNED BY public.media_equipment_movements.id;


--
-- Name: media_indents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.media_indents (
    id integer NOT NULL,
    requested_by_user_id integer NOT NULL,
    title character varying(200) NOT NULL,
    indent_type character varying(30) DEFAULT 'capital_equipment'::character varying NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    estimated_cost numeric(12,2),
    needed_by date,
    budget_head character varying(30) DEFAULT 'media_branding'::character varying NOT NULL,
    justification text,
    status character varying(20) DEFAULT 'pending'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    resolved_at timestamp with time zone,
    resolution_notes text
);


--
-- Name: media_indents_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.media_indents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: media_indents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.media_indents_id_seq OWNED BY public.media_indents.id;


--
-- Name: media_reports; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.media_reports (
    id integer NOT NULL,
    name character varying(200) NOT NULL,
    period character varying(100) NOT NULL,
    note text,
    status character varying(20) DEFAULT 'draft'::character varying NOT NULL,
    created_by_user_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: media_reports_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.media_reports_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: media_reports_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.media_reports_id_seq OWNED BY public.media_reports.id;


--
-- Name: media_request_status_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.media_request_status_log (
    id integer NOT NULL,
    media_request_id integer NOT NULL,
    status character varying(20) NOT NULL,
    changed_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: media_request_status_log_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.media_request_status_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: media_request_status_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.media_request_status_log_id_seq OWNED BY public.media_request_status_log.id;


--
-- Name: media_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.media_requests (
    id integer NOT NULL,
    requested_by_faculty_id integer,
    description character varying(500) NOT NULL,
    status public.media_request_status_enum DEFAULT 'pending'::public.media_request_status_enum NOT NULL,
    media_file_url character varying(500),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    requested_by_user_id integer NOT NULL,
    event_name character varying(255),
    event_date date,
    venue_id integer,
    coordinator_name character varying(150),
    contact_number character varying(20),
    media_types text[],
    guest_name character varying(150),
    guest_designation character varying(150),
    poster_needed_by date,
    audience text[]
);


--
-- Name: media_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.media_requests ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.media_requests_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: media_scorecard_targets; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.media_scorecard_targets (
    id integer NOT NULL,
    metric_key character varying(50) NOT NULL,
    academic_year character varying(10) NOT NULL,
    target_value numeric(10,2) NOT NULL,
    updated_by_user_id integer NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: media_scorecard_targets_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.media_scorecard_targets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: media_scorecard_targets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.media_scorecard_targets_id_seq OWNED BY public.media_scorecard_targets.id;


--
-- Name: media_shoot_assignments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.media_shoot_assignments (
    id integer NOT NULL,
    media_request_id integer,
    assigned_to_member_id integer,
    crew character varying(255),
    gear_issued character varying(255),
    output_type character varying(100),
    scheduled_at timestamp with time zone,
    status character varying(20) DEFAULT 'planned'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by_user_id integer NOT NULL,
    event_title character varying(255),
    venue character varying(255),
    CONSTRAINT media_shoot_assignments_source_check CHECK ((((media_request_id IS NOT NULL) AND (event_title IS NULL)) OR ((media_request_id IS NULL) AND (event_title IS NOT NULL))))
);


--
-- Name: media_shoot_assignments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.media_shoot_assignments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: media_shoot_assignments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.media_shoot_assignments_id_seq OWNED BY public.media_shoot_assignments.id;


--
-- Name: media_team_members; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.media_team_members (
    id integer NOT NULL,
    full_name character varying(150) NOT NULL,
    designation character varying(100),
    email character varying(150),
    phone character varying(20),
    skills text,
    photo_url text,
    status character varying(20) DEFAULT 'active'::character varying NOT NULL,
    joined_on date,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by_user_id integer
);


--
-- Name: media_team_members_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.media_team_members_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: media_team_members_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.media_team_members_id_seq OWNED BY public.media_team_members.id;


--
-- Name: medical_appointment_windows; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.medical_appointment_windows (
    id integer NOT NULL,
    slot_date date NOT NULL,
    start_time time without time zone NOT NULL,
    end_time time without time zone NOT NULL,
    slot_minutes smallint DEFAULT 30 NOT NULL,
    capacity_per_slot smallint DEFAULT 10 NOT NULL,
    status character varying(20) DEFAULT 'open'::character varying NOT NULL,
    created_by_user_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT medical_appointment_windows_capacity_check CHECK (((capacity_per_slot >= 1) AND (capacity_per_slot <= 200))),
    CONSTRAINT medical_appointment_windows_divisible_check CHECK ((mod((EXTRACT(epoch FROM (end_time - start_time)))::integer, (slot_minutes * 60)) = 0)),
    CONSTRAINT medical_appointment_windows_slot_minutes_check CHECK ((slot_minutes = ANY (ARRAY[10, 15, 20, 30, 60]))),
    CONSTRAINT medical_appointment_windows_status_check CHECK (((status)::text = ANY ((ARRAY['open'::character varying, 'closed'::character varying])::text[]))),
    CONSTRAINT medical_appointment_windows_time_order_check CHECK ((end_time > start_time))
);


--
-- Name: TABLE medical_appointment_windows; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.medical_appointment_windows IS 'One row per time part medical staff opens for appointments on a date. The bookable 30-min slots inside it are derived (start_time + n * slot_minutes), never stored.';


--
-- Name: COLUMN medical_appointment_windows.capacity_per_slot; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.medical_appointment_windows.capacity_per_slot IS 'Maximum live (pending + approved) bookings allowed in each derived slot. Defaults to 10.';


--
-- Name: COLUMN medical_appointment_windows.status; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.medical_appointment_windows.status IS 'open = accepting bookings; closed = staff stopped intake, existing bookings stand.';


--
-- Name: medical_appointment_windows_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.medical_appointment_windows_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: medical_appointment_windows_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.medical_appointment_windows_id_seq OWNED BY public.medical_appointment_windows.id;


--
-- Name: medical_appointments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.medical_appointments (
    id integer NOT NULL,
    window_id integer NOT NULL,
    slot_date date NOT NULL,
    slot_start time without time zone NOT NULL,
    slot_end time without time zone NOT NULL,
    booked_by_user_id integer NOT NULL,
    patient_kind public.borrower_type_enum NOT NULL,
    student_id integer,
    faculty_id integer,
    staff_id integer,
    reason character varying(255),
    status character varying(20) DEFAULT 'pending'::character varying NOT NULL,
    decided_by_user_id integer,
    decided_at timestamp with time zone,
    decision_note character varying(255),
    visit_id integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT medical_appointments_decision_check CHECK ((((status)::text = ANY ((ARRAY['pending'::character varying, 'cancelled'::character varying])::text[])) OR ((decided_by_user_id IS NOT NULL) AND (decided_at IS NOT NULL)))),
    CONSTRAINT medical_appointments_patient_identity_check CHECK ((((patient_kind = 'student'::public.borrower_type_enum) AND (student_id IS NOT NULL) AND (faculty_id IS NULL) AND (staff_id IS NULL)) OR ((patient_kind = 'faculty'::public.borrower_type_enum) AND (faculty_id IS NOT NULL) AND (student_id IS NULL) AND (staff_id IS NULL)) OR ((patient_kind = 'staff'::public.borrower_type_enum) AND (staff_id IS NOT NULL) AND (student_id IS NULL) AND (faculty_id IS NULL)))),
    CONSTRAINT medical_appointments_slot_order_check CHECK ((slot_end > slot_start)),
    CONSTRAINT medical_appointments_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'approved'::character varying, 'rejected'::character varying, 'cancelled'::character varying])::text[]))),
    CONSTRAINT medical_appointments_visit_link_check CHECK (((visit_id IS NULL) OR ((status)::text = 'approved'::text)))
);


--
-- Name: TABLE medical_appointments; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.medical_appointments IS 'One booking of one derived 30-min slot. Stays out of the OPD queue until medical staff approves it, at which point visit_id points at the medical_visits row created for it.';


--
-- Name: COLUMN medical_appointments.booked_by_user_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.medical_appointments.booked_by_user_id IS 'Authenticated booker, resolved from the JWT server-side. Never accepted from the request body.';


--
-- Name: COLUMN medical_appointments.visit_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.medical_appointments.visit_id IS 'The OPD queue row this booking became on approval. NULL while pending/rejected/cancelled.';


--
-- Name: medical_appointments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.medical_appointments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: medical_appointments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.medical_appointments_id_seq OWNED BY public.medical_appointments.id;


--
-- Name: medical_bill_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.medical_bill_items (
    id integer NOT NULL,
    bill_id integer NOT NULL,
    item_type character varying(20) NOT NULL,
    description character varying(150) NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    rate numeric(8,2) NOT NULL,
    amount numeric(10,2) NOT NULL,
    CONSTRAINT medical_bill_items_item_type_check CHECK (((item_type)::text = ANY ((ARRAY['medicine'::character varying, 'service'::character varying])::text[])))
);


--
-- Name: medical_bill_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.medical_bill_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: medical_bill_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.medical_bill_items_id_seq OWNED BY public.medical_bill_items.id;


--
-- Name: medical_bills; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.medical_bills (
    id integer NOT NULL,
    patient_name character varying(150) NOT NULL,
    patient_dept character varying(100),
    condition character varying(255),
    attended_by_staff_id integer,
    payment_mode character varying(30) NOT NULL,
    status character varying(20) DEFAULT 'pending'::character varying NOT NULL,
    medicine_total numeric(10,2) DEFAULT 0 NOT NULL,
    service_total numeric(10,2) DEFAULT 0 NOT NULL,
    total numeric(10,2) DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    upi_transaction_id character varying(60),
    visit_id integer,
    CONSTRAINT medical_bills_payment_mode_check CHECK (((payment_mode)::text = ANY ((ARRAY['cash'::character varying, 'upi'::character varying, 'student_account'::character varying, 'staff_welfare'::character varying])::text[]))),
    CONSTRAINT medical_bills_status_check CHECK (((status)::text = ANY ((ARRAY['paid'::character varying, 'pending'::character varying, 'settled'::character varying])::text[])))
);


--
-- Name: medical_bills_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.medical_bills_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: medical_bills_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.medical_bills_id_seq OWNED BY public.medical_bills.id;


--
-- Name: medical_camp_registrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.medical_camp_registrations (
    id integer NOT NULL,
    camp_id integer NOT NULL,
    student_id integer,
    faculty_id integer,
    remarks character varying(255),
    registered_by_user_id integer,
    registered_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT medical_camp_registrations_one_person_chk CHECK (((student_id IS NOT NULL) <> (faculty_id IS NOT NULL)))
);


--
-- Name: medical_camp_registrations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.medical_camp_registrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: medical_camp_registrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.medical_camp_registrations_id_seq OWNED BY public.medical_camp_registrations.id;


--
-- Name: medical_camps; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.medical_camps (
    id integer NOT NULL,
    title character varying(200) NOT NULL,
    detail character varying(255),
    camp_date date NOT NULL,
    state character varying(20) DEFAULT 'planning'::character varying NOT NULL,
    target_count integer DEFAULT 0 NOT NULL,
    registered_count integer DEFAULT 0 NOT NULL,
    is_past boolean DEFAULT false NOT NULL,
    outcome_summary character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT medical_camps_state_check CHECK (((state)::text = ANY ((ARRAY['running'::character varying, 'scheduled'::character varying, 'planning'::character varying])::text[])))
);


--
-- Name: medical_camps_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.medical_camps_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: medical_camps_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.medical_camps_id_seq OWNED BY public.medical_camps.id;


--
-- Name: medical_equipment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.medical_equipment (
    id integer NOT NULL,
    name character varying(150) NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    location character varying(150),
    condition character varying(30) DEFAULT 'working'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: medical_equipment_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.medical_equipment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: medical_equipment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.medical_equipment_id_seq OWNED BY public.medical_equipment.id;


--
-- Name: medical_services; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.medical_services (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    rate numeric(8,2) NOT NULL,
    note character varying(150)
);


--
-- Name: medical_services_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.medical_services_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: medical_services_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.medical_services_id_seq OWNED BY public.medical_services.id;


--
-- Name: medical_staff; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.medical_staff (
    id integer NOT NULL,
    user_id integer,
    name character varying(150) NOT NULL,
    designation character varying(100),
    shift_time character varying(50),
    phone character varying(20),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    on_duty boolean DEFAULT true NOT NULL,
    qualification character varying(150),
    specialization character varying(150),
    experience_years integer,
    previous_institution character varying(200),
    previous_role character varying(150),
    previous_duration character varying(50),
    registration_no character varying(50),
    email character varying(150),
    joined_date date,
    working_days character varying(100),
    emergency_duty_available boolean DEFAULT false NOT NULL,
    status character varying(20) DEFAULT 'active'::character varying NOT NULL,
    CONSTRAINT medical_staff_status_check CHECK (((status)::text = ANY ((ARRAY['active'::character varying, 'on_leave'::character varying])::text[])))
);


--
-- Name: medical_staff_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.medical_staff_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: medical_staff_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.medical_staff_id_seq OWNED BY public.medical_staff.id;


--
-- Name: medical_visits; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.medical_visits (
    id integer NOT NULL,
    visitor_type public.borrower_type_enum NOT NULL,
    student_id integer,
    faculty_id integer,
    visit_date date DEFAULT CURRENT_DATE NOT NULL,
    reason character varying(255),
    diagnosis text,
    treatment_given text,
    referred_to_hospital boolean DEFAULT false NOT NULL,
    attended_by_staff_id integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    status character varying(20) DEFAULT 'done'::character varying NOT NULL,
    queued_at timestamp with time zone DEFAULT now() NOT NULL,
    staff_id integer,
    CONSTRAINT medical_visits_status_check CHECK (((status)::text = ANY ((ARRAY['waiting'::character varying, 'consult'::character varying, 'done'::character varying])::text[])))
);


--
-- Name: COLUMN medical_visits.staff_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.medical_visits.staff_id IS 'Non-teaching staff patient, used when visitor_type = staff. NULL for student/faculty visits.';


--
-- Name: medical_visits_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.medical_visits_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: medical_visits_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.medical_visits_id_seq OWNED BY public.medical_visits.id;


--
-- Name: meeting_action_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.meeting_action_items (
    id integer NOT NULL,
    meeting_id integer NOT NULL,
    label character varying(255) NOT NULL,
    done boolean DEFAULT false NOT NULL
);


--
-- Name: meeting_action_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.meeting_action_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: meeting_action_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.meeting_action_items_id_seq OWNED BY public.meeting_action_items.id;


--
-- Name: message_conversations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.message_conversations (
    id bigint NOT NULL,
    is_group boolean DEFAULT false NOT NULL,
    dm_key character varying(40),
    title character varying(150),
    created_by_user_id integer NOT NULL,
    last_message_id bigint,
    last_message_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    image_url character varying(500)
);


--
-- Name: message_conversations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.message_conversations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: message_conversations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.message_conversations_id_seq OWNED BY public.message_conversations.id;


--
-- Name: message_participants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.message_participants (
    id bigint NOT NULL,
    conversation_id bigint NOT NULL,
    user_id integer NOT NULL,
    joined_at timestamp with time zone DEFAULT now() NOT NULL,
    last_read_message_id bigint,
    last_read_at timestamp with time zone,
    is_muted boolean DEFAULT false NOT NULL,
    is_pinned boolean DEFAULT false NOT NULL,
    pinned_at timestamp with time zone
);


--
-- Name: message_participants_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.message_participants_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: message_participants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.message_participants_id_seq OWNED BY public.message_participants.id;


--
-- Name: message_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.message_requests (
    id bigint NOT NULL,
    request_type character varying(20) NOT NULL,
    sender_user_id integer NOT NULL,
    receiver_user_id integer NOT NULL,
    conversation_id bigint,
    status character varying(20) DEFAULT 'pending'::character varying NOT NULL,
    active_key character varying(60),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: message_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.message_requests_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: message_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.message_requests_id_seq OWNED BY public.message_requests.id;


--
-- Name: messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.messages (
    id bigint NOT NULL,
    conversation_id bigint NOT NULL,
    sender_user_id integer NOT NULL,
    body text NOT NULL,
    status public.message_status_enum DEFAULT 'sent'::public.message_status_enum NOT NULL,
    is_edited boolean DEFAULT false NOT NULL,
    edited_at timestamp with time zone,
    is_deleted_for_everyone boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone,
    deleted_by_user_id integer,
    client_generated_id character varying(64),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    delivered_at timestamp with time zone,
    read_at timestamp with time zone
);


--
-- Name: messages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.messages_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.messages_id_seq OWNED BY public.messages.id;


--
-- Name: model_performance; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.model_performance (
    id integer NOT NULL,
    training_date timestamp with time zone NOT NULL,
    total_queries_analyzed integer NOT NULL,
    accuracy_rate numeric(5,2) NOT NULL,
    misclassification_count integer NOT NULL,
    avg_confidence numeric(4,3) NOT NULL,
    low_confidence_count integer NOT NULL,
    positive_feedback_pct numeric(5,2) NOT NULL,
    new_examples_added integer NOT NULL,
    retrain_triggered boolean DEFAULT false NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: model_performance_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.model_performance_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: model_performance_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.model_performance_id_seq OWNED BY public.model_performance.id;


--
-- Name: nba_criteria; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.nba_criteria (
    id integer NOT NULL,
    department_id integer NOT NULL,
    code character varying(30) NOT NULL,
    name character varying(255) NOT NULL,
    max_marks integer NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL
);


--
-- Name: nba_criteria_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.nba_criteria_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: nba_criteria_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.nba_criteria_id_seq OWNED BY public.nba_criteria.id;


--
-- Name: nba_evidence_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.nba_evidence_items (
    id integer NOT NULL,
    criterion_id integer NOT NULL,
    label character varying(255) NOT NULL,
    done boolean DEFAULT false NOT NULL,
    updated_by_user_id integer,
    updated_at timestamp with time zone
);


--
-- Name: nba_evidence_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.nba_evidence_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: nba_evidence_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.nba_evidence_items_id_seq OWNED BY public.nba_evidence_items.id;


--
-- Name: non_teaching_staff; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.non_teaching_staff (
    id integer NOT NULL,
    user_id integer,
    first_name character varying(100) NOT NULL,
    last_name character varying(100),
    category public.staff_category_enum NOT NULL,
    department_id integer,
    date_of_joining date,
    status public.user_status_enum DEFAULT 'active'::public.user_status_enum NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: non_teaching_staff_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.non_teaching_staff ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.non_teaching_staff_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notifications (
    id integer NOT NULL,
    user_id integer NOT NULL,
    title character varying(150) NOT NULL,
    message text NOT NULL,
    is_read boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    type public.notification_type_enum,
    related_entity_type character varying(50),
    related_entity_id integer,
    is_pinned boolean DEFAULT false NOT NULL
);


--
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.notifications ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.notifications_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: od_request_hod_approvals; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.od_request_hod_approvals (
    id integer NOT NULL,
    od_request_id integer NOT NULL,
    student_id integer NOT NULL,
    department_id integer NOT NULL,
    hod_user_id integer,
    status public.approval_status_enum DEFAULT 'pending'::public.approval_status_enum NOT NULL,
    reviewed_at timestamp with time zone
);


--
-- Name: od_request_hod_approvals_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.od_request_hod_approvals ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.od_request_hod_approvals_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: od_request_parent_acknowledgements; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.od_request_parent_acknowledgements (
    id integer NOT NULL,
    od_request_id integer NOT NULL,
    parent_user_id integer NOT NULL,
    acknowledged_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: od_request_parent_acknowledgements_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.od_request_parent_acknowledgements_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: od_request_parent_acknowledgements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.od_request_parent_acknowledgements_id_seq OWNED BY public.od_request_parent_acknowledgements.id;


--
-- Name: od_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.od_requests (
    id integer NOT NULL,
    team_id integer NOT NULL,
    from_date date NOT NULL,
    to_date date NOT NULL,
    reason character varying(255),
    mentor_approval_status public.approval_status_enum DEFAULT 'pending'::public.approval_status_enum NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    from_time time with time zone,
    to_time time with time zone,
    faculty_guide_id integer,
    organization character varying(255),
    location character varying(255),
    latitude numeric(10,6),
    longitude numeric(10,6),
    photo_url character varying(500),
    photo_uploaded_at timestamp(6) with time zone,
    certificate_url character varying(500),
    certificate_uploaded_at timestamp(6) with time zone,
    verification_status public.od_verification_status_enum DEFAULT 'awaiting_documents'::public.od_verification_status_enum NOT NULL,
    email_sender character varying(255),
    email_receiver character varying(255),
    email_subject character varying(255),
    email_sent_at timestamp(6) with time zone,
    email_body text,
    admin_remarks text
);


--
-- Name: od_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.od_requests ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.od_requests_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: od_team_members; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.od_team_members (
    id integer NOT NULL,
    team_id integer NOT NULL,
    student_id integer NOT NULL,
    joined_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: od_team_members_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.od_team_members ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.od_team_members_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: od_teams; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.od_teams (
    id integer NOT NULL,
    created_by_student_id integer NOT NULL,
    unique_code character varying(20) NOT NULL,
    is_locked boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    team_name character varying(150),
    reason character varying(255),
    venue character varying(255),
    from_date date,
    to_date date,
    from_time time(6) with time zone,
    to_time time(6) with time zone,
    faculty_guide_id integer
);


--
-- Name: od_teams_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.od_teams ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.od_teams_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: online_class_participants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.online_class_participants (
    id integer NOT NULL,
    online_class_id integer NOT NULL,
    user_id integer NOT NULL,
    role character varying(10) NOT NULL,
    joined_at timestamp with time zone DEFAULT now() NOT NULL,
    left_at timestamp with time zone,
    duration_seconds integer,
    CONSTRAINT online_class_participants_role_check CHECK (((role)::text = ANY ((ARRAY['faculty'::character varying, 'student'::character varying])::text[])))
);


--
-- Name: online_class_participants_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.online_class_participants_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: online_class_participants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.online_class_participants_id_seq OWNED BY public.online_class_participants.id;


--
-- Name: online_classes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.online_classes (
    id integer NOT NULL,
    subject_id integer NOT NULL,
    class_id integer NOT NULL,
    faculty_id integer NOT NULL,
    class_date date NOT NULL,
    period_number smallint,
    status character varying(20) DEFAULT 'live'::character varying NOT NULL,
    livekit_room_name character varying(100) NOT NULL,
    started_at timestamp with time zone,
    ended_at timestamp with time zone,
    scheduled_at timestamp with time zone,
    title character varying(200),
    CONSTRAINT online_classes_status_check CHECK (((status)::text = ANY ((ARRAY['scheduled'::character varying, 'live'::character varying, 'completed'::character varying])::text[])))
);


--
-- Name: online_classes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.online_classes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: online_classes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.online_classes_id_seq OWNED BY public.online_classes.id;


--
-- Name: outcome_attainments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.outcome_attainments (
    id integer NOT NULL,
    outcome_type character varying(10) NOT NULL,
    course_outcome_id integer,
    program_outcome_id integer,
    academic_year character varying(20) NOT NULL,
    batch_id integer,
    direct_value numeric(4,2),
    indirect_value numeric(4,2),
    target_value numeric(4,2) DEFAULT 2.80 NOT NULL,
    attained_value numeric(4,2),
    entered_by_user_id integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT outcome_attainments_check CHECK (((((outcome_type)::text = 'course'::text) AND (course_outcome_id IS NOT NULL) AND (program_outcome_id IS NULL)) OR (((outcome_type)::text = 'program'::text) AND (program_outcome_id IS NOT NULL) AND (course_outcome_id IS NULL)))),
    CONSTRAINT outcome_attainments_outcome_type_check CHECK (((outcome_type)::text = ANY ((ARRAY['course'::character varying, 'program'::character varying])::text[])))
);


--
-- Name: outcome_attainments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.outcome_attainments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: outcome_attainments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.outcome_attainments_id_seq OWNED BY public.outcome_attainments.id;


--
-- Name: parent_feedback; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.parent_feedback (
    id integer NOT NULL,
    parent_user_id integer NOT NULL,
    student_id integer,
    category public.parent_feedback_category_enum NOT NULL,
    message text NOT NULL,
    rating integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: parent_feedback_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.parent_feedback_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: parent_feedback_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.parent_feedback_id_seq OWNED BY public.parent_feedback.id;


--
-- Name: parent_student_mapping; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.parent_student_mapping (
    id integer NOT NULL,
    parent_user_id integer NOT NULL,
    student_id integer NOT NULL,
    relationship public.parent_relationship_enum NOT NULL
);


--
-- Name: parent_student_mapping_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.parent_student_mapping ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.parent_student_mapping_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: pass_board_course_grace; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pass_board_course_grace (
    id integer NOT NULL,
    sheet_id integer NOT NULL,
    exam_subject_mapping_id integer NOT NULL,
    grace_marks numeric(4,2) DEFAULT 0 NOT NULL,
    board_note character varying(255)
);


--
-- Name: pass_board_course_grace_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.pass_board_course_grace_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: pass_board_course_grace_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.pass_board_course_grace_id_seq OWNED BY public.pass_board_course_grace.id;


--
-- Name: pass_board_sheets; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pass_board_sheets (
    id integer NOT NULL,
    exam_id integer NOT NULL,
    phase character varying(30) DEFAULT 'Phase 1'::character varying NOT NULL,
    meeting_at timestamp with time zone,
    status public.pass_board_sheet_status_enum DEFAULT 'draft'::public.pass_board_sheet_status_enum NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: pass_board_sheets_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.pass_board_sheets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: pass_board_sheets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.pass_board_sheets_id_seq OWNED BY public.pass_board_sheets.id;


--
-- Name: pass_board_signoffs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pass_board_signoffs (
    id integer NOT NULL,
    sheet_id integer NOT NULL,
    member_name character varying(150) NOT NULL,
    member_role character varying(100) NOT NULL,
    status public.pass_board_signoff_status_enum DEFAULT 'awaiting'::public.pass_board_signoff_status_enum NOT NULL,
    signed_at timestamp with time zone
);


--
-- Name: pass_board_signoffs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.pass_board_signoffs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: pass_board_signoffs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.pass_board_signoffs_id_seq OWNED BY public.pass_board_signoffs.id;


--
-- Name: payslip_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payslip_requests (
    id integer NOT NULL,
    faculty_id integer,
    month smallint NOT NULL,
    year smallint NOT NULL,
    status public.payslip_status_enum DEFAULT 'pending'::public.payslip_status_enum NOT NULL,
    file_url character varying(500),
    requested_at timestamp with time zone DEFAULT now() NOT NULL,
    purpose character varying(255),
    staff_user_id integer
);


--
-- Name: payslip_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.payslip_requests ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.payslip_requests_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: period_timings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.period_timings (
    id integer NOT NULL,
    period_number smallint NOT NULL,
    start_time time without time zone NOT NULL,
    end_time time without time zone NOT NULL,
    is_break boolean DEFAULT false NOT NULL
);


--
-- Name: period_timings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.period_timings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: period_timings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.period_timings_id_seq OWNED BY public.period_timings.id;


--
-- Name: personal_calendar_entries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.personal_calendar_entries (
    id integer NOT NULL,
    user_id integer NOT NULL,
    entry_date date NOT NULL,
    title character varying(200) NOT NULL,
    category public.personal_calendar_entry_category_enum DEFAULT 'personal'::public.personal_calendar_entry_category_enum NOT NULL,
    details character varying(255),
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: personal_calendar_entries_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.personal_calendar_entries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: personal_calendar_entries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.personal_calendar_entries_id_seq OWNED BY public.personal_calendar_entries.id;


--
-- Name: pharmacy_dispense_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pharmacy_dispense_log (
    id integer NOT NULL,
    stock_id integer NOT NULL,
    quantity integer NOT NULL,
    dispensed_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: pharmacy_dispense_log_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.pharmacy_dispense_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: pharmacy_dispense_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.pharmacy_dispense_log_id_seq OWNED BY public.pharmacy_dispense_log.id;


--
-- Name: pharmacy_stock; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pharmacy_stock (
    id integer NOT NULL,
    name character varying(150) NOT NULL,
    use_case character varying(255),
    form character varying(50),
    quantity integer DEFAULT 0 NOT NULL,
    reorder_level integer DEFAULT 10 NOT NULL,
    expiry_date date,
    rate numeric(8,2) DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: pharmacy_stock_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.pharmacy_stock_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: pharmacy_stock_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.pharmacy_stock_id_seq OWNED BY public.pharmacy_stock.id;


--
-- Name: photocopy_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.photocopy_requests (
    id integer NOT NULL,
    student_id integer NOT NULL,
    exam_marks_id integer NOT NULL,
    fee_amount numeric(8,2) NOT NULL,
    status public.photocopy_status_enum DEFAULT 'requested'::public.photocopy_status_enum NOT NULL,
    applied_at timestamp(6) with time zone DEFAULT now() NOT NULL,
    processed_by_user_id integer,
    processed_at timestamp(6) with time zone
);


--
-- Name: photocopy_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.photocopy_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: photocopy_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.photocopy_requests_id_seq OWNED BY public.photocopy_requests.id;


--
-- Name: placement_drives; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.placement_drives (
    id integer NOT NULL,
    company_id integer NOT NULL,
    is_disclosed boolean DEFAULT true NOT NULL,
    disclosed_reveal_date date,
    scheduled_date date NOT NULL,
    status character varying(20) DEFAULT 'scheduled'::character varying NOT NULL,
    created_by_user_id integer,
    notification_sent_at timestamp with time zone,
    job_role character varying(150),
    package_lpa numeric(6,2),
    eligibility_cgpa numeric(3,2),
    venue character varying(200),
    registration_start date,
    registration_end date,
    CONSTRAINT placement_drives_status_check CHECK (((status)::text = ANY ((ARRAY['scheduled'::character varying, 'ongoing'::character varying, 'completed'::character varying, 'cancelled'::character varying])::text[])))
);


--
-- Name: placement_drives_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.placement_drives ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.placement_drives_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: placement_interviews; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.placement_interviews (
    id integer NOT NULL,
    student_id integer NOT NULL,
    drive_id integer NOT NULL,
    interview_date date NOT NULL,
    round_label character varying(100) NOT NULL,
    slot_label character varying(100) NOT NULL,
    panel_member character varying(150) NOT NULL,
    status character varying(20) DEFAULT 'scheduled'::character varying NOT NULL,
    panel_feedback character varying(500),
    created_by_user_id integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: TABLE placement_interviews; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.placement_interviews IS 'One scheduled interview session: a student, a drive, a round, a slot and a panel member. The outcome is written through to student_drive_applications rather than stored twice.';


--
-- Name: placement_interviews_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.placement_interviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: placement_interviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.placement_interviews_id_seq OWNED BY public.placement_interviews.id;


--
-- Name: placement_todos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.placement_todos (
    id integer NOT NULL,
    title character varying(200) NOT NULL,
    description character varying(2000),
    deadline timestamp with time zone,
    created_by_user_id integer NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    pdf_url character varying(500),
    link_url character varying(500)
);


--
-- Name: placement_todos_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.placement_todos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: placement_todos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.placement_todos_id_seq OWNED BY public.placement_todos.id;


--
-- Name: program_outcomes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.program_outcomes (
    id integer NOT NULL,
    department_id integer NOT NULL,
    code character varying(10) NOT NULL,
    description character varying(255) NOT NULL
);


--
-- Name: program_outcomes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.program_outcomes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: program_outcomes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.program_outcomes_id_seq OWNED BY public.program_outcomes.id;


--
-- Name: project_join_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.project_join_requests (
    id integer NOT NULL,
    team_id integer NOT NULL,
    student_id integer NOT NULL,
    message text,
    status character varying(20) DEFAULT 'PENDING'::character varying,
    applied_at timestamp with time zone DEFAULT now(),
    reviewed_at timestamp with time zone,
    reviewed_by integer
);


--
-- Name: project_join_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.project_join_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: project_join_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.project_join_requests_id_seq OWNED BY public.project_join_requests.id;


--
-- Name: project_recruitment_posts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.project_recruitment_posts (
    id integer NOT NULL,
    team_id integer NOT NULL,
    title character varying(200) NOT NULL,
    description text,
    vacancies smallint NOT NULL,
    required_skills text[],
    deadline date,
    status character varying(20) DEFAULT 'ACTIVE'::character varying,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: project_recruitment_posts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.project_recruitment_posts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: project_recruitment_posts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.project_recruitment_posts_id_seq OWNED BY public.project_recruitment_posts.id;


--
-- Name: project_team_members; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.project_team_members (
    id integer NOT NULL,
    team_id integer NOT NULL,
    student_id integer NOT NULL,
    role character varying(20) DEFAULT 'MEMBER'::character varying,
    joined_at timestamp with time zone DEFAULT now()
);


--
-- Name: project_team_members_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.project_team_members_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: project_team_members_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.project_team_members_id_seq OWNED BY public.project_team_members.id;


--
-- Name: project_teams; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.project_teams (
    id integer NOT NULL,
    team_name character varying(100) NOT NULL,
    project_title character varying(200) NOT NULL,
    project_description text,
    leader_student_id integer NOT NULL,
    class_id integer NOT NULL,
    batch_id integer NOT NULL,
    department_id integer NOT NULL,
    max_members smallint DEFAULT 5 NOT NULL,
    current_members smallint DEFAULT 1 NOT NULL,
    status character varying(20) DEFAULT 'OPEN'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: project_teams_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.project_teams_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: project_teams_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.project_teams_id_seq OWNED BY public.project_teams.id;


--
-- Name: publication_contributors; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.publication_contributors (
    id integer NOT NULL,
    publication_id integer NOT NULL,
    faculty_id integer,
    student_id integer,
    role character varying(20) DEFAULT 'secondary_author'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT publication_contributors_exactly_one_person CHECK ((((faculty_id IS NOT NULL) AND (student_id IS NULL)) OR ((faculty_id IS NULL) AND (student_id IS NOT NULL))))
);


--
-- Name: publication_contributors_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.publication_contributors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: publication_contributors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.publication_contributors_id_seq OWNED BY public.publication_contributors.id;


--
-- Name: purchase_indents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.purchase_indents (
    id integer NOT NULL,
    requested_by_user_id integer NOT NULL,
    department_id integer NOT NULL,
    item_name character varying(255) NOT NULL,
    quantity integer NOT NULL,
    purpose text,
    status public.indent_status_enum DEFAULT 'submitted'::public.indent_status_enum NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    needed_by date,
    hod_remarks text,
    hod_reviewed_by integer,
    hod_reviewed_at timestamp with time zone,
    ref character varying(40),
    estimated_amount numeric(12,2)
);


--
-- Name: purchase_indents_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.purchase_indents ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.purchase_indents_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: purchase_order_proposals; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.purchase_order_proposals (
    id integer NOT NULL,
    indent_id integer NOT NULL,
    vendor_id integer,
    finance_reviewed_by integer,
    finance_reviewed_at timestamp with time zone,
    hod_reviewed_by integer,
    hod_reviewed_at timestamp with time zone,
    status public.proposal_status_enum DEFAULT 'pending'::public.proposal_status_enum NOT NULL,
    hod_remarks text,
    finance_remarks text,
    principal_reviewed_by integer,
    principal_reviewed_at timestamp with time zone
);


--
-- Name: purchase_order_proposals_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.purchase_order_proposals ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.purchase_order_proposals_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: purchase_orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.purchase_orders (
    id integer NOT NULL,
    proposal_id integer NOT NULL,
    po_number character varying(50) NOT NULL,
    approved_by_user_id integer,
    approved_at timestamp with time zone,
    file_url character varying(500),
    sent_to_vendor_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: purchase_orders_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.purchase_orders ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.purchase_orders_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: query_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.query_logs (
    id integer NOT NULL,
    user_id integer NOT NULL,
    message text NOT NULL,
    intent_detected character varying(100),
    confidence numeric(4,3),
    is_correct boolean,
    correct_intent character varying(100),
    user_feedback_rating smallint,
    user_notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: query_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.query_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: query_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.query_logs_id_seq OWNED BY public.query_logs.id;


--
-- Name: question_papers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.question_papers (
    id integer NOT NULL,
    exam_subject_mapping_id integer NOT NULL,
    setter_faculty_id integer,
    moderator_faculty_id integer,
    sets_count smallint DEFAULT 0 NOT NULL,
    vaulted boolean DEFAULT false NOT NULL,
    status public.question_paper_status_enum DEFAULT 'awaiting_upload'::public.question_paper_status_enum NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    due_date date
);


--
-- Name: question_papers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.question_papers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: question_papers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.question_papers_id_seq OWNED BY public.question_papers.id;


--
-- Name: quotas; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.quotas (
    id integer NOT NULL,
    name character varying(100) NOT NULL
);


--
-- Name: quotas_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.quotas ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.quotas_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: refunds; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.refunds (
    id integer NOT NULL,
    student_fee_demand_mapping_id integer NOT NULL,
    fee_payment_id integer,
    request_no character varying(50) NOT NULL,
    reason character varying(255) NOT NULL,
    amount numeric(12,2) NOT NULL,
    status public.refund_status_enum DEFAULT 'pending'::public.refund_status_enum NOT NULL,
    requested_by_user_id integer,
    approved_by_user_id integer,
    settled_date date,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: refunds_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.refunds_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: refunds_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.refunds_id_seq OWNED BY public.refunds.id;


--
-- Name: regulation_courses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.regulation_courses (
    id integer NOT NULL,
    regulation_id integer NOT NULL,
    course_id integer NOT NULL
);


--
-- Name: regulation_courses_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.regulation_courses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: regulation_courses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.regulation_courses_id_seq OWNED BY public.regulation_courses.id;


--
-- Name: regulations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.regulations (
    id integer NOT NULL,
    code character varying(20) NOT NULL,
    applies_to_level character varying(5) NOT NULL,
    applies_to_description character varying(150) NOT NULL,
    intake_start_year smallint NOT NULL,
    intake_end_year smallint,
    grading_scale character varying(20) DEFAULT '10-point'::character varying NOT NULL,
    pass_aggregate_pct numeric(5,2),
    pass_external_pct numeric(5,2),
    attendance_threshold_pct numeric(5,2) DEFAULT 75.00 NOT NULL,
    moderation_ceiling_marks smallint DEFAULT 3 NOT NULL,
    moderation_ceiling_candidate_pct numeric(5,2) DEFAULT 5.00 NOT NULL,
    status public.regulation_status_enum DEFAULT 'draft'::public.regulation_status_enum NOT NULL,
    created_by_user_id integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: regulations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.regulations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: regulations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.regulations_id_seq OWNED BY public.regulations.id;


--
-- Name: result_publications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.result_publications (
    id integer NOT NULL,
    exam_id integer NOT NULL,
    publication_type public.publication_type_enum DEFAULT 'original'::public.publication_type_enum NOT NULL,
    published_by_user_id integer,
    published_at timestamp with time zone DEFAULT now() NOT NULL,
    state public.result_publication_state_enum DEFAULT 'live'::public.result_publication_state_enum NOT NULL,
    scheduled_release_at timestamp with time zone,
    channels character varying(100)
);


--
-- Name: result_publications_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.result_publications ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.result_publications_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: revaluation_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.revaluation_requests (
    id integer NOT NULL,
    exam_marks_id integer NOT NULL,
    student_id integer NOT NULL,
    status public.revaluation_status_enum DEFAULT 'requested'::public.revaluation_status_enum NOT NULL,
    revised_marks numeric(6,2),
    requested_at timestamp with time zone DEFAULT now() NOT NULL,
    resolved_at timestamp with time zone,
    subject_id integer,
    exam_id integer,
    remarks character varying(1000),
    evaluator_faculty_id integer,
    fee_amount numeric(8,2),
    fee_paid boolean DEFAULT false NOT NULL,
    request_kind public.revaluation_request_kind_enum DEFAULT 'revaluation'::public.revaluation_request_kind_enum NOT NULL
);


--
-- Name: revaluation_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.revaluation_requests ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.revaluation_requests_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: revaluation_windows; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.revaluation_windows (
    id integer NOT NULL,
    exam_id integer NOT NULL,
    application_type public.revaluation_application_type_enum DEFAULT 'reval_only'::public.revaluation_application_type_enum NOT NULL,
    is_open boolean DEFAULT false NOT NULL,
    opens_at timestamp(6) with time zone,
    closes_at timestamp(6) with time zone,
    fee_per_paper numeric(8,2) NOT NULL,
    photocopy_fee_per_paper numeric(8,2) NOT NULL,
    max_papers_per_student integer,
    created_by_user_id integer,
    created_at timestamp(6) with time zone DEFAULT now() NOT NULL
);


--
-- Name: revaluation_windows_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.revaluation_windows_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: revaluation_windows_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.revaluation_windows_id_seq OWNED BY public.revaluation_windows.id;


--
-- Name: roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    description character varying(255)
);


--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.roles ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.roles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: salary_divisions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.salary_divisions (
    id integer NOT NULL,
    faculty_id integer NOT NULL,
    division_name character varying(50) NOT NULL,
    amount numeric(12,2) NOT NULL,
    effective_from date NOT NULL
);


--
-- Name: salary_divisions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.salary_divisions ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.salary_divisions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: salary_payments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.salary_payments (
    id integer NOT NULL,
    payee_type public.payee_type_enum NOT NULL,
    faculty_id integer,
    staff_id integer,
    month smallint NOT NULL,
    year smallint NOT NULL,
    gross_amount numeric(12,2) NOT NULL,
    net_amount numeric(12,2) NOT NULL,
    paid_at timestamp with time zone,
    processed_by_user_id integer,
    status public.salary_payment_status_enum DEFAULT 'pending'::public.salary_payment_status_enum NOT NULL,
    deductions_amount numeric(12,2),
    lop_days smallint,
    lop_amount numeric(12,2),
    CONSTRAINT salary_payments_check CHECK ((((payee_type = 'faculty'::public.payee_type_enum) AND (faculty_id IS NOT NULL) AND (staff_id IS NULL)) OR ((payee_type = 'staff'::public.payee_type_enum) AND (staff_id IS NOT NULL) AND (faculty_id IS NULL))))
);


--
-- Name: salary_payments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.salary_payments ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.salary_payments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: scholarship_schemes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.scholarship_schemes (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    academic_year character varying(20) NOT NULL,
    status character varying(30) DEFAULT 'approved'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    scheme_type character varying(100),
    applied_count integer DEFAULT 0 NOT NULL,
    awarded_count integer DEFAULT 0 NOT NULL,
    total_value numeric(14,2) DEFAULT 0 NOT NULL
);


--
-- Name: scholarship_schemes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.scholarship_schemes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: scholarship_schemes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.scholarship_schemes_id_seq OWNED BY public.scholarship_schemes.id;


--
-- Name: script_archive_bundles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.script_archive_bundles (
    id integer NOT NULL,
    bundle_id integer NOT NULL,
    location_label character varying(50) NOT NULL,
    retention_until date NOT NULL,
    status public.script_archive_status_enum DEFAULT 'in_archive'::public.script_archive_status_enum NOT NULL,
    archived_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: script_archive_bundles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.script_archive_bundles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: script_archive_bundles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.script_archive_bundles_id_seq OWNED BY public.script_archive_bundles.id;


--
-- Name: script_bundle_marks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.script_bundle_marks (
    id integer NOT NULL,
    bundle_id integer NOT NULL,
    dummy_number integer NOT NULL,
    part_a_marks numeric(5,2),
    part_b_marks numeric(5,2),
    part_c_marks numeric(5,2),
    total_marks numeric(5,2),
    is_absent boolean DEFAULT false NOT NULL,
    entered_at timestamp with time zone
);


--
-- Name: script_bundle_marks_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.script_bundle_marks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: script_bundle_marks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.script_bundle_marks_id_seq OWNED BY public.script_bundle_marks.id;


--
-- Name: script_bundle_scripts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.script_bundle_scripts (
    id integer NOT NULL,
    bundle_id integer NOT NULL,
    dummy_number integer NOT NULL,
    student_id integer NOT NULL
);


--
-- Name: script_bundle_scripts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.script_bundle_scripts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: script_bundle_scripts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.script_bundle_scripts_id_seq OWNED BY public.script_bundle_scripts.id;


--
-- Name: script_bundles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.script_bundles (
    id integer NOT NULL,
    bundle_code character varying(30) NOT NULL,
    exam_subject_mapping_id integer NOT NULL,
    valuator_faculty_id integer,
    dummy_range_start integer NOT NULL,
    dummy_range_end integer NOT NULL,
    scripts_count integer DEFAULT 0 NOT NULL,
    status public.script_bundle_status_enum DEFAULT 'allotted'::public.script_bundle_status_enum NOT NULL,
    is_second_valuation boolean DEFAULT false NOT NULL,
    expected_return_at timestamp with time zone,
    allotted_at timestamp with time zone DEFAULT now() NOT NULL,
    submitted_at timestamp with time zone
);


--
-- Name: script_bundles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.script_bundles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: script_bundles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.script_bundles_id_seq OWNED BY public.script_bundles.id;


--
-- Name: script_retrieval_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.script_retrieval_requests (
    id integer NOT NULL,
    archive_bundle_id integer NOT NULL,
    requested_by_user_id integer NOT NULL,
    purpose character varying(150) NOT NULL,
    issued_to character varying(150),
    requested_at timestamp with time zone DEFAULT now() NOT NULL,
    returned_at timestamp with time zone
);


--
-- Name: script_retrieval_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.script_retrieval_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: script_retrieval_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.script_retrieval_requests_id_seq OWNED BY public.script_retrieval_requests.id;


--
-- Name: seating_arrangements; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.seating_arrangements (
    id integer NOT NULL,
    hall_plan_id integer NOT NULL,
    student_id integer NOT NULL,
    seat_number character varying(20) NOT NULL,
    version_id integer,
    is_special_accommodation boolean DEFAULT false NOT NULL
);


--
-- Name: seating_arrangements_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.seating_arrangements ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.seating_arrangements_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: seating_plan_venue_departments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.seating_plan_venue_departments (
    id integer NOT NULL,
    version_venue_id integer NOT NULL,
    department_id integer NOT NULL
);


--
-- Name: seating_plan_venue_departments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.seating_plan_venue_departments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: seating_plan_venue_departments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.seating_plan_venue_departments_id_seq OWNED BY public.seating_plan_venue_departments.id;


--
-- Name: seating_plan_version_venues; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.seating_plan_version_venues (
    id integer NOT NULL,
    version_id integer NOT NULL,
    venue_id integer NOT NULL,
    hall_plan_id integer,
    allocation_mode public.seating_allocation_mode_enum DEFAULT 'automatic'::public.seating_allocation_mode_enum NOT NULL,
    pattern public.seating_pattern_enum
);


--
-- Name: seating_plan_version_venues_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.seating_plan_version_venues_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: seating_plan_version_venues_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.seating_plan_version_venues_id_seq OWNED BY public.seating_plan_version_venues.id;


--
-- Name: seating_plan_versions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.seating_plan_versions (
    id integer NOT NULL,
    exam_id integer NOT NULL,
    exam_date date NOT NULL,
    session public.exam_session_enum NOT NULL,
    version_number integer NOT NULL,
    status public.timetable_version_status_enum DEFAULT 'draft'::public.timetable_version_status_enum NOT NULL,
    signature character varying(64),
    created_by_user_id integer,
    created_at timestamp(6) with time zone DEFAULT now() NOT NULL,
    published_by_user_id integer,
    published_at timestamp(6) with time zone,
    withdrawn_at timestamp(6) with time zone
);


--
-- Name: seating_plan_versions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.seating_plan_versions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: seating_plan_versions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.seating_plan_versions_id_seq OWNED BY public.seating_plan_versions.id;


--
-- Name: secretary_product_request_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.secretary_product_request_items (
    id integer NOT NULL,
    request_id integer NOT NULL,
    product_name character varying(255) NOT NULL,
    quantity integer NOT NULL,
    purpose character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT secretary_product_request_items_quantity_check CHECK ((quantity > 0))
);


--
-- Name: secretary_product_request_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.secretary_product_request_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: secretary_product_request_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.secretary_product_request_items_id_seq OWNED BY public.secretary_product_request_items.id;


--
-- Name: secretary_product_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.secretary_product_requests (
    id integer NOT NULL,
    requested_by_user_id integer NOT NULL,
    title character varying(255) NOT NULL,
    justification character varying(1000),
    status public.secretary_request_status_enum DEFAULT 'draft'::public.secretary_request_status_enum NOT NULL,
    reviewed_by_user_id integer,
    reviewed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: secretary_product_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.secretary_product_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: secretary_product_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.secretary_product_requests_id_seq OWNED BY public.secretary_product_requests.id;


--
-- Name: secretary_service_request_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.secretary_service_request_items (
    id integer NOT NULL,
    request_id integer NOT NULL,
    service_name character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: secretary_service_request_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.secretary_service_request_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: secretary_service_request_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.secretary_service_request_items_id_seq OWNED BY public.secretary_service_request_items.id;


--
-- Name: secretary_service_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.secretary_service_requests (
    id integer NOT NULL,
    requested_by_user_id integer NOT NULL,
    title character varying(255) NOT NULL,
    justification character varying(1000),
    status public.secretary_request_status_enum DEFAULT 'draft'::public.secretary_request_status_enum NOT NULL,
    reviewed_by_user_id integer,
    reviewed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: secretary_service_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.secretary_service_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: secretary_service_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.secretary_service_requests_id_seq OWNED BY public.secretary_service_requests.id;


--
-- Name: service_indents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.service_indents (
    id integer NOT NULL,
    requested_by_user_id integer NOT NULL,
    department_id integer NOT NULL,
    service_description text NOT NULL,
    status public.indent_status_enum DEFAULT 'submitted'::public.indent_status_enum NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    title character varying(255),
    needed_by date,
    quantity character varying(100),
    location character varying(255),
    hod_remarks text,
    hod_reviewed_by integer,
    hod_reviewed_at timestamp with time zone,
    ref character varying(40),
    category character varying(50),
    priority character varying(10)
);


--
-- Name: service_indents_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.service_indents ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.service_indents_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: service_order_proposals; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.service_order_proposals (
    id integer NOT NULL,
    indent_id integer NOT NULL,
    vendor_id integer,
    finance_reviewed_by integer,
    finance_reviewed_at timestamp with time zone,
    hod_reviewed_by integer,
    hod_reviewed_at timestamp with time zone,
    status public.proposal_status_enum DEFAULT 'pending'::public.proposal_status_enum NOT NULL,
    hod_remarks text,
    finance_remarks text,
    principal_reviewed_by integer,
    principal_reviewed_at timestamp with time zone
);


--
-- Name: service_order_proposals_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.service_order_proposals ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.service_order_proposals_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: service_orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.service_orders (
    id integer NOT NULL,
    proposal_id integer NOT NULL,
    so_number character varying(50) NOT NULL,
    approved_by_user_id integer,
    approved_at timestamp with time zone,
    file_url character varying(500),
    sent_to_vendor_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: service_orders_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.service_orders ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.service_orders_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: sick_room_beds; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sick_room_beds (
    id integer NOT NULL,
    bed_code character varying(10) NOT NULL,
    wing character varying(10) NOT NULL,
    CONSTRAINT sick_room_beds_wing_check CHECK (((wing)::text = ANY ((ARRAY['ladies'::character varying, 'gents'::character varying])::text[])))
);


--
-- Name: sick_room_beds_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sick_room_beds_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sick_room_beds_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sick_room_beds_id_seq OWNED BY public.sick_room_beds.id;


--
-- Name: sick_room_stays; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sick_room_stays (
    id integer NOT NULL,
    bed_id integer NOT NULL,
    visit_id integer,
    reason character varying(255),
    vitals character varying(255),
    medication_given character varying(255),
    guardian_contacted boolean DEFAULT false NOT NULL,
    plan character varying(255),
    admitted_at timestamp with time zone DEFAULT now() NOT NULL,
    expected_review_at timestamp with time zone,
    discharged_at timestamp with time zone
);


--
-- Name: sick_room_stays_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sick_room_stays_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sick_room_stays_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sick_room_stays_id_seq OWNED BY public.sick_room_stays.id;


--
-- Name: soa_applications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.soa_applications (
    id integer NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100),
    father_name character varying(150),
    mother_name character varying(150),
    parent_contact character varying(20),
    student_contact character varying(20),
    student_whatsapp character varying(20),
    student_email public.citext,
    cutoff_physics numeric(5,2),
    cutoff_chemistry numeric(5,2),
    cutoff_maths numeric(5,2),
    community character varying(50),
    status public.soa_status_enum DEFAULT 'applied'::public.soa_status_enum NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: soa_applications_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.soa_applications ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.soa_applications_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: social_post_details; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.social_post_details (
    announcement_id integer NOT NULL,
    format character varying(30),
    link_url text,
    expires_at timestamp with time zone,
    is_pinned boolean,
    allow_comments boolean,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: sports_achievements; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sports_achievements (
    id integer NOT NULL,
    team_id integer,
    event_name character varying(255) NOT NULL,
    participant_name character varying(255),
    result character varying(50) NOT NULL,
    achievement_date date NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    athlete_student_id integer,
    level character varying(50),
    venue character varying(255),
    certificate_url character varying(500)
);


--
-- Name: sports_achievements_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sports_achievements_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sports_achievements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sports_achievements_id_seq OWNED BY public.sports_achievements.id;


--
-- Name: sports_announcements; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sports_announcements (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    content text NOT NULL,
    category public.sports_announcement_cat_enum DEFAULT 'general'::public.sports_announcement_cat_enum NOT NULL,
    posted_by_user_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: sports_announcements_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sports_announcements_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sports_announcements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sports_announcements_id_seq OWNED BY public.sports_announcements.id;


--
-- Name: sports_athlete_profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sports_athlete_profiles (
    id integer NOT NULL,
    student_id integer NOT NULL,
    primary_discipline_id integer,
    status public.sports_athlete_status_enum DEFAULT 'active'::public.sports_athlete_status_enum NOT NULL,
    registered_academic_year character varying(20),
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: sports_athlete_profiles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sports_athlete_profiles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sports_athlete_profiles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sports_athlete_profiles_id_seq OWNED BY public.sports_athlete_profiles.id;


--
-- Name: sports_budget_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sports_budget_requests (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description character varying(500),
    amount numeric(12,2) NOT NULL,
    budget_allocation_id integer,
    raised_by_user_id integer NOT NULL,
    status public.approval_status_enum DEFAULT 'pending'::public.approval_status_enum NOT NULL,
    reviewed_by_user_id integer,
    reviewed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: sports_budget_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sports_budget_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sports_budget_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sports_budget_requests_id_seq OWNED BY public.sports_budget_requests.id;


--
-- Name: sports_calendar_notes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sports_calendar_notes (
    id integer NOT NULL,
    title character varying(200) NOT NULL,
    category character varying(30) NOT NULL,
    event_date date NOT NULL,
    created_by_user_id integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: sports_calendar_notes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sports_calendar_notes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sports_calendar_notes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sports_calendar_notes_id_seq OWNED BY public.sports_calendar_notes.id;


--
-- Name: sports_coach_profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sports_coach_profiles (
    id integer NOT NULL,
    faculty_id integer NOT NULL,
    discipline_id integer,
    coaching_experience_years integer,
    duty_status public.sports_coach_duty_status_enum DEFAULT 'on_duty'::public.sports_coach_duty_status_enum NOT NULL,
    certifications text[] DEFAULT '{}'::text[] NOT NULL,
    responsibilities text[] DEFAULT '{}'::text[] NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: sports_coach_profiles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sports_coach_profiles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sports_coach_profiles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sports_coach_profiles_id_seq OWNED BY public.sports_coach_profiles.id;


--
-- Name: sports_disciplines; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sports_disciplines (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    head_coach_faculty_id integer,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: sports_disciplines_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sports_disciplines_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sports_disciplines_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sports_disciplines_id_seq OWNED BY public.sports_disciplines.id;


--
-- Name: sports_equipment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sports_equipment (
    id integer NOT NULL,
    name character varying(150) NOT NULL,
    category character varying(100),
    total_quantity integer DEFAULT 1 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    status public.sports_equipment_status_enum DEFAULT 'available'::public.sports_equipment_status_enum NOT NULL,
    facility_id integer,
    reorder_level integer
);


--
-- Name: sports_equipment_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sports_equipment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sports_equipment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sports_equipment_id_seq OWNED BY public.sports_equipment.id;


--
-- Name: sports_equipment_issues; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sports_equipment_issues (
    id integer NOT NULL,
    equipment_id integer NOT NULL,
    issued_to_type public.borrower_type_enum NOT NULL,
    student_id integer,
    faculty_id integer,
    issued_date date DEFAULT CURRENT_DATE NOT NULL,
    returned_date date,
    status public.borrow_status_enum DEFAULT 'borrowed'::public.borrow_status_enum NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    due_date date,
    remarks character varying(255)
);


--
-- Name: sports_equipment_issues_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sports_equipment_issues_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sports_equipment_issues_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sports_equipment_issues_id_seq OWNED BY public.sports_equipment_issues.id;


--
-- Name: sports_facilities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sports_facilities (
    id integer NOT NULL,
    name character varying(150) NOT NULL,
    location character varying(255),
    facility_type public.sports_facility_type_enum DEFAULT 'other'::public.sports_facility_type_enum NOT NULL,
    capacity integer,
    status public.sports_facility_status_enum DEFAULT 'available'::public.sports_facility_status_enum NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: sports_facilities_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sports_facilities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sports_facilities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sports_facilities_id_seq OWNED BY public.sports_facilities.id;


--
-- Name: sports_fitness_tests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sports_fitness_tests (
    id integer NOT NULL,
    student_id integer NOT NULL,
    test_name character varying(100) NOT NULL,
    score character varying(50),
    test_date date NOT NULL,
    status public.sports_fitness_status_enum DEFAULT 'fit'::public.sports_fitness_status_enum NOT NULL,
    notes character varying(255),
    recorded_by_staff_id integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: sports_fitness_tests_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sports_fitness_tests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sports_fitness_tests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sports_fitness_tests_id_seq OWNED BY public.sports_fitness_tests.id;


--
-- Name: sports_fixtures; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sports_fixtures (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    discipline_id integer,
    team_id integer,
    opponent character varying(150),
    facility_id integer,
    is_home boolean DEFAULT true NOT NULL,
    fixture_date date NOT NULL,
    fixture_time time without time zone,
    status public.sports_team_status_enum DEFAULT 'pending'::public.sports_team_status_enum NOT NULL,
    result character varying(100),
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: sports_fixtures_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sports_fixtures_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sports_fixtures_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sports_fixtures_id_seq OWNED BY public.sports_fixtures.id;


--
-- Name: sports_injuries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sports_injuries (
    id integer NOT NULL,
    incident_type public.sports_incident_type_enum DEFAULT 'injury'::public.sports_incident_type_enum NOT NULL,
    student_id integer,
    facility_id integer,
    discipline_id integer,
    incident character varying(255) NOT NULL,
    incident_date date NOT NULL,
    care_notes character varying(255),
    status public.sports_injury_status_enum DEFAULT 'open'::public.sports_injury_status_enum NOT NULL,
    return_to_play_date date,
    medical_visit_id integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: sports_injuries_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sports_injuries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sports_injuries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sports_injuries_id_seq OWNED BY public.sports_injuries.id;


--
-- Name: sports_od_hod_approvals; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sports_od_hod_approvals (
    id integer NOT NULL,
    od_request_id integer NOT NULL,
    department_id integer NOT NULL,
    hod_user_id integer,
    status public.approval_status_enum DEFAULT 'pending'::public.approval_status_enum NOT NULL,
    reviewed_by_user_id integer,
    reviewed_at timestamp with time zone,
    remarks text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: TABLE sports_od_hod_approvals; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.sports_od_hod_approvals IS 'One approval row per department represented in a sports OD squad. The HoD of that department is the approver; sports_od_requests.status is the roll-up.';


--
-- Name: sports_od_hod_approvals_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sports_od_hod_approvals_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sports_od_hod_approvals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sports_od_hod_approvals_id_seq OWNED BY public.sports_od_hod_approvals.id;


--
-- Name: sports_od_letter_numbers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sports_od_letter_numbers (
    id integer NOT NULL,
    student_id integer NOT NULL,
    issued_by_user_id integer,
    issued_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: TABLE sports_od_letter_numbers; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.sports_od_letter_numbers IS 'One row per printed sports OD letter, purely for the sequential reference number (id) shown on it. Letter content is composed on demand, never stored here.';


--
-- Name: sports_od_letter_numbers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sports_od_letter_numbers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sports_od_letter_numbers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sports_od_letter_numbers_id_seq OWNED BY public.sports_od_letter_numbers.id;


--
-- Name: sports_od_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sports_od_requests (
    id integer NOT NULL,
    od_type character varying(100) NOT NULL,
    periods_affected character varying(50),
    from_date date NOT NULL,
    to_date date NOT NULL,
    event character varying(255) NOT NULL,
    venue character varying(255),
    level character varying(50),
    accompanying_coach_faculty_id integer,
    transport character varying(100),
    remarks text,
    requested_by_user_id integer NOT NULL,
    status public.approval_status_enum DEFAULT 'pending'::public.approval_status_enum NOT NULL,
    reviewed_by_user_id integer,
    reviewed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: sports_od_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sports_od_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sports_od_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sports_od_requests_id_seq OWNED BY public.sports_od_requests.id;


--
-- Name: sports_od_squad_members; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sports_od_squad_members (
    id integer NOT NULL,
    od_request_id integer NOT NULL,
    student_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: sports_od_squad_members_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sports_od_squad_members_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sports_od_squad_members_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sports_od_squad_members_id_seq OWNED BY public.sports_od_squad_members.id;


--
-- Name: sports_reports; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sports_reports (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    period_label character varying(100),
    status public.sports_report_status_enum DEFAULT 'open'::public.sports_report_status_enum NOT NULL,
    created_by_user_id integer,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: sports_reports_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sports_reports_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sports_reports_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sports_reports_id_seq OWNED BY public.sports_reports.id;


--
-- Name: sports_session_attendance; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sports_session_attendance (
    id integer NOT NULL,
    session_id integer NOT NULL,
    student_id integer NOT NULL,
    status public.attendance_status_enum NOT NULL,
    marked_by_user_id integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: sports_session_attendance_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sports_session_attendance_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sports_session_attendance_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sports_session_attendance_id_seq OWNED BY public.sports_session_attendance.id;


--
-- Name: sports_teams; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sports_teams (
    id integer NOT NULL,
    name character varying(150) NOT NULL,
    coach_name character varying(150),
    department_id integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    coach_phone character varying(20),
    coach_role character varying(100),
    discipline_id integer,
    coach_faculty_id integer,
    category character varying(150),
    captain_student_id integer,
    vice_captain_student_id integer,
    manager_name character varying(150),
    facility_id integer,
    practice_schedule character varying(150),
    formed_date date,
    played integer DEFAULT 0 NOT NULL,
    won integer DEFAULT 0 NOT NULL,
    lost integer DEFAULT 0 NOT NULL,
    drawn integer DEFAULT 0 NOT NULL,
    status public.sports_team_status_enum DEFAULT 'pending'::public.sports_team_status_enum NOT NULL
);


--
-- Name: sports_teams_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sports_teams_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sports_teams_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sports_teams_id_seq OWNED BY public.sports_teams.id;


--
-- Name: sports_training_sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sports_training_sessions (
    id integer NOT NULL,
    discipline_id integer NOT NULL,
    facility_id integer,
    coach_faculty_id integer,
    session_date date NOT NULL,
    start_time time without time zone,
    end_time time without time zone,
    status public.sports_session_status_enum DEFAULT 'confirmed'::public.sports_session_status_enum NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: sports_training_sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sports_training_sessions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sports_training_sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sports_training_sessions_id_seq OWNED BY public.sports_training_sessions.id;


--
-- Name: sports_trial_scores; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sports_trial_scores (
    id integer NOT NULL,
    trial_id integer NOT NULL,
    criterion character varying(100) NOT NULL,
    score character varying(50) NOT NULL,
    sort_order smallint DEFAULT 0 NOT NULL
);


--
-- Name: sports_trial_scores_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sports_trial_scores_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sports_trial_scores_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sports_trial_scores_id_seq OWNED BY public.sports_trial_scores.id;


--
-- Name: sports_trials; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sports_trials (
    id integer NOT NULL,
    student_id integer NOT NULL,
    discipline_id integer NOT NULL,
    target_team_id integer,
    round_label character varying(50),
    trial_at timestamp with time zone NOT NULL,
    facility_id integer,
    panel character varying(255),
    status public.sports_trial_status_enum DEFAULT 'pending'::public.sports_trial_status_enum NOT NULL,
    recommendation character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: sports_trials_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sports_trials_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sports_trials_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sports_trials_id_seq OWNED BY public.sports_trials.id;


--
-- Name: startup_ideas; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.startup_ideas (
    id integer NOT NULL,
    student_id integer NOT NULL,
    title character varying(200) NOT NULL,
    category character varying(100),
    problem_statement text,
    solution text,
    target_customers character varying(255),
    market_size character varying(255),
    competitors character varying(255),
    team_note character varying(150),
    budget_needed numeric(12,2),
    feasibility_score smallint,
    feasibility_confidence character varying(10),
    attachments_note character varying(255),
    mentor_faculty_id integer,
    review_status character varying(20) DEFAULT 'Under Review'::character varying NOT NULL,
    reviewer_user_id integer,
    reviewer_note text,
    conversion_note character varying(255),
    converted_venture_id integer,
    target_milestone character varying(255),
    submitted_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT startup_ideas_feasibility_confidence_check CHECK (((feasibility_confidence)::text = ANY ((ARRAY['Low'::character varying, 'Medium'::character varying, 'High'::character varying])::text[]))),
    CONSTRAINT startup_ideas_feasibility_score_check CHECK (((feasibility_score >= 0) AND (feasibility_score <= 10))),
    CONSTRAINT startup_ideas_review_status_check CHECK (((review_status)::text = ANY ((ARRAY['Under Review'::character varying, 'Selected'::character varying, 'Approved'::character varying, 'Rejected'::character varying])::text[])))
);


--
-- Name: startup_ideas_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.startup_ideas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: startup_ideas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.startup_ideas_id_seq OWNED BY public.startup_ideas.id;


--
-- Name: stationary_finishing_rates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.stationary_finishing_rates (
    id integer NOT NULL,
    item_name character varying(100) NOT NULL,
    note character varying(150),
    price numeric(10,2) NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp(3) without time zone DEFAULT now() NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT now() NOT NULL
);


--
-- Name: stationary_finishing_rates_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.stationary_finishing_rates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: stationary_finishing_rates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.stationary_finishing_rates_id_seq OWNED BY public.stationary_finishing_rates.id;


--
-- Name: stationary_machines; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.stationary_machines (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    model character varying(150) NOT NULL,
    category character varying(20) DEFAULT 'printer'::character varying NOT NULL,
    status character varying(20) DEFAULT 'working'::character varying NOT NULL,
    note character varying(300),
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp(3) without time zone DEFAULT now() NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT now() NOT NULL
);


--
-- Name: stationary_machines_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.stationary_machines_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: stationary_machines_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.stationary_machines_id_seq OWNED BY public.stationary_machines.id;


--
-- Name: stationary_print_rates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.stationary_print_rates (
    id integer NOT NULL,
    service character varying(100) NOT NULL,
    paper_size character varying(20) NOT NULL,
    bw_price numeric(10,2) NOT NULL,
    bw_unit character varying(20) NOT NULL,
    colour_price numeric(10,2) NOT NULL,
    colour_unit character varying(20) NOT NULL,
    bulk_price numeric(10,2) NOT NULL,
    bulk_unit character varying(20) NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp(3) without time zone DEFAULT now() NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT now() NOT NULL
);


--
-- Name: stationary_print_rates_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.stationary_print_rates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: stationary_print_rates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.stationary_print_rates_id_seq OWNED BY public.stationary_print_rates.id;


--
-- Name: stationary_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.stationary_requests (
    id integer NOT NULL,
    user_id integer,
    file_name character varying(255),
    copies integer NOT NULL,
    orientation public.stationary_orientation_enum NOT NULL,
    color_mode public.stationary_color_mode_enum NOT NULL,
    pages public.stationary_pages_enum NOT NULL,
    amount numeric(10,2) NOT NULL,
    status public.stationary_request_status_enum DEFAULT 'pending_payment'::public.stationary_request_status_enum NOT NULL,
    razorpay_order_id character varying(100),
    razorpay_payment_id character varying(100),
    razorpay_signature character varying(255),
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    total_pages integer,
    binding character varying(20),
    paper_size character varying(10),
    sides character varying(20),
    rejection_reason character varying(300),
    walkin_requester_name character varying(150),
    walkin_department character varying(150),
    specification character varying(150),
    payment_mode character varying(30),
    CONSTRAINT stationary_requests_binding_check CHECK (((binding)::text = ANY ((ARRAY['No binding'::character varying, 'Spiral binding'::character varying, 'Calico binding'::character varying])::text[]))),
    CONSTRAINT stationary_requests_requester_check CHECK (((user_id IS NOT NULL) OR (walkin_requester_name IS NOT NULL)))
);


--
-- Name: stationary_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.stationary_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: stationary_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.stationary_requests_id_seq OWNED BY public.stationary_requests.id;


--
-- Name: stationary_stock_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.stationary_stock_items (
    id integer NOT NULL,
    item_name character varying(150) NOT NULL,
    unit character varying(50) NOT NULL,
    quantity_left integer DEFAULT 0 NOT NULL,
    full_stock_quantity integer NOT NULL,
    low_stock_threshold integer DEFAULT 0 NOT NULL,
    created_at timestamp(3) without time zone DEFAULT now() NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT now() NOT NULL
);


--
-- Name: stationary_stock_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.stationary_stock_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: stationary_stock_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.stationary_stock_items_id_seq OWNED BY public.stationary_stock_items.id;


--
-- Name: stationery_order_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.stationery_order_items (
    id integer NOT NULL,
    order_id integer NOT NULL,
    product_id integer NOT NULL,
    product_name character varying(150) NOT NULL,
    unit_price numeric(10,2) NOT NULL,
    quantity integer NOT NULL,
    subtotal numeric(10,2) NOT NULL,
    CONSTRAINT stationery_order_items_quantity_check CHECK ((quantity > 0)),
    CONSTRAINT stationery_order_items_unit_price_check CHECK ((unit_price >= (0)::numeric))
);


--
-- Name: stationery_order_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.stationery_order_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: stationery_order_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.stationery_order_items_id_seq OWNED BY public.stationery_order_items.id;


--
-- Name: stationery_orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.stationery_orders (
    id integer NOT NULL,
    user_id integer NOT NULL,
    status public.stationery_order_status_enum DEFAULT 'pending'::public.stationery_order_status_enum NOT NULL,
    subtotal numeric(10,2) NOT NULL,
    gst_amount numeric(10,2) NOT NULL,
    total_amount numeric(10,2) NOT NULL,
    payment_method public.stationery_payment_method_enum NOT NULL,
    payment_status public.stationery_payment_status_enum DEFAULT 'pending'::public.stationery_payment_status_enum NOT NULL,
    pickup_token character varying(20),
    razorpay_order_id character varying(100),
    razorpay_payment_id character varying(100),
    razorpay_signature character varying(255),
    wallet_transaction_id integer,
    cancel_reason character varying(255),
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    confirmed_at timestamp(6) with time zone,
    ready_at timestamp(6) with time zone,
    collected_at timestamp(6) with time zone,
    cancelled_at timestamp(6) with time zone,
    CONSTRAINT stationery_orders_gst_amount_check CHECK ((gst_amount >= (0)::numeric)),
    CONSTRAINT stationery_orders_subtotal_check CHECK ((subtotal >= (0)::numeric)),
    CONSTRAINT stationery_orders_total_amount_check CHECK ((total_amount >= (0)::numeric))
);


--
-- Name: stationery_orders_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.stationery_orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: stationery_orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.stationery_orders_id_seq OWNED BY public.stationery_orders.id;


--
-- Name: stationery_products; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.stationery_products (
    id integer NOT NULL,
    category public.stationery_category_enum NOT NULL,
    name character varying(150) NOT NULL,
    description character varying(500),
    specs text[] DEFAULT '{}'::text[] NOT NULL,
    price numeric(10,2) NOT NULL,
    original_price numeric(10,2),
    stock_quantity integer DEFAULT 0 NOT NULL,
    image_url character varying(500),
    is_active boolean DEFAULT true NOT NULL,
    created_by_user_id integer,
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    low_stock_threshold integer DEFAULT 10 NOT NULL,
    CONSTRAINT stationery_products_original_price_check CHECK (((original_price IS NULL) OR (original_price > price))),
    CONSTRAINT stationery_products_price_check CHECK ((price >= (0)::numeric)),
    CONSTRAINT stationery_products_stock_check CHECK ((stock_quantity >= 0))
);


--
-- Name: stationery_products_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.stationery_products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: stationery_products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.stationery_products_id_seq OWNED BY public.stationery_products.id;


--
-- Name: student_addresses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student_addresses (
    id integer NOT NULL,
    student_id integer NOT NULL,
    address_type public.address_type_enum NOT NULL,
    address_line character varying(500),
    city character varying(100),
    state character varying(100),
    pincode character varying(15),
    district character varying(100)
);


--
-- Name: student_addresses_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.student_addresses ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.student_addresses_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: student_assignment_status; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student_assignment_status (
    id integer NOT NULL,
    assignment_id integer NOT NULL,
    student_id integer NOT NULL,
    is_submitted boolean DEFAULT false NOT NULL,
    marked_by_faculty_id integer,
    marked_at timestamp with time zone,
    submission_file_url character varying(500),
    submitted_at timestamp with time zone,
    marks_obtained integer
);


--
-- Name: student_assignment_status_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.student_assignment_status ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.student_assignment_status_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: student_certificates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student_certificates (
    id integer NOT NULL,
    student_id integer NOT NULL,
    certificate_type_id integer,
    is_available boolean DEFAULT false NOT NULL,
    file_url character varying(500),
    verified_at timestamp with time zone,
    platform character varying(100),
    track character varying(255),
    score character varying(20),
    completed_on date,
    status character varying(30) DEFAULT 'enrolled'::character varying NOT NULL
);


--
-- Name: student_certificates_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.student_certificates ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.student_certificates_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: student_certifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student_certifications (
    id integer NOT NULL,
    student_id integer NOT NULL,
    platform character varying(100) NOT NULL,
    track character varying(255) NOT NULL,
    score character varying(20),
    completed_on date,
    status character varying(30) DEFAULT 'enrolled'::character varying NOT NULL,
    certificate_url character varying(500),
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: student_certifications_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.student_certifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: student_certifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.student_certifications_id_seq OWNED BY public.student_certifications.id;


--
-- Name: student_competitions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student_competitions (
    id integer NOT NULL,
    student_id integer NOT NULL,
    event_name character varying(255) NOT NULL,
    category character varying(100),
    level character varying(50),
    held_on date,
    result character varying(50),
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: student_competitions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.student_competitions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: student_competitions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.student_competitions_id_seq OWNED BY public.student_competitions.id;


--
-- Name: student_contacts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student_contacts (
    id integer NOT NULL,
    student_id integer NOT NULL,
    student_email1 public.citext,
    student_email2 public.citext,
    student_mobile character varying(20)
);


--
-- Name: student_contacts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.student_contacts ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.student_contacts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: student_drive_applications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student_drive_applications (
    id integer NOT NULL,
    drive_id integer NOT NULL,
    student_id integer NOT NULL,
    status public.drive_application_status_enum DEFAULT 'applied'::public.drive_application_status_enum NOT NULL,
    updated_by_user_id integer,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    last_cleared_round smallint,
    offer_response character varying(20),
    offered_package numeric(6,2)
);


--
-- Name: student_drive_applications_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.student_drive_applications ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.student_drive_applications_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: student_entrepreneurship; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student_entrepreneurship (
    id integer NOT NULL,
    student_id integer NOT NULL,
    business_name character varying(255) NOT NULL,
    business_description text,
    sector character varying(150),
    stage character varying(50),
    funding_required numeric(12,2),
    remarks text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    registration_type public.venture_registration_type_enum,
    is_incubated boolean DEFAULT false,
    role character varying(50),
    year_started smallint,
    current_status_note character varying(255),
    business_category character varying(150),
    problem_statement text,
    location character varying(150),
    business_model character varying(150),
    target_customers character varying(255),
    website character varying(255),
    linkedin_url character varying(255),
    co_founders character varying(255),
    team_size smallint,
    student_team_note character varying(255),
    mentor_faculty_id integer,
    external_mentor_name character varying(150),
    external_mentor_org character varying(150),
    team_roles_note character varying(255),
    idea_developed boolean,
    prototype_developed boolean,
    mvp_launched boolean,
    product_launched boolean,
    customers_count integer,
    monthly_revenue numeric(12,2),
    growth_stage character varying(100),
    funding_status character varying(50),
    funding_received numeric(12,2),
    funding_source character varying(150),
    govt_grant_scheme character varying(150),
    incubator_support character varying(255),
    accelerator_support character varying(255),
    venture_logo_url character varying(500)
);


--
-- Name: student_entrepreneurship_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.student_entrepreneurship_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: student_entrepreneurship_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.student_entrepreneurship_id_seq OWNED BY public.student_entrepreneurship.id;


--
-- Name: student_escalations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student_escalations (
    id integer NOT NULL,
    student_id integer,
    class_id integer,
    title character varying(255) NOT NULL,
    status character varying(30) DEFAULT 'open'::character varying NOT NULL,
    owner_user_id integer,
    raised_at timestamp with time zone DEFAULT now() NOT NULL,
    notes text
);


--
-- Name: student_escalations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.student_escalations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: student_escalations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.student_escalations_id_seq OWNED BY public.student_escalations.id;


--
-- Name: student_family_details; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student_family_details (
    id integer NOT NULL,
    student_id integer NOT NULL,
    father_name character varying(150),
    father_qualification character varying(150),
    father_occupation character varying(150),
    father_annual_income numeric(12,2),
    father_email public.citext,
    father_mobile character varying(20),
    mother_name character varying(150),
    mother_qualification character varying(150),
    mother_occupation character varying(150),
    mother_annual_income numeric(12,2),
    mother_email public.citext,
    mother_mobile character varying(20),
    father_photo_url character varying(500),
    mother_photo_url character varying(500),
    guardian_name character varying(150),
    guardian_relationship character varying(50),
    guardian_phone character varying(20),
    guardian_email public.citext
);


--
-- Name: student_family_details_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.student_family_details ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.student_family_details_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: student_fee_demand_mapping; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student_fee_demand_mapping (
    id integer NOT NULL,
    student_id integer NOT NULL,
    fee_structure_id integer NOT NULL,
    academic_year character varying(20) NOT NULL,
    semester smallint,
    total_amount numeric(12,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    demand_category integer
);


--
-- Name: student_fee_demand_mapping_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.student_fee_demand_mapping ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.student_fee_demand_mapping_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: student_hackathon_participations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student_hackathon_participations (
    id integer NOT NULL,
    student_id integer NOT NULL,
    hackathon_name character varying(255) NOT NULL,
    team_name character varying(100),
    host character varying(255),
    held_on date,
    outcome character varying(50),
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: student_hackathon_participations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.student_hackathon_participations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: student_hackathon_participations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.student_hackathon_participations_id_seq OWNED BY public.student_hackathon_participations.id;


--
-- Name: student_health_records; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student_health_records (
    id integer NOT NULL,
    student_id integer NOT NULL,
    blood_group character varying(5),
    allergies character varying(255),
    chronic_condition character varying(255),
    guardian_name character varying(150),
    guardian_phone character varying(20),
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: student_health_records_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.student_health_records_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: student_health_records_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.student_health_records_id_seq OWNED BY public.student_health_records.id;


--
-- Name: student_higher_education; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student_higher_education (
    id integer NOT NULL,
    student_id integer NOT NULL,
    preferred_course character varying(255) NOT NULL,
    preferred_country character varying(100) NOT NULL,
    preferred_university character varying(255),
    remarks text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    is_scholarship boolean DEFAULT false,
    scholarship_name character varying(150),
    admission_status public.higher_education_admission_status_enum,
    scholarship_value numeric(12,2),
    intake_term character varying(50),
    sop_status character varying(50),
    recommendation_status character varying(150),
    research_output character varying(255),
    internship_details character varying(255),
    visa_status public.higher_education_visa_status_enum,
    application_submitted_date date,
    interview_date date,
    offer_status public.higher_education_offer_status_enum,
    funding_source character varying(150),
    cgpa numeric(4,2),
    percentage numeric(5,2),
    test_scores_summary character varying(255)
);


--
-- Name: student_higher_education_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.student_higher_education_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: student_higher_education_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.student_higher_education_id_seq OWNED BY public.student_higher_education.id;


--
-- Name: student_hostel_mapping; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student_hostel_mapping (
    id integer NOT NULL,
    student_id integer NOT NULL,
    room_id integer NOT NULL,
    fee_structure_id integer,
    allocated_date date DEFAULT CURRENT_DATE NOT NULL
);


--
-- Name: student_hostel_mapping_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.student_hostel_mapping ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.student_hostel_mapping_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: student_id_card_issuances; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student_id_card_issuances (
    id integer NOT NULL,
    student_id integer NOT NULL,
    issued_at timestamp with time zone DEFAULT now() NOT NULL,
    issued_by_user_id integer
);


--
-- Name: student_id_card_issuances_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.student_id_card_issuances_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: student_id_card_issuances_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.student_id_card_issuances_id_seq OWNED BY public.student_id_card_issuances.id;


--
-- Name: student_identity_marks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student_identity_marks (
    id integer NOT NULL,
    student_id integer NOT NULL,
    mark_number smallint NOT NULL,
    description character varying(255),
    CONSTRAINT student_identity_marks_mark_number_check CHECK ((mark_number = ANY (ARRAY[1, 2])))
);


--
-- Name: student_identity_marks_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.student_identity_marks ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.student_identity_marks_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: student_leaves; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student_leaves (
    id integer NOT NULL,
    student_id integer NOT NULL,
    from_date date NOT NULL,
    to_date date NOT NULL,
    reason character varying(255),
    status public.student_leave_status_enum DEFAULT 'pending'::public.student_leave_status_enum NOT NULL,
    approved_by_faculty_id integer,
    approved_by_hod_user_id integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    also_on_hostel_leave boolean DEFAULT false NOT NULL,
    routed_to_warden boolean DEFAULT false NOT NULL,
    approved_by_warden_user_id integer,
    attachment_url character varying(500)
);


--
-- Name: student_leaves_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.student_leaves ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.student_leaves_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: student_meeting_notes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student_meeting_notes (
    id integer NOT NULL,
    student_id integer NOT NULL,
    meeting_date date NOT NULL,
    note character varying(500) NOT NULL,
    recorded_by_user_id integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: student_meeting_notes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.student_meeting_notes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: student_meeting_notes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.student_meeting_notes_id_seq OWNED BY public.student_meeting_notes.id;


--
-- Name: student_no_due_status; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student_no_due_status (
    id integer NOT NULL,
    student_id integer NOT NULL,
    academic_year character varying(20) NOT NULL,
    library_cleared boolean DEFAULT false NOT NULL,
    laboratory_cleared boolean DEFAULT false NOT NULL,
    fees_cleared boolean DEFAULT false NOT NULL,
    hostel_cleared boolean DEFAULT false NOT NULL,
    sports_cleared boolean DEFAULT false NOT NULL,
    issued_at timestamp with time zone,
    issued_by_user_id integer,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: student_no_due_status_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.student_no_due_status_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: student_no_due_status_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.student_no_due_status_id_seq OWNED BY public.student_no_due_status.id;


--
-- Name: student_outpasses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student_outpasses (
    id integer NOT NULL,
    student_id integer NOT NULL,
    kind character varying(50) NOT NULL,
    outpass_date date NOT NULL,
    from_time time without time zone NOT NULL,
    to_time time without time zone NOT NULL,
    reason text NOT NULL,
    parent_contact character varying(20),
    status public.outpass_status_enum DEFAULT 'pending'::public.outpass_status_enum NOT NULL,
    approved_by_user_id integer,
    approved_at timestamp with time zone,
    created_by_user_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    actual_exit_at timestamp with time zone,
    actual_return_at timestamp with time zone
);


--
-- Name: student_outpasses_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.student_outpasses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: student_outpasses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.student_outpasses_id_seq OWNED BY public.student_outpasses.id;


--
-- Name: student_profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student_profiles (
    id integer NOT NULL,
    student_id integer NOT NULL,
    resume_url character varying(500),
    linkedin_url character varying(255),
    github_url character varying(255),
    leetcode_url character varying(255),
    hackerrank_url character varying(255),
    codeforces_url character varying(255)
);


--
-- Name: student_profiles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.student_profiles ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.student_profiles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: student_projects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student_projects (
    id integer NOT NULL,
    student_id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    mentor_faculty_id integer
);


--
-- Name: student_projects_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.student_projects ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.student_projects_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: student_scholarship_awards; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student_scholarship_awards (
    id integer NOT NULL,
    scheme_id integer NOT NULL,
    student_id integer NOT NULL,
    amount numeric(12,2) NOT NULL,
    awarded_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: student_scholarship_awards_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.student_scholarship_awards_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: student_scholarship_awards_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.student_scholarship_awards_id_seq OWNED BY public.student_scholarship_awards.id;


--
-- Name: student_semester_gpa; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student_semester_gpa (
    id integer NOT NULL,
    student_id integer NOT NULL,
    semester smallint NOT NULL,
    total_credits smallint NOT NULL,
    total_weighted_points numeric(8,2) NOT NULL,
    sgpa numeric(4,2) NOT NULL,
    cumulative_credits integer NOT NULL,
    cumulative_weighted_points numeric(10,2) NOT NULL,
    cgpa numeric(4,2) NOT NULL,
    is_provisional boolean DEFAULT false NOT NULL,
    computed_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: student_semester_gpa_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.student_semester_gpa_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: student_semester_gpa_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.student_semester_gpa_id_seq OWNED BY public.student_semester_gpa.id;


--
-- Name: student_sensitive_info; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student_sensitive_info (
    id integer NOT NULL,
    student_id integer NOT NULL,
    aadhar_number character varying(20),
    pan_number character varying(20),
    passport_number character varying(30),
    passport_valid_until date
);


--
-- Name: student_sensitive_info_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.student_sensitive_info ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.student_sensitive_info_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: student_sports_team_mapping; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student_sports_team_mapping (
    id integer NOT NULL,
    student_id integer NOT NULL,
    team_id integer NOT NULL,
    joined_at timestamp with time zone DEFAULT now() NOT NULL,
    jersey_no character varying(10),
    squad_role character varying(100)
);


--
-- Name: student_sports_team_mapping_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.student_sports_team_mapping_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: student_sports_team_mapping_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.student_sports_team_mapping_id_seq OWNED BY public.student_sports_team_mapping.id;


--
-- Name: student_test_scores; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student_test_scores (
    id integer NOT NULL,
    student_id integer NOT NULL,
    test_name character varying(30) NOT NULL,
    score numeric(6,2) NOT NULL,
    test_date date,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: student_test_scores_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.student_test_scores_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: student_test_scores_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.student_test_scores_id_seq OWNED BY public.student_test_scores.id;


--
-- Name: student_todo_completions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student_todo_completions (
    id integer NOT NULL,
    todo_id integer NOT NULL,
    student_id integer NOT NULL,
    completed_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: student_todo_completions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.student_todo_completions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: student_todo_completions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.student_todo_completions_id_seq OWNED BY public.student_todo_completions.id;


--
-- Name: student_transport_mapping; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student_transport_mapping (
    id integer NOT NULL,
    student_id integer NOT NULL,
    route_id integer NOT NULL,
    boarding_stage_id integer NOT NULL,
    destination_stage_id integer NOT NULL,
    fee_structure_id integer,
    bus_id integer
);


--
-- Name: student_transport_mapping_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.student_transport_mapping ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.student_transport_mapping_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: wallets; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.wallets (
    id integer NOT NULL,
    balance numeric(12,2) DEFAULT 0 NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id integer NOT NULL,
    qr_token uuid DEFAULT gen_random_uuid() NOT NULL,
    pin_hash character varying(255),
    pin_set_at timestamp with time zone,
    failed_pin_attempts smallint DEFAULT 0 NOT NULL,
    pin_locked_until timestamp with time zone
);


--
-- Name: student_wallets_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.wallets ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.student_wallets_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: students; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.students (
    id integer NOT NULL,
    soa_application_id integer,
    user_id integer NOT NULL,
    student_id_no character varying(30) NOT NULL,
    roll_no character varying(30),
    register_no character varying(30),
    admission_no character varying(30),
    course_id integer NOT NULL,
    quota_id integer NOT NULL,
    class_id integer,
    batch_id integer NOT NULL,
    admission_date date,
    admission_type character varying(50),
    joined_academic_year character varying(20),
    gender character varying(20),
    date_of_birth date,
    student_type public.student_type_enum NOT NULL,
    dayscholar_mode public.dayscholar_mode_enum,
    vehicle_number character varying(30),
    status public.user_status_enum DEFAULT 'active'::public.user_status_enum NOT NULL,
    is_first_graduate boolean DEFAULT false NOT NULL,
    nationality character varying(50),
    religion character varying(50),
    community character varying(50),
    caste character varying(50),
    mother_tongue character varying(50),
    blood_group character varying(10),
    is_father_exserviceman boolean DEFAULT false NOT NULL,
    exserviceman_info character varying(255),
    is_diff_abled boolean DEFAULT false NOT NULL,
    diff_abled_info character varying(255),
    counselling_order_no character varying(50),
    counselling_rank_no character varying(50),
    govt_quota_admission_no character varying(50),
    joined_through character varying(100),
    knew_institution_by character varying(100),
    nominee character varying(150),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    photo_url character varying(500),
    photo_uploaded_at timestamp with time zone,
    face_enrolled_at timestamp with time zone,
    mentor_faculty_id integer,
    is_class_rep boolean DEFAULT false NOT NULL,
    career_path character varying(20),
    CONSTRAINT students_check CHECK ((((student_type = 'dayscholar'::public.student_type_enum) AND (dayscholar_mode IS NOT NULL)) OR ((student_type = 'hosteller'::public.student_type_enum) AND (dayscholar_mode IS NULL)))),
    CONSTRAINT students_check1 CHECK (((dayscholar_mode IS DISTINCT FROM 'own_vehicle'::public.dayscholar_mode_enum) OR (vehicle_number IS NOT NULL)))
);


--
-- Name: students_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.students ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.students_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: subject_academic_clearance; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.subject_academic_clearance (
    id bigint NOT NULL,
    student_id integer NOT NULL,
    faculty_subject_class_mapping_id integer NOT NULL,
    internal1_cleared boolean DEFAULT false NOT NULL,
    internal2_cleared boolean DEFAULT false NOT NULL,
    project_cleared boolean DEFAULT false NOT NULL,
    assignment_cleared boolean DEFAULT false NOT NULL,
    quiz_cleared boolean DEFAULT false NOT NULL,
    updated_by_faculty_id integer,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: subject_academic_clearance_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.subject_academic_clearance_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: subject_academic_clearance_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.subject_academic_clearance_id_seq OWNED BY public.subject_academic_clearance.id;


--
-- Name: subjects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.subjects (
    id integer NOT NULL,
    name character varying(150) NOT NULL,
    subject_code character varying(30) NOT NULL,
    department_id integer,
    credits smallint,
    course_type public.subject_course_type_enum,
    short_code character varying(20),
    category public.subject_category_enum,
    hours smallint,
    semester smallint,
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: subjects_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.subjects ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.subjects_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: timetable_period_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.timetable_period_requests (
    id integer NOT NULL,
    request_type character varying(20) NOT NULL,
    request_date date NOT NULL,
    class_id integer NOT NULL,
    from_faculty_id integer NOT NULL,
    to_faculty_id integer NOT NULL,
    primary_slot_id integer NOT NULL,
    secondary_slot_id integer,
    covering_subject_id integer,
    status character varying(20) DEFAULT 'pending'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    decided_at timestamp with time zone,
    decided_by_user_id integer
);


--
-- Name: timetable_period_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.timetable_period_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: timetable_period_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.timetable_period_requests_id_seq OWNED BY public.timetable_period_requests.id;


--
-- Name: timetable_slots; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.timetable_slots (
    id integer NOT NULL,
    class_id integer NOT NULL,
    subject_id integer NOT NULL,
    faculty_id integer NOT NULL,
    day_of_week smallint NOT NULL,
    period_number smallint NOT NULL,
    start_time time without time zone NOT NULL,
    end_time time without time zone NOT NULL,
    academic_year character varying(20) NOT NULL,
    semester smallint NOT NULL,
    venue_id integer,
    CONSTRAINT timetable_slots_day_of_week_check CHECK (((day_of_week >= 1) AND (day_of_week <= 7)))
);


--
-- Name: timetable_slots_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.timetable_slots ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.timetable_slots_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: training_examples; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.training_examples (
    id integer NOT NULL,
    query_text text NOT NULL,
    intent_name character varying(100) NOT NULL,
    source character varying(50) NOT NULL,
    confidence numeric(4,3),
    usage_count integer DEFAULT 1 NOT NULL,
    approved_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: training_examples_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.training_examples_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: training_examples_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.training_examples_id_seq OWNED BY public.training_examples.id;


--
-- Name: transport_notices; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.transport_notices (
    id integer NOT NULL,
    tag character varying(20) NOT NULL,
    title character varying(255) NOT NULL,
    posted_by_user_id integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: transport_notices_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.transport_notices_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: transport_notices_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.transport_notices_id_seq OWNED BY public.transport_notices.id;


--
-- Name: transport_routes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.transport_routes (
    id integer NOT NULL,
    name character varying(150) NOT NULL,
    distance_km numeric(6,1),
    boarding_area character varying(150),
    departure_time time without time zone,
    arrival_time time without time zone
);


--
-- Name: transport_routes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.transport_routes ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.transport_routes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: transport_stages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.transport_stages (
    id integer NOT NULL,
    route_id integer NOT NULL,
    stage_name character varying(150) NOT NULL,
    sequence_no smallint NOT NULL,
    fee_amount numeric(10,2) NOT NULL,
    pickup_time time without time zone
);


--
-- Name: transport_stages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.transport_stages ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.transport_stages_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: user_preferences; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_preferences (
    user_id integer NOT NULL,
    daily_attendance_digest boolean DEFAULT true NOT NULL,
    sop_escalation_alerts boolean DEFAULT true NOT NULL,
    auto_circulate_mom boolean DEFAULT false NOT NULL,
    compact_tables boolean DEFAULT false NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: user_presence; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_presence (
    user_id integer NOT NULL,
    last_seen_at timestamp with time zone,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_roles (
    id integer NOT NULL,
    user_id integer NOT NULL,
    role_id integer NOT NULL,
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: user_roles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_roles_id_seq OWNED BY public.user_roles.id;


--
-- Name: user_social_links; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_social_links (
    id integer NOT NULL,
    user_id integer NOT NULL,
    title character varying(100) NOT NULL,
    url character varying(500) NOT NULL,
    display_order smallint DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: user_social_links_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_social_links_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_social_links_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_social_links_id_seq OWNED BY public.user_social_links.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email public.citext NOT NULL,
    password_hash character varying(255) NOT NULL,
    phone character varying(20),
    role_id integer NOT NULL,
    status public.user_status_enum DEFAULT 'active'::public.user_status_enum NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.users ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: vendor_quotations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.vendor_quotations (
    id integer NOT NULL,
    vendor_id integer NOT NULL,
    item_description character varying(255) NOT NULL,
    quoted_price numeric(12,2) NOT NULL,
    quotation_date date DEFAULT CURRENT_DATE NOT NULL
);


--
-- Name: vendor_quotations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.vendor_quotations ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.vendor_quotations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: vendors; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.vendors (
    id integer NOT NULL,
    name character varying(150) NOT NULL,
    contact_info character varying(255),
    gst_no character varying(30),
    company_name character varying(150),
    item_name character varying(255),
    item_price numeric(12,2),
    phone character varying(20),
    type public.vendor_type_enum
);


--
-- Name: vendors_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.vendors ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.vendors_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: venue_bookings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.venue_bookings (
    id integer NOT NULL,
    venue_id integer NOT NULL,
    booked_by_user_id integer NOT NULL,
    purpose character varying(255) NOT NULL,
    from_datetime timestamp with time zone NOT NULL,
    to_datetime timestamp with time zone NOT NULL,
    accommodating_strength integer,
    status public.venue_booking_status_enum DEFAULT 'pending'::public.venue_booking_status_enum NOT NULL,
    reviewed_by_user_id integer,
    alternative_venue_id integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    description text,
    requirements text[],
    admin_remarks text,
    reviewed_at timestamp(6) with time zone,
    ref character varying(40)
);


--
-- Name: venue_bookings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.venue_bookings ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.venue_bookings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: venues; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.venues (
    id integer NOT NULL,
    name character varying(150) NOT NULL,
    location character varying(255),
    capacity integer,
    venue_type public.venue_type_enum,
    photo_url character varying(500),
    photo_uploaded_at timestamp with time zone
);


--
-- Name: venues_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.venues ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.venues_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: visitor_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.visitor_logs (
    id integer NOT NULL,
    visitor_name character varying(150),
    vehicle_number character varying(30),
    member_count smallint DEFAULT 1 NOT NULL,
    reason character varying(255),
    phone_number character varying(20),
    entry_time timestamp with time zone DEFAULT now() NOT NULL,
    exit_time timestamp with time zone,
    recorded_by_user_id integer
);


--
-- Name: visitor_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.visitor_logs ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.visitor_logs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: wallet_outlets; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.wallet_outlets (
    id integer NOT NULL,
    name character varying(150) NOT NULL,
    outlet_type public.wallet_outlet_type_enum NOT NULL,
    location character varying(255)
);


--
-- Name: wallet_outlets_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.wallet_outlets ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.wallet_outlets_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: wallet_transactions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.wallet_transactions (
    id integer NOT NULL,
    wallet_id integer NOT NULL,
    txn_type public.wallet_txn_type_enum NOT NULL,
    source public.wallet_txn_source_enum NOT NULL,
    amount numeric(12,2) NOT NULL,
    status public.wallet_txn_status_enum DEFAULT 'pending'::public.wallet_txn_status_enum NOT NULL,
    processed_by_user_id integer,
    razorpay_order_id character varying(100),
    razorpay_payment_id character varying(100),
    razorpay_signature character varying(255),
    remarks character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    outlet_id integer,
    counterparty_wallet_id integer,
    related_transaction_id integer,
    CONSTRAINT chk_wallet_transactions_source CHECK (((source = 'cash'::public.wallet_txn_source_enum) OR ((source = 'razorpay'::public.wallet_txn_source_enum) AND (razorpay_order_id IS NOT NULL)) OR (source = 'adjustment'::public.wallet_txn_source_enum) OR ((source = 'purchase'::public.wallet_txn_source_enum) AND (txn_type = 'debit'::public.wallet_txn_type_enum) AND (outlet_id IS NOT NULL)) OR ((source = 'transfer'::public.wallet_txn_source_enum) AND (counterparty_wallet_id IS NOT NULL)))),
    CONSTRAINT wallet_transactions_amount_check CHECK ((amount > (0)::numeric))
);


--
-- Name: wallet_transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.wallet_transactions ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.wallet_transactions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: admission_profile_drafts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admission_profile_drafts ALTER COLUMN id SET DEFAULT nextval('public.admission_profile_drafts_id_seq'::regclass);


--
-- Name: ambulance_status id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ambulance_status ALTER COLUMN id SET DEFAULT nextval('public.ambulance_status_id_seq'::regclass);


--
-- Name: ambulance_trips id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ambulance_trips ALTER COLUMN id SET DEFAULT nextval('public.ambulance_trips_id_seq'::regclass);


--
-- Name: announcement_class_mapping id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.announcement_class_mapping ALTER COLUMN id SET DEFAULT nextval('public.announcement_class_mapping_id_seq'::regclass);


--
-- Name: announcement_comments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.announcement_comments ALTER COLUMN id SET DEFAULT nextval('public.announcement_comments_id_seq'::regclass);


--
-- Name: announcement_media id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.announcement_media ALTER COLUMN id SET DEFAULT nextval('public.announcement_media_id_seq'::regclass);


--
-- Name: announcement_role_mapping id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.announcement_role_mapping ALTER COLUMN id SET DEFAULT nextval('public.announcement_role_mapping_id_seq'::regclass);


--
-- Name: appraisal_attachments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.appraisal_attachments ALTER COLUMN id SET DEFAULT nextval('public.appraisal_attachments_id_seq'::regclass);


--
-- Name: appraisal_cycles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.appraisal_cycles ALTER COLUMN id SET DEFAULT nextval('public.appraisal_cycles_id_seq'::regclass);


--
-- Name: attendance_record_changes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attendance_record_changes ALTER COLUMN id SET DEFAULT nextval('public.attendance_record_changes_id_seq'::regclass);


--
-- Name: audit_logs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs ALTER COLUMN id SET DEFAULT nextval('public.audit_logs_id_seq'::regclass);


--
-- Name: bank_reconciliation_entries id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bank_reconciliation_entries ALTER COLUMN id SET DEFAULT nextval('public.bank_reconciliation_entries_id_seq'::regclass);


--
-- Name: bills id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bills ALTER COLUMN id SET DEFAULT nextval('public.bills_id_seq'::regclass);


--
-- Name: book_borrow_requests id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.book_borrow_requests ALTER COLUMN id SET DEFAULT nextval('public.book_borrow_requests_id_seq'::regclass);


--
-- Name: budget_allocations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.budget_allocations ALTER COLUMN id SET DEFAULT nextval('public.budget_allocations_id_seq'::regclass);


--
-- Name: bus_documents id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bus_documents ALTER COLUMN id SET DEFAULT nextval('public.bus_documents_id_seq'::regclass);


--
-- Name: bus_fuel_logs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bus_fuel_logs ALTER COLUMN id SET DEFAULT nextval('public.bus_fuel_logs_id_seq'::regclass);


--
-- Name: bus_safety_checks id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bus_safety_checks ALTER COLUMN id SET DEFAULT nextval('public.bus_safety_checks_id_seq'::regclass);


--
-- Name: bus_service_logs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bus_service_logs ALTER COLUMN id SET DEFAULT nextval('public.bus_service_logs_id_seq'::regclass);


--
-- Name: campus_outing_requests id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campus_outing_requests ALTER COLUMN id SET DEFAULT nextval('public.campus_outing_requests_id_seq'::regclass);


--
-- Name: canteen_bills id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.canteen_bills ALTER COLUMN id SET DEFAULT nextval('public.canteen_bills_id_seq'::regclass);


--
-- Name: canteen_dish_categories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.canteen_dish_categories ALTER COLUMN id SET DEFAULT nextval('public.canteen_dish_categories_id_seq'::regclass);


--
-- Name: canteen_dishes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.canteen_dishes ALTER COLUMN id SET DEFAULT nextval('public.canteen_dishes_id_seq'::regclass);


--
-- Name: canteen_expense_categories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.canteen_expense_categories ALTER COLUMN id SET DEFAULT nextval('public.canteen_expense_categories_id_seq'::regclass);


--
-- Name: canteen_expense_products id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.canteen_expense_products ALTER COLUMN id SET DEFAULT nextval('public.canteen_expense_products_id_seq'::regclass);


--
-- Name: canteen_expenses id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.canteen_expenses ALTER COLUMN id SET DEFAULT nextval('public.canteen_expenses_id_seq'::regclass);


--
-- Name: canteen_gst_rates id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.canteen_gst_rates ALTER COLUMN id SET DEFAULT nextval('public.canteen_gst_rates_id_seq'::regclass);


--
-- Name: canteen_ingredients id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.canteen_ingredients ALTER COLUMN id SET DEFAULT nextval('public.canteen_ingredients_id_seq'::regclass);


--
-- Name: canteen_order_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.canteen_order_items ALTER COLUMN id SET DEFAULT nextval('public.canteen_order_items_id_seq'::regclass);


--
-- Name: canteen_orders id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.canteen_orders ALTER COLUMN id SET DEFAULT nextval('public.canteen_orders_id_seq'::regclass);


--
-- Name: canteen_recipe_ingredients id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.canteen_recipe_ingredients ALTER COLUMN id SET DEFAULT nextval('public.canteen_recipe_ingredients_id_seq'::regclass);


--
-- Name: canteen_recipes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.canteen_recipes ALTER COLUMN id SET DEFAULT nextval('public.canteen_recipes_id_seq'::regclass);


--
-- Name: canteen_settings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.canteen_settings ALTER COLUMN id SET DEFAULT nextval('public.canteen_settings_id_seq'::regclass);


--
-- Name: canteen_stock_batches id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.canteen_stock_batches ALTER COLUMN id SET DEFAULT nextval('public.canteen_stock_batches_id_seq'::regclass);


--
-- Name: canteen_stock_transactions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.canteen_stock_transactions ALTER COLUMN id SET DEFAULT nextval('public.canteen_stock_transactions_id_seq'::regclass);


--
-- Name: canteen_todays_specials id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.canteen_todays_specials ALTER COLUMN id SET DEFAULT nextval('public.canteen_todays_specials_id_seq'::regclass);


--
-- Name: certificate_requests id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.certificate_requests ALTER COLUMN id SET DEFAULT nextval('public.certificate_requests_id_seq'::regclass);


--
-- Name: chat_conversations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_conversations ALTER COLUMN id SET DEFAULT nextval('public.chat_conversations_id_seq'::regclass);


--
-- Name: chat_messages id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_messages ALTER COLUMN id SET DEFAULT nextval('public.chat_messages_id_seq'::regclass);


--
-- Name: coe_notification_broadcasts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coe_notification_broadcasts ALTER COLUMN id SET DEFAULT nextval('public.coe_notification_broadcasts_id_seq'::regclass);


--
-- Name: coe_profiles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coe_profiles ALTER COLUMN id SET DEFAULT nextval('public.coe_profiles_id_seq'::regclass);


--
-- Name: condonation_requests id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.condonation_requests ALTER COLUMN id SET DEFAULT nextval('public.condonation_requests_id_seq'::regclass);


--
-- Name: confidential_access_events id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.confidential_access_events ALTER COLUMN id SET DEFAULT nextval('public.confidential_access_events_id_seq'::regclass);


--
-- Name: convocation_registrations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.convocation_registrations ALTER COLUMN id SET DEFAULT nextval('public.convocation_registrations_id_seq'::regclass);


--
-- Name: coordinator_calendar_entries id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coordinator_calendar_entries ALTER COLUMN id SET DEFAULT nextval('public.coordinator_calendar_entries_id_seq'::regclass);


--
-- Name: course_outcomes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_outcomes ALTER COLUMN id SET DEFAULT nextval('public.course_outcomes_id_seq'::regclass);


--
-- Name: course_result_status id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_result_status ALTER COLUMN id SET DEFAULT nextval('public.course_result_status_id_seq'::regclass);


--
-- Name: curriculum_mappings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.curriculum_mappings ALTER COLUMN id SET DEFAULT nextval('public.curriculum_mappings_id_seq'::regclass);


--
-- Name: department_documents id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.department_documents ALTER COLUMN id SET DEFAULT nextval('public.department_documents_id_seq'::regclass);


--
-- Name: department_events id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.department_events ALTER COLUMN id SET DEFAULT nextval('public.department_events_id_seq'::regclass);


--
-- Name: department_labs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.department_labs ALTER COLUMN id SET DEFAULT nextval('public.department_labs_id_seq'::regclass);


--
-- Name: department_meetings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.department_meetings ALTER COLUMN id SET DEFAULT nextval('public.department_meetings_id_seq'::regclass);


--
-- Name: department_mous id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.department_mous ALTER COLUMN id SET DEFAULT nextval('public.department_mous_id_seq'::regclass);


--
-- Name: department_research_funding id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.department_research_funding ALTER COLUMN id SET DEFAULT nextval('public.department_research_funding_id_seq'::regclass);


--
-- Name: designations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.designations ALTER COLUMN id SET DEFAULT nextval('public.designations_id_seq'::regclass);


--
-- Name: device_push_tokens id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.device_push_tokens ALTER COLUMN id SET DEFAULT nextval('public.device_push_tokens_id_seq'::regclass);


--
-- Name: edc_documents id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.edc_documents ALTER COLUMN id SET DEFAULT nextval('public.edc_documents_id_seq'::regclass);


--
-- Name: edc_events id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.edc_events ALTER COLUMN id SET DEFAULT nextval('public.edc_events_id_seq'::regclass);


--
-- Name: edc_funding_records id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.edc_funding_records ALTER COLUMN id SET DEFAULT nextval('public.edc_funding_records_id_seq'::regclass);


--
-- Name: edc_reports id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.edc_reports ALTER COLUMN id SET DEFAULT nextval('public.edc_reports_id_seq'::regclass);


--
-- Name: exam_fee_transactions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exam_fee_transactions ALTER COLUMN id SET DEFAULT nextval('public.exam_fee_transactions_id_seq'::regclass);


--
-- Name: exam_pass_rules_settings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exam_pass_rules_settings ALTER COLUMN id SET DEFAULT nextval('public.exam_pass_rules_settings_id_seq'::regclass);


--
-- Name: exam_registrations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exam_registrations ALTER COLUMN id SET DEFAULT nextval('public.exam_registrations_id_seq'::regclass);


--
-- Name: exam_timetable_versions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exam_timetable_versions ALTER COLUMN id SET DEFAULT nextval('public.exam_timetable_versions_id_seq'::regclass);


--
-- Name: faculty_activity_log id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_activity_log ALTER COLUMN id SET DEFAULT nextval('public.faculty_activity_log_id_seq'::regclass);


--
-- Name: faculty_attendance_corrections id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_attendance_corrections ALTER COLUMN id SET DEFAULT nextval('public.faculty_attendance_corrections_id_seq'::regclass);


--
-- Name: faculty_awards id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_awards ALTER COLUMN id SET DEFAULT nextval('public.faculty_awards_id_seq'::regclass);


--
-- Name: faculty_certifications id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_certifications ALTER COLUMN id SET DEFAULT nextval('public.faculty_certifications_id_seq'::regclass);


--
-- Name: faculty_committee_roles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_committee_roles ALTER COLUMN id SET DEFAULT nextval('public.faculty_committee_roles_id_seq'::regclass);


--
-- Name: faculty_daily_attendance id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_daily_attendance ALTER COLUMN id SET DEFAULT nextval('public.faculty_daily_attendance_id_seq'::regclass);


--
-- Name: faculty_development_programs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_development_programs ALTER COLUMN id SET DEFAULT nextval('public.faculty_development_programs_id_seq'::regclass);


--
-- Name: faculty_documents id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_documents ALTER COLUMN id SET DEFAULT nextval('public.faculty_documents_id_seq'::regclass);


--
-- Name: faculty_feedback_forms id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_feedback_forms ALTER COLUMN id SET DEFAULT nextval('public.faculty_feedback_forms_id_seq'::regclass);


--
-- Name: faculty_feedback_questions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_feedback_questions ALTER COLUMN id SET DEFAULT nextval('public.faculty_feedback_questions_id_seq'::regclass);


--
-- Name: faculty_feedback_responses id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_feedback_responses ALTER COLUMN id SET DEFAULT nextval('public.faculty_feedback_responses_id_seq'::regclass);


--
-- Name: faculty_hostel_mapping id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_hostel_mapping ALTER COLUMN id SET DEFAULT nextval('public.faculty_hostel_mapping_id_seq'::regclass);


--
-- Name: faculty_id_card_issuances id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_id_card_issuances ALTER COLUMN id SET DEFAULT nextval('public.faculty_id_card_issuances_id_seq'::regclass);


--
-- Name: faculty_leave_balances id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_leave_balances ALTER COLUMN id SET DEFAULT nextval('public.faculty_leave_balances_id_seq'::regclass);


--
-- Name: faculty_od_requests id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_od_requests ALTER COLUMN id SET DEFAULT nextval('public.faculty_od_requests_id_seq'::regclass);


--
-- Name: fee_payment_gateway_orders id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fee_payment_gateway_orders ALTER COLUMN id SET DEFAULT nextval('public.fee_payment_gateway_orders_id_seq'::regclass);


--
-- Name: fee_receipt_numbers id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fee_receipt_numbers ALTER COLUMN id SET DEFAULT nextval('public.fee_receipt_numbers_id_seq'::regclass);


--
-- Name: feedback_assignment_questions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feedback_assignment_questions ALTER COLUMN id SET DEFAULT nextval('public.feedback_assignment_questions_id_seq'::regclass);


--
-- Name: feedback_assignments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feedback_assignments ALTER COLUMN id SET DEFAULT nextval('public.feedback_assignments_id_seq'::regclass);


--
-- Name: feedback_faculty_responses id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feedback_faculty_responses ALTER COLUMN id SET DEFAULT nextval('public.feedback_faculty_responses_id_seq'::regclass);


--
-- Name: feedback_question_templates id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feedback_question_templates ALTER COLUMN id SET DEFAULT nextval('public.feedback_question_templates_id_seq'::regclass);


--
-- Name: feedback_rating_scale_options id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feedback_rating_scale_options ALTER COLUMN id SET DEFAULT nextval('public.feedback_rating_scale_options_id_seq'::regclass);


--
-- Name: feedback_rating_scales id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feedback_rating_scales ALTER COLUMN id SET DEFAULT nextval('public.feedback_rating_scales_id_seq'::regclass);


--
-- Name: finance_audit_log id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_audit_log ALTER COLUMN id SET DEFAULT nextval('public.finance_audit_log_id_seq'::regclass);


--
-- Name: finance_funds id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_funds ALTER COLUMN id SET DEFAULT nextval('public.finance_funds_id_seq'::regclass);


--
-- Name: finance_ledger_entries id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_ledger_entries ALTER COLUMN id SET DEFAULT nextval('public.finance_ledger_entries_id_seq'::regclass);


--
-- Name: finance_order_allotments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_order_allotments ALTER COLUMN id SET DEFAULT nextval('public.finance_order_allotments_id_seq'::regclass);


--
-- Name: finance_order_tracking id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_order_tracking ALTER COLUMN id SET DEFAULT nextval('public.finance_order_tracking_id_seq'::regclass);


--
-- Name: finance_order_tracking_events id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_order_tracking_events ALTER COLUMN id SET DEFAULT nextval('public.finance_order_tracking_events_id_seq'::regclass);


--
-- Name: finance_proposal_assignments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_proposal_assignments ALTER COLUMN id SET DEFAULT nextval('public.finance_proposal_assignments_id_seq'::regclass);


--
-- Name: grade_bands id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grade_bands ALTER COLUMN id SET DEFAULT nextval('public.grade_bands_id_seq'::regclass);


--
-- Name: higher_education_application_students id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.higher_education_application_students ALTER COLUMN id SET DEFAULT nextval('public.higher_education_application_students_id_seq'::regclass);


--
-- Name: higher_education_application_windows id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.higher_education_application_windows ALTER COLUMN id SET DEFAULT nextval('public.higher_education_application_windows_id_seq'::regclass);


--
-- Name: higher_education_calendar_events id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.higher_education_calendar_events ALTER COLUMN id SET DEFAULT nextval('public.higher_education_calendar_events_id_seq'::regclass);


--
-- Name: higher_education_coaching_batches id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.higher_education_coaching_batches ALTER COLUMN id SET DEFAULT nextval('public.higher_education_coaching_batches_id_seq'::regclass);


--
-- Name: higher_education_loans id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.higher_education_loans ALTER COLUMN id SET DEFAULT nextval('public.higher_education_loans_id_seq'::regclass);


--
-- Name: higher_education_retake_watchlist id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.higher_education_retake_watchlist ALTER COLUMN id SET DEFAULT nextval('public.higher_education_retake_watchlist_id_seq'::regclass);


--
-- Name: higher_education_standing_returns id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.higher_education_standing_returns ALTER COLUMN id SET DEFAULT nextval('public.higher_education_standing_returns_id_seq'::regclass);


--
-- Name: higher_education_test_students id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.higher_education_test_students ALTER COLUMN id SET DEFAULT nextval('public.higher_education_test_students_id_seq'::regclass);


--
-- Name: higher_education_universities id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.higher_education_universities ALTER COLUMN id SET DEFAULT nextval('public.higher_education_universities_id_seq'::regclass);


--
-- Name: hostel_blocks id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hostel_blocks ALTER COLUMN id SET DEFAULT nextval('public.hostel_blocks_id_seq'::regclass);


--
-- Name: hostel_complaints id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hostel_complaints ALTER COLUMN id SET DEFAULT nextval('public.hostel_complaints_id_seq'::regclass);


--
-- Name: hostel_floors id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hostel_floors ALTER COLUMN id SET DEFAULT nextval('public.hostel_floors_id_seq'::regclass);


--
-- Name: hostel_goods id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hostel_goods ALTER COLUMN id SET DEFAULT nextval('public.hostel_goods_id_seq'::regclass);


--
-- Name: hostel_mess_feedback id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hostel_mess_feedback ALTER COLUMN id SET DEFAULT nextval('public.hostel_mess_feedback_id_seq'::regclass);


--
-- Name: hostel_night_attendance id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hostel_night_attendance ALTER COLUMN id SET DEFAULT nextval('public.hostel_night_attendance_id_seq'::regclass);


--
-- Name: hostel_quit_requests id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hostel_quit_requests ALTER COLUMN id SET DEFAULT nextval('public.hostel_quit_requests_id_seq'::regclass);


--
-- Name: hostel_settings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hostel_settings ALTER COLUMN id SET DEFAULT nextval('public.hostel_settings_id_seq'::regclass);


--
-- Name: hostel_wardens id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hostel_wardens ALTER COLUMN id SET DEFAULT nextval('public.hostel_wardens_id_seq'::regclass);


--
-- Name: hostels id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hostels ALTER COLUMN id SET DEFAULT nextval('public.hostels_id_seq'::regclass);


--
-- Name: hr_payroll_requests id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hr_payroll_requests ALTER COLUMN id SET DEFAULT nextval('public.hr_payroll_requests_id_seq'::regclass);


--
-- Name: hr_queries id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hr_queries ALTER COLUMN id SET DEFAULT nextval('public.hr_queries_id_seq'::regclass);


--
-- Name: incubation_milestones id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.incubation_milestones ALTER COLUMN id SET DEFAULT nextval('public.incubation_milestones_id_seq'::regclass);


--
-- Name: incubations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.incubations ALTER COLUMN id SET DEFAULT nextval('public.incubations_id_seq'::regclass);


--
-- Name: invigilation_allocation_batches id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invigilation_allocation_batches ALTER COLUMN id SET DEFAULT nextval('public.invigilation_allocation_batches_id_seq'::regclass);


--
-- Name: iqac_accreditation_criteria id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.iqac_accreditation_criteria ALTER COLUMN id SET DEFAULT nextval('public.iqac_accreditation_criteria_id_seq'::regclass);


--
-- Name: iqac_accreditation_evidence_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.iqac_accreditation_evidence_items ALTER COLUMN id SET DEFAULT nextval('public.iqac_accreditation_evidence_items_id_seq'::regclass);


--
-- Name: iqac_metric_targets id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.iqac_metric_targets ALTER COLUMN id SET DEFAULT nextval('public.iqac_metric_targets_id_seq'::regclass);


--
-- Name: leave_parent_acknowledgements id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leave_parent_acknowledgements ALTER COLUMN id SET DEFAULT nextval('public.leave_parent_acknowledgements_id_seq'::regclass);


--
-- Name: leave_types id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leave_types ALTER COLUMN id SET DEFAULT nextval('public.leave_types_id_seq'::regclass);


--
-- Name: lesson_plan_sessions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lesson_plan_sessions ALTER COLUMN id SET DEFAULT nextval('public.lesson_plan_sessions_id_seq'::regclass);


--
-- Name: library_racks id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.library_racks ALTER COLUMN id SET DEFAULT nextval('public.library_racks_id_seq'::regclass);


--
-- Name: library_settings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.library_settings ALTER COLUMN id SET DEFAULT nextval('public.library_settings_id_seq'::regclass);


--
-- Name: lms_folder_classes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lms_folder_classes ALTER COLUMN id SET DEFAULT nextval('public.lms_folder_classes_id_seq'::regclass);


--
-- Name: lms_folders id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lms_folders ALTER COLUMN id SET DEFAULT nextval('public.lms_folders_id_seq'::regclass);


--
-- Name: lms_resources id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lms_resources ALTER COLUMN id SET DEFAULT nextval('public.lms_resources_id_seq'::regclass);


--
-- Name: malpractice_incidents id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.malpractice_incidents ALTER COLUMN id SET DEFAULT nextval('public.malpractice_incidents_id_seq'::regclass);


--
-- Name: marks_entry_locks id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.marks_entry_locks ALTER COLUMN id SET DEFAULT nextval('public.marks_entry_locks_id_seq'::regclass);


--
-- Name: media_equipment id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media_equipment ALTER COLUMN id SET DEFAULT nextval('public.media_equipment_id_seq'::regclass);


--
-- Name: media_equipment_movements id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media_equipment_movements ALTER COLUMN id SET DEFAULT nextval('public.media_equipment_movements_id_seq'::regclass);


--
-- Name: media_indents id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media_indents ALTER COLUMN id SET DEFAULT nextval('public.media_indents_id_seq'::regclass);


--
-- Name: media_reports id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media_reports ALTER COLUMN id SET DEFAULT nextval('public.media_reports_id_seq'::regclass);


--
-- Name: media_request_status_log id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media_request_status_log ALTER COLUMN id SET DEFAULT nextval('public.media_request_status_log_id_seq'::regclass);


--
-- Name: media_scorecard_targets id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media_scorecard_targets ALTER COLUMN id SET DEFAULT nextval('public.media_scorecard_targets_id_seq'::regclass);


--
-- Name: media_shoot_assignments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media_shoot_assignments ALTER COLUMN id SET DEFAULT nextval('public.media_shoot_assignments_id_seq'::regclass);


--
-- Name: media_team_members id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media_team_members ALTER COLUMN id SET DEFAULT nextval('public.media_team_members_id_seq'::regclass);


--
-- Name: medical_appointment_windows id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medical_appointment_windows ALTER COLUMN id SET DEFAULT nextval('public.medical_appointment_windows_id_seq'::regclass);


--
-- Name: medical_appointments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medical_appointments ALTER COLUMN id SET DEFAULT nextval('public.medical_appointments_id_seq'::regclass);


--
-- Name: medical_bill_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medical_bill_items ALTER COLUMN id SET DEFAULT nextval('public.medical_bill_items_id_seq'::regclass);


--
-- Name: medical_bills id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medical_bills ALTER COLUMN id SET DEFAULT nextval('public.medical_bills_id_seq'::regclass);


--
-- Name: medical_camp_registrations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medical_camp_registrations ALTER COLUMN id SET DEFAULT nextval('public.medical_camp_registrations_id_seq'::regclass);


--
-- Name: medical_camps id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medical_camps ALTER COLUMN id SET DEFAULT nextval('public.medical_camps_id_seq'::regclass);


--
-- Name: medical_equipment id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medical_equipment ALTER COLUMN id SET DEFAULT nextval('public.medical_equipment_id_seq'::regclass);


--
-- Name: medical_services id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medical_services ALTER COLUMN id SET DEFAULT nextval('public.medical_services_id_seq'::regclass);


--
-- Name: medical_staff id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medical_staff ALTER COLUMN id SET DEFAULT nextval('public.medical_staff_id_seq'::regclass);


--
-- Name: medical_visits id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medical_visits ALTER COLUMN id SET DEFAULT nextval('public.medical_visits_id_seq'::regclass);


--
-- Name: meeting_action_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.meeting_action_items ALTER COLUMN id SET DEFAULT nextval('public.meeting_action_items_id_seq'::regclass);


--
-- Name: message_conversations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message_conversations ALTER COLUMN id SET DEFAULT nextval('public.message_conversations_id_seq'::regclass);


--
-- Name: message_participants id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message_participants ALTER COLUMN id SET DEFAULT nextval('public.message_participants_id_seq'::regclass);


--
-- Name: message_requests id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message_requests ALTER COLUMN id SET DEFAULT nextval('public.message_requests_id_seq'::regclass);


--
-- Name: messages id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages ALTER COLUMN id SET DEFAULT nextval('public.messages_id_seq'::regclass);


--
-- Name: model_performance id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.model_performance ALTER COLUMN id SET DEFAULT nextval('public.model_performance_id_seq'::regclass);


--
-- Name: nba_criteria id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nba_criteria ALTER COLUMN id SET DEFAULT nextval('public.nba_criteria_id_seq'::regclass);


--
-- Name: nba_evidence_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nba_evidence_items ALTER COLUMN id SET DEFAULT nextval('public.nba_evidence_items_id_seq'::regclass);


--
-- Name: od_request_parent_acknowledgements id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.od_request_parent_acknowledgements ALTER COLUMN id SET DEFAULT nextval('public.od_request_parent_acknowledgements_id_seq'::regclass);


--
-- Name: online_class_participants id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.online_class_participants ALTER COLUMN id SET DEFAULT nextval('public.online_class_participants_id_seq'::regclass);


--
-- Name: online_classes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.online_classes ALTER COLUMN id SET DEFAULT nextval('public.online_classes_id_seq'::regclass);


--
-- Name: outcome_attainments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.outcome_attainments ALTER COLUMN id SET DEFAULT nextval('public.outcome_attainments_id_seq'::regclass);


--
-- Name: parent_feedback id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.parent_feedback ALTER COLUMN id SET DEFAULT nextval('public.parent_feedback_id_seq'::regclass);


--
-- Name: pass_board_course_grace id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pass_board_course_grace ALTER COLUMN id SET DEFAULT nextval('public.pass_board_course_grace_id_seq'::regclass);


--
-- Name: pass_board_sheets id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pass_board_sheets ALTER COLUMN id SET DEFAULT nextval('public.pass_board_sheets_id_seq'::regclass);


--
-- Name: pass_board_signoffs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pass_board_signoffs ALTER COLUMN id SET DEFAULT nextval('public.pass_board_signoffs_id_seq'::regclass);


--
-- Name: patent_inventors id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.patent_inventors ALTER COLUMN id SET DEFAULT nextval('public.faculty_patent_inventors_id_seq'::regclass);


--
-- Name: patents id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.patents ALTER COLUMN id SET DEFAULT nextval('public.faculty_patents_id_seq'::regclass);


--
-- Name: period_timings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.period_timings ALTER COLUMN id SET DEFAULT nextval('public.period_timings_id_seq'::regclass);


--
-- Name: personal_calendar_entries id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.personal_calendar_entries ALTER COLUMN id SET DEFAULT nextval('public.personal_calendar_entries_id_seq'::regclass);


--
-- Name: pharmacy_dispense_log id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pharmacy_dispense_log ALTER COLUMN id SET DEFAULT nextval('public.pharmacy_dispense_log_id_seq'::regclass);


--
-- Name: pharmacy_stock id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pharmacy_stock ALTER COLUMN id SET DEFAULT nextval('public.pharmacy_stock_id_seq'::regclass);


--
-- Name: photocopy_requests id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.photocopy_requests ALTER COLUMN id SET DEFAULT nextval('public.photocopy_requests_id_seq'::regclass);


--
-- Name: placement_interviews id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.placement_interviews ALTER COLUMN id SET DEFAULT nextval('public.placement_interviews_id_seq'::regclass);


--
-- Name: placement_todos id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.placement_todos ALTER COLUMN id SET DEFAULT nextval('public.placement_todos_id_seq'::regclass);


--
-- Name: program_outcomes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.program_outcomes ALTER COLUMN id SET DEFAULT nextval('public.program_outcomes_id_seq'::regclass);


--
-- Name: project_join_requests id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_join_requests ALTER COLUMN id SET DEFAULT nextval('public.project_join_requests_id_seq'::regclass);


--
-- Name: project_recruitment_posts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_recruitment_posts ALTER COLUMN id SET DEFAULT nextval('public.project_recruitment_posts_id_seq'::regclass);


--
-- Name: project_team_members id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_team_members ALTER COLUMN id SET DEFAULT nextval('public.project_team_members_id_seq'::regclass);


--
-- Name: project_teams id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_teams ALTER COLUMN id SET DEFAULT nextval('public.project_teams_id_seq'::regclass);


--
-- Name: publication_contributors id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.publication_contributors ALTER COLUMN id SET DEFAULT nextval('public.publication_contributors_id_seq'::regclass);


--
-- Name: publications id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.publications ALTER COLUMN id SET DEFAULT nextval('public.faculty_publications_id_seq'::regclass);


--
-- Name: query_logs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.query_logs ALTER COLUMN id SET DEFAULT nextval('public.query_logs_id_seq'::regclass);


--
-- Name: question_papers id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.question_papers ALTER COLUMN id SET DEFAULT nextval('public.question_papers_id_seq'::regclass);


--
-- Name: refunds id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refunds ALTER COLUMN id SET DEFAULT nextval('public.refunds_id_seq'::regclass);


--
-- Name: regulation_courses id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.regulation_courses ALTER COLUMN id SET DEFAULT nextval('public.regulation_courses_id_seq'::regclass);


--
-- Name: regulations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.regulations ALTER COLUMN id SET DEFAULT nextval('public.regulations_id_seq'::regclass);


--
-- Name: research_project_members id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.research_project_members ALTER COLUMN id SET DEFAULT nextval('public.faculty_research_project_members_id_seq'::regclass);


--
-- Name: research_projects id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.research_projects ALTER COLUMN id SET DEFAULT nextval('public.faculty_research_projects_id_seq'::regclass);


--
-- Name: revaluation_windows id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.revaluation_windows ALTER COLUMN id SET DEFAULT nextval('public.revaluation_windows_id_seq'::regclass);


--
-- Name: scholarship_schemes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.scholarship_schemes ALTER COLUMN id SET DEFAULT nextval('public.scholarship_schemes_id_seq'::regclass);


--
-- Name: script_archive_bundles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.script_archive_bundles ALTER COLUMN id SET DEFAULT nextval('public.script_archive_bundles_id_seq'::regclass);


--
-- Name: script_bundle_marks id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.script_bundle_marks ALTER COLUMN id SET DEFAULT nextval('public.script_bundle_marks_id_seq'::regclass);


--
-- Name: script_bundle_scripts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.script_bundle_scripts ALTER COLUMN id SET DEFAULT nextval('public.script_bundle_scripts_id_seq'::regclass);


--
-- Name: script_bundles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.script_bundles ALTER COLUMN id SET DEFAULT nextval('public.script_bundles_id_seq'::regclass);


--
-- Name: script_retrieval_requests id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.script_retrieval_requests ALTER COLUMN id SET DEFAULT nextval('public.script_retrieval_requests_id_seq'::regclass);


--
-- Name: seating_plan_venue_departments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seating_plan_venue_departments ALTER COLUMN id SET DEFAULT nextval('public.seating_plan_venue_departments_id_seq'::regclass);


--
-- Name: seating_plan_version_venues id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seating_plan_version_venues ALTER COLUMN id SET DEFAULT nextval('public.seating_plan_version_venues_id_seq'::regclass);


--
-- Name: seating_plan_versions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seating_plan_versions ALTER COLUMN id SET DEFAULT nextval('public.seating_plan_versions_id_seq'::regclass);


--
-- Name: secretary_product_request_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.secretary_product_request_items ALTER COLUMN id SET DEFAULT nextval('public.secretary_product_request_items_id_seq'::regclass);


--
-- Name: secretary_product_requests id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.secretary_product_requests ALTER COLUMN id SET DEFAULT nextval('public.secretary_product_requests_id_seq'::regclass);


--
-- Name: secretary_service_request_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.secretary_service_request_items ALTER COLUMN id SET DEFAULT nextval('public.secretary_service_request_items_id_seq'::regclass);


--
-- Name: secretary_service_requests id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.secretary_service_requests ALTER COLUMN id SET DEFAULT nextval('public.secretary_service_requests_id_seq'::regclass);


--
-- Name: sick_room_beds id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sick_room_beds ALTER COLUMN id SET DEFAULT nextval('public.sick_room_beds_id_seq'::regclass);


--
-- Name: sick_room_stays id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sick_room_stays ALTER COLUMN id SET DEFAULT nextval('public.sick_room_stays_id_seq'::regclass);


--
-- Name: sports_achievements id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_achievements ALTER COLUMN id SET DEFAULT nextval('public.sports_achievements_id_seq'::regclass);


--
-- Name: sports_announcements id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_announcements ALTER COLUMN id SET DEFAULT nextval('public.sports_announcements_id_seq'::regclass);


--
-- Name: sports_athlete_profiles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_athlete_profiles ALTER COLUMN id SET DEFAULT nextval('public.sports_athlete_profiles_id_seq'::regclass);


--
-- Name: sports_budget_requests id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_budget_requests ALTER COLUMN id SET DEFAULT nextval('public.sports_budget_requests_id_seq'::regclass);


--
-- Name: sports_calendar_notes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_calendar_notes ALTER COLUMN id SET DEFAULT nextval('public.sports_calendar_notes_id_seq'::regclass);


--
-- Name: sports_coach_profiles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_coach_profiles ALTER COLUMN id SET DEFAULT nextval('public.sports_coach_profiles_id_seq'::regclass);


--
-- Name: sports_disciplines id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_disciplines ALTER COLUMN id SET DEFAULT nextval('public.sports_disciplines_id_seq'::regclass);


--
-- Name: sports_equipment id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_equipment ALTER COLUMN id SET DEFAULT nextval('public.sports_equipment_id_seq'::regclass);


--
-- Name: sports_equipment_issues id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_equipment_issues ALTER COLUMN id SET DEFAULT nextval('public.sports_equipment_issues_id_seq'::regclass);


--
-- Name: sports_facilities id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_facilities ALTER COLUMN id SET DEFAULT nextval('public.sports_facilities_id_seq'::regclass);


--
-- Name: sports_fitness_tests id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_fitness_tests ALTER COLUMN id SET DEFAULT nextval('public.sports_fitness_tests_id_seq'::regclass);


--
-- Name: sports_fixtures id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_fixtures ALTER COLUMN id SET DEFAULT nextval('public.sports_fixtures_id_seq'::regclass);


--
-- Name: sports_injuries id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_injuries ALTER COLUMN id SET DEFAULT nextval('public.sports_injuries_id_seq'::regclass);


--
-- Name: sports_od_hod_approvals id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_od_hod_approvals ALTER COLUMN id SET DEFAULT nextval('public.sports_od_hod_approvals_id_seq'::regclass);


--
-- Name: sports_od_letter_numbers id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_od_letter_numbers ALTER COLUMN id SET DEFAULT nextval('public.sports_od_letter_numbers_id_seq'::regclass);


--
-- Name: sports_od_requests id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_od_requests ALTER COLUMN id SET DEFAULT nextval('public.sports_od_requests_id_seq'::regclass);


--
-- Name: sports_od_squad_members id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_od_squad_members ALTER COLUMN id SET DEFAULT nextval('public.sports_od_squad_members_id_seq'::regclass);


--
-- Name: sports_reports id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_reports ALTER COLUMN id SET DEFAULT nextval('public.sports_reports_id_seq'::regclass);


--
-- Name: sports_session_attendance id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_session_attendance ALTER COLUMN id SET DEFAULT nextval('public.sports_session_attendance_id_seq'::regclass);


--
-- Name: sports_teams id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_teams ALTER COLUMN id SET DEFAULT nextval('public.sports_teams_id_seq'::regclass);


--
-- Name: sports_training_sessions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_training_sessions ALTER COLUMN id SET DEFAULT nextval('public.sports_training_sessions_id_seq'::regclass);


--
-- Name: sports_trial_scores id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_trial_scores ALTER COLUMN id SET DEFAULT nextval('public.sports_trial_scores_id_seq'::regclass);


--
-- Name: sports_trials id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_trials ALTER COLUMN id SET DEFAULT nextval('public.sports_trials_id_seq'::regclass);


--
-- Name: startup_ideas id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.startup_ideas ALTER COLUMN id SET DEFAULT nextval('public.startup_ideas_id_seq'::regclass);


--
-- Name: stationary_finishing_rates id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stationary_finishing_rates ALTER COLUMN id SET DEFAULT nextval('public.stationary_finishing_rates_id_seq'::regclass);


--
-- Name: stationary_machines id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stationary_machines ALTER COLUMN id SET DEFAULT nextval('public.stationary_machines_id_seq'::regclass);


--
-- Name: stationary_print_rates id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stationary_print_rates ALTER COLUMN id SET DEFAULT nextval('public.stationary_print_rates_id_seq'::regclass);


--
-- Name: stationary_requests id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stationary_requests ALTER COLUMN id SET DEFAULT nextval('public.stationary_requests_id_seq'::regclass);


--
-- Name: stationary_stock_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stationary_stock_items ALTER COLUMN id SET DEFAULT nextval('public.stationary_stock_items_id_seq'::regclass);


--
-- Name: stationery_order_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stationery_order_items ALTER COLUMN id SET DEFAULT nextval('public.stationery_order_items_id_seq'::regclass);


--
-- Name: stationery_orders id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stationery_orders ALTER COLUMN id SET DEFAULT nextval('public.stationery_orders_id_seq'::regclass);


--
-- Name: stationery_products id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stationery_products ALTER COLUMN id SET DEFAULT nextval('public.stationery_products_id_seq'::regclass);


--
-- Name: student_certifications id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_certifications ALTER COLUMN id SET DEFAULT nextval('public.student_certifications_id_seq'::regclass);


--
-- Name: student_competitions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_competitions ALTER COLUMN id SET DEFAULT nextval('public.student_competitions_id_seq'::regclass);


--
-- Name: student_entrepreneurship id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_entrepreneurship ALTER COLUMN id SET DEFAULT nextval('public.student_entrepreneurship_id_seq'::regclass);


--
-- Name: student_escalations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_escalations ALTER COLUMN id SET DEFAULT nextval('public.student_escalations_id_seq'::regclass);


--
-- Name: student_hackathon_participations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_hackathon_participations ALTER COLUMN id SET DEFAULT nextval('public.student_hackathon_participations_id_seq'::regclass);


--
-- Name: student_health_records id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_health_records ALTER COLUMN id SET DEFAULT nextval('public.student_health_records_id_seq'::regclass);


--
-- Name: student_higher_education id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_higher_education ALTER COLUMN id SET DEFAULT nextval('public.student_higher_education_id_seq'::regclass);


--
-- Name: student_id_card_issuances id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_id_card_issuances ALTER COLUMN id SET DEFAULT nextval('public.student_id_card_issuances_id_seq'::regclass);


--
-- Name: student_meeting_notes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_meeting_notes ALTER COLUMN id SET DEFAULT nextval('public.student_meeting_notes_id_seq'::regclass);


--
-- Name: student_no_due_status id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_no_due_status ALTER COLUMN id SET DEFAULT nextval('public.student_no_due_status_id_seq'::regclass);


--
-- Name: student_outpasses id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_outpasses ALTER COLUMN id SET DEFAULT nextval('public.student_outpasses_id_seq'::regclass);


--
-- Name: student_scholarship_awards id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_scholarship_awards ALTER COLUMN id SET DEFAULT nextval('public.student_scholarship_awards_id_seq'::regclass);


--
-- Name: student_semester_gpa id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_semester_gpa ALTER COLUMN id SET DEFAULT nextval('public.student_semester_gpa_id_seq'::regclass);


--
-- Name: student_sports_team_mapping id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_sports_team_mapping ALTER COLUMN id SET DEFAULT nextval('public.student_sports_team_mapping_id_seq'::regclass);


--
-- Name: student_test_scores id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_test_scores ALTER COLUMN id SET DEFAULT nextval('public.student_test_scores_id_seq'::regclass);


--
-- Name: student_todo_completions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_todo_completions ALTER COLUMN id SET DEFAULT nextval('public.student_todo_completions_id_seq'::regclass);


--
-- Name: subject_academic_clearance id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subject_academic_clearance ALTER COLUMN id SET DEFAULT nextval('public.subject_academic_clearance_id_seq'::regclass);


--
-- Name: timetable_period_requests id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.timetable_period_requests ALTER COLUMN id SET DEFAULT nextval('public.timetable_period_requests_id_seq'::regclass);


--
-- Name: training_examples id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.training_examples ALTER COLUMN id SET DEFAULT nextval('public.training_examples_id_seq'::regclass);


--
-- Name: transport_notices id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transport_notices ALTER COLUMN id SET DEFAULT nextval('public.transport_notices_id_seq'::regclass);


--
-- Name: user_roles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles ALTER COLUMN id SET DEFAULT nextval('public.user_roles_id_seq'::regclass);


--
-- Name: user_social_links id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_social_links ALTER COLUMN id SET DEFAULT nextval('public.user_social_links_id_seq'::regclass);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: academic_calendars academic_calendars_batch_id_semester_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.academic_calendars
    ADD CONSTRAINT academic_calendars_batch_id_semester_key UNIQUE (batch_id, semester);


--
-- Name: academic_calendars academic_calendars_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.academic_calendars
    ADD CONSTRAINT academic_calendars_pkey PRIMARY KEY (id);


--
-- Name: achievement_comments achievement_comments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.achievement_comments
    ADD CONSTRAINT achievement_comments_pkey PRIMARY KEY (id);


--
-- Name: achievement_media achievement_media_achievement_id_sequence_no_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.achievement_media
    ADD CONSTRAINT achievement_media_achievement_id_sequence_no_key UNIQUE (achievement_id, sequence_no);


--
-- Name: achievement_media achievement_media_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.achievement_media
    ADD CONSTRAINT achievement_media_pkey PRIMARY KEY (id);


--
-- Name: admission_profile_drafts admission_profile_drafts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admission_profile_drafts
    ADD CONSTRAINT admission_profile_drafts_pkey PRIMARY KEY (id);


--
-- Name: alumni_announcements alumni_announcements_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alumni_announcements
    ADD CONSTRAINT alumni_announcements_pkey PRIMARY KEY (id);


--
-- Name: alumni_batches alumni_batches_batch_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alumni_batches
    ADD CONSTRAINT alumni_batches_batch_id_key UNIQUE (batch_id);


--
-- Name: alumni_batches alumni_batches_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alumni_batches
    ADD CONSTRAINT alumni_batches_pkey PRIMARY KEY (id);


--
-- Name: alumni_group_messages alumni_group_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alumni_group_messages
    ADD CONSTRAINT alumni_group_messages_pkey PRIMARY KEY (id);


--
-- Name: alumni_members alumni_members_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alumni_members
    ADD CONSTRAINT alumni_members_pkey PRIMARY KEY (id);


--
-- Name: alumni_members alumni_members_student_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alumni_members
    ADD CONSTRAINT alumni_members_student_id_key UNIQUE (student_id);


--
-- Name: ambulance_status ambulance_status_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ambulance_status
    ADD CONSTRAINT ambulance_status_pkey PRIMARY KEY (id);


--
-- Name: ambulance_trips ambulance_trips_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ambulance_trips
    ADD CONSTRAINT ambulance_trips_pkey PRIMARY KEY (id);


--
-- Name: announcement_class_mapping announcement_class_mapping_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.announcement_class_mapping
    ADD CONSTRAINT announcement_class_mapping_pkey PRIMARY KEY (id);


--
-- Name: announcement_comments announcement_comments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.announcement_comments
    ADD CONSTRAINT announcement_comments_pkey PRIMARY KEY (id);


--
-- Name: announcement_media announcement_media_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.announcement_media
    ADD CONSTRAINT announcement_media_pkey PRIMARY KEY (id);


--
-- Name: announcement_media announcement_media_unique_seq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.announcement_media
    ADD CONSTRAINT announcement_media_unique_seq UNIQUE (announcement_id, sequence_no);


--
-- Name: announcement_role_mapping announcement_role_mapping_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.announcement_role_mapping
    ADD CONSTRAINT announcement_role_mapping_pkey PRIMARY KEY (id);


--
-- Name: announcements announcements_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.announcements
    ADD CONSTRAINT announcements_pkey PRIMARY KEY (id);


--
-- Name: appraisal_attachments appraisal_attachments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.appraisal_attachments
    ADD CONSTRAINT appraisal_attachments_pkey PRIMARY KEY (id);


--
-- Name: appraisal_criteria appraisal_criteria_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.appraisal_criteria
    ADD CONSTRAINT appraisal_criteria_pkey PRIMARY KEY (id);


--
-- Name: appraisal_cycles appraisal_cycles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.appraisal_cycles
    ADD CONSTRAINT appraisal_cycles_pkey PRIMARY KEY (id);


--
-- Name: appraisal_divisions appraisal_divisions_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.appraisal_divisions
    ADD CONSTRAINT appraisal_divisions_name_key UNIQUE (name);


--
-- Name: appraisal_divisions appraisal_divisions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.appraisal_divisions
    ADD CONSTRAINT appraisal_divisions_pkey PRIMARY KEY (id);


--
-- Name: appraisal_entries appraisal_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.appraisal_entries
    ADD CONSTRAINT appraisal_entries_pkey PRIMARY KEY (id);


--
-- Name: appraisal_requests appraisal_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.appraisal_requests
    ADD CONSTRAINT appraisal_requests_pkey PRIMARY KEY (id);


--
-- Name: assignments assignments_class_id_subject_id_academic_year_semester_sequ_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assignments
    ADD CONSTRAINT assignments_class_id_subject_id_academic_year_semester_sequ_key UNIQUE (class_id, subject_id, academic_year, semester, sequence_no);


--
-- Name: assignments assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assignments
    ADD CONSTRAINT assignments_pkey PRIMARY KEY (id);


--
-- Name: attendance_record_changes attendance_record_changes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attendance_record_changes
    ADD CONSTRAINT attendance_record_changes_pkey PRIMARY KEY (id);


--
-- Name: attendance_records attendance_records_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attendance_records
    ADD CONSTRAINT attendance_records_pkey PRIMARY KEY (id);


--
-- Name: attendance_records attendance_records_student_id_class_id_subject_id_attendanc_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attendance_records
    ADD CONSTRAINT attendance_records_student_id_class_id_subject_id_attendanc_key UNIQUE (student_id, class_id, subject_id, attendance_date);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: bank_reconciliation_entries bank_reconciliation_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bank_reconciliation_entries
    ADD CONSTRAINT bank_reconciliation_entries_pkey PRIMARY KEY (id);


--
-- Name: batches batches_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.batches
    ADD CONSTRAINT batches_name_key UNIQUE (name);


--
-- Name: batches batches_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.batches
    ADD CONSTRAINT batches_pkey PRIMARY KEY (id);


--
-- Name: bills bills_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bills
    ADD CONSTRAINT bills_pkey PRIMARY KEY (id);


--
-- Name: bonafide_reasons bonafide_reasons_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bonafide_reasons
    ADD CONSTRAINT bonafide_reasons_pkey PRIMARY KEY (id);


--
-- Name: bonafide_reasons bonafide_reasons_reason_text_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bonafide_reasons
    ADD CONSTRAINT bonafide_reasons_reason_text_key UNIQUE (reason_text);


--
-- Name: bonafide_requests bonafide_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bonafide_requests
    ADD CONSTRAINT bonafide_requests_pkey PRIMARY KEY (id);


--
-- Name: book_borrow_records book_borrow_records_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.book_borrow_records
    ADD CONSTRAINT book_borrow_records_pkey PRIMARY KEY (id);


--
-- Name: book_borrow_requests book_borrow_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.book_borrow_requests
    ADD CONSTRAINT book_borrow_requests_pkey PRIMARY KEY (id);


--
-- Name: book_categories book_categories_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.book_categories
    ADD CONSTRAINT book_categories_name_key UNIQUE (name);


--
-- Name: book_categories book_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.book_categories
    ADD CONSTRAINT book_categories_pkey PRIMARY KEY (id);


--
-- Name: books books_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.books
    ADD CONSTRAINT books_pkey PRIMARY KEY (id);


--
-- Name: books books_qr_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.books
    ADD CONSTRAINT books_qr_code_key UNIQUE (qr_code);


--
-- Name: budget_allocations budget_allocations_head_academic_year_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.budget_allocations
    ADD CONSTRAINT budget_allocations_head_academic_year_key UNIQUE (head, academic_year);


--
-- Name: budget_allocations budget_allocations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.budget_allocations
    ADD CONSTRAINT budget_allocations_pkey PRIMARY KEY (id);


--
-- Name: bus_documents bus_documents_bus_id_doc_type_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bus_documents
    ADD CONSTRAINT bus_documents_bus_id_doc_type_key UNIQUE (bus_id, doc_type);


--
-- Name: bus_documents bus_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bus_documents
    ADD CONSTRAINT bus_documents_pkey PRIMARY KEY (id);


--
-- Name: bus_fuel_logs bus_fuel_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bus_fuel_logs
    ADD CONSTRAINT bus_fuel_logs_pkey PRIMARY KEY (id);


--
-- Name: bus_live_locations bus_live_locations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bus_live_locations
    ADD CONSTRAINT bus_live_locations_pkey PRIMARY KEY (id);


--
-- Name: bus_safety_checks bus_safety_checks_bus_id_item_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bus_safety_checks
    ADD CONSTRAINT bus_safety_checks_bus_id_item_key_key UNIQUE (bus_id, item_key);


--
-- Name: bus_safety_checks bus_safety_checks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bus_safety_checks
    ADD CONSTRAINT bus_safety_checks_pkey PRIMARY KEY (id);


--
-- Name: bus_service_logs bus_service_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bus_service_logs
    ADD CONSTRAINT bus_service_logs_pkey PRIMARY KEY (id);


--
-- Name: buses buses_bus_no_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.buses
    ADD CONSTRAINT buses_bus_no_key UNIQUE (bus_no);


--
-- Name: buses buses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.buses
    ADD CONSTRAINT buses_pkey PRIMARY KEY (id);


--
-- Name: buses buses_vehicle_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.buses
    ADD CONSTRAINT buses_vehicle_number_key UNIQUE (vehicle_number);


--
-- Name: calendar_events calendar_holidays_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.calendar_events
    ADD CONSTRAINT calendar_holidays_pkey PRIMARY KEY (id);


--
-- Name: campus_outing_requests campus_outing_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campus_outing_requests
    ADD CONSTRAINT campus_outing_requests_pkey PRIMARY KEY (id);


--
-- Name: canteen_bills canteen_bills_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.canteen_bills
    ADD CONSTRAINT canteen_bills_pkey PRIMARY KEY (id);


--
-- Name: canteen_dish_categories canteen_dish_categories_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.canteen_dish_categories
    ADD CONSTRAINT canteen_dish_categories_name_key UNIQUE (name);


--
-- Name: canteen_dish_categories canteen_dish_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.canteen_dish_categories
    ADD CONSTRAINT canteen_dish_categories_pkey PRIMARY KEY (id);


--
-- Name: canteen_dishes canteen_dishes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.canteen_dishes
    ADD CONSTRAINT canteen_dishes_pkey PRIMARY KEY (id);


--
-- Name: canteen_expense_categories canteen_expense_categories_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.canteen_expense_categories
    ADD CONSTRAINT canteen_expense_categories_name_key UNIQUE (name);


--
-- Name: canteen_expense_categories canteen_expense_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.canteen_expense_categories
    ADD CONSTRAINT canteen_expense_categories_pkey PRIMARY KEY (id);


--
-- Name: canteen_expense_products canteen_expense_products_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.canteen_expense_products
    ADD CONSTRAINT canteen_expense_products_pkey PRIMARY KEY (id);


--
-- Name: canteen_expenses canteen_expenses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.canteen_expenses
    ADD CONSTRAINT canteen_expenses_pkey PRIMARY KEY (id);


--
-- Name: canteen_gst_rates canteen_gst_rates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.canteen_gst_rates
    ADD CONSTRAINT canteen_gst_rates_pkey PRIMARY KEY (id);


--
-- Name: canteen_ingredients canteen_ingredients_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.canteen_ingredients
    ADD CONSTRAINT canteen_ingredients_name_key UNIQUE (name);


--
-- Name: canteen_ingredients canteen_ingredients_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.canteen_ingredients
    ADD CONSTRAINT canteen_ingredients_pkey PRIMARY KEY (id);


--
-- Name: canteen_order_items canteen_order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.canteen_order_items
    ADD CONSTRAINT canteen_order_items_pkey PRIMARY KEY (id);


--
-- Name: canteen_orders canteen_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.canteen_orders
    ADD CONSTRAINT canteen_orders_pkey PRIMARY KEY (id);


--
-- Name: canteen_recipe_ingredients canteen_recipe_ingredients_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.canteen_recipe_ingredients
    ADD CONSTRAINT canteen_recipe_ingredients_pkey PRIMARY KEY (id);


--
-- Name: canteen_recipe_ingredients canteen_recipe_ingredients_recipe_id_ingredient_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.canteen_recipe_ingredients
    ADD CONSTRAINT canteen_recipe_ingredients_recipe_id_ingredient_id_key UNIQUE (recipe_id, ingredient_id);


--
-- Name: canteen_recipes canteen_recipes_dish_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.canteen_recipes
    ADD CONSTRAINT canteen_recipes_dish_id_key UNIQUE (dish_id);


--
-- Name: canteen_recipes canteen_recipes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.canteen_recipes
    ADD CONSTRAINT canteen_recipes_pkey PRIMARY KEY (id);


--
-- Name: canteen_settings canteen_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.canteen_settings
    ADD CONSTRAINT canteen_settings_pkey PRIMARY KEY (id);


--
-- Name: canteen_stock_batches canteen_stock_batches_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.canteen_stock_batches
    ADD CONSTRAINT canteen_stock_batches_pkey PRIMARY KEY (id);


--
-- Name: canteen_stock_transactions canteen_stock_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.canteen_stock_transactions
    ADD CONSTRAINT canteen_stock_transactions_pkey PRIMARY KEY (id);


--
-- Name: canteen_todays_specials canteen_todays_specials_meal_type_display_order_special_dat_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.canteen_todays_specials
    ADD CONSTRAINT canteen_todays_specials_meal_type_display_order_special_dat_key UNIQUE (meal_type, display_order, special_date);


--
-- Name: canteen_todays_specials canteen_todays_specials_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.canteen_todays_specials
    ADD CONSTRAINT canteen_todays_specials_pkey PRIMARY KEY (id);


--
-- Name: certificate_requests certificate_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.certificate_requests
    ADD CONSTRAINT certificate_requests_pkey PRIMARY KEY (id);


--
-- Name: certificate_types certificate_types_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.certificate_types
    ADD CONSTRAINT certificate_types_name_key UNIQUE (name);


--
-- Name: certificate_types certificate_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.certificate_types
    ADD CONSTRAINT certificate_types_pkey PRIMARY KEY (id);


--
-- Name: chat_conversations chat_conversations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_conversations
    ADD CONSTRAINT chat_conversations_pkey PRIMARY KEY (id);


--
-- Name: chat_messages chat_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT chat_messages_pkey PRIMARY KEY (id);


--
-- Name: class_mentors class_mentors_class_id_academic_year_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.class_mentors
    ADD CONSTRAINT class_mentors_class_id_academic_year_key UNIQUE (class_id, academic_year);


--
-- Name: class_mentors class_mentors_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.class_mentors
    ADD CONSTRAINT class_mentors_pkey PRIMARY KEY (id);


--
-- Name: class_subjects class_subjects_class_id_subject_id_semester_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.class_subjects
    ADD CONSTRAINT class_subjects_class_id_subject_id_semester_key UNIQUE (class_id, subject_id, semester);


--
-- Name: class_subjects class_subjects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.class_subjects
    ADD CONSTRAINT class_subjects_pkey PRIMARY KEY (id);


--
-- Name: classes classes_batch_id_course_id_section_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.classes
    ADD CONSTRAINT classes_batch_id_course_id_section_key UNIQUE (batch_id, course_id, section);


--
-- Name: classes classes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.classes
    ADD CONSTRAINT classes_pkey PRIMARY KEY (id);


--
-- Name: coe_notification_broadcasts coe_notification_broadcasts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coe_notification_broadcasts
    ADD CONSTRAINT coe_notification_broadcasts_pkey PRIMARY KEY (id);


--
-- Name: coe_profiles coe_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coe_profiles
    ADD CONSTRAINT coe_profiles_pkey PRIMARY KEY (id);


--
-- Name: companies companies_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_pkey PRIMARY KEY (id);


--
-- Name: condonation_requests condonation_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.condonation_requests
    ADD CONSTRAINT condonation_requests_pkey PRIMARY KEY (id);


--
-- Name: condonation_requests condonation_requests_student_id_exam_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.condonation_requests
    ADD CONSTRAINT condonation_requests_student_id_exam_id_key UNIQUE (student_id, exam_id);


--
-- Name: confidential_access_events confidential_access_events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.confidential_access_events
    ADD CONSTRAINT confidential_access_events_pkey PRIMARY KEY (id);


--
-- Name: convocation_registrations convocation_registrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.convocation_registrations
    ADD CONSTRAINT convocation_registrations_pkey PRIMARY KEY (id);


--
-- Name: convocation_registrations convocation_registrations_student_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.convocation_registrations
    ADD CONSTRAINT convocation_registrations_student_id_key UNIQUE (student_id);


--
-- Name: coordinator_calendar_entries coordinator_calendar_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coordinator_calendar_entries
    ADD CONSTRAINT coordinator_calendar_entries_pkey PRIMARY KEY (id);


--
-- Name: course_outcomes course_outcomes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_outcomes
    ADD CONSTRAINT course_outcomes_pkey PRIMARY KEY (id);


--
-- Name: course_outcomes course_outcomes_subject_id_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_outcomes
    ADD CONSTRAINT course_outcomes_subject_id_code_key UNIQUE (subject_id, code);


--
-- Name: course_result_status course_result_status_exam_subject_mapping_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_result_status
    ADD CONSTRAINT course_result_status_exam_subject_mapping_id_key UNIQUE (exam_subject_mapping_id);


--
-- Name: course_result_status course_result_status_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_result_status
    ADD CONSTRAINT course_result_status_pkey PRIMARY KEY (id);


--
-- Name: courses courses_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_code_key UNIQUE (code);


--
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (id);


--
-- Name: curriculum_mappings curriculum_mappings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.curriculum_mappings
    ADD CONSTRAINT curriculum_mappings_pkey PRIMARY KEY (id);


--
-- Name: demand_categories demand_categories_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.demand_categories
    ADD CONSTRAINT demand_categories_name_key UNIQUE (name);


--
-- Name: demand_categories demand_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.demand_categories
    ADD CONSTRAINT demand_categories_pkey PRIMARY KEY (id);


--
-- Name: department_achievements department_achievements_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.department_achievements
    ADD CONSTRAINT department_achievements_pkey PRIMARY KEY (id);


--
-- Name: department_documents department_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.department_documents
    ADD CONSTRAINT department_documents_pkey PRIMARY KEY (id);


--
-- Name: department_events department_events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.department_events
    ADD CONSTRAINT department_events_pkey PRIMARY KEY (id);


--
-- Name: department_labs department_labs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.department_labs
    ADD CONSTRAINT department_labs_pkey PRIMARY KEY (id);


--
-- Name: department_meetings department_meetings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.department_meetings
    ADD CONSTRAINT department_meetings_pkey PRIMARY KEY (id);


--
-- Name: department_mous department_mous_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.department_mous
    ADD CONSTRAINT department_mous_pkey PRIMARY KEY (id);


--
-- Name: department_research_funding department_research_funding_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.department_research_funding
    ADD CONSTRAINT department_research_funding_pkey PRIMARY KEY (id);


--
-- Name: departments departments_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_code_key UNIQUE (code);


--
-- Name: departments departments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_pkey PRIMARY KEY (id);


--
-- Name: designations designations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.designations
    ADD CONSTRAINT designations_pkey PRIMARY KEY (id);


--
-- Name: designations designations_title_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.designations
    ADD CONSTRAINT designations_title_key UNIQUE (title);


--
-- Name: device_push_tokens device_push_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.device_push_tokens
    ADD CONSTRAINT device_push_tokens_pkey PRIMARY KEY (id);


--
-- Name: device_push_tokens device_push_tokens_push_token_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.device_push_tokens
    ADD CONSTRAINT device_push_tokens_push_token_key UNIQUE (push_token);


--
-- Name: e_resources e_resources_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.e_resources
    ADD CONSTRAINT e_resources_pkey PRIMARY KEY (id);


--
-- Name: edc_documents edc_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.edc_documents
    ADD CONSTRAINT edc_documents_pkey PRIMARY KEY (id);


--
-- Name: edc_events edc_events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.edc_events
    ADD CONSTRAINT edc_events_pkey PRIMARY KEY (id);


--
-- Name: edc_funding_records edc_funding_records_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.edc_funding_records
    ADD CONSTRAINT edc_funding_records_pkey PRIMARY KEY (id);


--
-- Name: edc_reports edc_reports_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.edc_reports
    ADD CONSTRAINT edc_reports_pkey PRIMARY KEY (id);


--
-- Name: education_loan_dd education_loan_dd_dd_reference_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.education_loan_dd
    ADD CONSTRAINT education_loan_dd_dd_reference_number_key UNIQUE (dd_reference_number);


--
-- Name: education_loan_dd education_loan_dd_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.education_loan_dd
    ADD CONSTRAINT education_loan_dd_pkey PRIMARY KEY (id);


--
-- Name: exam_fee_transactions exam_fee_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exam_fee_transactions
    ADD CONSTRAINT exam_fee_transactions_pkey PRIMARY KEY (id);


--
-- Name: exam_fee_transactions exam_fee_transactions_receipt_no_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exam_fee_transactions
    ADD CONSTRAINT exam_fee_transactions_receipt_no_key UNIQUE (receipt_no);


--
-- Name: exam_marks exam_marks_exam_subject_mapping_id_student_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exam_marks
    ADD CONSTRAINT exam_marks_exam_subject_mapping_id_student_id_key UNIQUE (exam_subject_mapping_id, student_id);


--
-- Name: exam_marks exam_marks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exam_marks
    ADD CONSTRAINT exam_marks_pkey PRIMARY KEY (id);


--
-- Name: exam_pass_rules_settings exam_pass_rules_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exam_pass_rules_settings
    ADD CONSTRAINT exam_pass_rules_settings_pkey PRIMARY KEY (id);


--
-- Name: exam_registrations exam_registrations_exam_id_student_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exam_registrations
    ADD CONSTRAINT exam_registrations_exam_id_student_id_key UNIQUE (exam_id, student_id);


--
-- Name: exam_registrations exam_registrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exam_registrations
    ADD CONSTRAINT exam_registrations_pkey PRIMARY KEY (id);


--
-- Name: exam_subject_mapping exam_subject_mapping_exam_id_class_id_subject_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exam_subject_mapping
    ADD CONSTRAINT exam_subject_mapping_exam_id_class_id_subject_id_key UNIQUE (exam_id, class_id, subject_id);


--
-- Name: exam_subject_mapping exam_subject_mapping_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exam_subject_mapping
    ADD CONSTRAINT exam_subject_mapping_pkey PRIMARY KEY (id);


--
-- Name: exam_timetable exam_timetable_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exam_timetable
    ADD CONSTRAINT exam_timetable_pkey PRIMARY KEY (id);


--
-- Name: exam_timetable exam_timetable_version_id_exam_subject_mapping_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exam_timetable
    ADD CONSTRAINT exam_timetable_version_id_exam_subject_mapping_id_key UNIQUE (version_id, exam_subject_mapping_id);


--
-- Name: exam_timetable_versions exam_timetable_versions_exam_id_department_id_version_numbe_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exam_timetable_versions
    ADD CONSTRAINT exam_timetable_versions_exam_id_department_id_version_numbe_key UNIQUE (exam_id, department_id, version_number);


--
-- Name: exam_timetable_versions exam_timetable_versions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exam_timetable_versions
    ADD CONSTRAINT exam_timetable_versions_pkey PRIMARY KEY (id);


--
-- Name: exam_types exam_types_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exam_types
    ADD CONSTRAINT exam_types_name_key UNIQUE (name);


--
-- Name: exam_types exam_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exam_types
    ADD CONSTRAINT exam_types_pkey PRIMARY KEY (id);


--
-- Name: exams exams_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exams
    ADD CONSTRAINT exams_pkey PRIMARY KEY (id);


--
-- Name: expense_categories expense_categories_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.expense_categories
    ADD CONSTRAINT expense_categories_name_key UNIQUE (name);


--
-- Name: expense_categories expense_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.expense_categories
    ADD CONSTRAINT expense_categories_pkey PRIMARY KEY (id);


--
-- Name: expenses expenses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_pkey PRIMARY KEY (id);


--
-- Name: faculty_activity_log faculty_activity_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_activity_log
    ADD CONSTRAINT faculty_activity_log_pkey PRIMARY KEY (id);


--
-- Name: faculty_attendance_corrections faculty_attendance_corrections_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_attendance_corrections
    ADD CONSTRAINT faculty_attendance_corrections_pkey PRIMARY KEY (id);


--
-- Name: faculty_awards faculty_awards_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_awards
    ADD CONSTRAINT faculty_awards_pkey PRIMARY KEY (id);


--
-- Name: faculty_certifications faculty_certifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_certifications
    ADD CONSTRAINT faculty_certifications_pkey PRIMARY KEY (id);


--
-- Name: faculty_committee_roles faculty_committee_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_committee_roles
    ADD CONSTRAINT faculty_committee_roles_pkey PRIMARY KEY (id);


--
-- Name: faculty_daily_attendance faculty_daily_attendance_faculty_id_attendance_date_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_daily_attendance
    ADD CONSTRAINT faculty_daily_attendance_faculty_id_attendance_date_key UNIQUE (faculty_id, attendance_date);


--
-- Name: faculty_daily_attendance faculty_daily_attendance_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_daily_attendance
    ADD CONSTRAINT faculty_daily_attendance_pkey PRIMARY KEY (id);


--
-- Name: faculty_development_programs faculty_development_programs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_development_programs
    ADD CONSTRAINT faculty_development_programs_pkey PRIMARY KEY (id);


--
-- Name: faculty_documents faculty_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_documents
    ADD CONSTRAINT faculty_documents_pkey PRIMARY KEY (id);


--
-- Name: faculty_feedback_forms faculty_feedback_forms_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_feedback_forms
    ADD CONSTRAINT faculty_feedback_forms_pkey PRIMARY KEY (id);


--
-- Name: faculty_feedback_questions faculty_feedback_questions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_feedback_questions
    ADD CONSTRAINT faculty_feedback_questions_pkey PRIMARY KEY (id);


--
-- Name: faculty_feedback_responses faculty_feedback_responses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_feedback_responses
    ADD CONSTRAINT faculty_feedback_responses_pkey PRIMARY KEY (id);


--
-- Name: faculty_feedback_responses faculty_feedback_responses_question_faculty_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_feedback_responses
    ADD CONSTRAINT faculty_feedback_responses_question_faculty_key UNIQUE (question_id, faculty_id);


--
-- Name: faculty_holiday_mapping faculty_holiday_mapping_faculty_id_holiday_slot_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_holiday_mapping
    ADD CONSTRAINT faculty_holiday_mapping_faculty_id_holiday_slot_id_key UNIQUE (faculty_id, holiday_slot_id);


--
-- Name: faculty_holiday_mapping faculty_holiday_mapping_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_holiday_mapping
    ADD CONSTRAINT faculty_holiday_mapping_pkey PRIMARY KEY (id);


--
-- Name: faculty_hostel_mapping faculty_hostel_mapping_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_hostel_mapping
    ADD CONSTRAINT faculty_hostel_mapping_pkey PRIMARY KEY (id);


--
-- Name: faculty_id_card_issuances faculty_id_card_issuances_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_id_card_issuances
    ADD CONSTRAINT faculty_id_card_issuances_pkey PRIMARY KEY (id);


--
-- Name: faculty_leave_balances faculty_leave_balances_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_leave_balances
    ADD CONSTRAINT faculty_leave_balances_pkey PRIMARY KEY (id);


--
-- Name: faculty_leave_balances faculty_leave_balances_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_leave_balances
    ADD CONSTRAINT faculty_leave_balances_unique UNIQUE (faculty_id, leave_type_id, academic_year);


--
-- Name: faculty_leaves faculty_leaves_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_leaves
    ADD CONSTRAINT faculty_leaves_pkey PRIMARY KEY (id);


--
-- Name: faculty_od_requests faculty_od_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_od_requests
    ADD CONSTRAINT faculty_od_requests_pkey PRIMARY KEY (id);


--
-- Name: patent_inventors faculty_patent_inventors_patent_id_faculty_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.patent_inventors
    ADD CONSTRAINT faculty_patent_inventors_patent_id_faculty_id_key UNIQUE (patent_id, faculty_id);


--
-- Name: patent_inventors faculty_patent_inventors_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.patent_inventors
    ADD CONSTRAINT faculty_patent_inventors_pkey PRIMARY KEY (id);


--
-- Name: patents faculty_patents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.patents
    ADD CONSTRAINT faculty_patents_pkey PRIMARY KEY (id);


--
-- Name: faculty faculty_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty
    ADD CONSTRAINT faculty_pkey PRIMARY KEY (id);


--
-- Name: publications faculty_publications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.publications
    ADD CONSTRAINT faculty_publications_pkey PRIMARY KEY (id);


--
-- Name: research_project_members faculty_research_project_members_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.research_project_members
    ADD CONSTRAINT faculty_research_project_members_pkey PRIMARY KEY (id);


--
-- Name: research_project_members faculty_research_project_members_project_id_faculty_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.research_project_members
    ADD CONSTRAINT faculty_research_project_members_project_id_faculty_id_key UNIQUE (project_id, faculty_id);


--
-- Name: research_projects faculty_research_projects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.research_projects
    ADD CONSTRAINT faculty_research_projects_pkey PRIMARY KEY (id);


--
-- Name: faculty_sensitive_info faculty_sensitive_info_faculty_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_sensitive_info
    ADD CONSTRAINT faculty_sensitive_info_faculty_id_key UNIQUE (faculty_id);


--
-- Name: faculty_sensitive_info faculty_sensitive_info_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_sensitive_info
    ADD CONSTRAINT faculty_sensitive_info_pkey PRIMARY KEY (id);


--
-- Name: faculty faculty_staff_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty
    ADD CONSTRAINT faculty_staff_code_key UNIQUE (staff_code);


--
-- Name: faculty_subject_class_mapping faculty_subject_class_mapping_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_subject_class_mapping
    ADD CONSTRAINT faculty_subject_class_mapping_pkey PRIMARY KEY (id);


--
-- Name: faculty_subject_class_mapping faculty_subject_class_mapping_subject_id_class_id_academic__key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_subject_class_mapping
    ADD CONSTRAINT faculty_subject_class_mapping_subject_id_class_id_academic__key UNIQUE (subject_id, class_id, academic_year);


--
-- Name: faculty faculty_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty
    ADD CONSTRAINT faculty_user_id_key UNIQUE (user_id);


--
-- Name: fee_concessions fee_concessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fee_concessions
    ADD CONSTRAINT fee_concessions_pkey PRIMARY KEY (id);


--
-- Name: fee_payment_gateway_orders fee_payment_gateway_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fee_payment_gateway_orders
    ADD CONSTRAINT fee_payment_gateway_orders_pkey PRIMARY KEY (id);


--
-- Name: fee_payment_gateway_orders fee_payment_gateway_orders_razorpay_order_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fee_payment_gateway_orders
    ADD CONSTRAINT fee_payment_gateway_orders_razorpay_order_id_key UNIQUE (razorpay_order_id);


--
-- Name: fee_payments fee_payments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fee_payments
    ADD CONSTRAINT fee_payments_pkey PRIMARY KEY (id);


--
-- Name: fee_payments fee_payments_receipt_no_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fee_payments
    ADD CONSTRAINT fee_payments_receipt_no_key UNIQUE (receipt_no);


--
-- Name: fee_receipt_number_payments fee_receipt_number_payments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fee_receipt_number_payments
    ADD CONSTRAINT fee_receipt_number_payments_pkey PRIMARY KEY (receipt_number_id, fee_payment_id);


--
-- Name: fee_receipt_numbers fee_receipt_numbers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fee_receipt_numbers
    ADD CONSTRAINT fee_receipt_numbers_pkey PRIMARY KEY (id);


--
-- Name: fee_structure_items fee_structure_items_fee_structure_id_demand_category_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fee_structure_items
    ADD CONSTRAINT fee_structure_items_fee_structure_id_demand_category_id_key UNIQUE (fee_structure_id, demand_category_id);


--
-- Name: fee_structure_items fee_structure_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fee_structure_items
    ADD CONSTRAINT fee_structure_items_pkey PRIMARY KEY (id);


--
-- Name: fee_structures fee_structures_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fee_structures
    ADD CONSTRAINT fee_structures_pkey PRIMARY KEY (id);


--
-- Name: feedback_assignment_questions feedback_assignment_questions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feedback_assignment_questions
    ADD CONSTRAINT feedback_assignment_questions_pkey PRIMARY KEY (id);


--
-- Name: feedback_assignments feedback_assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feedback_assignments
    ADD CONSTRAINT feedback_assignments_pkey PRIMARY KEY (id);


--
-- Name: feedback_faculty_responses feedback_faculty_responses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feedback_faculty_responses
    ADD CONSTRAINT feedback_faculty_responses_pkey PRIMARY KEY (id);


--
-- Name: feedback_forms feedback_forms_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feedback_forms
    ADD CONSTRAINT feedback_forms_pkey PRIMARY KEY (id);


--
-- Name: feedback_question_templates feedback_question_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feedback_question_templates
    ADD CONSTRAINT feedback_question_templates_pkey PRIMARY KEY (id);


--
-- Name: feedback_questions feedback_questions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feedback_questions
    ADD CONSTRAINT feedback_questions_pkey PRIMARY KEY (id);


--
-- Name: feedback_rating_scale_options feedback_rating_scale_options_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feedback_rating_scale_options
    ADD CONSTRAINT feedback_rating_scale_options_pkey PRIMARY KEY (id);


--
-- Name: feedback_rating_scales feedback_rating_scales_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feedback_rating_scales
    ADD CONSTRAINT feedback_rating_scales_pkey PRIMARY KEY (id);


--
-- Name: feedback_responses feedback_responses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feedback_responses
    ADD CONSTRAINT feedback_responses_pkey PRIMARY KEY (id);


--
-- Name: feedback_responses feedback_responses_question_id_student_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feedback_responses
    ADD CONSTRAINT feedback_responses_question_id_student_id_key UNIQUE (question_id, student_id);


--
-- Name: finance_audit_log finance_audit_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_audit_log
    ADD CONSTRAINT finance_audit_log_pkey PRIMARY KEY (id);


--
-- Name: finance_funds finance_funds_academic_year_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_funds
    ADD CONSTRAINT finance_funds_academic_year_key UNIQUE (academic_year);


--
-- Name: finance_funds finance_funds_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_funds
    ADD CONSTRAINT finance_funds_pkey PRIMARY KEY (id);


--
-- Name: finance_ledger_entries finance_ledger_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_ledger_entries
    ADD CONSTRAINT finance_ledger_entries_pkey PRIMARY KEY (id);


--
-- Name: finance_order_allotments finance_order_allotments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_order_allotments
    ADD CONSTRAINT finance_order_allotments_pkey PRIMARY KEY (id);


--
-- Name: finance_order_tracking_events finance_order_tracking_events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_order_tracking_events
    ADD CONSTRAINT finance_order_tracking_events_pkey PRIMARY KEY (id);


--
-- Name: finance_order_tracking finance_order_tracking_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_order_tracking
    ADD CONSTRAINT finance_order_tracking_pkey PRIMARY KEY (id);


--
-- Name: finance_order_tracking finance_order_tracking_purchase_order_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_order_tracking
    ADD CONSTRAINT finance_order_tracking_purchase_order_id_key UNIQUE (purchase_order_id);


--
-- Name: finance_order_tracking finance_order_tracking_service_order_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_order_tracking
    ADD CONSTRAINT finance_order_tracking_service_order_id_key UNIQUE (service_order_id);


--
-- Name: finance_proposal_assignments finance_proposal_assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_proposal_assignments
    ADD CONSTRAINT finance_proposal_assignments_pkey PRIMARY KEY (id);


--
-- Name: grade_bands grade_bands_grade_label_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grade_bands
    ADD CONSTRAINT grade_bands_grade_label_key UNIQUE (grade_label);


--
-- Name: grade_bands grade_bands_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grade_bands
    ADD CONSTRAINT grade_bands_pkey PRIMARY KEY (id);


--
-- Name: grn grn_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grn
    ADD CONSTRAINT grn_pkey PRIMARY KEY (id);


--
-- Name: hall_plans hall_plans_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hall_plans
    ADD CONSTRAINT hall_plans_pkey PRIMARY KEY (id);


--
-- Name: hall_ticket_clearance_exceptions hall_ticket_clearance_excepti_student_id_exam_id_clearance__key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hall_ticket_clearance_exceptions
    ADD CONSTRAINT hall_ticket_clearance_excepti_student_id_exam_id_clearance__key UNIQUE (student_id, exam_id, clearance_type);


--
-- Name: hall_ticket_clearance_exceptions hall_ticket_clearance_exceptions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hall_ticket_clearance_exceptions
    ADD CONSTRAINT hall_ticket_clearance_exceptions_pkey PRIMARY KEY (id);


--
-- Name: hall_tickets hall_tickets_exam_id_student_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hall_tickets
    ADD CONSTRAINT hall_tickets_exam_id_student_id_key UNIQUE (exam_id, student_id);


--
-- Name: hall_tickets hall_tickets_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hall_tickets
    ADD CONSTRAINT hall_tickets_pkey PRIMARY KEY (id);


--
-- Name: higher_education_application_students higher_education_application_students_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.higher_education_application_students
    ADD CONSTRAINT higher_education_application_students_pkey PRIMARY KEY (id);


--
-- Name: higher_education_application_students higher_education_application_students_window_student_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.higher_education_application_students
    ADD CONSTRAINT higher_education_application_students_window_student_key UNIQUE (window_id, student_id);


--
-- Name: higher_education_application_windows higher_education_application_windows_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.higher_education_application_windows
    ADD CONSTRAINT higher_education_application_windows_pkey PRIMARY KEY (id);


--
-- Name: higher_education_calendar_events higher_education_calendar_events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.higher_education_calendar_events
    ADD CONSTRAINT higher_education_calendar_events_pkey PRIMARY KEY (id);


--
-- Name: higher_education_coaching_batches higher_education_coaching_batches_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.higher_education_coaching_batches
    ADD CONSTRAINT higher_education_coaching_batches_pkey PRIMARY KEY (id);


--
-- Name: higher_education_loans higher_education_loans_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.higher_education_loans
    ADD CONSTRAINT higher_education_loans_pkey PRIMARY KEY (id);


--
-- Name: higher_education_retake_watchlist higher_education_retake_watchlist_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.higher_education_retake_watchlist
    ADD CONSTRAINT higher_education_retake_watchlist_pkey PRIMARY KEY (id);


--
-- Name: higher_education_standing_returns higher_education_standing_returns_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.higher_education_standing_returns
    ADD CONSTRAINT higher_education_standing_returns_pkey PRIMARY KEY (id);


--
-- Name: higher_education_test_register higher_education_test_register_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.higher_education_test_register
    ADD CONSTRAINT higher_education_test_register_pkey PRIMARY KEY (test_name);


--
-- Name: higher_education_test_students higher_education_test_students_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.higher_education_test_students
    ADD CONSTRAINT higher_education_test_students_pkey PRIMARY KEY (id);


--
-- Name: higher_education_test_students higher_education_test_students_test_student_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.higher_education_test_students
    ADD CONSTRAINT higher_education_test_students_test_student_key UNIQUE (test_name, student_id);


--
-- Name: higher_education_universities higher_education_universities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.higher_education_universities
    ADD CONSTRAINT higher_education_universities_pkey PRIMARY KEY (id);


--
-- Name: holiday_slots holiday_slots_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.holiday_slots
    ADD CONSTRAINT holiday_slots_pkey PRIMARY KEY (id);


--
-- Name: hostel_blocks hostel_blocks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hostel_blocks
    ADD CONSTRAINT hostel_blocks_pkey PRIMARY KEY (id);


--
-- Name: hostel_complaints hostel_complaints_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hostel_complaints
    ADD CONSTRAINT hostel_complaints_pkey PRIMARY KEY (id);


--
-- Name: hostel_floors hostel_floors_block_id_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hostel_floors
    ADD CONSTRAINT hostel_floors_block_id_name_key UNIQUE (block_id, name);


--
-- Name: hostel_floors hostel_floors_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hostel_floors
    ADD CONSTRAINT hostel_floors_pkey PRIMARY KEY (id);


--
-- Name: hostel_goods hostel_goods_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hostel_goods
    ADD CONSTRAINT hostel_goods_pkey PRIMARY KEY (id);


--
-- Name: hostel_in_out_ledger hostel_in_out_ledger_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hostel_in_out_ledger
    ADD CONSTRAINT hostel_in_out_ledger_pkey PRIMARY KEY (id);


--
-- Name: hostel_mess_feedback hostel_mess_feedback_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hostel_mess_feedback
    ADD CONSTRAINT hostel_mess_feedback_pkey PRIMARY KEY (id);


--
-- Name: hostel_night_attendance hostel_night_attendance_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hostel_night_attendance
    ADD CONSTRAINT hostel_night_attendance_pkey PRIMARY KEY (id);


--
-- Name: hostel_night_attendance hostel_night_attendance_student_id_attendance_date_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hostel_night_attendance
    ADD CONSTRAINT hostel_night_attendance_student_id_attendance_date_key UNIQUE (student_id, attendance_date);


--
-- Name: hostel_outings hostel_outings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hostel_outings
    ADD CONSTRAINT hostel_outings_pkey PRIMARY KEY (id);


--
-- Name: hostel_quit_requests hostel_quit_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hostel_quit_requests
    ADD CONSTRAINT hostel_quit_requests_pkey PRIMARY KEY (id);


--
-- Name: hostel_room_types hostel_room_types_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hostel_room_types
    ADD CONSTRAINT hostel_room_types_name_key UNIQUE (name);


--
-- Name: hostel_room_types hostel_room_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hostel_room_types
    ADD CONSTRAINT hostel_room_types_pkey PRIMARY KEY (id);


--
-- Name: hostel_rooms hostel_rooms_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hostel_rooms
    ADD CONSTRAINT hostel_rooms_pkey PRIMARY KEY (id);


--
-- Name: hostel_settings hostel_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hostel_settings
    ADD CONSTRAINT hostel_settings_pkey PRIMARY KEY (id);


--
-- Name: hostel_wardens hostel_wardens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hostel_wardens
    ADD CONSTRAINT hostel_wardens_pkey PRIMARY KEY (id);


--
-- Name: hostels hostels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hostels
    ADD CONSTRAINT hostels_pkey PRIMARY KEY (id);


--
-- Name: hr_payroll_requests hr_payroll_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hr_payroll_requests
    ADD CONSTRAINT hr_payroll_requests_pkey PRIMARY KEY (id);


--
-- Name: hr_queries hr_queries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hr_queries
    ADD CONSTRAINT hr_queries_pkey PRIMARY KEY (id);


--
-- Name: incubation_milestones incubation_milestones_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.incubation_milestones
    ADD CONSTRAINT incubation_milestones_pkey PRIMARY KEY (id);


--
-- Name: incubations incubations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.incubations
    ADD CONSTRAINT incubations_pkey PRIMARY KEY (id);


--
-- Name: incubations incubations_student_entrepreneurship_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.incubations
    ADD CONSTRAINT incubations_student_entrepreneurship_id_key UNIQUE (student_entrepreneurship_id);


--
-- Name: invigilation_allocation_batches invigilation_allocation_batches_exam_id_exam_date_session_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invigilation_allocation_batches
    ADD CONSTRAINT invigilation_allocation_batches_exam_id_exam_date_session_key UNIQUE (exam_id, exam_date, session);


--
-- Name: invigilation_allocation_batches invigilation_allocation_batches_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invigilation_allocation_batches
    ADD CONSTRAINT invigilation_allocation_batches_pkey PRIMARY KEY (id);


--
-- Name: invigilation_duties invigilation_duties_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invigilation_duties
    ADD CONSTRAINT invigilation_duties_pkey PRIMARY KEY (id);


--
-- Name: iqac_accreditation_criteria iqac_accreditation_criteria_cycle_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.iqac_accreditation_criteria
    ADD CONSTRAINT iqac_accreditation_criteria_cycle_code_key UNIQUE (cycle, code);


--
-- Name: iqac_accreditation_criteria iqac_accreditation_criteria_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.iqac_accreditation_criteria
    ADD CONSTRAINT iqac_accreditation_criteria_pkey PRIMARY KEY (id);


--
-- Name: iqac_accreditation_evidence_items iqac_accreditation_evidence_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.iqac_accreditation_evidence_items
    ADD CONSTRAINT iqac_accreditation_evidence_items_pkey PRIMARY KEY (id);


--
-- Name: iqac_metric_targets iqac_metric_targets_metric_key_academic_year_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.iqac_metric_targets
    ADD CONSTRAINT iqac_metric_targets_metric_key_academic_year_key UNIQUE (metric_key, academic_year);


--
-- Name: iqac_metric_targets iqac_metric_targets_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.iqac_metric_targets
    ADD CONSTRAINT iqac_metric_targets_pkey PRIMARY KEY (id);


--
-- Name: leave_parent_acknowledgements leave_parent_acknowledgements_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leave_parent_acknowledgements
    ADD CONSTRAINT leave_parent_acknowledgements_pkey PRIMARY KEY (id);


--
-- Name: leave_types leave_types_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leave_types
    ADD CONSTRAINT leave_types_name_key UNIQUE (name);


--
-- Name: leave_types leave_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leave_types
    ADD CONSTRAINT leave_types_pkey PRIMARY KEY (id);


--
-- Name: lesson_plan_sessions lesson_plan_sessions_lesson_plan_id_sequence_no_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lesson_plan_sessions
    ADD CONSTRAINT lesson_plan_sessions_lesson_plan_id_sequence_no_key UNIQUE (lesson_plan_id, sequence_no);


--
-- Name: lesson_plan_sessions lesson_plan_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lesson_plan_sessions
    ADD CONSTRAINT lesson_plan_sessions_pkey PRIMARY KEY (id);


--
-- Name: lesson_plans lesson_plans_faculty_id_subject_id_class_id_semester_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lesson_plans
    ADD CONSTRAINT lesson_plans_faculty_id_subject_id_class_id_semester_key UNIQUE (faculty_id, subject_id, class_id, semester);


--
-- Name: lesson_plans lesson_plans_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lesson_plans
    ADD CONSTRAINT lesson_plans_pkey PRIMARY KEY (id);


--
-- Name: library_racks library_racks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.library_racks
    ADD CONSTRAINT library_racks_pkey PRIMARY KEY (id);


--
-- Name: library_settings library_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.library_settings
    ADD CONSTRAINT library_settings_pkey PRIMARY KEY (id);


--
-- Name: lms_folder_classes lms_folder_classes_folder_id_class_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lms_folder_classes
    ADD CONSTRAINT lms_folder_classes_folder_id_class_id_key UNIQUE (folder_id, class_id);


--
-- Name: lms_folder_classes lms_folder_classes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lms_folder_classes
    ADD CONSTRAINT lms_folder_classes_pkey PRIMARY KEY (id);


--
-- Name: lms_folders lms_folders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lms_folders
    ADD CONSTRAINT lms_folders_pkey PRIMARY KEY (id);


--
-- Name: lms_notes lms_notes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lms_notes
    ADD CONSTRAINT lms_notes_pkey PRIMARY KEY (id);


--
-- Name: lms_resources lms_resources_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lms_resources
    ADD CONSTRAINT lms_resources_pkey PRIMARY KEY (id);


--
-- Name: main_gate_in_out_ledger main_gate_in_out_ledger_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.main_gate_in_out_ledger
    ADD CONSTRAINT main_gate_in_out_ledger_pkey PRIMARY KEY (id);


--
-- Name: malpractice_incidents malpractice_incidents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.malpractice_incidents
    ADD CONSTRAINT malpractice_incidents_pkey PRIMARY KEY (id);


--
-- Name: marks_entry_locks marks_entry_locks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.marks_entry_locks
    ADD CONSTRAINT marks_entry_locks_pkey PRIMARY KEY (id);


--
-- Name: marksheets marksheets_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.marksheets
    ADD CONSTRAINT marksheets_pkey PRIMARY KEY (id);


--
-- Name: media_equipment media_equipment_asset_tag_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media_equipment
    ADD CONSTRAINT media_equipment_asset_tag_key UNIQUE (asset_tag);


--
-- Name: media_equipment_movements media_equipment_movements_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media_equipment_movements
    ADD CONSTRAINT media_equipment_movements_pkey PRIMARY KEY (id);


--
-- Name: media_equipment media_equipment_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media_equipment
    ADD CONSTRAINT media_equipment_pkey PRIMARY KEY (id);


--
-- Name: media_indents media_indents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media_indents
    ADD CONSTRAINT media_indents_pkey PRIMARY KEY (id);


--
-- Name: media_reports media_reports_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media_reports
    ADD CONSTRAINT media_reports_pkey PRIMARY KEY (id);


--
-- Name: media_request_status_log media_request_status_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media_request_status_log
    ADD CONSTRAINT media_request_status_log_pkey PRIMARY KEY (id);


--
-- Name: media_requests media_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media_requests
    ADD CONSTRAINT media_requests_pkey PRIMARY KEY (id);


--
-- Name: media_scorecard_targets media_scorecard_targets_metric_key_academic_year_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media_scorecard_targets
    ADD CONSTRAINT media_scorecard_targets_metric_key_academic_year_key UNIQUE (metric_key, academic_year);


--
-- Name: media_scorecard_targets media_scorecard_targets_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media_scorecard_targets
    ADD CONSTRAINT media_scorecard_targets_pkey PRIMARY KEY (id);


--
-- Name: media_shoot_assignments media_shoot_assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media_shoot_assignments
    ADD CONSTRAINT media_shoot_assignments_pkey PRIMARY KEY (id);


--
-- Name: media_team_members media_team_members_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media_team_members
    ADD CONSTRAINT media_team_members_pkey PRIMARY KEY (id);


--
-- Name: medical_appointment_windows medical_appointment_windows_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medical_appointment_windows
    ADD CONSTRAINT medical_appointment_windows_pkey PRIMARY KEY (id);


--
-- Name: medical_appointment_windows medical_appointment_windows_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medical_appointment_windows
    ADD CONSTRAINT medical_appointment_windows_unique UNIQUE (slot_date, start_time, end_time);


--
-- Name: medical_appointments medical_appointments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medical_appointments
    ADD CONSTRAINT medical_appointments_pkey PRIMARY KEY (id);


--
-- Name: medical_bill_items medical_bill_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medical_bill_items
    ADD CONSTRAINT medical_bill_items_pkey PRIMARY KEY (id);


--
-- Name: medical_bills medical_bills_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medical_bills
    ADD CONSTRAINT medical_bills_pkey PRIMARY KEY (id);


--
-- Name: medical_camp_registrations medical_camp_registrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medical_camp_registrations
    ADD CONSTRAINT medical_camp_registrations_pkey PRIMARY KEY (id);


--
-- Name: medical_camps medical_camps_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medical_camps
    ADD CONSTRAINT medical_camps_pkey PRIMARY KEY (id);


--
-- Name: medical_equipment medical_equipment_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medical_equipment
    ADD CONSTRAINT medical_equipment_pkey PRIMARY KEY (id);


--
-- Name: medical_services medical_services_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medical_services
    ADD CONSTRAINT medical_services_name_key UNIQUE (name);


--
-- Name: medical_services medical_services_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medical_services
    ADD CONSTRAINT medical_services_pkey PRIMARY KEY (id);


--
-- Name: medical_staff medical_staff_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medical_staff
    ADD CONSTRAINT medical_staff_pkey PRIMARY KEY (id);


--
-- Name: medical_visits medical_visits_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medical_visits
    ADD CONSTRAINT medical_visits_pkey PRIMARY KEY (id);


--
-- Name: meeting_action_items meeting_action_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.meeting_action_items
    ADD CONSTRAINT meeting_action_items_pkey PRIMARY KEY (id);


--
-- Name: message_conversations message_conversations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message_conversations
    ADD CONSTRAINT message_conversations_pkey PRIMARY KEY (id);


--
-- Name: message_participants message_participants_conversation_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message_participants
    ADD CONSTRAINT message_participants_conversation_id_user_id_key UNIQUE (conversation_id, user_id);


--
-- Name: message_participants message_participants_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message_participants
    ADD CONSTRAINT message_participants_pkey PRIMARY KEY (id);


--
-- Name: message_requests message_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message_requests
    ADD CONSTRAINT message_requests_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- Name: model_performance model_performance_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.model_performance
    ADD CONSTRAINT model_performance_pkey PRIMARY KEY (id);


--
-- Name: nba_criteria nba_criteria_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nba_criteria
    ADD CONSTRAINT nba_criteria_pkey PRIMARY KEY (id);


--
-- Name: nba_evidence_items nba_evidence_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nba_evidence_items
    ADD CONSTRAINT nba_evidence_items_pkey PRIMARY KEY (id);


--
-- Name: non_teaching_staff non_teaching_staff_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.non_teaching_staff
    ADD CONSTRAINT non_teaching_staff_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: od_request_hod_approvals od_request_hod_approvals_od_request_id_student_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.od_request_hod_approvals
    ADD CONSTRAINT od_request_hod_approvals_od_request_id_student_id_key UNIQUE (od_request_id, student_id);


--
-- Name: od_request_hod_approvals od_request_hod_approvals_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.od_request_hod_approvals
    ADD CONSTRAINT od_request_hod_approvals_pkey PRIMARY KEY (id);


--
-- Name: od_request_parent_acknowledgements od_request_parent_acknowledgements_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.od_request_parent_acknowledgements
    ADD CONSTRAINT od_request_parent_acknowledgements_pkey PRIMARY KEY (id);


--
-- Name: od_requests od_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.od_requests
    ADD CONSTRAINT od_requests_pkey PRIMARY KEY (id);


--
-- Name: od_team_members od_team_members_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.od_team_members
    ADD CONSTRAINT od_team_members_pkey PRIMARY KEY (id);


--
-- Name: od_team_members od_team_members_team_id_student_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.od_team_members
    ADD CONSTRAINT od_team_members_team_id_student_id_key UNIQUE (team_id, student_id);


--
-- Name: od_teams od_teams_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.od_teams
    ADD CONSTRAINT od_teams_pkey PRIMARY KEY (id);


--
-- Name: od_teams od_teams_unique_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.od_teams
    ADD CONSTRAINT od_teams_unique_code_key UNIQUE (unique_code);


--
-- Name: online_class_participants online_class_participants_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.online_class_participants
    ADD CONSTRAINT online_class_participants_pkey PRIMARY KEY (id);


--
-- Name: online_classes online_classes_livekit_room_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.online_classes
    ADD CONSTRAINT online_classes_livekit_room_name_key UNIQUE (livekit_room_name);


--
-- Name: online_classes online_classes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.online_classes
    ADD CONSTRAINT online_classes_pkey PRIMARY KEY (id);


--
-- Name: online_classes online_classes_subject_id_class_id_class_date_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.online_classes
    ADD CONSTRAINT online_classes_subject_id_class_id_class_date_key UNIQUE (subject_id, class_id, class_date);


--
-- Name: outcome_attainments outcome_attainments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.outcome_attainments
    ADD CONSTRAINT outcome_attainments_pkey PRIMARY KEY (id);


--
-- Name: parent_feedback parent_feedback_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.parent_feedback
    ADD CONSTRAINT parent_feedback_pkey PRIMARY KEY (id);


--
-- Name: parent_student_mapping parent_student_mapping_parent_user_id_student_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.parent_student_mapping
    ADD CONSTRAINT parent_student_mapping_parent_user_id_student_id_key UNIQUE (parent_user_id, student_id);


--
-- Name: parent_student_mapping parent_student_mapping_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.parent_student_mapping
    ADD CONSTRAINT parent_student_mapping_pkey PRIMARY KEY (id);


--
-- Name: pass_board_course_grace pass_board_course_grace_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pass_board_course_grace
    ADD CONSTRAINT pass_board_course_grace_pkey PRIMARY KEY (id);


--
-- Name: pass_board_course_grace pass_board_course_grace_sheet_id_exam_subject_mapping_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pass_board_course_grace
    ADD CONSTRAINT pass_board_course_grace_sheet_id_exam_subject_mapping_id_key UNIQUE (sheet_id, exam_subject_mapping_id);


--
-- Name: pass_board_sheets pass_board_sheets_exam_id_phase_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pass_board_sheets
    ADD CONSTRAINT pass_board_sheets_exam_id_phase_key UNIQUE (exam_id, phase);


--
-- Name: pass_board_sheets pass_board_sheets_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pass_board_sheets
    ADD CONSTRAINT pass_board_sheets_pkey PRIMARY KEY (id);


--
-- Name: pass_board_signoffs pass_board_signoffs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pass_board_signoffs
    ADD CONSTRAINT pass_board_signoffs_pkey PRIMARY KEY (id);


--
-- Name: pass_board_signoffs pass_board_signoffs_sheet_id_member_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pass_board_signoffs
    ADD CONSTRAINT pass_board_signoffs_sheet_id_member_name_key UNIQUE (sheet_id, member_name);


--
-- Name: payslip_requests payslip_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payslip_requests
    ADD CONSTRAINT payslip_requests_pkey PRIMARY KEY (id);


--
-- Name: period_timings period_timings_period_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.period_timings
    ADD CONSTRAINT period_timings_period_number_key UNIQUE (period_number);


--
-- Name: period_timings period_timings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.period_timings
    ADD CONSTRAINT period_timings_pkey PRIMARY KEY (id);


--
-- Name: personal_calendar_entries personal_calendar_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.personal_calendar_entries
    ADD CONSTRAINT personal_calendar_entries_pkey PRIMARY KEY (id);


--
-- Name: pharmacy_dispense_log pharmacy_dispense_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pharmacy_dispense_log
    ADD CONSTRAINT pharmacy_dispense_log_pkey PRIMARY KEY (id);


--
-- Name: pharmacy_stock pharmacy_stock_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pharmacy_stock
    ADD CONSTRAINT pharmacy_stock_pkey PRIMARY KEY (id);


--
-- Name: photocopy_requests photocopy_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.photocopy_requests
    ADD CONSTRAINT photocopy_requests_pkey PRIMARY KEY (id);


--
-- Name: photocopy_requests photocopy_requests_student_id_exam_marks_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.photocopy_requests
    ADD CONSTRAINT photocopy_requests_student_id_exam_marks_id_key UNIQUE (student_id, exam_marks_id);


--
-- Name: placement_drives placement_drives_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.placement_drives
    ADD CONSTRAINT placement_drives_pkey PRIMARY KEY (id);


--
-- Name: placement_interviews placement_interviews_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.placement_interviews
    ADD CONSTRAINT placement_interviews_pkey PRIMARY KEY (id);


--
-- Name: placement_todos placement_todos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.placement_todos
    ADD CONSTRAINT placement_todos_pkey PRIMARY KEY (id);


--
-- Name: program_outcomes program_outcomes_department_id_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.program_outcomes
    ADD CONSTRAINT program_outcomes_department_id_code_key UNIQUE (department_id, code);


--
-- Name: program_outcomes program_outcomes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.program_outcomes
    ADD CONSTRAINT program_outcomes_pkey PRIMARY KEY (id);


--
-- Name: project_join_requests project_join_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_join_requests
    ADD CONSTRAINT project_join_requests_pkey PRIMARY KEY (id);


--
-- Name: project_recruitment_posts project_recruitment_posts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_recruitment_posts
    ADD CONSTRAINT project_recruitment_posts_pkey PRIMARY KEY (id);


--
-- Name: project_team_members project_team_members_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_team_members
    ADD CONSTRAINT project_team_members_pkey PRIMARY KEY (id);


--
-- Name: project_teams project_teams_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_teams
    ADD CONSTRAINT project_teams_pkey PRIMARY KEY (id);


--
-- Name: project_teams project_teams_team_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_teams
    ADD CONSTRAINT project_teams_team_name_key UNIQUE (team_name);


--
-- Name: publication_contributors publication_contributors_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.publication_contributors
    ADD CONSTRAINT publication_contributors_pkey PRIMARY KEY (id);


--
-- Name: purchase_indents purchase_indents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.purchase_indents
    ADD CONSTRAINT purchase_indents_pkey PRIMARY KEY (id);


--
-- Name: purchase_order_proposals purchase_order_proposals_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.purchase_order_proposals
    ADD CONSTRAINT purchase_order_proposals_pkey PRIMARY KEY (id);


--
-- Name: purchase_orders purchase_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT purchase_orders_pkey PRIMARY KEY (id);


--
-- Name: purchase_orders purchase_orders_po_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT purchase_orders_po_number_key UNIQUE (po_number);


--
-- Name: purchase_orders purchase_orders_proposal_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT purchase_orders_proposal_id_key UNIQUE (proposal_id);


--
-- Name: query_logs query_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.query_logs
    ADD CONSTRAINT query_logs_pkey PRIMARY KEY (id);


--
-- Name: question_papers question_papers_exam_subject_mapping_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.question_papers
    ADD CONSTRAINT question_papers_exam_subject_mapping_id_key UNIQUE (exam_subject_mapping_id);


--
-- Name: question_papers question_papers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.question_papers
    ADD CONSTRAINT question_papers_pkey PRIMARY KEY (id);


--
-- Name: quotas quotas_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quotas
    ADD CONSTRAINT quotas_name_key UNIQUE (name);


--
-- Name: quotas quotas_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quotas
    ADD CONSTRAINT quotas_pkey PRIMARY KEY (id);


--
-- Name: refunds refunds_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refunds
    ADD CONSTRAINT refunds_pkey PRIMARY KEY (id);


--
-- Name: refunds refunds_request_no_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refunds
    ADD CONSTRAINT refunds_request_no_key UNIQUE (request_no);


--
-- Name: regulation_courses regulation_courses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.regulation_courses
    ADD CONSTRAINT regulation_courses_pkey PRIMARY KEY (id);


--
-- Name: regulation_courses regulation_courses_regulation_id_course_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.regulation_courses
    ADD CONSTRAINT regulation_courses_regulation_id_course_id_key UNIQUE (regulation_id, course_id);


--
-- Name: regulations regulations_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.regulations
    ADD CONSTRAINT regulations_code_key UNIQUE (code);


--
-- Name: regulations regulations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.regulations
    ADD CONSTRAINT regulations_pkey PRIMARY KEY (id);


--
-- Name: result_publications result_publications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.result_publications
    ADD CONSTRAINT result_publications_pkey PRIMARY KEY (id);


--
-- Name: revaluation_requests revaluation_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.revaluation_requests
    ADD CONSTRAINT revaluation_requests_pkey PRIMARY KEY (id);


--
-- Name: revaluation_windows revaluation_windows_exam_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.revaluation_windows
    ADD CONSTRAINT revaluation_windows_exam_id_key UNIQUE (exam_id);


--
-- Name: revaluation_windows revaluation_windows_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.revaluation_windows
    ADD CONSTRAINT revaluation_windows_pkey PRIMARY KEY (id);


--
-- Name: roles roles_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key UNIQUE (name);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: salary_divisions salary_divisions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.salary_divisions
    ADD CONSTRAINT salary_divisions_pkey PRIMARY KEY (id);


--
-- Name: salary_payments salary_payments_faculty_period_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.salary_payments
    ADD CONSTRAINT salary_payments_faculty_period_unique UNIQUE (faculty_id, year, month);


--
-- Name: salary_payments salary_payments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.salary_payments
    ADD CONSTRAINT salary_payments_pkey PRIMARY KEY (id);


--
-- Name: scholarship_schemes scholarship_schemes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.scholarship_schemes
    ADD CONSTRAINT scholarship_schemes_pkey PRIMARY KEY (id);


--
-- Name: script_archive_bundles script_archive_bundles_bundle_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.script_archive_bundles
    ADD CONSTRAINT script_archive_bundles_bundle_id_key UNIQUE (bundle_id);


--
-- Name: script_archive_bundles script_archive_bundles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.script_archive_bundles
    ADD CONSTRAINT script_archive_bundles_pkey PRIMARY KEY (id);


--
-- Name: script_bundle_marks script_bundle_marks_bundle_id_dummy_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.script_bundle_marks
    ADD CONSTRAINT script_bundle_marks_bundle_id_dummy_number_key UNIQUE (bundle_id, dummy_number);


--
-- Name: script_bundle_marks script_bundle_marks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.script_bundle_marks
    ADD CONSTRAINT script_bundle_marks_pkey PRIMARY KEY (id);


--
-- Name: script_bundle_scripts script_bundle_scripts_bundle_id_dummy_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.script_bundle_scripts
    ADD CONSTRAINT script_bundle_scripts_bundle_id_dummy_number_key UNIQUE (bundle_id, dummy_number);


--
-- Name: script_bundle_scripts script_bundle_scripts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.script_bundle_scripts
    ADD CONSTRAINT script_bundle_scripts_pkey PRIMARY KEY (id);


--
-- Name: script_bundles script_bundles_bundle_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.script_bundles
    ADD CONSTRAINT script_bundles_bundle_code_key UNIQUE (bundle_code);


--
-- Name: script_bundles script_bundles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.script_bundles
    ADD CONSTRAINT script_bundles_pkey PRIMARY KEY (id);


--
-- Name: script_retrieval_requests script_retrieval_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.script_retrieval_requests
    ADD CONSTRAINT script_retrieval_requests_pkey PRIMARY KEY (id);


--
-- Name: seating_arrangements seating_arrangements_hall_plan_id_seat_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seating_arrangements
    ADD CONSTRAINT seating_arrangements_hall_plan_id_seat_number_key UNIQUE (hall_plan_id, seat_number);


--
-- Name: seating_arrangements seating_arrangements_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seating_arrangements
    ADD CONSTRAINT seating_arrangements_pkey PRIMARY KEY (id);


--
-- Name: seating_plan_venue_departments seating_plan_venue_departments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seating_plan_venue_departments
    ADD CONSTRAINT seating_plan_venue_departments_pkey PRIMARY KEY (id);


--
-- Name: seating_plan_venue_departments seating_plan_venue_departments_version_venue_id_department__key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seating_plan_venue_departments
    ADD CONSTRAINT seating_plan_venue_departments_version_venue_id_department__key UNIQUE (version_venue_id, department_id);


--
-- Name: seating_plan_version_venues seating_plan_version_venues_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seating_plan_version_venues
    ADD CONSTRAINT seating_plan_version_venues_pkey PRIMARY KEY (id);


--
-- Name: seating_plan_version_venues seating_plan_version_venues_version_id_venue_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seating_plan_version_venues
    ADD CONSTRAINT seating_plan_version_venues_version_id_venue_id_key UNIQUE (version_id, venue_id);


--
-- Name: seating_plan_versions seating_plan_versions_exam_id_exam_date_session_version_num_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seating_plan_versions
    ADD CONSTRAINT seating_plan_versions_exam_id_exam_date_session_version_num_key UNIQUE (exam_id, exam_date, session, version_number);


--
-- Name: seating_plan_versions seating_plan_versions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seating_plan_versions
    ADD CONSTRAINT seating_plan_versions_pkey PRIMARY KEY (id);


--
-- Name: secretary_product_request_items secretary_product_request_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.secretary_product_request_items
    ADD CONSTRAINT secretary_product_request_items_pkey PRIMARY KEY (id);


--
-- Name: secretary_product_requests secretary_product_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.secretary_product_requests
    ADD CONSTRAINT secretary_product_requests_pkey PRIMARY KEY (id);


--
-- Name: secretary_service_request_items secretary_service_request_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.secretary_service_request_items
    ADD CONSTRAINT secretary_service_request_items_pkey PRIMARY KEY (id);


--
-- Name: secretary_service_requests secretary_service_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.secretary_service_requests
    ADD CONSTRAINT secretary_service_requests_pkey PRIMARY KEY (id);


--
-- Name: service_indents service_indents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_indents
    ADD CONSTRAINT service_indents_pkey PRIMARY KEY (id);


--
-- Name: service_order_proposals service_order_proposals_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_order_proposals
    ADD CONSTRAINT service_order_proposals_pkey PRIMARY KEY (id);


--
-- Name: service_orders service_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_orders
    ADD CONSTRAINT service_orders_pkey PRIMARY KEY (id);


--
-- Name: service_orders service_orders_proposal_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_orders
    ADD CONSTRAINT service_orders_proposal_id_key UNIQUE (proposal_id);


--
-- Name: service_orders service_orders_so_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_orders
    ADD CONSTRAINT service_orders_so_number_key UNIQUE (so_number);


--
-- Name: sick_room_beds sick_room_beds_bed_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sick_room_beds
    ADD CONSTRAINT sick_room_beds_bed_code_key UNIQUE (bed_code);


--
-- Name: sick_room_beds sick_room_beds_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sick_room_beds
    ADD CONSTRAINT sick_room_beds_pkey PRIMARY KEY (id);


--
-- Name: sick_room_stays sick_room_stays_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sick_room_stays
    ADD CONSTRAINT sick_room_stays_pkey PRIMARY KEY (id);


--
-- Name: soa_applications soa_applications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.soa_applications
    ADD CONSTRAINT soa_applications_pkey PRIMARY KEY (id);


--
-- Name: social_post_details social_post_details_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.social_post_details
    ADD CONSTRAINT social_post_details_pkey PRIMARY KEY (announcement_id);


--
-- Name: sports_achievements sports_achievements_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_achievements
    ADD CONSTRAINT sports_achievements_pkey PRIMARY KEY (id);


--
-- Name: sports_announcements sports_announcements_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_announcements
    ADD CONSTRAINT sports_announcements_pkey PRIMARY KEY (id);


--
-- Name: sports_athlete_profiles sports_athlete_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_athlete_profiles
    ADD CONSTRAINT sports_athlete_profiles_pkey PRIMARY KEY (id);


--
-- Name: sports_athlete_profiles sports_athlete_profiles_student_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_athlete_profiles
    ADD CONSTRAINT sports_athlete_profiles_student_id_key UNIQUE (student_id);


--
-- Name: sports_budget_requests sports_budget_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_budget_requests
    ADD CONSTRAINT sports_budget_requests_pkey PRIMARY KEY (id);


--
-- Name: sports_calendar_notes sports_calendar_notes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_calendar_notes
    ADD CONSTRAINT sports_calendar_notes_pkey PRIMARY KEY (id);


--
-- Name: sports_coach_profiles sports_coach_profiles_faculty_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_coach_profiles
    ADD CONSTRAINT sports_coach_profiles_faculty_id_key UNIQUE (faculty_id);


--
-- Name: sports_coach_profiles sports_coach_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_coach_profiles
    ADD CONSTRAINT sports_coach_profiles_pkey PRIMARY KEY (id);


--
-- Name: sports_disciplines sports_disciplines_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_disciplines
    ADD CONSTRAINT sports_disciplines_name_key UNIQUE (name);


--
-- Name: sports_disciplines sports_disciplines_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_disciplines
    ADD CONSTRAINT sports_disciplines_pkey PRIMARY KEY (id);


--
-- Name: sports_equipment_issues sports_equipment_issues_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_equipment_issues
    ADD CONSTRAINT sports_equipment_issues_pkey PRIMARY KEY (id);


--
-- Name: sports_equipment sports_equipment_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_equipment
    ADD CONSTRAINT sports_equipment_pkey PRIMARY KEY (id);


--
-- Name: sports_facilities sports_facilities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_facilities
    ADD CONSTRAINT sports_facilities_pkey PRIMARY KEY (id);


--
-- Name: sports_fitness_tests sports_fitness_tests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_fitness_tests
    ADD CONSTRAINT sports_fitness_tests_pkey PRIMARY KEY (id);


--
-- Name: sports_fixtures sports_fixtures_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_fixtures
    ADD CONSTRAINT sports_fixtures_pkey PRIMARY KEY (id);


--
-- Name: sports_injuries sports_injuries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_injuries
    ADD CONSTRAINT sports_injuries_pkey PRIMARY KEY (id);


--
-- Name: sports_od_hod_approvals sports_od_hod_approvals_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_od_hod_approvals
    ADD CONSTRAINT sports_od_hod_approvals_pkey PRIMARY KEY (id);


--
-- Name: sports_od_hod_approvals sports_od_hod_approvals_request_department_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_od_hod_approvals
    ADD CONSTRAINT sports_od_hod_approvals_request_department_key UNIQUE (od_request_id, department_id);


--
-- Name: sports_od_letter_numbers sports_od_letter_numbers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_od_letter_numbers
    ADD CONSTRAINT sports_od_letter_numbers_pkey PRIMARY KEY (id);


--
-- Name: sports_od_requests sports_od_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_od_requests
    ADD CONSTRAINT sports_od_requests_pkey PRIMARY KEY (id);


--
-- Name: sports_od_squad_members sports_od_squad_members_od_request_id_student_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_od_squad_members
    ADD CONSTRAINT sports_od_squad_members_od_request_id_student_id_key UNIQUE (od_request_id, student_id);


--
-- Name: sports_od_squad_members sports_od_squad_members_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_od_squad_members
    ADD CONSTRAINT sports_od_squad_members_pkey PRIMARY KEY (id);


--
-- Name: sports_reports sports_reports_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_reports
    ADD CONSTRAINT sports_reports_pkey PRIMARY KEY (id);


--
-- Name: sports_session_attendance sports_session_attendance_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_session_attendance
    ADD CONSTRAINT sports_session_attendance_pkey PRIMARY KEY (id);


--
-- Name: sports_session_attendance sports_session_attendance_session_id_student_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_session_attendance
    ADD CONSTRAINT sports_session_attendance_session_id_student_id_key UNIQUE (session_id, student_id);


--
-- Name: sports_teams sports_teams_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_teams
    ADD CONSTRAINT sports_teams_name_key UNIQUE (name);


--
-- Name: sports_teams sports_teams_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_teams
    ADD CONSTRAINT sports_teams_pkey PRIMARY KEY (id);


--
-- Name: sports_training_sessions sports_training_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_training_sessions
    ADD CONSTRAINT sports_training_sessions_pkey PRIMARY KEY (id);


--
-- Name: sports_trial_scores sports_trial_scores_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_trial_scores
    ADD CONSTRAINT sports_trial_scores_pkey PRIMARY KEY (id);


--
-- Name: sports_trials sports_trials_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_trials
    ADD CONSTRAINT sports_trials_pkey PRIMARY KEY (id);


--
-- Name: startup_ideas startup_ideas_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.startup_ideas
    ADD CONSTRAINT startup_ideas_pkey PRIMARY KEY (id);


--
-- Name: stationary_finishing_rates stationary_finishing_rates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stationary_finishing_rates
    ADD CONSTRAINT stationary_finishing_rates_pkey PRIMARY KEY (id);


--
-- Name: stationary_machines stationary_machines_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stationary_machines
    ADD CONSTRAINT stationary_machines_pkey PRIMARY KEY (id);


--
-- Name: stationary_print_rates stationary_print_rates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stationary_print_rates
    ADD CONSTRAINT stationary_print_rates_pkey PRIMARY KEY (id);


--
-- Name: stationary_requests stationary_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stationary_requests
    ADD CONSTRAINT stationary_requests_pkey PRIMARY KEY (id);


--
-- Name: stationary_stock_items stationary_stock_items_item_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stationary_stock_items
    ADD CONSTRAINT stationary_stock_items_item_name_key UNIQUE (item_name);


--
-- Name: stationary_stock_items stationary_stock_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stationary_stock_items
    ADD CONSTRAINT stationary_stock_items_pkey PRIMARY KEY (id);


--
-- Name: stationery_order_items stationery_order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stationery_order_items
    ADD CONSTRAINT stationery_order_items_pkey PRIMARY KEY (id);


--
-- Name: stationery_orders stationery_orders_pickup_token_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stationery_orders
    ADD CONSTRAINT stationery_orders_pickup_token_key UNIQUE (pickup_token);


--
-- Name: stationery_orders stationery_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stationery_orders
    ADD CONSTRAINT stationery_orders_pkey PRIMARY KEY (id);


--
-- Name: stationery_orders stationery_orders_razorpay_order_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stationery_orders
    ADD CONSTRAINT stationery_orders_razorpay_order_id_key UNIQUE (razorpay_order_id);


--
-- Name: stationery_products stationery_products_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stationery_products
    ADD CONSTRAINT stationery_products_pkey PRIMARY KEY (id);


--
-- Name: student_addresses student_addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_addresses
    ADD CONSTRAINT student_addresses_pkey PRIMARY KEY (id);


--
-- Name: student_addresses student_addresses_student_id_address_type_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_addresses
    ADD CONSTRAINT student_addresses_student_id_address_type_key UNIQUE (student_id, address_type);


--
-- Name: student_assignment_status student_assignment_status_assignment_id_student_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_assignment_status
    ADD CONSTRAINT student_assignment_status_assignment_id_student_id_key UNIQUE (assignment_id, student_id);


--
-- Name: student_assignment_status student_assignment_status_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_assignment_status
    ADD CONSTRAINT student_assignment_status_pkey PRIMARY KEY (id);


--
-- Name: student_certificates student_certificates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_certificates
    ADD CONSTRAINT student_certificates_pkey PRIMARY KEY (id);


--
-- Name: student_certificates student_certificates_student_id_certificate_type_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_certificates
    ADD CONSTRAINT student_certificates_student_id_certificate_type_id_key UNIQUE (student_id, certificate_type_id);


--
-- Name: student_certifications student_certifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_certifications
    ADD CONSTRAINT student_certifications_pkey PRIMARY KEY (id);


--
-- Name: student_competitions student_competitions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_competitions
    ADD CONSTRAINT student_competitions_pkey PRIMARY KEY (id);


--
-- Name: student_contacts student_contacts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_contacts
    ADD CONSTRAINT student_contacts_pkey PRIMARY KEY (id);


--
-- Name: student_contacts student_contacts_student_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_contacts
    ADD CONSTRAINT student_contacts_student_id_key UNIQUE (student_id);


--
-- Name: student_drive_applications student_drive_applications_drive_id_student_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_drive_applications
    ADD CONSTRAINT student_drive_applications_drive_id_student_id_key UNIQUE (drive_id, student_id);


--
-- Name: student_drive_applications student_drive_applications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_drive_applications
    ADD CONSTRAINT student_drive_applications_pkey PRIMARY KEY (id);


--
-- Name: student_entrepreneurship student_entrepreneurship_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_entrepreneurship
    ADD CONSTRAINT student_entrepreneurship_pkey PRIMARY KEY (id);


--
-- Name: student_entrepreneurship student_entrepreneurship_student_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_entrepreneurship
    ADD CONSTRAINT student_entrepreneurship_student_id_key UNIQUE (student_id);


--
-- Name: student_escalations student_escalations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_escalations
    ADD CONSTRAINT student_escalations_pkey PRIMARY KEY (id);


--
-- Name: student_family_details student_family_details_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_family_details
    ADD CONSTRAINT student_family_details_pkey PRIMARY KEY (id);


--
-- Name: student_family_details student_family_details_student_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_family_details
    ADD CONSTRAINT student_family_details_student_id_key UNIQUE (student_id);


--
-- Name: student_fee_demand_mapping student_fee_demand_mapping_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_fee_demand_mapping
    ADD CONSTRAINT student_fee_demand_mapping_pkey PRIMARY KEY (id);


--
-- Name: student_hackathon_participations student_hackathon_participations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_hackathon_participations
    ADD CONSTRAINT student_hackathon_participations_pkey PRIMARY KEY (id);


--
-- Name: student_health_records student_health_records_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_health_records
    ADD CONSTRAINT student_health_records_pkey PRIMARY KEY (id);


--
-- Name: student_health_records student_health_records_student_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_health_records
    ADD CONSTRAINT student_health_records_student_id_key UNIQUE (student_id);


--
-- Name: student_higher_education student_higher_education_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_higher_education
    ADD CONSTRAINT student_higher_education_pkey PRIMARY KEY (id);


--
-- Name: student_higher_education student_higher_education_student_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_higher_education
    ADD CONSTRAINT student_higher_education_student_id_key UNIQUE (student_id);


--
-- Name: student_hostel_mapping student_hostel_mapping_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_hostel_mapping
    ADD CONSTRAINT student_hostel_mapping_pkey PRIMARY KEY (id);


--
-- Name: student_hostel_mapping student_hostel_mapping_student_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_hostel_mapping
    ADD CONSTRAINT student_hostel_mapping_student_id_key UNIQUE (student_id);


--
-- Name: student_id_card_issuances student_id_card_issuances_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_id_card_issuances
    ADD CONSTRAINT student_id_card_issuances_pkey PRIMARY KEY (id);


--
-- Name: student_identity_marks student_identity_marks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_identity_marks
    ADD CONSTRAINT student_identity_marks_pkey PRIMARY KEY (id);


--
-- Name: student_identity_marks student_identity_marks_student_id_mark_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_identity_marks
    ADD CONSTRAINT student_identity_marks_student_id_mark_number_key UNIQUE (student_id, mark_number);


--
-- Name: student_leaves student_leaves_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_leaves
    ADD CONSTRAINT student_leaves_pkey PRIMARY KEY (id);


--
-- Name: student_meeting_notes student_meeting_notes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_meeting_notes
    ADD CONSTRAINT student_meeting_notes_pkey PRIMARY KEY (id);


--
-- Name: student_no_due_status student_no_due_status_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_no_due_status
    ADD CONSTRAINT student_no_due_status_pkey PRIMARY KEY (id);


--
-- Name: student_no_due_status student_no_due_status_student_id_academic_year_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_no_due_status
    ADD CONSTRAINT student_no_due_status_student_id_academic_year_key UNIQUE (student_id, academic_year);


--
-- Name: student_outpasses student_outpasses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_outpasses
    ADD CONSTRAINT student_outpasses_pkey PRIMARY KEY (id);


--
-- Name: student_profiles student_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_profiles
    ADD CONSTRAINT student_profiles_pkey PRIMARY KEY (id);


--
-- Name: student_profiles student_profiles_student_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_profiles
    ADD CONSTRAINT student_profiles_student_id_key UNIQUE (student_id);


--
-- Name: student_projects student_projects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_projects
    ADD CONSTRAINT student_projects_pkey PRIMARY KEY (id);


--
-- Name: student_scholarship_awards student_scholarship_awards_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_scholarship_awards
    ADD CONSTRAINT student_scholarship_awards_pkey PRIMARY KEY (id);


--
-- Name: student_scholarship_awards student_scholarship_awards_scheme_id_student_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_scholarship_awards
    ADD CONSTRAINT student_scholarship_awards_scheme_id_student_id_key UNIQUE (scheme_id, student_id);


--
-- Name: student_semester_gpa student_semester_gpa_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_semester_gpa
    ADD CONSTRAINT student_semester_gpa_pkey PRIMARY KEY (id);


--
-- Name: student_semester_gpa student_semester_gpa_student_id_semester_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_semester_gpa
    ADD CONSTRAINT student_semester_gpa_student_id_semester_key UNIQUE (student_id, semester);


--
-- Name: student_sensitive_info student_sensitive_info_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_sensitive_info
    ADD CONSTRAINT student_sensitive_info_pkey PRIMARY KEY (id);


--
-- Name: student_sensitive_info student_sensitive_info_student_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_sensitive_info
    ADD CONSTRAINT student_sensitive_info_student_id_key UNIQUE (student_id);


--
-- Name: student_sports_team_mapping student_sports_team_mapping_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_sports_team_mapping
    ADD CONSTRAINT student_sports_team_mapping_pkey PRIMARY KEY (id);


--
-- Name: student_sports_team_mapping student_sports_team_mapping_student_id_team_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_sports_team_mapping
    ADD CONSTRAINT student_sports_team_mapping_student_id_team_id_key UNIQUE (student_id, team_id);


--
-- Name: student_test_scores student_test_scores_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_test_scores
    ADD CONSTRAINT student_test_scores_pkey PRIMARY KEY (id);


--
-- Name: student_todo_completions student_todo_completions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_todo_completions
    ADD CONSTRAINT student_todo_completions_pkey PRIMARY KEY (id);


--
-- Name: student_todo_completions student_todo_completions_todo_id_student_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_todo_completions
    ADD CONSTRAINT student_todo_completions_todo_id_student_id_key UNIQUE (todo_id, student_id);


--
-- Name: student_transport_mapping student_transport_mapping_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_transport_mapping
    ADD CONSTRAINT student_transport_mapping_pkey PRIMARY KEY (id);


--
-- Name: student_transport_mapping student_transport_mapping_student_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_transport_mapping
    ADD CONSTRAINT student_transport_mapping_student_id_key UNIQUE (student_id);


--
-- Name: wallets student_wallets_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wallets
    ADD CONSTRAINT student_wallets_pkey PRIMARY KEY (id);


--
-- Name: students students_admission_no_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_admission_no_key UNIQUE (admission_no);


--
-- Name: students students_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_pkey PRIMARY KEY (id);


--
-- Name: students students_soa_application_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_soa_application_id_key UNIQUE (soa_application_id);


--
-- Name: students students_student_id_no_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_student_id_no_key UNIQUE (student_id_no);


--
-- Name: students students_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_user_id_key UNIQUE (user_id);


--
-- Name: subject_academic_clearance subject_academic_clearance_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subject_academic_clearance
    ADD CONSTRAINT subject_academic_clearance_pkey PRIMARY KEY (id);


--
-- Name: subject_academic_clearance subject_academic_clearance_student_id_faculty_subject_class_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subject_academic_clearance
    ADD CONSTRAINT subject_academic_clearance_student_id_faculty_subject_class_key UNIQUE (student_id, faculty_subject_class_mapping_id);


--
-- Name: subjects subjects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subjects
    ADD CONSTRAINT subjects_pkey PRIMARY KEY (id);


--
-- Name: subjects subjects_subject_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subjects
    ADD CONSTRAINT subjects_subject_code_key UNIQUE (subject_code);


--
-- Name: timetable_period_requests timetable_period_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.timetable_period_requests
    ADD CONSTRAINT timetable_period_requests_pkey PRIMARY KEY (id);


--
-- Name: timetable_slots timetable_slots_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.timetable_slots
    ADD CONSTRAINT timetable_slots_pkey PRIMARY KEY (id);


--
-- Name: training_examples training_examples_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.training_examples
    ADD CONSTRAINT training_examples_pkey PRIMARY KEY (id);


--
-- Name: transport_notices transport_notices_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transport_notices
    ADD CONSTRAINT transport_notices_pkey PRIMARY KEY (id);


--
-- Name: transport_routes transport_routes_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transport_routes
    ADD CONSTRAINT transport_routes_name_key UNIQUE (name);


--
-- Name: transport_routes transport_routes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transport_routes
    ADD CONSTRAINT transport_routes_pkey PRIMARY KEY (id);


--
-- Name: transport_stages transport_stages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transport_stages
    ADD CONSTRAINT transport_stages_pkey PRIMARY KEY (id);


--
-- Name: transport_stages transport_stages_route_id_sequence_no_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transport_stages
    ADD CONSTRAINT transport_stages_route_id_sequence_no_key UNIQUE (route_id, sequence_no);


--
-- Name: training_examples uniq_training_examples; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.training_examples
    ADD CONSTRAINT uniq_training_examples UNIQUE (query_text, intent_name);


--
-- Name: announcement_class_mapping uq_announcement_class; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.announcement_class_mapping
    ADD CONSTRAINT uq_announcement_class UNIQUE (announcement_id, class_id);


--
-- Name: canteen_orders uq_canteen_orders_razorpay_order_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.canteen_orders
    ADD CONSTRAINT uq_canteen_orders_razorpay_order_id UNIQUE (razorpay_order_id);


--
-- Name: leave_parent_acknowledgements uq_leave_parent_ack; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leave_parent_acknowledgements
    ADD CONSTRAINT uq_leave_parent_ack UNIQUE (leave_id, parent_user_id);


--
-- Name: od_request_parent_acknowledgements uq_od_parent_ack; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.od_request_parent_acknowledgements
    ADD CONSTRAINT uq_od_parent_ack UNIQUE (od_request_id, parent_user_id);


--
-- Name: project_join_requests uq_student_application; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_join_requests
    ADD CONSTRAINT uq_student_application UNIQUE (team_id, student_id);


--
-- Name: project_team_members uq_team_student; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_team_members
    ADD CONSTRAINT uq_team_student UNIQUE (team_id, student_id);


--
-- Name: user_preferences user_preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_preferences
    ADD CONSTRAINT user_preferences_pkey PRIMARY KEY (user_id);


--
-- Name: user_presence user_presence_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_presence
    ADD CONSTRAINT user_presence_pkey PRIMARY KEY (user_id);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- Name: user_social_links user_social_links_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_social_links
    ADD CONSTRAINT user_social_links_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: vendor_quotations vendor_quotations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vendor_quotations
    ADD CONSTRAINT vendor_quotations_pkey PRIMARY KEY (id);


--
-- Name: vendors vendors_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vendors
    ADD CONSTRAINT vendors_pkey PRIMARY KEY (id);


--
-- Name: venue_bookings venue_bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.venue_bookings
    ADD CONSTRAINT venue_bookings_pkey PRIMARY KEY (id);


--
-- Name: venues venues_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.venues
    ADD CONSTRAINT venues_pkey PRIMARY KEY (id);


--
-- Name: visitor_logs visitor_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.visitor_logs
    ADD CONSTRAINT visitor_logs_pkey PRIMARY KEY (id);


--
-- Name: wallet_outlets wallet_outlets_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wallet_outlets
    ADD CONSTRAINT wallet_outlets_pkey PRIMARY KEY (id);


--
-- Name: wallet_transactions wallet_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wallet_transactions
    ADD CONSTRAINT wallet_transactions_pkey PRIMARY KEY (id);


--
-- Name: wallets wallets_qr_token_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wallets
    ADD CONSTRAINT wallets_qr_token_key UNIQUE (qr_token);


--
-- Name: wallets wallets_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wallets
    ADD CONSTRAINT wallets_user_id_key UNIQUE (user_id);


--
-- Name: admission_profile_drafts_soa_application_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX admission_profile_drafts_soa_application_id_key ON public.admission_profile_drafts USING btree (soa_application_id);


--
-- Name: bills_bill_number_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX bills_bill_number_key ON public.bills USING btree (bill_number);


--
-- Name: book_borrow_records_replacement_indent_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX book_borrow_records_replacement_indent_id_key ON public.book_borrow_records USING btree (replacement_indent_id);


--
-- Name: coe_profiles_user_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX coe_profiles_user_id_key ON public.coe_profiles USING btree (user_id);


--
-- Name: curriculum_mappings_department_id_semester_subject_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX curriculum_mappings_department_id_semester_subject_id_key ON public.curriculum_mappings USING btree (department_id, semester, subject_id);


--
-- Name: exam_types_code_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX exam_types_code_key ON public.exam_types USING btree (code);


--
-- Name: faculty_hostel_mapping_faculty_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX faculty_hostel_mapping_faculty_id_key ON public.faculty_hostel_mapping USING btree (faculty_id);


--
-- Name: fee_structure_items_hostel_room_type_uq; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX fee_structure_items_hostel_room_type_uq ON public.fee_structure_items USING btree (fee_structure_id, hostel_room_type_id) WHERE (hostel_room_type_id IS NOT NULL);


--
-- Name: fee_structure_items_transport_stage_uq; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX fee_structure_items_transport_stage_uq ON public.fee_structure_items USING btree (fee_structure_id, transport_stage_id) WHERE (transport_stage_id IS NOT NULL);


--
-- Name: feedback_assignments_course_type_department_id_year_of_st_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX feedback_assignments_course_type_department_id_year_of_st_key ON public.feedback_assignments USING btree (course_type, department_id, year_of_study, semester, class_id);


--
-- Name: feedback_faculty_responses_question_id_student_id_mapping_id_ke; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX feedback_faculty_responses_question_id_student_id_mapping_id_ke ON public.feedback_faculty_responses USING btree (question_id, student_id, mapping_id);


--
-- Name: feedback_rating_scale_options_scale_id_sequence_no_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX feedback_rating_scale_options_scale_id_sequence_no_key ON public.feedback_rating_scale_options USING btree (scale_id, sequence_no);


--
-- Name: hostel_blocks_hostel_id_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX hostel_blocks_hostel_id_name_key ON public.hostel_blocks USING btree (hostel_id, name);


--
-- Name: hostel_rooms_hostel_id_room_number_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX hostel_rooms_hostel_id_room_number_key ON public.hostel_rooms USING btree (hostel_id, room_number);


--
-- Name: hostel_wardens_emp_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX hostel_wardens_emp_id_key ON public.hostel_wardens USING btree (emp_id);


--
-- Name: hostels_code_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX hostels_code_key ON public.hostels USING btree (code);


--
-- Name: idx_achievement_comments_achievement; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_achievement_comments_achievement ON public.achievement_comments USING btree (achievement_id, created_at);


--
-- Name: idx_alumni_group_messages_batch; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_alumni_group_messages_batch ON public.alumni_group_messages USING btree (alumni_batch_id, created_at);


--
-- Name: idx_announcement_class_mapping_class; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_announcement_class_mapping_class ON public.announcement_class_mapping USING btree (class_id);


--
-- Name: idx_announcement_comments_announcement; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_announcement_comments_announcement ON public.announcement_comments USING btree (announcement_id, created_at);


--
-- Name: idx_announcement_comments_parent; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_announcement_comments_parent ON public.announcement_comments USING btree (parent_comment_id);


--
-- Name: idx_announcement_media_announcement; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_announcement_media_announcement ON public.announcement_media USING btree (announcement_id, sequence_no);


--
-- Name: idx_announcement_role_mapping_role; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_announcement_role_mapping_role ON public.announcement_role_mapping USING btree (role_id);


--
-- Name: idx_announcements_target; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_announcements_target ON public.announcements USING btree (target_audience, batch_id, department_id);


--
-- Name: idx_appraisal_attachments_request_division; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_appraisal_attachments_request_division ON public.appraisal_attachments USING btree (appraisal_request_id, division_id);


--
-- Name: idx_assignments_class_subject; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_assignments_class_subject ON public.assignments USING btree (class_id, subject_id, academic_year, semester);


--
-- Name: idx_attendance_class_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_attendance_class_date ON public.attendance_records USING btree (class_id, attendance_date);


--
-- Name: idx_attendance_marked_by_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_attendance_marked_by_user ON public.attendance_records USING btree (marked_by_user_id);


--
-- Name: idx_attendance_record_changes_record; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_attendance_record_changes_record ON public.attendance_record_changes USING btree (attendance_record_id);


--
-- Name: idx_attendance_student_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_attendance_student_date ON public.attendance_records USING btree (student_id, attendance_date);


--
-- Name: idx_audit_logs_entity; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_logs_entity ON public.audit_logs USING btree (entity_type, entity_id);


--
-- Name: idx_audit_logs_performed_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_logs_performed_by ON public.audit_logs USING btree (performed_by_user_id);


--
-- Name: idx_bank_recon_matched; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_bank_recon_matched ON public.bank_reconciliation_entries USING btree (matched);


--
-- Name: idx_bills_purchase_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_bills_purchase_order ON public.bills USING btree (purchase_order_id);


--
-- Name: idx_bills_service_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_bills_service_order ON public.bills USING btree (service_order_id);


--
-- Name: idx_bills_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_bills_status ON public.bills USING btree (status);


--
-- Name: idx_bills_vendor; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_bills_vendor ON public.bills USING btree (vendor_id);


--
-- Name: idx_bonafide_requests_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_bonafide_requests_status ON public.bonafide_requests USING btree (status);


--
-- Name: idx_bonafide_requests_student; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_bonafide_requests_student ON public.bonafide_requests USING btree (student_id);


--
-- Name: idx_book_borrow_requests_faculty; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_book_borrow_requests_faculty ON public.book_borrow_requests USING btree (faculty_id);


--
-- Name: idx_book_borrow_requests_pending_unique_faculty; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_book_borrow_requests_pending_unique_faculty ON public.book_borrow_requests USING btree (book_id, faculty_id) WHERE ((status = 'pending'::public.approval_status_enum) AND (faculty_id IS NOT NULL));


--
-- Name: idx_book_borrow_requests_pending_unique_student; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_book_borrow_requests_pending_unique_student ON public.book_borrow_requests USING btree (book_id, student_id) WHERE ((status = 'pending'::public.approval_status_enum) AND (student_id IS NOT NULL));


--
-- Name: idx_book_borrow_requests_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_book_borrow_requests_status ON public.book_borrow_requests USING btree (status);


--
-- Name: idx_book_borrow_requests_student; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_book_borrow_requests_student ON public.book_borrow_requests USING btree (student_id);


--
-- Name: idx_book_borrow_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_book_borrow_status ON public.book_borrow_records USING btree (status);


--
-- Name: idx_calendar_events_calendar_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_calendar_events_calendar_date ON public.calendar_events USING btree (academic_calendar_id, event_date);


--
-- Name: idx_calendar_events_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_calendar_events_type ON public.calendar_events USING btree (event_type);


--
-- Name: idx_canteen_bills_cashier; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_canteen_bills_cashier ON public.canteen_bills USING btree (cashier_user_id);


--
-- Name: idx_canteen_bills_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_canteen_bills_date ON public.canteen_bills USING btree (date_time);


--
-- Name: idx_canteen_dishes_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_canteen_dishes_category ON public.canteen_dishes USING btree (category_id);


--
-- Name: idx_canteen_dishes_stock_lookup; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_canteen_dishes_stock_lookup ON public.canteen_dishes USING btree (id, stock_quantity, price);


--
-- Name: idx_canteen_expenses_category_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_canteen_expenses_category_date ON public.canteen_expenses USING btree (category_id, date);


--
-- Name: idx_canteen_order_items_order_dish; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_canteen_order_items_order_dish ON public.canteen_order_items USING btree (order_id, dish_id);


--
-- Name: idx_canteen_orders_pickup_token; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_canteen_orders_pickup_token ON public.canteen_orders USING btree (pickup_token);


--
-- Name: idx_canteen_orders_self_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_canteen_orders_self_active ON public.canteen_orders USING btree (order_source, status, created_at);


--
-- Name: idx_canteen_orders_source_created; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_canteen_orders_source_created ON public.canteen_orders USING btree (order_source, created_at DESC);


--
-- Name: idx_canteen_orders_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_canteen_orders_status ON public.canteen_orders USING btree (status);


--
-- Name: idx_canteen_stock_batches_product_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_canteen_stock_batches_product_date ON public.canteen_stock_batches USING btree (product_id, date_added);


--
-- Name: idx_canteen_stock_transactions_batch; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_canteen_stock_transactions_batch ON public.canteen_stock_transactions USING btree (batch_id);


--
-- Name: idx_canteen_stock_transactions_product; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_canteen_stock_transactions_product ON public.canteen_stock_transactions USING btree (product_id);


--
-- Name: idx_canteen_stock_transactions_reference; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_canteen_stock_transactions_reference ON public.canteen_stock_transactions USING btree (reference_id, reference_type);


--
-- Name: idx_canteen_todays_specials_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_canteen_todays_specials_active ON public.canteen_todays_specials USING btree (is_active);


--
-- Name: idx_canteen_todays_specials_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_canteen_todays_specials_date ON public.canteen_todays_specials USING btree (special_date);


--
-- Name: idx_canteen_todays_specials_meal; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_canteen_todays_specials_meal ON public.canteen_todays_specials USING btree (meal_type);


--
-- Name: idx_chat_conversations_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_chat_conversations_user ON public.chat_conversations USING btree (user_id, updated_at DESC);


--
-- Name: idx_chat_messages_conversation; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_chat_messages_conversation ON public.chat_messages USING btree (conversation_id, created_at);


--
-- Name: idx_clearance_exceptions_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_clearance_exceptions_status ON public.hall_ticket_clearance_exceptions USING btree (status);


--
-- Name: idx_clearance_exceptions_student_exam; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_clearance_exceptions_student_exam ON public.hall_ticket_clearance_exceptions USING btree (student_id, exam_id);


--
-- Name: idx_coe_broadcasts_scheduled_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_coe_broadcasts_scheduled_at ON public.coe_notification_broadcasts USING btree (scheduled_at) WHERE (status = 'scheduled'::public.coe_broadcast_status_enum);


--
-- Name: idx_coe_broadcasts_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_coe_broadcasts_status ON public.coe_notification_broadcasts USING btree (status);


--
-- Name: idx_coordinator_calendar_entries_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_coordinator_calendar_entries_date ON public.coordinator_calendar_entries USING btree (entry_date);


--
-- Name: idx_coordinator_calendar_entries_year_semester; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_coordinator_calendar_entries_year_semester ON public.coordinator_calendar_entries USING btree (academic_year, semester);


--
-- Name: idx_curriculum_mappings_dept_semester; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_curriculum_mappings_dept_semester ON public.curriculum_mappings USING btree (department_id, semester);


--
-- Name: idx_department_documents_department; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_department_documents_department ON public.department_documents USING btree (department_id);


--
-- Name: idx_department_events_department; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_department_events_department ON public.department_events USING btree (department_id);


--
-- Name: idx_department_meetings_department; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_department_meetings_department ON public.department_meetings USING btree (department_id);


--
-- Name: idx_device_push_tokens_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_device_push_tokens_user ON public.device_push_tokens USING btree (user_id);


--
-- Name: idx_edc_documents_venture; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_edc_documents_venture ON public.edc_documents USING btree (student_entrepreneurship_id);


--
-- Name: idx_edc_funding_records_venture; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_edc_funding_records_venture ON public.edc_funding_records USING btree (student_entrepreneurship_id);


--
-- Name: idx_exam_marks_mapping; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_exam_marks_mapping ON public.exam_marks USING btree (exam_subject_mapping_id);


--
-- Name: idx_exam_marks_student; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_exam_marks_student ON public.exam_marks USING btree (student_id);


--
-- Name: idx_expenses_category_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_expenses_category_date ON public.expenses USING btree (category_id, expense_date);


--
-- Name: idx_fac_att_corr_faculty_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fac_att_corr_faculty_date ON public.faculty_attendance_corrections USING btree (faculty_id, attendance_date);


--
-- Name: idx_faculty_certifications_faculty; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_faculty_certifications_faculty ON public.faculty_certifications USING btree (faculty_id);


--
-- Name: idx_faculty_daily_attendance_faculty_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_faculty_daily_attendance_faculty_date ON public.faculty_daily_attendance USING btree (faculty_id, attendance_date);


--
-- Name: idx_faculty_department; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_faculty_department ON public.faculty USING btree (department_id);


--
-- Name: idx_faculty_development_programs_faculty; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_faculty_development_programs_faculty ON public.faculty_development_programs USING btree (faculty_id);


--
-- Name: idx_faculty_feedback_forms_department; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_faculty_feedback_forms_department ON public.faculty_feedback_forms USING btree (department_id);


--
-- Name: idx_faculty_feedback_questions_form; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_faculty_feedback_questions_form ON public.faculty_feedback_questions USING btree (form_id);


--
-- Name: idx_faculty_feedback_responses_faculty; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_faculty_feedback_responses_faculty ON public.faculty_feedback_responses USING btree (faculty_id);


--
-- Name: idx_faculty_id_card_issuances_faculty_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_faculty_id_card_issuances_faculty_id ON public.faculty_id_card_issuances USING btree (faculty_id, issued_at);


--
-- Name: idx_faculty_od_requests_faculty_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_faculty_od_requests_faculty_id ON public.faculty_od_requests USING btree (faculty_id);


--
-- Name: idx_faculty_patent_inventors_faculty; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_faculty_patent_inventors_faculty ON public.patent_inventors USING btree (faculty_id);


--
-- Name: idx_faculty_research_project_members_faculty; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_faculty_research_project_members_faculty ON public.research_project_members USING btree (faculty_id);


--
-- Name: idx_fee_demand_student; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fee_demand_student ON public.student_fee_demand_mapping USING btree (student_id);


--
-- Name: idx_fee_payment_gateway_orders_mapping; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fee_payment_gateway_orders_mapping ON public.fee_payment_gateway_orders USING btree (student_fee_demand_mapping_id);


--
-- Name: idx_fee_payment_gateway_orders_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fee_payment_gateway_orders_user ON public.fee_payment_gateway_orders USING btree (created_by_user_id);


--
-- Name: idx_fee_payments_collected_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fee_payments_collected_by ON public.fee_payments USING btree (collected_by_user_id);


--
-- Name: idx_fee_payments_demand; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fee_payments_demand ON public.fee_payments USING btree (student_fee_demand_mapping_id);


--
-- Name: idx_fee_payments_fee_structure_item; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fee_payments_fee_structure_item ON public.fee_payments USING btree (fee_structure_item_id);


--
-- Name: idx_fee_payments_payment_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fee_payments_payment_date ON public.fee_payments USING btree (payment_date);


--
-- Name: idx_feedback_assignment_questions_assignment; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_feedback_assignment_questions_assignment ON public.feedback_assignment_questions USING btree (assignment_id);


--
-- Name: idx_feedback_assignments_dept_semester; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_feedback_assignments_dept_semester ON public.feedback_assignments USING btree (department_id, semester);


--
-- Name: idx_feedback_assignments_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_feedback_assignments_status ON public.feedback_assignments USING btree (status);


--
-- Name: idx_feedback_question_templates_course_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_feedback_question_templates_course_type ON public.feedback_question_templates USING btree (course_type);


--
-- Name: idx_finance_allotments_faculty; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_finance_allotments_faculty ON public.finance_order_allotments USING btree (faculty_id);


--
-- Name: idx_finance_allotments_tracking; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_finance_allotments_tracking ON public.finance_order_allotments USING btree (tracking_id);


--
-- Name: idx_finance_assignment_faculty; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_finance_assignment_faculty ON public.finance_proposal_assignments USING btree (faculty_id);


--
-- Name: idx_finance_audit_actor; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_finance_audit_actor ON public.finance_audit_log USING btree (actor_user_id, created_at DESC);


--
-- Name: idx_finance_audit_entity; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_finance_audit_entity ON public.finance_audit_log USING btree (entity_type, entity_id, created_at DESC);


--
-- Name: idx_finance_ledger_fund_created; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_finance_ledger_fund_created ON public.finance_ledger_entries USING btree (fund_id, created_at DESC);


--
-- Name: idx_finance_ledger_pop; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_finance_ledger_pop ON public.finance_ledger_entries USING btree (purchase_order_proposal_id) WHERE (purchase_order_proposal_id IS NOT NULL);


--
-- Name: idx_finance_ledger_sop; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_finance_ledger_sop ON public.finance_ledger_entries USING btree (service_order_proposal_id) WHERE (service_order_proposal_id IS NOT NULL);


--
-- Name: idx_finance_ledger_source; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_finance_ledger_source ON public.finance_ledger_entries USING btree (source);


--
-- Name: idx_finance_tracking_events_tracking; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_finance_tracking_events_tracking ON public.finance_order_tracking_events USING btree (tracking_id, changed_at);


--
-- Name: idx_finance_tracking_kind_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_finance_tracking_kind_status ON public.finance_order_tracking USING btree (order_kind, delivery_status);


--
-- Name: idx_gate_ledger_student; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_gate_ledger_student ON public.main_gate_in_out_ledger USING btree (student_id, recorded_at);


--
-- Name: idx_he_application_students_student; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_he_application_students_student ON public.higher_education_application_students USING btree (student_id);


--
-- Name: idx_he_application_students_window; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_he_application_students_window ON public.higher_education_application_students USING btree (window_id, status);


--
-- Name: idx_he_test_students_attempted; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_he_test_students_attempted ON public.higher_education_test_students USING btree (test_name) WHERE (attempted_on IS NOT NULL);


--
-- Name: idx_he_test_students_cleared; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_he_test_students_cleared ON public.higher_education_test_students USING btree (test_name) WHERE (cleared_on IS NOT NULL);


--
-- Name: idx_he_test_students_student; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_he_test_students_student ON public.higher_education_test_students USING btree (student_id);


--
-- Name: idx_he_test_students_test; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_he_test_students_test ON public.higher_education_test_students USING btree (test_name);


--
-- Name: idx_hostel_blocks_hostel; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_hostel_blocks_hostel ON public.hostel_blocks USING btree (hostel_id);


--
-- Name: idx_hostel_floors_block; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_hostel_floors_block ON public.hostel_floors USING btree (block_id);


--
-- Name: idx_hostel_goods_block; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_hostel_goods_block ON public.hostel_goods USING btree (block_id);


--
-- Name: idx_hostel_ledger_student; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_hostel_ledger_student ON public.hostel_in_out_ledger USING btree (student_id, recorded_at);


--
-- Name: idx_hostel_night_attendance_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_hostel_night_attendance_date ON public.hostel_night_attendance USING btree (attendance_date);


--
-- Name: idx_hostel_night_attendance_unpublished; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_hostel_night_attendance_unpublished ON public.hostel_night_attendance USING btree (attendance_date) WHERE (is_published = false);


--
-- Name: idx_hostel_rooms_block; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_hostel_rooms_block ON public.hostel_rooms USING btree (block_id);


--
-- Name: idx_hostel_rooms_floor; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_hostel_rooms_floor ON public.hostel_rooms USING btree (floor_id);


--
-- Name: idx_hostel_wardens_block; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_hostel_wardens_block ON public.hostel_wardens USING btree (block_id);


--
-- Name: idx_hr_payroll_requests_requester; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_hr_payroll_requests_requester ON public.hr_payroll_requests USING btree (requested_by_user_id);


--
-- Name: idx_hr_queries_faculty; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_hr_queries_faculty ON public.hr_queries USING btree (faculty_id);


--
-- Name: idx_iqac_accreditation_evidence_items_criterion; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_iqac_accreditation_evidence_items_criterion ON public.iqac_accreditation_evidence_items USING btree (criterion_id);


--
-- Name: idx_lesson_plan_sessions_plan; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_lesson_plan_sessions_plan ON public.lesson_plan_sessions USING btree (lesson_plan_id);


--
-- Name: idx_lms_folder_classes_class; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_lms_folder_classes_class ON public.lms_folder_classes USING btree (class_id);


--
-- Name: idx_lms_folders_faculty; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_lms_folders_faculty ON public.lms_folders USING btree (faculty_id);


--
-- Name: idx_lms_folders_subject; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_lms_folders_subject ON public.lms_folders USING btree (subject_id);


--
-- Name: idx_lms_resources_folder; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_lms_resources_folder ON public.lms_resources USING btree (folder_id);


--
-- Name: idx_media_request_status_log_request; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_media_request_status_log_request ON public.media_request_status_log USING btree (media_request_id);


--
-- Name: idx_media_requests_requested_by_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_media_requests_requested_by_user ON public.media_requests USING btree (requested_by_user_id);


--
-- Name: idx_media_requests_venue; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_media_requests_venue ON public.media_requests USING btree (venue_id);


--
-- Name: idx_medical_appointment_windows_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_medical_appointment_windows_date ON public.medical_appointment_windows USING btree (slot_date);


--
-- Name: idx_medical_appointments_booker; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_medical_appointments_booker ON public.medical_appointments USING btree (booked_by_user_id, slot_date DESC);


--
-- Name: idx_medical_appointments_slot_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_medical_appointments_slot_status ON public.medical_appointments USING btree (slot_date, slot_start, status);


--
-- Name: idx_medical_appointments_window; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_medical_appointments_window ON public.medical_appointments USING btree (window_id);


--
-- Name: idx_medical_bill_items_bill; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_medical_bill_items_bill ON public.medical_bill_items USING btree (bill_id);


--
-- Name: idx_medical_camp_reg_camp; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_medical_camp_reg_camp ON public.medical_camp_registrations USING btree (camp_id);


--
-- Name: idx_medical_visits_staff; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_medical_visits_staff ON public.medical_visits USING btree (staff_id);


--
-- Name: idx_medical_visits_student; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_medical_visits_student ON public.medical_visits USING btree (student_id);


--
-- Name: idx_meeting_action_items_meeting; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_meeting_action_items_meeting ON public.meeting_action_items USING btree (meeting_id);


--
-- Name: idx_message_conversations_last_message_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_message_conversations_last_message_at ON public.message_conversations USING btree (last_message_at DESC NULLS LAST);


--
-- Name: idx_message_participants_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_message_participants_user ON public.message_participants USING btree (user_id);


--
-- Name: idx_message_requests_conversation; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_message_requests_conversation ON public.message_requests USING btree (conversation_id);


--
-- Name: idx_message_requests_receiver_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_message_requests_receiver_status ON public.message_requests USING btree (receiver_user_id, status);


--
-- Name: idx_message_requests_sender_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_message_requests_sender_status ON public.message_requests USING btree (sender_user_id, status);


--
-- Name: idx_messages_conversation_created; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_messages_conversation_created ON public.messages USING btree (conversation_id, id DESC);


--
-- Name: idx_model_perf_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_model_perf_date ON public.model_performance USING btree (training_date);


--
-- Name: idx_nba_criteria_department; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_nba_criteria_department ON public.nba_criteria USING btree (department_id);


--
-- Name: idx_nba_evidence_items_criterion; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_nba_evidence_items_criterion ON public.nba_evidence_items USING btree (criterion_id);


--
-- Name: idx_notifications_user_created; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notifications_user_created ON public.notifications USING btree (user_id, created_at DESC);


--
-- Name: idx_notifications_user_unread; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notifications_user_unread ON public.notifications USING btree (user_id) WHERE (is_read = false);


--
-- Name: idx_online_class_participants_class; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_online_class_participants_class ON public.online_class_participants USING btree (online_class_id);


--
-- Name: idx_online_classes_class_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_online_classes_class_date ON public.online_classes USING btree (class_id, class_date);


--
-- Name: idx_parent_student_student; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_parent_student_student ON public.parent_student_mapping USING btree (student_id);


--
-- Name: idx_personal_calendar_entries_user_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_personal_calendar_entries_user_date ON public.personal_calendar_entries USING btree (user_id, entry_date);


--
-- Name: idx_placement_applications_student; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_placement_applications_student ON public.student_drive_applications USING btree (student_id);


--
-- Name: idx_placement_interviews_date_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_placement_interviews_date_status ON public.placement_interviews USING btree (interview_date, status);


--
-- Name: idx_placement_interviews_drive; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_placement_interviews_drive ON public.placement_interviews USING btree (drive_id);


--
-- Name: idx_placement_interviews_student; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_placement_interviews_student ON public.placement_interviews USING btree (student_id);


--
-- Name: idx_project_join_requests_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_project_join_requests_status ON public.project_join_requests USING btree (status);


--
-- Name: idx_project_join_requests_student; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_project_join_requests_student ON public.project_join_requests USING btree (student_id);


--
-- Name: idx_project_join_requests_team; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_project_join_requests_team ON public.project_join_requests USING btree (team_id);


--
-- Name: idx_project_recruitment_deadline; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_project_recruitment_deadline ON public.project_recruitment_posts USING btree (deadline);


--
-- Name: idx_project_recruitment_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_project_recruitment_status ON public.project_recruitment_posts USING btree (status);


--
-- Name: idx_project_team_members_student; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_project_team_members_student ON public.project_team_members USING btree (student_id);


--
-- Name: idx_project_team_members_team; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_project_team_members_team ON public.project_team_members USING btree (team_id);


--
-- Name: idx_project_teams_leader; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_project_teams_leader ON public.project_teams USING btree (leader_student_id);


--
-- Name: idx_project_teams_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_project_teams_status ON public.project_teams USING btree (status);


--
-- Name: idx_purchase_indent_dept_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_purchase_indent_dept_status ON public.purchase_indents USING btree (department_id, status);


--
-- Name: idx_query_logs_confidence; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_query_logs_confidence ON public.query_logs USING btree (confidence);


--
-- Name: idx_query_logs_created; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_query_logs_created ON public.query_logs USING btree (created_at);


--
-- Name: idx_query_logs_intent; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_query_logs_intent ON public.query_logs USING btree (intent_detected);


--
-- Name: idx_query_logs_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_query_logs_user ON public.query_logs USING btree (user_id);


--
-- Name: idx_refunds_demand; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_refunds_demand ON public.refunds USING btree (student_fee_demand_mapping_id);


--
-- Name: idx_refunds_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_refunds_status ON public.refunds USING btree (status);


--
-- Name: idx_salary_payments_faculty; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_salary_payments_faculty ON public.salary_payments USING btree (faculty_id, year, month);


--
-- Name: idx_salary_payments_staff; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_salary_payments_staff ON public.salary_payments USING btree (staff_id, year, month);


--
-- Name: idx_secretary_product_request_items_request; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_secretary_product_request_items_request ON public.secretary_product_request_items USING btree (request_id);


--
-- Name: idx_secretary_product_requests_requester; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_secretary_product_requests_requester ON public.secretary_product_requests USING btree (requested_by_user_id);


--
-- Name: idx_secretary_product_requests_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_secretary_product_requests_status ON public.secretary_product_requests USING btree (status);


--
-- Name: idx_secretary_service_request_items_request; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_secretary_service_request_items_request ON public.secretary_service_request_items USING btree (request_id);


--
-- Name: idx_secretary_service_requests_requester; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_secretary_service_requests_requester ON public.secretary_service_requests USING btree (requested_by_user_id);


--
-- Name: idx_secretary_service_requests_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_secretary_service_requests_status ON public.secretary_service_requests USING btree (status);


--
-- Name: idx_service_indent_dept_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_service_indent_dept_status ON public.service_indents USING btree (department_id, status);


--
-- Name: idx_sick_room_stays_bed; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sick_room_stays_bed ON public.sick_room_stays USING btree (bed_id);


--
-- Name: idx_sick_room_stays_open; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sick_room_stays_open ON public.sick_room_stays USING btree (bed_id) WHERE (discharged_at IS NULL);


--
-- Name: idx_sports_budget_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sports_budget_status ON public.sports_budget_requests USING btree (status);


--
-- Name: idx_sports_fitness_student; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sports_fitness_student ON public.sports_fitness_tests USING btree (student_id);


--
-- Name: idx_sports_fixtures_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sports_fixtures_date ON public.sports_fixtures USING btree (fixture_date);


--
-- Name: idx_sports_injuries_student; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sports_injuries_student ON public.sports_injuries USING btree (student_id);


--
-- Name: idx_sports_issues_equipment; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sports_issues_equipment ON public.sports_equipment_issues USING btree (equipment_id);


--
-- Name: idx_sports_od_hod_approvals_department_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sports_od_hod_approvals_department_status ON public.sports_od_hod_approvals USING btree (department_id, status);


--
-- Name: idx_sports_od_hod_approvals_hod_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sports_od_hod_approvals_hod_status ON public.sports_od_hod_approvals USING btree (hod_user_id, status);


--
-- Name: idx_sports_od_hod_approvals_request; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sports_od_hod_approvals_request ON public.sports_od_hod_approvals USING btree (od_request_id);


--
-- Name: idx_sports_od_letter_numbers_student; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sports_od_letter_numbers_student ON public.sports_od_letter_numbers USING btree (student_id);


--
-- Name: idx_sports_od_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sports_od_status ON public.sports_od_requests USING btree (status);


--
-- Name: idx_sports_session_att_student; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sports_session_att_student ON public.sports_session_attendance USING btree (student_id);


--
-- Name: idx_sports_sessions_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sports_sessions_date ON public.sports_training_sessions USING btree (session_date);


--
-- Name: idx_sports_trials_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sports_trials_status ON public.sports_trials USING btree (status);


--
-- Name: idx_sports_trials_student; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sports_trials_student ON public.sports_trials USING btree (student_id);


--
-- Name: idx_startup_ideas_review_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_startup_ideas_review_status ON public.startup_ideas USING btree (review_status);


--
-- Name: idx_startup_ideas_student; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_startup_ideas_student ON public.startup_ideas USING btree (student_id);


--
-- Name: idx_stationary_requests_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_stationary_requests_user ON public.stationary_requests USING btree (user_id);


--
-- Name: idx_stationery_order_items_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_stationery_order_items_order ON public.stationery_order_items USING btree (order_id);


--
-- Name: idx_stationery_orders_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_stationery_orders_status ON public.stationery_orders USING btree (status);


--
-- Name: idx_stationery_orders_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_stationery_orders_user ON public.stationery_orders USING btree (user_id, created_at);


--
-- Name: idx_stationery_products_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_stationery_products_category ON public.stationery_products USING btree (category) WHERE (is_active = true);


--
-- Name: idx_student_assignment_status_student; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_student_assignment_status_student ON public.student_assignment_status USING btree (student_id);


--
-- Name: idx_student_certifications_student; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_student_certifications_student ON public.student_certifications USING btree (student_id);


--
-- Name: idx_student_competitions_student; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_student_competitions_student ON public.student_competitions USING btree (student_id);


--
-- Name: idx_student_fee_demand_mapping_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_student_fee_demand_mapping_category ON public.student_fee_demand_mapping USING btree (demand_category);


--
-- Name: idx_student_fee_demand_mapping_fee_structure; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_student_fee_demand_mapping_fee_structure ON public.student_fee_demand_mapping USING btree (fee_structure_id);


--
-- Name: idx_student_hackathon_participations_student; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_student_hackathon_participations_student ON public.student_hackathon_participations USING btree (student_id);


--
-- Name: idx_student_id_card_issuances_student_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_student_id_card_issuances_student_id ON public.student_id_card_issuances USING btree (student_id, issued_at);


--
-- Name: idx_student_meeting_notes_student; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_student_meeting_notes_student ON public.student_meeting_notes USING btree (student_id);


--
-- Name: idx_student_no_due_status_student; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_student_no_due_status_student ON public.student_no_due_status USING btree (student_id);


--
-- Name: idx_student_outpasses_student; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_student_outpasses_student ON public.student_outpasses USING btree (student_id);


--
-- Name: idx_student_semester_gpa_student; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_student_semester_gpa_student ON public.student_semester_gpa USING btree (student_id);


--
-- Name: idx_student_semester_gpa_student_semester; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_student_semester_gpa_student_semester ON public.student_semester_gpa USING btree (student_id, semester);


--
-- Name: idx_student_test_scores_student; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_student_test_scores_student ON public.student_test_scores USING btree (student_id);


--
-- Name: idx_student_todo_completions_todo; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_student_todo_completions_todo ON public.student_todo_completions USING btree (todo_id);


--
-- Name: idx_students_batch; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_students_batch ON public.students USING btree (batch_id);


--
-- Name: idx_students_class; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_students_class ON public.students USING btree (class_id);


--
-- Name: idx_students_course; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_students_course ON public.students USING btree (course_id);


--
-- Name: idx_students_quota; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_students_quota ON public.students USING btree (quota_id);


--
-- Name: idx_students_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_students_status ON public.students USING btree (status);


--
-- Name: idx_subject_academic_clearance_mapping; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_subject_academic_clearance_mapping ON public.subject_academic_clearance USING btree (faculty_subject_class_mapping_id);


--
-- Name: idx_timetable_slots_venue; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_timetable_slots_venue ON public.timetable_slots USING btree (venue_id);


--
-- Name: idx_training_examples_approved; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_training_examples_approved ON public.training_examples USING btree (approved_at);


--
-- Name: idx_training_examples_intent; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_training_examples_intent ON public.training_examples USING btree (intent_name);


--
-- Name: idx_ttpr_date_class; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_ttpr_date_class ON public.timetable_period_requests USING btree (request_date, class_id);


--
-- Name: idx_ttpr_from_faculty; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_ttpr_from_faculty ON public.timetable_period_requests USING btree (from_faculty_id, status);


--
-- Name: idx_ttpr_to_faculty; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_ttpr_to_faculty ON public.timetable_period_requests USING btree (to_faculty_id, status);


--
-- Name: idx_user_social_links_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_social_links_user_id ON public.user_social_links USING btree (user_id);


--
-- Name: idx_venue_bookings_venue_time; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_venue_bookings_venue_time ON public.venue_bookings USING btree (venue_id, from_datetime, to_datetime);


--
-- Name: idx_wallet_txn_counterparty; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_wallet_txn_counterparty ON public.wallet_transactions USING btree (counterparty_wallet_id);


--
-- Name: idx_wallet_txn_outlet; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_wallet_txn_outlet ON public.wallet_transactions USING btree (outlet_id, created_at);


--
-- Name: idx_wallet_txn_razorpay_order; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_wallet_txn_razorpay_order ON public.wallet_transactions USING btree (razorpay_order_id) WHERE (razorpay_order_id IS NOT NULL);


--
-- Name: idx_wallet_txn_wallet; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_wallet_txn_wallet ON public.wallet_transactions USING btree (wallet_id, created_at);


--
-- Name: library_racks_rack_code_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX library_racks_rack_code_key ON public.library_racks USING btree (rack_code);


--
-- Name: marks_entry_locks_exam_id_department_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX marks_entry_locks_exam_id_department_id_key ON public.marks_entry_locks USING btree (exam_id, department_id);


--
-- Name: patent_inventors_patent_student_uq; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX patent_inventors_patent_student_uq ON public.patent_inventors USING btree (patent_id, student_id) WHERE (student_id IS NOT NULL);


--
-- Name: publication_contributors_faculty_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX publication_contributors_faculty_idx ON public.publication_contributors USING btree (faculty_id);


--
-- Name: publication_contributors_pub_faculty_uq; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX publication_contributors_pub_faculty_uq ON public.publication_contributors USING btree (publication_id, faculty_id) WHERE (faculty_id IS NOT NULL);


--
-- Name: publication_contributors_pub_student_uq; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX publication_contributors_pub_student_uq ON public.publication_contributors USING btree (publication_id, student_id) WHERE (student_id IS NOT NULL);


--
-- Name: publication_contributors_student_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX publication_contributors_student_idx ON public.publication_contributors USING btree (student_id);


--
-- Name: research_project_members_project_student_uq; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX research_project_members_project_student_uq ON public.research_project_members USING btree (project_id, student_id) WHERE (student_id IS NOT NULL);


--
-- Name: stationary_requests_razorpay_order_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX stationary_requests_razorpay_order_id_key ON public.stationary_requests USING btree (razorpay_order_id);


--
-- Name: stationary_requests_user_id_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX stationary_requests_user_id_created_at_idx ON public.stationary_requests USING btree (user_id, created_at);


--
-- Name: uniq_message_conversations_dm_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX uniq_message_conversations_dm_key ON public.message_conversations USING btree (dm_key) WHERE (dm_key IS NOT NULL);


--
-- Name: uniq_message_requests_active_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX uniq_message_requests_active_key ON public.message_requests USING btree (active_key) WHERE (active_key IS NOT NULL);


--
-- Name: uniq_messages_conv_sender_client_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX uniq_messages_conv_sender_client_id ON public.messages USING btree (conversation_id, sender_user_id, client_generated_id) WHERE (client_generated_id IS NOT NULL);


--
-- Name: uq_announcement_role; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX uq_announcement_role ON public.announcement_role_mapping USING btree (announcement_id, role_id);


--
-- Name: uq_canteen_orders_token_per_day; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX uq_canteen_orders_token_per_day ON public.canteen_orders USING btree (token_date, pickup_token) WHERE (((order_source)::text = 'self'::text) AND ((status)::text <> 'cancelled'::text));


--
-- Name: uq_faculty_daily_attendance_staff_date; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX uq_faculty_daily_attendance_staff_date ON public.faculty_daily_attendance USING btree (staff_user_id, attendance_date) WHERE (staff_user_id IS NOT NULL);


--
-- Name: uq_finance_assignment_per_pop; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX uq_finance_assignment_per_pop ON public.finance_proposal_assignments USING btree (purchase_order_proposal_id) WHERE (purchase_order_proposal_id IS NOT NULL);


--
-- Name: uq_finance_assignment_per_sop; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX uq_finance_assignment_per_sop ON public.finance_proposal_assignments USING btree (service_order_proposal_id) WHERE (service_order_proposal_id IS NOT NULL);


--
-- Name: uq_finance_ledger_one_reversal_per_pop; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX uq_finance_ledger_one_reversal_per_pop ON public.finance_ledger_entries USING btree (purchase_order_proposal_id) WHERE ((source = 'order_cancellation'::public.finance_ledger_source_enum) AND (purchase_order_proposal_id IS NOT NULL));


--
-- Name: uq_finance_ledger_one_reversal_per_sop; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX uq_finance_ledger_one_reversal_per_sop ON public.finance_ledger_entries USING btree (service_order_proposal_id) WHERE ((source = 'order_cancellation'::public.finance_ledger_source_enum) AND (service_order_proposal_id IS NOT NULL));


--
-- Name: uq_medical_appointments_active_per_user_slot; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX uq_medical_appointments_active_per_user_slot ON public.medical_appointments USING btree (slot_date, slot_start, booked_by_user_id) WHERE ((status)::text = ANY ((ARRAY['pending'::character varying, 'approved'::character varying])::text[]));


--
-- Name: uq_medical_camp_reg_faculty; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX uq_medical_camp_reg_faculty ON public.medical_camp_registrations USING btree (camp_id, faculty_id) WHERE (faculty_id IS NOT NULL);


--
-- Name: uq_medical_camp_reg_student; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX uq_medical_camp_reg_student ON public.medical_camp_registrations USING btree (camp_id, student_id) WHERE (student_id IS NOT NULL);


--
-- Name: user_roles_user_id_role_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX user_roles_user_id_role_id_key ON public.user_roles USING btree (user_id, role_id);


--
-- Name: wallet_transactions trg_apply_wallet_transaction; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_apply_wallet_transaction AFTER INSERT OR UPDATE OF status ON public.wallet_transactions FOR EACH ROW EXECUTE FUNCTION public.apply_wallet_transaction();


--
-- Name: finance_order_allotments trg_finance_allotment_guard; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_finance_allotment_guard BEFORE INSERT OR UPDATE ON public.finance_order_allotments FOR EACH ROW EXECUTE FUNCTION public.finance_allotment_guard();


--
-- Name: finance_audit_log trg_finance_audit_append_only; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_finance_audit_append_only BEFORE DELETE OR UPDATE ON public.finance_audit_log FOR EACH ROW EXECUTE FUNCTION public.finance_append_only();


--
-- Name: finance_funds trg_finance_funds_guard; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_finance_funds_guard BEFORE UPDATE ON public.finance_funds FOR EACH ROW EXECUTE FUNCTION public.finance_funds_guard();


--
-- Name: finance_ledger_entries trg_finance_ledger_append_only; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_finance_ledger_append_only BEFORE DELETE OR UPDATE ON public.finance_ledger_entries FOR EACH ROW EXECUTE FUNCTION public.finance_append_only();


--
-- Name: finance_ledger_entries trg_finance_ledger_apply; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_finance_ledger_apply BEFORE INSERT ON public.finance_ledger_entries FOR EACH ROW EXECUTE FUNCTION public.finance_ledger_apply();


--
-- Name: finance_order_tracking_events trg_finance_tracking_events_append_only; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_finance_tracking_events_append_only BEFORE DELETE OR UPDATE ON public.finance_order_tracking_events FOR EACH ROW EXECUTE FUNCTION public.finance_append_only();


--
-- Name: finance_order_tracking trg_finance_tracking_on_insert; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_finance_tracking_on_insert AFTER INSERT ON public.finance_order_tracking FOR EACH ROW EXECUTE FUNCTION public.finance_tracking_on_insert();


--
-- Name: finance_order_tracking trg_finance_tracking_on_update; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_finance_tracking_on_update BEFORE UPDATE ON public.finance_order_tracking FOR EACH ROW EXECUTE FUNCTION public.finance_tracking_on_update();


--
-- Name: feedback_responses trg_set_feedback_rating_label; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_set_feedback_rating_label BEFORE INSERT OR UPDATE OF rating_value ON public.feedback_responses FOR EACH ROW EXECUTE FUNCTION public.set_feedback_rating_label();


--
-- Name: academic_calendars academic_calendars_batch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.academic_calendars
    ADD CONSTRAINT academic_calendars_batch_id_fkey FOREIGN KEY (batch_id) REFERENCES public.batches(id);


--
-- Name: academic_calendars academic_calendars_created_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.academic_calendars
    ADD CONSTRAINT academic_calendars_created_by_user_id_fkey FOREIGN KEY (created_by_user_id) REFERENCES public.users(id);


--
-- Name: achievement_comments achievement_comments_achievement_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.achievement_comments
    ADD CONSTRAINT achievement_comments_achievement_id_fkey FOREIGN KEY (achievement_id) REFERENCES public.department_achievements(id) ON DELETE CASCADE;


--
-- Name: achievement_comments achievement_comments_commented_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.achievement_comments
    ADD CONSTRAINT achievement_comments_commented_by_user_id_fkey FOREIGN KEY (commented_by_user_id) REFERENCES public.users(id);


--
-- Name: achievement_media achievement_media_achievement_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.achievement_media
    ADD CONSTRAINT achievement_media_achievement_id_fkey FOREIGN KEY (achievement_id) REFERENCES public.department_achievements(id) ON DELETE CASCADE;


--
-- Name: admission_profile_drafts admission_profile_drafts_soa_application_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admission_profile_drafts
    ADD CONSTRAINT admission_profile_drafts_soa_application_id_fkey FOREIGN KEY (soa_application_id) REFERENCES public.soa_applications(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: alumni_announcements alumni_announcements_posted_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alumni_announcements
    ADD CONSTRAINT alumni_announcements_posted_by_user_id_fkey FOREIGN KEY (posted_by_user_id) REFERENCES public.users(id);


--
-- Name: alumni_batches alumni_batches_batch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alumni_batches
    ADD CONSTRAINT alumni_batches_batch_id_fkey FOREIGN KEY (batch_id) REFERENCES public.batches(id);


--
-- Name: alumni_group_messages alumni_group_messages_alumni_batch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alumni_group_messages
    ADD CONSTRAINT alumni_group_messages_alumni_batch_id_fkey FOREIGN KEY (alumni_batch_id) REFERENCES public.alumni_batches(id) ON DELETE CASCADE;


--
-- Name: alumni_group_messages alumni_group_messages_posted_by_alumni_member_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alumni_group_messages
    ADD CONSTRAINT alumni_group_messages_posted_by_alumni_member_id_fkey FOREIGN KEY (posted_by_alumni_member_id) REFERENCES public.alumni_members(id);


--
-- Name: alumni_group_messages alumni_group_messages_posted_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alumni_group_messages
    ADD CONSTRAINT alumni_group_messages_posted_by_user_id_fkey FOREIGN KEY (posted_by_user_id) REFERENCES public.users(id);


--
-- Name: alumni_members alumni_members_alumni_batch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alumni_members
    ADD CONSTRAINT alumni_members_alumni_batch_id_fkey FOREIGN KEY (alumni_batch_id) REFERENCES public.alumni_batches(id) ON DELETE CASCADE;


--
-- Name: alumni_members alumni_members_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alumni_members
    ADD CONSTRAINT alumni_members_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: ambulance_status ambulance_status_driver_staff_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ambulance_status
    ADD CONSTRAINT ambulance_status_driver_staff_id_fkey FOREIGN KEY (driver_staff_id) REFERENCES public.medical_staff(id) ON DELETE SET NULL;


--
-- Name: announcement_comments announcement_comments_announcement_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.announcement_comments
    ADD CONSTRAINT announcement_comments_announcement_id_fkey FOREIGN KEY (announcement_id) REFERENCES public.announcements(id) ON DELETE CASCADE;


--
-- Name: announcement_comments announcement_comments_commented_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.announcement_comments
    ADD CONSTRAINT announcement_comments_commented_by_user_id_fkey FOREIGN KEY (commented_by_user_id) REFERENCES public.users(id);


--
-- Name: announcement_comments announcement_comments_parent_comment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.announcement_comments
    ADD CONSTRAINT announcement_comments_parent_comment_id_fkey FOREIGN KEY (parent_comment_id) REFERENCES public.announcement_comments(id) ON DELETE CASCADE;


--
-- Name: announcement_media announcement_media_announcement_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.announcement_media
    ADD CONSTRAINT announcement_media_announcement_id_fkey FOREIGN KEY (announcement_id) REFERENCES public.announcements(id) ON DELETE CASCADE;


--
-- Name: announcements announcements_batch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.announcements
    ADD CONSTRAINT announcements_batch_id_fkey FOREIGN KEY (batch_id) REFERENCES public.batches(id);


--
-- Name: announcements announcements_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.announcements
    ADD CONSTRAINT announcements_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id);


--
-- Name: announcements announcements_posted_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.announcements
    ADD CONSTRAINT announcements_posted_by_user_id_fkey FOREIGN KEY (posted_by_user_id) REFERENCES public.users(id);


--
-- Name: appraisal_attachments appraisal_attachments_appraisal_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.appraisal_attachments
    ADD CONSTRAINT appraisal_attachments_appraisal_request_id_fkey FOREIGN KEY (appraisal_request_id) REFERENCES public.appraisal_requests(id) ON DELETE CASCADE;


--
-- Name: appraisal_attachments appraisal_attachments_division_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.appraisal_attachments
    ADD CONSTRAINT appraisal_attachments_division_id_fkey FOREIGN KEY (division_id) REFERENCES public.appraisal_divisions(id);


--
-- Name: appraisal_criteria appraisal_criteria_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.appraisal_criteria
    ADD CONSTRAINT appraisal_criteria_created_by_fkey FOREIGN KEY (created_by_user_id) REFERENCES public.users(id);


--
-- Name: appraisal_criteria appraisal_criteria_division_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.appraisal_criteria
    ADD CONSTRAINT appraisal_criteria_division_id_fkey FOREIGN KEY (division_id) REFERENCES public.appraisal_divisions(id);


--
-- Name: appraisal_cycles appraisal_cycles_creator_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.appraisal_cycles
    ADD CONSTRAINT appraisal_cycles_creator_fkey FOREIGN KEY (created_by_user_id) REFERENCES public.users(id);


--
-- Name: appraisal_entries appraisal_entries_appraisal_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.appraisal_entries
    ADD CONSTRAINT appraisal_entries_appraisal_request_id_fkey FOREIGN KEY (appraisal_request_id) REFERENCES public.appraisal_requests(id) ON DELETE CASCADE;


--
-- Name: appraisal_entries appraisal_entries_criteria_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.appraisal_entries
    ADD CONSTRAINT appraisal_entries_criteria_id_fkey FOREIGN KEY (criteria_id) REFERENCES public.appraisal_criteria(id);


--
-- Name: appraisal_requests appraisal_requests_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.appraisal_requests
    ADD CONSTRAINT appraisal_requests_faculty_id_fkey FOREIGN KEY (faculty_id) REFERENCES public.faculty(id);


--
-- Name: appraisal_requests appraisal_requests_hod_reviewed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.appraisal_requests
    ADD CONSTRAINT appraisal_requests_hod_reviewed_by_fkey FOREIGN KEY (hod_reviewed_by) REFERENCES public.users(id);


--
-- Name: appraisal_requests appraisal_requests_management_approved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.appraisal_requests
    ADD CONSTRAINT appraisal_requests_management_approved_by_fkey FOREIGN KEY (management_approved_by) REFERENCES public.users(id);


--
-- Name: appraisal_requests appraisal_requests_staff_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.appraisal_requests
    ADD CONSTRAINT appraisal_requests_staff_user_id_fkey FOREIGN KEY (staff_user_id) REFERENCES public.users(id);


--
-- Name: assignments assignments_class_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assignments
    ADD CONSTRAINT assignments_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.classes(id);


--
-- Name: assignments assignments_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assignments
    ADD CONSTRAINT assignments_faculty_id_fkey FOREIGN KEY (faculty_id) REFERENCES public.faculty(id);


--
-- Name: assignments assignments_subject_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assignments
    ADD CONSTRAINT assignments_subject_id_fkey FOREIGN KEY (subject_id) REFERENCES public.subjects(id);


--
-- Name: attendance_record_changes attendance_record_changes_attendance_record_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attendance_record_changes
    ADD CONSTRAINT attendance_record_changes_attendance_record_id_fkey FOREIGN KEY (attendance_record_id) REFERENCES public.attendance_records(id) ON DELETE CASCADE;


--
-- Name: attendance_record_changes attendance_record_changes_changed_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attendance_record_changes
    ADD CONSTRAINT attendance_record_changes_changed_by_user_id_fkey FOREIGN KEY (changed_by_user_id) REFERENCES public.users(id);


--
-- Name: attendance_records attendance_records_class_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attendance_records
    ADD CONSTRAINT attendance_records_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.classes(id);


--
-- Name: attendance_records attendance_records_marked_by_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attendance_records
    ADD CONSTRAINT attendance_records_marked_by_faculty_id_fkey FOREIGN KEY (marked_by_faculty_id) REFERENCES public.faculty(id);


--
-- Name: attendance_records attendance_records_subject_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attendance_records
    ADD CONSTRAINT attendance_records_subject_id_fkey FOREIGN KEY (subject_id) REFERENCES public.subjects(id);


--
-- Name: audit_logs audit_logs_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_user_fkey FOREIGN KEY (performed_by_user_id) REFERENCES public.users(id);


--
-- Name: bank_reconciliation_entries bank_reconciliation_entries_fee_payment_gateway_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bank_reconciliation_entries
    ADD CONSTRAINT bank_reconciliation_entries_fee_payment_gateway_order_id_fkey FOREIGN KEY (fee_payment_gateway_order_id) REFERENCES public.fee_payment_gateway_orders(id);


--
-- Name: bank_reconciliation_entries bank_reconciliation_entries_matched_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bank_reconciliation_entries
    ADD CONSTRAINT bank_reconciliation_entries_matched_by_user_id_fkey FOREIGN KEY (matched_by_user_id) REFERENCES public.users(id);


--
-- Name: bills bills_created_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bills
    ADD CONSTRAINT bills_created_by_user_id_fkey FOREIGN KEY (created_by_user_id) REFERENCES public.users(id);


--
-- Name: bills bills_purchase_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bills
    ADD CONSTRAINT bills_purchase_order_id_fkey FOREIGN KEY (purchase_order_id) REFERENCES public.purchase_orders(id);


--
-- Name: bills bills_service_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bills
    ADD CONSTRAINT bills_service_order_id_fkey FOREIGN KEY (service_order_id) REFERENCES public.service_orders(id);


--
-- Name: bills bills_vendor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bills
    ADD CONSTRAINT bills_vendor_id_fkey FOREIGN KEY (vendor_id) REFERENCES public.vendors(id);


--
-- Name: bonafide_requests bonafide_requests_approved_by_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bonafide_requests
    ADD CONSTRAINT bonafide_requests_approved_by_faculty_id_fkey FOREIGN KEY (approved_by_faculty_id) REFERENCES public.faculty(id);


--
-- Name: bonafide_requests bonafide_requests_issued_by_hod_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bonafide_requests
    ADD CONSTRAINT bonafide_requests_issued_by_hod_user_id_fkey FOREIGN KEY (issued_by_hod_user_id) REFERENCES public.users(id);


--
-- Name: bonafide_requests bonafide_requests_reason_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bonafide_requests
    ADD CONSTRAINT bonafide_requests_reason_id_fkey FOREIGN KEY (reason_id) REFERENCES public.bonafide_reasons(id);


--
-- Name: bonafide_requests bonafide_requests_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bonafide_requests
    ADD CONSTRAINT bonafide_requests_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: book_borrow_records book_borrow_records_book_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.book_borrow_records
    ADD CONSTRAINT book_borrow_records_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(id);


--
-- Name: book_borrow_records book_borrow_records_damage_lost_collected_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.book_borrow_records
    ADD CONSTRAINT book_borrow_records_damage_lost_collected_by_user_id_fkey FOREIGN KEY (damage_lost_collected_by_user_id) REFERENCES public.users(id);


--
-- Name: book_borrow_records book_borrow_records_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.book_borrow_records
    ADD CONSTRAINT book_borrow_records_faculty_id_fkey FOREIGN KEY (faculty_id) REFERENCES public.faculty(id);


--
-- Name: book_borrow_records book_borrow_records_fine_collected_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.book_borrow_records
    ADD CONSTRAINT book_borrow_records_fine_collected_by_user_id_fkey FOREIGN KEY (fine_collected_by_user_id) REFERENCES public.users(id);


--
-- Name: book_borrow_records book_borrow_records_replacement_indent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.book_borrow_records
    ADD CONSTRAINT book_borrow_records_replacement_indent_id_fkey FOREIGN KEY (replacement_indent_id) REFERENCES public.purchase_indents(id);


--
-- Name: book_borrow_records book_borrow_records_staff_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.book_borrow_records
    ADD CONSTRAINT book_borrow_records_staff_user_id_fkey FOREIGN KEY (staff_user_id) REFERENCES public.users(id);


--
-- Name: book_borrow_records book_borrow_records_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.book_borrow_records
    ADD CONSTRAINT book_borrow_records_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: book_borrow_requests book_borrow_requests_book_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.book_borrow_requests
    ADD CONSTRAINT book_borrow_requests_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(id);


--
-- Name: book_borrow_requests book_borrow_requests_borrow_record_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.book_borrow_requests
    ADD CONSTRAINT book_borrow_requests_borrow_record_id_fkey FOREIGN KEY (borrow_record_id) REFERENCES public.book_borrow_records(id);


--
-- Name: book_borrow_requests book_borrow_requests_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.book_borrow_requests
    ADD CONSTRAINT book_borrow_requests_faculty_id_fkey FOREIGN KEY (faculty_id) REFERENCES public.faculty(id);


--
-- Name: book_borrow_requests book_borrow_requests_reviewed_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.book_borrow_requests
    ADD CONSTRAINT book_borrow_requests_reviewed_by_user_id_fkey FOREIGN KEY (reviewed_by_user_id) REFERENCES public.users(id);


--
-- Name: book_borrow_requests book_borrow_requests_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.book_borrow_requests
    ADD CONSTRAINT book_borrow_requests_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: books books_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.books
    ADD CONSTRAINT books_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.book_categories(id);


--
-- Name: books books_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.books
    ADD CONSTRAINT books_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id);


--
-- Name: books books_rack_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.books
    ADD CONSTRAINT books_rack_id_fkey FOREIGN KEY (rack_id) REFERENCES public.library_racks(id);


--
-- Name: bus_documents bus_documents_bus_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bus_documents
    ADD CONSTRAINT bus_documents_bus_id_fkey FOREIGN KEY (bus_id) REFERENCES public.buses(id) ON DELETE CASCADE;


--
-- Name: bus_fuel_logs bus_fuel_logs_bus_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bus_fuel_logs
    ADD CONSTRAINT bus_fuel_logs_bus_id_fkey FOREIGN KEY (bus_id) REFERENCES public.buses(id) ON DELETE CASCADE;


--
-- Name: bus_fuel_logs bus_fuel_logs_recorded_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bus_fuel_logs
    ADD CONSTRAINT bus_fuel_logs_recorded_by_user_id_fkey FOREIGN KEY (recorded_by_user_id) REFERENCES public.users(id);


--
-- Name: bus_live_locations bus_live_locations_bus_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bus_live_locations
    ADD CONSTRAINT bus_live_locations_bus_id_fkey FOREIGN KEY (bus_id) REFERENCES public.buses(id);


--
-- Name: bus_safety_checks bus_safety_checks_bus_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bus_safety_checks
    ADD CONSTRAINT bus_safety_checks_bus_id_fkey FOREIGN KEY (bus_id) REFERENCES public.buses(id) ON DELETE CASCADE;


--
-- Name: bus_service_logs bus_service_logs_bus_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bus_service_logs
    ADD CONSTRAINT bus_service_logs_bus_id_fkey FOREIGN KEY (bus_id) REFERENCES public.buses(id) ON DELETE CASCADE;


--
-- Name: bus_service_logs bus_service_logs_recorded_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bus_service_logs
    ADD CONSTRAINT bus_service_logs_recorded_by_user_id_fkey FOREIGN KEY (recorded_by_user_id) REFERENCES public.users(id);


--
-- Name: buses buses_route_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.buses
    ADD CONSTRAINT buses_route_id_fkey FOREIGN KEY (route_id) REFERENCES public.transport_routes(id);


--
-- Name: calendar_events calendar_events_created_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.calendar_events
    ADD CONSTRAINT calendar_events_created_by_user_id_fkey FOREIGN KEY (created_by_user_id) REFERENCES public.users(id);


--
-- Name: calendar_events calendar_holidays_academic_calendar_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.calendar_events
    ADD CONSTRAINT calendar_holidays_academic_calendar_id_fkey FOREIGN KEY (academic_calendar_id) REFERENCES public.academic_calendars(id) ON DELETE CASCADE;


--
-- Name: campus_outing_requests campus_outing_requests_approved_by_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campus_outing_requests
    ADD CONSTRAINT campus_outing_requests_approved_by_faculty_id_fkey FOREIGN KEY (approved_by_faculty_id) REFERENCES public.faculty(id);


--
-- Name: campus_outing_requests campus_outing_requests_approved_by_hod_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campus_outing_requests
    ADD CONSTRAINT campus_outing_requests_approved_by_hod_user_id_fkey FOREIGN KEY (approved_by_hod_user_id) REFERENCES public.users(id);


--
-- Name: campus_outing_requests campus_outing_requests_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campus_outing_requests
    ADD CONSTRAINT campus_outing_requests_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: canteen_bills canteen_bills_cashier_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.canteen_bills
    ADD CONSTRAINT canteen_bills_cashier_user_id_fkey FOREIGN KEY (cashier_user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: canteen_bills canteen_bills_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.canteen_bills
    ADD CONSTRAINT canteen_bills_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.canteen_orders(id) ON DELETE SET NULL;


--
-- Name: canteen_dishes canteen_dishes_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.canteen_dishes
    ADD CONSTRAINT canteen_dishes_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.canteen_dish_categories(id) ON DELETE SET NULL;


--
-- Name: canteen_expense_products canteen_expense_products_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.canteen_expense_products
    ADD CONSTRAINT canteen_expense_products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.canteen_expense_categories(id) ON DELETE SET NULL;


--
-- Name: canteen_expenses canteen_expenses_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.canteen_expenses
    ADD CONSTRAINT canteen_expenses_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.canteen_expense_categories(id) ON DELETE SET NULL;


--
-- Name: canteen_expenses canteen_expenses_recorded_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.canteen_expenses
    ADD CONSTRAINT canteen_expenses_recorded_by_user_id_fkey FOREIGN KEY (recorded_by_user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: canteen_gst_rates canteen_gst_rates_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.canteen_gst_rates
    ADD CONSTRAINT canteen_gst_rates_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.canteen_dish_categories(id) ON DELETE CASCADE;


--
-- Name: canteen_order_items canteen_order_items_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.canteen_order_items
    ADD CONSTRAINT canteen_order_items_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.canteen_dish_categories(id) ON DELETE SET NULL;


--
-- Name: canteen_order_items canteen_order_items_dish_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.canteen_order_items
    ADD CONSTRAINT canteen_order_items_dish_id_fkey FOREIGN KEY (dish_id) REFERENCES public.canteen_dishes(id) ON DELETE SET NULL;


--
-- Name: canteen_order_items canteen_order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.canteen_order_items
    ADD CONSTRAINT canteen_order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.canteen_orders(id) ON DELETE CASCADE;


--
-- Name: canteen_orders canteen_orders_placed_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.canteen_orders
    ADD CONSTRAINT canteen_orders_placed_by_user_id_fkey FOREIGN KEY (placed_by_user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: canteen_orders canteen_orders_wallet_transaction_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.canteen_orders
    ADD CONSTRAINT canteen_orders_wallet_transaction_id_fkey FOREIGN KEY (wallet_transaction_id) REFERENCES public.wallet_transactions(id) ON DELETE SET NULL;


--
-- Name: canteen_recipe_ingredients canteen_recipe_ingredients_ingredient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.canteen_recipe_ingredients
    ADD CONSTRAINT canteen_recipe_ingredients_ingredient_id_fkey FOREIGN KEY (ingredient_id) REFERENCES public.canteen_ingredients(id) ON DELETE RESTRICT;


--
-- Name: canteen_recipe_ingredients canteen_recipe_ingredients_recipe_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.canteen_recipe_ingredients
    ADD CONSTRAINT canteen_recipe_ingredients_recipe_id_fkey FOREIGN KEY (recipe_id) REFERENCES public.canteen_recipes(id) ON DELETE CASCADE;


--
-- Name: canteen_recipes canteen_recipes_dish_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.canteen_recipes
    ADD CONSTRAINT canteen_recipes_dish_id_fkey FOREIGN KEY (dish_id) REFERENCES public.canteen_dishes(id) ON DELETE CASCADE;


--
-- Name: canteen_stock_batches canteen_stock_batches_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.canteen_stock_batches
    ADD CONSTRAINT canteen_stock_batches_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.canteen_expense_products(id) ON DELETE CASCADE;


--
-- Name: canteen_stock_transactions canteen_stock_transactions_batch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.canteen_stock_transactions
    ADD CONSTRAINT canteen_stock_transactions_batch_id_fkey FOREIGN KEY (batch_id) REFERENCES public.canteen_stock_batches(id) ON DELETE SET NULL;


--
-- Name: canteen_stock_transactions canteen_stock_transactions_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.canteen_stock_transactions
    ADD CONSTRAINT canteen_stock_transactions_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.canteen_expense_products(id) ON DELETE CASCADE;


--
-- Name: canteen_todays_specials canteen_todays_specials_created_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.canteen_todays_specials
    ADD CONSTRAINT canteen_todays_specials_created_by_user_id_fkey FOREIGN KEY (created_by_user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: certificate_requests certificate_requests_certificate_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.certificate_requests
    ADD CONSTRAINT certificate_requests_certificate_type_id_fkey FOREIGN KEY (certificate_type_id) REFERENCES public.certificate_types(id) ON DELETE CASCADE;


--
-- Name: certificate_requests certificate_requests_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.certificate_requests
    ADD CONSTRAINT certificate_requests_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE;


--
-- Name: chat_messages chat_messages_conversation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT chat_messages_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.chat_conversations(id) ON DELETE CASCADE;


--
-- Name: class_mentors class_mentors_assigned_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.class_mentors
    ADD CONSTRAINT class_mentors_assigned_by_user_id_fkey FOREIGN KEY (assigned_by_user_id) REFERENCES public.users(id);


--
-- Name: class_mentors class_mentors_class_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.class_mentors
    ADD CONSTRAINT class_mentors_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.classes(id);


--
-- Name: class_mentors class_mentors_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.class_mentors
    ADD CONSTRAINT class_mentors_faculty_id_fkey FOREIGN KEY (faculty_id) REFERENCES public.faculty(id);


--
-- Name: class_subjects class_subjects_class_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.class_subjects
    ADD CONSTRAINT class_subjects_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.classes(id);


--
-- Name: class_subjects class_subjects_subject_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.class_subjects
    ADD CONSTRAINT class_subjects_subject_id_fkey FOREIGN KEY (subject_id) REFERENCES public.subjects(id);


--
-- Name: classes classes_batch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.classes
    ADD CONSTRAINT classes_batch_id_fkey FOREIGN KEY (batch_id) REFERENCES public.batches(id);


--
-- Name: classes classes_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.classes
    ADD CONSTRAINT classes_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id);


--
-- Name: classes classes_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.classes
    ADD CONSTRAINT classes_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id);


--
-- Name: coe_notification_broadcasts coe_notification_broadcasts_posted_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coe_notification_broadcasts
    ADD CONSTRAINT coe_notification_broadcasts_posted_by_user_id_fkey FOREIGN KEY (posted_by_user_id) REFERENCES public.users(id);


--
-- Name: coe_profiles coe_profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coe_profiles
    ADD CONSTRAINT coe_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: condonation_requests condonation_requests_exam_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.condonation_requests
    ADD CONSTRAINT condonation_requests_exam_id_fkey FOREIGN KEY (exam_id) REFERENCES public.exams(id) ON DELETE CASCADE;


--
-- Name: condonation_requests condonation_requests_reviewed_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.condonation_requests
    ADD CONSTRAINT condonation_requests_reviewed_by_user_id_fkey FOREIGN KEY (reviewed_by_user_id) REFERENCES public.users(id);


--
-- Name: condonation_requests condonation_requests_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.condonation_requests
    ADD CONSTRAINT condonation_requests_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE;


--
-- Name: confidential_access_events confidential_access_events_person_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.confidential_access_events
    ADD CONSTRAINT confidential_access_events_person_user_id_fkey FOREIGN KEY (person_user_id) REFERENCES public.users(id);


--
-- Name: confidential_access_events confidential_access_events_question_paper_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.confidential_access_events
    ADD CONSTRAINT confidential_access_events_question_paper_id_fkey FOREIGN KEY (question_paper_id) REFERENCES public.question_papers(id);


--
-- Name: confidential_access_events confidential_access_events_witness_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.confidential_access_events
    ADD CONSTRAINT confidential_access_events_witness_user_id_fkey FOREIGN KEY (witness_user_id) REFERENCES public.users(id);


--
-- Name: convocation_registrations convocation_registrations_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.convocation_registrations
    ADD CONSTRAINT convocation_registrations_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE;


--
-- Name: course_outcomes course_outcomes_subject_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_outcomes
    ADD CONSTRAINT course_outcomes_subject_id_fkey FOREIGN KEY (subject_id) REFERENCES public.subjects(id);


--
-- Name: course_result_status course_result_status_approved_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_result_status
    ADD CONSTRAINT course_result_status_approved_by_user_id_fkey FOREIGN KEY (approved_by_user_id) REFERENCES public.users(id);


--
-- Name: course_result_status course_result_status_exam_subject_mapping_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_result_status
    ADD CONSTRAINT course_result_status_exam_subject_mapping_id_fkey FOREIGN KEY (exam_subject_mapping_id) REFERENCES public.exam_subject_mapping(id) ON DELETE CASCADE;


--
-- Name: courses courses_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id);


--
-- Name: curriculum_mappings curriculum_mappings_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.curriculum_mappings
    ADD CONSTRAINT curriculum_mappings_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id);


--
-- Name: curriculum_mappings curriculum_mappings_subject_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.curriculum_mappings
    ADD CONSTRAINT curriculum_mappings_subject_id_fkey FOREIGN KEY (subject_id) REFERENCES public.subjects(id);


--
-- Name: department_achievements department_achievements_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.department_achievements
    ADD CONSTRAINT department_achievements_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id);


--
-- Name: department_achievements department_achievements_posted_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.department_achievements
    ADD CONSTRAINT department_achievements_posted_by_user_id_fkey FOREIGN KEY (posted_by_user_id) REFERENCES public.users(id);


--
-- Name: department_documents department_documents_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.department_documents
    ADD CONSTRAINT department_documents_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id);


--
-- Name: department_documents department_documents_uploaded_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.department_documents
    ADD CONSTRAINT department_documents_uploaded_by_user_id_fkey FOREIGN KEY (uploaded_by_user_id) REFERENCES public.users(id);


--
-- Name: department_documents department_documents_verified_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.department_documents
    ADD CONSTRAINT department_documents_verified_by_user_id_fkey FOREIGN KEY (verified_by_user_id) REFERENCES public.users(id);


--
-- Name: department_events department_events_created_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.department_events
    ADD CONSTRAINT department_events_created_by_user_id_fkey FOREIGN KEY (created_by_user_id) REFERENCES public.users(id);


--
-- Name: department_events department_events_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.department_events
    ADD CONSTRAINT department_events_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id);


--
-- Name: department_events department_events_owner_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.department_events
    ADD CONSTRAINT department_events_owner_faculty_id_fkey FOREIGN KEY (owner_faculty_id) REFERENCES public.faculty(id);


--
-- Name: department_events department_events_venue_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.department_events
    ADD CONSTRAINT department_events_venue_id_fkey FOREIGN KEY (venue_id) REFERENCES public.venues(id);


--
-- Name: department_labs department_labs_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.department_labs
    ADD CONSTRAINT department_labs_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id);


--
-- Name: department_labs department_labs_incharge_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.department_labs
    ADD CONSTRAINT department_labs_incharge_faculty_id_fkey FOREIGN KEY (incharge_faculty_id) REFERENCES public.faculty(id);


--
-- Name: department_meetings department_meetings_chair_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.department_meetings
    ADD CONSTRAINT department_meetings_chair_user_id_fkey FOREIGN KEY (chair_user_id) REFERENCES public.users(id);


--
-- Name: department_meetings department_meetings_created_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.department_meetings
    ADD CONSTRAINT department_meetings_created_by_user_id_fkey FOREIGN KEY (created_by_user_id) REFERENCES public.users(id);


--
-- Name: department_meetings department_meetings_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.department_meetings
    ADD CONSTRAINT department_meetings_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id);


--
-- Name: department_mous department_mous_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.department_mous
    ADD CONSTRAINT department_mous_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id);


--
-- Name: department_research_funding department_research_funding_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.department_research_funding
    ADD CONSTRAINT department_research_funding_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id);


--
-- Name: departments departments_hod_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_hod_fkey FOREIGN KEY (head_of_department_faculty_id) REFERENCES public.faculty(id);


--
-- Name: device_push_tokens device_push_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.device_push_tokens
    ADD CONSTRAINT device_push_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: e_resources e_resources_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.e_resources
    ADD CONSTRAINT e_resources_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.book_categories(id);


--
-- Name: e_resources e_resources_uploaded_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.e_resources
    ADD CONSTRAINT e_resources_uploaded_by_user_id_fkey FOREIGN KEY (uploaded_by_user_id) REFERENCES public.users(id);


--
-- Name: edc_documents edc_documents_reviewed_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.edc_documents
    ADD CONSTRAINT edc_documents_reviewed_by_user_id_fkey FOREIGN KEY (reviewed_by_user_id) REFERENCES public.users(id);


--
-- Name: edc_documents edc_documents_student_entrepreneurship_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.edc_documents
    ADD CONSTRAINT edc_documents_student_entrepreneurship_id_fkey FOREIGN KEY (student_entrepreneurship_id) REFERENCES public.student_entrepreneurship(id) ON DELETE CASCADE;


--
-- Name: edc_documents edc_documents_uploaded_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.edc_documents
    ADD CONSTRAINT edc_documents_uploaded_by_user_id_fkey FOREIGN KEY (uploaded_by_user_id) REFERENCES public.users(id);


--
-- Name: edc_events edc_events_created_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.edc_events
    ADD CONSTRAINT edc_events_created_by_user_id_fkey FOREIGN KEY (created_by_user_id) REFERENCES public.users(id);


--
-- Name: edc_funding_records edc_funding_records_created_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.edc_funding_records
    ADD CONSTRAINT edc_funding_records_created_by_user_id_fkey FOREIGN KEY (created_by_user_id) REFERENCES public.users(id);


--
-- Name: edc_funding_records edc_funding_records_student_entrepreneurship_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.edc_funding_records
    ADD CONSTRAINT edc_funding_records_student_entrepreneurship_id_fkey FOREIGN KEY (student_entrepreneurship_id) REFERENCES public.student_entrepreneurship(id) ON DELETE CASCADE;


--
-- Name: edc_reports edc_reports_prepared_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.edc_reports
    ADD CONSTRAINT edc_reports_prepared_by_user_id_fkey FOREIGN KEY (prepared_by_user_id) REFERENCES public.users(id);


--
-- Name: education_loan_dd education_loan_dd_received_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.education_loan_dd
    ADD CONSTRAINT education_loan_dd_received_by_user_id_fkey FOREIGN KEY (received_by_user_id) REFERENCES public.users(id);


--
-- Name: education_loan_dd education_loan_dd_student_fee_demand_mapping_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.education_loan_dd
    ADD CONSTRAINT education_loan_dd_student_fee_demand_mapping_id_fkey FOREIGN KEY (student_fee_demand_mapping_id) REFERENCES public.student_fee_demand_mapping(id);


--
-- Name: exam_fee_transactions exam_fee_transactions_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exam_fee_transactions
    ADD CONSTRAINT exam_fee_transactions_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE;


--
-- Name: exam_marks exam_marks_entered_by_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exam_marks
    ADD CONSTRAINT exam_marks_entered_by_faculty_id_fkey FOREIGN KEY (entered_by_faculty_id) REFERENCES public.faculty(id);


--
-- Name: exam_marks exam_marks_exam_subject_mapping_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exam_marks
    ADD CONSTRAINT exam_marks_exam_subject_mapping_id_fkey FOREIGN KEY (exam_subject_mapping_id) REFERENCES public.exam_subject_mapping(id);


--
-- Name: exam_marks exam_marks_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exam_marks
    ADD CONSTRAINT exam_marks_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: exam_marks exam_marks_verified_by_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exam_marks
    ADD CONSTRAINT exam_marks_verified_by_faculty_id_fkey FOREIGN KEY (verified_by_faculty_id) REFERENCES public.faculty(id);


--
-- Name: exam_registrations exam_registrations_approved_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exam_registrations
    ADD CONSTRAINT exam_registrations_approved_by_user_id_fkey FOREIGN KEY (approved_by_user_id) REFERENCES public.users(id);


--
-- Name: exam_registrations exam_registrations_exam_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exam_registrations
    ADD CONSTRAINT exam_registrations_exam_id_fkey FOREIGN KEY (exam_id) REFERENCES public.exams(id) ON DELETE CASCADE;


--
-- Name: exam_registrations exam_registrations_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exam_registrations
    ADD CONSTRAINT exam_registrations_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE;


--
-- Name: exam_subject_mapping exam_subject_mapping_class_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exam_subject_mapping
    ADD CONSTRAINT exam_subject_mapping_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.classes(id);


--
-- Name: exam_subject_mapping exam_subject_mapping_exam_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exam_subject_mapping
    ADD CONSTRAINT exam_subject_mapping_exam_id_fkey FOREIGN KEY (exam_id) REFERENCES public.exams(id) ON DELETE CASCADE;


--
-- Name: exam_subject_mapping exam_subject_mapping_subject_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exam_subject_mapping
    ADD CONSTRAINT exam_subject_mapping_subject_id_fkey FOREIGN KEY (subject_id) REFERENCES public.subjects(id);


--
-- Name: exam_timetable exam_timetable_exam_subject_mapping_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exam_timetable
    ADD CONSTRAINT exam_timetable_exam_subject_mapping_id_fkey FOREIGN KEY (exam_subject_mapping_id) REFERENCES public.exam_subject_mapping(id);


--
-- Name: exam_timetable exam_timetable_venue_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exam_timetable
    ADD CONSTRAINT exam_timetable_venue_id_fkey FOREIGN KEY (venue_id) REFERENCES public.venues(id);


--
-- Name: exam_timetable exam_timetable_version_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exam_timetable
    ADD CONSTRAINT exam_timetable_version_id_fkey FOREIGN KEY (version_id) REFERENCES public.exam_timetable_versions(id) ON DELETE CASCADE;


--
-- Name: exam_timetable_versions exam_timetable_versions_cloned_from_version_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exam_timetable_versions
    ADD CONSTRAINT exam_timetable_versions_cloned_from_version_id_fkey FOREIGN KEY (cloned_from_version_id) REFERENCES public.exam_timetable_versions(id);


--
-- Name: exam_timetable_versions exam_timetable_versions_created_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exam_timetable_versions
    ADD CONSTRAINT exam_timetable_versions_created_by_user_id_fkey FOREIGN KEY (created_by_user_id) REFERENCES public.users(id);


--
-- Name: exam_timetable_versions exam_timetable_versions_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exam_timetable_versions
    ADD CONSTRAINT exam_timetable_versions_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id);


--
-- Name: exam_timetable_versions exam_timetable_versions_exam_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exam_timetable_versions
    ADD CONSTRAINT exam_timetable_versions_exam_id_fkey FOREIGN KEY (exam_id) REFERENCES public.exams(id) ON DELETE CASCADE;


--
-- Name: exam_timetable_versions exam_timetable_versions_published_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exam_timetable_versions
    ADD CONSTRAINT exam_timetable_versions_published_by_user_id_fkey FOREIGN KEY (published_by_user_id) REFERENCES public.users(id);


--
-- Name: exams exams_batch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exams
    ADD CONSTRAINT exams_batch_id_fkey FOREIGN KEY (batch_id) REFERENCES public.batches(id);


--
-- Name: exams exams_created_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exams
    ADD CONSTRAINT exams_created_by_user_id_fkey FOREIGN KEY (created_by_user_id) REFERENCES public.users(id);


--
-- Name: exams exams_exam_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exams
    ADD CONSTRAINT exams_exam_type_id_fkey FOREIGN KEY (exam_type_id) REFERENCES public.exam_types(id);


--
-- Name: expenses expenses_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.expense_categories(id);


--
-- Name: expenses expenses_recorded_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_recorded_by_user_id_fkey FOREIGN KEY (recorded_by_user_id) REFERENCES public.users(id);


--
-- Name: faculty_attendance_corrections fac_att_corr_faculty_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_attendance_corrections
    ADD CONSTRAINT fac_att_corr_faculty_fkey FOREIGN KEY (faculty_id) REFERENCES public.faculty(id);


--
-- Name: faculty_attendance_corrections fac_att_corr_requester_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_attendance_corrections
    ADD CONSTRAINT fac_att_corr_requester_fkey FOREIGN KEY (requested_by_user_id) REFERENCES public.users(id);


--
-- Name: faculty_activity_log faculty_activity_log_created_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_activity_log
    ADD CONSTRAINT faculty_activity_log_created_by_user_id_fkey FOREIGN KEY (created_by_user_id) REFERENCES public.users(id);


--
-- Name: faculty_activity_log faculty_activity_log_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_activity_log
    ADD CONSTRAINT faculty_activity_log_faculty_id_fkey FOREIGN KEY (faculty_id) REFERENCES public.faculty(id);


--
-- Name: faculty_awards faculty_awards_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_awards
    ADD CONSTRAINT faculty_awards_faculty_id_fkey FOREIGN KEY (faculty_id) REFERENCES public.faculty(id);


--
-- Name: faculty_certifications faculty_certifications_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_certifications
    ADD CONSTRAINT faculty_certifications_faculty_id_fkey FOREIGN KEY (faculty_id) REFERENCES public.faculty(id);


--
-- Name: faculty_committee_roles faculty_committee_roles_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_committee_roles
    ADD CONSTRAINT faculty_committee_roles_faculty_id_fkey FOREIGN KEY (faculty_id) REFERENCES public.faculty(id);


--
-- Name: faculty_daily_attendance faculty_daily_attendance_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_daily_attendance
    ADD CONSTRAINT faculty_daily_attendance_faculty_id_fkey FOREIGN KEY (faculty_id) REFERENCES public.faculty(id);


--
-- Name: faculty_daily_attendance faculty_daily_attendance_staff_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_daily_attendance
    ADD CONSTRAINT faculty_daily_attendance_staff_user_id_fkey FOREIGN KEY (staff_user_id) REFERENCES public.users(id);


--
-- Name: faculty faculty_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty
    ADD CONSTRAINT faculty_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id);


--
-- Name: faculty faculty_designation_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty
    ADD CONSTRAINT faculty_designation_fkey FOREIGN KEY (designation_id) REFERENCES public.designations(id);


--
-- Name: faculty_development_programs faculty_development_programs_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_development_programs
    ADD CONSTRAINT faculty_development_programs_faculty_id_fkey FOREIGN KEY (faculty_id) REFERENCES public.faculty(id);


--
-- Name: faculty_documents faculty_documents_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_documents
    ADD CONSTRAINT faculty_documents_faculty_id_fkey FOREIGN KEY (faculty_id) REFERENCES public.faculty(id);


--
-- Name: faculty_documents faculty_documents_uploaded_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_documents
    ADD CONSTRAINT faculty_documents_uploaded_by_user_id_fkey FOREIGN KEY (uploaded_by_user_id) REFERENCES public.users(id);


--
-- Name: faculty_documents faculty_documents_verified_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_documents
    ADD CONSTRAINT faculty_documents_verified_by_fkey FOREIGN KEY (verified_by_user_id) REFERENCES public.users(id);


--
-- Name: faculty_feedback_forms faculty_feedback_forms_created_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_feedback_forms
    ADD CONSTRAINT faculty_feedback_forms_created_by_user_id_fkey FOREIGN KEY (created_by_user_id) REFERENCES public.users(id);


--
-- Name: faculty_feedback_forms faculty_feedback_forms_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_feedback_forms
    ADD CONSTRAINT faculty_feedback_forms_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id);


--
-- Name: faculty_feedback_questions faculty_feedback_questions_form_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_feedback_questions
    ADD CONSTRAINT faculty_feedback_questions_form_id_fkey FOREIGN KEY (form_id) REFERENCES public.faculty_feedback_forms(id) ON DELETE CASCADE;


--
-- Name: faculty_feedback_responses faculty_feedback_responses_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_feedback_responses
    ADD CONSTRAINT faculty_feedback_responses_faculty_id_fkey FOREIGN KEY (faculty_id) REFERENCES public.faculty(id);


--
-- Name: faculty_feedback_responses faculty_feedback_responses_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_feedback_responses
    ADD CONSTRAINT faculty_feedback_responses_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.faculty_feedback_questions(id) ON DELETE CASCADE;


--
-- Name: faculty_holiday_mapping faculty_holiday_mapping_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_holiday_mapping
    ADD CONSTRAINT faculty_holiday_mapping_faculty_id_fkey FOREIGN KEY (faculty_id) REFERENCES public.faculty(id);


--
-- Name: faculty_holiday_mapping faculty_holiday_mapping_holiday_slot_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_holiday_mapping
    ADD CONSTRAINT faculty_holiday_mapping_holiday_slot_id_fkey FOREIGN KEY (holiday_slot_id) REFERENCES public.holiday_slots(id);


--
-- Name: faculty_hostel_mapping faculty_hostel_mapping_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_hostel_mapping
    ADD CONSTRAINT faculty_hostel_mapping_faculty_id_fkey FOREIGN KEY (faculty_id) REFERENCES public.faculty(id);


--
-- Name: faculty_hostel_mapping faculty_hostel_mapping_fee_structure_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_hostel_mapping
    ADD CONSTRAINT faculty_hostel_mapping_fee_structure_id_fkey FOREIGN KEY (fee_structure_id) REFERENCES public.fee_structures(id);


--
-- Name: faculty_hostel_mapping faculty_hostel_mapping_room_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_hostel_mapping
    ADD CONSTRAINT faculty_hostel_mapping_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.hostel_rooms(id);


--
-- Name: faculty_id_card_issuances faculty_id_card_issuances_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_id_card_issuances
    ADD CONSTRAINT faculty_id_card_issuances_faculty_id_fkey FOREIGN KEY (faculty_id) REFERENCES public.faculty(id);


--
-- Name: faculty_id_card_issuances faculty_id_card_issuances_issued_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_id_card_issuances
    ADD CONSTRAINT faculty_id_card_issuances_issued_by_user_id_fkey FOREIGN KEY (issued_by_user_id) REFERENCES public.users(id);


--
-- Name: faculty_leave_balances faculty_leave_balances_faculty_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_leave_balances
    ADD CONSTRAINT faculty_leave_balances_faculty_fkey FOREIGN KEY (faculty_id) REFERENCES public.faculty(id);


--
-- Name: faculty_leave_balances faculty_leave_balances_leave_type_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_leave_balances
    ADD CONSTRAINT faculty_leave_balances_leave_type_fkey FOREIGN KEY (leave_type_id) REFERENCES public.leave_types(id);


--
-- Name: faculty_leaves faculty_leaves_correspondent_decided_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_leaves
    ADD CONSTRAINT faculty_leaves_correspondent_decided_by_user_id_fkey FOREIGN KEY (correspondent_decided_by_user_id) REFERENCES public.users(id);


--
-- Name: faculty_leaves faculty_leaves_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_leaves
    ADD CONSTRAINT faculty_leaves_faculty_id_fkey FOREIGN KEY (faculty_id) REFERENCES public.faculty(id);


--
-- Name: faculty_leaves faculty_leaves_hod_decider_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_leaves
    ADD CONSTRAINT faculty_leaves_hod_decider_fkey FOREIGN KEY (hod_decided_by_user_id) REFERENCES public.users(id);


--
-- Name: faculty_leaves faculty_leaves_hr_decider_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_leaves
    ADD CONSTRAINT faculty_leaves_hr_decider_fkey FOREIGN KEY (hr_decided_by_user_id) REFERENCES public.users(id);


--
-- Name: faculty_leaves faculty_leaves_leave_type_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_leaves
    ADD CONSTRAINT faculty_leaves_leave_type_fkey FOREIGN KEY (leave_type_id) REFERENCES public.leave_types(id);


--
-- Name: faculty_leaves faculty_leaves_principal_decided_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_leaves
    ADD CONSTRAINT faculty_leaves_principal_decided_by_user_id_fkey FOREIGN KEY (principal_decided_by_user_id) REFERENCES public.users(id);


--
-- Name: faculty_leaves faculty_leaves_staff_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_leaves
    ADD CONSTRAINT faculty_leaves_staff_user_id_fkey FOREIGN KEY (staff_user_id) REFERENCES public.users(id);


--
-- Name: faculty_od_requests faculty_od_requests_correspondent_decider_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_od_requests
    ADD CONSTRAINT faculty_od_requests_correspondent_decider_fkey FOREIGN KEY (correspondent_decided_by_user_id) REFERENCES public.users(id);


--
-- Name: faculty_od_requests faculty_od_requests_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_od_requests
    ADD CONSTRAINT faculty_od_requests_faculty_id_fkey FOREIGN KEY (faculty_id) REFERENCES public.faculty(id);


--
-- Name: faculty_od_requests faculty_od_requests_principal_decided_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_od_requests
    ADD CONSTRAINT faculty_od_requests_principal_decided_by_user_id_fkey FOREIGN KEY (principal_decided_by_user_id) REFERENCES public.users(id);


--
-- Name: faculty_od_requests faculty_od_requests_staff_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_od_requests
    ADD CONSTRAINT faculty_od_requests_staff_user_id_fkey FOREIGN KEY (staff_user_id) REFERENCES public.users(id);


--
-- Name: patent_inventors faculty_patent_inventors_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.patent_inventors
    ADD CONSTRAINT faculty_patent_inventors_faculty_id_fkey FOREIGN KEY (faculty_id) REFERENCES public.faculty(id);


--
-- Name: patent_inventors faculty_patent_inventors_patent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.patent_inventors
    ADD CONSTRAINT faculty_patent_inventors_patent_id_fkey FOREIGN KEY (patent_id) REFERENCES public.patents(id);


--
-- Name: publications faculty_publications_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.publications
    ADD CONSTRAINT faculty_publications_faculty_id_fkey FOREIGN KEY (faculty_id) REFERENCES public.faculty(id);


--
-- Name: faculty faculty_reports_to_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty
    ADD CONSTRAINT faculty_reports_to_faculty_id_fkey FOREIGN KEY (reports_to_faculty_id) REFERENCES public.faculty(id);


--
-- Name: research_project_members faculty_research_project_members_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.research_project_members
    ADD CONSTRAINT faculty_research_project_members_faculty_id_fkey FOREIGN KEY (faculty_id) REFERENCES public.faculty(id);


--
-- Name: research_project_members faculty_research_project_members_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.research_project_members
    ADD CONSTRAINT faculty_research_project_members_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.research_projects(id);


--
-- Name: faculty_sensitive_info faculty_sensitive_info_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_sensitive_info
    ADD CONSTRAINT faculty_sensitive_info_faculty_id_fkey FOREIGN KEY (faculty_id) REFERENCES public.faculty(id) ON DELETE CASCADE;


--
-- Name: faculty_subject_class_mapping faculty_subject_class_mapping_assigned_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_subject_class_mapping
    ADD CONSTRAINT faculty_subject_class_mapping_assigned_by_user_id_fkey FOREIGN KEY (assigned_by_user_id) REFERENCES public.users(id);


--
-- Name: faculty_subject_class_mapping faculty_subject_class_mapping_class_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_subject_class_mapping
    ADD CONSTRAINT faculty_subject_class_mapping_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.classes(id);


--
-- Name: faculty_subject_class_mapping faculty_subject_class_mapping_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_subject_class_mapping
    ADD CONSTRAINT faculty_subject_class_mapping_faculty_id_fkey FOREIGN KEY (faculty_id) REFERENCES public.faculty(id);


--
-- Name: faculty_subject_class_mapping faculty_subject_class_mapping_subject_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_subject_class_mapping
    ADD CONSTRAINT faculty_subject_class_mapping_subject_id_fkey FOREIGN KEY (subject_id) REFERENCES public.subjects(id);


--
-- Name: faculty_subject_class_mapping faculty_subject_class_mapping_substitute_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty_subject_class_mapping
    ADD CONSTRAINT faculty_subject_class_mapping_substitute_faculty_id_fkey FOREIGN KEY (substitute_faculty_id) REFERENCES public.faculty(id);


--
-- Name: faculty faculty_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculty
    ADD CONSTRAINT faculty_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: fee_concessions fee_concessions_fee_structure_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fee_concessions
    ADD CONSTRAINT fee_concessions_fee_structure_id_fkey FOREIGN KEY (fee_structure_id) REFERENCES public.fee_structures(id);


--
-- Name: fee_payment_gateway_orders fee_payment_gateway_orders_created_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fee_payment_gateway_orders
    ADD CONSTRAINT fee_payment_gateway_orders_created_by_user_id_fkey FOREIGN KEY (created_by_user_id) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- Name: fee_payment_gateway_orders fee_payment_gateway_orders_fee_payment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fee_payment_gateway_orders
    ADD CONSTRAINT fee_payment_gateway_orders_fee_payment_id_fkey FOREIGN KEY (fee_payment_id) REFERENCES public.fee_payments(id) ON DELETE SET NULL;


--
-- Name: fee_payment_gateway_orders fee_payment_gateway_orders_student_fee_demand_mapping_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fee_payment_gateway_orders
    ADD CONSTRAINT fee_payment_gateway_orders_student_fee_demand_mapping_id_fkey FOREIGN KEY (student_fee_demand_mapping_id) REFERENCES public.student_fee_demand_mapping(id) ON DELETE RESTRICT;


--
-- Name: fee_payments fee_payments_collected_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fee_payments
    ADD CONSTRAINT fee_payments_collected_by_user_id_fkey FOREIGN KEY (collected_by_user_id) REFERENCES public.users(id);


--
-- Name: fee_payments fee_payments_fee_structure_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fee_payments
    ADD CONSTRAINT fee_payments_fee_structure_item_id_fkey FOREIGN KEY (fee_structure_item_id) REFERENCES public.fee_structure_items(id);


--
-- Name: fee_payments fee_payments_student_fee_demand_mapping_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fee_payments
    ADD CONSTRAINT fee_payments_student_fee_demand_mapping_id_fkey FOREIGN KEY (student_fee_demand_mapping_id) REFERENCES public.student_fee_demand_mapping(id);


--
-- Name: fee_receipt_number_payments fee_receipt_number_payments_fee_payment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fee_receipt_number_payments
    ADD CONSTRAINT fee_receipt_number_payments_fee_payment_id_fkey FOREIGN KEY (fee_payment_id) REFERENCES public.fee_payments(id) ON DELETE CASCADE;


--
-- Name: fee_receipt_number_payments fee_receipt_number_payments_receipt_number_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fee_receipt_number_payments
    ADD CONSTRAINT fee_receipt_number_payments_receipt_number_id_fkey FOREIGN KEY (receipt_number_id) REFERENCES public.fee_receipt_numbers(id) ON DELETE CASCADE;


--
-- Name: fee_receipt_numbers fee_receipt_numbers_issued_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fee_receipt_numbers
    ADD CONSTRAINT fee_receipt_numbers_issued_by_user_id_fkey FOREIGN KEY (issued_by_user_id) REFERENCES public.users(id);


--
-- Name: fee_structure_items fee_structure_items_demand_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fee_structure_items
    ADD CONSTRAINT fee_structure_items_demand_category_id_fkey FOREIGN KEY (demand_category_id) REFERENCES public.demand_categories(id);


--
-- Name: fee_structure_items fee_structure_items_fee_structure_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fee_structure_items
    ADD CONSTRAINT fee_structure_items_fee_structure_id_fkey FOREIGN KEY (fee_structure_id) REFERENCES public.fee_structures(id) ON DELETE CASCADE;


--
-- Name: fee_structure_items fee_structure_items_hostel_room_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fee_structure_items
    ADD CONSTRAINT fee_structure_items_hostel_room_type_id_fkey FOREIGN KEY (hostel_room_type_id) REFERENCES public.hostel_room_types(id) ON DELETE RESTRICT;


--
-- Name: fee_structure_items fee_structure_items_transport_stage_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fee_structure_items
    ADD CONSTRAINT fee_structure_items_transport_stage_id_fkey FOREIGN KEY (transport_stage_id) REFERENCES public.transport_stages(id) ON DELETE RESTRICT;


--
-- Name: fee_structures fee_structures_quota_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fee_structures
    ADD CONSTRAINT fee_structures_quota_id_fkey FOREIGN KEY (quota_id) REFERENCES public.quotas(id);


--
-- Name: feedback_assignment_questions feedback_assignment_questions_assignment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feedback_assignment_questions
    ADD CONSTRAINT feedback_assignment_questions_assignment_id_fkey FOREIGN KEY (assignment_id) REFERENCES public.feedback_assignments(id) ON DELETE CASCADE;


--
-- Name: feedback_assignments feedback_assignments_class_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feedback_assignments
    ADD CONSTRAINT feedback_assignments_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.classes(id);


--
-- Name: feedback_assignments feedback_assignments_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feedback_assignments
    ADD CONSTRAINT feedback_assignments_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id);


--
-- Name: feedback_faculty_responses feedback_faculty_responses_mapping_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feedback_faculty_responses
    ADD CONSTRAINT feedback_faculty_responses_mapping_id_fkey FOREIGN KEY (mapping_id) REFERENCES public.faculty_subject_class_mapping(id);


--
-- Name: feedback_faculty_responses feedback_faculty_responses_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feedback_faculty_responses
    ADD CONSTRAINT feedback_faculty_responses_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.feedback_questions(id);


--
-- Name: feedback_faculty_responses feedback_faculty_responses_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feedback_faculty_responses
    ADD CONSTRAINT feedback_faculty_responses_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: feedback_forms feedback_forms_batch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feedback_forms
    ADD CONSTRAINT feedback_forms_batch_id_fkey FOREIGN KEY (batch_id) REFERENCES public.batches(id);


--
-- Name: feedback_forms feedback_forms_class_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feedback_forms
    ADD CONSTRAINT feedback_forms_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.classes(id);


--
-- Name: feedback_forms feedback_forms_created_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feedback_forms
    ADD CONSTRAINT feedback_forms_created_by_user_id_fkey FOREIGN KEY (created_by_user_id) REFERENCES public.users(id);


--
-- Name: feedback_forms feedback_forms_rating_scale_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feedback_forms
    ADD CONSTRAINT feedback_forms_rating_scale_id_fkey FOREIGN KEY (rating_scale_id) REFERENCES public.feedback_rating_scales(id);


--
-- Name: feedback_questions feedback_questions_form_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feedback_questions
    ADD CONSTRAINT feedback_questions_form_id_fkey FOREIGN KEY (form_id) REFERENCES public.feedback_forms(id) ON DELETE CASCADE;


--
-- Name: feedback_rating_scale_options feedback_rating_scale_options_scale_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feedback_rating_scale_options
    ADD CONSTRAINT feedback_rating_scale_options_scale_id_fkey FOREIGN KEY (scale_id) REFERENCES public.feedback_rating_scales(id) ON DELETE CASCADE;


--
-- Name: feedback_responses feedback_responses_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feedback_responses
    ADD CONSTRAINT feedback_responses_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.feedback_questions(id);


--
-- Name: feedback_responses feedback_responses_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feedback_responses
    ADD CONSTRAINT feedback_responses_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: finance_audit_log finance_audit_log_actor_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_audit_log
    ADD CONSTRAINT finance_audit_log_actor_user_id_fkey FOREIGN KEY (actor_user_id) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- Name: finance_funds finance_funds_created_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_funds
    ADD CONSTRAINT finance_funds_created_by_user_id_fkey FOREIGN KEY (created_by_user_id) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- Name: finance_funds finance_funds_updated_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_funds
    ADD CONSTRAINT finance_funds_updated_by_user_id_fkey FOREIGN KEY (updated_by_user_id) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- Name: finance_ledger_entries finance_ledger_entries_created_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_ledger_entries
    ADD CONSTRAINT finance_ledger_entries_created_by_user_id_fkey FOREIGN KEY (created_by_user_id) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- Name: finance_ledger_entries finance_ledger_entries_fund_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_ledger_entries
    ADD CONSTRAINT finance_ledger_entries_fund_id_fkey FOREIGN KEY (fund_id) REFERENCES public.finance_funds(id) ON DELETE RESTRICT;


--
-- Name: finance_ledger_entries finance_ledger_entries_pop_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_ledger_entries
    ADD CONSTRAINT finance_ledger_entries_pop_fkey FOREIGN KEY (purchase_order_proposal_id) REFERENCES public.purchase_order_proposals(id) ON DELETE RESTRICT;


--
-- Name: finance_ledger_entries finance_ledger_entries_sop_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_ledger_entries
    ADD CONSTRAINT finance_ledger_entries_sop_fkey FOREIGN KEY (service_order_proposal_id) REFERENCES public.service_order_proposals(id) ON DELETE RESTRICT;


--
-- Name: finance_order_allotments finance_order_allotments_allotted_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_order_allotments
    ADD CONSTRAINT finance_order_allotments_allotted_by_user_id_fkey FOREIGN KEY (allotted_by_user_id) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- Name: finance_order_allotments finance_order_allotments_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_order_allotments
    ADD CONSTRAINT finance_order_allotments_faculty_id_fkey FOREIGN KEY (faculty_id) REFERENCES public.faculty(id) ON DELETE RESTRICT;


--
-- Name: finance_order_allotments finance_order_allotments_tracking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_order_allotments
    ADD CONSTRAINT finance_order_allotments_tracking_id_fkey FOREIGN KEY (tracking_id) REFERENCES public.finance_order_tracking(id) ON DELETE RESTRICT;


--
-- Name: finance_order_tracking finance_order_tracking_created_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_order_tracking
    ADD CONSTRAINT finance_order_tracking_created_by_user_id_fkey FOREIGN KEY (created_by_user_id) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- Name: finance_order_tracking_events finance_order_tracking_events_changed_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_order_tracking_events
    ADD CONSTRAINT finance_order_tracking_events_changed_by_user_id_fkey FOREIGN KEY (changed_by_user_id) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- Name: finance_order_tracking_events finance_order_tracking_events_tracking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_order_tracking_events
    ADD CONSTRAINT finance_order_tracking_events_tracking_id_fkey FOREIGN KEY (tracking_id) REFERENCES public.finance_order_tracking(id) ON DELETE RESTRICT;


--
-- Name: finance_order_tracking finance_order_tracking_purchase_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_order_tracking
    ADD CONSTRAINT finance_order_tracking_purchase_order_id_fkey FOREIGN KEY (purchase_order_id) REFERENCES public.purchase_orders(id) ON DELETE RESTRICT;


--
-- Name: finance_order_tracking finance_order_tracking_service_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_order_tracking
    ADD CONSTRAINT finance_order_tracking_service_order_id_fkey FOREIGN KEY (service_order_id) REFERENCES public.service_orders(id) ON DELETE RESTRICT;


--
-- Name: finance_order_tracking finance_order_tracking_updated_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_order_tracking
    ADD CONSTRAINT finance_order_tracking_updated_by_user_id_fkey FOREIGN KEY (updated_by_user_id) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- Name: finance_proposal_assignments finance_proposal_assignments_assigned_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_proposal_assignments
    ADD CONSTRAINT finance_proposal_assignments_assigned_by_fkey FOREIGN KEY (assigned_by_user_id) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- Name: finance_proposal_assignments finance_proposal_assignments_faculty_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_proposal_assignments
    ADD CONSTRAINT finance_proposal_assignments_faculty_fkey FOREIGN KEY (faculty_id) REFERENCES public.faculty(id) ON DELETE RESTRICT;


--
-- Name: finance_proposal_assignments finance_proposal_assignments_pop_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_proposal_assignments
    ADD CONSTRAINT finance_proposal_assignments_pop_fkey FOREIGN KEY (purchase_order_proposal_id) REFERENCES public.purchase_order_proposals(id) ON DELETE RESTRICT;


--
-- Name: finance_proposal_assignments finance_proposal_assignments_sop_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_proposal_assignments
    ADD CONSTRAINT finance_proposal_assignments_sop_fkey FOREIGN KEY (service_order_proposal_id) REFERENCES public.service_order_proposals(id) ON DELETE RESTRICT;


--
-- Name: announcement_class_mapping fk_announcement; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.announcement_class_mapping
    ADD CONSTRAINT fk_announcement FOREIGN KEY (announcement_id) REFERENCES public.announcements(id) ON DELETE CASCADE;


--
-- Name: announcement_role_mapping fk_announcement_role; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.announcement_role_mapping
    ADD CONSTRAINT fk_announcement_role FOREIGN KEY (announcement_id) REFERENCES public.announcements(id) ON DELETE CASCADE;


--
-- Name: attendance_records fk_attendance_marked_by_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attendance_records
    ADD CONSTRAINT fk_attendance_marked_by_user FOREIGN KEY (marked_by_user_id) REFERENCES public.users(id);


--
-- Name: attendance_records fk_attendance_student; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attendance_records
    ADD CONSTRAINT fk_attendance_student FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: announcement_class_mapping fk_class; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.announcement_class_mapping
    ADD CONSTRAINT fk_class FOREIGN KEY (class_id) REFERENCES public.classes(id);


--
-- Name: media_requests fk_media_requests_requested_by_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media_requests
    ADD CONSTRAINT fk_media_requests_requested_by_user FOREIGN KEY (requested_by_user_id) REFERENCES public.users(id);


--
-- Name: project_team_members fk_member_student; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_team_members
    ADD CONSTRAINT fk_member_student FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: project_team_members fk_member_team; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_team_members
    ADD CONSTRAINT fk_member_team FOREIGN KEY (team_id) REFERENCES public.project_teams(id) ON DELETE CASCADE;


--
-- Name: project_recruitment_posts fk_recruitment_team; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_recruitment_posts
    ADD CONSTRAINT fk_recruitment_team FOREIGN KEY (team_id) REFERENCES public.project_teams(id) ON DELETE CASCADE;


--
-- Name: project_join_requests fk_request_student; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_join_requests
    ADD CONSTRAINT fk_request_student FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: project_join_requests fk_request_team; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_join_requests
    ADD CONSTRAINT fk_request_team FOREIGN KEY (team_id) REFERENCES public.project_teams(id) ON DELETE CASCADE;


--
-- Name: project_join_requests fk_reviewed_by; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_join_requests
    ADD CONSTRAINT fk_reviewed_by FOREIGN KEY (reviewed_by) REFERENCES public.students(id);


--
-- Name: announcement_role_mapping fk_role; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.announcement_role_mapping
    ADD CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES public.roles(id);


--
-- Name: project_teams fk_team_batch; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_teams
    ADD CONSTRAINT fk_team_batch FOREIGN KEY (batch_id) REFERENCES public.batches(id);


--
-- Name: project_teams fk_team_class; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_teams
    ADD CONSTRAINT fk_team_class FOREIGN KEY (class_id) REFERENCES public.classes(id);


--
-- Name: project_teams fk_team_department; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_teams
    ADD CONSTRAINT fk_team_department FOREIGN KEY (department_id) REFERENCES public.departments(id);


--
-- Name: project_teams fk_team_leader; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_teams
    ADD CONSTRAINT fk_team_leader FOREIGN KEY (leader_student_id) REFERENCES public.students(id);


--
-- Name: grn grn_issued_to_venue_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grn
    ADD CONSTRAINT grn_issued_to_venue_id_fkey FOREIGN KEY (issued_to_venue_id) REFERENCES public.venues(id);


--
-- Name: grn grn_purchase_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grn
    ADD CONSTRAINT grn_purchase_order_id_fkey FOREIGN KEY (purchase_order_id) REFERENCES public.purchase_orders(id);


--
-- Name: grn grn_recorded_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grn
    ADD CONSTRAINT grn_recorded_by_user_id_fkey FOREIGN KEY (recorded_by_user_id) REFERENCES public.users(id);


--
-- Name: hall_plans hall_plans_exam_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hall_plans
    ADD CONSTRAINT hall_plans_exam_id_fkey FOREIGN KEY (exam_id) REFERENCES public.exams(id);


--
-- Name: hall_plans hall_plans_venue_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hall_plans
    ADD CONSTRAINT hall_plans_venue_id_fkey FOREIGN KEY (venue_id) REFERENCES public.venues(id);


--
-- Name: hall_ticket_clearance_exceptions hall_ticket_clearance_exceptions_exam_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hall_ticket_clearance_exceptions
    ADD CONSTRAINT hall_ticket_clearance_exceptions_exam_id_fkey FOREIGN KEY (exam_id) REFERENCES public.exams(id);


--
-- Name: hall_ticket_clearance_exceptions hall_ticket_clearance_exceptions_reviewed_by_hod_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hall_ticket_clearance_exceptions
    ADD CONSTRAINT hall_ticket_clearance_exceptions_reviewed_by_hod_user_id_fkey FOREIGN KEY (reviewed_by_hod_user_id) REFERENCES public.users(id);


--
-- Name: hall_ticket_clearance_exceptions hall_ticket_clearance_exceptions_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hall_ticket_clearance_exceptions
    ADD CONSTRAINT hall_ticket_clearance_exceptions_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: hall_tickets hall_tickets_exam_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hall_tickets
    ADD CONSTRAINT hall_tickets_exam_id_fkey FOREIGN KEY (exam_id) REFERENCES public.exams(id);


--
-- Name: hall_tickets hall_tickets_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hall_tickets
    ADD CONSTRAINT hall_tickets_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: higher_education_application_students higher_education_application_students_created_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.higher_education_application_students
    ADD CONSTRAINT higher_education_application_students_created_by_user_id_fkey FOREIGN KEY (created_by_user_id) REFERENCES public.users(id);


--
-- Name: higher_education_application_students higher_education_application_students_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.higher_education_application_students
    ADD CONSTRAINT higher_education_application_students_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE;


--
-- Name: higher_education_application_students higher_education_application_students_window_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.higher_education_application_students
    ADD CONSTRAINT higher_education_application_students_window_id_fkey FOREIGN KEY (window_id) REFERENCES public.higher_education_application_windows(id) ON DELETE CASCADE;


--
-- Name: higher_education_test_students higher_education_test_students_created_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.higher_education_test_students
    ADD CONSTRAINT higher_education_test_students_created_by_user_id_fkey FOREIGN KEY (created_by_user_id) REFERENCES public.users(id);


--
-- Name: higher_education_test_students higher_education_test_students_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.higher_education_test_students
    ADD CONSTRAINT higher_education_test_students_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE;


--
-- Name: higher_education_test_students higher_education_test_students_test_name_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.higher_education_test_students
    ADD CONSTRAINT higher_education_test_students_test_name_fkey FOREIGN KEY (test_name) REFERENCES public.higher_education_test_register(test_name) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: hostel_blocks hostel_blocks_hostel_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hostel_blocks
    ADD CONSTRAINT hostel_blocks_hostel_id_fkey FOREIGN KEY (hostel_id) REFERENCES public.hostels(id);


--
-- Name: hostel_complaints hostel_complaints_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hostel_complaints
    ADD CONSTRAINT hostel_complaints_faculty_id_fkey FOREIGN KEY (faculty_id) REFERENCES public.faculty(id);


--
-- Name: hostel_complaints hostel_complaints_hostel_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hostel_complaints
    ADD CONSTRAINT hostel_complaints_hostel_id_fkey FOREIGN KEY (hostel_id) REFERENCES public.hostels(id);


--
-- Name: hostel_complaints hostel_complaints_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hostel_complaints
    ADD CONSTRAINT hostel_complaints_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: hostel_floors hostel_floors_block_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hostel_floors
    ADD CONSTRAINT hostel_floors_block_id_fkey FOREIGN KEY (block_id) REFERENCES public.hostel_blocks(id);


--
-- Name: hostel_goods hostel_goods_block_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hostel_goods
    ADD CONSTRAINT hostel_goods_block_id_fkey FOREIGN KEY (block_id) REFERENCES public.hostel_blocks(id);


--
-- Name: hostel_goods hostel_goods_warden_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hostel_goods
    ADD CONSTRAINT hostel_goods_warden_id_fkey FOREIGN KEY (warden_id) REFERENCES public.hostel_wardens(id);


--
-- Name: hostel_in_out_ledger hostel_in_out_ledger_outing_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hostel_in_out_ledger
    ADD CONSTRAINT hostel_in_out_ledger_outing_id_fkey FOREIGN KEY (outing_id) REFERENCES public.hostel_outings(id);


--
-- Name: hostel_in_out_ledger hostel_in_out_ledger_recorded_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hostel_in_out_ledger
    ADD CONSTRAINT hostel_in_out_ledger_recorded_by_user_id_fkey FOREIGN KEY (recorded_by_user_id) REFERENCES public.users(id);


--
-- Name: hostel_in_out_ledger hostel_in_out_ledger_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hostel_in_out_ledger
    ADD CONSTRAINT hostel_in_out_ledger_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: hostel_mess_feedback hostel_mess_feedback_hostel_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hostel_mess_feedback
    ADD CONSTRAINT hostel_mess_feedback_hostel_id_fkey FOREIGN KEY (hostel_id) REFERENCES public.hostels(id);


--
-- Name: hostel_mess_feedback hostel_mess_feedback_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hostel_mess_feedback
    ADD CONSTRAINT hostel_mess_feedback_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: hostel_night_attendance hostel_night_attendance_marked_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hostel_night_attendance
    ADD CONSTRAINT hostel_night_attendance_marked_by_user_id_fkey FOREIGN KEY (marked_by_user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: hostel_night_attendance hostel_night_attendance_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hostel_night_attendance
    ADD CONSTRAINT hostel_night_attendance_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE;


--
-- Name: hostel_outings hostel_outings_approved_by_warden_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hostel_outings
    ADD CONSTRAINT hostel_outings_approved_by_warden_user_id_fkey FOREIGN KEY (approved_by_warden_user_id) REFERENCES public.users(id);


--
-- Name: hostel_outings hostel_outings_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hostel_outings
    ADD CONSTRAINT hostel_outings_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: hostel_quit_requests hostel_quit_requests_resolved_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hostel_quit_requests
    ADD CONSTRAINT hostel_quit_requests_resolved_by_user_id_fkey FOREIGN KEY (resolved_by_user_id) REFERENCES public.users(id);


--
-- Name: hostel_quit_requests hostel_quit_requests_room_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hostel_quit_requests
    ADD CONSTRAINT hostel_quit_requests_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.hostel_rooms(id);


--
-- Name: hostel_quit_requests hostel_quit_requests_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hostel_quit_requests
    ADD CONSTRAINT hostel_quit_requests_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: hostel_rooms hostel_rooms_block_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hostel_rooms
    ADD CONSTRAINT hostel_rooms_block_id_fkey FOREIGN KEY (block_id) REFERENCES public.hostel_blocks(id);


--
-- Name: hostel_rooms hostel_rooms_floor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hostel_rooms
    ADD CONSTRAINT hostel_rooms_floor_id_fkey FOREIGN KEY (floor_id) REFERENCES public.hostel_floors(id);


--
-- Name: hostel_rooms hostel_rooms_hostel_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hostel_rooms
    ADD CONSTRAINT hostel_rooms_hostel_id_fkey FOREIGN KEY (hostel_id) REFERENCES public.hostels(id);


--
-- Name: hostel_rooms hostel_rooms_room_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hostel_rooms
    ADD CONSTRAINT hostel_rooms_room_type_id_fkey FOREIGN KEY (room_type_id) REFERENCES public.hostel_room_types(id);


--
-- Name: hostel_wardens hostel_wardens_block_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hostel_wardens
    ADD CONSTRAINT hostel_wardens_block_id_fkey FOREIGN KEY (block_id) REFERENCES public.hostel_blocks(id);


--
-- Name: hostel_wardens hostel_wardens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hostel_wardens
    ADD CONSTRAINT hostel_wardens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: hostels hostels_warden_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hostels
    ADD CONSTRAINT hostels_warden_user_id_fkey FOREIGN KEY (warden_user_id) REFERENCES public.users(id);


--
-- Name: hr_payroll_requests hr_payroll_requests_assigned_hr_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hr_payroll_requests
    ADD CONSTRAINT hr_payroll_requests_assigned_hr_user_id_fkey FOREIGN KEY (assigned_hr_user_id) REFERENCES public.users(id);


--
-- Name: hr_payroll_requests hr_payroll_requests_requested_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hr_payroll_requests
    ADD CONSTRAINT hr_payroll_requests_requested_by_user_id_fkey FOREIGN KEY (requested_by_user_id) REFERENCES public.users(id);


--
-- Name: hr_queries hr_queries_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hr_queries
    ADD CONSTRAINT hr_queries_faculty_id_fkey FOREIGN KEY (faculty_id) REFERENCES public.faculty(id);


--
-- Name: incubation_milestones incubation_milestones_incubation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.incubation_milestones
    ADD CONSTRAINT incubation_milestones_incubation_id_fkey FOREIGN KEY (incubation_id) REFERENCES public.incubations(id) ON DELETE CASCADE;


--
-- Name: incubations incubations_created_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.incubations
    ADD CONSTRAINT incubations_created_by_user_id_fkey FOREIGN KEY (created_by_user_id) REFERENCES public.users(id);


--
-- Name: incubations incubations_mentor_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.incubations
    ADD CONSTRAINT incubations_mentor_faculty_id_fkey FOREIGN KEY (mentor_faculty_id) REFERENCES public.faculty(id);


--
-- Name: incubations incubations_student_entrepreneurship_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.incubations
    ADD CONSTRAINT incubations_student_entrepreneurship_id_fkey FOREIGN KEY (student_entrepreneurship_id) REFERENCES public.student_entrepreneurship(id);


--
-- Name: invigilation_allocation_batches invigilation_allocation_batches_exam_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invigilation_allocation_batches
    ADD CONSTRAINT invigilation_allocation_batches_exam_id_fkey FOREIGN KEY (exam_id) REFERENCES public.exams(id) ON DELETE CASCADE;


--
-- Name: invigilation_duties invigilation_duties_allocation_batch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invigilation_duties
    ADD CONSTRAINT invigilation_duties_allocation_batch_id_fkey FOREIGN KEY (allocation_batch_id) REFERENCES public.invigilation_allocation_batches(id);


--
-- Name: invigilation_duties invigilation_duties_exam_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invigilation_duties
    ADD CONSTRAINT invigilation_duties_exam_id_fkey FOREIGN KEY (exam_id) REFERENCES public.exams(id);


--
-- Name: invigilation_duties invigilation_duties_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invigilation_duties
    ADD CONSTRAINT invigilation_duties_faculty_id_fkey FOREIGN KEY (faculty_id) REFERENCES public.faculty(id);


--
-- Name: invigilation_duties invigilation_duties_hall_plan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invigilation_duties
    ADD CONSTRAINT invigilation_duties_hall_plan_id_fkey FOREIGN KEY (hall_plan_id) REFERENCES public.hall_plans(id);


--
-- Name: iqac_accreditation_criteria iqac_accreditation_criteria_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.iqac_accreditation_criteria
    ADD CONSTRAINT iqac_accreditation_criteria_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id);


--
-- Name: iqac_accreditation_criteria iqac_accreditation_criteria_owner_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.iqac_accreditation_criteria
    ADD CONSTRAINT iqac_accreditation_criteria_owner_faculty_id_fkey FOREIGN KEY (owner_faculty_id) REFERENCES public.faculty(id);


--
-- Name: iqac_accreditation_evidence_items iqac_accreditation_evidence_items_criterion_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.iqac_accreditation_evidence_items
    ADD CONSTRAINT iqac_accreditation_evidence_items_criterion_id_fkey FOREIGN KEY (criterion_id) REFERENCES public.iqac_accreditation_criteria(id);


--
-- Name: iqac_accreditation_evidence_items iqac_accreditation_evidence_items_updated_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.iqac_accreditation_evidence_items
    ADD CONSTRAINT iqac_accreditation_evidence_items_updated_by_user_id_fkey FOREIGN KEY (updated_by_user_id) REFERENCES public.users(id);


--
-- Name: iqac_metric_targets iqac_metric_targets_set_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.iqac_metric_targets
    ADD CONSTRAINT iqac_metric_targets_set_by_user_id_fkey FOREIGN KEY (set_by_user_id) REFERENCES public.users(id);


--
-- Name: leave_parent_acknowledgements leave_parent_acknowledgements_leave_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leave_parent_acknowledgements
    ADD CONSTRAINT leave_parent_acknowledgements_leave_id_fkey FOREIGN KEY (leave_id) REFERENCES public.student_leaves(id) ON DELETE CASCADE;


--
-- Name: leave_parent_acknowledgements leave_parent_acknowledgements_parent_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leave_parent_acknowledgements
    ADD CONSTRAINT leave_parent_acknowledgements_parent_user_id_fkey FOREIGN KEY (parent_user_id) REFERENCES public.users(id);


--
-- Name: lesson_plan_sessions lesson_plan_sessions_lesson_plan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lesson_plan_sessions
    ADD CONSTRAINT lesson_plan_sessions_lesson_plan_id_fkey FOREIGN KEY (lesson_plan_id) REFERENCES public.lesson_plans(id) ON DELETE CASCADE;


--
-- Name: lesson_plans lesson_plans_class_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lesson_plans
    ADD CONSTRAINT lesson_plans_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.classes(id);


--
-- Name: lesson_plans lesson_plans_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lesson_plans
    ADD CONSTRAINT lesson_plans_faculty_id_fkey FOREIGN KEY (faculty_id) REFERENCES public.faculty(id);


--
-- Name: lesson_plans lesson_plans_subject_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lesson_plans
    ADD CONSTRAINT lesson_plans_subject_id_fkey FOREIGN KEY (subject_id) REFERENCES public.subjects(id);


--
-- Name: lms_folder_classes lms_folder_classes_class_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lms_folder_classes
    ADD CONSTRAINT lms_folder_classes_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.classes(id);


--
-- Name: lms_folder_classes lms_folder_classes_folder_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lms_folder_classes
    ADD CONSTRAINT lms_folder_classes_folder_id_fkey FOREIGN KEY (folder_id) REFERENCES public.lms_folders(id) ON DELETE CASCADE;


--
-- Name: lms_folders lms_folders_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lms_folders
    ADD CONSTRAINT lms_folders_faculty_id_fkey FOREIGN KEY (faculty_id) REFERENCES public.faculty(id);


--
-- Name: lms_folders lms_folders_subject_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lms_folders
    ADD CONSTRAINT lms_folders_subject_id_fkey FOREIGN KEY (subject_id) REFERENCES public.subjects(id);


--
-- Name: lms_notes lms_notes_class_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lms_notes
    ADD CONSTRAINT lms_notes_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.classes(id);


--
-- Name: lms_notes lms_notes_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lms_notes
    ADD CONSTRAINT lms_notes_faculty_id_fkey FOREIGN KEY (faculty_id) REFERENCES public.faculty(id);


--
-- Name: lms_notes lms_notes_subject_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lms_notes
    ADD CONSTRAINT lms_notes_subject_id_fkey FOREIGN KEY (subject_id) REFERENCES public.subjects(id);


--
-- Name: lms_resources lms_resources_folder_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lms_resources
    ADD CONSTRAINT lms_resources_folder_id_fkey FOREIGN KEY (folder_id) REFERENCES public.lms_folders(id) ON DELETE CASCADE;


--
-- Name: lms_resources lms_resources_uploaded_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lms_resources
    ADD CONSTRAINT lms_resources_uploaded_by_user_id_fkey FOREIGN KEY (uploaded_by_user_id) REFERENCES public.users(id);


--
-- Name: main_gate_in_out_ledger main_gate_in_out_ledger_recorded_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.main_gate_in_out_ledger
    ADD CONSTRAINT main_gate_in_out_ledger_recorded_by_user_id_fkey FOREIGN KEY (recorded_by_user_id) REFERENCES public.users(id);


--
-- Name: main_gate_in_out_ledger main_gate_in_out_ledger_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.main_gate_in_out_ledger
    ADD CONSTRAINT main_gate_in_out_ledger_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: malpractice_incidents malpractice_incidents_exam_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.malpractice_incidents
    ADD CONSTRAINT malpractice_incidents_exam_id_fkey FOREIGN KEY (exam_id) REFERENCES public.exams(id);


--
-- Name: malpractice_incidents malpractice_incidents_exam_subject_mapping_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.malpractice_incidents
    ADD CONSTRAINT malpractice_incidents_exam_subject_mapping_id_fkey FOREIGN KEY (exam_subject_mapping_id) REFERENCES public.exam_subject_mapping(id);


--
-- Name: malpractice_incidents malpractice_incidents_recorded_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.malpractice_incidents
    ADD CONSTRAINT malpractice_incidents_recorded_by_user_id_fkey FOREIGN KEY (recorded_by_user_id) REFERENCES public.users(id);


--
-- Name: malpractice_incidents malpractice_incidents_reported_by_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.malpractice_incidents
    ADD CONSTRAINT malpractice_incidents_reported_by_faculty_id_fkey FOREIGN KEY (reported_by_faculty_id) REFERENCES public.faculty(id);


--
-- Name: malpractice_incidents malpractice_incidents_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.malpractice_incidents
    ADD CONSTRAINT malpractice_incidents_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: malpractice_incidents malpractice_incidents_venue_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.malpractice_incidents
    ADD CONSTRAINT malpractice_incidents_venue_id_fkey FOREIGN KEY (venue_id) REFERENCES public.venues(id);


--
-- Name: marks_entry_locks marks_entry_locks_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.marks_entry_locks
    ADD CONSTRAINT marks_entry_locks_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id);


--
-- Name: marks_entry_locks marks_entry_locks_exam_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.marks_entry_locks
    ADD CONSTRAINT marks_entry_locks_exam_id_fkey FOREIGN KEY (exam_id) REFERENCES public.exams(id) ON DELETE CASCADE;


--
-- Name: marksheets marksheets_exam_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.marksheets
    ADD CONSTRAINT marksheets_exam_id_fkey FOREIGN KEY (exam_id) REFERENCES public.exams(id);


--
-- Name: marksheets marksheets_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.marksheets
    ADD CONSTRAINT marksheets_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: media_equipment media_equipment_created_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media_equipment
    ADD CONSTRAINT media_equipment_created_by_user_id_fkey FOREIGN KEY (created_by_user_id) REFERENCES public.users(id);


--
-- Name: media_equipment_movements media_equipment_movements_created_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media_equipment_movements
    ADD CONSTRAINT media_equipment_movements_created_by_user_id_fkey FOREIGN KEY (created_by_user_id) REFERENCES public.users(id);


--
-- Name: media_equipment_movements media_equipment_movements_equipment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media_equipment_movements
    ADD CONSTRAINT media_equipment_movements_equipment_id_fkey FOREIGN KEY (equipment_id) REFERENCES public.media_equipment(id) ON DELETE CASCADE;


--
-- Name: media_indents media_indents_requested_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media_indents
    ADD CONSTRAINT media_indents_requested_by_user_id_fkey FOREIGN KEY (requested_by_user_id) REFERENCES public.users(id);


--
-- Name: media_reports media_reports_created_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media_reports
    ADD CONSTRAINT media_reports_created_by_user_id_fkey FOREIGN KEY (created_by_user_id) REFERENCES public.users(id);


--
-- Name: media_request_status_log media_request_status_log_media_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media_request_status_log
    ADD CONSTRAINT media_request_status_log_media_request_id_fkey FOREIGN KEY (media_request_id) REFERENCES public.media_requests(id) ON DELETE CASCADE;


--
-- Name: media_requests media_requests_requested_by_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media_requests
    ADD CONSTRAINT media_requests_requested_by_faculty_id_fkey FOREIGN KEY (requested_by_faculty_id) REFERENCES public.faculty(id);


--
-- Name: media_requests media_requests_venue_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media_requests
    ADD CONSTRAINT media_requests_venue_id_fkey FOREIGN KEY (venue_id) REFERENCES public.venues(id);


--
-- Name: media_scorecard_targets media_scorecard_targets_updated_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media_scorecard_targets
    ADD CONSTRAINT media_scorecard_targets_updated_by_user_id_fkey FOREIGN KEY (updated_by_user_id) REFERENCES public.users(id);


--
-- Name: media_shoot_assignments media_shoot_assignments_assigned_to_member_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media_shoot_assignments
    ADD CONSTRAINT media_shoot_assignments_assigned_to_member_id_fkey FOREIGN KEY (assigned_to_member_id) REFERENCES public.media_team_members(id) ON DELETE SET NULL;


--
-- Name: media_shoot_assignments media_shoot_assignments_created_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media_shoot_assignments
    ADD CONSTRAINT media_shoot_assignments_created_by_user_id_fkey FOREIGN KEY (created_by_user_id) REFERENCES public.users(id);


--
-- Name: media_shoot_assignments media_shoot_assignments_media_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media_shoot_assignments
    ADD CONSTRAINT media_shoot_assignments_media_request_id_fkey FOREIGN KEY (media_request_id) REFERENCES public.media_requests(id) ON DELETE CASCADE;


--
-- Name: media_team_members media_team_members_created_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media_team_members
    ADD CONSTRAINT media_team_members_created_by_user_id_fkey FOREIGN KEY (created_by_user_id) REFERENCES public.users(id);


--
-- Name: medical_appointment_windows medical_appointment_windows_created_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medical_appointment_windows
    ADD CONSTRAINT medical_appointment_windows_created_by_user_id_fkey FOREIGN KEY (created_by_user_id) REFERENCES public.users(id);


--
-- Name: medical_appointments medical_appointments_booked_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medical_appointments
    ADD CONSTRAINT medical_appointments_booked_by_user_id_fkey FOREIGN KEY (booked_by_user_id) REFERENCES public.users(id);


--
-- Name: medical_appointments medical_appointments_decided_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medical_appointments
    ADD CONSTRAINT medical_appointments_decided_by_user_id_fkey FOREIGN KEY (decided_by_user_id) REFERENCES public.users(id);


--
-- Name: medical_appointments medical_appointments_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medical_appointments
    ADD CONSTRAINT medical_appointments_faculty_id_fkey FOREIGN KEY (faculty_id) REFERENCES public.faculty(id);


--
-- Name: medical_appointments medical_appointments_staff_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medical_appointments
    ADD CONSTRAINT medical_appointments_staff_id_fkey FOREIGN KEY (staff_id) REFERENCES public.non_teaching_staff(id);


--
-- Name: medical_appointments medical_appointments_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medical_appointments
    ADD CONSTRAINT medical_appointments_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: medical_appointments medical_appointments_visit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medical_appointments
    ADD CONSTRAINT medical_appointments_visit_id_fkey FOREIGN KEY (visit_id) REFERENCES public.medical_visits(id);


--
-- Name: medical_appointments medical_appointments_window_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medical_appointments
    ADD CONSTRAINT medical_appointments_window_id_fkey FOREIGN KEY (window_id) REFERENCES public.medical_appointment_windows(id) ON DELETE RESTRICT;


--
-- Name: medical_bill_items medical_bill_items_bill_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medical_bill_items
    ADD CONSTRAINT medical_bill_items_bill_id_fkey FOREIGN KEY (bill_id) REFERENCES public.medical_bills(id) ON DELETE CASCADE;


--
-- Name: medical_bills medical_bills_attended_by_staff_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medical_bills
    ADD CONSTRAINT medical_bills_attended_by_staff_id_fkey FOREIGN KEY (attended_by_staff_id) REFERENCES public.medical_staff(id) ON DELETE SET NULL;


--
-- Name: medical_bills medical_bills_visit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medical_bills
    ADD CONSTRAINT medical_bills_visit_id_fkey FOREIGN KEY (visit_id) REFERENCES public.medical_visits(id);


--
-- Name: medical_camp_registrations medical_camp_registrations_camp_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medical_camp_registrations
    ADD CONSTRAINT medical_camp_registrations_camp_id_fkey FOREIGN KEY (camp_id) REFERENCES public.medical_camps(id) ON DELETE CASCADE;


--
-- Name: medical_camp_registrations medical_camp_registrations_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medical_camp_registrations
    ADD CONSTRAINT medical_camp_registrations_faculty_id_fkey FOREIGN KEY (faculty_id) REFERENCES public.faculty(id) ON DELETE CASCADE;


--
-- Name: medical_camp_registrations medical_camp_registrations_registered_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medical_camp_registrations
    ADD CONSTRAINT medical_camp_registrations_registered_by_user_id_fkey FOREIGN KEY (registered_by_user_id) REFERENCES public.users(id);


--
-- Name: medical_camp_registrations medical_camp_registrations_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medical_camp_registrations
    ADD CONSTRAINT medical_camp_registrations_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE;


--
-- Name: medical_staff medical_staff_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medical_staff
    ADD CONSTRAINT medical_staff_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: medical_visits medical_visits_attended_by_staff_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medical_visits
    ADD CONSTRAINT medical_visits_attended_by_staff_id_fkey FOREIGN KEY (attended_by_staff_id) REFERENCES public.medical_staff(id);


--
-- Name: medical_visits medical_visits_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medical_visits
    ADD CONSTRAINT medical_visits_faculty_id_fkey FOREIGN KEY (faculty_id) REFERENCES public.faculty(id);


--
-- Name: medical_visits medical_visits_staff_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medical_visits
    ADD CONSTRAINT medical_visits_staff_id_fkey FOREIGN KEY (staff_id) REFERENCES public.non_teaching_staff(id);


--
-- Name: medical_visits medical_visits_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medical_visits
    ADD CONSTRAINT medical_visits_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: meeting_action_items meeting_action_items_meeting_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.meeting_action_items
    ADD CONSTRAINT meeting_action_items_meeting_id_fkey FOREIGN KEY (meeting_id) REFERENCES public.department_meetings(id) ON DELETE CASCADE;


--
-- Name: message_conversations message_conversations_created_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message_conversations
    ADD CONSTRAINT message_conversations_created_by_user_id_fkey FOREIGN KEY (created_by_user_id) REFERENCES public.users(id);


--
-- Name: message_participants message_participants_conversation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message_participants
    ADD CONSTRAINT message_participants_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.message_conversations(id) ON DELETE CASCADE;


--
-- Name: message_participants message_participants_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message_participants
    ADD CONSTRAINT message_participants_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: message_requests message_requests_conversation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message_requests
    ADD CONSTRAINT message_requests_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.message_conversations(id) ON DELETE CASCADE;


--
-- Name: message_requests message_requests_receiver_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message_requests
    ADD CONSTRAINT message_requests_receiver_user_id_fkey FOREIGN KEY (receiver_user_id) REFERENCES public.users(id);


--
-- Name: message_requests message_requests_sender_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message_requests
    ADD CONSTRAINT message_requests_sender_user_id_fkey FOREIGN KEY (sender_user_id) REFERENCES public.users(id);


--
-- Name: messages messages_conversation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.message_conversations(id) ON DELETE CASCADE;


--
-- Name: messages messages_deleted_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_deleted_by_user_id_fkey FOREIGN KEY (deleted_by_user_id) REFERENCES public.users(id);


--
-- Name: messages messages_sender_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_sender_user_id_fkey FOREIGN KEY (sender_user_id) REFERENCES public.users(id);


--
-- Name: nba_criteria nba_criteria_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nba_criteria
    ADD CONSTRAINT nba_criteria_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id);


--
-- Name: nba_evidence_items nba_evidence_items_criterion_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nba_evidence_items
    ADD CONSTRAINT nba_evidence_items_criterion_id_fkey FOREIGN KEY (criterion_id) REFERENCES public.nba_criteria(id) ON DELETE CASCADE;


--
-- Name: nba_evidence_items nba_evidence_items_updated_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nba_evidence_items
    ADD CONSTRAINT nba_evidence_items_updated_by_user_id_fkey FOREIGN KEY (updated_by_user_id) REFERENCES public.users(id);


--
-- Name: non_teaching_staff non_teaching_staff_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.non_teaching_staff
    ADD CONSTRAINT non_teaching_staff_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id);


--
-- Name: non_teaching_staff non_teaching_staff_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.non_teaching_staff
    ADD CONSTRAINT non_teaching_staff_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: od_request_hod_approvals od_request_hod_approvals_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.od_request_hod_approvals
    ADD CONSTRAINT od_request_hod_approvals_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id);


--
-- Name: od_request_hod_approvals od_request_hod_approvals_hod_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.od_request_hod_approvals
    ADD CONSTRAINT od_request_hod_approvals_hod_user_id_fkey FOREIGN KEY (hod_user_id) REFERENCES public.users(id);


--
-- Name: od_request_hod_approvals od_request_hod_approvals_od_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.od_request_hod_approvals
    ADD CONSTRAINT od_request_hod_approvals_od_request_id_fkey FOREIGN KEY (od_request_id) REFERENCES public.od_requests(id) ON DELETE CASCADE;


--
-- Name: od_request_hod_approvals od_request_hod_approvals_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.od_request_hod_approvals
    ADD CONSTRAINT od_request_hod_approvals_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: od_request_parent_acknowledgements od_request_parent_acknowledgements_od_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.od_request_parent_acknowledgements
    ADD CONSTRAINT od_request_parent_acknowledgements_od_request_id_fkey FOREIGN KEY (od_request_id) REFERENCES public.od_requests(id) ON DELETE CASCADE;


--
-- Name: od_request_parent_acknowledgements od_request_parent_acknowledgements_parent_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.od_request_parent_acknowledgements
    ADD CONSTRAINT od_request_parent_acknowledgements_parent_user_id_fkey FOREIGN KEY (parent_user_id) REFERENCES public.users(id);


--
-- Name: od_requests od_requests_faculty_guide_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.od_requests
    ADD CONSTRAINT od_requests_faculty_guide_id_fkey FOREIGN KEY (faculty_guide_id) REFERENCES public.faculty(id);


--
-- Name: od_requests od_requests_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.od_requests
    ADD CONSTRAINT od_requests_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.od_teams(id);


--
-- Name: od_team_members od_team_members_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.od_team_members
    ADD CONSTRAINT od_team_members_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: od_team_members od_team_members_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.od_team_members
    ADD CONSTRAINT od_team_members_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.od_teams(id) ON DELETE CASCADE;


--
-- Name: od_teams od_teams_created_by_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.od_teams
    ADD CONSTRAINT od_teams_created_by_student_id_fkey FOREIGN KEY (created_by_student_id) REFERENCES public.students(id);


--
-- Name: od_teams od_teams_faculty_guide_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.od_teams
    ADD CONSTRAINT od_teams_faculty_guide_id_fkey FOREIGN KEY (faculty_guide_id) REFERENCES public.faculty(id);


--
-- Name: online_class_participants online_class_participants_online_class_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.online_class_participants
    ADD CONSTRAINT online_class_participants_online_class_id_fkey FOREIGN KEY (online_class_id) REFERENCES public.online_classes(id) ON DELETE CASCADE;


--
-- Name: online_class_participants online_class_participants_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.online_class_participants
    ADD CONSTRAINT online_class_participants_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: online_classes online_classes_class_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.online_classes
    ADD CONSTRAINT online_classes_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.classes(id);


--
-- Name: online_classes online_classes_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.online_classes
    ADD CONSTRAINT online_classes_faculty_id_fkey FOREIGN KEY (faculty_id) REFERENCES public.faculty(id);


--
-- Name: online_classes online_classes_subject_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.online_classes
    ADD CONSTRAINT online_classes_subject_id_fkey FOREIGN KEY (subject_id) REFERENCES public.subjects(id);


--
-- Name: outcome_attainments outcome_attainments_batch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.outcome_attainments
    ADD CONSTRAINT outcome_attainments_batch_id_fkey FOREIGN KEY (batch_id) REFERENCES public.batches(id);


--
-- Name: outcome_attainments outcome_attainments_course_outcome_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.outcome_attainments
    ADD CONSTRAINT outcome_attainments_course_outcome_id_fkey FOREIGN KEY (course_outcome_id) REFERENCES public.course_outcomes(id);


--
-- Name: outcome_attainments outcome_attainments_entered_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.outcome_attainments
    ADD CONSTRAINT outcome_attainments_entered_by_user_id_fkey FOREIGN KEY (entered_by_user_id) REFERENCES public.users(id);


--
-- Name: outcome_attainments outcome_attainments_program_outcome_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.outcome_attainments
    ADD CONSTRAINT outcome_attainments_program_outcome_id_fkey FOREIGN KEY (program_outcome_id) REFERENCES public.program_outcomes(id);


--
-- Name: parent_feedback parent_feedback_parent_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.parent_feedback
    ADD CONSTRAINT parent_feedback_parent_user_id_fkey FOREIGN KEY (parent_user_id) REFERENCES public.users(id);


--
-- Name: parent_feedback parent_feedback_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.parent_feedback
    ADD CONSTRAINT parent_feedback_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: parent_student_mapping parent_student_mapping_parent_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.parent_student_mapping
    ADD CONSTRAINT parent_student_mapping_parent_user_id_fkey FOREIGN KEY (parent_user_id) REFERENCES public.users(id);


--
-- Name: parent_student_mapping parent_student_mapping_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.parent_student_mapping
    ADD CONSTRAINT parent_student_mapping_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: pass_board_course_grace pass_board_course_grace_exam_subject_mapping_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pass_board_course_grace
    ADD CONSTRAINT pass_board_course_grace_exam_subject_mapping_id_fkey FOREIGN KEY (exam_subject_mapping_id) REFERENCES public.exam_subject_mapping(id) ON DELETE CASCADE;


--
-- Name: pass_board_course_grace pass_board_course_grace_sheet_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pass_board_course_grace
    ADD CONSTRAINT pass_board_course_grace_sheet_id_fkey FOREIGN KEY (sheet_id) REFERENCES public.pass_board_sheets(id) ON DELETE CASCADE;


--
-- Name: pass_board_sheets pass_board_sheets_exam_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pass_board_sheets
    ADD CONSTRAINT pass_board_sheets_exam_id_fkey FOREIGN KEY (exam_id) REFERENCES public.exams(id) ON DELETE CASCADE;


--
-- Name: pass_board_signoffs pass_board_signoffs_sheet_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pass_board_signoffs
    ADD CONSTRAINT pass_board_signoffs_sheet_id_fkey FOREIGN KEY (sheet_id) REFERENCES public.pass_board_sheets(id) ON DELETE CASCADE;


--
-- Name: patent_inventors patent_inventors_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.patent_inventors
    ADD CONSTRAINT patent_inventors_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: payslip_requests payslip_requests_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payslip_requests
    ADD CONSTRAINT payslip_requests_faculty_id_fkey FOREIGN KEY (faculty_id) REFERENCES public.faculty(id);


--
-- Name: payslip_requests payslip_requests_staff_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payslip_requests
    ADD CONSTRAINT payslip_requests_staff_user_id_fkey FOREIGN KEY (staff_user_id) REFERENCES public.users(id);


--
-- Name: personal_calendar_entries personal_calendar_entries_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.personal_calendar_entries
    ADD CONSTRAINT personal_calendar_entries_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: pharmacy_dispense_log pharmacy_dispense_log_stock_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pharmacy_dispense_log
    ADD CONSTRAINT pharmacy_dispense_log_stock_id_fkey FOREIGN KEY (stock_id) REFERENCES public.pharmacy_stock(id) ON DELETE CASCADE;


--
-- Name: photocopy_requests photocopy_requests_exam_marks_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.photocopy_requests
    ADD CONSTRAINT photocopy_requests_exam_marks_id_fkey FOREIGN KEY (exam_marks_id) REFERENCES public.exam_marks(id);


--
-- Name: photocopy_requests photocopy_requests_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.photocopy_requests
    ADD CONSTRAINT photocopy_requests_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: placement_drives placement_drives_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.placement_drives
    ADD CONSTRAINT placement_drives_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id);


--
-- Name: placement_drives placement_drives_created_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.placement_drives
    ADD CONSTRAINT placement_drives_created_by_user_id_fkey FOREIGN KEY (created_by_user_id) REFERENCES public.users(id);


--
-- Name: placement_interviews placement_interviews_created_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.placement_interviews
    ADD CONSTRAINT placement_interviews_created_by_user_id_fkey FOREIGN KEY (created_by_user_id) REFERENCES public.users(id);


--
-- Name: placement_interviews placement_interviews_drive_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.placement_interviews
    ADD CONSTRAINT placement_interviews_drive_id_fkey FOREIGN KEY (drive_id) REFERENCES public.placement_drives(id);


--
-- Name: placement_interviews placement_interviews_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.placement_interviews
    ADD CONSTRAINT placement_interviews_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: placement_todos placement_todos_created_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.placement_todos
    ADD CONSTRAINT placement_todos_created_by_user_id_fkey FOREIGN KEY (created_by_user_id) REFERENCES public.users(id);


--
-- Name: program_outcomes program_outcomes_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.program_outcomes
    ADD CONSTRAINT program_outcomes_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id);


--
-- Name: publication_contributors publication_contributors_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.publication_contributors
    ADD CONSTRAINT publication_contributors_faculty_id_fkey FOREIGN KEY (faculty_id) REFERENCES public.faculty(id);


--
-- Name: publication_contributors publication_contributors_publication_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.publication_contributors
    ADD CONSTRAINT publication_contributors_publication_id_fkey FOREIGN KEY (publication_id) REFERENCES public.publications(id) ON DELETE CASCADE;


--
-- Name: publication_contributors publication_contributors_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.publication_contributors
    ADD CONSTRAINT publication_contributors_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: purchase_indents purchase_indents_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.purchase_indents
    ADD CONSTRAINT purchase_indents_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id);


--
-- Name: purchase_indents purchase_indents_hod_reviewed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.purchase_indents
    ADD CONSTRAINT purchase_indents_hod_reviewed_by_fkey FOREIGN KEY (hod_reviewed_by) REFERENCES public.users(id);


--
-- Name: purchase_indents purchase_indents_requested_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.purchase_indents
    ADD CONSTRAINT purchase_indents_requested_by_user_id_fkey FOREIGN KEY (requested_by_user_id) REFERENCES public.users(id);


--
-- Name: purchase_order_proposals purchase_order_proposals_finance_reviewed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.purchase_order_proposals
    ADD CONSTRAINT purchase_order_proposals_finance_reviewed_by_fkey FOREIGN KEY (finance_reviewed_by) REFERENCES public.users(id);


--
-- Name: purchase_order_proposals purchase_order_proposals_hod_reviewed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.purchase_order_proposals
    ADD CONSTRAINT purchase_order_proposals_hod_reviewed_by_fkey FOREIGN KEY (hod_reviewed_by) REFERENCES public.users(id);


--
-- Name: purchase_order_proposals purchase_order_proposals_indent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.purchase_order_proposals
    ADD CONSTRAINT purchase_order_proposals_indent_id_fkey FOREIGN KEY (indent_id) REFERENCES public.purchase_indents(id);


--
-- Name: purchase_order_proposals purchase_order_proposals_principal_reviewed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.purchase_order_proposals
    ADD CONSTRAINT purchase_order_proposals_principal_reviewed_by_fkey FOREIGN KEY (principal_reviewed_by) REFERENCES public.users(id);


--
-- Name: purchase_order_proposals purchase_order_proposals_vendor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.purchase_order_proposals
    ADD CONSTRAINT purchase_order_proposals_vendor_id_fkey FOREIGN KEY (vendor_id) REFERENCES public.vendors(id);


--
-- Name: purchase_orders purchase_orders_approved_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT purchase_orders_approved_by_user_id_fkey FOREIGN KEY (approved_by_user_id) REFERENCES public.users(id);


--
-- Name: purchase_orders purchase_orders_proposal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT purchase_orders_proposal_id_fkey FOREIGN KEY (proposal_id) REFERENCES public.purchase_order_proposals(id);


--
-- Name: question_papers question_papers_exam_subject_mapping_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.question_papers
    ADD CONSTRAINT question_papers_exam_subject_mapping_id_fkey FOREIGN KEY (exam_subject_mapping_id) REFERENCES public.exam_subject_mapping(id) ON DELETE CASCADE;


--
-- Name: question_papers question_papers_moderator_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.question_papers
    ADD CONSTRAINT question_papers_moderator_faculty_id_fkey FOREIGN KEY (moderator_faculty_id) REFERENCES public.faculty(id);


--
-- Name: question_papers question_papers_setter_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.question_papers
    ADD CONSTRAINT question_papers_setter_faculty_id_fkey FOREIGN KEY (setter_faculty_id) REFERENCES public.faculty(id);


--
-- Name: refunds refunds_approved_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refunds
    ADD CONSTRAINT refunds_approved_by_user_id_fkey FOREIGN KEY (approved_by_user_id) REFERENCES public.users(id);


--
-- Name: refunds refunds_fee_payment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refunds
    ADD CONSTRAINT refunds_fee_payment_id_fkey FOREIGN KEY (fee_payment_id) REFERENCES public.fee_payments(id);


--
-- Name: refunds refunds_requested_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refunds
    ADD CONSTRAINT refunds_requested_by_user_id_fkey FOREIGN KEY (requested_by_user_id) REFERENCES public.users(id);


--
-- Name: refunds refunds_student_fee_demand_mapping_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refunds
    ADD CONSTRAINT refunds_student_fee_demand_mapping_id_fkey FOREIGN KEY (student_fee_demand_mapping_id) REFERENCES public.student_fee_demand_mapping(id);


--
-- Name: regulation_courses regulation_courses_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.regulation_courses
    ADD CONSTRAINT regulation_courses_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: regulation_courses regulation_courses_regulation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.regulation_courses
    ADD CONSTRAINT regulation_courses_regulation_id_fkey FOREIGN KEY (regulation_id) REFERENCES public.regulations(id) ON DELETE CASCADE;


--
-- Name: regulations regulations_created_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.regulations
    ADD CONSTRAINT regulations_created_by_user_id_fkey FOREIGN KEY (created_by_user_id) REFERENCES public.users(id);


--
-- Name: research_project_members research_project_members_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.research_project_members
    ADD CONSTRAINT research_project_members_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: result_publications result_publications_exam_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.result_publications
    ADD CONSTRAINT result_publications_exam_id_fkey FOREIGN KEY (exam_id) REFERENCES public.exams(id);


--
-- Name: result_publications result_publications_published_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.result_publications
    ADD CONSTRAINT result_publications_published_by_user_id_fkey FOREIGN KEY (published_by_user_id) REFERENCES public.users(id);


--
-- Name: revaluation_requests revaluation_requests_evaluator_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.revaluation_requests
    ADD CONSTRAINT revaluation_requests_evaluator_faculty_id_fkey FOREIGN KEY (evaluator_faculty_id) REFERENCES public.faculty(id);


--
-- Name: revaluation_requests revaluation_requests_exam_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.revaluation_requests
    ADD CONSTRAINT revaluation_requests_exam_id_fkey FOREIGN KEY (exam_id) REFERENCES public.exams(id);


--
-- Name: revaluation_requests revaluation_requests_exam_marks_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.revaluation_requests
    ADD CONSTRAINT revaluation_requests_exam_marks_id_fkey FOREIGN KEY (exam_marks_id) REFERENCES public.exam_marks(id);


--
-- Name: revaluation_requests revaluation_requests_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.revaluation_requests
    ADD CONSTRAINT revaluation_requests_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: revaluation_requests revaluation_requests_subject_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.revaluation_requests
    ADD CONSTRAINT revaluation_requests_subject_id_fkey FOREIGN KEY (subject_id) REFERENCES public.subjects(id);


--
-- Name: revaluation_windows revaluation_windows_exam_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.revaluation_windows
    ADD CONSTRAINT revaluation_windows_exam_id_fkey FOREIGN KEY (exam_id) REFERENCES public.exams(id) ON DELETE CASCADE;


--
-- Name: salary_divisions salary_divisions_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.salary_divisions
    ADD CONSTRAINT salary_divisions_faculty_id_fkey FOREIGN KEY (faculty_id) REFERENCES public.faculty(id);


--
-- Name: salary_payments salary_payments_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.salary_payments
    ADD CONSTRAINT salary_payments_faculty_id_fkey FOREIGN KEY (faculty_id) REFERENCES public.faculty(id);


--
-- Name: salary_payments salary_payments_processed_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.salary_payments
    ADD CONSTRAINT salary_payments_processed_by_user_id_fkey FOREIGN KEY (processed_by_user_id) REFERENCES public.users(id);


--
-- Name: salary_payments salary_payments_staff_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.salary_payments
    ADD CONSTRAINT salary_payments_staff_id_fkey FOREIGN KEY (staff_id) REFERENCES public.non_teaching_staff(id);


--
-- Name: script_archive_bundles script_archive_bundles_bundle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.script_archive_bundles
    ADD CONSTRAINT script_archive_bundles_bundle_id_fkey FOREIGN KEY (bundle_id) REFERENCES public.script_bundles(id) ON DELETE CASCADE;


--
-- Name: script_bundle_marks script_bundle_marks_bundle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.script_bundle_marks
    ADD CONSTRAINT script_bundle_marks_bundle_id_fkey FOREIGN KEY (bundle_id) REFERENCES public.script_bundles(id) ON DELETE CASCADE;


--
-- Name: script_bundle_scripts script_bundle_scripts_bundle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.script_bundle_scripts
    ADD CONSTRAINT script_bundle_scripts_bundle_id_fkey FOREIGN KEY (bundle_id) REFERENCES public.script_bundles(id) ON DELETE CASCADE;


--
-- Name: script_bundle_scripts script_bundle_scripts_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.script_bundle_scripts
    ADD CONSTRAINT script_bundle_scripts_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE;


--
-- Name: script_bundles script_bundles_exam_subject_mapping_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.script_bundles
    ADD CONSTRAINT script_bundles_exam_subject_mapping_id_fkey FOREIGN KEY (exam_subject_mapping_id) REFERENCES public.exam_subject_mapping(id) ON DELETE CASCADE;


--
-- Name: script_bundles script_bundles_valuator_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.script_bundles
    ADD CONSTRAINT script_bundles_valuator_faculty_id_fkey FOREIGN KEY (valuator_faculty_id) REFERENCES public.faculty(id);


--
-- Name: script_retrieval_requests script_retrieval_requests_archive_bundle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.script_retrieval_requests
    ADD CONSTRAINT script_retrieval_requests_archive_bundle_id_fkey FOREIGN KEY (archive_bundle_id) REFERENCES public.script_archive_bundles(id) ON DELETE CASCADE;


--
-- Name: script_retrieval_requests script_retrieval_requests_requested_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.script_retrieval_requests
    ADD CONSTRAINT script_retrieval_requests_requested_by_user_id_fkey FOREIGN KEY (requested_by_user_id) REFERENCES public.users(id);


--
-- Name: seating_arrangements seating_arrangements_hall_plan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seating_arrangements
    ADD CONSTRAINT seating_arrangements_hall_plan_id_fkey FOREIGN KEY (hall_plan_id) REFERENCES public.hall_plans(id) ON DELETE CASCADE;


--
-- Name: seating_arrangements seating_arrangements_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seating_arrangements
    ADD CONSTRAINT seating_arrangements_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: seating_arrangements seating_arrangements_version_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seating_arrangements
    ADD CONSTRAINT seating_arrangements_version_id_fkey FOREIGN KEY (version_id) REFERENCES public.seating_plan_versions(id);


--
-- Name: seating_plan_venue_departments seating_plan_venue_departments_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seating_plan_venue_departments
    ADD CONSTRAINT seating_plan_venue_departments_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id);


--
-- Name: seating_plan_venue_departments seating_plan_venue_departments_version_venue_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seating_plan_venue_departments
    ADD CONSTRAINT seating_plan_venue_departments_version_venue_id_fkey FOREIGN KEY (version_venue_id) REFERENCES public.seating_plan_version_venues(id) ON DELETE CASCADE;


--
-- Name: seating_plan_version_venues seating_plan_version_venues_hall_plan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seating_plan_version_venues
    ADD CONSTRAINT seating_plan_version_venues_hall_plan_id_fkey FOREIGN KEY (hall_plan_id) REFERENCES public.hall_plans(id);


--
-- Name: seating_plan_version_venues seating_plan_version_venues_venue_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seating_plan_version_venues
    ADD CONSTRAINT seating_plan_version_venues_venue_id_fkey FOREIGN KEY (venue_id) REFERENCES public.venues(id);


--
-- Name: seating_plan_version_venues seating_plan_version_venues_version_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seating_plan_version_venues
    ADD CONSTRAINT seating_plan_version_venues_version_id_fkey FOREIGN KEY (version_id) REFERENCES public.seating_plan_versions(id) ON DELETE CASCADE;


--
-- Name: seating_plan_versions seating_plan_versions_created_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seating_plan_versions
    ADD CONSTRAINT seating_plan_versions_created_by_user_id_fkey FOREIGN KEY (created_by_user_id) REFERENCES public.users(id);


--
-- Name: seating_plan_versions seating_plan_versions_exam_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seating_plan_versions
    ADD CONSTRAINT seating_plan_versions_exam_id_fkey FOREIGN KEY (exam_id) REFERENCES public.exams(id) ON DELETE CASCADE;


--
-- Name: seating_plan_versions seating_plan_versions_published_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seating_plan_versions
    ADD CONSTRAINT seating_plan_versions_published_by_user_id_fkey FOREIGN KEY (published_by_user_id) REFERENCES public.users(id);


--
-- Name: secretary_product_request_items secretary_product_request_items_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.secretary_product_request_items
    ADD CONSTRAINT secretary_product_request_items_request_id_fkey FOREIGN KEY (request_id) REFERENCES public.secretary_product_requests(id) ON DELETE CASCADE;


--
-- Name: secretary_product_requests secretary_product_requests_requested_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.secretary_product_requests
    ADD CONSTRAINT secretary_product_requests_requested_by_user_id_fkey FOREIGN KEY (requested_by_user_id) REFERENCES public.users(id);


--
-- Name: secretary_product_requests secretary_product_requests_reviewed_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.secretary_product_requests
    ADD CONSTRAINT secretary_product_requests_reviewed_by_user_id_fkey FOREIGN KEY (reviewed_by_user_id) REFERENCES public.users(id);


--
-- Name: secretary_service_request_items secretary_service_request_items_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.secretary_service_request_items
    ADD CONSTRAINT secretary_service_request_items_request_id_fkey FOREIGN KEY (request_id) REFERENCES public.secretary_service_requests(id) ON DELETE CASCADE;


--
-- Name: secretary_service_requests secretary_service_requests_requested_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.secretary_service_requests
    ADD CONSTRAINT secretary_service_requests_requested_by_user_id_fkey FOREIGN KEY (requested_by_user_id) REFERENCES public.users(id);


--
-- Name: secretary_service_requests secretary_service_requests_reviewed_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.secretary_service_requests
    ADD CONSTRAINT secretary_service_requests_reviewed_by_user_id_fkey FOREIGN KEY (reviewed_by_user_id) REFERENCES public.users(id);


--
-- Name: service_indents service_indents_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_indents
    ADD CONSTRAINT service_indents_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id);


--
-- Name: service_indents service_indents_hod_reviewed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_indents
    ADD CONSTRAINT service_indents_hod_reviewed_by_fkey FOREIGN KEY (hod_reviewed_by) REFERENCES public.users(id);


--
-- Name: service_indents service_indents_requested_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_indents
    ADD CONSTRAINT service_indents_requested_by_user_id_fkey FOREIGN KEY (requested_by_user_id) REFERENCES public.users(id);


--
-- Name: service_order_proposals service_order_proposals_finance_reviewed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_order_proposals
    ADD CONSTRAINT service_order_proposals_finance_reviewed_by_fkey FOREIGN KEY (finance_reviewed_by) REFERENCES public.users(id);


--
-- Name: service_order_proposals service_order_proposals_hod_reviewed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_order_proposals
    ADD CONSTRAINT service_order_proposals_hod_reviewed_by_fkey FOREIGN KEY (hod_reviewed_by) REFERENCES public.users(id);


--
-- Name: service_order_proposals service_order_proposals_indent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_order_proposals
    ADD CONSTRAINT service_order_proposals_indent_id_fkey FOREIGN KEY (indent_id) REFERENCES public.service_indents(id);


--
-- Name: service_order_proposals service_order_proposals_principal_reviewed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_order_proposals
    ADD CONSTRAINT service_order_proposals_principal_reviewed_by_fkey FOREIGN KEY (principal_reviewed_by) REFERENCES public.users(id);


--
-- Name: service_order_proposals service_order_proposals_vendor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_order_proposals
    ADD CONSTRAINT service_order_proposals_vendor_id_fkey FOREIGN KEY (vendor_id) REFERENCES public.vendors(id);


--
-- Name: service_orders service_orders_approved_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_orders
    ADD CONSTRAINT service_orders_approved_by_user_id_fkey FOREIGN KEY (approved_by_user_id) REFERENCES public.users(id);


--
-- Name: service_orders service_orders_proposal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_orders
    ADD CONSTRAINT service_orders_proposal_id_fkey FOREIGN KEY (proposal_id) REFERENCES public.service_order_proposals(id);


--
-- Name: sick_room_stays sick_room_stays_bed_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sick_room_stays
    ADD CONSTRAINT sick_room_stays_bed_id_fkey FOREIGN KEY (bed_id) REFERENCES public.sick_room_beds(id) ON DELETE CASCADE;


--
-- Name: sick_room_stays sick_room_stays_visit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sick_room_stays
    ADD CONSTRAINT sick_room_stays_visit_id_fkey FOREIGN KEY (visit_id) REFERENCES public.medical_visits(id) ON DELETE SET NULL;


--
-- Name: social_post_details social_post_details_announcement_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.social_post_details
    ADD CONSTRAINT social_post_details_announcement_id_fkey FOREIGN KEY (announcement_id) REFERENCES public.announcements(id) ON DELETE CASCADE;


--
-- Name: sports_achievements sports_achievements_athlete_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_achievements
    ADD CONSTRAINT sports_achievements_athlete_student_id_fkey FOREIGN KEY (athlete_student_id) REFERENCES public.students(id);


--
-- Name: sports_achievements sports_achievements_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_achievements
    ADD CONSTRAINT sports_achievements_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.sports_teams(id);


--
-- Name: sports_announcements sports_announcements_posted_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_announcements
    ADD CONSTRAINT sports_announcements_posted_by_user_id_fkey FOREIGN KEY (posted_by_user_id) REFERENCES public.users(id);


--
-- Name: sports_athlete_profiles sports_athlete_profiles_primary_discipline_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_athlete_profiles
    ADD CONSTRAINT sports_athlete_profiles_primary_discipline_id_fkey FOREIGN KEY (primary_discipline_id) REFERENCES public.sports_disciplines(id);


--
-- Name: sports_athlete_profiles sports_athlete_profiles_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_athlete_profiles
    ADD CONSTRAINT sports_athlete_profiles_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE;


--
-- Name: sports_budget_requests sports_budget_requests_budget_allocation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_budget_requests
    ADD CONSTRAINT sports_budget_requests_budget_allocation_id_fkey FOREIGN KEY (budget_allocation_id) REFERENCES public.budget_allocations(id);


--
-- Name: sports_budget_requests sports_budget_requests_raised_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_budget_requests
    ADD CONSTRAINT sports_budget_requests_raised_by_user_id_fkey FOREIGN KEY (raised_by_user_id) REFERENCES public.users(id);


--
-- Name: sports_budget_requests sports_budget_requests_reviewed_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_budget_requests
    ADD CONSTRAINT sports_budget_requests_reviewed_by_user_id_fkey FOREIGN KEY (reviewed_by_user_id) REFERENCES public.users(id);


--
-- Name: sports_calendar_notes sports_calendar_notes_created_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_calendar_notes
    ADD CONSTRAINT sports_calendar_notes_created_by_user_id_fkey FOREIGN KEY (created_by_user_id) REFERENCES public.users(id);


--
-- Name: sports_coach_profiles sports_coach_profiles_discipline_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_coach_profiles
    ADD CONSTRAINT sports_coach_profiles_discipline_id_fkey FOREIGN KEY (discipline_id) REFERENCES public.sports_disciplines(id);


--
-- Name: sports_coach_profiles sports_coach_profiles_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_coach_profiles
    ADD CONSTRAINT sports_coach_profiles_faculty_id_fkey FOREIGN KEY (faculty_id) REFERENCES public.faculty(id) ON DELETE CASCADE;


--
-- Name: sports_disciplines sports_disciplines_head_coach_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_disciplines
    ADD CONSTRAINT sports_disciplines_head_coach_faculty_id_fkey FOREIGN KEY (head_coach_faculty_id) REFERENCES public.faculty(id);


--
-- Name: sports_equipment sports_equipment_facility_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_equipment
    ADD CONSTRAINT sports_equipment_facility_id_fkey FOREIGN KEY (facility_id) REFERENCES public.sports_facilities(id);


--
-- Name: sports_equipment_issues sports_equipment_issues_equipment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_equipment_issues
    ADD CONSTRAINT sports_equipment_issues_equipment_id_fkey FOREIGN KEY (equipment_id) REFERENCES public.sports_equipment(id);


--
-- Name: sports_equipment_issues sports_equipment_issues_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_equipment_issues
    ADD CONSTRAINT sports_equipment_issues_faculty_id_fkey FOREIGN KEY (faculty_id) REFERENCES public.faculty(id);


--
-- Name: sports_equipment_issues sports_equipment_issues_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_equipment_issues
    ADD CONSTRAINT sports_equipment_issues_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: sports_fitness_tests sports_fitness_tests_recorded_by_staff_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_fitness_tests
    ADD CONSTRAINT sports_fitness_tests_recorded_by_staff_id_fkey FOREIGN KEY (recorded_by_staff_id) REFERENCES public.medical_staff(id);


--
-- Name: sports_fitness_tests sports_fitness_tests_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_fitness_tests
    ADD CONSTRAINT sports_fitness_tests_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: sports_fixtures sports_fixtures_discipline_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_fixtures
    ADD CONSTRAINT sports_fixtures_discipline_id_fkey FOREIGN KEY (discipline_id) REFERENCES public.sports_disciplines(id);


--
-- Name: sports_fixtures sports_fixtures_facility_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_fixtures
    ADD CONSTRAINT sports_fixtures_facility_id_fkey FOREIGN KEY (facility_id) REFERENCES public.sports_facilities(id);


--
-- Name: sports_fixtures sports_fixtures_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_fixtures
    ADD CONSTRAINT sports_fixtures_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.sports_teams(id);


--
-- Name: sports_injuries sports_injuries_discipline_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_injuries
    ADD CONSTRAINT sports_injuries_discipline_id_fkey FOREIGN KEY (discipline_id) REFERENCES public.sports_disciplines(id);


--
-- Name: sports_injuries sports_injuries_facility_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_injuries
    ADD CONSTRAINT sports_injuries_facility_id_fkey FOREIGN KEY (facility_id) REFERENCES public.sports_facilities(id);


--
-- Name: sports_injuries sports_injuries_medical_visit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_injuries
    ADD CONSTRAINT sports_injuries_medical_visit_id_fkey FOREIGN KEY (medical_visit_id) REFERENCES public.medical_visits(id);


--
-- Name: sports_injuries sports_injuries_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_injuries
    ADD CONSTRAINT sports_injuries_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: sports_od_hod_approvals sports_od_hod_approvals_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_od_hod_approvals
    ADD CONSTRAINT sports_od_hod_approvals_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id);


--
-- Name: sports_od_hod_approvals sports_od_hod_approvals_hod_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_od_hod_approvals
    ADD CONSTRAINT sports_od_hod_approvals_hod_user_id_fkey FOREIGN KEY (hod_user_id) REFERENCES public.users(id);


--
-- Name: sports_od_hod_approvals sports_od_hod_approvals_od_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_od_hod_approvals
    ADD CONSTRAINT sports_od_hod_approvals_od_request_id_fkey FOREIGN KEY (od_request_id) REFERENCES public.sports_od_requests(id) ON DELETE CASCADE;


--
-- Name: sports_od_hod_approvals sports_od_hod_approvals_reviewed_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_od_hod_approvals
    ADD CONSTRAINT sports_od_hod_approvals_reviewed_by_user_id_fkey FOREIGN KEY (reviewed_by_user_id) REFERENCES public.users(id);


--
-- Name: sports_od_letter_numbers sports_od_letter_numbers_issued_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_od_letter_numbers
    ADD CONSTRAINT sports_od_letter_numbers_issued_by_user_id_fkey FOREIGN KEY (issued_by_user_id) REFERENCES public.users(id);


--
-- Name: sports_od_letter_numbers sports_od_letter_numbers_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_od_letter_numbers
    ADD CONSTRAINT sports_od_letter_numbers_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: sports_od_requests sports_od_requests_accompanying_coach_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_od_requests
    ADD CONSTRAINT sports_od_requests_accompanying_coach_faculty_id_fkey FOREIGN KEY (accompanying_coach_faculty_id) REFERENCES public.faculty(id);


--
-- Name: sports_od_requests sports_od_requests_requested_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_od_requests
    ADD CONSTRAINT sports_od_requests_requested_by_user_id_fkey FOREIGN KEY (requested_by_user_id) REFERENCES public.users(id);


--
-- Name: sports_od_requests sports_od_requests_reviewed_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_od_requests
    ADD CONSTRAINT sports_od_requests_reviewed_by_user_id_fkey FOREIGN KEY (reviewed_by_user_id) REFERENCES public.users(id);


--
-- Name: sports_od_squad_members sports_od_squad_members_od_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_od_squad_members
    ADD CONSTRAINT sports_od_squad_members_od_request_id_fkey FOREIGN KEY (od_request_id) REFERENCES public.sports_od_requests(id) ON DELETE CASCADE;


--
-- Name: sports_od_squad_members sports_od_squad_members_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_od_squad_members
    ADD CONSTRAINT sports_od_squad_members_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: sports_reports sports_reports_created_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_reports
    ADD CONSTRAINT sports_reports_created_by_user_id_fkey FOREIGN KEY (created_by_user_id) REFERENCES public.users(id);


--
-- Name: sports_session_attendance sports_session_attendance_marked_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_session_attendance
    ADD CONSTRAINT sports_session_attendance_marked_by_user_id_fkey FOREIGN KEY (marked_by_user_id) REFERENCES public.users(id);


--
-- Name: sports_session_attendance sports_session_attendance_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_session_attendance
    ADD CONSTRAINT sports_session_attendance_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.sports_training_sessions(id) ON DELETE CASCADE;


--
-- Name: sports_session_attendance sports_session_attendance_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_session_attendance
    ADD CONSTRAINT sports_session_attendance_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: sports_teams sports_teams_captain_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_teams
    ADD CONSTRAINT sports_teams_captain_fkey FOREIGN KEY (captain_student_id) REFERENCES public.students(id);


--
-- Name: sports_teams sports_teams_coach_faculty_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_teams
    ADD CONSTRAINT sports_teams_coach_faculty_fkey FOREIGN KEY (coach_faculty_id) REFERENCES public.faculty(id);


--
-- Name: sports_teams sports_teams_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_teams
    ADD CONSTRAINT sports_teams_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id);


--
-- Name: sports_teams sports_teams_discipline_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_teams
    ADD CONSTRAINT sports_teams_discipline_fkey FOREIGN KEY (discipline_id) REFERENCES public.sports_disciplines(id);


--
-- Name: sports_teams sports_teams_facility_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_teams
    ADD CONSTRAINT sports_teams_facility_fkey FOREIGN KEY (facility_id) REFERENCES public.sports_facilities(id);


--
-- Name: sports_teams sports_teams_vice_captain_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_teams
    ADD CONSTRAINT sports_teams_vice_captain_fkey FOREIGN KEY (vice_captain_student_id) REFERENCES public.students(id);


--
-- Name: sports_training_sessions sports_training_sessions_coach_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_training_sessions
    ADD CONSTRAINT sports_training_sessions_coach_faculty_id_fkey FOREIGN KEY (coach_faculty_id) REFERENCES public.faculty(id);


--
-- Name: sports_training_sessions sports_training_sessions_discipline_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_training_sessions
    ADD CONSTRAINT sports_training_sessions_discipline_id_fkey FOREIGN KEY (discipline_id) REFERENCES public.sports_disciplines(id);


--
-- Name: sports_training_sessions sports_training_sessions_facility_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_training_sessions
    ADD CONSTRAINT sports_training_sessions_facility_id_fkey FOREIGN KEY (facility_id) REFERENCES public.sports_facilities(id);


--
-- Name: sports_trial_scores sports_trial_scores_trial_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_trial_scores
    ADD CONSTRAINT sports_trial_scores_trial_id_fkey FOREIGN KEY (trial_id) REFERENCES public.sports_trials(id) ON DELETE CASCADE;


--
-- Name: sports_trials sports_trials_discipline_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_trials
    ADD CONSTRAINT sports_trials_discipline_id_fkey FOREIGN KEY (discipline_id) REFERENCES public.sports_disciplines(id);


--
-- Name: sports_trials sports_trials_facility_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_trials
    ADD CONSTRAINT sports_trials_facility_id_fkey FOREIGN KEY (facility_id) REFERENCES public.sports_facilities(id);


--
-- Name: sports_trials sports_trials_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_trials
    ADD CONSTRAINT sports_trials_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: sports_trials sports_trials_target_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports_trials
    ADD CONSTRAINT sports_trials_target_team_id_fkey FOREIGN KEY (target_team_id) REFERENCES public.sports_teams(id);


--
-- Name: startup_ideas startup_ideas_converted_venture_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.startup_ideas
    ADD CONSTRAINT startup_ideas_converted_venture_id_fkey FOREIGN KEY (converted_venture_id) REFERENCES public.student_entrepreneurship(id);


--
-- Name: startup_ideas startup_ideas_mentor_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.startup_ideas
    ADD CONSTRAINT startup_ideas_mentor_faculty_id_fkey FOREIGN KEY (mentor_faculty_id) REFERENCES public.faculty(id);


--
-- Name: startup_ideas startup_ideas_reviewer_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.startup_ideas
    ADD CONSTRAINT startup_ideas_reviewer_user_id_fkey FOREIGN KEY (reviewer_user_id) REFERENCES public.users(id);


--
-- Name: startup_ideas startup_ideas_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.startup_ideas
    ADD CONSTRAINT startup_ideas_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: stationary_requests stationary_requests_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stationary_requests
    ADD CONSTRAINT stationary_requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: stationery_order_items stationery_order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stationery_order_items
    ADD CONSTRAINT stationery_order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.stationery_orders(id) ON DELETE CASCADE;


--
-- Name: stationery_order_items stationery_order_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stationery_order_items
    ADD CONSTRAINT stationery_order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.stationery_products(id) ON DELETE RESTRICT;


--
-- Name: stationery_orders stationery_orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stationery_orders
    ADD CONSTRAINT stationery_orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- Name: stationery_orders stationery_orders_wallet_transaction_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stationery_orders
    ADD CONSTRAINT stationery_orders_wallet_transaction_id_fkey FOREIGN KEY (wallet_transaction_id) REFERENCES public.wallet_transactions(id) ON DELETE SET NULL;


--
-- Name: stationery_products stationery_products_created_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stationery_products
    ADD CONSTRAINT stationery_products_created_by_user_id_fkey FOREIGN KEY (created_by_user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: student_addresses student_addresses_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_addresses
    ADD CONSTRAINT student_addresses_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE;


--
-- Name: student_assignment_status student_assignment_status_assignment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_assignment_status
    ADD CONSTRAINT student_assignment_status_assignment_id_fkey FOREIGN KEY (assignment_id) REFERENCES public.assignments(id) ON DELETE CASCADE;


--
-- Name: student_assignment_status student_assignment_status_marked_by_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_assignment_status
    ADD CONSTRAINT student_assignment_status_marked_by_faculty_id_fkey FOREIGN KEY (marked_by_faculty_id) REFERENCES public.faculty(id);


--
-- Name: student_assignment_status student_assignment_status_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_assignment_status
    ADD CONSTRAINT student_assignment_status_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: student_certificates student_certificates_certificate_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_certificates
    ADD CONSTRAINT student_certificates_certificate_type_id_fkey FOREIGN KEY (certificate_type_id) REFERENCES public.certificate_types(id);


--
-- Name: student_certificates student_certificates_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_certificates
    ADD CONSTRAINT student_certificates_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE;


--
-- Name: student_certifications student_certifications_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_certifications
    ADD CONSTRAINT student_certifications_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: student_competitions student_competitions_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_competitions
    ADD CONSTRAINT student_competitions_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: student_contacts student_contacts_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_contacts
    ADD CONSTRAINT student_contacts_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE;


--
-- Name: student_drive_applications student_drive_applications_drive_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_drive_applications
    ADD CONSTRAINT student_drive_applications_drive_id_fkey FOREIGN KEY (drive_id) REFERENCES public.placement_drives(id);


--
-- Name: student_drive_applications student_drive_applications_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_drive_applications
    ADD CONSTRAINT student_drive_applications_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: student_drive_applications student_drive_applications_updated_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_drive_applications
    ADD CONSTRAINT student_drive_applications_updated_by_user_id_fkey FOREIGN KEY (updated_by_user_id) REFERENCES public.users(id);


--
-- Name: student_entrepreneurship student_entrepreneurship_mentor_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_entrepreneurship
    ADD CONSTRAINT student_entrepreneurship_mentor_faculty_id_fkey FOREIGN KEY (mentor_faculty_id) REFERENCES public.faculty(id);


--
-- Name: student_entrepreneurship student_entrepreneurship_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_entrepreneurship
    ADD CONSTRAINT student_entrepreneurship_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: student_escalations student_escalations_class_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_escalations
    ADD CONSTRAINT student_escalations_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.classes(id);


--
-- Name: student_escalations student_escalations_owner_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_escalations
    ADD CONSTRAINT student_escalations_owner_user_id_fkey FOREIGN KEY (owner_user_id) REFERENCES public.users(id);


--
-- Name: student_escalations student_escalations_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_escalations
    ADD CONSTRAINT student_escalations_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: student_family_details student_family_details_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_family_details
    ADD CONSTRAINT student_family_details_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE;


--
-- Name: student_fee_demand_mapping student_fee_demand_mapping_demand_category_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_fee_demand_mapping
    ADD CONSTRAINT student_fee_demand_mapping_demand_category_fkey FOREIGN KEY (demand_category) REFERENCES public.demand_categories(id);


--
-- Name: student_fee_demand_mapping student_fee_demand_mapping_fee_structure_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_fee_demand_mapping
    ADD CONSTRAINT student_fee_demand_mapping_fee_structure_id_fkey FOREIGN KEY (fee_structure_id) REFERENCES public.fee_structures(id);


--
-- Name: student_fee_demand_mapping student_fee_demand_mapping_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_fee_demand_mapping
    ADD CONSTRAINT student_fee_demand_mapping_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: student_hackathon_participations student_hackathon_participations_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_hackathon_participations
    ADD CONSTRAINT student_hackathon_participations_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: student_health_records student_health_records_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_health_records
    ADD CONSTRAINT student_health_records_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE;


--
-- Name: student_higher_education student_higher_education_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_higher_education
    ADD CONSTRAINT student_higher_education_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: student_hostel_mapping student_hostel_mapping_fee_structure_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_hostel_mapping
    ADD CONSTRAINT student_hostel_mapping_fee_structure_id_fkey FOREIGN KEY (fee_structure_id) REFERENCES public.fee_structures(id);


--
-- Name: student_hostel_mapping student_hostel_mapping_room_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_hostel_mapping
    ADD CONSTRAINT student_hostel_mapping_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.hostel_rooms(id);


--
-- Name: student_hostel_mapping student_hostel_mapping_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_hostel_mapping
    ADD CONSTRAINT student_hostel_mapping_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: student_id_card_issuances student_id_card_issuances_issued_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_id_card_issuances
    ADD CONSTRAINT student_id_card_issuances_issued_by_user_id_fkey FOREIGN KEY (issued_by_user_id) REFERENCES public.users(id);


--
-- Name: student_id_card_issuances student_id_card_issuances_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_id_card_issuances
    ADD CONSTRAINT student_id_card_issuances_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: student_identity_marks student_identity_marks_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_identity_marks
    ADD CONSTRAINT student_identity_marks_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE;


--
-- Name: student_leaves student_leaves_approved_by_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_leaves
    ADD CONSTRAINT student_leaves_approved_by_faculty_id_fkey FOREIGN KEY (approved_by_faculty_id) REFERENCES public.faculty(id);


--
-- Name: student_leaves student_leaves_approved_by_hod_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_leaves
    ADD CONSTRAINT student_leaves_approved_by_hod_user_id_fkey FOREIGN KEY (approved_by_hod_user_id) REFERENCES public.users(id);


--
-- Name: student_leaves student_leaves_approved_by_warden_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_leaves
    ADD CONSTRAINT student_leaves_approved_by_warden_user_id_fkey FOREIGN KEY (approved_by_warden_user_id) REFERENCES public.users(id);


--
-- Name: student_leaves student_leaves_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_leaves
    ADD CONSTRAINT student_leaves_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: student_meeting_notes student_meeting_notes_recorded_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_meeting_notes
    ADD CONSTRAINT student_meeting_notes_recorded_by_user_id_fkey FOREIGN KEY (recorded_by_user_id) REFERENCES public.users(id);


--
-- Name: student_meeting_notes student_meeting_notes_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_meeting_notes
    ADD CONSTRAINT student_meeting_notes_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: student_no_due_status student_no_due_status_issued_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_no_due_status
    ADD CONSTRAINT student_no_due_status_issued_by_user_id_fkey FOREIGN KEY (issued_by_user_id) REFERENCES public.users(id);


--
-- Name: student_no_due_status student_no_due_status_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_no_due_status
    ADD CONSTRAINT student_no_due_status_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE;


--
-- Name: student_outpasses student_outpasses_approved_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_outpasses
    ADD CONSTRAINT student_outpasses_approved_by_user_id_fkey FOREIGN KEY (approved_by_user_id) REFERENCES public.users(id);


--
-- Name: student_outpasses student_outpasses_created_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_outpasses
    ADD CONSTRAINT student_outpasses_created_by_user_id_fkey FOREIGN KEY (created_by_user_id) REFERENCES public.users(id);


--
-- Name: student_outpasses student_outpasses_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_outpasses
    ADD CONSTRAINT student_outpasses_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: student_profiles student_profiles_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_profiles
    ADD CONSTRAINT student_profiles_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: student_projects student_projects_mentor_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_projects
    ADD CONSTRAINT student_projects_mentor_faculty_id_fkey FOREIGN KEY (mentor_faculty_id) REFERENCES public.faculty(id);


--
-- Name: student_projects student_projects_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_projects
    ADD CONSTRAINT student_projects_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: student_scholarship_awards student_scholarship_awards_scheme_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_scholarship_awards
    ADD CONSTRAINT student_scholarship_awards_scheme_id_fkey FOREIGN KEY (scheme_id) REFERENCES public.scholarship_schemes(id);


--
-- Name: student_scholarship_awards student_scholarship_awards_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_scholarship_awards
    ADD CONSTRAINT student_scholarship_awards_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: student_semester_gpa student_semester_gpa_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_semester_gpa
    ADD CONSTRAINT student_semester_gpa_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: student_sensitive_info student_sensitive_info_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_sensitive_info
    ADD CONSTRAINT student_sensitive_info_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE;


--
-- Name: student_sports_team_mapping student_sports_team_mapping_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_sports_team_mapping
    ADD CONSTRAINT student_sports_team_mapping_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: student_sports_team_mapping student_sports_team_mapping_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_sports_team_mapping
    ADD CONSTRAINT student_sports_team_mapping_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.sports_teams(id);


--
-- Name: student_test_scores student_test_scores_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_test_scores
    ADD CONSTRAINT student_test_scores_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE;


--
-- Name: student_todo_completions student_todo_completions_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_todo_completions
    ADD CONSTRAINT student_todo_completions_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE;


--
-- Name: student_todo_completions student_todo_completions_todo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_todo_completions
    ADD CONSTRAINT student_todo_completions_todo_id_fkey FOREIGN KEY (todo_id) REFERENCES public.placement_todos(id) ON DELETE CASCADE;


--
-- Name: student_transport_mapping student_transport_mapping_boarding_stage_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_transport_mapping
    ADD CONSTRAINT student_transport_mapping_boarding_stage_id_fkey FOREIGN KEY (boarding_stage_id) REFERENCES public.transport_stages(id);


--
-- Name: student_transport_mapping student_transport_mapping_bus_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_transport_mapping
    ADD CONSTRAINT student_transport_mapping_bus_id_fkey FOREIGN KEY (bus_id) REFERENCES public.buses(id);


--
-- Name: student_transport_mapping student_transport_mapping_destination_stage_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_transport_mapping
    ADD CONSTRAINT student_transport_mapping_destination_stage_id_fkey FOREIGN KEY (destination_stage_id) REFERENCES public.transport_stages(id);


--
-- Name: student_transport_mapping student_transport_mapping_fee_structure_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_transport_mapping
    ADD CONSTRAINT student_transport_mapping_fee_structure_id_fkey FOREIGN KEY (fee_structure_id) REFERENCES public.fee_structures(id);


--
-- Name: student_transport_mapping student_transport_mapping_route_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_transport_mapping
    ADD CONSTRAINT student_transport_mapping_route_id_fkey FOREIGN KEY (route_id) REFERENCES public.transport_routes(id);


--
-- Name: student_transport_mapping student_transport_mapping_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_transport_mapping
    ADD CONSTRAINT student_transport_mapping_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: students students_batch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_batch_id_fkey FOREIGN KEY (batch_id) REFERENCES public.batches(id);


--
-- Name: students students_class_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.classes(id);


--
-- Name: students students_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id);


--
-- Name: students students_mentor_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_mentor_faculty_id_fkey FOREIGN KEY (mentor_faculty_id) REFERENCES public.faculty(id);


--
-- Name: students students_quota_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_quota_id_fkey FOREIGN KEY (quota_id) REFERENCES public.quotas(id);


--
-- Name: students students_soa_application_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_soa_application_id_fkey FOREIGN KEY (soa_application_id) REFERENCES public.soa_applications(id);


--
-- Name: students students_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: subject_academic_clearance subject_academic_clearance_faculty_subject_class_mapping_i_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subject_academic_clearance
    ADD CONSTRAINT subject_academic_clearance_faculty_subject_class_mapping_i_fkey FOREIGN KEY (faculty_subject_class_mapping_id) REFERENCES public.faculty_subject_class_mapping(id) ON DELETE CASCADE;


--
-- Name: subject_academic_clearance subject_academic_clearance_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subject_academic_clearance
    ADD CONSTRAINT subject_academic_clearance_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE;


--
-- Name: subject_academic_clearance subject_academic_clearance_updated_by_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subject_academic_clearance
    ADD CONSTRAINT subject_academic_clearance_updated_by_faculty_id_fkey FOREIGN KEY (updated_by_faculty_id) REFERENCES public.faculty(id);


--
-- Name: subjects subjects_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subjects
    ADD CONSTRAINT subjects_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id);


--
-- Name: timetable_period_requests timetable_period_requests_class_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.timetable_period_requests
    ADD CONSTRAINT timetable_period_requests_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.classes(id);


--
-- Name: timetable_period_requests timetable_period_requests_covering_subject_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.timetable_period_requests
    ADD CONSTRAINT timetable_period_requests_covering_subject_id_fkey FOREIGN KEY (covering_subject_id) REFERENCES public.subjects(id);


--
-- Name: timetable_period_requests timetable_period_requests_decided_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.timetable_period_requests
    ADD CONSTRAINT timetable_period_requests_decided_by_user_id_fkey FOREIGN KEY (decided_by_user_id) REFERENCES public.users(id);


--
-- Name: timetable_period_requests timetable_period_requests_from_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.timetable_period_requests
    ADD CONSTRAINT timetable_period_requests_from_faculty_id_fkey FOREIGN KEY (from_faculty_id) REFERENCES public.faculty(id);


--
-- Name: timetable_period_requests timetable_period_requests_primary_slot_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.timetable_period_requests
    ADD CONSTRAINT timetable_period_requests_primary_slot_id_fkey FOREIGN KEY (primary_slot_id) REFERENCES public.timetable_slots(id);


--
-- Name: timetable_period_requests timetable_period_requests_secondary_slot_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.timetable_period_requests
    ADD CONSTRAINT timetable_period_requests_secondary_slot_id_fkey FOREIGN KEY (secondary_slot_id) REFERENCES public.timetable_slots(id);


--
-- Name: timetable_period_requests timetable_period_requests_to_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.timetable_period_requests
    ADD CONSTRAINT timetable_period_requests_to_faculty_id_fkey FOREIGN KEY (to_faculty_id) REFERENCES public.faculty(id);


--
-- Name: timetable_slots timetable_slots_class_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.timetable_slots
    ADD CONSTRAINT timetable_slots_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.classes(id);


--
-- Name: timetable_slots timetable_slots_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.timetable_slots
    ADD CONSTRAINT timetable_slots_faculty_id_fkey FOREIGN KEY (faculty_id) REFERENCES public.faculty(id);


--
-- Name: timetable_slots timetable_slots_subject_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.timetable_slots
    ADD CONSTRAINT timetable_slots_subject_id_fkey FOREIGN KEY (subject_id) REFERENCES public.subjects(id);


--
-- Name: timetable_slots timetable_slots_venue_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.timetable_slots
    ADD CONSTRAINT timetable_slots_venue_id_fkey FOREIGN KEY (venue_id) REFERENCES public.venues(id);


--
-- Name: transport_notices transport_notices_posted_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transport_notices
    ADD CONSTRAINT transport_notices_posted_by_user_id_fkey FOREIGN KEY (posted_by_user_id) REFERENCES public.users(id);


--
-- Name: transport_stages transport_stages_route_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transport_stages
    ADD CONSTRAINT transport_stages_route_id_fkey FOREIGN KEY (route_id) REFERENCES public.transport_routes(id) ON DELETE CASCADE;


--
-- Name: user_preferences user_preferences_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_preferences
    ADD CONSTRAINT user_preferences_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: user_presence user_presence_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_presence
    ADD CONSTRAINT user_presence_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: user_roles user_roles_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_social_links user_social_links_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_social_links
    ADD CONSTRAINT user_social_links_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: users users_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id);


--
-- Name: vendor_quotations vendor_quotations_vendor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vendor_quotations
    ADD CONSTRAINT vendor_quotations_vendor_id_fkey FOREIGN KEY (vendor_id) REFERENCES public.vendors(id);


--
-- Name: venue_bookings venue_bookings_alternative_venue_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.venue_bookings
    ADD CONSTRAINT venue_bookings_alternative_venue_id_fkey FOREIGN KEY (alternative_venue_id) REFERENCES public.venues(id);


--
-- Name: venue_bookings venue_bookings_booked_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.venue_bookings
    ADD CONSTRAINT venue_bookings_booked_by_user_id_fkey FOREIGN KEY (booked_by_user_id) REFERENCES public.users(id);


--
-- Name: venue_bookings venue_bookings_reviewed_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.venue_bookings
    ADD CONSTRAINT venue_bookings_reviewed_by_user_id_fkey FOREIGN KEY (reviewed_by_user_id) REFERENCES public.users(id);


--
-- Name: venue_bookings venue_bookings_venue_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.venue_bookings
    ADD CONSTRAINT venue_bookings_venue_id_fkey FOREIGN KEY (venue_id) REFERENCES public.venues(id);


--
-- Name: visitor_logs visitor_logs_recorded_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.visitor_logs
    ADD CONSTRAINT visitor_logs_recorded_by_user_id_fkey FOREIGN KEY (recorded_by_user_id) REFERENCES public.users(id);


--
-- Name: wallet_transactions wallet_transactions_collected_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wallet_transactions
    ADD CONSTRAINT wallet_transactions_collected_by_user_id_fkey FOREIGN KEY (processed_by_user_id) REFERENCES public.users(id);


--
-- Name: wallet_transactions wallet_transactions_counterparty_wallet_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wallet_transactions
    ADD CONSTRAINT wallet_transactions_counterparty_wallet_id_fkey FOREIGN KEY (counterparty_wallet_id) REFERENCES public.wallets(id);


--
-- Name: wallet_transactions wallet_transactions_outlet_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wallet_transactions
    ADD CONSTRAINT wallet_transactions_outlet_id_fkey FOREIGN KEY (outlet_id) REFERENCES public.wallet_outlets(id);


--
-- Name: wallet_transactions wallet_transactions_related_transaction_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wallet_transactions
    ADD CONSTRAINT wallet_transactions_related_transaction_id_fkey FOREIGN KEY (related_transaction_id) REFERENCES public.wallet_transactions(id);


--
-- Name: wallet_transactions wallet_transactions_wallet_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wallet_transactions
    ADD CONSTRAINT wallet_transactions_wallet_id_fkey FOREIGN KEY (wallet_id) REFERENCES public.wallets(id);


--
-- Name: wallets wallets_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wallets
    ADD CONSTRAINT wallets_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: announcement_media; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.announcement_media ENABLE ROW LEVEL SECURITY;

--
-- Name: book_borrow_requests; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.book_borrow_requests ENABLE ROW LEVEL SECURITY;

--
-- Name: faculty_feedback_forms; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.faculty_feedback_forms ENABLE ROW LEVEL SECURITY;

--
-- Name: faculty_feedback_questions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.faculty_feedback_questions ENABLE ROW LEVEL SECURITY;

--
-- Name: faculty_feedback_responses; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.faculty_feedback_responses ENABLE ROW LEVEL SECURITY;

--
-- Name: finance_audit_log; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.finance_audit_log ENABLE ROW LEVEL SECURITY;

--
-- Name: finance_funds; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.finance_funds ENABLE ROW LEVEL SECURITY;

--
-- Name: finance_ledger_entries; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.finance_ledger_entries ENABLE ROW LEVEL SECURITY;

--
-- Name: finance_order_allotments; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.finance_order_allotments ENABLE ROW LEVEL SECURITY;

--
-- Name: finance_order_tracking; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.finance_order_tracking ENABLE ROW LEVEL SECURITY;

--
-- Name: finance_order_tracking_events; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.finance_order_tracking_events ENABLE ROW LEVEL SECURITY;

--
-- Name: finance_proposal_assignments; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.finance_proposal_assignments ENABLE ROW LEVEL SECURITY;

--
-- Name: higher_education_application_students; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.higher_education_application_students ENABLE ROW LEVEL SECURITY;

--
-- Name: higher_education_test_students; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.higher_education_test_students ENABLE ROW LEVEL SECURITY;

--
-- Name: hostel_floors; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.hostel_floors ENABLE ROW LEVEL SECURITY;

--
-- Name: medical_appointment_windows; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.medical_appointment_windows ENABLE ROW LEVEL SECURITY;

--
-- Name: medical_appointments; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.medical_appointments ENABLE ROW LEVEL SECURITY;

--
-- Name: medical_camp_registrations; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.medical_camp_registrations ENABLE ROW LEVEL SECURITY;

--
-- Name: message_conversations; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.message_conversations ENABLE ROW LEVEL SECURITY;

--
-- Name: message_participants; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.message_participants ENABLE ROW LEVEL SECURITY;

--
-- Name: messages; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

--
-- Name: placement_interviews; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.placement_interviews ENABLE ROW LEVEL SECURITY;

--
-- Name: publication_contributors; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.publication_contributors ENABLE ROW LEVEL SECURITY;

--
-- Name: sports_od_hod_approvals; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.sports_od_hod_approvals ENABLE ROW LEVEL SECURITY;

--
-- Name: sports_od_letter_numbers; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.sports_od_letter_numbers ENABLE ROW LEVEL SECURITY;

--
-- Name: student_certifications; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.student_certifications ENABLE ROW LEVEL SECURITY;

--
-- Name: student_id_card_issuances; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.student_id_card_issuances ENABLE ROW LEVEL SECURITY;

--
-- Name: subject_academic_clearance; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.subject_academic_clearance ENABLE ROW LEVEL SECURITY;

--
-- Name: timetable_period_requests; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.timetable_period_requests ENABLE ROW LEVEL SECURITY;

--
-- Name: user_presence; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_presence ENABLE ROW LEVEL SECURITY;

--
-- Name: users; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--

\unrestrict c9ltqaBxWHvR6erOIghHsi9QxuqD9nmRn12r3UQzmb56rbBHvCvpJ4TEsW0XAxB

