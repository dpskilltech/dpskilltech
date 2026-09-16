/**
 * DP Skilltech Unified API Client
 * Connects frontend to the Node.js / Express backend service (PORT 5000)
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export interface UserRoleProfile {
  id: string;
  email: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  fullName: string;
  phone?: string;
  avatarUrl?: string;
  studentProfile?: {
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
  };
  teacherProfile?: {
    userId: string;
    specialization: string;
    assignedBatchIds: string[];
    totalStudentsMentored: number;
    rating: number;
    mockInterviewSlotsAvailable: number;
  };
  adminProfile?: {
    userId: string;
    department: string;
    accessLevel: string;
  };
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: UserRoleProfile;
  error?: string;
  message?: string;
}

class ApiService {
  private getToken(): string | null {
    return localStorage.getItem('dpskilltech_auth_token');
  }

  public setToken(token: string): void {
    localStorage.setItem('dpskilltech_auth_token', token);
  }

  public clearToken(): void {
    localStorage.removeItem('dpskilltech_auth_token');
    localStorage.removeItem('dpskilltech_user_profile');
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  public async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.token && data.user) {
        this.setToken(data.token);
        localStorage.setItem('dpskilltech_user_profile', JSON.stringify(data.user));
      }
      return data;
    } catch (err: any) {
      console.error('API login network error:', err);
      return {
        success: false,
        error: 'Unable to connect to DP Skilltech Authentication service. Please ensure the backend server is running.'
      };
    }
  }

  public async register(userData: {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
    courseId?: string;
  }): Promise<AuthResponse> {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await res.json();
      if (res.ok && data.token && data.user) {
        this.setToken(data.token);
        localStorage.setItem('dpskilltech_user_profile', JSON.stringify(data.user));
      }
      return data;
    } catch (err: any) {
      console.error('API register network error:', err);
      return {
        success: false,
        error: 'Unable to connect to DP Skilltech Registration service.'
      };
    }
  }

  public async getMe(): Promise<AuthResponse> {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      const data = await res.json();
      if (res.ok && data.user) {
        localStorage.setItem('dpskilltech_user_profile', JSON.stringify(data.user));
      }
      return data;
    } catch (err: any) {
      console.error('API getMe network error:', err);
      return {
        success: false,
        error: 'Network error checking authentication status.'
      };
    }
  }

  public async getStudentDashboard(): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/student/dashboard`, {
      method: 'GET',
      headers: this.getHeaders()
    });
    return await res.json();
  }

  public async getTeacherDashboard(): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/teacher/dashboard`, {
      method: 'GET',
      headers: this.getHeaders()
    });
    return await res.json();
  }

  public async getAdminDashboard(): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/admin/dashboard`, {
      method: 'GET',
      headers: this.getHeaders()
    });
    return await res.json();
  }

  public async adminCreateStudent(data: {
    email: string;
    fullName: string;
    password?: string;
    phone?: string;
    courseId?: string;
    batchId?: string;
    courseName?: string;
    batchName?: string;
    adminNotes?: string;
    requiresPasswordChange?: boolean;
  }): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/admin/auth/students`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
    return await res.json();
  }

  public async adminCreateCoach(data: {
    email: string;
    fullName: string;
    password?: string;
    phone?: string;
    specialization?: string;
    assignedCourses?: string[];
    assignedBatches?: string[];
    bio?: string;
    requiresPasswordChange?: boolean;
  }): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/admin/auth/coaches`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
    return await res.json();
  }

  public async adminAssignNextClass(
    batchId: string,
    data: {
      topic: string;
      scheduleDate?: string;
      timeSlot?: string;
      coachId?: string;
      coachName?: string;
      zoomJoinUrl?: string;
    }
  ): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/admin/batches/${batchId}/next-class`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
    return await res.json();
  }

  public async adminResetStudentPassword(data: {
    studentUserId?: string;
    id?: string;
    email?: string;
    fullName?: string;
    password?: string;
    sendEmail?: boolean;
  }): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/admin/auth/students/reset-password`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
    return await res.json();
  }

  public async adminResetCoachPassword(data: {
    coachUserId?: string;
    id?: string;
    email?: string;
    fullName?: string;
    password?: string;
    sendEmail?: boolean;
  }): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/admin/auth/coaches/reset-password`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
    return await res.json();
  }

  public async adminResendCredentials(data: {
    email: string;
    role: 'STUDENT' | 'TEACHER';
    fullName?: string;
    password?: string;
    courseOrBatch?: string;
  }): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/admin/auth/resend-credentials`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
    return await res.json();
  }

  public async adminTransferStudentBatch(
    studentId: string,
    data: {
      targetBatchCode: string;
      reason?: string;
      effectiveDate?: string;
    }
  ): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/admin/students/${studentId}/transfer-batch`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
    return await res.json();
  }
}

export const api = new ApiService();
