-- =============================================================================
-- DP SKILL TECH ACADEMY — PHASE 1 COMPLETE ALL-IN-ONE SETUP
-- 29 Tables, RLS, Audit Triggers & System Roles
-- =============================================================================



-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
-- FILE: 20260913000001_phase1_schema.sql
-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

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


-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
-- FILE: 20260913000002_phase1_rbac_rls.sql
-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

-- =============================================================================
-- DP SKILL TECH ACADEMY — PHASE 1 RBAC & ROW LEVEL SECURITY (RLS)
-- 29 Tables | Multi-Tenant Role Isolation | Immutable Audit Logs
-- Supabase Auth as Sole Authority | Service-Role Key Server-Side Only
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. SECURITY HELPER FUNCTIONS
-- -----------------------------------------------------------------------------

-- Extract current authenticated user id
CREATE OR REPLACE FUNCTION auth_user_id()
RETURNS UUID AS $$
  SELECT auth.uid();
$$ LANGUAGE sql STABLE;

-- Check if current user is Super Admin
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid()
      AND r.name = 'SUPER_ADMIN'
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Check if current user is Admin (or Super Admin)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid()
      AND r.name IN ('SUPER_ADMIN', 'ADMIN')
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Check if current user is Teacher
CREATE OR REPLACE FUNCTION is_teacher()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid()
      AND r.name = 'TEACHER'
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Check if current user is Student
CREATE OR REPLACE FUNCTION is_student()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid()
      AND r.name = 'STUDENT'
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Check if current user is Parent
CREATE OR REPLACE FUNCTION is_parent()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid()
      AND r.name = 'PARENT'
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Check granular permission
CREATE OR REPLACE FUNCTION has_permission(p_perm_code TEXT)
RETURNS BOOLEAN AS $$
  SELECT is_super_admin() OR EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON ur.role_id = rp.role_id
    JOIN permissions p ON rp.permission_id = p.id
    WHERE ur.user_id = auth.uid()
      AND p.code = p_perm_code
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Check if parent is linked to student
CREATE OR REPLACE FUNCTION is_linked_parent(p_student_profile_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM parent_students ps
    JOIN parent_profiles pp ON ps.parent_profile_id = pp.id
    WHERE pp.profile_id = auth.uid()
      AND ps.student_profile_id = p_student_profile_id
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Check if teacher is assigned to student's batch
CREATE OR REPLACE FUNCTION is_teacher_for_student(p_student_profile_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM enrollments e
    JOIN batches b ON e.batch_id = b.id
    JOIN teacher_profiles tp ON b.teacher_profile_id = tp.id
    WHERE tp.profile_id = auth.uid()
      AND e.student_profile_id = p_student_profile_id
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- -----------------------------------------------------------------------------
-- 2. ENABLE ROW LEVEL SECURITY ACROSS ALL ACADEMY TABLES
-- -----------------------------------------------------------------------------

ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE installments ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE general_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificate_signatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_assets ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- 3. RLS POLICIES: ROLES & PERMISSIONS
-- -----------------------------------------------------------------------------

CREATE POLICY "Roles viewable by authenticated users"
  ON roles FOR SELECT TO authenticated USING (TRUE);

CREATE POLICY "Roles manageable by super admins only"
  ON roles FOR ALL TO authenticated USING (is_super_admin());

CREATE POLICY "Permissions viewable by authenticated users"
  ON permissions FOR SELECT TO authenticated USING (TRUE);

CREATE POLICY "Permissions manageable by super admins only"
  ON permissions FOR ALL TO authenticated USING (is_super_admin());

CREATE POLICY "Role permissions viewable by authenticated users"
  ON role_permissions FOR SELECT TO authenticated USING (TRUE);

CREATE POLICY "Role permissions manageable by super admins only"
  ON role_permissions FOR ALL TO authenticated USING (is_super_admin());

CREATE POLICY "User roles viewable by self or admins"
  ON user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR is_admin());

CREATE POLICY "User roles manageable by admins"
  ON user_roles FOR ALL TO authenticated USING (is_admin());

-- -----------------------------------------------------------------------------
-- 4. RLS POLICIES: PROFILES
-- -----------------------------------------------------------------------------

-- IMPORTANT: requires_password_change can only be set by the trusted Express API
-- (service-role key). Students cannot self-modify this flag via Supabase JS SDK.
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR is_admin());

CREATE POLICY "Users can update own basic profile (non-sensitive fields)"
  ON profiles FOR UPDATE TO authenticated
  USING (id = auth.uid() OR is_admin())
  WITH CHECK (
    -- Admins can update anything
    is_admin()
    OR (
      -- Students/teachers/parents can update own row BUT
      -- requires_password_change must remain unchanged (only API can clear it)
      id = auth.uid()
      AND requires_password_change = (SELECT requires_password_change FROM profiles WHERE id = auth.uid())
    )
  );

CREATE POLICY "Admins can insert profiles"
  ON profiles FOR INSERT TO authenticated
  WITH CHECK (is_admin() OR id = auth.uid());

CREATE POLICY "Admins can delete/archive profiles"
  ON profiles FOR DELETE TO authenticated
  USING (is_super_admin());

-- -----------------------------------------------------------------------------
-- 5. RLS POLICIES: STUDENTS, PARENTS & TEACHERS
-- -----------------------------------------------------------------------------

-- Student Profiles: Student sees own, Parent sees linked, Teacher sees assigned, Admin sees all
CREATE POLICY "Student profiles select policy"
  ON student_profiles FOR SELECT TO authenticated
  USING (
    profile_id = auth.uid()
    OR is_linked_parent(id)
    OR is_teacher_for_student(id)
    OR is_admin()
  );

CREATE POLICY "Student profiles admin manage"
  ON student_profiles FOR ALL TO authenticated
  USING (is_admin());

-- Parent Profiles
CREATE POLICY "Parents view own profile"
  ON parent_profiles FOR SELECT TO authenticated
  USING (profile_id = auth.uid() OR is_admin());

CREATE POLICY "Parent profiles admin manage"
  ON parent_profiles FOR ALL TO authenticated
  USING (is_admin());

-- Parent Students Link
CREATE POLICY "Parent student links select"
  ON parent_students FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM parent_profiles pp WHERE pp.id = parent_profile_id AND pp.profile_id = auth.uid())
    OR is_admin()
  );

CREATE POLICY "Parent student links admin manage"
  ON parent_students FOR ALL TO authenticated
  USING (is_admin());

-- Teacher Profiles: Active teachers visible publicly, manage by self or admin
CREATE POLICY "Teacher profiles select public"
  ON teacher_profiles FOR SELECT
  USING (status = 'ACTIVE' OR is_admin() OR profile_id = auth.uid());

CREATE POLICY "Teacher profiles update self or admin"
  ON teacher_profiles FOR UPDATE TO authenticated
  USING (profile_id = auth.uid() OR is_admin());

CREATE POLICY "Teacher profiles admin manage"
  ON teacher_profiles FOR ALL TO authenticated
  USING (is_admin());

-- -----------------------------------------------------------------------------
-- 6. RLS POLICIES: COURSES, MODULES & LESSONS
-- -----------------------------------------------------------------------------

-- Courses: Published visible to all; Draft visible to assigned teacher or admin
CREATE POLICY "Courses select policy"
  ON courses FOR SELECT
  USING (
    status = 'PUBLISHED'
    OR is_admin()
    OR EXISTS (
      SELECT 1 FROM teacher_courses tc
      JOIN teacher_profiles tp ON tc.teacher_profile_id = tp.id
      WHERE tp.profile_id = auth.uid() AND tc.course_id = courses.id
    )
  );

CREATE POLICY "Courses admin manage"
  ON courses FOR ALL TO authenticated
  USING (is_admin());

-- Teacher Courses
CREATE POLICY "Teacher courses select"
  ON teacher_courses FOR SELECT TO authenticated
  USING (
    is_admin()
    OR EXISTS (
      SELECT 1 FROM teacher_profiles tp
      WHERE tp.id = teacher_profile_id AND tp.profile_id = auth.uid()
    )
  );

CREATE POLICY "Teacher courses admin manage"
  ON teacher_courses FOR ALL TO authenticated
  USING (is_admin());

-- Modules: Published course modules visible to public
CREATE POLICY "Modules select policy"
  ON modules FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM courses c WHERE c.id = course_id AND c.status = 'PUBLISHED')
    OR is_admin()
  );

CREATE POLICY "Modules admin manage"
  ON modules FOR ALL TO authenticated
  USING (is_admin());

-- Lessons: Base table SELECT restricted to Admin and assigned Teachers only.
-- (Students query student_lessons_view which strictly omits video_asset_ref and resource_refs)
CREATE POLICY "Lessons select policy"
  ON lessons FOR SELECT TO authenticated
  USING (
    is_admin()
    OR EXISTS (
      SELECT 1 FROM modules m
      JOIN courses c ON m.course_id = c.id
      JOIN teacher_courses tc ON tc.course_id = c.id
      JOIN teacher_profiles tp ON tc.teacher_profile_id = tp.id
      WHERE m.id = lessons.module_id AND tp.profile_id = auth.uid()
    )
  );

CREATE POLICY "Lessons admin manage"
  ON lessons FOR ALL TO authenticated
  USING (is_admin());

-- Student Lessons View Permissions (Safe projection for enrolled/public metadata)
GRANT SELECT ON student_lessons_view TO authenticated, anon;


-- -----------------------------------------------------------------------------
-- 7. RLS POLICIES: BATCHES & SCHEDULES
-- -----------------------------------------------------------------------------

CREATE POLICY "Batches select policy"
  ON batches FOR SELECT TO authenticated
  USING (
    is_admin()
    OR EXISTS (
      SELECT 1 FROM enrollments e
      JOIN student_profiles sp ON e.student_profile_id = sp.id
      WHERE e.batch_id = batches.id AND sp.profile_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM teacher_profiles tp
      WHERE tp.id = batches.teacher_profile_id AND tp.profile_id = auth.uid()
    )
  );

CREATE POLICY "Batches admin manage"
  ON batches FOR ALL TO authenticated
  USING (is_admin());

CREATE POLICY "Recurring schedules select"
  ON recurring_schedules FOR SELECT TO authenticated
  USING (
    is_admin()
    OR EXISTS (
      SELECT 1 FROM batches b
      JOIN enrollments e ON e.batch_id = b.id
      JOIN student_profiles sp ON e.student_profile_id = sp.id
      WHERE b.id = recurring_schedules.batch_id AND sp.profile_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM batches b
      JOIN teacher_profiles tp ON b.teacher_profile_id = tp.id
      WHERE b.id = recurring_schedules.batch_id AND tp.profile_id = auth.uid()
    )
  );

CREATE POLICY "Recurring schedules admin manage"
  ON recurring_schedules FOR ALL TO authenticated
  USING (is_admin());

CREATE POLICY "Schedule overrides select"
  ON schedule_overrides FOR SELECT TO authenticated
  USING (
    is_admin()
    OR EXISTS (
      SELECT 1 FROM batches b
      JOIN enrollments e ON e.batch_id = b.id
      JOIN student_profiles sp ON e.student_profile_id = sp.id
      WHERE b.id = schedule_overrides.batch_id AND sp.profile_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM batches b
      JOIN teacher_profiles tp ON b.teacher_profile_id = tp.id
      WHERE b.id = schedule_overrides.batch_id AND tp.profile_id = auth.uid()
    )
  );

CREATE POLICY "Schedule overrides admin manage"
  ON schedule_overrides FOR ALL TO authenticated
  USING (is_admin());

-- -----------------------------------------------------------------------------
-- 8. RLS POLICIES: ENROLLMENTS & UPI PAYMENTS
-- -----------------------------------------------------------------------------

CREATE POLICY "Fee plans select"
  ON fee_plans FOR SELECT
  USING (is_active = TRUE OR is_admin());

CREATE POLICY "Fee plans admin manage"
  ON fee_plans FOR ALL TO authenticated
  USING (is_admin());

CREATE POLICY "Installments select"
  ON installments FOR SELECT
  USING (TRUE);

CREATE POLICY "Installments admin manage"
  ON installments FOR ALL TO authenticated
  USING (is_admin());

-- Enrollments: Student views own, Parent views linked student, Admin manages
CREATE POLICY "Enrollments select policy"
  ON enrollments FOR SELECT TO authenticated
  USING (
    is_admin()
    OR EXISTS (
      SELECT 1 FROM student_profiles sp
      WHERE sp.id = enrollments.student_profile_id AND sp.profile_id = auth.uid()
    )
    OR is_linked_parent(enrollments.student_profile_id)
    OR EXISTS (
      SELECT 1 FROM batches b
      JOIN teacher_profiles tp ON b.teacher_profile_id = tp.id
      WHERE b.id = enrollments.batch_id AND tp.profile_id = auth.uid()
    )
  );

CREATE POLICY "Enrollments admin manage"
  ON enrollments FOR ALL TO authenticated
  USING (is_admin());

-- Course Progress: Student views own (via enrollment), Parent views linked student, Teacher views cohort, Admin manages
-- NOTE: course_progress no longer has student_profile_id column.
-- Student identity is resolved via: enrollment_id -> enrollments -> student_profiles
CREATE POLICY "Course progress select"
  ON course_progress FOR SELECT TO authenticated
  USING (
    is_admin()
    OR EXISTS (
      SELECT 1 FROM enrollments e
      JOIN student_profiles sp ON e.student_profile_id = sp.id
      WHERE e.id = course_progress.enrollment_id
        AND sp.profile_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM enrollments e
      WHERE e.id = course_progress.enrollment_id
        AND is_linked_parent(e.student_profile_id)
    )
    OR EXISTS (
      SELECT 1 FROM enrollments e
      WHERE e.id = course_progress.enrollment_id
        AND is_teacher_for_student(e.student_profile_id)
    )
  );

CREATE POLICY "Course progress student upsert"
  ON course_progress FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM enrollments e
      JOIN student_profiles sp ON e.student_profile_id = sp.id
      WHERE e.id = course_progress.enrollment_id
        AND sp.profile_id = auth.uid()
    )
  );

CREATE POLICY "Course progress admin manage"
  ON course_progress FOR ALL TO authenticated
  USING (is_admin());

-- Lesson Completions: Student views own (via enrollment), Parent views linked student, Teacher views cohort, Admin manages
-- NOTE: lesson_completions no longer has student_profile_id column.
-- Student identity is resolved via: enrollment_id -> enrollments -> student_profiles
CREATE POLICY "Lesson completions select"
  ON lesson_completions FOR SELECT TO authenticated
  USING (
    is_admin()
    OR EXISTS (
      SELECT 1 FROM enrollments e
      JOIN student_profiles sp ON e.student_profile_id = sp.id
      WHERE e.id = lesson_completions.enrollment_id
        AND sp.profile_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM enrollments e
      WHERE e.id = lesson_completions.enrollment_id
        AND is_linked_parent(e.student_profile_id)
    )
    OR EXISTS (
      SELECT 1 FROM enrollments e
      WHERE e.id = lesson_completions.enrollment_id
        AND is_teacher_for_student(e.student_profile_id)
    )
  );

CREATE POLICY "Lesson completions student insert"
  ON lesson_completions FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM enrollments e
      JOIN student_profiles sp ON e.student_profile_id = sp.id
      WHERE e.id = lesson_completions.enrollment_id
        AND sp.profile_id = auth.uid()
        AND e.status IN ('ACTIVE', 'ENROLLED')
    )
  );

CREATE POLICY "Lesson completions admin manage"
  ON lesson_completions FOR ALL TO authenticated
  USING (is_admin());

-- Payments: Student can view own and insert 'PENDING' payment; Only Admin can verify/reject
CREATE POLICY "Payments select policy"
  ON payments FOR SELECT TO authenticated
  USING (
    is_admin()
    OR EXISTS (
      SELECT 1 FROM student_profiles sp
      WHERE sp.id = payments.student_profile_id AND sp.profile_id = auth.uid()
    )
    OR is_linked_parent(payments.student_profile_id)
  );

CREATE POLICY "Payments student insert"
  ON payments FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM student_profiles sp
      WHERE sp.id = student_profile_id AND sp.profile_id = auth.uid()
    )
    AND verification_status = 'PENDING'
  );

CREATE POLICY "Payments admin manage"
  ON payments FOR ALL TO authenticated
  USING (is_admin());

-- -----------------------------------------------------------------------------
-- 9. RLS POLICIES: DEMO BOOKINGS & GENERAL INQUIRIES
-- -----------------------------------------------------------------------------

-- Public can submit demo bookings; Assigned teacher and Admin can view
CREATE POLICY "Demo bookings public insert"
  ON demo_bookings FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Demo bookings select policy"
  ON demo_bookings FOR SELECT TO authenticated
  USING (
    is_admin()
    OR EXISTS (
      SELECT 1 FROM teacher_profiles tp
      WHERE tp.id = demo_bookings.assigned_teacher_id AND tp.profile_id = auth.uid()
    )
  );

CREATE POLICY "Demo bookings admin manage"
  ON demo_bookings FOR ALL TO authenticated
  USING (is_admin());

-- Public can submit inquiries; Only admin can read and update
CREATE POLICY "General inquiries public insert"
  ON general_inquiries FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "General inquiries admin manage"
  ON general_inquiries FOR ALL TO authenticated
  USING (is_admin());

-- -----------------------------------------------------------------------------
-- 10. RLS POLICIES: CERTIFICATES & PUBLIC VERIFICATION
-- -----------------------------------------------------------------------------

-- Issued certificates are public for employer/university verification
CREATE POLICY "Certificates public verification"
  ON certificates FOR SELECT
  USING (
    status = 'ISSUED'
    OR is_admin()
    OR EXISTS (
      SELECT 1 FROM student_profiles sp
      WHERE sp.id = certificates.student_profile_id AND sp.profile_id = auth.uid()
    )
    OR is_linked_parent(certificates.student_profile_id)
  );

CREATE POLICY "Certificates admin manage"
  ON certificates FOR ALL TO authenticated
  USING (is_admin());

-- Certificate Signatures: Readable alongside certificates
-- Issued certificate signatures are public (for verification); admin manages all
CREATE POLICY "Certificate signatures public read"
  ON certificate_signatures FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM certificates c
      WHERE c.id = certificate_signatures.certificate_id
        AND (
          c.status = 'ISSUED'
          OR is_admin()
          OR EXISTS (
            SELECT 1 FROM student_profiles sp
            WHERE sp.id = c.student_profile_id AND sp.profile_id = auth.uid()
          )
        )
    )
  );

CREATE POLICY "Certificate signatures admin manage"
  ON certificate_signatures FOR ALL TO authenticated
  USING (is_admin());

-- -----------------------------------------------------------------------------
-- 11. RLS POLICIES: NOTIFICATIONS, AUDIT LOGS & STORAGE
-- -----------------------------------------------------------------------------

CREATE POLICY "Notifications select own"
  ON notifications FOR SELECT TO authenticated
  USING (recipient_user_id = auth.uid() OR is_admin());

CREATE POLICY "Notifications update own read status"
  ON notifications FOR UPDATE TO authenticated
  USING (recipient_user_id = auth.uid() OR is_admin())
  WITH CHECK (recipient_user_id = auth.uid() OR is_admin());

CREATE POLICY "Notifications admin insert"
  ON notifications FOR INSERT TO authenticated
  WITH CHECK (is_admin());

-- Audit Logs: Viewable only by authorized Admins / Super Admins. NEVER UPDATABLE OR DELETABLE.
-- CRITICAL SECURITY: Normal clients (including authenticated users via Supabase JS SDK)
-- CANNOT insert audit events. INSERT is performed exclusively via:
--   1. Express API using SERVICE_ROLE_KEY (bypasses RLS)
--   2. SECURITY DEFINER trigger functions (database-level)
-- No client-facing INSERT policy is intentionally created here.
CREATE POLICY "Audit logs select authorized"
  ON audit_logs FOR SELECT TO authenticated
  USING (is_super_admin() OR has_permission('audit.view'));

-- Explicitly NO INSERT policy for normal clients.
-- Explicitly NO UPDATE policy on audit_logs.
-- Explicitly NO DELETE policy on audit_logs.
-- These omissions are intentional to guarantee tamper-resistance.

-- File Assets: Public assets viewable by all; Private assets viewable by owner or admin
CREATE POLICY "File assets select"
  ON file_assets FOR SELECT
  USING (
    access_level = 'PUBLIC'
    OR is_admin()
    OR owner_user_id = auth.uid()
  );

CREATE POLICY "File assets manage"
  ON file_assets FOR ALL TO authenticated
  USING (is_admin() OR owner_user_id = auth.uid());


-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
-- FILE: 20260913000003_phase1_audit_triggers.sql
-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

-- =============================================================================
-- DP SKILL TECH ACADEMY — PHASE 1 AUDIT TRIGGERS
-- SECURITY DEFINER Functions for Immutable Audit Trail
-- These triggers log critical data mutations at the DB level regardless of
-- which application path triggered the change.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. CORE AUDIT LOG WRITER (SECURITY DEFINER)
-- Called by all audit triggers below. Runs with elevated privileges so it can
-- INSERT into audit_logs even when no client INSERT RLS policy exists.
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION write_audit_log(
  p_actor_user_id UUID,
  p_action TEXT,
  p_entity_type TEXT,
  p_entity_id TEXT,
  p_previous_value JSONB,
  p_new_value JSONB
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO audit_logs (
    actor_user_id,
    action,
    entity_type,
    entity_id,
    previous_value,
    new_value,
    created_at
  ) VALUES (
    p_actor_user_id,
    p_action,
    p_entity_type,
    p_entity_id,
    p_previous_value,
    p_new_value,
    NOW()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Revoke direct EXECUTE from public so only the trigger mechanism calls it
REVOKE EXECUTE ON FUNCTION write_audit_log(UUID, TEXT, TEXT, TEXT, JSONB, JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION write_audit_log(UUID, TEXT, TEXT, TEXT, JSONB, JSONB) TO service_role;

-- -----------------------------------------------------------------------------
-- 2. PROFILES STATUS CHANGE TRIGGER
-- Logs when a user's account status changes (ACTIVE → SUSPENDED, etc.)
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION audit_profiles_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    PERFORM write_audit_log(
      auth.uid(),
      'PROFILE_STATUS_CHANGED',
      'profiles',
      NEW.id::TEXT,
      jsonb_build_object('status', OLD.status),
      jsonb_build_object('status', NEW.status)
    );
  END IF;

  IF NEW.requires_password_change IS DISTINCT FROM OLD.requires_password_change THEN
    PERFORM write_audit_log(
      auth.uid(),
      'PASSWORD_CHANGE_FLAG_UPDATED',
      'profiles',
      NEW.id::TEXT,
      jsonb_build_object('requires_password_change', OLD.requires_password_change),
      jsonb_build_object('requires_password_change', NEW.requires_password_change)
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_audit_profiles_status
  AFTER UPDATE OF status, requires_password_change ON profiles
  FOR EACH ROW EXECUTE FUNCTION audit_profiles_status_change();

-- -----------------------------------------------------------------------------
-- 3. ENROLLMENT STATUS TRANSITION TRIGGER
-- Logs every enrollment status transition (INQUIRY → CONTACTED → ... → COMPLETED)
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION audit_enrollment_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    PERFORM write_audit_log(
      auth.uid(),
      'ENROLLMENT_STATUS_CHANGED',
      'enrollments',
      NEW.id::TEXT,
      jsonb_build_object(
        'status', OLD.status,
        'enrollment_code', OLD.enrollment_code
      ),
      jsonb_build_object(
        'status', NEW.status,
        'enrollment_code', NEW.enrollment_code
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_audit_enrollment_status
  AFTER UPDATE OF status ON enrollments
  FOR EACH ROW EXECUTE FUNCTION audit_enrollment_status_change();

-- -----------------------------------------------------------------------------
-- 4. CERTIFICATE STATUS CHANGE TRIGGER
-- Logs certificate issuance, revocation, and supersession events
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION audit_certificate_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    PERFORM write_audit_log(
      auth.uid(),
      'CERTIFICATE_STATUS_CHANGED',
      'certificates',
      NEW.id::TEXT,
      jsonb_build_object(
        'status', OLD.status,
        'certificate_code', OLD.certificate_code,
        'version', OLD.version
      ),
      jsonb_build_object(
        'status', NEW.status,
        'certificate_code', NEW.certificate_code,
        'version', NEW.version,
        'is_latest', NEW.is_latest
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_audit_certificate_status
  AFTER UPDATE OF status ON certificates
  FOR EACH ROW EXECUTE FUNCTION audit_certificate_status_change();

-- -----------------------------------------------------------------------------
-- 5. PAYMENT VERIFICATION TRIGGER
-- Logs payment status changes (PENDING → VERIFIED / REJECTED)
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION audit_payment_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.verification_status IS DISTINCT FROM OLD.verification_status THEN
    PERFORM write_audit_log(
      auth.uid(),
      'PAYMENT_STATUS_CHANGED',
      'payments',
      NEW.id::TEXT,
      jsonb_build_object(
        'verification_status', OLD.verification_status,
        'payment_code', OLD.payment_code
      ),
      jsonb_build_object(
        'verification_status', NEW.verification_status,
        'payment_code', NEW.payment_code,
        'verified_by', NEW.verified_by
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_audit_payment_status
  AFTER UPDATE OF verification_status ON payments
  FOR EACH ROW EXECUTE FUNCTION audit_payment_status_change();


-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
-- FILE: 20260913000004_phase1_dev_seed.sql
-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

-- =============================================================================
-- DP SKILL TECH ACADEMY — PHASE 1 DEVELOPMENT SEED DATA
-- IMPORTANT: This file seeds ONLY system reference data.
-- Zero fake students, fake payments, fake reviews, fake certificates.
-- All dev user accounts are created via Supabase Auth Admin API, not here.
-- This migration is safe to run in development environments only.
-- In production, system roles and permissions are seeded via this migration,
-- but no personal data, demo users, or fake records are inserted.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. SYSTEM ROLES (5 Base Roles — Required for RBAC to function)
-- -----------------------------------------------------------------------------

INSERT INTO roles (id, name, description, is_system, created_at, updated_at) VALUES
  (gen_random_uuid(), 'SUPER_ADMIN', 'Full system access. Manages roles, permissions, and system configuration. Requires MFA.', TRUE, NOW(), NOW()),
  (gen_random_uuid(), 'ADMIN',       'Operational management of students, courses, batches, finances, and certificates.', TRUE, NOW(), NOW()),
  (gen_random_uuid(), 'TEACHER',     'View and manage assigned courses, batches, and students. Scoped to assignments only.', TRUE, NOW(), NOW()),
  (gen_random_uuid(), 'STUDENT',     'Access own learning content, progress, payments, and certificates.', TRUE, NOW(), NOW()),
  (gen_random_uuid(), 'PARENT',      'Read-only view of linked student progress and notifications.', TRUE, NOW(), NOW())
ON CONFLICT (name) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 2. GRANULAR PERMISSIONS (24 Codes)
-- -----------------------------------------------------------------------------

INSERT INTO permissions (id, code, description, module, created_at) VALUES
  -- Student Management
  (gen_random_uuid(), 'student.view',        'View student profiles and details',        'students', NOW()),
  (gen_random_uuid(), 'student.create',      'Create new student accounts',               'students', NOW()),
  (gen_random_uuid(), 'student.update',      'Update student profiles and status',        'students', NOW()),
  (gen_random_uuid(), 'student.archive',     'Archive / deactivate student accounts',     'students', NOW()),
  -- Teacher Management
  (gen_random_uuid(), 'teacher.view',        'View teacher profiles',                     'teachers', NOW()),
  (gen_random_uuid(), 'teacher.create',      'Create new teacher accounts',               'teachers', NOW()),
  (gen_random_uuid(), 'teacher.update',      'Update teacher profiles and status',        'teachers', NOW()),
  -- Course Management
  (gen_random_uuid(), 'course.view',         'View all courses including drafts',         'courses',  NOW()),
  (gen_random_uuid(), 'course.create',       'Create new courses',                        'courses',  NOW()),
  (gen_random_uuid(), 'course.update',       'Update course content and status',          'courses',  NOW()),
  (gen_random_uuid(), 'course.delete',       'Archive / delete courses',                  'courses',  NOW()),
  -- Batch Management
  (gen_random_uuid(), 'batch.view',          'View all batches',                          'batches',  NOW()),
  (gen_random_uuid(), 'batch.create',        'Create new batches',                        'batches',  NOW()),
  (gen_random_uuid(), 'batch.update',        'Update batch details and capacity',         'batches',  NOW()),
  -- Academic Management
  (gen_random_uuid(), 'attendance.view',     'View attendance records',                   'academic', NOW()),
  (gen_random_uuid(), 'attendance.mark',     'Mark attendance for students',              'academic', NOW()),
  (gen_random_uuid(), 'assignment.create',   'Create assignments and exercises',          'academic', NOW()),
  (gen_random_uuid(), 'assignment.grade',    'Grade student assignments (scoped to assigned batches)', 'academic', NOW()),
  (gen_random_uuid(), 'project.grade',       'Grade student projects (scoped to assigned batches)',    'academic', NOW()),
  (gen_random_uuid(), 'exam.grade',          'Grade student exams (scoped to assigned batches)',       'academic', NOW()),
  -- Certificates
  (gen_random_uuid(), 'certificate.view',    'View certificate records',                  'certificates', NOW()),
  (gen_random_uuid(), 'certificate.approve', 'Approve pending certificates',              'certificates', NOW()),
  (gen_random_uuid(), 'certificate.issue',   'Issue certificates to students',            'certificates', NOW()),
  (gen_random_uuid(), 'certificate.revoke',  'Revoke or supersede issued certificates',   'certificates', NOW()),
  -- Financial
  (gen_random_uuid(), 'payment.view',        'View payment records',                      'finance',  NOW()),
  (gen_random_uuid(), 'payment.verify',      'Verify or reject UPI payment submissions',  'finance',  NOW()),
  -- Administrative
  (gen_random_uuid(), 'demo.manage',         'Manage demo booking requests',              'admin',    NOW()),
  (gen_random_uuid(), 'report.export',       'Export reports and analytics',              'admin',    NOW()),
  (gen_random_uuid(), 'audit.view',          'View immutable audit log entries',          'admin',    NOW()),
  (gen_random_uuid(), 'system.manage',       'Manage system configuration and settings',  'admin',    NOW())
ON CONFLICT (code) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 3. DEFAULT ROLE → PERMISSION ASSIGNMENTS
-- SUPER_ADMIN: All permissions (enforced in has_permission() via is_super_admin() bypass)
-- ADMIN: Operational permissions (all except system.manage)
-- TEACHER: Academic + view permissions (scoped by RLS to assigned batches)
-- STUDENT: No direct permissions (access governed entirely by RLS)
-- PARENT: No direct permissions (access governed entirely by RLS)
-- -----------------------------------------------------------------------------

-- ADMIN role permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'ADMIN'
  AND p.code IN (
    'student.view', 'student.create', 'student.update', 'student.archive',
    'teacher.view', 'teacher.create', 'teacher.update',
    'course.view', 'course.create', 'course.update', 'course.delete',
    'batch.view', 'batch.create', 'batch.update',
    'attendance.view', 'attendance.mark',
    'assignment.create', 'assignment.grade', 'project.grade', 'exam.grade',
    'certificate.view', 'certificate.approve', 'certificate.issue', 'certificate.revoke',
    'payment.view', 'payment.verify',
    'demo.manage', 'report.export', 'audit.view'
  )
ON CONFLICT DO NOTHING;

-- TEACHER role permissions (academic operations only; data scope enforced by RLS)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'TEACHER'
  AND p.code IN (
    'student.view',
    'course.view',
    'batch.view',
    'attendance.view', 'attendance.mark',
    'assignment.create', 'assignment.grade', 'project.grade', 'exam.grade',
    'certificate.view'
  )
ON CONFLICT DO NOTHING;

-- -----------------------------------------------------------------------------
-- 4. INITIAL PUBLISHED COURSES (Curriculum placeholder — no fake testimonials)
-- These are real course catalog entries matching the official DP Skill Tech programs.
-- Pricing, batch capacity, and schedule details are configured via Admin dashboard.
-- -----------------------------------------------------------------------------

INSERT INTO courses (id, slug, title, subtitle, category, level, duration, short_description, status, certificate_enabled, created_at, updated_at) VALUES
  (
    gen_random_uuid(),
    'python-ai-fullstack',
    'Python Programming & Applied AI Systems',
    'From programming logic to production-grade microservices and GenAI',
    'Programming & AI',
    'All Levels',
    '12 Weeks',
    'Full Stack Python engineering with FastAPI, PostgreSQL, React, and LangChain RAG pipelines. Capstone-driven, cohort-based learning.',
    'PUBLISHED',
    TRUE,
    NOW(), NOW()
  ),
  (
    gen_random_uuid(),
    'java-ai-fullstack',
    'Full Stack Java + AI',
    'Enterprise Java development with Spring Boot, microservices, and AI integration',
    'Programming & AI',
    'All Levels',
    '12 Weeks',
    'Production-grade Java engineering with Spring Boot, REST APIs, and applied AI integration.',
    'DRAFT',
    TRUE,
    NOW(), NOW()
  ),
  (
    gen_random_uuid(),
    'data-science-ai',
    'Data Science + AI',
    'Statistics, machine learning, and applied AI systems',
    'Data & AI',
    'All Levels',
    '12 Weeks',
    'End-to-end data science from Python fundamentals and statistical analysis to deployed ML models.',
    'DRAFT',
    TRUE,
    NOW(), NOW()
  ),
  (
    gen_random_uuid(),
    'cybersecurity-ethical-hacking',
    'Cybersecurity & Ethical Hacking',
    'Penetration testing, threat modeling, and defensive security',
    'Security',
    'All Levels',
    '12 Weeks',
    'Hands-on cybersecurity training covering ethical hacking, network security, and defensive techniques.',
    'DRAFT',
    TRUE,
    NOW(), NOW()
  ),
  (
    gen_random_uuid(),
    'sql-database-engineering',
    'SQL & Database Engineering',
    'Relational databases, query optimization, and data architecture',
    'Data Engineering',
    'All Levels',
    '8 Weeks',
    'Comprehensive SQL training from fundamentals to advanced query optimization and database design.',
    'DRAFT',
    TRUE,
    NOW(), NOW()
  )
ON CONFLICT (slug) DO NOTHING;

-- -----------------------------------------------------------------------------
-- DEVELOPMENT NOTE
-- -----------------------------------------------------------------------------
-- Dev user accounts (admin@dpskilltech.in, teacher@dpskilltech.in, etc.) are
-- NOT seeded here. They must be created via:
--   1. Supabase Auth Admin API (supabaseAdmin.auth.admin.createUser)
--   2. Or the Supabase Dashboard under Authentication > Users
-- This ensures passwords are handled exclusively by Supabase Auth and never
-- appear in SQL migration files or version control.
-- =============================================================================
