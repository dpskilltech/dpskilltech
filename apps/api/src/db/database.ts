import bcrypt from 'bcryptjs';
import {
  User,
  StudentProfile,
  TeacherProfile,
  AdminProfile,
  AuthResponseUser,
  UserRole
} from '../types/auth';

class InMemoryDatabase {
  private users: Map<string, User> = new Map();
  private studentProfiles: Map<string, StudentProfile> = new Map();
  private teacherProfiles: Map<string, TeacherProfile> = new Map();
  private adminProfiles: Map<string, AdminProfile> = new Map();

  constructor() {
    this.seedInitialData();
  }

  private seedInitialData() {
    const defaultPasswordHash = bcrypt.hashSync('password123', 10);

    // 1. Pre-seeded Student
    const studentId = 'usr_student_01';
    const studentUser: User = {
      id: studentId,
      email: 'student@dpskilltech.com',
      passwordHash: defaultPasswordHash,
      role: 'STUDENT',
      fullName: 'Aarav Sharma',
      phone: '+91 98765 43210',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      bio: 'Aspiring Full-Stack & AI Engineer. Currently learning Python, FastAPI, and Transformers.',
      isActive: true,
      createdAt: '2026-08-01T10:00:00.000Z',
      updatedAt: '2026-09-11T00:00:00.000Z'
    };
    this.users.set(studentId, studentUser);

    this.studentProfiles.set(studentId, {
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

    // 2. Pre-seeded Teacher / Instructor
    const teacherId = 'usr_teacher_01';
    const teacherUser: User = {
      id: teacherId,
      email: 'instructor@dpskilltech.com',
      passwordHash: defaultPasswordHash,
      role: 'TEACHER',
      fullName: 'Dr. Rajesh Verma',
      phone: '+91 98765 11223',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      bio: 'Principal Software Architect & Lead Instructor for Python + AI tracks with 12+ years industry experience.',
      isActive: true,
      createdAt: '2026-01-15T09:00:00.000Z',
      updatedAt: '2026-09-11T00:00:00.000Z'
    };
    this.users.set(teacherId, teacherUser);

    this.teacherProfiles.set(teacherId, {
      userId: teacherId,
      specialization: 'Python, Distributed Systems & Deep Learning',
      assignedBatchIds: ['batch_py_2026_01', 'batch_ds_2026_01'],
      totalStudentsMentored: 75,
      rating: 4.9,
      mockInterviewSlotsAvailable: 4
    });

    // 3. Pre-seeded Platform Administrator
    const adminId = 'usr_admin_01';
    const adminUser: User = {
      id: adminId,
      email: 'admin@dpskilltech.com',
      passwordHash: defaultPasswordHash,
      role: 'ADMIN',
      fullName: 'Siddharth Patel',
      phone: '+91 98765 99887',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      bio: 'Academic Operations & Platform Director at DP Skilltech.',
      isActive: true,
      createdAt: '2026-01-01T08:00:00.000Z',
      updatedAt: '2026-09-11T00:00:00.000Z'
    };
    this.users.set(adminId, adminUser);

    this.adminProfiles.set(adminId, {
      userId: adminId,
      department: 'Academic Operations & Engineering Leadership',
      accessLevel: 'SUPERADMIN'
    });
  }

  public findUserByEmail(email: string): User | undefined {
    const normalized = email.trim().toLowerCase();
    for (const user of this.users.values()) {
      if (user.email.toLowerCase() === normalized) {
        return user;
      }
    }
    return undefined;
  }

  public findUserById(id: string): User | undefined {
    return this.users.get(id);
  }

  public getAuthUserResponse(user: User): AuthResponseUser {
    const response: AuthResponseUser = {
      id: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
      phone: user.phone,
      avatarUrl: user.avatarUrl
    };

    if (user.role === 'STUDENT') {
      response.studentProfile = this.studentProfiles.get(user.id);
    } else if (user.role === 'TEACHER') {
      response.teacherProfile = this.teacherProfiles.get(user.id);
    } else if (user.role === 'ADMIN') {
      response.adminProfile = this.adminProfiles.get(user.id);
    }

    return response;
  }

  public createStudent(params: {
    email: string;
    passwordPlain: string;
    fullName: string;
    phone?: string;
    courseId?: string;
  }): { user: User; profile: StudentProfile } {
    const id = `usr_student_${Date.now()}`;
    const passwordHash = bcrypt.hashSync(params.passwordPlain, 10);
    const now = new Date().toISOString();

    const newUser: User = {
      id,
      email: params.email.trim().toLowerCase(),
      passwordHash,
      role: 'STUDENT',
      fullName: params.fullName.trim(),
      phone: params.phone?.trim(),
      isActive: true,
      createdAt: now,
      updatedAt: now
    };

    const newProfile: StudentProfile = {
      userId: id,
      batchId: 'batch_py_2026_02',
      batchName: 'Batch PY-2026-02 (Enrolling, Max 15)',
      enrolledCourseId: params.courseId || 'full-stack-python-ai',
      enrolledCourseName: 'Full Stack Python + AI Architecture',
      attendanceRate: 100,
      completedLessons: 0,
      totalLessons: 48,
      submittedAssignments: 0,
      totalAssignments: 8,
      mockInterviewCredits: 2,
      mockInterviewsCompleted: 0
    };

    this.users.set(id, newUser);
    this.studentProfiles.set(id, newProfile);

    return { user: newUser, profile: newProfile };
  }

  public getAllUsers(): User[] {
    return Array.from(this.users.values());
  }

  public getAllStudents(): { user: User; profile?: StudentProfile }[] {
    return Array.from(this.users.values())
      .filter((u) => u.role === 'STUDENT')
      .map((u) => ({
        user: u,
        profile: this.studentProfiles.get(u.id)
      }));
  }

  public getAllTeachers(): { user: User; profile?: TeacherProfile }[] {
    return Array.from(this.users.values())
      .filter((u) => u.role === 'TEACHER')
      .map((u) => ({
        user: u,
        profile: this.teacherProfiles.get(u.id)
      }));
  }
}

export const db = new InMemoryDatabase();
