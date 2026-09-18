import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { db, User } from '../db/database';
import { JWTPayload, UserRole } from '../types/auth';
import { supabaseAdmin, isSupabaseConfigured } from '../lib/supabase';

const JWT_SECRET = process.env.JWT_SECRET || 'dpskilltech_dev_super_secret_jwt_key_2026_secured';
const JWT_EXPIRES_IN: jwt.SignOptions['expiresIn'] = '7d';

const loginSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please provide a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
  courseId: z.string().optional()
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
          // Resolve profile and assigned roles from Supabase PostgreSQL without ambiguous join
          const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('id, full_name, email, phone, avatar_url, status, requires_password_change')
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

            const { data: userRoleRecords } = await supabaseAdmin
              .from('user_roles')
              .select('roles(name)')
              .eq('user_id', authData.user.id);

            const roles: UserRole[] = (userRoleRecords ?? [])
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
 * Handles student account creation and Student ID provisioning.
 * Supports Supabase Auth with dev offline fallback.
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = registerSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        error: parseResult.error.errors[0].message
      });
      return;
    }

    const { fullName, email, password, phone, courseId } = parseResult.data;
    const emailNorm = email.trim().toLowerCase();

    // 1. Check if user already exists
    const existing = await db.findUserByEmail(emailNorm);
    if (existing) {
      res.status(409).json({
        success: false,
        error: 'An account with this email address already exists. Please sign in.'
      });
      return;
    }

    let createdUserId: string | null = null;
    let createdToken: string | null = null;
    let authUser: any = null;

    // 2. Primary: Supabase Auth
    if (isSupabaseConfigured() && supabaseAdmin) {
      try {
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: emailNorm,
          password,
          email_confirm: true,
          user_metadata: {
            full_name: fullName.trim(),
            role: 'STUDENT'
          }
        });

        if (!authError && authData.user) {
          createdUserId = authData.user.id;

          // Insert or update profiles record
          await supabaseAdmin.from('profiles').upsert({
            id: createdUserId,
            full_name: fullName.trim(),
            email: emailNorm,
            phone: phone?.trim() || null,
            status: 'ACTIVE',
            requires_password_change: false,
            updated_at: new Date().toISOString()
          });

          // Assign STUDENT role in user_roles
          const { data: roleData } = await supabaseAdmin
            .from('roles')
            .select('id')
            .eq('name', 'STUDENT')
            .single();

          if (roleData) {
            await supabaseAdmin.from('user_roles').upsert({
              user_id: createdUserId,
              role_id: roleData.id
            }, { onConflict: 'user_id,role_id' });
          }

          // Generate student profile / ID
          const studentCode = `DPSK-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
          await supabaseAdmin.from('student_profiles').upsert({
            profile_id: createdUserId,
            student_id: studentCode,
            mock_interview_credits: 2
          }, { onConflict: 'profile_id' });

          // Generate session or sign in
          const { data: signInData, error: signInError } = await supabaseAdmin.auth.signInWithPassword({
            email: emailNorm,
            password
          });

          if (!signInError && signInData.session) {
            createdToken = signInData.session.access_token;
          }
        }
      } catch (sbErr) {
        console.warn('[Register] Supabase registration error:', sbErr);
      }
    }

    // 3. Dev Offline fallback or token generation
    if (!createdUserId) {
      if (process.env.NODE_ENV === 'production') {
        res.status(500).json({
          success: false,
          error: 'Registration service currently unavailable. Please try again or contact admissions.'
        });
        return;
      }

      // In dev offline mode: create in memory DB
      createdUserId = `usr_student_${Date.now()}`;
      const passwordHash = bcrypt.hashSync(password, 10);
      const newMemoryUser: User = {
        id: createdUserId,
        email: emailNorm,
        passwordHash,
        role: 'STUDENT',
        fullName: fullName.trim(),
        phone: phone?.trim(),
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await db.createMemoryStudent(newMemoryUser, courseId || 'full-stack-python-ai');
      authUser = await db.getAuthUserResponse(newMemoryUser);
    }

    if (!createdToken) {
      const payload: JWTPayload = {
        userId: createdUserId,
        email: emailNorm,
        role: 'STUDENT',
        fullName: fullName.trim()
      };
      createdToken = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    }

    if (!authUser) {
      authUser = {
        id: createdUserId,
        email: emailNorm,
        role: 'STUDENT',
        roles: ['STUDENT'],
        fullName: fullName.trim(),
        phone: phone?.trim(),
        requiresPasswordChange: false
      };
    }

    res.status(201).json({
      success: true,
      token: createdToken,
      user: authUser,
      message: 'Account and Student ID created successfully.'
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'An internal error occurred during account registration.'
    });
  }
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
        .select('id, full_name, email, phone, avatar_url, status, requires_password_change')
        .eq('id', req.user.userId)
        .single();

      if (profile) {
        const { data: userRoleRecords } = await supabaseAdmin
          .from('user_roles')
          .select('roles(name)')
          .eq('user_id', req.user.userId);

        const roles: UserRole[] = (userRoleRecords ?? [])
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
