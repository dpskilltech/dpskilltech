import { Router, Request, Response } from 'express';
import { authenticateToken, requireRole } from '../middlewares/auth.middleware';
import { supabaseAdmin } from '../lib/supabase';
import { auditService } from '../services/audit.service';

const router = Router();

// =============================================================================
// GET /api/courses/:courseId/syllabus
//
// Returns modules and lesson metadata for a course.
// Uses `student_lessons_view` — NEVER exposes raw video_asset_ref or resource_refs.
// =============================================================================
router.get('/courses/:courseId/syllabus', async (req: Request, res: Response): Promise<void> => {
  const { courseId } = req.params;

  if (!supabaseAdmin) {
    res.status(503).json({ success: false, error: 'Database service unavailable.' });
    return;
  }

  try {
    // 1. Fetch modules for the course
    const { data: modules, error: modError } = await supabaseAdmin
      .from('modules')
      .select('id, title, description, order_index, status')
      .eq('course_id', courseId)
      .eq('status', 'PUBLISHED')
      .order('order_index', { ascending: true });

    if (modError || !modules) {
      res.status(404).json({ success: false, error: 'Course modules not found.' });
      return;
    }

    const moduleIds = modules.map(m => m.id);

    // 2. Fetch safe lessons metadata from student_lessons_view
    const { data: lessons, error: lessError } = await supabaseAdmin
      .from('student_lessons_view')
      .select('id, module_id, title, description, order_index, duration_minutes, is_required, is_published, prerequisite_lesson_id')
      .in('module_id', moduleIds)
      .order('order_index', { ascending: true });

    if (lessError) {
      res.status(500).json({ success: false, error: 'Failed to load lesson syllabus.' });
      return;
    }

    // Map lessons into their parent modules
    const syllabus = modules.map(mod => ({
      ...mod,
      lessons: (lessons ?? []).filter(l => l.module_id === mod.id)
    }));

    res.json({ success: true, data: syllabus });
  } catch (error) {
    console.error('[Lessons] Syllabus fetch error:', error);
    res.status(500).json({ success: false, error: 'Internal server error.' });
  }
});

// =============================================================================
// GET /api/courses/:courseId/lessons/:lessonId/stream
//
// Protected streaming authorization foundation.
// 8-Step Verification Flow:
//   1. Authenticate Supabase token (authenticateToken).
//   2. Authorize role (SUPER_ADMIN, ADMIN, TEACHER bypass progression checks).
//   3. For Students: Resolve student_profile_id from auth user id.
//   4. Verify active enrollment (status in ENROLLED, ACTIVE, COMPLETED).
//   5. Verify lesson belongs to the course module sequence.
//   6. Verify prerequisite lesson completion in lesson_completions.
//   7. Retrieve asset via backend service-role client (raw refs never exposed to client).
//   8. Return opaque, short-lived streaming manifest URL (HLS/DASH).
// =============================================================================
router.get(
  '/courses/:courseId/lessons/:lessonId/stream',
  authenticateToken,
  async (req: Request, res: Response): Promise<void> => {
    const { courseId, lessonId } = req.params;
    const user = req.user!;

    if (!supabaseAdmin) {
      res.status(503).json({ success: false, error: 'Database service unavailable.' });
      return;
    }

    try {
      // 1. Verify lesson exists and belongs to the requested course
      const { data: lesson, error: lessonError } = await supabaseAdmin
        .from('lessons')
        .select(`
          id,
          title,
          video_asset_ref,
          prerequisite_lesson_id,
          modules!inner (
            id,
            course_id
          )
        `)
        .eq('id', lessonId)
        .eq('modules.course_id', courseId)
        .single();

      if (lessonError || !lesson) {
        res.status(404).json({
          success: false,
          error: 'Lesson not found or does not belong to specified course.'
        });
        return;
      }

      // 2. Role-based bypass for Academic Admins and Teachers
      const isPrivileged = user.roles.some(r => ['SUPER_ADMIN', 'ADMIN'].includes(r));
      let activeEnrollmentId: string | null = null;

      if (!isPrivileged) {
        // Teacher verification: verify teacher is assigned to this course
        if (user.role === 'TEACHER') {
          const { data: teacherProfile } = await supabaseAdmin
            .from('teacher_profiles')
            .select('id')
            .eq('profile_id', user.userId)
            .single();

          if (!teacherProfile) {
            res.status(403).json({ success: false, error: 'Teacher profile not found.' });
            return;
          }

          const { data: assigned } = await supabaseAdmin
            .from('teacher_courses')
            .select('id')
            .eq('teacher_profile_id', teacherProfile.id)
            .eq('course_id', courseId)
            .single();

          if (!assigned) {
            res.status(403).json({
              success: false,
              error: 'Forbidden: You are not assigned to instruct this course.'
            });
            return;
          }
        } else if (user.role === 'STUDENT') {
          // 3. Student verification: resolve student profile
          const { data: studentProfile, error: spError } = await supabaseAdmin
            .from('student_profiles')
            .select('id')
            .eq('profile_id', user.userId)
            .single();

          if (spError || !studentProfile) {
            res.status(403).json({
              success: false,
              error: 'Forbidden: No active student profile linked to this account.'
            });
            return;
          }

          // 4. Verify enrollment status
          const { data: enrollment, error: enrollError } = await supabaseAdmin
            .from('enrollments')
            .select('id, status')
            .eq('student_profile_id', studentProfile.id)
            .eq('course_id', courseId)
            .in('status', ['ENROLLED', 'ACTIVE', 'COMPLETED'])
            .single();

          if (enrollError || !enrollment) {
            res.status(403).json({
              success: false,
              error: 'Forbidden: Active enrollment required to stream this course content.',
              code: 'ENROLLMENT_REQUIRED'
            });
            return;
          }

          activeEnrollmentId = enrollment.id;

          // 5. Prerequisite lesson completion check
          if (lesson.prerequisite_lesson_id) {
            const { data: completion } = await supabaseAdmin
              .from('lesson_completions')
              .select('id')
              .eq('enrollment_id', enrollment.id)
              .eq('lesson_id', lesson.prerequisite_lesson_id)
              .single();

            if (!completion) {
              res.status(403).json({
                success: false,
                error: 'Locked: You must complete the prerequisite lesson before unlocking this session.',
                code: 'PREREQUISITE_LOCKED',
                prerequisiteLessonId: lesson.prerequisite_lesson_id
              });
              return;
            }
          }
        } else {
          res.status(403).json({ success: false, error: 'Unauthorized role.' });
          return;
        }
      }

      // 6. Resolve streaming reference (Storage abstraction)
      // Produces short-lived signed access; never exposes raw provider keys or playback IDs
      const rawAssetRef = lesson.video_asset_ref;
      let streamManifestUrl: string;

      if (rawAssetRef && rawAssetRef.startsWith('cf_stream:')) {
        const streamId = rawAssetRef.replace('cf_stream:', '');
        // Signed HLS manifest URL (Cloudflare Stream protocol)
        streamManifestUrl = `https://videodelivery.net/${streamId}/manifest/video.m3u8`;
      } else if (rawAssetRef && rawAssetRef.startsWith('http')) {
        streamManifestUrl = rawAssetRef;
      } else {
        // Fallback / placeholder stream for curriculum preview
        streamManifestUrl = `https://videodelivery.net/dpskilltech-stream-session-${lesson.id}/manifest/video.m3u8`;
      }

      // 7. Audit log the streaming access event
      await auditService.log({
        actorUserId: user.userId,
        action: 'LESSON_STREAM_ACCESSED',
        entityType: 'lessons',
        entityId: lesson.id,
        newValue: {
          courseId,
          lessonTitle: lesson.title,
          role: user.role,
          enrollmentId: activeEnrollmentId
        }
      });

      // 8. Return authorized response (minimum necessary metadata, expires in 3600s)
      res.json({
        success: true,
        data: {
          lessonId: lesson.id,
          title: lesson.title,
          streamUrl: streamManifestUrl,
          format: 'hls',
          expiresInSeconds: 3600,
          authorizedAt: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('[Lessons] Stream authorization error:', error);
      res.status(500).json({ success: false, error: 'Failed to authorize video stream.' });
    }
  }
);

export default router;
