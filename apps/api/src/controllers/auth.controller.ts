import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { db } from '../db/database';
import { JWTPayload, UserRole } from '../types/auth';
import { supabaseAdmin, isSupabaseConfigured } from '../lib/supabase';

const JWT_SECRET = process.env.JWT_SECRET || 'dpskilltech_dev_super_secret_jwt_key_2026_secured';
const JWT_EXPIRES_IN: jwt.SignOptions['expiresIn'] = '7d';

const loginSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

/**
 * Handles user login for Students, Teachers, and Admins.
 * Supabase Auth is the single authority.
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        error: parseResult.error.errors[0].message
      });
      return;
    }

    const { email, password } = parseResult.data;
    const emailNorm = email.trim().toLowerCase();

    // 1. Primary Authentication: Supabase Auth
    if (isSupabaseConfigured() && supabaseAdmin) {
      try {
        const { data: authData, error: authError } = await supabaseAdmin.auth.signInWithPassword({
          email: emailNorm,
          password
        });

        if (!authError && authData.user && authData.session) {
          // Resolve profile and assigned roles from Supabase PostgreSQL
          const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select(`
              id,
              full_name,
              email,
              phone,
              avatar_url,
              status,
              requires_password_change,
              user_roles (
                roles (
                  name
                )
              )
            `)
            .eq('id', authData.user.id)
            .single();

          if (profile) {
            if (profile.status === 'SUSPENDED' || profile.status === 'ARCHIVED') {
              res.status(403).json({
                success: false,
                error: 'Your academy account has been deactivated. Please contact admissions.'
              });
              return;
            }

            const roles: UserRole[] = (profile.user_roles ?? [])
              .map((ur: any) => ur.roles?.name as UserRole)
              .filter(Boolean);

            const rolePriority: UserRole[] = ['SUPER_ADMIN', 'ADMIN', 'TEACHER', 'PARENT', 'STUDENT'];
            const primaryRole: UserRole = rolePriority.find(r => roles.includes(r)) || 'STUDENT';

            res.status(200).json({
              success: true,
              token: authData.session.access_token,
              refreshToken: authData.session.refresh_token,
              user: {
                id: profile.id,
                email: profile.email,
                role: primaryRole,
                roles,
                fullName: profile.full_name,
                phone: profile.phone || undefined,
                avatarUrl: profile.avatar_url || undefined,
                requiresPasswordChange: profile.requires_password_change ?? false
              }
            });
            return;
          }
        }
      } catch (sbErr) {
        console.warn('[Auth] Supabase signIn attempt error:', sbErr);
      }
    }

    // In production, reject if Supabase authentication failed
    if (process.env.NODE_ENV === 'production') {
      res.status(401).json({
        success: false,
        error: 'Invalid credentials. Please verify your email and password.'
      });
      return;
    }

    // 2. Development offline fallback (Dev mock accounts only)
    const user = await db.findUserByEmail(emailNorm);
    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Invalid credentials. No account found with this email.'
      });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({
        success: false,
        error: 'Your account has been deactivated. Please contact academic support.'
      });
      return;
    }

    const isMatch = bcrypt.compareSync(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        error: 'Invalid credentials. Password does not match.'
      });
      return;
    }

    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName
    };

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN
    });

    const userProfile = await db.getAuthUserResponse(user);

    res.status(200).json({
      success: true,
      token,
      user: userProfile
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'An internal server error occurred while processing authentication.'
    });
  }
};

/**
 * Public self-registration is explicitly disabled in Phase 1 (Rule 40).
 * Student accounts are provisioned by admissions upon enrollment.
 */
export const register = async (_req: Request, res: Response): Promise<void> => {
  res.status(403).json({
    success: false,
    error: 'Self-registration is disabled. Student accounts are provisioned by admissions upon cohort enrollment.',
    code: 'SELF_REGISTRATION_DISABLED'
  });
};

/**
 * Returns current authenticated user profile
 */
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    if (isSupabaseConfigured() && supabaseAdmin) {
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select(`
          id,
          full_name,
          email,
          phone,
          avatar_url,
          status,
          requires_password_change,
          user_roles (
            roles (
              name
            )
          )
        `)
        .eq('id', req.user.userId)
        .single();

      if (profile) {
        const roles: UserRole[] = (profile.user_roles ?? [])
          .map((ur: any) => ur.roles?.name as UserRole)
          .filter(Boolean);

        const rolePriority: UserRole[] = ['SUPER_ADMIN', 'ADMIN', 'TEACHER', 'PARENT', 'STUDENT'];
        const primaryRole: UserRole = rolePriority.find(r => roles.includes(r)) || 'STUDENT';

        res.status(200).json({
          success: true,
          user: {
            id: profile.id,
            email: profile.email,
            role: primaryRole,
            roles,
            fullName: profile.full_name,
            phone: profile.phone || undefined,
            avatarUrl: profile.avatar_url || undefined,
            requiresPasswordChange: profile.requires_password_change ?? false
          }
        });
        return;
      }
    }

    // Dev fallback
    const user = await db.findUserById(req.user.userId);
    if (!user) {
      res.status(404).json({ success: false, error: 'User record not found.' });
      return;
    }

    const userProfile = await db.getAuthUserResponse(user);
    res.status(200).json({
      success: true,
      user: userProfile
    });
  } catch (error: any) {
    console.error('GetMe error:', error);
    res.status(500).json({
      success: false,
      error: 'An internal server error occurred while retrieving user profile.'
    });
  }
};

/**
 * Handles user logout
 */
export const logout = async (_req: Request, res: Response): Promise<void> => {
  res.status(200).json({
    success: true,
    message: 'User logged out successfully.'
  });
};
