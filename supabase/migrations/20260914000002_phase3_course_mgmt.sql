-- =============================================================================
-- DP SKILL TECH ACADEMY — PHASE 2 STEP 3: COURSE MANAGEMENT EXTENSIONS
-- Preflight fix + Step 3 columns, indexes, and RLS
-- Non-destructive: only ADD COLUMN IF NOT EXISTS, CREATE IF NOT EXISTS
-- Does NOT modify or drop any Phase 1 or Phase 2 tables/policies/functions
-- =============================================================================

-- =============================================================================
-- 0. PREFLIGHT FIX: Add total_lessons_count to course_progress
--    (Was missed by the live Supabase SQL Editor run; Phase 2 Step 2 closure)
-- =============================================================================
ALTER TABLE course_progress
  ADD COLUMN IF NOT EXISTS total_lessons_count INT NOT NULL DEFAULT 0;

-- =============================================================================
-- 1. EXTEND COURSES TABLE (authoring metadata + configuration columns)
-- =============================================================================
ALTER TABLE courses
  ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS completion_criteria JSONB NOT NULL DEFAULT '{"lessons":50,"attendance":40,"assignments":25,"projects":25,"exams":25}'::JSONB,
  ADD COLUMN IF NOT EXISTS completion_threshold NUMERIC(5,2) NOT NULL DEFAULT 70.00,
  ADD COLUMN IF NOT EXISTS is_sequential BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS seo_title TEXT,
  ADD COLUMN IF NOT EXISTS seo_description TEXT;

-- =============================================================================
-- 2. EXTEND MODULES TABLE (authoring metadata)
-- =============================================================================
ALTER TABLE modules
  ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES profiles(id) ON DELETE SET NULL;

-- =============================================================================
-- 3. EXTEND LESSONS TABLE (lesson type, authoring, preview flag)
-- Phase 2 Step 2 already added has_quiz and is_preview via ALTER.
-- These IF NOT EXISTS guards prevent failure if already applied.
-- =============================================================================
ALTER TABLE lessons
  ADD COLUMN IF NOT EXISTS lesson_type TEXT NOT NULL DEFAULT 'VIDEO',
  ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS has_quiz BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS is_preview BOOLEAN NOT NULL DEFAULT FALSE;

-- Add CHECK constraint on lesson_type values
DO $$ BEGIN
  ALTER TABLE lessons ADD CONSTRAINT chk_lesson_type
    CHECK (lesson_type IN ('VIDEO', 'READING', 'QUIZ_LINK', 'LIVE_SESSION'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- =============================================================================
-- 4. INDEXES FOR PERFORMANCE
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_modules_course_order ON modules(course_id, order_index);
CREATE INDEX IF NOT EXISTS idx_lessons_module_order ON lessons(module_id, order_index);
CREATE INDEX IF NOT EXISTS idx_courses_status ON courses(status);
CREATE INDEX IF NOT EXISTS idx_lessons_published ON lessons(is_published);
CREATE INDEX IF NOT EXISTS idx_lessons_preview ON lessons(is_preview);

-- =============================================================================
-- 5. ROW LEVEL SECURITY — COURSES
-- Layered on top of existing Phase 1 RLS (which only covered student reads).
-- =============================================================================

-- Admin/Super Admin: full management of all courses
DO $$ BEGIN
  CREATE POLICY "admin_manage_courses" ON courses
    FOR ALL TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM user_roles ur
        JOIN roles r ON ur.role_id = r.id
        WHERE ur.user_id = auth.uid()
          AND r.name IN ('ADMIN', 'SUPER_ADMIN')
      )
    )
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM user_roles ur
        JOIN roles r ON ur.role_id = r.id
        WHERE ur.user_id = auth.uid()
          AND r.name IN ('ADMIN', 'SUPER_ADMIN')
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Teacher: read-only for assigned courses only
DO $$ BEGIN
  CREATE POLICY "teacher_view_assigned_courses" ON courses
    FOR SELECT TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM user_roles ur
        JOIN roles r ON ur.role_id = r.id
        WHERE ur.user_id = auth.uid() AND r.name = 'TEACHER'
      )
      AND EXISTS (
        SELECT 1 FROM teacher_profiles tp
        JOIN teacher_courses tc ON tc.teacher_profile_id = tp.id
        WHERE tp.profile_id = auth.uid()
          AND tc.course_id = courses.id
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Authenticated students/parents: read PUBLISHED courses only
DO $$ BEGIN
  CREATE POLICY "authenticated_read_published_courses" ON courses
    FOR SELECT TO authenticated
    USING (status = 'PUBLISHED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Anonymous: read PUBLISHED course metadata only
DO $$ BEGIN
  CREATE POLICY "anon_read_published_courses" ON courses
    FOR SELECT TO anon
    USING (status = 'PUBLISHED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- =============================================================================
-- 6. ROW LEVEL SECURITY — MODULES
-- =============================================================================

-- Admin: full management of all modules
DO $$ BEGIN
  CREATE POLICY "admin_manage_modules" ON modules
    FOR ALL TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM user_roles ur
        JOIN roles r ON ur.role_id = r.id
        WHERE ur.user_id = auth.uid()
          AND r.name IN ('ADMIN', 'SUPER_ADMIN')
      )
    )
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM user_roles ur
        JOIN roles r ON ur.role_id = r.id
        WHERE ur.user_id = auth.uid()
          AND r.name IN ('ADMIN', 'SUPER_ADMIN')
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Teacher: manage modules only for assigned courses
DO $$ BEGIN
  CREATE POLICY "teacher_manage_assigned_modules" ON modules
    FOR ALL TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM user_roles ur
        JOIN roles r ON ur.role_id = r.id
        WHERE ur.user_id = auth.uid() AND r.name = 'TEACHER'
      )
      AND EXISTS (
        SELECT 1 FROM teacher_profiles tp
        JOIN teacher_courses tc ON tc.teacher_profile_id = tp.id
        WHERE tp.profile_id = auth.uid()
          AND tc.course_id = modules.course_id
      )
    )
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM user_roles ur
        JOIN roles r ON ur.role_id = r.id
        WHERE ur.user_id = auth.uid() AND r.name = 'TEACHER'
      )
      AND EXISTS (
        SELECT 1 FROM teacher_profiles tp
        JOIN teacher_courses tc ON tc.teacher_profile_id = tp.id
        WHERE tp.profile_id = auth.uid()
          AND tc.course_id = modules.course_id
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Authenticated: read PUBLISHED modules only
DO $$ BEGIN
  CREATE POLICY "authenticated_read_published_modules" ON modules
    FOR SELECT TO authenticated
    USING (status = 'PUBLISHED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- =============================================================================
-- 7. ROW LEVEL SECURITY — LESSONS (management layer)
-- Phase 1 already has anon/student SELECT isolation via student_lessons_view.
-- Phase 1 INSERT/UPDATE/DELETE: no policy = blocked by default (RLS enabled).
-- We now add management policies for Admin and Teacher.
-- =============================================================================

-- Admin: full management of all lessons
DO $$ BEGIN
  CREATE POLICY "admin_manage_lessons" ON lessons
    FOR ALL TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM user_roles ur
        JOIN roles r ON ur.role_id = r.id
        WHERE ur.user_id = auth.uid()
          AND r.name IN ('ADMIN', 'SUPER_ADMIN')
      )
    )
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM user_roles ur
        JOIN roles r ON ur.role_id = r.id
        WHERE ur.user_id = auth.uid()
          AND r.name IN ('ADMIN', 'SUPER_ADMIN')
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Teacher: manage lessons only in modules of assigned courses
DO $$ BEGIN
  CREATE POLICY "teacher_manage_assigned_lessons" ON lessons
    FOR ALL TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM user_roles ur
        JOIN roles r ON ur.role_id = r.id
        WHERE ur.user_id = auth.uid() AND r.name = 'TEACHER'
      )
      AND EXISTS (
        SELECT 1 FROM modules m
        JOIN teacher_courses tc ON tc.course_id = m.course_id
        JOIN teacher_profiles tp ON tc.teacher_profile_id = tp.id
        WHERE m.id = lessons.module_id
          AND tp.profile_id = auth.uid()
      )
    )
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM user_roles ur
        JOIN roles r ON ur.role_id = r.id
        WHERE ur.user_id = auth.uid() AND r.name = 'TEACHER'
      )
      AND EXISTS (
        SELECT 1 FROM modules m
        JOIN teacher_courses tc ON tc.course_id = m.course_id
        JOIN teacher_profiles tp ON tc.teacher_profile_id = tp.id
        WHERE m.id = lessons.module_id
          AND tp.profile_id = auth.uid()
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- =============================================================================
-- 8. ROW LEVEL SECURITY — LESSON COMPLETIONS (student isolation)
-- Verify existing Phase 1 policies cover enrollment_id FK.
-- Add explicit policy if missing.
-- =============================================================================
DO $$ BEGIN
  CREATE POLICY "student_own_completions" ON lesson_completions
    FOR SELECT TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM enrollments e
        JOIN student_profiles sp ON e.student_profile_id = sp.id
        WHERE e.id = lesson_completions.enrollment_id
          AND sp.profile_id = auth.uid()
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "student_insert_own_completions" ON lesson_completions
    FOR INSERT TO authenticated
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM enrollments e
        JOIN student_profiles sp ON e.student_profile_id = sp.id
        WHERE e.id = lesson_completions.enrollment_id
          AND sp.profile_id = auth.uid()
          AND e.status IN ('ENROLLED', 'ACTIVE')
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Teacher/Admin can view completion records
DO $$ BEGIN
  CREATE POLICY "staff_view_all_completions" ON lesson_completions
    FOR SELECT TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM user_roles ur
        JOIN roles r ON ur.role_id = r.id
        WHERE ur.user_id = auth.uid()
          AND r.name IN ('ADMIN', 'SUPER_ADMIN', 'TEACHER')
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
