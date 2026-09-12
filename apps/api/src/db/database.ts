import bcrypt from 'bcryptjs';
import { prisma } from './prisma';
import {
  User,
  StudentProfile,
  TeacherProfile,
  AdminProfile,
  AuthResponseUser,
  UserRole
} from '../types/auth';

/**
 * Resilient Database Layer supporting PostgreSQL via Prisma with in-memory fallback
 */
class DatabaseManager {
  // In-memory fallback stores for offline / development resilience
  private memoryUsers: Map<string, User> = new Map();
  private memoryStudentProfiles: Map<string, StudentProfile> = new Map();
  private memoryTeacherProfiles: Map<string, TeacherProfile> = new Map();
  private memoryAdminProfiles: Map<string, AdminProfile> = new Map();

  constructor() {
    this.seedFallbackMemoryData();
  }

  private seedFallbackMemoryData() {
    const defaultPasswordHash = bcrypt.hashSync('password123', 10);

    // 1. Student
    const studentId = 'usr_student_01';
    this.memoryUsers.set(studentId, {
      id: studentId,
      email: 'student@dpskilltech.in',
      passwordHash: defaultPasswordHash,
      role: 'STUDENT',
      fullName: 'Aarav Sharma',
      phone: '+91 98765 43210',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      bio: 'Aspiring Full-Stack & AI Engineer. Currently learning Python, FastAPI, and Transformers.',
      isActive: true,
      createdAt: '2026-08-01T10:00:00.000Z',
      updatedAt: '2026-09-11T00:00:00.000Z'
    });

    this.memoryStudentProfiles.set(studentId, {
      userId: studentId,
      batchId: 'batch_py_2026_01',
      batchName: 'Batch PY-2026-01 (Max 15 Students)',
      enrolledCourseId: 'full-stack-python-ai',
      enrolledCourseName: 'Full Stack Python + AI Architecture',
      attendanceRate: 94,
      completedLessons: 24,
      totalLessons: 48,
      submittedAssignments: 7,
      totalAssignments: 8,
      mockInterviewCredits: 2,
      mockInterviewsCompleted: 1
    });

    // 2. Teacher
    const teacherId = 'usr_teacher_01';
    this.memoryUsers.set(teacherId, {
      id: teacherId,
      email: 'instructor@dpskilltech.in',
      passwordHash: defaultPasswordHash,
      role: 'TEACHER',
      fullName: 'Dr. Rajesh Verma',
      phone: '+91 98765 11223',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      bio: 'Principal Software Architect & Lead Instructor for Python + AI tracks with 12+ years industry experience.',
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

    // 3. Admin
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

    try {
      // Try Prisma PostgreSQL lookup
      const dbUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email: normalized },
            { email: normalized.replace('@dpskilltech.in', '@dpskilltech.com') },
            { email: normalized.replace('@dpskilltech.com', '@dpskilltech.in') }
          ]
        },
        include: {
          studentProfile: true,
          teacherProfile: true,
          adminProfile: true
        }
      });

      if (dbUser) {
        return {
          id: dbUser.id,
          email: dbUser.email,
          passwordHash: dbUser.passwordHash,
          role: dbUser.role as UserRole,
          fullName: dbUser.fullName,
          phone: dbUser.phone || undefined,
          avatarUrl: dbUser.avatarUrl || undefined,
          bio: dbUser.bio || undefined,
          isActive: dbUser.isActive,
          createdAt: dbUser.createdAt.toISOString(),
          updatedAt: dbUser.updatedAt.toISOString()
        };
      }
    } catch {
      // Fallback to in-memory store if PostgreSQL is temporarily offline
    }

    // Fallback store
    for (const user of this.memoryUsers.values()) {
      const userEmail = user.email.toLowerCase();
      if (
        userEmail === normalized ||
        userEmail.replace('@dpskilltech.in', '@dpskilltech.com') === normalized ||
        userEmail.replace('@dpskilltech.com', '@dpskilltech.in') === normalized
      ) {
        return user;
      }
    }
    return undefined;
  }

  public async findUserById(id: string): Promise<User | undefined> {
    try {
      const dbUser = await prisma.user.findUnique({
        where: { id },
        include: {
          studentProfile: true,
          teacherProfile: true,
          adminProfile: true
        }
      });

      if (dbUser) {
        return {
          id: dbUser.id,
          email: dbUser.email,
          passwordHash: dbUser.passwordHash,
          role: dbUser.role as UserRole,
          fullName: dbUser.fullName,
          phone: dbUser.phone || undefined,
          avatarUrl: dbUser.avatarUrl || undefined,
          bio: dbUser.bio || undefined,
          isActive: dbUser.isActive,
          createdAt: dbUser.createdAt.toISOString(),
          updatedAt: dbUser.updatedAt.toISOString()
        };
      }
    } catch {
      // Fallback
    }

    return this.memoryUsers.get(id);
  }

  public async getAuthUserResponse(user: User): Promise<AuthResponseUser> {
    const response: AuthResponseUser = {
      id: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
      phone: user.phone,
      avatarUrl: user.avatarUrl
    };

    try {
      if (user.role === 'STUDENT') {
        const student = await prisma.studentProfile.findUnique({
          where: { userId: user.id },
          include: { batch: true }
        });
        if (student) {
          response.studentProfile = {
            userId: student.userId,
            batchId: student.batchId || '',
            batchName: student.batch?.name || 'Batch PY-2026-01 (Max 15 Students)',
            enrolledCourseId: student.enrolledCourseId,
            enrolledCourseName: student.enrolledCourseName,
            attendanceRate: student.attendanceRate,
            completedLessons: student.completedLessons,
            totalLessons: student.totalLessons,
            submittedAssignments: student.submittedAssignments,
            totalAssignments: student.totalAssignments,
            mockInterviewCredits: student.mockInterviewCredits,
            mockInterviewsCompleted: student.mockInterviewsCompleted
          };
          return response;
        }
      } else if (user.role === 'TEACHER') {
        const teacher = await prisma.teacherProfile.findUnique({
          where: { userId: user.id },
          include: { batches: true }
        });
        if (teacher) {
          response.teacherProfile = {
            userId: teacher.userId,
            specialization: teacher.specialization,
            assignedBatchIds: teacher.batches.map((b) => b.id),
            totalStudentsMentored: teacher.totalStudentsMentored,
            rating: teacher.rating,
            mockInterviewSlotsAvailable: teacher.mockInterviewSlotsAvailable
          };
          return response;
        }
      } else if (user.role === 'ADMIN') {
        const admin = await prisma.adminProfile.findUnique({
          where: { userId: user.id }
        });
        if (admin) {
          response.adminProfile = {
            userId: admin.userId,
            department: admin.department,
            accessLevel: (admin.accessLevel as 'SUPERADMIN' | 'OPERATIONS' | 'ACADEMIC') || 'SUPERADMIN'
          };
          return response;
        }
      }
    } catch {
      // Fallback to memory stores
    }

    // Fallback resolution
    if (user.role === 'STUDENT') {
      response.studentProfile = this.memoryStudentProfiles.get(user.id);
    } else if (user.role === 'TEACHER') {
      response.teacherProfile = this.memoryTeacherProfiles.get(user.id);
    } else if (user.role === 'ADMIN') {
      response.adminProfile = this.memoryAdminProfiles.get(user.id);
    }

    return response;
  }

  public async createStudent(params: {
    email: string;
    passwordPlain: string;
    fullName: string;
    phone?: string;
    courseId?: string;
  }): Promise<{ user: User; profile: StudentProfile }> {
    const passwordHash = bcrypt.hashSync(params.passwordPlain, 10);
    const emailNorm = params.email.trim().toLowerCase();
    const courseId = params.courseId || 'full-stack-python-ai';

    try {
      const createdUser = await prisma.user.create({
        data: {
          email: emailNorm,
          passwordHash,
          role: 'STUDENT',
          fullName: params.fullName.trim(),
          phone: params.phone?.trim(),
          studentProfile: {
            create: {
              enrolledCourseId: courseId,
              enrolledCourseName:
                courseId === 'full-stack-python-ai'
                  ? 'Full Stack Python + AI Architecture'
                  : 'Data Science & Machine Learning',
              attendanceRate: 100,
              completedLessons: 0,
              totalLessons: 48,
              submittedAssignments: 0,
              totalAssignments: 8,
              mockInterviewCredits: 2,
              mockInterviewsCompleted: 0
            }
          }
        },
        include: { studentProfile: true }
      });

      const user: User = {
        id: createdUser.id,
        email: createdUser.email,
        passwordHash: createdUser.passwordHash,
        role: createdUser.role as UserRole,
        fullName: createdUser.fullName,
        phone: createdUser.phone || undefined,
        isActive: createdUser.isActive,
        createdAt: createdUser.createdAt.toISOString(),
        updatedAt: createdUser.updatedAt.toISOString()
      };

      const profile: StudentProfile = {
        userId: createdUser.id,
        batchId: createdUser.studentProfile?.batchId || '',
        batchName: 'Batch PY-2026-02 (Enrolling, Max 15)',
        enrolledCourseId: createdUser.studentProfile?.enrolledCourseId || courseId,
        enrolledCourseName: createdUser.studentProfile?.enrolledCourseName || 'Full Stack Python + AI Architecture',
        attendanceRate: createdUser.studentProfile?.attendanceRate || 100,
        completedLessons: createdUser.studentProfile?.completedLessons || 0,
        totalLessons: createdUser.studentProfile?.totalLessons || 48,
        submittedAssignments: createdUser.studentProfile?.submittedAssignments || 0,
        totalAssignments: createdUser.studentProfile?.totalAssignments || 8,
        mockInterviewCredits: createdUser.studentProfile?.mockInterviewCredits || 2,
        mockInterviewsCompleted: createdUser.studentProfile?.mockInterviewsCompleted || 0
      };

      // Also cache in memory fallback
      this.memoryUsers.set(user.id, user);
      this.memoryStudentProfiles.set(user.id, profile);

      return { user, profile };
    } catch {
      // Fallback in-memory creation
    }

    const fallbackId = `usr_student_${Date.now()}`;
    const now = new Date().toISOString();

    const fallbackUser: User = {
      id: fallbackId,
      email: emailNorm,
      passwordHash,
      role: 'STUDENT',
      fullName: params.fullName.trim(),
      phone: params.phone?.trim(),
      isActive: true,
      createdAt: now,
      updatedAt: now
    };

    const fallbackProfile: StudentProfile = {
      userId: fallbackId,
      batchId: 'batch_py_2026_02',
      batchName: 'Batch PY-2026-02 (Enrolling, Max 15)',
      enrolledCourseId: courseId,
      enrolledCourseName: 'Full Stack Python + AI Architecture',
      attendanceRate: 100,
      completedLessons: 0,
      totalLessons: 48,
      submittedAssignments: 0,
      totalAssignments: 8,
      mockInterviewCredits: 2,
      mockInterviewsCompleted: 0
    };

    this.memoryUsers.set(fallbackId, fallbackUser);
    this.memoryStudentProfiles.set(fallbackId, fallbackProfile);

    return { user: fallbackUser, profile: fallbackProfile };
  }

  public async getAllUsers(): Promise<User[]> {
    try {
      const dbUsers = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' }
      });
      if (dbUsers.length > 0) {
        return dbUsers.map((u) => ({
          id: u.id,
          email: u.email,
          passwordHash: u.passwordHash,
          role: u.role as UserRole,
          fullName: u.fullName,
          phone: u.phone || undefined,
          avatarUrl: u.avatarUrl || undefined,
          bio: u.bio || undefined,
          isActive: u.isActive,
          createdAt: u.createdAt.toISOString(),
          updatedAt: u.updatedAt.toISOString()
        }));
      }
    } catch {
      // Fallback
    }

    return Array.from(this.memoryUsers.values());
  }

  public async getAllStudents(): Promise<{ user: User; profile?: StudentProfile }[]> {
    try {
      const dbStudents = await prisma.user.findMany({
        where: { role: 'STUDENT' },
        include: { studentProfile: { include: { batch: true } } }
      });

      if (dbStudents.length > 0) {
        return dbStudents.map((u) => ({
          user: {
            id: u.id,
            email: u.email,
            passwordHash: u.passwordHash,
            role: u.role as UserRole,
            fullName: u.fullName,
            phone: u.phone || undefined,
            avatarUrl: u.avatarUrl || undefined,
            bio: u.bio || undefined,
            isActive: u.isActive,
            createdAt: u.createdAt.toISOString(),
            updatedAt: u.updatedAt.toISOString()
          },
          profile: u.studentProfile
            ? {
                userId: u.studentProfile.userId,
                batchId: u.studentProfile.batchId || '',
                batchName: u.studentProfile.batch?.name || 'Batch PY-2026-01 (Max 15)',
                enrolledCourseId: u.studentProfile.enrolledCourseId,
                enrolledCourseName: u.studentProfile.enrolledCourseName,
                attendanceRate: u.studentProfile.attendanceRate,
                completedLessons: u.studentProfile.completedLessons,
                totalLessons: u.studentProfile.totalLessons,
                submittedAssignments: u.studentProfile.submittedAssignments,
                totalAssignments: u.studentProfile.totalAssignments,
                mockInterviewCredits: u.studentProfile.mockInterviewCredits,
                mockInterviewsCompleted: u.studentProfile.mockInterviewsCompleted
              }
            : undefined
        }));
      }
    } catch {
      // Fallback
    }

    return Array.from(this.memoryUsers.values())
      .filter((u) => u.role === 'STUDENT')
      .map((u) => ({
        user: u,
        profile: this.memoryStudentProfiles.get(u.id)
      }));
  }

  public async getAllTeachers(): Promise<{ user: User; profile?: TeacherProfile }[]> {
    try {
      const dbTeachers = await prisma.user.findMany({
        where: { role: 'TEACHER' },
        include: { teacherProfile: { include: { batches: true } } }
      });

      if (dbTeachers.length > 0) {
        return dbTeachers.map((u) => ({
          user: {
            id: u.id,
            email: u.email,
            passwordHash: u.passwordHash,
            role: u.role as UserRole,
            fullName: u.fullName,
            phone: u.phone || undefined,
            avatarUrl: u.avatarUrl || undefined,
            bio: u.bio || undefined,
            isActive: u.isActive,
            createdAt: u.createdAt.toISOString(),
            updatedAt: u.updatedAt.toISOString()
          },
          profile: u.teacherProfile
            ? {
                userId: u.teacherProfile.userId,
                specialization: u.teacherProfile.specialization,
                assignedBatchIds: u.teacherProfile.batches.map((b) => b.id),
                totalStudentsMentored: u.teacherProfile.totalStudentsMentored,
                rating: u.teacherProfile.rating,
                mockInterviewSlotsAvailable: u.teacherProfile.mockInterviewSlotsAvailable
              }
            : undefined
        }));
      }
    } catch {
      // Fallback
    }

    return Array.from(this.memoryUsers.values())
      .filter((u) => u.role === 'TEACHER')
      .map((u) => ({
        user: u,
        profile: this.memoryTeacherProfiles.get(u.id)
      }));
  }
}

export const db = new DatabaseManager();
