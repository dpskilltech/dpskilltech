import bcrypt from 'bcryptjs';
import { AuthResponseUser, UserRole } from '../types/auth';
import { supabaseAdmin, isSupabaseConfigured } from '../lib/supabase';

/**
 * Resilient Database Layer for DP Skilltech
 * Single Source of Truth: Supabase PostgreSQL via apps/api/src/lib/supabase.ts
 *
 * Production Safety (Rule 4 & Scope 10):
 * - Production NEVER falls back to in-memory fake data.
 * - In-memory seed accounts exist exclusively behind NODE_ENV !== 'production' guards.
 */

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  fullName: string;
  phone?: string;
  avatarUrl?: string;
  bio?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StudentProfile {
  userId: string;
  batchId: string;
  batchName: string;
  enrolledCourseId: string;
  enrolledCourseName: string;
  attendanceRate: number;
  completedLessons: number;
  totalLessons: number;
  submittedAssignments: number;
  totalAssignments: number;
  mockInterviewCredits: number;
  mockInterviewsCompleted: number;
}

export interface TeacherProfile {
  userId: string;
  specialization: string;
  assignedBatchIds: string[];
  totalStudentsMentored: number;
  rating: number;
  mockInterviewSlotsAvailable: number;
}

export interface AdminProfile {
  userId: string;
  department: string;
  accessLevel: string;
}

class DatabaseService {
  private memoryUsers: Map<string, User> = new Map();
  private memoryStudentProfiles: Map<string, StudentProfile> = new Map();
  private memoryTeacherProfiles: Map<string, TeacherProfile> = new Map();
  private memoryAdminProfiles: Map<string, AdminProfile> = new Map();

  constructor() {
    // Only initialize development mock data in non-production environments
    if (process.env.NODE_ENV !== 'production') {
      this.initDevMemorySeed();
    }
  }

  private initDevMemorySeed() {
    const defaultPasswordHash = bcrypt.hashSync('DPskilltech@2026', 10);

    const studentId = 'usr_student_01';
    this.memoryUsers.set(studentId, {
      id: studentId,
      email: 'student@dpskilltech.in',
      passwordHash: defaultPasswordHash,
      role: 'STUDENT',
      fullName: 'Aarav Sharma',
      phone: '+91 98765 43210',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      bio: 'Enrolled in Full Stack Python + AI Architecture cohort.',
      isActive: true,
      createdAt: '2026-02-01T10:00:00.000Z',
      updatedAt: '2026-09-11T00:00:00.000Z'
    });

    this.memoryStudentProfiles.set(studentId, {
      userId: studentId,
      batchId: 'batch_py_2026_01',
      batchName: 'Batch PY-2026-01 (14/15 Capped)',
      enrolledCourseId: 'full-stack-python-ai',
      enrolledCourseName: 'Full Stack Python + AI Architecture',
      attendanceRate: 94.2,
      completedLessons: 18,
      totalLessons: 48,
      submittedAssignments: 5,
      totalAssignments: 8,
      mockInterviewCredits: 2,
      mockInterviewsCompleted: 1
    });

    const teacherId = 'usr_teacher_01';
    this.memoryUsers.set(teacherId, {
      id: teacherId,
      email: 'teacher@dpskilltech.in',
      passwordHash: defaultPasswordHash,
      role: 'TEACHER',
      fullName: 'Dr. Rajesh Verma',
      phone: '+91 98765 11223',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      bio: 'Principal Software Architect & Lead Instructor for Python + AI tracks.',
      isActive: true,
      createdAt: '2026-01-15T09:00:00.000Z',
      updatedAt: '2026-09-11T00:00:00.000Z'
    });

    this.memoryTeacherProfiles.set(teacherId, {
      userId: teacherId,
      specialization: 'Python, Distributed Systems & Deep Learning',
      assignedBatchIds: ['batch_py_2026_01', 'batch_ds_2026_01'],
      totalStudentsMentored: 75,
      rating: 4.9,
      mockInterviewSlotsAvailable: 4
    });

    const adminId = 'usr_admin_01';
    this.memoryUsers.set(adminId, {
      id: adminId,
      email: 'admin@dpskilltech.in',
      passwordHash: defaultPasswordHash,
      role: 'ADMIN',
      fullName: 'Siddharth Patel',
      phone: '+91 98765 99887',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      bio: 'Academic Operations & Platform Director at DP Skilltech.',
      isActive: true,
      createdAt: '2026-01-01T08:00:00.000Z',
      updatedAt: '2026-09-11T00:00:00.000Z'
    });

    this.memoryAdminProfiles.set(adminId, {
      userId: adminId,
      department: 'Academic Operations & Engineering Leadership',
      accessLevel: 'SUPERADMIN'
    });
  }

  public async findUserByEmail(email: string): Promise<User | undefined> {
    const normalized = email.trim().toLowerCase();

    // 1. Primary: Supabase PostgreSQL
    if (isSupabaseConfigured() && supabaseAdmin) {
      try {
        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('id, full_name, email, phone, avatar_url, status, created_at, updated_at, user_roles(roles(name))')
          .ilike('email', normalized)
          .single();

        if (profile) {
          const role = (profile.user_roles?.[0] as any)?.roles?.name || 'STUDENT';
          return {
            id: profile.id,
            email: profile.email,
            passwordHash: '',
            role: role as UserRole,
            fullName: profile.full_name,
            phone: profile.phone || undefined,
            avatarUrl: profile.avatar_url || undefined,
            isActive: profile.status === 'ACTIVE',
            createdAt: profile.created_at,
            updatedAt: profile.updated_at
          };
        }
      } catch (err) {
        console.warn('[DB] Supabase email lookup fallback:', err);
      }
    }

    // 2. Production Guard: NEVER return mock users in production (Rule 4 & Scope 10)
    if (process.env.NODE_ENV === 'production') {
      return undefined;
    }

    // 3. Development offline fallback
    for (const user of this.memoryUsers.values()) {
      if (user.email.toLowerCase() === normalized) {
        return user;
      }
    }
    return undefined;
  }

  public async findUserById(id: string): Promise<User | undefined> {
    // 1. Primary: Supabase PostgreSQL
    if (isSupabaseConfigured() && supabaseAdmin) {
      try {
        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('id, full_name, email, phone, avatar_url, status, created_at, updated_at, user_roles(roles(name))')
          .eq('id', id)
          .single();

        if (profile) {
          const role = (profile.user_roles?.[0] as any)?.roles?.name || 'STUDENT';
          return {
            id: profile.id,
            email: profile.email,
            passwordHash: '',
            role: role as UserRole,
            fullName: profile.full_name,
            phone: profile.phone || undefined,
            avatarUrl: profile.avatar_url || undefined,
            isActive: profile.status === 'ACTIVE',
            createdAt: profile.created_at,
            updatedAt: profile.updated_at
          };
        }
      } catch (err) {
        console.warn('[DB] Supabase id lookup fallback:', err);
      }
    }

    // 2. Production Guard
    if (process.env.NODE_ENV === 'production') {
      return undefined;
    }

    return this.memoryUsers.get(id);
  }

  public async getAuthUserResponse(user: User): Promise<AuthResponseUser> {
    let requiresPasswordChange = false;

    if (isSupabaseConfigured() && supabaseAdmin) {
      try {
        const { data } = await supabaseAdmin
          .from('profiles')
          .select('requires_password_change')
          .eq('id', user.id)
          .single();

        if (data) {
          requiresPasswordChange = data.requires_password_change ?? false;
        }
      } catch {
        // Fall through
      }
    }

    const response: AuthResponseUser = {
      id: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
      requiresPasswordChange
    };

    const extResponse = response as any;

    // Attach role-specific profile metadata
    if (user.role === 'STUDENT') {
      if (isSupabaseConfigured() && supabaseAdmin) {
        try {
          const { data: sp } = await supabaseAdmin
            .from('student_profiles')
            .select('*, enrollments(id, status, courses(id, title), batches(id, name))')
            .eq('profile_id', user.id)
            .single();

          if (sp) {
            const firstEnrollment = sp.enrollments?.[0];
            extResponse.studentProfile = {
              userId: user.id,
              batchId: firstEnrollment?.batches?.id || '',
              batchName: firstEnrollment?.batches?.name || 'Academy Cohort',
              enrolledCourseId: firstEnrollment?.courses?.id || '',
              enrolledCourseName: firstEnrollment?.courses?.title || 'Enrolled Course',
              attendanceRate: 100,
              completedLessons: 0,
              totalLessons: 48,
              submittedAssignments: 0,
              totalAssignments: 8,
              mockInterviewCredits: 2,
              mockInterviewsCompleted: 0
            };
          }
        } catch {
          // Fall through to memory
        }
      }

      if (!extResponse.studentProfile && process.env.NODE_ENV !== 'production') {
        extResponse.studentProfile = this.memoryStudentProfiles.get(user.id);
      }
    } else if (user.role === 'TEACHER') {
      if (process.env.NODE_ENV !== 'production') {
        extResponse.teacherProfile = this.memoryTeacherProfiles.get(user.id);
      }
    } else if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
      if (process.env.NODE_ENV !== 'production') {
        extResponse.adminProfile = this.memoryAdminProfiles.get(user.id);
      }
    }

    return response;
  }

  public async getAllUsers(): Promise<User[]> {
    if (isSupabaseConfigured() && supabaseAdmin) {
      try {
        const { data: profiles } = await supabaseAdmin
          .from('profiles')
          .select('id, full_name, email, phone, avatar_url, status, created_at, updated_at, user_roles(roles(name))')
          .limit(100);

        if (profiles) {
          return profiles.map(p => ({
            id: p.id,
            email: p.email,
            passwordHash: '',
            role: ((p.user_roles?.[0] as any)?.roles?.name || 'STUDENT') as UserRole,
            fullName: p.full_name,
            phone: p.phone || undefined,
            avatarUrl: p.avatar_url || undefined,
            isActive: p.status === 'ACTIVE',
            createdAt: p.created_at,
            updatedAt: p.updated_at
          }));
        }
      } catch {
        // Fall through
      }
    }

    if (process.env.NODE_ENV === 'production') {
      return [];
    }

    return Array.from(this.memoryUsers.values());
  }

  public async getAllStudents(): Promise<User[]> {
    const users = await this.getAllUsers();
    return users.filter(u => u.role === 'STUDENT');
  }

  public async getAllTeachers(): Promise<User[]> {
    const users = await this.getAllUsers();
    return users.filter(u => u.role === 'TEACHER');
  }

  public createMemoryStudent(student: { id: string; email: string; fullName: string; password?: string; phone?: string; courseName?: string; batchName?: string }) {
    const passwordHash = bcrypt.hashSync(student.password || 'DPskilltech@2026', 10);
    this.memoryUsers.set(student.id, {
      id: student.id,
      email: student.email.toLowerCase().trim(),
      passwordHash,
      role: 'STUDENT',
      fullName: student.fullName,
      phone: student.phone,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    this.memoryStudentProfiles.set(student.id, {
      userId: student.id,
      batchId: 'batch_dev_01',
      batchName: student.batchName || 'Cohort Batch 01',
      enrolledCourseId: 'full-stack-python-ai',
      enrolledCourseName: student.courseName || 'Full Stack Python + AI Architecture',
      attendanceRate: 100,
      completedLessons: 0,
      totalLessons: 48,
      submittedAssignments: 0,
      totalAssignments: 8,
      mockInterviewCredits: 2,
      mockInterviewsCompleted: 0
    });
  }

  public createMemoryTeacher(teacher: { id: string; email: string; fullName: string; password?: string; phone?: string; specialization?: string }) {
    const passwordHash = bcrypt.hashSync(teacher.password || 'DPskilltech@2026', 10);
    this.memoryUsers.set(teacher.id, {
      id: teacher.id,
      email: teacher.email.toLowerCase().trim(),
      passwordHash,
      role: 'TEACHER',
      fullName: teacher.fullName,
      phone: teacher.phone,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    this.memoryTeacherProfiles.set(teacher.id, {
      userId: teacher.id,
      specialization: teacher.specialization || 'Full Stack Engineering',
      assignedBatchIds: [],
      totalStudentsMentored: 0,
      rating: 5.0,
      mockInterviewSlotsAvailable: 4
    });
  }

  public updateMemoryUserPassword(idOrEmail: string, newPassword: string): boolean {
    const target = idOrEmail.toLowerCase().trim();
    for (const [id, user] of this.memoryUsers.entries()) {
      if (id === idOrEmail || user.email === target) {
        user.passwordHash = bcrypt.hashSync(newPassword, 10);
        user.updatedAt = new Date().toISOString();
        return true;
      }
    }
    return false;
  }

  public updateMemoryStudentBatch(idOrEmail: string, newBatchName: string): boolean {
    const target = idOrEmail.toLowerCase().trim();
    for (const [id, user] of this.memoryUsers.entries()) {
      if (id === idOrEmail || user.email === target) {
        const prof = this.memoryStudentProfiles.get(id);
        if (prof) {
          prof.batchName = newBatchName;
          return true;
        }
      }
    }
    return false;
  }
}

export const db = new DatabaseService();
