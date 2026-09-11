export type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN';

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
  attendanceRate: number; // e.g. 94%
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
  rating: number; // e.g. 4.9
  mockInterviewSlotsAvailable: number;
}

export interface AdminProfile {
  userId: string;
  department: string;
  accessLevel: 'SUPERADMIN' | 'OPERATIONS' | 'ACADEMIC';
}

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
  studentProfile?: StudentProfile;
  teacherProfile?: TeacherProfile;
  adminProfile?: AdminProfile;
}

export interface AuthSuccessResponse {
  token: string;
  user: AuthResponseUser;
}
