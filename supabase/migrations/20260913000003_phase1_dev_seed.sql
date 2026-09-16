-- =============================================================================
-- DP SKILL TECH ACADEMY — PHASE 1 RBAC SEED & DEVELOPMENT FIXTURES
-- Base Roles, Granular Permissions Catalog, and Isolated [DEV-TEST] Fixtures
-- (Rule 22 & 25: No fake production data; clearly isolated development seeds)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. BASE SYSTEM ROLES
-- -----------------------------------------------------------------------------

INSERT INTO roles (id, name, description, is_system) VALUES
  ('00000000-0000-0000-0000-000000000001', 'SUPER_ADMIN', 'Full unrestricted platform architecture and administrative control with MFA requirement', TRUE),
  ('00000000-0000-0000-0000-000000000002', 'ADMIN', 'Academy operations, student admissions, batch scheduling, and financial verification', TRUE),
  ('00000000-0000-0000-0000-000000000003', 'TEACHER', 'Lead faculty and technical instructors assigned to course batches and mock interviews', TRUE),
  ('00000000-0000-0000-0000-000000000004', 'STUDENT', 'Enrolled academy learners with access to sandboxed lab, classroom, and capstones', TRUE),
  ('00000000-0000-0000-0000-000000000005', 'PARENT', 'Authorized guardians monitoring student attendance, milestones, and payment schedules', TRUE)
ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  is_system = EXCLUDED.is_system;

-- -----------------------------------------------------------------------------
-- 2. GRANULAR PERMISSIONS CATALOG
-- -----------------------------------------------------------------------------

INSERT INTO permissions (code, description, module) VALUES
  -- Student Management
  ('student.view', 'View student roster, contact profiles, and academic records', 'STUDENT'),
  ('student.create', 'Provision new student accounts and generate temporary onboarding credentials', 'STUDENT'),
  ('student.update', 'Update student enrollment details, batch placement, and status', 'STUDENT'),
  ('student.archive', 'Soft-delete or suspend student accounts', 'STUDENT'),

  -- Faculty & Teacher Management
  ('teacher.view', 'View instructor roster and assigned syllabus tracks', 'TEACHER'),
  ('teacher.create', 'Onboard new faculty members and configure teaching credentials', 'TEACHER'),
  ('teacher.update', 'Modify teacher profiles, bio, and assigned courses', 'TEACHER'),

  -- Course & Curriculum Management
  ('course.view', 'View courses, module outlines, and lesson metadata', 'COURSE'),
  ('course.create', 'Author new curriculum specifications and course syllabi', 'COURSE'),
  ('course.update', 'Edit course details, modules, lessons, and fee structures', 'COURSE'),
  ('course.delete', 'Archive or soft-delete deprecated course tracks', 'COURSE'),

  -- Batch & Cohort Scheduling (15-Student Cap Enforcement)
  ('batch.view', 'View batch lists, student capacity, and recurring schedules', 'BATCH'),
  ('batch.create', 'Initialize new 15-student cohort with Mon-Sat cadence', 'BATCH'),
  ('batch.update', 'Modify batch schedules, meeting rooms, and assigned trainers', 'BATCH'),

  -- Attendance
  ('attendance.view', 'Inspect daily live attendance logs for enrolled batches', 'ATTENDANCE'),
  ('attendance.mark', 'Submit session attendance rosters for live Zoom classes', 'ATTENDANCE'),
  ('attendance.update', 'Correct or adjust attendance records with mentor verification', 'ATTENDANCE'),

  -- Assignments, Projects & Exams
  ('assignment.create', 'Publish homework and coding assignments to batch modules', 'ACADEMIC'),
  ('assignment.grade', 'Evaluate student submissions and provide structured code review feedback', 'ACADEMIC'),
  ('project.create', 'Define capstone project requirements, repositories, and rubrics', 'ACADEMIC'),
  ('project.grade', 'Conduct project defense audits and record capstone approvals', 'ACADEMIC'),
  ('exam.create', 'Configure module quizzes and timed technical examinations', 'ACADEMIC'),
  ('exam.grade', 'Review automated and written assessment scores', 'ACADEMIC'),

  -- Certificates & Verification
  ('certificate.view', 'View issued academy credentials and verification statuses', 'CERTIFICATE'),
  ('certificate.approve', 'Approve certificate eligibility upon capstone defense passage', 'CERTIFICATE'),
  ('certificate.issue', 'Sign and issue serialized tamper-proof certificates', 'CERTIFICATE'),
  ('certificate.revoke', 'Revoke or invalidate certificates with audit logging', 'CERTIFICATE'),

  -- Payments & UPI Financials
  ('payment.view', 'Review UPI payment submissions, UTR numbers, and screenshot proofs', 'FINANCE'),
  ('payment.verify', 'Verify or reject student UPI payment transactions and update enrollment', 'FINANCE'),

  -- Website & Admissions
  ('website.manage', 'Oversee public marketing content and course catalog publications', 'OPERATIONS'),
  ('demo.manage', 'Assign free demo class requests to faculty and manage status', 'ADMISSIONS'),
  ('report.export', 'Export telemetry, cohort attendance rates, and financial reports', 'ANALYTICS'),
  ('system.manage', 'Configure platform settings, storage providers, and API keys', 'SYSTEM'),
  ('audit.view', 'Inspect immutable audit logs and security event histories', 'SECURITY')
ON CONFLICT (code) DO UPDATE SET
  description = EXCLUDED.description,
  module = EXCLUDED.module;

-- -----------------------------------------------------------------------------
-- 3. ASSIGN DEFAULT PERMISSIONS TO ROLES
-- -----------------------------------------------------------------------------

-- SUPER_ADMIN gets all permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT '00000000-0000-0000-0000-000000000001', id FROM permissions
ON CONFLICT DO NOTHING;

-- ADMIN gets management permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT '00000000-0000-0000-0000-000000000002', id FROM permissions
WHERE code IN (
  'student.view', 'student.create', 'student.update', 'student.archive',
  'teacher.view', 'teacher.create', 'teacher.update',
  'course.view', 'course.create', 'course.update',
  'batch.view', 'batch.create', 'batch.update',
  'attendance.view', 'attendance.update',
  'assignment.create', 'assignment.grade',
  'project.create', 'project.grade',
  'exam.create', 'exam.grade',
  'certificate.view', 'certificate.approve', 'certificate.issue', 'certificate.revoke',
  'payment.view', 'payment.verify',
  'website.manage', 'demo.manage', 'report.export', 'audit.view'
)
ON CONFLICT DO NOTHING;

-- TEACHER gets instructional permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT '00000000-0000-0000-0000-000000000003', id FROM permissions
WHERE code IN (
  'course.view', 'batch.view',
  'attendance.view', 'attendance.mark', 'attendance.update',
  'assignment.create', 'assignment.grade',
  'project.create', 'project.grade',
  'exam.create', 'exam.grade',
  'certificate.view'
)
ON CONFLICT DO NOTHING;

-- -----------------------------------------------------------------------------
-- 4. BASE COURSES SEED (Matches current DP Skill Tech Public Catalog)
-- -----------------------------------------------------------------------------

INSERT INTO courses (id, slug, title, subtitle, category, level, duration, short_description, full_description, status, thumbnail_url, certificate_enabled) VALUES
  (
    '10000000-0000-0000-0000-000000000001',
    'full-stack-python-ai',
    'Python Programming & Applied AI Systems',
    'Flagship Professional Track',
    'Programming & AI',
    'Beginner to Advanced',
    '12 Weeks',
    'Master Python 3, object-oriented programming, data structures, FastAPI backends, and practical Generative AI application development.',
    'Python is the world''s most versatile language. This flagship curriculum guides students from programming logic and algorithmic problem solving to building scalable microservices with FastAPI and deploying Generative AI systems.',
    'PUBLISHED',
    '/images/courses/python-card-bg.jpg',
    TRUE
  ),
  (
    '10000000-0000-0000-0000-000000000002',
    'cyber-security',
    'Cyber Security Fundamentals & Ethical Defense',
    'Defensive & Offensive Security',
    'Cyber Security & Networking',
    'Intermediate',
    '14 Weeks',
    'Learn networking, security fundamentals, ethical security concepts, vulnerability assessments, and hands-on defense in isolated security labs.',
    'Cyber threats and data breaches continue to accelerate. This intensive, practical curriculum equips students with real-world defensive and offensive security skills. You will analyze live network packets, test web applications against OWASP vulnerabilities, audit system configurations, and learn incident response.',
    'PUBLISHED',
    '/images/courses/cyber-sec-card-bg.jpg',
    TRUE
  ),
  (
    '10000000-0000-0000-0000-000000000003',
    'modern-web-development',
    'Modern Full Stack Web Development',
    'React, Node & TypeScript',
    'Web Development',
    'All Levels',
    '12 Weeks',
    'Master modern web engineering: HTML5, CSS3, JavaScript ES6+, React 19, TypeScript, Node.js, REST APIs, and production deployments.',
    'Build production-grade web applications from scratch. This comprehensive curriculum takes you through modern frontend reactive architectures, scalable Node.js microservices, and end-to-end continuous integration pipelines.',
    'PUBLISHED',
    '/images/courses/web-dev-card-bg.jpg',
    TRUE
  )
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  short_description = EXCLUDED.short_description,
  status = EXCLUDED.status;

-- Base Fee Plans (Full + EMI for Python course)
INSERT INTO fee_plans (id, course_id, name, plan_type, total_amount, installment_count, description, is_active) VALUES
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'One-Time Upfront Full Payment', 'FULL', 35000, 1, 'Standard upfront tuition fee with immediate seat allocation', TRUE),
  ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', '3-Part Monthly Installment Plan (EMI)', 'EMI', 36000, 3, 'Convenient monthly installments of ₹12,000 across 3 months', TRUE)
ON CONFLICT DO NOTHING;

-- Installments for the 3-part EMI
INSERT INTO installments (id, fee_plan_id, installment_number, amount, due_days_after_enrollment) VALUES
  ('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002', 1, 12000, 0),
  ('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', 2, 12000, 30),
  ('30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000002', 3, 12000, 60)
ON CONFLICT DO NOTHING;
