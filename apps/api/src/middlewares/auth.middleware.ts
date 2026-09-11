import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWTPayload, UserRole } from '../types/auth';

// Extend Express Request interface to carry authenticated user
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'dpskilltech_dev_super_secret_jwt_key_2026_secured';

/**
 * Validates JWT Bearer Token on incoming request headers.
 */
export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({
      success: false,
      error: 'Unauthorized: Authentication token required.'
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({
      success: false,
      error: 'Forbidden: Invalid or expired authentication token.'
    });
    return;
  }
};

/**
 * Role-Based Access Control (RBAC) Guard (Rule 15 & Rule 16)
 * Enforces that only users with authorized roles can access the protected resource.
 */
export const requireRole = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized: Session required.'
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: `Forbidden: Role '${req.user.role}' is not authorized to access this resource.`
      });
      return;
    }

    next();
  };
};
