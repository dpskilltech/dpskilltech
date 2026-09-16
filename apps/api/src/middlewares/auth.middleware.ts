import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedUser, JWTPayload, PermissionCode, UserRole } from '../types/auth';
import { supabaseAdmin } from '../lib/supabase';

// =============================================================================
// Extend Express Request to carry the full authenticated user context
// =============================================================================
declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'dpskilltech_dev_super_secret_jwt_key_2026_secured';

// =============================================================================
// Helper: Resolve user profile + roles + permissions from PostgreSQL
// Called after Supabase Auth confirms the token is valid.
// =============================================================================
async function resolveUserContext(supabaseUserId: string, email: string): Promise<AuthenticatedUser | null> {
  if (!supabaseAdmin) return null;

  try {
    // 1. Fetch profile (includes requires_password_change)
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id, full_name, requires_password_change')
      .eq('id', supabaseUserId)
      .single();

    if (profileError || !profile) return null;

    // 2. Fetch all roles assigned to this user along with granular permissions
    const { data: userRoles, error: rolesError } = await supabaseAdmin
      .from('user_roles')
      .select(`
        roles (
          id,
          name,
          role_permissions (
            permissions (
              code
            )
          )
        )
      `)
      .eq('user_id', supabaseUserId);

    if (rolesError) return null;

    const roles: UserRole[] = (userRoles ?? [])
      .map((ur: any) => ur.roles?.name as UserRole)
      .filter(Boolean);

    // Primary role: prefer highest-privilege role present
    const rolePriority: UserRole[] = ['SUPER_ADMIN', 'ADMIN', 'TEACHER', 'PARENT', 'STUDENT'];
    const primaryRole: UserRole = rolePriority.find(r => roles.includes(r)) ?? 'STUDENT';

    // 3. Extract all granular permissions for this user's assigned roles
    let permissions: PermissionCode[] = [];

    if (primaryRole !== 'SUPER_ADMIN') {
      const permSet = new Set<PermissionCode>();
      for (const ur of (userRoles ?? []) as any[]) {
        for (const rp of ur.roles?.role_permissions ?? []) {
          if (rp.permissions?.code) {
            permSet.add(rp.permissions.code as PermissionCode);
          }
        }
      }
      permissions = Array.from(permSet);
    }


    return {
      userId: supabaseUserId,
      email,
      fullName: profile.full_name,
      role: primaryRole,
      roles,
      permissions,
      requiresPasswordChange: profile.requires_password_change ?? false,
    };
  } catch {
    return null;
  }
}

// =============================================================================
// authenticateToken
// Primary middleware — validates Supabase JWT, resolves full user context.
// Falls back to local JWT in development only (never in production).
// =============================================================================
export const authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({
      success: false,
      error: 'Unauthorized: Authentication token required.'
    });
    return;
  }

  // 1. Primary: Verify with Supabase Auth
  if (supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin.auth.getUser(token);

      if (!error && data.user) {
        const userContext = await resolveUserContext(data.user.id, data.user.email ?? '');

        if (userContext) {
          req.user = userContext;
          return next();
        }

        // Supabase auth valid but no profile found — account not fully set up
        res.status(403).json({
          success: false,
          error: 'Forbidden: Authenticated but no academy profile found. Contact administrator.'
        });
        return;
      }
    } catch {
      // Fall through to production rejection or dev fallback below
    }

    // Supabase available but token invalid — reject in all environments
    if (process.env.NODE_ENV === 'production') {
      res.status(403).json({
        success: false,
        error: 'Forbidden: Invalid or expired Supabase authentication session.'
      });
      return;
    }
  }

  // In production, reject — Supabase must be configured
  if (process.env.NODE_ENV === 'production') {
    res.status(503).json({
      success: false,
      error: 'Service Unavailable: Authentication service not configured in production.'
    });
    return;
  }

  // 2. Development offline fallback: verify local JWT only
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    // Build a minimal AuthenticatedUser from the legacy payload
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      fullName: decoded.fullName,
      role: decoded.role,
      roles: [decoded.role],
      permissions: decoded.role === 'SUPER_ADMIN' || decoded.role === 'ADMIN'
        ? [] // empty means all-access in requirePermission for admin roles
        : [],
      requiresPasswordChange: false,
    };
    next();
  } catch {
    res.status(403).json({
      success: false,
      error: 'Forbidden: Invalid or expired authentication token.'
    });
  }
};

// =============================================================================
// requireRole — guards by role name (legacy/coarse-grained)
// =============================================================================
export const requireRole = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Unauthorized: Session required.' });
      return;
    }

    const hasRole = req.user.roles.some(r => allowedRoles.includes(r));
    if (!hasRole) {
      res.status(403).json({
        success: false,
        error: `Forbidden: Role '${req.user.role}' is not authorized for this resource.`
      });
      return;
    }

    next();
  };
};

// =============================================================================
// requirePermission — guards by granular permission code (recommended approach)
// SUPER_ADMIN bypasses all permission checks.
// =============================================================================
export const requirePermission = (permissionCode: PermissionCode) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Unauthorized: Session required.' });
      return;
    }

    // SUPER_ADMIN has implicit access to all operations
    if (req.user.role === 'SUPER_ADMIN') {
      return next();
    }

    const hasPermission = req.user.permissions.includes(permissionCode);
    if (!hasPermission) {
      res.status(403).json({
        success: false,
        error: `Forbidden: Missing required permission '${permissionCode}'.`
      });
      return;
    }

    next();
  };
};

// =============================================================================
// requirePasswordChanged — blocks dashboard access until password is updated
// =============================================================================
export const requirePasswordChanged = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'Unauthorized: Session required.' });
    return;
  }

  if (req.user.requiresPasswordChange) {
    res.status(403).json({
      success: false,
      error: 'Forbidden: Password change required before accessing this resource.',
      code: 'PASSWORD_CHANGE_REQUIRED'
    });
    return;
  }

  next();
};

export const requireAuth = authenticateToken;
