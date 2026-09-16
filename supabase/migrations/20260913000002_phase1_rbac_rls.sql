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
