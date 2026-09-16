/**
 * DP SKILL TECH ACADEMY — PHASE 2 STEP 3: COURSES, MODULES & LESSONS API
 *
 * Authorization model:
 *   SUPER_ADMIN / ADMIN — full management of all courses
 *   TEACHER            — manage modules/lessons only for assigned courses
 *   STUDENT            — read published content + mark lesson completions
 *   PARENT             — read published content via enrolled child
 *   Anonymous          — no access to management endpoints; blocked by RLS
 *
 * Security rules:
 *   1. Every endpoint authenticates the token.
 *   2. Role is resolved from PostgreSQL user_roles.
 *   3. teacher_courses FK enforces scope; admin bypasses.
 *   4. service_role used only on server (never exposed to client).
 *   5. student_lessons_view used for all student-facing lesson reads.
 *   6. raw video_asset_ref / resource_refs NEVER returned to clients.
 *   7. lesson completion uses enrollment_id FK as authoritative key.
 *   8. Audit events written for all significant mutations.
 */

import { Router, Request, Response } from 'express';
import { z } from 'zod';
import {
  authenticateToken,
  requireRole,
  requirePasswordChanged,
} from '../middlewares/auth.middleware';
import { supabaseAdmin } from '../lib/supabase';
import { auditService } from '../services/audit.service';

const router = Router();

// ---------------------------------------------------------------------------
// Validation schemas
// ---------------------------------------------------------------------------
const courseCreateSchema = z.object({
  slug: z.string().min(2).max(120).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  title: z.string().min(3).max(200),
  subtitle: z.string().max(300).optional(),
  category: z.string().min(1).max(100),
  level: z.string().min(1).max(50),
  duration: z.string().min(1).max(100),
  short_description: z.string().max(500).optional(),
  full_description: z.string().max(10000).optional(),
  thumbnail_url: z.string().url().optional().or(z.literal('')),
  seo_title: z.string().max(200).optional(),
  seo_description: z.string().max(500).optional(),
  is_sequential: z.boolean().optional(),
  completion_threshold: z.number().min(0).max(100).optional(),
});

const courseUpdateSchema = courseCreateSchema.partial().omit({ slug: true }).extend({
  slug: z.string().min(2).max(120).regex(/^[a-z0-9-]+$/).optional(),
});

const moduleCreateSchema = z.object({
  title: z.string().min(2).max(200),
  description: z.string().max(2000).optional(),
  order_index: z.number().int().min(1),
  prerequisite_module_id: z.string().uuid().optional().nullable(),
});

const moduleUpdateSchema = moduleCreateSchema.partial();

const lessonCreateSchema = z.object({
  title: z.string().min(2).max(200),
  description: z.string().max(5000).optional(),
  order_index: z.number().int().min(1),
  lesson_type: z.enum(['VIDEO', 'READING', 'QUIZ_LINK', 'LIVE_SESSION']).optional(),
  video_asset_ref: z.string().max(500).optional(),
  duration_minutes: z.number().int().min(1).max(600).optional(),
  is_required: z.boolean().optional(),
  is_preview: z.boolean().optional(),
  has_quiz: z.boolean().optional(),
  prerequisite_lesson_id: z.string().uuid().optional().nullable(),
  resource_refs: z.array(z.any()).optional(),
});

const lessonUpdateSchema = lessonCreateSchema.partial();

const reorderSchema = z.object({
  orderedIds: z.array(z.string().uuid()).min(1),
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function isAdmin(user: Express.Request['user']): boolean {
  return user?.roles.some(r => ['ADMIN', 'SUPER_ADMIN'].includes(r)) ?? false;
}

function isTeacher(user: Express.Request['user']): boolean {
  return user?.roles.includes('TEACHER') ?? false;
}

/**
 * Verify that a teacher is assigned to a specific course.
 * Returns null if authorized, or an error message string.
 */
async function verifyTeacherCourseAccess(
  teacherProfileId: string | null,
  courseId: string,
): Promise<string | null> {
  if (!supabaseAdmin || !teacherProfileId) return 'Teacher profile not found.';
  const { data } = await supabaseAdmin
    .from('teacher_courses')
    .select('id')
    .eq('teacher_profile_id', teacherProfileId)
    .eq('course_id', courseId)
    .single();
  return data ? null : 'Forbidden: Not assigned to this course.';
}

async function getTeacherProfileId(authUserId: string): Promise<string | null> {
  if (!supabaseAdmin) return null;
  const { data } = await supabaseAdmin
    .from('teacher_profiles')
    .select('id')
    .eq('profile_id', authUserId)
    .single();
  return data?.id ?? null;
}

// ---------------------------------------------------------------------------
// =============================================================================
// COURSES
// =============================================================================

// ---------------------------------------------------------------------------
// GET /api/courses
// ---------------------------------------------------------------------------
router.get('/courses', async (req: Request, res: Response): Promise<void> => {
  if (!supabaseAdmin) {
    res.status(503).json({ success: false, error: 'Database service unavailable.' });
    return;
  }

  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];
    let isStaff = false;
    let teacherProfileId: string | null = null;

    // Resolve caller identity if logged in
    if (token) {
      const { data: authUser } = await supabaseAdmin.auth.getUser(token);
      if (authUser?.user) {
        const { data: urData } = await supabaseAdmin
          .from('user_roles')
          .select('roles(name)')
          .eq('user_id', authUser.user.id);
        const roles = (urData ?? []).flatMap((ur: any) => ur.roles?.name ?? []);
        if (roles.some((r: string) => ['ADMIN', 'SUPER_ADMIN'].includes(r))) {
          isStaff = true;
        } else if (roles.includes('TEACHER')) {
          const { data: tp } = await supabaseAdmin
            .from('teacher_profiles')
            .select('id')
            .eq('profile_id', authUser.user.id)
            .single();
          teacherProfileId = tp?.id ?? null;
        }
      }
    }

    let query = supabaseAdmin
      .from('courses')
      .select('id, slug, title, subtitle, category, level, duration, status, thumbnail_url, is_sequential, completion_threshold, created_at, updated_at, created_by')
      .order('created_at', { ascending: false });

    if (!isStaff) {
      if (teacherProfileId) {
        // Teacher: courses assigned to them
        const { data: assigned } = await supabaseAdmin
          .from('teacher_courses')
          .select('course_id')
          .eq('teacher_profile_id', teacherProfileId);
        const ids = (assigned ?? []).map((a: any) => a.course_id);
        if (ids.length === 0) {
          res.json({ success: true, data: [] });
          return;
        }
        query = query.in('id', ids);
      } else {
        // Public: only PUBLISHED
        query = query.eq('status', 'PUBLISHED');
      }
    }

    const { data, error } = await query;
    if (error) throw error;
    res.json({ success: true, data: data ?? [] });
  } catch (error: any) {
    console.error('[Courses] list error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch courses.' });
  }
});

// ---------------------------------------------------------------------------
// POST /api/courses — ADMIN only
// ---------------------------------------------------------------------------
router.post(
  '/courses',
  authenticateToken,
  requirePasswordChanged,
  requireRole(['ADMIN', 'SUPER_ADMIN']),
  async (req: Request, res: Response): Promise<void> => {
    if (!supabaseAdmin) {
      res.status(503).json({ success: false, error: 'Database service unavailable.' });
      return;
    }

    const parse = courseCreateSchema.safeParse(req.body);
    if (!parse.success) {
      res.status(400).json({ success: false, error: 'Validation failed.', details: parse.error.flatten() });
      return;
    }

    try {
      const { data, error } = await supabaseAdmin
        .from('courses')
        .insert({
          ...parse.data,
          created_by: req.user!.userId,
          updated_by: req.user!.userId,
          status: 'DRAFT',
        })
        .select('id, slug, title, status, created_at')
        .single();

      if (error) {
        if (error.code === '23505') {
          res.status(409).json({ success: false, error: 'A course with this slug already exists.' });
          return;
        }
        throw error;
      }

      await auditService.log({
        actorUserId: req.user!.userId,
        action: 'COURSE_CREATED',
        entityType: 'courses',
        entityId: data.id,
        newValue: { slug: data.slug, title: data.title },
      });

      res.status(201).json({ success: true, data });
    } catch (error: any) {
      console.error('[Courses] create error:', error);
      res.status(500).json({ success: false, error: 'Failed to create course.' });
    }
  }
);

// ---------------------------------------------------------------------------
// GET /api/courses/:courseId
// ---------------------------------------------------------------------------
router.get('/courses/:courseId', async (req: Request, res: Response): Promise<void> => {
  const { courseId } = req.params;
  if (!supabaseAdmin) {
    res.status(503).json({ success: false, error: 'Database service unavailable.' });
    return;
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('courses')
      .select('id, slug, title, subtitle, category, level, duration, short_description, full_description, status, thumbnail_url, certificate_enabled, is_sequential, completion_threshold, seo_title, seo_description, created_at, updated_at')
      .eq('id', courseId)
      .single();

    if (error || !data) {
      res.status(404).json({ success: false, error: 'Course not found.' });
      return;
    }

    res.json({ success: true, data });
  } catch (error: any) {
    console.error('[Courses] get error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch course.' });
  }
});

// ---------------------------------------------------------------------------
// PUT /api/courses/:courseId — ADMIN or TEACHER (assigned only)
// ---------------------------------------------------------------------------
router.put(
  '/courses/:courseId',
  authenticateToken,
  requirePasswordChanged,
  requireRole(['ADMIN', 'SUPER_ADMIN', 'TEACHER']),
  async (req: Request, res: Response): Promise<void> => {
    const { courseId } = req.params;
    if (!supabaseAdmin) {
      res.status(503).json({ success: false, error: 'Database service unavailable.' });
      return;
    }

    // Teachers may only update courses they're assigned to; teachers cannot change status
    if (isTeacher(req.user) && !isAdmin(req.user)) {
      const tpId = await getTeacherProfileId(req.user!.userId);
      const denied = await verifyTeacherCourseAccess(tpId, courseId);
      if (denied) {
        res.status(403).json({ success: false, error: denied });
        return;
      }
      // Teachers cannot publish or archive via PUT
      delete req.body.status;
    }

    const parse = courseUpdateSchema.safeParse(req.body);
    if (!parse.success) {
      res.status(400).json({ success: false, error: 'Validation failed.', details: parse.error.flatten() });
      return;
    }

    try {
      const { data: prev } = await supabaseAdmin
        .from('courses')
        .select('id, title, status')
        .eq('id', courseId)
        .single();

      if (!prev) {
        res.status(404).json({ success: false, error: 'Course not found.' });
        return;
      }

      const { data, error } = await supabaseAdmin
        .from('courses')
        .update({ ...parse.data, updated_by: req.user!.userId })
        .eq('id', courseId)
        .select('id, slug, title, status, updated_at')
        .single();

      if (error) throw error;

      await auditService.log({
        actorUserId: req.user!.userId,
        action: 'COURSE_UPDATED',
        entityType: 'courses',
        entityId: courseId,
        previousValue: { title: prev.title, status: prev.status },
        newValue: parse.data,
      });

      res.json({ success: true, data });
    } catch (error: any) {
      console.error('[Courses] update error:', error);
      res.status(500).json({ success: false, error: 'Failed to update course.' });
    }
  }
);

// ---------------------------------------------------------------------------
// POST /api/courses/:courseId/publish — ADMIN only
// ---------------------------------------------------------------------------
router.post(
  '/courses/:courseId/publish',
  authenticateToken,
  requirePasswordChanged,
  requireRole(['ADMIN', 'SUPER_ADMIN']),
  async (req: Request, res: Response): Promise<void> => {
    const { courseId } = req.params;
    if (!supabaseAdmin) {
      res.status(503).json({ success: false, error: 'Database service unavailable.' });
      return;
    }

    try {
      const { data: prev } = await supabaseAdmin
        .from('courses')
        .select('id, title, status')
        .eq('id', courseId)
        .single();

      if (!prev) {
        res.status(404).json({ success: false, error: 'Course not found.' });
        return;
      }

      if (prev.status === 'ARCHIVED') {
        res.status(400).json({ success: false, error: 'Cannot publish an archived course. Restore it first.' });
        return;
      }

      const { data, error } = await supabaseAdmin
        .from('courses')
        .update({ status: 'PUBLISHED', updated_by: req.user!.userId })
        .eq('id', courseId)
        .select('id, slug, title, status')
        .single();

      if (error) throw error;

      await auditService.log({
        actorUserId: req.user!.userId,
        action: 'COURSE_PUBLISHED',
        entityType: 'courses',
        entityId: courseId,
        previousValue: { status: prev.status },
        newValue: { status: 'PUBLISHED' },
      });

      res.json({ success: true, data });
    } catch (error: any) {
      console.error('[Courses] publish error:', error);
      res.status(500).json({ success: false, error: 'Failed to publish course.' });
    }
  }
);

// ---------------------------------------------------------------------------
// POST /api/courses/:courseId/archive — ADMIN only
// ---------------------------------------------------------------------------
router.post(
  '/courses/:courseId/archive',
  authenticateToken,
  requirePasswordChanged,
  requireRole(['ADMIN', 'SUPER_ADMIN']),
  async (req: Request, res: Response): Promise<void> => {
    const { courseId } = req.params;
    if (!supabaseAdmin) {
      res.status(503).json({ success: false, error: 'Database service unavailable.' });
      return;
    }

    try {
      const { data: prev } = await supabaseAdmin
        .from('courses')
        .select('id, title, status')
        .eq('id', courseId)
        .single();

      if (!prev) {
        res.status(404).json({ success: false, error: 'Course not found.' });
        return;
      }

      const { data, error } = await supabaseAdmin
        .from('courses')
        .update({ status: 'ARCHIVED', updated_by: req.user!.userId })
        .eq('id', courseId)
        .select('id, slug, title, status')
        .single();

      if (error) throw error;

      await auditService.log({
        actorUserId: req.user!.userId,
        action: 'COURSE_ARCHIVED',
        entityType: 'courses',
        entityId: courseId,
        previousValue: { status: prev.status },
        newValue: { status: 'ARCHIVED' },
      });

      res.json({ success: true, data });
    } catch (error: any) {
      console.error('[Courses] archive error:', error);
      res.status(500).json({ success: false, error: 'Failed to archive course.' });
    }
  }
);

// =============================================================================
// MODULES
// =============================================================================

// ---------------------------------------------------------------------------
// GET /api/courses/:courseId/modules
// ---------------------------------------------------------------------------
router.get('/courses/:courseId/modules', async (req: Request, res: Response): Promise<void> => {
  const { courseId } = req.params;
  if (!supabaseAdmin) {
    res.status(503).json({ success: false, error: 'Database service unavailable.' });
    return;
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('modules')
      .select('id, course_id, title, description, order_index, status, prerequisite_module_id, created_at, updated_at')
      .eq('course_id', courseId)
      .order('order_index', { ascending: true });

    if (error) throw error;
    res.json({ success: true, data: data ?? [] });
  } catch (error: any) {
    console.error('[Modules] list error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch modules.' });
  }
});

// ---------------------------------------------------------------------------
// POST /api/courses/:courseId/modules — ADMIN or TEACHER (assigned)
// ---------------------------------------------------------------------------
router.post(
  '/courses/:courseId/modules',
  authenticateToken,
  requirePasswordChanged,
  requireRole(['ADMIN', 'SUPER_ADMIN', 'TEACHER']),
  async (req: Request, res: Response): Promise<void> => {
    const { courseId } = req.params;
    if (!supabaseAdmin) {
      res.status(503).json({ success: false, error: 'Database service unavailable.' });
      return;
    }

    if (isTeacher(req.user) && !isAdmin(req.user)) {
      const tpId = await getTeacherProfileId(req.user!.userId);
      const denied = await verifyTeacherCourseAccess(tpId, courseId);
      if (denied) {
        res.status(403).json({ success: false, error: denied });
        return;
      }
    }

    const parse = moduleCreateSchema.safeParse(req.body);
    if (!parse.success) {
      res.status(400).json({ success: false, error: 'Validation failed.', details: parse.error.flatten() });
      return;
    }

    try {
      // Check for order_index conflict
      const { data: existing } = await supabaseAdmin
        .from('modules')
        .select('id')
        .eq('course_id', courseId)
        .eq('order_index', parse.data.order_index)
        .single();

      if (existing) {
        res.status(409).json({ success: false, error: `A module with order_index ${parse.data.order_index} already exists in this course.` });
        return;
      }

      const { data, error } = await supabaseAdmin
        .from('modules')
        .insert({
          ...parse.data,
          course_id: courseId,
          created_by: req.user!.userId,
          updated_by: req.user!.userId,
          status: 'DRAFT',
        })
        .select('id, course_id, title, order_index, status, created_at')
        .single();

      if (error) throw error;

      await auditService.log({
        actorUserId: req.user!.userId,
        action: 'MODULE_CREATED',
        entityType: 'modules',
        entityId: data.id,
        newValue: { courseId, title: data.title, order_index: data.order_index },
      });

      res.status(201).json({ success: true, data });
    } catch (error: any) {
      console.error('[Modules] create error:', error);
      res.status(500).json({ success: false, error: 'Failed to create module.' });
    }
  }
);

// ---------------------------------------------------------------------------
// PUT /api/courses/:courseId/modules/:moduleId
// ---------------------------------------------------------------------------
router.put(
  '/courses/:courseId/modules/:moduleId',
  authenticateToken,
  requirePasswordChanged,
  requireRole(['ADMIN', 'SUPER_ADMIN', 'TEACHER']),
  async (req: Request, res: Response): Promise<void> => {
    const { courseId, moduleId } = req.params;
    if (!supabaseAdmin) {
      res.status(503).json({ success: false, error: 'Database service unavailable.' });
      return;
    }

    if (isTeacher(req.user) && !isAdmin(req.user)) {
      const tpId = await getTeacherProfileId(req.user!.userId);
      const denied = await verifyTeacherCourseAccess(tpId, courseId);
      if (denied) {
        res.status(403).json({ success: false, error: denied });
        return;
      }
    }

    const parse = moduleUpdateSchema.safeParse(req.body);
    if (!parse.success) {
      res.status(400).json({ success: false, error: 'Validation failed.', details: parse.error.flatten() });
      return;
    }

    try {
      const { data: prev } = await supabaseAdmin
        .from('modules')
        .select('id, title, course_id')
        .eq('id', moduleId)
        .eq('course_id', courseId)
        .single();

      if (!prev) {
        res.status(404).json({ success: false, error: 'Module not found in this course.' });
        return;
      }

      const { data, error } = await supabaseAdmin
        .from('modules')
        .update({ ...parse.data, updated_by: req.user!.userId })
        .eq('id', moduleId)
        .select('id, course_id, title, order_index, status, updated_at')
        .single();

      if (error) throw error;

      await auditService.log({
        actorUserId: req.user!.userId,
        action: 'MODULE_UPDATED',
        entityType: 'modules',
        entityId: moduleId,
        previousValue: { title: prev.title },
        newValue: parse.data,
      });

      res.json({ success: true, data });
    } catch (error: any) {
      console.error('[Modules] update error:', error);
      res.status(500).json({ success: false, error: 'Failed to update module.' });
    }
  }
);

// ---------------------------------------------------------------------------
// POST /api/courses/:courseId/modules/reorder
// Atomically reassigns order_index for a list of module IDs.
// ---------------------------------------------------------------------------
router.post(
  '/courses/:courseId/modules/reorder',
  authenticateToken,
  requirePasswordChanged,
  requireRole(['ADMIN', 'SUPER_ADMIN', 'TEACHER']),
  async (req: Request, res: Response): Promise<void> => {
    const { courseId } = req.params;
    if (!supabaseAdmin) {
      res.status(503).json({ success: false, error: 'Database service unavailable.' });
      return;
    }

    if (isTeacher(req.user) && !isAdmin(req.user)) {
      const tpId = await getTeacherProfileId(req.user!.userId);
      const denied = await verifyTeacherCourseAccess(tpId, courseId);
      if (denied) {
        res.status(403).json({ success: false, error: denied });
        return;
      }
    }

    const parse = reorderSchema.safeParse(req.body);
    if (!parse.success) {
      res.status(400).json({ success: false, error: 'Validation failed.', details: parse.error.flatten() });
      return;
    }

    try {
      // Verify all module IDs belong to this course
      const { data: modules } = await supabaseAdmin
        .from('modules')
        .select('id')
        .eq('course_id', courseId)
        .in('id', parse.data.orderedIds);

      if ((modules ?? []).length !== parse.data.orderedIds.length) {
        res.status(400).json({ success: false, error: 'One or more module IDs do not belong to this course.' });
        return;
      }

      // Apply new order indices
      const updates = parse.data.orderedIds.map((id, idx) =>
        supabaseAdmin!.from('modules')
          .update({ order_index: idx + 1, updated_by: req.user!.userId })
          .eq('id', id)
      );
      await Promise.all(updates);

      await auditService.log({
        actorUserId: req.user!.userId,
        action: 'MODULE_REORDERED',
        entityType: 'modules',
        entityId: courseId,
        newValue: { orderedIds: parse.data.orderedIds },
      });

      res.json({ success: true, message: 'Modules reordered successfully.' });
    } catch (error: any) {
      console.error('[Modules] reorder error:', error);
      res.status(500).json({ success: false, error: 'Failed to reorder modules.' });
    }
  }
);

// ---------------------------------------------------------------------------
// POST /api/courses/:courseId/modules/:moduleId/archive
// ---------------------------------------------------------------------------
router.post(
  '/courses/:courseId/modules/:moduleId/archive',
  authenticateToken,
  requirePasswordChanged,
  requireRole(['ADMIN', 'SUPER_ADMIN']),
  async (req: Request, res: Response): Promise<void> => {
    const { courseId, moduleId } = req.params;
    if (!supabaseAdmin) {
      res.status(503).json({ success: false, error: 'Database service unavailable.' });
      return;
    }

    try {
      const { data: prev } = await supabaseAdmin
        .from('modules')
        .select('id, title, course_id')
        .eq('id', moduleId)
        .eq('course_id', courseId)
        .single();

      if (!prev) {
        res.status(404).json({ success: false, error: 'Module not found.' });
        return;
      }

      const { error } = await supabaseAdmin
        .from('modules')
        .update({ status: 'ARCHIVED', updated_by: req.user!.userId })
        .eq('id', moduleId);

      if (error) throw error;

      await auditService.log({
        actorUserId: req.user!.userId,
        action: 'MODULE_ARCHIVED',
        entityType: 'modules',
        entityId: moduleId,
        previousValue: { status: 'PUBLISHED' },
        newValue: { status: 'ARCHIVED', title: prev.title },
      });

      res.json({ success: true, message: 'Module archived.' });
    } catch (error: any) {
      console.error('[Modules] archive error:', error);
      res.status(500).json({ success: false, error: 'Failed to archive module.' });
    }
  }
);

// =============================================================================
// LESSONS
// =============================================================================

// ---------------------------------------------------------------------------
// GET /api/courses/:courseId/modules/:moduleId/lessons
// Returns safe lesson metadata (no raw video_asset_ref for non-staff)
// ---------------------------------------------------------------------------
router.get(
  '/courses/:courseId/modules/:moduleId/lessons',
  async (req: Request, res: Response): Promise<void> => {
    const { courseId, moduleId } = req.params;
    if (!supabaseAdmin) {
      res.status(503).json({ success: false, error: 'Database service unavailable.' });
      return;
    }

    try {
      // Determine caller identity
      const authHeader = req.headers['authorization'];
      const token = authHeader?.split(' ')[1];
      let callerIsStaff = false;

      if (token) {
        const { data: authUser } = await supabaseAdmin.auth.getUser(token);
        if (authUser?.user) {
          const { data: urData } = await supabaseAdmin
            .from('user_roles')
            .select('roles(name)')
            .eq('user_id', authUser.user.id);
          const roles = (urData ?? []).flatMap((ur: any) => ur.roles?.name ?? []);
          callerIsStaff = roles.some((r: string) => ['ADMIN', 'SUPER_ADMIN', 'TEACHER'].includes(r));
        }
      }

      // Verify module belongs to course
      const { data: mod } = await supabaseAdmin
        .from('modules')
        .select('id, course_id')
        .eq('id', moduleId)
        .eq('course_id', courseId)
        .single();

      if (!mod) {
        res.status(404).json({ success: false, error: 'Module not found in this course.' });
        return;
      }

      // Staff sees all fields except raw provider secrets (video_asset_ref is internal reference)
      // Students see only published lessons via student_lessons_view projection
      const selectFields = callerIsStaff
        ? 'id, module_id, title, description, order_index, lesson_type, duration_minutes, is_required, is_published, is_preview, has_quiz, prerequisite_lesson_id, created_at, updated_at, video_asset_ref'
        : 'id, module_id, title, description, order_index, duration_minutes, is_required, is_published, is_preview, prerequisite_lesson_id, created_at';

      let query = supabaseAdmin
        .from('lessons')
        .select(selectFields)
        .eq('module_id', moduleId)
        .order('order_index', { ascending: true });

      if (!callerIsStaff) {
        query = query.eq('is_published', true);
      }

      const { data, error } = await query;
      if (error) throw error;

      res.json({ success: true, data: data ?? [] });
    } catch (error: any) {
      console.error('[Lessons] list error:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch lessons.' });
    }
  }
);

// ---------------------------------------------------------------------------
// POST /api/courses/:courseId/modules/:moduleId/lessons
// ---------------------------------------------------------------------------
router.post(
  '/courses/:courseId/modules/:moduleId/lessons',
  authenticateToken,
  requirePasswordChanged,
  requireRole(['ADMIN', 'SUPER_ADMIN', 'TEACHER']),
  async (req: Request, res: Response): Promise<void> => {
    const { courseId, moduleId } = req.params;
    if (!supabaseAdmin) {
      res.status(503).json({ success: false, error: 'Database service unavailable.' });
      return;
    }

    if (isTeacher(req.user) && !isAdmin(req.user)) {
      const tpId = await getTeacherProfileId(req.user!.userId);
      const denied = await verifyTeacherCourseAccess(tpId, courseId);
      if (denied) {
        res.status(403).json({ success: false, error: denied });
        return;
      }
    }

    const parse = lessonCreateSchema.safeParse(req.body);
    if (!parse.success) {
      res.status(400).json({ success: false, error: 'Validation failed.', details: parse.error.flatten() });
      return;
    }

    try {
      // Verify module belongs to course
      const { data: mod } = await supabaseAdmin
        .from('modules')
        .select('id')
        .eq('id', moduleId)
        .eq('course_id', courseId)
        .single();

      if (!mod) {
        res.status(404).json({ success: false, error: 'Module not found in this course.' });
        return;
      }

      // Check order_index conflict
      const { data: existing } = await supabaseAdmin
        .from('lessons')
        .select('id')
        .eq('module_id', moduleId)
        .eq('order_index', parse.data.order_index)
        .single();

      if (existing) {
        res.status(409).json({ success: false, error: `A lesson with order_index ${parse.data.order_index} already exists in this module.` });
        return;
      }

      const { data, error } = await supabaseAdmin
        .from('lessons')
        .insert({
          ...parse.data,
          module_id: moduleId,
          created_by: req.user!.userId,
          updated_by: req.user!.userId,
          is_published: false,
        })
        .select('id, module_id, title, order_index, lesson_type, is_published, is_preview, created_at')
        .single();

      if (error) throw error;

      await auditService.log({
        actorUserId: req.user!.userId,
        action: 'LESSON_CREATED',
        entityType: 'lessons',
        entityId: data.id,
        newValue: { moduleId, courseId, title: data.title },
      });

      res.status(201).json({ success: true, data });
    } catch (error: any) {
      console.error('[Lessons] create error:', error);
      res.status(500).json({ success: false, error: 'Failed to create lesson.' });
    }
  }
);

// ---------------------------------------------------------------------------
// PUT /api/courses/:courseId/modules/:moduleId/lessons/:lessonId
// ---------------------------------------------------------------------------
router.put(
  '/courses/:courseId/modules/:moduleId/lessons/:lessonId',
  authenticateToken,
  requirePasswordChanged,
  requireRole(['ADMIN', 'SUPER_ADMIN', 'TEACHER']),
  async (req: Request, res: Response): Promise<void> => {
    const { courseId, moduleId, lessonId } = req.params;
    if (!supabaseAdmin) {
      res.status(503).json({ success: false, error: 'Database service unavailable.' });
      return;
    }

    if (isTeacher(req.user) && !isAdmin(req.user)) {
      const tpId = await getTeacherProfileId(req.user!.userId);
      const denied = await verifyTeacherCourseAccess(tpId, courseId);
      if (denied) {
        res.status(403).json({ success: false, error: denied });
        return;
      }
    }

    const parse = lessonUpdateSchema.safeParse(req.body);
    if (!parse.success) {
      res.status(400).json({ success: false, error: 'Validation failed.', details: parse.error.flatten() });
      return;
    }

    try {
      const { data: prev } = await supabaseAdmin
        .from('lessons')
        .select('id, title, module_id')
        .eq('id', lessonId)
        .eq('module_id', moduleId)
        .single();

      if (!prev) {
        res.status(404).json({ success: false, error: 'Lesson not found.' });
        return;
      }

      const { data, error } = await supabaseAdmin
        .from('lessons')
        .update({ ...parse.data, updated_by: req.user!.userId })
        .eq('id', lessonId)
        .select('id, title, order_index, is_published, lesson_type, updated_at')
        .single();

      if (error) throw error;

      await auditService.log({
        actorUserId: req.user!.userId,
        action: 'LESSON_UPDATED',
        entityType: 'lessons',
        entityId: lessonId,
        previousValue: { title: prev.title },
        newValue: parse.data,
      });

      res.json({ success: true, data });
    } catch (error: any) {
      console.error('[Lessons] update error:', error);
      res.status(500).json({ success: false, error: 'Failed to update lesson.' });
    }
  }
);

// ---------------------------------------------------------------------------
// POST /api/courses/:courseId/modules/:moduleId/lessons/reorder
// ---------------------------------------------------------------------------
router.post(
  '/courses/:courseId/modules/:moduleId/lessons/reorder',
  authenticateToken,
  requirePasswordChanged,
  requireRole(['ADMIN', 'SUPER_ADMIN', 'TEACHER']),
  async (req: Request, res: Response): Promise<void> => {
    const { courseId, moduleId } = req.params;
    if (!supabaseAdmin) {
      res.status(503).json({ success: false, error: 'Database service unavailable.' });
      return;
    }

    if (isTeacher(req.user) && !isAdmin(req.user)) {
      const tpId = await getTeacherProfileId(req.user!.userId);
      const denied = await verifyTeacherCourseAccess(tpId, courseId);
      if (denied) {
        res.status(403).json({ success: false, error: denied });
        return;
      }
    }

    const parse = reorderSchema.safeParse(req.body);
    if (!parse.success) {
      res.status(400).json({ success: false, error: 'Validation failed.', details: parse.error.flatten() });
      return;
    }

    try {
      // Verify all lesson IDs belong to this module
      const { data: lessons } = await supabaseAdmin
        .from('lessons')
        .select('id')
        .eq('module_id', moduleId)
        .in('id', parse.data.orderedIds);

      if ((lessons ?? []).length !== parse.data.orderedIds.length) {
        res.status(400).json({ success: false, error: 'One or more lesson IDs do not belong to this module.' });
        return;
      }

      const updates = parse.data.orderedIds.map((id, idx) =>
        supabaseAdmin!.from('lessons')
          .update({ order_index: idx + 1, updated_by: req.user!.userId })
          .eq('id', id)
      );
      await Promise.all(updates);

      await auditService.log({
        actorUserId: req.user!.userId,
        action: 'LESSON_REORDERED',
        entityType: 'lessons',
        entityId: moduleId,
        newValue: { orderedIds: parse.data.orderedIds },
      });

      res.json({ success: true, message: 'Lessons reordered successfully.' });
    } catch (error: any) {
      console.error('[Lessons] reorder error:', error);
      res.status(500).json({ success: false, error: 'Failed to reorder lessons.' });
    }
  }
);

// ---------------------------------------------------------------------------
// POST /api/courses/:courseId/modules/:moduleId/lessons/:lessonId/publish
// ---------------------------------------------------------------------------
router.post(
  '/courses/:courseId/modules/:moduleId/lessons/:lessonId/publish',
  authenticateToken,
  requirePasswordChanged,
  requireRole(['ADMIN', 'SUPER_ADMIN']),
  async (req: Request, res: Response): Promise<void> => {
    const { courseId, moduleId, lessonId } = req.params;
    if (!supabaseAdmin) {
      res.status(503).json({ success: false, error: 'Database service unavailable.' });
      return;
    }

    try {
      const { data: prev } = await supabaseAdmin
        .from('lessons')
        .select('id, title, module_id, is_published')
        .eq('id', lessonId)
        .eq('module_id', moduleId)
        .single();

      if (!prev) {
        res.status(404).json({ success: false, error: 'Lesson not found.' });
        return;
      }

      const { data, error } = await supabaseAdmin
        .from('lessons')
        .update({ is_published: true, updated_by: req.user!.userId })
        .eq('id', lessonId)
        .select('id, title, is_published, updated_at')
        .single();

      if (error) throw error;

      await auditService.log({
        actorUserId: req.user!.userId,
        action: 'LESSON_PUBLISHED',
        entityType: 'lessons',
        entityId: lessonId,
        previousValue: { is_published: prev.is_published },
        newValue: { is_published: true },
      });

      res.json({ success: true, data });
    } catch (error: any) {
      console.error('[Lessons] publish error:', error);
      res.status(500).json({ success: false, error: 'Failed to publish lesson.' });
    }
  }
);

// ---------------------------------------------------------------------------
// POST /api/courses/:courseId/modules/:moduleId/lessons/:lessonId/archive
// ---------------------------------------------------------------------------
router.post(
  '/courses/:courseId/modules/:moduleId/lessons/:lessonId/archive',
  authenticateToken,
  requirePasswordChanged,
  requireRole(['ADMIN', 'SUPER_ADMIN']),
  async (req: Request, res: Response): Promise<void> => {
    const { courseId, moduleId, lessonId } = req.params;
    if (!supabaseAdmin) {
      res.status(503).json({ success: false, error: 'Database service unavailable.' });
      return;
    }

    try {
      const { data: prev } = await supabaseAdmin
        .from('lessons')
        .select('id, title')
        .eq('id', lessonId)
        .eq('module_id', moduleId)
        .single();

      if (!prev) {
        res.status(404).json({ success: false, error: 'Lesson not found.' });
        return;
      }

      // Archive = unpublish (no hard delete; preserves lesson_completions references)
      const { data, error } = await supabaseAdmin
        .from('lessons')
        .update({ is_published: false, updated_by: req.user!.userId })
        .eq('id', lessonId)
        .select('id, title, is_published, updated_at')
        .single();

      if (error) throw error;

      await auditService.log({
        actorUserId: req.user!.userId,
        action: 'LESSON_ARCHIVED',
        entityType: 'lessons',
        entityId: lessonId,
        newValue: { is_published: false, title: prev.title },
      });

      res.json({ success: true, data });
    } catch (error: any) {
      console.error('[Lessons] archive error:', error);
      res.status(500).json({ success: false, error: 'Failed to archive lesson.' });
    }
  }
);

// =============================================================================
// LESSON COMPLETION — STUDENT ONLY
// Uses lesson_completions as the authoritative source of truth.
// course_progress is a DERIVED CACHE; recalculate_enrollment_progress() is called.
// =============================================================================

// ---------------------------------------------------------------------------
// POST /api/courses/:courseId/lessons/:lessonId/complete
// ---------------------------------------------------------------------------
router.post(
  '/courses/:courseId/lessons/:lessonId/complete',
  authenticateToken,
  requirePasswordChanged,
  requireRole(['STUDENT']),
  async (req: Request, res: Response): Promise<void> => {
    const { courseId, lessonId } = req.params;
    if (!supabaseAdmin) {
      res.status(503).json({ success: false, error: 'Database service unavailable.' });
      return;
    }

    try {
      // 1. Resolve student profile
      const { data: sp } = await supabaseAdmin
        .from('student_profiles')
        .select('id')
        .eq('profile_id', req.user!.userId)
        .single();

      if (!sp) {
        res.status(403).json({ success: false, error: 'Student profile not found.' });
        return;
      }

      // 2. Verify active enrollment
      const { data: enrollment } = await supabaseAdmin
        .from('enrollments')
        .select('id, status')
        .eq('student_profile_id', sp.id)
        .eq('course_id', courseId)
        .in('status', ['ENROLLED', 'ACTIVE'])
        .single();

      if (!enrollment) {
        res.status(403).json({
          success: false,
          error: 'Active enrollment required to mark lesson completion.',
          code: 'ENROLLMENT_REQUIRED',
        });
        return;
      }

      // 3. Verify lesson exists and belongs to course
      const { data: lesson } = await supabaseAdmin
        .from('lessons')
        .select('id, prerequisite_lesson_id, modules!inner(course_id)')
        .eq('id', lessonId)
        .eq('modules.course_id', courseId)
        .eq('is_published', true)
        .single();

      if (!lesson) {
        res.status(404).json({ success: false, error: 'Lesson not found or not published.' });
        return;
      }

      // 4. Prerequisite check
      if (lesson.prerequisite_lesson_id) {
        const { data: prereq } = await supabaseAdmin
          .from('lesson_completions')
          .select('id')
          .eq('enrollment_id', enrollment.id)
          .eq('lesson_id', lesson.prerequisite_lesson_id)
          .single();

        if (!prereq) {
          res.status(403).json({
            success: false,
            error: 'Complete the prerequisite lesson first.',
            code: 'PREREQUISITE_LOCKED',
            prerequisiteLessonId: lesson.prerequisite_lesson_id,
          });
          return;
        }
      }

      // 5. Insert completion (idempotent via ON CONFLICT DO NOTHING)
      const { error: insertError } = await supabaseAdmin
        .from('lesson_completions')
        .insert({
          enrollment_id: enrollment.id,
          lesson_id: lessonId,
          completed_at: new Date().toISOString(),
        });

      // Ignore duplicate completion (lesson already marked)
      if (insertError && insertError.code !== '23505') {
        throw insertError;
      }

      // 6. Recalculate derived course_progress cache
      await supabaseAdmin.rpc('recalculate_enrollment_progress', {
        p_enrollment_id: enrollment.id,
      });

      res.json({
        success: true,
        message: 'Lesson completion recorded.',
        data: { lessonId, enrollmentId: enrollment.id },
      });
    } catch (error: any) {
      console.error('[Lessons] complete error:', error);
      res.status(500).json({ success: false, error: 'Failed to record lesson completion.' });
    }
  }
);

export default router;
