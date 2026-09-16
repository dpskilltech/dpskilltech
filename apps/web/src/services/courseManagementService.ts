/**
 * DP SKILL TECH ACADEMY — Course Management API Service (Phase 3)
 *
 * Typed client for course, module, and lesson management endpoints.
 * Uses the Express API (apps/api) as the intermediary — never calls
 * Supabase service_role directly from the frontend.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function getAuthHeaders(): HeadersInit {
  // Supabase stores the session in localStorage under supabase.auth.token
  const sessionRaw = localStorage.getItem('sb-wkhoxbpkikvfdnchisrd-auth-token')
    || localStorage.getItem('supabase.auth.token');
  let token: string | null = null;
  if (sessionRaw) {
    try {
      const session = JSON.parse(sessionRaw);
      token = session?.access_token ?? session?.currentSession?.access_token ?? null;
    } catch {
      token = null;
    }
  }
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...(options?.headers ?? {}),
    },
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || `API error ${res.status}`);
  }
  return json.data as T;
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type CourseStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type ModuleStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type LessonType = 'VIDEO' | 'READING' | 'QUIZ_LINK' | 'LIVE_SESSION';

export interface Course {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  category: string;
  level: string;
  duration: string;
  short_description?: string;
  full_description?: string;
  status: CourseStatus;
  thumbnail_url?: string;
  certificate_enabled?: boolean;
  is_sequential?: boolean;
  completion_threshold?: number;
  seo_title?: string;
  seo_description?: string;
  created_at: string;
  updated_at: string;
}

export interface CourseModule {
  id: string;
  course_id: string;
  title: string;
  description?: string;
  order_index: number;
  status: ModuleStatus;
  prerequisite_module_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: string;
  module_id: string;
  title: string;
  description?: string;
  order_index: number;
  lesson_type?: LessonType;
  duration_minutes?: number;
  is_required?: boolean;
  is_published: boolean;
  is_preview?: boolean;
  has_quiz?: boolean;
  prerequisite_lesson_id?: string | null;
  video_asset_ref?: string; // Only visible to staff
  created_at: string;
  updated_at?: string;
}

export interface CourseCreatePayload {
  slug: string;
  title: string;
  subtitle?: string;
  category: string;
  level: string;
  duration: string;
  short_description?: string;
  full_description?: string;
  thumbnail_url?: string;
  seo_title?: string;
  seo_description?: string;
  is_sequential?: boolean;
  completion_threshold?: number;
}

export interface ModuleCreatePayload {
  title: string;
  description?: string;
  order_index: number;
  prerequisite_module_id?: string | null;
}

export interface LessonCreatePayload {
  title: string;
  description?: string;
  order_index: number;
  lesson_type?: LessonType;
  video_asset_ref?: string;
  duration_minutes?: number;
  is_required?: boolean;
  is_preview?: boolean;
  has_quiz?: boolean;
  prerequisite_lesson_id?: string | null;
}

// ---------------------------------------------------------------------------
// Course operations
// ---------------------------------------------------------------------------
export const courseManagementService = {
  listCourses: (): Promise<Course[]> =>
    apiFetch<Course[]>('/courses'),

  getCourse: (courseId: string): Promise<Course> =>
    apiFetch<Course>(`/courses/${courseId}`),

  createCourse: (payload: CourseCreatePayload): Promise<Course> =>
    apiFetch<Course>('/courses', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  updateCourse: (courseId: string, payload: Partial<CourseCreatePayload>): Promise<Course> =>
    apiFetch<Course>(`/courses/${courseId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  publishCourse: (courseId: string): Promise<Course> =>
    apiFetch<Course>(`/courses/${courseId}/publish`, { method: 'POST' }),

  archiveCourse: (courseId: string): Promise<Course> =>
    apiFetch<Course>(`/courses/${courseId}/archive`, { method: 'POST' }),

  // Modules
  listModules: (courseId: string): Promise<CourseModule[]> =>
    apiFetch<CourseModule[]>(`/courses/${courseId}/modules`),

  createModule: (courseId: string, payload: ModuleCreatePayload): Promise<CourseModule> =>
    apiFetch<CourseModule>(`/courses/${courseId}/modules`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  updateModule: (courseId: string, moduleId: string, payload: Partial<ModuleCreatePayload>): Promise<CourseModule> =>
    apiFetch<CourseModule>(`/courses/${courseId}/modules/${moduleId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  reorderModules: (courseId: string, orderedIds: string[]): Promise<void> =>
    apiFetch<void>(`/courses/${courseId}/modules/reorder`, {
      method: 'POST',
      body: JSON.stringify({ orderedIds }),
    }),

  archiveModule: (courseId: string, moduleId: string): Promise<void> =>
    apiFetch<void>(`/courses/${courseId}/modules/${moduleId}/archive`, { method: 'POST' }),

  // Lessons
  listLessons: (courseId: string, moduleId: string): Promise<Lesson[]> =>
    apiFetch<Lesson[]>(`/courses/${courseId}/modules/${moduleId}/lessons`),

  createLesson: (courseId: string, moduleId: string, payload: LessonCreatePayload): Promise<Lesson> =>
    apiFetch<Lesson>(`/courses/${courseId}/modules/${moduleId}/lessons`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  updateLesson: (courseId: string, moduleId: string, lessonId: string, payload: Partial<LessonCreatePayload>): Promise<Lesson> =>
    apiFetch<Lesson>(`/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  reorderLessons: (courseId: string, moduleId: string, orderedIds: string[]): Promise<void> =>
    apiFetch<void>(`/courses/${courseId}/modules/${moduleId}/lessons/reorder`, {
      method: 'POST',
      body: JSON.stringify({ orderedIds }),
    }),

  publishLesson: (courseId: string, moduleId: string, lessonId: string): Promise<Lesson> =>
    apiFetch<Lesson>(`/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/publish`, { method: 'POST' }),

  archiveLesson: (courseId: string, moduleId: string, lessonId: string): Promise<Lesson> =>
    apiFetch<Lesson>(`/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/archive`, { method: 'POST' }),

  // Student: mark lesson complete
  markLessonComplete: (courseId: string, lessonId: string): Promise<void> =>
    apiFetch<void>(`/courses/${courseId}/lessons/${lessonId}/complete`, { method: 'POST' }),
};
