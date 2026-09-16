-- =============================================================================
-- DP SKILL TECH ACADEMY — PHASE 2 OPERATIONAL LMS SCHEMA & RLS
-- PostgreSQL Architecture for Supabase
-- Operational Modules: Class Sessions, Hybrid Attendance, Assignments,
--                     Capstone Projects, Exams & Quizzes, Progression Criteria
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. CUSTOM ENUMS & DOMAIN TYPES
-- -----------------------------------------------------------------------------

DO $$ BEGIN
  CREATE TYPE class_session_status_type AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE attendance_status_type AS ENUM ('PRESENT', 'LATE', 'ABSENT', 'EXCUSED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE submission_status_type AS ENUM ('SUBMITTED', 'UNDER_REVIEW', 'NEEDS_REVISION', 'APPROVED', 'REJECTED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE project_status_type AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE exam_type_enum AS ENUM ('QUIZ', 'MODULE_TEST', 'FINAL_EXAM');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE question_type_enum AS ENUM ('MCQ', 'TRUE_FALSE', 'CODING', 'WRITTEN');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE attempt_status_enum AS ENUM ('IN_PROGRESS', 'SUBMITTED', 'EVALUATING', 'RELEASED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- -----------------------------------------------------------------------------
-- 2. ALTER EXISTING PHASE 1 TABLES (Zero Breaking Changes)
-- -----------------------------------------------------------------------------

-- Extend courses with configurable completion weighting and certificate threshold
ALTER TABLE courses ADD COLUMN IF NOT EXISTS completion_criteria JSONB 
  NOT NULL DEFAULT '{"lessons_weight": 25, "assignments_weight": 25, "projects_weight": 30, "exams_weight": 10, "attendance_weight": 10, "min_attendance_pct": 80}'::JSONB;

ALTER TABLE courses ADD COLUMN IF NOT EXISTS certificate_threshold_pct INT 
  NOT NULL DEFAULT 75;

-- Add weight validation check constraint on courses
DO $$ BEGIN
  ALTER TABLE courses ADD CONSTRAINT check_completion_criteria_weights CHECK (
    ((completion_criteria->>'lessons_weight')::int >= 0) AND
    ((completion_criteria->>'assignments_weight')::int >= 0) AND
    ((completion_criteria->>'projects_weight')::int >= 0) AND
    ((completion_criteria->>'exams_weight')::int >= 0) AND
    ((completion_criteria->>'attendance_weight')::int >= 0) AND
    (
      (completion_criteria->>'lessons_weight')::int +
      (completion_criteria->>'assignments_weight')::int +
      (completion_criteria->>'projects_weight')::int +
      (completion_criteria->>'exams_weight')::int +
      (completion_criteria->>'attendance_weight')::int = 100
    ) AND
    ((completion_criteria->>'min_attendance_pct')::int BETWEEN 0 AND 100) AND
    (certificate_threshold_pct BETWEEN 0 AND 100)
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Extend lessons with preview flag and quiz presence
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS has_quiz BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS is_preview BOOLEAN NOT NULL DEFAULT FALSE;

-- Extend course_progress with granular component metrics as derived cache data
ALTER TABLE course_progress ADD COLUMN IF NOT EXISTS attendance_pct NUMERIC(5,2) NOT NULL DEFAULT 0;
ALTER TABLE course_progress ADD COLUMN IF NOT EXISTS assignments_completed INT NOT NULL DEFAULT 0;
ALTER TABLE course_progress ADD COLUMN IF NOT EXISTS projects_completed INT NOT NULL DEFAULT 0;
ALTER TABLE course_progress ADD COLUMN IF NOT EXISTS exams_passed INT NOT NULL DEFAULT 0;
ALTER TABLE course_progress ADD COLUMN IF NOT EXISTS weighted_score NUMERIC(5,2) NOT NULL DEFAULT 0;
ALTER TABLE course_progress ADD COLUMN IF NOT EXISTS total_lessons_count INT NOT NULL DEFAULT 0;
ALTER TABLE course_progress ADD COLUMN IF NOT EXISTS last_recalculated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- -----------------------------------------------------------------------------
-- 3. CLASS SESSIONS (Concrete live schedule instances with Asia/Kolkata timezone)
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS class_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  teacher_profile_id UUID REFERENCES teacher_profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  session_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  timezone TEXT NOT NULL DEFAULT 'Asia/Kolkata',
  meeting_platform TEXT NOT NULL DEFAULT 'Zoom', -- 'Zoom', 'Google Meet', 'Microsoft Teams', 'Custom'
  meeting_url TEXT NOT NULL,
  status class_session_status_type NOT NULL DEFAULT 'SCHEDULED',
  is_override BOOLEAN NOT NULL DEFAULT FALSE,
  recording_asset_id UUID REFERENCES file_assets(id) ON DELETE SET NULL,
  session_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (batch_id, session_date, start_time)
);

CREATE TRIGGER trg_class_sessions_updated_at
  BEFORE UPDATE ON class_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- -----------------------------------------------------------------------------
-- 4. ATTENDANCE RECORDS (Hybrid tracking with database integrity trigger)
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_session_id UUID NOT NULL REFERENCES class_sessions(id) ON DELETE CASCADE,
  student_profile_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
  enrollment_id UUID NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
  status attendance_status_type NOT NULL DEFAULT 'ABSENT',
  join_timestamp TIMESTAMPTZ,
  marked_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  marked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  remarks TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (class_session_id, student_profile_id)
);

CREATE TRIGGER trg_attendance_records_updated_at
  BEFORE UPDATE ON attendance_records
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Database-level attendance integrity validation trigger function
CREATE OR REPLACE FUNCTION validate_attendance_enrollment()
RETURNS TRIGGER AS $$
DECLARE
  v_enrollment_student_id UUID;
  v_enrollment_batch_id UUID;
  v_session_batch_id UUID;
BEGIN
  SELECT student_profile_id, batch_id 
  INTO v_enrollment_student_id, v_enrollment_batch_id
  FROM enrollments 
  WHERE id = NEW.enrollment_id;

  IF v_enrollment_student_id IS NULL OR v_enrollment_student_id <> NEW.student_profile_id THEN
    RAISE EXCEPTION 'Attendance student_profile_id (%) does not match enrollment student_profile_id (%)', 
      NEW.student_profile_id, v_enrollment_student_id;
  END IF;

  SELECT batch_id 
  INTO v_session_batch_id
  FROM class_sessions 
  WHERE id = NEW.class_session_id;

  IF v_session_batch_id IS NULL OR v_session_batch_id <> v_enrollment_batch_id THEN
    RAISE EXCEPTION 'Class session batch_id (%) does not match enrollment batch_id (%)',
      v_session_batch_id, v_enrollment_batch_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_validate_attendance_enrollment ON attendance_records;
CREATE TRIGGER trg_validate_attendance_enrollment
  BEFORE INSERT OR UPDATE ON attendance_records
  FOR EACH ROW EXECUTE FUNCTION validate_attendance_enrollment();

-- -----------------------------------------------------------------------------
-- 5. ASSIGNMENTS & SUBMISSIONS (Homework & Lab Coding Tasks)
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  module_id UUID REFERENCES modules(id) ON DELETE SET NULL,
  lesson_id UUID REFERENCES lessons(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  instructions TEXT NOT NULL,
  due_days_after_enrollment INT DEFAULT 7,
  max_marks INT NOT NULL DEFAULT 100,
  passing_marks INT NOT NULL DEFAULT 60,
  submission_types JSONB NOT NULL DEFAULT '["FILE_UPLOAD", "GITHUB_URL", "TEXT_ANSWER"]'::JSONB,
  attachment_asset_id UUID REFERENCES file_assets(id) ON DELETE SET NULL,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_assignments_updated_at
  BEFORE UPDATE ON assignments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS assignment_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  student_profile_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
  enrollment_id UUID NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
  submission_type TEXT NOT NULL, -- 'FILE_UPLOAD', 'GITHUB_URL', 'TEXT_ANSWER', 'LIVE_URL'
  text_content TEXT,
  submission_url TEXT,
  file_asset_id UUID REFERENCES file_assets(id) ON DELETE SET NULL,
  attempt_number INT NOT NULL DEFAULT 1,
  status submission_status_type NOT NULL DEFAULT 'SUBMITTED',
  marks_obtained NUMERIC(5,2),
  teacher_feedback TEXT,
  reviewed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (assignment_id, enrollment_id, attempt_number)
);

CREATE TRIGGER trg_assignment_submissions_updated_at
  BEFORE UPDATE ON assignment_submissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- -----------------------------------------------------------------------------
-- 6. PROJECTS & MILESTONE CAPSTONES (Multi-Attempt History Preserved)
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  objectives TEXT NOT NULL,
  total_marks INT NOT NULL DEFAULT 100,
  passing_marks INT NOT NULL DEFAULT 70,
  rubric JSONB NOT NULL DEFAULT '[{"criteria": "System Architecture", "weight": 30}, {"criteria": "Code Quality & Tests", "weight": 40}, {"criteria": "Live Deployment", "weight": 30}]'::JSONB,
  status project_status_type NOT NULL DEFAULT 'PUBLISHED',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS project_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  order_index INT NOT NULL,
  marks_weightage INT NOT NULL DEFAULT 25,
  is_mandatory BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (project_id, order_index)
);

CREATE TABLE IF NOT EXISTS project_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  milestone_id UUID NOT NULL REFERENCES project_milestones(id) ON DELETE CASCADE,
  student_profile_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
  enrollment_id UUID NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
  attempt_number INT NOT NULL DEFAULT 1,
  github_url TEXT,
  live_demo_url TEXT,
  video_walkthrough_url TEXT,
  documentation_text TEXT,
  deliverable_asset_id UUID REFERENCES file_assets(id) ON DELETE SET NULL,
  status submission_status_type NOT NULL DEFAULT 'SUBMITTED',
  rubric_scores JSONB NOT NULL DEFAULT '{}'::JSONB,
  total_score NUMERIC(5,2),
  teacher_feedback TEXT,
  reviewed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (milestone_id, enrollment_id, attempt_number)
);

CREATE TRIGGER trg_project_submissions_updated_at
  BEFORE UPDATE ON project_submissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- -----------------------------------------------------------------------------
-- 7. EXAMS, QUESTION BANK & ATTEMPTS (Frozen Question Snapshot)
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  module_id UUID REFERENCES modules(id) ON DELETE SET NULL,
  lesson_id UUID REFERENCES lessons(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  exam_type exam_type_enum NOT NULL DEFAULT 'MODULE_TEST',
  duration_minutes INT NOT NULL DEFAULT 45,
  passing_percentage INT NOT NULL DEFAULT 70,
  max_attempts INT DEFAULT 3,
  randomize_questions BOOLEAN NOT NULL DEFAULT TRUE,
  randomize_options BOOLEAN NOT NULL DEFAULT TRUE,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_exams_updated_at
  BEFORE UPDATE ON exams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS exam_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type question_type_enum NOT NULL DEFAULT 'MCQ',
  points INT NOT NULL DEFAULT 10,
  order_index INT NOT NULL,
  options JSONB NOT NULL DEFAULT '[]'::JSONB,
  correct_answer JSONB NOT NULL DEFAULT '{}'::JSONB, -- Hidden from client via student_exam_questions_view
  explanation TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Safe view for student exams (Hides correct_answer from client queries)
CREATE OR REPLACE VIEW student_exam_questions_view AS
SELECT 
  id,
  exam_id,
  question_text,
  question_type,
  points,
  order_index,
  options,
  created_at
FROM exam_questions;

CREATE TABLE IF NOT EXISTS exam_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  student_profile_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
  enrollment_id UUID NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
  attempt_number INT NOT NULL DEFAULT 1,
  question_snapshot JSONB NOT NULL DEFAULT '[]'::JSONB, -- Freezes question IDs, randomized order, options, and points at started_at
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  submitted_at TIMESTAMPTZ,
  time_spent_seconds INT NOT NULL DEFAULT 0,
  auto_score NUMERIC(5,2) DEFAULT 0,
  manual_score NUMERIC(5,2) DEFAULT 0,
  total_score NUMERIC(5,2) DEFAULT 0,
  is_passed BOOLEAN DEFAULT FALSE,
  status attempt_status_enum NOT NULL DEFAULT 'IN_PROGRESS',
  reviewed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (exam_id, enrollment_id, attempt_number)
);

CREATE TRIGGER trg_exam_attempts_updated_at
  BEFORE UPDATE ON exam_attempts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS exam_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID NOT NULL REFERENCES exam_attempts(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES exam_questions(id) ON DELETE CASCADE,
  student_answer JSONB NOT NULL DEFAULT '{}'::JSONB,
  is_correct BOOLEAN,
  points_awarded NUMERIC(5,2) DEFAULT 0,
  teacher_feedback TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (attempt_id, question_id)
);

-- -----------------------------------------------------------------------------
-- 8. INDEXES FOR HIGH-EFFICIENCY OPERATIONS (Target Scale: 1,000+ Students)
-- -----------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_class_sessions_batch ON class_sessions(batch_id, session_date);
CREATE INDEX IF NOT EXISTS idx_class_sessions_teacher ON class_sessions(teacher_profile_id);
CREATE INDEX IF NOT EXISTS idx_attendance_session ON attendance_records(class_session_id);
CREATE INDEX IF NOT EXISTS idx_attendance_student ON attendance_records(student_profile_id);
CREATE INDEX IF NOT EXISTS idx_attendance_enrollment ON attendance_records(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_assignments_course ON assignments(course_id);
CREATE INDEX IF NOT EXISTS idx_assignment_submissions_assignment ON assignment_submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_assignment_submissions_student ON assignment_submissions(student_profile_id);
CREATE INDEX IF NOT EXISTS idx_assignment_submissions_enrollment ON assignment_submissions(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_projects_course ON projects(course_id);
CREATE INDEX IF NOT EXISTS idx_project_milestones_proj ON project_milestones(project_id, order_index);
CREATE INDEX IF NOT EXISTS idx_project_submissions_milestone ON project_submissions(milestone_id);
CREATE INDEX IF NOT EXISTS idx_project_submissions_student ON project_submissions(student_profile_id);
CREATE INDEX IF NOT EXISTS idx_exams_course ON exams(course_id);
CREATE INDEX IF NOT EXISTS idx_exam_questions_exam ON exam_questions(exam_id, order_index);
CREATE INDEX IF NOT EXISTS idx_exam_attempts_exam_student ON exam_attempts(exam_id, student_profile_id);
CREATE INDEX IF NOT EXISTS idx_exam_answers_attempt ON exam_answers(attempt_id);

-- -----------------------------------------------------------------------------
-- 9. RECALCULATE ENROLLMENT PROGRESS STORED PROCEDURE (Deterministic Derivation)
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION recalculate_enrollment_progress(p_enrollment_id UUID)
RETURNS VOID AS $$
DECLARE
  v_course_id UUID;
  v_student_profile_id UUID;
  v_batch_id UUID;
  v_completion_criteria JSONB;
  
  v_lessons_weight INT;
  v_attendance_weight INT;
  v_assignments_weight INT;
  v_projects_weight INT;
  v_exams_weight INT;
  
  v_total_lessons INT := 0;
  v_completed_lessons INT := 0;
  v_lessons_pct NUMERIC(5,2) := 0;
  
  v_total_sessions INT := 0;
  v_attended_sessions INT := 0;
  v_attendance_pct NUMERIC(5,2) := 0;
  
  v_total_assignments INT := 0;
  v_completed_assignments INT := 0;
  v_assignments_pct NUMERIC(5,2) := 0;
  
  v_total_milestones INT := 0;
  v_completed_milestones INT := 0;
  v_projects_pct NUMERIC(5,2) := 0;
  
  v_total_exams INT := 0;
  v_passed_exams INT := 0;
  v_exams_pct NUMERIC(5,2) := 0;
  
  v_weighted_score NUMERIC(5,2) := 0;
BEGIN
  SELECT course_id, student_profile_id, batch_id 
  INTO v_course_id, v_student_profile_id, v_batch_id
  FROM enrollments WHERE id = p_enrollment_id;
  
  IF v_course_id IS NULL THEN
    RETURN;
  END IF;

  SELECT completion_criteria INTO v_completion_criteria
  FROM courses WHERE id = v_course_id;

  v_lessons_weight := COALESCE((v_completion_criteria->>'lessons_weight')::int, 25);
  v_attendance_weight := COALESCE((v_completion_criteria->>'attendance_weight')::int, 10);
  v_assignments_weight := COALESCE((v_completion_criteria->>'assignments_weight')::int, 25);
  v_projects_weight := COALESCE((v_completion_criteria->>'projects_weight')::int, 30);
  v_exams_weight := COALESCE((v_completion_criteria->>'exams_weight')::int, 10);

  -- Lessons completion
  SELECT COUNT(*) INTO v_total_lessons 
  FROM lessons l JOIN modules m ON l.module_id = m.id WHERE m.course_id = v_course_id;
  
  SELECT COUNT(DISTINCT lesson_id) INTO v_completed_lessons
  FROM lesson_completions WHERE enrollment_id = p_enrollment_id;
  
  IF v_total_lessons > 0 THEN
    v_lessons_pct := ROUND((v_completed_lessons::numeric / v_total_lessons::numeric) * 100, 2);
  END IF;

  -- Attendance calculation
  SELECT COUNT(*) INTO v_total_sessions
  FROM class_sessions WHERE batch_id = v_batch_id AND status = 'COMPLETED';

  SELECT COUNT(*) INTO v_attended_sessions
  FROM attendance_records WHERE enrollment_id = p_enrollment_id AND status IN ('PRESENT', 'LATE', 'EXCUSED');

  IF v_total_sessions > 0 THEN
    v_attendance_pct := ROUND((v_attended_sessions::numeric / v_total_sessions::numeric) * 100, 2);
  END IF;

  -- Assignments calculation
  SELECT COUNT(*) INTO v_total_assignments
  FROM assignments WHERE course_id = v_course_id AND is_published = TRUE;

  SELECT COUNT(DISTINCT assignment_id) INTO v_completed_assignments
  FROM assignment_submissions WHERE enrollment_id = p_enrollment_id AND status = 'APPROVED';

  IF v_total_assignments > 0 THEN
    v_assignments_pct := ROUND((v_completed_assignments::numeric / v_total_assignments::numeric) * 100, 2);
  END IF;

  -- Capstone Milestones calculation
  SELECT COUNT(pm.id) INTO v_total_milestones
  FROM project_milestones pm JOIN projects p ON pm.project_id = p.id 
  WHERE p.course_id = v_course_id AND p.status = 'PUBLISHED';

  SELECT COUNT(DISTINCT milestone_id) INTO v_completed_milestones
  FROM project_submissions WHERE enrollment_id = p_enrollment_id AND status = 'APPROVED';

  IF v_total_milestones > 0 THEN
    v_projects_pct := ROUND((v_completed_milestones::numeric / v_total_milestones::numeric) * 100, 2);
  END IF;

  -- Exams calculation
  SELECT COUNT(*) INTO v_total_exams
  FROM exams WHERE course_id = v_course_id AND is_published = TRUE;

  SELECT COUNT(DISTINCT exam_id) INTO v_passed_exams
  FROM exam_attempts WHERE enrollment_id = p_enrollment_id AND is_passed = TRUE;

  IF v_total_exams > 0 THEN
    v_exams_pct := ROUND((v_passed_exams::numeric / v_total_exams::numeric) * 100, 2);
  END IF;

  -- Compute deterministic weighted overall score
  v_weighted_score := ROUND(
    (v_lessons_pct * v_lessons_weight / 100.0) +
    (v_attendance_pct * v_attendance_weight / 100.0) +
    (v_assignments_pct * v_assignments_weight / 100.0) +
    (v_projects_pct * v_projects_weight / 100.0) +
    (v_exams_pct * v_exams_weight / 100.0), 2
  );

  -- Upsert derived cache into course_progress
  INSERT INTO course_progress (
    enrollment_id,
    completed_lessons_count,
    total_lessons_count,
    completion_percentage,
    attendance_pct,
    assignments_completed,
    projects_completed,
    exams_passed,
    weighted_score,
    last_recalculated_at,
    updated_at
  ) VALUES (
    p_enrollment_id,
    v_completed_lessons,
    v_total_lessons,
    v_lessons_pct,
    v_attendance_pct,
    v_completed_assignments,
    v_completed_milestones,
    v_passed_exams,
    v_weighted_score,
    NOW(),
    NOW()
  )
  ON CONFLICT (enrollment_id) DO UPDATE SET
    completed_lessons_count = EXCLUDED.completed_lessons_count,
    total_lessons_count = EXCLUDED.total_lessons_count,
    completion_percentage = EXCLUDED.completion_percentage,
    attendance_pct = EXCLUDED.attendance_pct,
    assignments_completed = EXCLUDED.assignments_completed,
    projects_completed = EXCLUDED.projects_completed,
    exams_passed = EXCLUDED.exams_passed,
    weighted_score = EXCLUDED.weighted_score,
    last_recalculated_at = NOW(),
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- -----------------------------------------------------------------------------
-- 10. SECURITY & SCOPE HELPER FUNCTIONS
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION auth_student_profile_id()
RETURNS UUID AS $$
  SELECT id FROM student_profiles WHERE profile_id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION auth_teacher_profile_id()
RETURNS UUID AS $$
  SELECT id FROM teacher_profiles WHERE profile_id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION auth_parent_profile_id()
RETURNS UUID AS $$
  SELECT id FROM parent_profiles WHERE profile_id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_teacher_for_batch(p_batch_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM batches b
    JOIN teacher_profiles tp ON b.teacher_profile_id = tp.id
    WHERE tp.profile_id = auth.uid()
      AND b.id = p_batch_id
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_teacher_for_session(p_session_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM class_sessions cs
    JOIN teacher_profiles tp ON cs.teacher_profile_id = tp.id
    WHERE tp.profile_id = auth.uid()
      AND cs.id = p_session_id
  ) OR EXISTS (
    SELECT 1 FROM class_sessions cs
    JOIN batches b ON cs.batch_id = b.id
    JOIN teacher_profiles tp ON b.teacher_profile_id = tp.id
    WHERE tp.profile_id = auth.uid()
      AND cs.id = p_session_id
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- -----------------------------------------------------------------------------
-- 11. ROW LEVEL SECURITY (RLS) POLICIES
-- -----------------------------------------------------------------------------

ALTER TABLE class_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_answers ENABLE ROW LEVEL SECURITY;

-- Class Sessions RLS:
CREATE POLICY "Class sessions select policy"
  ON class_sessions FOR SELECT TO authenticated
  USING (
    is_admin()
    OR teacher_profile_id IN (SELECT id FROM teacher_profiles WHERE profile_id = auth.uid())
    OR batch_id IN (
      SELECT e.batch_id FROM enrollments e
      JOIN student_profiles sp ON e.student_profile_id = sp.id
      WHERE sp.profile_id = auth.uid() AND e.status IN ('ENROLLED', 'ACTIVE', 'COMPLETED')
    )
    OR batch_id IN (
      SELECT e.batch_id FROM enrollments e
      WHERE is_linked_parent(e.student_profile_id)
    )
  );

CREATE POLICY "Class sessions admin and teacher manage"
  ON class_sessions FOR ALL TO authenticated
  USING (
    is_admin()
    OR teacher_profile_id IN (SELECT id FROM teacher_profiles WHERE profile_id = auth.uid())
  );

-- Attendance Records RLS:
CREATE POLICY "Attendance select policy"
  ON attendance_records FOR SELECT TO authenticated
  USING (
    is_admin()
    OR student_profile_id IN (SELECT id FROM student_profiles WHERE profile_id = auth.uid())
    OR is_linked_parent(student_profile_id)
    OR is_teacher_for_student(student_profile_id)
  );

CREATE POLICY "Attendance manage policy"
  ON attendance_records FOR ALL TO authenticated
  USING (
    is_admin()
    OR is_teacher_for_student(student_profile_id)
  );

-- Assignments RLS:
CREATE POLICY "Assignments select policy"
  ON assignments FOR SELECT TO authenticated
  USING (
    is_admin()
    OR is_published = TRUE
  );

CREATE POLICY "Assignments manage policy"
  ON assignments FOR ALL TO authenticated
  USING (is_admin() OR is_teacher());

-- Assignment Submissions RLS:
CREATE POLICY "Submissions select policy"
  ON assignment_submissions FOR SELECT TO authenticated
  USING (
    is_admin()
    OR student_profile_id IN (SELECT id FROM student_profiles WHERE profile_id = auth.uid())
    OR is_linked_parent(student_profile_id)
    OR is_teacher_for_student(student_profile_id)
  );

CREATE POLICY "Submissions student insert own"
  ON assignment_submissions FOR INSERT TO authenticated
  WITH CHECK (
    student_profile_id IN (SELECT id FROM student_profiles WHERE profile_id = auth.uid())
  );

CREATE POLICY "Submissions update policy"
  ON assignment_submissions FOR UPDATE TO authenticated
  USING (
    is_admin()
    OR is_teacher_for_student(student_profile_id)
    OR (
      student_profile_id IN (SELECT id FROM student_profiles WHERE profile_id = auth.uid())
      AND status = 'NEEDS_REVISION'
    )
  );

-- Projects RLS:
CREATE POLICY "Projects select policy"
  ON projects FOR SELECT TO authenticated
  USING (is_admin() OR status = 'PUBLISHED');

CREATE POLICY "Projects manage policy"
  ON projects FOR ALL TO authenticated
  USING (is_admin() OR is_teacher());

CREATE POLICY "Project milestones select policy"
  ON project_milestones FOR SELECT TO authenticated
  USING (TRUE);

CREATE POLICY "Project milestones manage policy"
  ON project_milestones FOR ALL TO authenticated
  USING (is_admin() OR is_teacher());

-- Project Submissions RLS:
CREATE POLICY "Project submissions select policy"
  ON project_submissions FOR SELECT TO authenticated
  USING (
    is_admin()
    OR student_profile_id IN (SELECT id FROM student_profiles WHERE profile_id = auth.uid())
    OR is_linked_parent(student_profile_id)
    OR is_teacher_for_student(student_profile_id)
  );

CREATE POLICY "Project submissions insert own"
  ON project_submissions FOR INSERT TO authenticated
  WITH CHECK (
    student_profile_id IN (SELECT id FROM student_profiles WHERE profile_id = auth.uid())
  );

CREATE POLICY "Project submissions grade update"
  ON project_submissions FOR UPDATE TO authenticated
  USING (
    is_admin()
    OR is_teacher_for_student(student_profile_id)
    OR (
      student_profile_id IN (SELECT id FROM student_profiles WHERE profile_id = auth.uid())
      AND status = 'NEEDS_REVISION'
    )
  );

-- Exams RLS:
CREATE POLICY "Exams select policy"
  ON exams FOR SELECT TO authenticated
  USING (is_admin() OR is_published = TRUE);

CREATE POLICY "Exams manage policy"
  ON exams FOR ALL TO authenticated
  USING (is_admin() OR is_teacher());

-- Exam Questions Base Table RLS (Admin and Teachers only; Students use student_exam_questions_view)
CREATE POLICY "Exam questions base table manage"
  ON exam_questions FOR ALL TO authenticated
  USING (is_admin() OR is_teacher());

-- Grant student safe view
GRANT SELECT ON student_exam_questions_view TO authenticated, anon;

-- Exam Attempts RLS:
CREATE POLICY "Exam attempts student view own"
  ON exam_attempts FOR SELECT TO authenticated
  USING (
    is_admin()
    OR student_profile_id IN (SELECT id FROM student_profiles WHERE profile_id = auth.uid())
    OR (is_linked_parent(student_profile_id) AND status = 'RELEASED')
    OR is_teacher_for_student(student_profile_id)
  );

CREATE POLICY "Exam attempts student insert own"
  ON exam_attempts FOR INSERT TO authenticated
  WITH CHECK (
    student_profile_id IN (SELECT id FROM student_profiles WHERE profile_id = auth.uid())
  );

CREATE POLICY "Exam attempts update policy"
  ON exam_attempts FOR UPDATE TO authenticated
  USING (
    is_admin()
    OR is_teacher_for_student(student_profile_id)
    OR (
      student_profile_id IN (SELECT id FROM student_profiles WHERE profile_id = auth.uid())
      AND status = 'IN_PROGRESS'
    )
  );

-- Exam Answers RLS:
CREATE POLICY "Exam answers select policy"
  ON exam_answers FOR SELECT TO authenticated
  USING (
    is_admin()
    OR attempt_id IN (
      SELECT id FROM exam_attempts 
      WHERE student_profile_id IN (SELECT id FROM student_profiles WHERE profile_id = auth.uid())
    )
    OR is_teacher()
  );

CREATE POLICY "Exam answers manage policy"
  ON exam_answers FOR ALL TO authenticated
  USING (
    is_admin()
    OR is_teacher()
    OR attempt_id IN (
      SELECT id FROM exam_attempts 
      WHERE student_profile_id IN (SELECT id FROM student_profiles WHERE profile_id = auth.uid())
        AND status = 'IN_PROGRESS'
    )
  );
