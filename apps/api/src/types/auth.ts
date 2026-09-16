// =============================================================================
// DP SKILL TECH ACADEMY — Authentication & Authorization Types
// Supabase Auth is the sole credential authority.
// Permissions are resolved from PostgreSQL via RBAC tables.
// =============================================================================

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';

// Granular permission codes matching the permissions table in PostgreSQL
export type PermissionCode =
  | 'student.view' | 'student.create' | 'student.update' | 'student.archive'
  | 'teacher.view' | 'teacher.create' | 'teacher.update'
  | 'course.view' | 'course.create' | 'course.update' | 'course.delete'
  | 'batch.view' | 'batch.create' | 'batch.update'
  | 'attendance.view' | 'attendance.mark'
  | 'assignment.create' | 'assignment.grade' | 'project.grade' | 'exam.grade'
  | 'certificate.view' | 'certificate.approve' | 'certificate.issue' | 'certificate.revoke'
  | 'payment.view' | 'payment.verify'
  | 'demo.manage' | 'report.export' | 'audit.view' | 'system.manage';

/**
 * Authenticated user context attached to Express Request by auth.middleware.ts
 * Permissions are resolved from PostgreSQL role_permissions, NOT from JWT metadata.
 */
export interface AuthenticatedUser {
  /** Supabase Auth user UUID (matches profiles.id and auth.users.id) */
  userId: string;
  email: string;
  fullName: string;
  /** Primary role from user_roles */
  role: UserRole;
  /** All roles assigned to this user */
  roles: UserRole[];
  /** All permission codes from role_permissions (resolved server-side) */
  permissions: PermissionCode[];
  /** If true, user must change password before accessing the academy dashboard */
  requiresPasswordChange: boolean;
}

/**
 * Legacy JWTPayload — kept for backward compatibility during dev fallback only.
 * Will be removed once Supabase Auth is fully configured.
 */
export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  fullName: string;
}

export interface AuthResponseUser {
  id: string;
  email: string;
  role: UserRole;
  fullName: string;
  phone?: string;
  avatarUrl?: string;
  requiresPasswordChange: boolean;
}

export interface AuthSuccessResponse {
  user: AuthResponseUser;
}

// Prisma-era types retained for reference during migration only
/** @deprecated Use Supabase profiles table instead */
export interface User {
  id: string;
  email: string;
  role: UserRole;
  fullName: string;
  phone?: string;
  avatarUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
