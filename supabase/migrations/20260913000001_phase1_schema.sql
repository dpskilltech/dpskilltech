-- =============================================================================
-- DP SKILL TECH ACADEMY — PHASE 1 CORE DATABASE SCHEMA
-- PostgreSQL Architecture for Supabase
-- 29 Tables | Target Scale: 1,000+ Students | UPI Payments | Tamper-Proof Audit
-- Tables: roles, permissions, role_permissions, profiles, user_roles,
--         student_profiles, parent_profiles, parent_students, teacher_profiles,
--         teacher_courses, courses, modules, lessons, batches,
--         recurring_schedules, schedule_overrides, fee_plans, installments,
--         enrollments, course_progress, lesson_completions, payments,
--         demo_bookings, general_inquiries, certificates, certificate_signatures,
--         notifications, audit_logs, file_assets
-- =============================================================================

-- Enable required cryptographic and UUID extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- 1. CUSTOM ENUMS & DOMAIN TYPES
-- -----------------------------------------------------------------------------

DO $$ BEGIN
  CREATE TYPE user_status_type AS ENUM ('ACTIVE', 'SUSPENDED', 'ARCHIVED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE teacher_status_type AS ENUM ('ACTIVE', 'DISABLED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE course_status_type AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE module_status_type AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE batch_status_type AS ENUM ('UPCOMING', 'ACTIVE', 'FULL', 'COMPLETED', 'ARCHIVED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE enrollment_status_type AS ENUM (
    'INQUIRY',
    'CONTACTED',
    'PAYMENT_PENDING',
    'PAYMENT_SUBMITTED',
    'PAYMENT_VERIFIED',
    'ENROLLED',
    'ACTIVE',
    'COMPLETED',
    'REJECTED',
    'CANCELLED',
    'SUSPENDED'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE demo_status_type AS ENUM (
    'NEW',
    'CONTACTED',
    'SCHEDULED',
    'COMPLETED',
    'CONVERTED',
    'NOT_CONVERTED',
    'CLOSED'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE inquiry_status_type AS ENUM (
    'NEW',
    'CONTACTED',
    'FOLLOW_UP',
    'CONVERTED',
    'CLOSED'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE payment_method_type AS ENUM ('UPI');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE payment_verification_status_type AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE fee_plan_type AS ENUM ('FULL', 'EMI');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE certificate_status_type AS ENUM ('DRAFT', 'PENDING_APPROVAL', 'ISSUED', 'REVOKED', 'SUPERSEDED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE notification_channel_type AS ENUM ('IN_APP', 'EMAIL', 'WHATSAPP');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE delivery_status_type AS ENUM ('PENDING', 'SENT', 'FAILED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE storage_access_level_type AS ENUM ('PUBLIC', 'RESTRICTED', 'PRIVATE');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- -----------------------------------------------------------------------------
-- 2. UPDATED_AT TRIGGER FUNCTION
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- -----------------------------------------------------------------------------
-- 3. RBAC & PROFILE FOUNDATION
-- -----------------------------------------------------------------------------

-- Roles table (Supports base system roles + Super Admin custom roles)
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  is_system BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_roles_updated_at
  BEFORE UPDATE ON roles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Permissions catalog
CREATE TABLE IF NOT EXISTS permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  module TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Role Permissions join table
CREATE TABLE IF NOT EXISTS role_permissions (
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

-- User Profiles (Linked 1:1 to auth.users, decoupling auth credentials from academy data)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  avatar_url TEXT,
  status user_status_type NOT NULL DEFAULT 'ACTIVE',
  date_of_birth DATE,
  requires_password_change BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- User Role assignments
CREATE TABLE IF NOT EXISTS user_roles (
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, role_id)
);

-- -----------------------------------------------------------------------------
-- 4. STUDENT, PARENT & TEACHER MODELS
-- -----------------------------------------------------------------------------

-- Student Profiles
CREATE TABLE IF NOT EXISTS student_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  student_id TEXT UNIQUE NOT NULL, -- Stable Academy ID e.g. DPSK-STU-2026-0001
  status user_status_type NOT NULL DEFAULT 'ACTIVE',
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_student_profiles_updated_at
  BEFORE UPDATE ON student_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Parent Profiles (Optional linkage)
CREATE TABLE IF NOT EXISTS parent_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  occupation TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_parent_profiles_updated_at
  BEFORE UPDATE ON parent_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Parent to Student linkage (1 Parent can monitor 1+ Students)
CREATE TABLE IF NOT EXISTS parent_students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_profile_id UUID NOT NULL REFERENCES parent_profiles(id) ON DELETE CASCADE,
  student_profile_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
  relationship_type TEXT NOT NULL DEFAULT 'PARENT',
  is_primary BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (parent_profile_id, student_profile_id)
);

-- Teacher Profiles
CREATE TABLE IF NOT EXISTS teacher_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  bio TEXT,
  expertise TEXT[] NOT NULL DEFAULT '{}',
  status teacher_status_type NOT NULL DEFAULT 'ACTIVE',
  max_interview_slots INT NOT NULL DEFAULT 4,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_teacher_profiles_updated_at
  BEFORE UPDATE ON teacher_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- -----------------------------------------------------------------------------
-- 5. COURSES, MODULES, LESSONS & SEQUENTIAL PROGRESSION
-- -----------------------------------------------------------------------------

-- Courses catalog
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  category TEXT NOT NULL,
  level TEXT NOT NULL DEFAULT 'All Levels',
  duration TEXT NOT NULL,
  short_description TEXT,
  full_description TEXT,
  status course_status_type NOT NULL DEFAULT 'DRAFT',
  thumbnail_url TEXT,
  certificate_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Teacher Assigned Courses
CREATE TABLE IF NOT EXISTS teacher_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_profile_id UUID NOT NULL REFERENCES teacher_profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (teacher_profile_id, course_id)
);

-- Modules (Deterministic sequential ordering)
CREATE TABLE IF NOT EXISTS modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INT NOT NULL,
  status module_status_type NOT NULL DEFAULT 'PUBLISHED',
  prerequisite_module_id UUID REFERENCES modules(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (course_id, order_index)
);

CREATE TRIGGER trg_modules_updated_at
  BEFORE UPDATE ON modules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Lessons (Deterministic order, external video reference, sequential requirements)
CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INT NOT NULL,
  video_asset_ref TEXT, -- Reference to file_assets or external stream ID
  resource_refs JSONB NOT NULL DEFAULT '[]'::JSONB,
  duration_minutes INT NOT NULL DEFAULT 60,
  is_required BOOLEAN NOT NULL DEFAULT TRUE,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  prerequisite_lesson_id UUID REFERENCES lessons(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (module_id, order_index)
);

CREATE TRIGGER trg_lessons_updated_at
  BEFORE UPDATE ON lessons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Safe Student Lessons View (Omits video_asset_ref & resource_refs to protect streaming assets)
CREATE OR REPLACE VIEW student_lessons_view AS
SELECT 
  id,
  module_id,
  title,
  description,
  order_index,
  duration_minutes,
  is_required,
  is_published,
  prerequisite_lesson_id,
  created_at,
  updated_at
FROM lessons
WHERE is_published = TRUE;


-- -----------------------------------------------------------------------------
-- 6. BATCHES, RECURRING CADENCE & SESSION OVERRIDES
-- -----------------------------------------------------------------------------

-- Cohort Batches (Configurable Capacity, Admin Controlled)
CREATE TABLE IF NOT EXISTS batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  name TEXT UNIQUE NOT NULL,
  teacher_profile_id UUID REFERENCES teacher_profiles(id) ON DELETE SET NULL,
  max_capacity INT DEFAULT NULL, -- Configurable by Admin; NULL indicates unlimited
  student_count INT NOT NULL DEFAULT 0,
  status batch_status_type NOT NULL DEFAULT 'UPCOMING',
  schedule_description TEXT NOT NULL DEFAULT 'Mon - Sat | 07:00 PM IST',
  start_date DATE,
  meeting_platform TEXT NOT NULL DEFAULT 'Zoom',
  meeting_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_batches_updated_at
  BEFORE UPDATE ON batches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Recurring Class Schedules (1 = Monday ... 6 = Saturday; Sunday is holiday)
CREATE TABLE IF NOT EXISTS recurring_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
  day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 1 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  timezone TEXT NOT NULL DEFAULT 'Asia/Kolkata',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_recurring_schedules_updated_at
  BEFORE UPDATE ON recurring_schedules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Schedule Overrides (Single session rescheduling or holiday cancellations)
CREATE TABLE IF NOT EXISTS schedule_overrides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
  original_date DATE NOT NULL,
  override_date DATE,
  start_time TIME,
  end_time TIME,
  is_cancelled BOOLEAN NOT NULL DEFAULT FALSE,
  meeting_url TEXT,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_schedule_overrides_updated_at
  BEFORE UPDATE ON schedule_overrides
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- -----------------------------------------------------------------------------
-- 7. ENROLLMENTS & FEE PLANS (UPI ONLY / EMI ARCHITECTURE)
-- -----------------------------------------------------------------------------

-- Fee Plans (Full Payment vs Configurable Installments)
CREATE TABLE IF NOT EXISTS fee_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  plan_type fee_plan_type NOT NULL DEFAULT 'FULL',
  total_amount INT NOT NULL, -- In Indian Rupees
  installment_count INT NOT NULL DEFAULT 1,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_fee_plans_updated_at
  BEFORE UPDATE ON fee_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Installment Schedules
CREATE TABLE IF NOT EXISTS installments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fee_plan_id UUID NOT NULL REFERENCES fee_plans(id) ON DELETE CASCADE,
  installment_number INT NOT NULL,
  amount INT NOT NULL,
  due_days_after_enrollment INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (fee_plan_id, installment_number)
);

-- Enrollments
CREATE TABLE IF NOT EXISTS enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_code TEXT UNIQUE NOT NULL, -- e.g. DPSK-ENR-2026-0001
  student_profile_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE RESTRICT,
  batch_id UUID REFERENCES batches(id) ON DELETE SET NULL,
  status enrollment_status_type NOT NULL DEFAULT 'INQUIRY',
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_enrollments_updated_at
  BEFORE UPDATE ON enrollments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Course Progress (Foundation for Sequential Progression Engine)
-- enrollment_id is the SOLE source of truth for student/course relationship.
-- student_id and course_id are NOT stored here to avoid inconsistent redundant FKs.
-- Resolve student identity and course via: enrollment_id -> enrollments -> student_profiles / courses
CREATE TABLE IF NOT EXISTS course_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID UNIQUE NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
  completed_lessons_count INT NOT NULL DEFAULT 0,
  completion_percentage NUMERIC(5,2) NOT NULL DEFAULT 0.00,
  current_lesson_id UUID REFERENCES lessons(id) ON DELETE SET NULL,
  last_accessed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_course_progress_updated_at
  BEFORE UPDATE ON course_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Lesson Completions (Immutable record of individual lesson completions)
-- enrollment_id is the SOLE FK — student identity is resolved via enrollment.
-- No redundant student_profile_id to avoid FK inconsistency.
CREATE TABLE IF NOT EXISTS lesson_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  time_spent_seconds INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (enrollment_id, lesson_id)
);

-- UPI Payments (Manual verification with UTR and Screenshot Reference)
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_code TEXT UNIQUE NOT NULL, -- e.g. DPSK-PAY-2026-0001
  student_profile_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
  enrollment_id UUID NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
  fee_plan_id UUID REFERENCES fee_plans(id) ON DELETE SET NULL,
  installment_id UUID REFERENCES installments(id) ON DELETE SET NULL,
  amount INT NOT NULL,
  payment_method payment_method_type NOT NULL DEFAULT 'UPI',
  utr_number TEXT,
  screenshot_ref TEXT,
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  verification_status payment_verification_status_type NOT NULL DEFAULT 'PENDING',
  verified_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  verified_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- -----------------------------------------------------------------------------
-- 8. DEMO BOOKINGS & GENERAL INQUIRIES
-- -----------------------------------------------------------------------------

-- Course-Specific Demo Bookings
CREATE TABLE IF NOT EXISTS demo_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  parent_name TEXT,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  preferred_date DATE,
  preferred_time TEXT,
  message TEXT,
  status demo_status_type NOT NULL DEFAULT 'NEW',
  assigned_teacher_id UUID REFERENCES teacher_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_demo_bookings_updated_at
  BEFORE UPDATE ON demo_bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- General Inquiries (Distinct from Enrollments)
CREATE TABLE IF NOT EXISTS general_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT NOT NULL,
  interested_course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  subject TEXT NOT NULL DEFAULT 'General Course Inquiry',
  message TEXT NOT NULL,
  status inquiry_status_type NOT NULL DEFAULT 'NEW',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_general_inquiries_updated_at
  BEFORE UPDATE ON general_inquiries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- -----------------------------------------------------------------------------
-- 9. CERTIFICATES & CREDENTIALS
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_code TEXT UNIQUE NOT NULL, -- e.g. DPSK-2026-000123
  student_profile_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
  enrollment_id UUID NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE RESTRICT,
  version INT NOT NULL DEFAULT 1,
  previous_certificate_id UUID REFERENCES certificates(id) ON DELETE SET NULL,
  is_latest BOOLEAN NOT NULL DEFAULT TRUE,
  superseded_by UUID REFERENCES certificates(id) ON DELETE SET NULL,
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  final_score NUMERIC(5,2), -- Configurable/Optional per course
  honors_grade TEXT,
  status certificate_status_type NOT NULL DEFAULT 'DRAFT',
  verification_url TEXT NOT NULL,
  qr_reference TEXT,
  signature_config JSONB NOT NULL DEFAULT '[]'::JSONB,
  approved_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  approved_at TIMESTAMPTZ,
  revoked_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  revoked_at TIMESTAMPTZ,
  revocation_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_certificates_updated_at
  BEFORE UPDATE ON certificates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- -----------------------------------------------------------------------------
-- 9a. FILE ASSETS (Storage Abstraction for Cloudflare R2 / Stream)
-- Created before certificate_signatures to satisfy foreign key constraint
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS file_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL DEFAULT 'CLOUDFLARE_R2', -- 'CLOUDFLARE_R2', 'CLOUDFLARE_STREAM', 'EXTERNAL', 'SUPABASE'
  provider_asset_id TEXT,
  asset_type TEXT NOT NULL DEFAULT 'DOCUMENT', -- 'DOCUMENT', 'IMAGE', 'VIDEO', 'ARCHIVE'
  file_type TEXT NOT NULL,
  file_size_bytes BIGINT NOT NULL DEFAULT 0,
  storage_path TEXT NOT NULL,
  public_url TEXT,
  playback_id TEXT, -- Cloudflare Stream playback ID for video assets
  stream_url TEXT,  -- HLS/DASH manifest or signed streaming URL
  owner_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  access_level storage_access_level_type NOT NULL DEFAULT 'PRIVATE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_file_assets_updated_at
  BEFORE UPDATE ON file_assets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- -----------------------------------------------------------------------------
-- 9b. CERTIFICATE SIGNATURES (29th Table)
-- Multi-signature credential authorizations (Director, Lead Instructor, etc.)
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS certificate_signatures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_id UUID NOT NULL REFERENCES certificates(id) ON DELETE CASCADE,
  signer_name TEXT NOT NULL,
  signer_title TEXT NOT NULL,
  signature_asset_id UUID REFERENCES file_assets(id) ON DELETE SET NULL,
  display_order INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (certificate_id, display_order)
);

-- -----------------------------------------------------------------------------
-- 10. NOTIFICATIONS, AUDIT LOGS & STORAGE ABSTRACTION
-- -----------------------------------------------------------------------------

-- Notifications system
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  channel notification_channel_type NOT NULL DEFAULT 'IN_APP',
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  related_entity_type TEXT,
  related_entity_id UUID,
  delivery_status delivery_status_type NOT NULL DEFAULT 'SENT',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Immutable Audit Log
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  previous_value JSONB,
  new_value JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);



-- -----------------------------------------------------------------------------
-- 11. INDEXES FOR PERFORMANCE (Target Scale: 1,000+ Students)
-- -----------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles(status);
CREATE INDEX IF NOT EXISTS idx_user_roles_user ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role_id);
CREATE INDEX IF NOT EXISTS idx_student_profiles_student_id ON student_profiles(student_id);
CREATE INDEX IF NOT EXISTS idx_parent_students_parent ON parent_students(parent_profile_id);
CREATE INDEX IF NOT EXISTS idx_parent_students_student ON parent_students(student_profile_id);
CREATE INDEX IF NOT EXISTS idx_courses_slug ON courses(slug);
CREATE INDEX IF NOT EXISTS idx_courses_status ON courses(status);
CREATE INDEX IF NOT EXISTS idx_modules_course ON modules(course_id, order_index);
CREATE INDEX IF NOT EXISTS idx_lessons_module ON lessons(module_id, order_index);
CREATE INDEX IF NOT EXISTS idx_batches_course ON batches(course_id);
CREATE INDEX IF NOT EXISTS idx_batches_status ON batches(status);
CREATE INDEX IF NOT EXISTS idx_recurring_schedules_batch ON recurring_schedules(batch_id, day_of_week);
CREATE INDEX IF NOT EXISTS idx_schedule_overrides_batch_date ON schedule_overrides(batch_id, original_date);
CREATE INDEX IF NOT EXISTS idx_enrollments_student ON enrollments(student_profile_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_batch ON enrollments(batch_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_code ON enrollments(enrollment_code);
CREATE INDEX IF NOT EXISTS idx_course_progress_enrollment ON course_progress(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_lesson_completions_enrollment_lesson ON lesson_completions(enrollment_id, lesson_id);
CREATE INDEX IF NOT EXISTS idx_certificate_signatures_cert ON certificate_signatures(certificate_id);
CREATE INDEX IF NOT EXISTS idx_payments_enrollment ON payments(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_payments_utr ON payments(utr_number);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(verification_status);
CREATE INDEX IF NOT EXISTS idx_demo_bookings_course ON demo_bookings(course_id);
CREATE INDEX IF NOT EXISTS idx_demo_bookings_status ON demo_bookings(status);
CREATE INDEX IF NOT EXISTS idx_general_inquiries_status ON general_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_certificates_code ON certificates(certificate_code);
CREATE INDEX IF NOT EXISTS idx_certificates_student ON certificates(student_profile_id);
CREATE INDEX IF NOT EXISTS idx_certificates_is_latest ON certificates(is_latest);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient_user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON audit_logs(actor_user_id);
CREATE INDEX IF NOT EXISTS idx_file_assets_owner ON file_assets(owner_user_id);
