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
