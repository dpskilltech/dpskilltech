import { Request, Response } from 'express';
import crypto from 'crypto';
import { z } from 'zod';
import { supabaseAdmin } from '../lib/supabase';
import { auditService } from '../services/audit.service';
import { db } from '../db/database';
import { emailService } from '../services/email.service';

const createStudentSchema = z.object({
  email: z.string().email('Valid email address required'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  courseId: z.string().optional(),
  batchId: z.string().optional(),
  courseName: z.string().optional(),
  batchName: z.string().optional(),
  adminNotes: z.string().optional(),
  requiresPasswordChange: z.boolean().optional()
});

const createCoachSchema = z.object({
  email: z.string().email('Valid email address required'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  phone: z.string().optional(),
  specialization: z.string().optional(),
  assignedCourses: z.array(z.string()).optional(),
  assignedBatches: z.array(z.string()).optional(),
  bio: z.string().optional(),
  requiresPasswordChange: z.boolean().optional()
});

const resetStudentPasswordSchema = z.object({
  studentUserId: z.string().optional(),
  id: z.string().optional(),
  email: z.string().optional(),
  fullName: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  sendEmail: z.boolean().optional()
});

const resetCoachPasswordSchema = z.object({
  coachUserId: z.string().optional(),
  id: z.string().optional(),
  email: z.string().optional(),
  fullName: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  sendEmail: z.boolean().optional()
});

const resendCredentialsSchema = z.object({
  email: z.string().email('Valid email address required'),
  role: z.enum(['STUDENT', 'TEACHER']).default('STUDENT'),
  fullName: z.string().optional(),
  password: z.string().optional(),
  courseOrBatch: z.string().optional()
});

/**
 * Generate a cryptographically strong temporary password
 */
const generateTemporaryPassword = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%^&*';
  let password = '';
  const randomBytes = crypto.randomBytes(12);
  for (let i = 0; i < 12; i++) {
    password += chars[randomBytes[i] % chars.length];
  }
  return password;
};

/**
 * Generate a stable unique student academy ID (e.g. DPSK-STU-2026-0042)
 */
const generateStudentId = (sequenceNumber: number = 1): string => {
  const year = new Date().getFullYear();
  const padded = sequenceNumber.toString().padStart(4, '0');
  return `DPSK-STU-${year}-${padded}`;
};

/**
 * Admin Provisions New Student Account (Rule 5: Student accounts are NOT self-registration accounts)
 */
export const createStudentAccount = async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = createStudentSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        error: parseResult.error.errors[0].message
      });
      return;
    }

    const { email, fullName, password, phone, dateOfBirth, courseId, batchId, courseName, batchName, adminNotes, requiresPasswordChange } = parseResult.data;
    const finalPassword = password && password.trim().length >= 6 ? password.trim() : generateTemporaryPassword();
    const mustChange = requiresPasswordChange !== undefined ? requiresPasswordChange : (!password);
    const actorId = (req as any).user?.userId || 'system_admin';

    let userId: string = crypto.randomUUID();
    let studentIdCode: string = generateStudentId(Math.floor(Math.random() * 9000) + 1000);

    if (process.env.NODE_ENV === 'production' && !supabaseAdmin) {
      res.status(500).json({
        success: false,
        error: 'Production Configuration Error: Supabase Admin client is required to provision student accounts. In-memory simulation is strictly forbidden in production (Rule 25).'
      });
      return;
    }

    if (supabaseAdmin) {
      // 1. Create auth user in Supabase Auth
      const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: email.trim().toLowerCase(),
        password: finalPassword,
        email_confirm: true,
        user_metadata: {
          full_name: fullName.trim(),
          role: 'STUDENT',
          requires_password_change: mustChange
        }
      });

      if (authError || !authUser?.user) {
        res.status(400).json({
          success: false,
          error: `Failed to create Supabase auth user: ${authError?.message || 'Unknown error'}`
        });
        return;
      }

      userId = authUser.user.id;

      // 2. Create profile
      const { error: profileError } = await supabaseAdmin.from('profiles').upsert({
        id: userId,
        full_name: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone || null,
        date_of_birth: dateOfBirth || null,
        status: 'ACTIVE',
        requires_password_change: mustChange
      }, { onConflict: 'id' });

      if (profileError) {
        console.warn('Profile insert warning:', profileError.message);
      }

      // 3. Assign STUDENT role
      const { data: studentRole } = await supabaseAdmin
        .from('roles')
        .select('id')
        .eq('name', 'STUDENT')
        .single();

      if (studentRole) {
        await supabaseAdmin.from('user_roles').upsert({
          user_id: userId,
          role_id: studentRole.id
        }, { onConflict: 'user_id,role_id' });
      }

      // 4. Create student profile record
      await supabaseAdmin.from('student_profiles').upsert({
        profile_id: userId,
        student_id: studentIdCode,
        status: 'ACTIVE',
        admin_notes: adminNotes || null
      }, { onConflict: 'profile_id' });

      // 5. Create initial enrollment if courseId provided
      if (courseId) {
        const enrollmentCode = `DPSK-ENR-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000) + 1000}`;
        const { data: studentProf } = await supabaseAdmin
          .from('student_profiles')
          .select('id')
          .eq('profile_id', userId)
          .single();

        if (studentProf) {
          await supabaseAdmin.from('enrollments').insert({
            enrollment_code: enrollmentCode,
            student_profile_id: studentProf.id,
            course_id: courseId,
            batch_id: batchId || null,
            status: 'ENROLLED'
          });
        }
      }
    }

    // Offline dev fallback
    db.createMemoryStudent({
      id: userId,
      email: email.trim().toLowerCase(),
      fullName: fullName.trim(),
      password: finalPassword,
      phone,
      courseName,
      batchName
    });

    // 6. Record in immutable audit log
    await auditService.log({
      actorUserId: actorId,
      action: 'ADMIN_CREATED_STUDENT',
      entityType: 'STUDENT',
      entityId: userId,
      newValue: { email, fullName, studentId: studentIdCode },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    // Dispatch welcome email with credentials
    emailService.sendAccountCredentialsEmail({
      name: fullName.trim(),
      role: 'STUDENT',
      email: email.trim().toLowerCase(),
      password: finalPassword,
      courseOrBatch: `${courseName || 'Full Stack'} | ${batchName || 'Cohort'}`,
      isPasswordReset: false
    }).catch(err => console.warn('[createStudentAccount] Email send notice:', err));

    res.status(201).json({
      success: true,
      message: 'Student account provisioned successfully.',
      student: {
        userId,
        studentId: studentIdCode,
        email: email.trim().toLowerCase(),
        fullName: fullName.trim(),
        temporaryPassword: finalPassword,
        role: 'STUDENT',
        phone,
        courseName,
        batchName,
        requiresPasswordChange: mustChange
      },
      instructions: 'Credentials generated. The student can sign in directly with their email and password.'
    });
  } catch (error: any) {
    console.error('Error in createStudentAccount:', error);
    res.status(500).json({
      success: false,
      error: 'An internal error occurred while provisioning the student account.'
    });
  }
};

/**
 * Admin Provisions New Coach/Teacher Account
 */
export const createCoachAccount = async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = createCoachSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        error: parseResult.error.errors[0].message
      });
      return;
    }

    const { email, fullName, password, phone, specialization, assignedCourses, assignedBatches, bio, requiresPasswordChange } = parseResult.data;
    const finalPassword = password && password.trim().length >= 6 ? password.trim() : generateTemporaryPassword();
    const mustChange = requiresPasswordChange !== undefined ? requiresPasswordChange : (!password);
    const actorId = (req as any).user?.userId || 'system_admin';

    let userId: string = crypto.randomUUID();

    if (process.env.NODE_ENV === 'production' && !supabaseAdmin) {
      res.status(500).json({
        success: false,
        error: 'Production Configuration Error: Supabase Admin client is required to provision coach accounts.'
      });
      return;
    }

    if (supabaseAdmin) {
      const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: email.trim().toLowerCase(),
        password: finalPassword,
        email_confirm: true,
        user_metadata: {
          full_name: fullName.trim(),
          role: 'TEACHER',
          requires_password_change: mustChange
        }
      });

      if (authError || !authUser?.user) {
        res.status(400).json({
          success: false,
          error: `Failed to create coach auth user: ${authError?.message || 'Unknown error'}`
        });
        return;
      }

      userId = authUser.user.id;

      // Create profile
      await supabaseAdmin.from('profiles').upsert({
        id: userId,
        full_name: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone || null,
        status: 'ACTIVE',
        requires_password_change: mustChange
      }, { onConflict: 'id' });

      // Assign TEACHER role
      const { data: teacherRole } = await supabaseAdmin
        .from('roles')
        .select('id')
        .eq('name', 'TEACHER')
        .single();

      if (teacherRole) {
        await supabaseAdmin.from('user_roles').upsert({
          user_id: userId,
          role_id: teacherRole.id
        }, { onConflict: 'user_id,role_id' });
      }

      // Create teacher profile
      await supabaseAdmin.from('teacher_profiles').upsert({
        profile_id: userId,
        bio: bio || specialization || 'Faculty Instructor',
        expertise: specialization ? [specialization] : ['Engineering'],
        status: 'ACTIVE'
      }, { onConflict: 'profile_id' });
    }

    // Offline dev fallback
    db.createMemoryTeacher({
      id: userId,
      email: email.trim().toLowerCase(),
      fullName: fullName.trim(),
      password: finalPassword,
      phone,
      specialization
    });

    await auditService.log({
      actorUserId: actorId,
      action: 'ADMIN_CREATED_COACH',
      entityType: 'COACH',
      entityId: userId,
      newValue: { email, fullName, specialization },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    // Dispatch welcome email with credentials
    emailService.sendAccountCredentialsEmail({
      name: fullName.trim(),
      role: 'TEACHER',
      email: email.trim().toLowerCase(),
      password: finalPassword,
      courseOrBatch: specialization || 'Faculty Instructor',
      isPasswordReset: false
    }).catch(err => console.warn('[createCoachAccount] Email send notice:', err));

    res.status(201).json({
      success: true,
      message: 'Coach account provisioned successfully.',
      coach: {
        userId,
        email: email.trim().toLowerCase(),
        fullName: fullName.trim(),
        temporaryPassword: finalPassword,
        role: 'TEACHER',
        specialization: specialization || 'Faculty Instructor',
        phone,
        assignedCourses: assignedCourses || [],
        assignedBatches: assignedBatches || [],
        requiresPasswordChange: mustChange
      },
      instructions: 'Credentials generated. The coach can sign in directly with their email and password.'
    });
  } catch (error: any) {
    console.error('Error in createCoachAccount:', error);
    res.status(500).json({
      success: false,
      error: 'An internal error occurred while provisioning the coach account.'
    });
  }
};

/**
 * Admin-Only Student Password Reset
 */
export const adminResetStudentPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = resetStudentPasswordSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        error: parseResult.error.errors[0].message
      });
      return;
    }

    const { studentUserId, id, email, fullName, password: customPassword, sendEmail } = parseResult.data;
    const targetId = studentUserId || id || '';
    const targetEmail = email || '';
    const actorId = (req as any).user?.userId || 'system_admin';
    const newPassword = customPassword || generateTemporaryPassword();

    if (supabaseAdmin && targetId && targetId.includes('-')) {
      try {
        await supabaseAdmin.auth.admin.updateUserById(targetId, {
          password: newPassword,
          user_metadata: { requires_password_change: false }
        });
        await supabaseAdmin.from('profiles').update({
          requires_password_change: false
        }).eq('id', targetId);
      } catch (err) {
        console.warn('[Supabase reset student password notice]:', err);
      }
    }

    db.updateMemoryUserPassword(targetId || targetEmail, newPassword);

    if (sendEmail !== false && targetEmail) {
      emailService.sendAccountCredentialsEmail({
        name: fullName || 'Student',
        role: 'STUDENT',
        email: targetEmail,
        password: newPassword,
        isPasswordReset: true
      }).catch(err => console.warn('[Reset Password Email notice]:', err));
    }

    await auditService.log({
      actorUserId: actorId,
      action: 'ADMIN_RESET_STUDENT_PASSWORD',
      entityType: 'STUDENT',
      entityId: targetId || targetEmail,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.status(200).json({
      success: true,
      message: 'Student password reset successfully.',
      password: newPassword,
      instructions: 'The student can now log in immediately with this new password.'
    });
  } catch (error: any) {
    console.error('Error in adminResetStudentPassword:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to execute student password reset.'
    });
  }
};

/**
 * Admin-Only Coach Password Reset
 */
export const adminResetCoachPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = resetCoachPasswordSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        error: parseResult.error.errors[0].message
      });
      return;
    }

    const { coachUserId, id, email, fullName, password: customPassword, sendEmail } = parseResult.data;
    const targetId = coachUserId || id || '';
    const targetEmail = email || '';
    const actorId = (req as any).user?.userId || 'system_admin';
    const newPassword = customPassword || generateTemporaryPassword();

    if (supabaseAdmin && targetId && targetId.includes('-')) {
      try {
        await supabaseAdmin.auth.admin.updateUserById(targetId, {
          password: newPassword,
          user_metadata: { requires_password_change: false }
        });
        await supabaseAdmin.from('profiles').update({
          requires_password_change: false
        }).eq('id', targetId);
      } catch (err) {
        console.warn('[Supabase reset coach password notice]:', err);
      }
    }

    db.updateMemoryUserPassword(targetId || targetEmail, newPassword);

    if (sendEmail !== false && targetEmail) {
      emailService.sendAccountCredentialsEmail({
        name: fullName || 'Coach',
        role: 'TEACHER',
        email: targetEmail,
        password: newPassword,
        isPasswordReset: true
      }).catch(err => console.warn('[Reset Password Email notice]:', err));
    }

    await auditService.log({
      actorUserId: actorId,
      action: 'ADMIN_RESET_COACH_PASSWORD',
      entityType: 'COACH',
      entityId: targetId || targetEmail,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.status(200).json({
      success: true,
      message: 'Coach password reset successfully.',
      password: newPassword,
      instructions: 'The coach can now log in immediately with this new password.'
    });
  } catch (error: any) {
    console.error('Error in adminResetCoachPassword:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to execute coach password reset.'
    });
  }
};

/**
 * Admin Resend Credentials
 */
export const adminResendCredentials = async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = resendCredentialsSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        error: parseResult.error.errors[0].message
      });
      return;
    }

    const { email, role, fullName, password, courseOrBatch } = parseResult.data;

    await emailService.sendAccountCredentialsEmail({
      name: fullName || (role === 'STUDENT' ? 'Student' : 'Faculty Member'),
      role,
      email,
      password: password || 'DPskilltech@2026',
      courseOrBatch,
      isPasswordReset: false
    });

    res.status(200).json({
      success: true,
      message: `Credentials resent to ${email} successfully.`
    });
  } catch (error: any) {
    console.error('Error in adminResendCredentials:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to resend credentials.'
    });
  }
};

/**
 * Super Admin MFA Status & Challenge Endpoints
 */
export const getMfaStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId || !supabaseAdmin) {
      res.status(200).json({
        success: true,
        mfaEnabled: false,
        factors: []
      });
      return;
    }

    const { data, error } = await supabaseAdmin.auth.admin.mfa.listFactors({
      userId
    });

    if (error) {
      res.status(400).json({ success: false, error: error.message });
      return;
    }

    res.status(200).json({
      success: true,
      mfaEnabled: data.factors.some((f) => f.status === 'verified'),
      factors: data.factors
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to retrieve MFA status.' });
  }
};
