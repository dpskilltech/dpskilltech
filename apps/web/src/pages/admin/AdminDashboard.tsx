import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldCheck,
  Award,
  CheckCircle2,
  UserPlus,
  X,
  Check,
  Eye,
  EyeOff,
  Copy,
  Key,
  RefreshCw,
  ArrowRightLeft,
  Video
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { reviewService, type Review } from '../../services/reviewService';
import { PortalLayout } from '../../components/layout/PortalLayout';
import {
  COHORT_BATCHES,
  ADMIN_COURSES,
  ADMIN_LIVE_CLASSES,
  ADMIN_COACHES,
  ADMIN_CERTIFICATES,
  ADMIN_ANNOUNCEMENTS,
  ADMIN_ASSIGNMENTS,
  INITIAL_QUESTION_THREADS,
  MOCK_INTERVIEW_SESSIONS
} from '../../data/portalMockData';
import type {
  CohortBatch,
  AdminCourse,
  AdminLiveClass,
  AdminCoachProfile,
  AdminCertificate,
  AdminAnnouncement,
  AdminAssignment,
  QuestionThread,
  MockInterviewSlot
} from '../../data/portalMockData';
import { api } from '../../services/api';
import {
  courseManagementService,
  type Course as LiveCourse,
  type CourseModule as LiveModule,
  type Lesson as LiveLesson,
} from '../../services/courseManagementService';
import './AdminDashboard.css';
import { OverviewTab } from './tabs/OverviewTab';
import { CoursesTab } from './tabs/CoursesTab';
import { BatchesTab } from './tabs/BatchesTab';
import { StudentsTab } from './tabs/StudentsTab';
import { CoachesTab } from './tabs/CoachesTab';
import { LiveClassesTab } from './tabs/LiveClassesTab';
import { AssessmentsTab } from './tabs/AssessmentsTab';
import { CommunicationTab } from './tabs/CommunicationTab';
import { MockInterviewsTab } from './tabs/MockInterviewsTab';
import { CertificatesTab } from './tabs/CertificatesTab';
import { ReviewsTab } from './tabs/ReviewsTab';
import { AnalyticsTab } from './tabs/AnalyticsTab';
import { SettingsTab } from './tabs/SettingsTab';

interface AdminDashboardProps {
  onNavigateToPublic: (page: string, params?: Record<string, string>) => void;
}

interface StudentRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  batch: string;
  progress: number;
  attendance: number;
  lastActive: string;
  status: 'active' | 'suspended';
  enrolledDate: string;
  assignmentsSubmitted: number;
  totalAssignments: number;
  quizScoreAvg: number;
  codingSubmissions: number;
  capstoneStatus: 'In Progress' | 'Defended' | 'Pending Review';
  questionsAsked: number;
  mockInterviewScore: number | null;
  certificateIssued: boolean;
}

const MOCK_STUDENTS: StudentRecord[] = [
  {
    id: 'STU-1081',
    name: 'Rohan Gupta',
    email: 'rohan.gupta@example.com',
    phone: '+91 98765 43211',
    course: 'Full Stack Python + AI Architecture',
    batch: 'PY-FS-01',
    progress: 58,
    attendance: 96,
    lastActive: 'Today, 02:15 PM',
    status: 'active',
    enrolledDate: 'Aug 01, 2026',
    assignmentsSubmitted: 7,
    totalAssignments: 8,
    quizScoreAvg: 88,
    codingSubmissions: 32,
    capstoneStatus: 'In Progress',
    questionsAsked: 6,
    mockInterviewScore: 8.2,
    certificateIssued: false
  },
  {
    id: 'STU-1082',
    name: 'Aarav Sharma',
    email: 'student@dpskilltech.in',
    phone: '+91 98765 43210',
    course: 'Full Stack Python + AI Architecture',
    batch: 'PY-FS-01',
    progress: 50,
    attendance: 94,
    lastActive: '10 mins ago',
    status: 'active',
    enrolledDate: 'Aug 01, 2026',
    assignmentsSubmitted: 7,
    totalAssignments: 8,
    quizScoreAvg: 92,
    codingSubmissions: 28,
    capstoneStatus: 'In Progress',
    questionsAsked: 12,
    mockInterviewScore: 8.6,
    certificateIssued: false
  },
  {
    id: 'STU-1083',
    name: 'Priya Iyer',
    email: 'priya.iyer@example.com',
    phone: '+91 98765 43212',
    course: 'Data Science & Enterprise GenAI',
    batch: 'DS-AI-01',
    progress: 42,
    attendance: 91,
    lastActive: 'Yesterday',
    status: 'active',
    enrolledDate: 'Aug 10, 2026',
    assignmentsSubmitted: 5,
    totalAssignments: 6,
    quizScoreAvg: 85,
    codingSubmissions: 22,
    capstoneStatus: 'In Progress',
    questionsAsked: 8,
    mockInterviewScore: null,
    certificateIssued: false
  },
  {
    id: 'STU-1084',
    name: 'Ananya Verma',
    email: 'ananya.verma@example.com',
    phone: '+91 98765 43213',
    course: 'Full Stack Java & Spring Microservices',
    batch: 'JV-FS-01',
    progress: 74,
    attendance: 98,
    lastActive: 'Today, 11:30 AM',
    status: 'active',
    enrolledDate: 'July 15, 2026',
    assignmentsSubmitted: 8,
    totalAssignments: 8,
    quizScoreAvg: 95,
    codingSubmissions: 41,
    capstoneStatus: 'Pending Review',
    questionsAsked: 14,
    mockInterviewScore: 9.1,
    certificateIssued: false
  },
  {
    id: 'STU-1070',
    name: 'Vikram Malhotra',
    email: 'vikram.m@example.com',
    phone: '+91 98765 43214',
    course: 'Full Stack Python + AI Architecture',
    batch: 'PY-FS-01',
    progress: 100,
    attendance: 97,
    lastActive: '3 days ago',
    status: 'active',
    enrolledDate: 'June 01, 2026',
    assignmentsSubmitted: 8,
    totalAssignments: 8,
    quizScoreAvg: 94,
    codingSubmissions: 54,
    capstoneStatus: 'Defended',
    questionsAsked: 19,
    mockInterviewScore: 9.4,
    certificateIssued: true
  }
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateToPublic }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [, setDashboardData] = useState<any>(null);

  // Entities state
  const [studentsList, setStudentsList] = useState<StudentRecord[]>(MOCK_STUDENTS);
  const [coursesList, setCoursesList] = useState<AdminCourse[]>(ADMIN_COURSES);
  const [batchesList, setBatchesList] = useState<CohortBatch[]>(COHORT_BATCHES);
  const [classesList, setClassesList] = useState<AdminLiveClass[]>(ADMIN_LIVE_CLASSES);
  const [coachesList, setCoachesList] = useState<AdminCoachProfile[]>(ADMIN_COACHES);
  const [certificatesList, setCertificatesList] = useState<AdminCertificate[]>(ADMIN_CERTIFICATES);
  const [announcementsList, setAnnouncementsList] = useState<AdminAnnouncement[]>(ADMIN_ANNOUNCEMENTS);
  const [assignmentsList] = useState<AdminAssignment[]>(ADMIN_ASSIGNMENTS);
  const [questionThreads] = useState<QuestionThread[]>(INITIAL_QUESTION_THREADS);
  const [mockSessions] = useState<MockInterviewSlot[]>(MOCK_INTERVIEW_SESSIONS);

  // Filters & Search
  const [searchStudent, setSearchStudent] = useState<string>('');
  const [filterBatch, setFilterBatch] = useState<string>('all');
  const [filterCourseStatus, setFilterCourseStatus] = useState<string>('all');
  const [filterClassStatus, setFilterClassStatus] = useState<string>('all');
  const [adminReviews, setAdminReviews] = useState<Review[]>([]);
  const [searchReview, setSearchReview] = useState<string>('');
  const [filterRating, setFilterRating] = useState<string>('all');

  // Modals & Drawers
  const [selectedStudentProfile, setSelectedStudentProfile] = useState<StudentRecord | null>(null);
  const [selectedCourseCurriculum, setSelectedCourseCurriculum] = useState<AdminCourse | null>(null);
  const [showCreateCourseModal, setShowCreateCourseModal] = useState<boolean>(false);
  const [showCreateBatchModal, setShowCreateBatchModal] = useState<boolean>(false);
  const [showScheduleClassModal, setShowScheduleClassModal] = useState<boolean>(false);
  const [showAddCoachModal, setShowAddCoachModal] = useState<boolean>(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState<boolean>(false);
  const [showIssueCertModal, setShowIssueCertModal] = useState<boolean>(false);

  // Form states
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseDesc, setNewCourseDesc] = useState('');
  const [newCourseLevel, setNewCourseLevel] = useState<'Beginner to Advanced' | 'Intermediate' | 'Advanced'>('Beginner to Advanced');
  const [newCourseDuration, setNewCourseDuration] = useState('12');

  const [newBatchCode, setNewBatchCode] = useState('');
  const [newBatchCourse, setNewBatchCourse] = useState('Full Stack Python + AI Architecture');
  const [newBatchCoach, setNewBatchCoach] = useState('Dr. Rajesh Verma');
  const [newBatchSchedule, setNewBatchSchedule] = useState('Monday – Saturday');
  const [newBatchTime, setNewBatchTime] = useState('07:00 PM – 08:30 PM IST');

  const [newCoachName, setNewCoachName] = useState('');
  const [newCoachEmail, setNewCoachEmail] = useState('');
  const [newCoachPassword, setNewCoachPassword] = useState('DPSkill@2026!');
  const [showCoachPassword, setShowCoachPassword] = useState(false);
  const [newCoachPhone, setNewCoachPhone] = useState('');
  const [newCoachSpecialization, setNewCoachSpecialization] = useState('');
  const [isCreatingCoach, setIsCreatingCoach] = useState(false);

  // Student Account Creation State
  const [showCreateStudentModal, setShowCreateStudentModal] = useState<boolean>(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [newStudentPassword, setNewStudentPassword] = useState('DPSkill@2026!');
  const [showStudentPassword, setShowStudentPassword] = useState(false);
  const [newStudentPhone, setNewStudentPhone] = useState('');
  const [newStudentCourse, setNewStudentCourse] = useState('Full Stack Python + AI Architecture');
  const [newStudentBatch, setNewStudentBatch] = useState('PY-FS-01');
  const [isCreatingStudent, setIsCreatingStudent] = useState(false);

  // Assign Next Class State
  const [showAssignNextClassModal, setShowAssignNextClassModal] = useState<boolean>(false);
  const [assignClassBatch, setAssignClassBatch] = useState<CohortBatch | null>(null);
  const [nextClassTopic, setNextClassTopic] = useState('');
  const [nextClassDate, setNextClassDate] = useState('Tomorrow');
  const [nextClassTime, setNextClassTime] = useState('07:00 PM – 08:30 PM IST');
  const [nextClassCoach, setNextClassCoach] = useState('Dr. Rajesh Verma');
  const [nextClassZoomUrl, setNextClassZoomUrl] = useState('https://zoom.us/j/9876543299');
  const [isAssigningClass, setIsAssigningClass] = useState(false);

  // Created Credentials Modal Card State
  const [createdCredentialsModal, setCreatedCredentialsModal] = useState<{
    role: 'STUDENT' | 'TEACHER';
    fullName: string;
    email: string;
    password: string;
    idCode?: string;
    courseOrSpecialization?: string;
    batch?: string;
  } | null>(null);
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Password Reset Modal State
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [resetTarget, setResetTarget] = useState<{
    role: 'STUDENT' | 'TEACHER';
    id: string;
    name: string;
    email: string;
    courseOrBatch?: string;
  } | null>(null);
  const [resetNewPassword, setResetNewPassword] = useState('DPSkill@2026!');
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetSendEmail, setResetSendEmail] = useState(true);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  // Student Cohort Transfer Modal State
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferStudent, setTransferStudent] = useState<StudentRecord | null>(null);
  const [transferTargetBatch, setTransferTargetBatch] = useState('PY-FS-01');
  const [transferReason, setTransferReason] = useState('Academic schedule alignment');
  const [isTransferring, setIsTransferring] = useState(false);

  // Live Classes View Mode & Interactive Calendar State
  const [liveClassesViewMode, setLiveClassesViewMode] = useState<'list' | 'calendar'>('list');
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [selectedCalendarClass, setSelectedCalendarClass] = useState<AdminLiveClass | null>(null);

  const generateStrongPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*';
    let pass = 'DPSkill@';
    for (let i = 0; i < 6; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pass + '!';
  };

  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnContent, setNewAnnContent] = useState('');
  const [newAnnPriority, setNewAnnPriority] = useState<'Normal' | 'High' | 'Urgent'>('Normal');

  const [newCertStudentName, setNewCertStudentName] = useState('');
  const [newCertCourse, setNewCertCourse] = useState('Full Stack Python + AI Architecture');
  const [newCertGrade, setNewCertGrade] = useState('Distinction (92%)');

  // ── LIVE COURSE MANAGEMENT STATE (Phase 3) ──────────────────────────────────
  const [liveCourses, setLiveCourses] = useState<LiveCourse[]>([]);
  const [liveCoursesLoading, setLiveCoursesLoading] = useState(false);
  const [liveCoursesError, setLiveCoursesError] = useState<string | null>(null);
  const [selectedLiveCourse, setSelectedLiveCourse] = useState<LiveCourse | null>(null);
  const [liveModules, setLiveModules] = useState<LiveModule[]>([]);
  const [liveModulesLoading, setLiveModulesLoading] = useState(false);
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);
  const [moduleLessonsMap, setModuleLessonsMap] = useState<Record<string, LiveLesson[]>>({});
  const [showLiveCourseForm, setShowLiveCourseForm] = useState(false);
  const [showLiveModuleForm, setShowLiveModuleForm] = useState(false);
  const [showLiveLessonForm, setShowLiveLessonForm] = useState<string | null>(null); // moduleId
  const [liveCourseFormData, setLiveCourseFormData] = useState({
    slug: '', title: '', subtitle: '', category: 'Software Engineering',
    level: 'Beginner to Advanced', duration: '12 Weeks',
    short_description: '', full_description: '', thumbnail_url: ''
  });
  const [liveModuleFormData, setLiveModuleFormData] = useState({ title: '', description: '', order_index: 1 });
  const [liveLessonFormData, setLiveLessonFormData] = useState({ title: '', description: '', order_index: 1, lesson_type: 'VIDEO' as const, duration_minutes: 60, is_required: true, is_preview: false });
  const [liveCourseFormError, setLiveCourseFormError] = useState<string | null>(null);
  const [liveCourseFormLoading, setLiveCourseFormLoading] = useState(false);

  const fetchLiveCourses = useCallback(async () => {
    setLiveCoursesLoading(true);
    setLiveCoursesError(null);
    try {
      const data = await courseManagementService.listCourses();
      setLiveCourses(data);
    } catch (err: any) {
      setLiveCoursesError(err.message || 'Failed to load courses from database.');
    } finally {
      setLiveCoursesLoading(false);
    }
  }, []);

  const fetchLiveModules = useCallback(async (courseId: string) => {
    setLiveModulesLoading(true);
    try {
      const data = await courseManagementService.listModules(courseId);
      setLiveModules(data);
    } catch (err: any) {
      console.error('Failed to load modules:', err);
    } finally {
      setLiveModulesLoading(false);
    }
  }, []);

  const fetchLiveLessons = useCallback(async (courseId: string, moduleId: string) => {
    try {
      const data = await courseManagementService.listLessons(courseId, moduleId);
      setModuleLessonsMap(prev => ({ ...prev, [moduleId]: data }));
    } catch (err: any) {
      console.error('Failed to load lessons:', err);
    }
  }, []);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.getAdminDashboard();
        if (res.success && res.data) {
          setDashboardData(res.data);
        }
      } catch (err) {
        console.warn('Admin dashboard fetch fallback:', err);
      }
    };
    fetchDashboard();

    reviewService.fetchReviews().then((revs) => {
      if (revs) setAdminReviews(revs);
    });
  }, []);

  // Load live courses when courses tab is activated
  useEffect(() => {
    if (activeTab === 'courses') {
      fetchLiveCourses();
    }
  }, [activeTab, fetchLiveCourses]);

  // Load modules when a live course is selected
  useEffect(() => {
    if (selectedLiveCourse) {
      setLiveModules([]);
      setModuleLessonsMap({});
      setExpandedModuleId(null);
      fetchLiveModules(selectedLiveCourse.id);
    }
  }, [selectedLiveCourse, fetchLiveModules]);

  const handleLiveCourseCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!liveCourseFormData.slug || !liveCourseFormData.title || !liveCourseFormData.category) {
      setLiveCourseFormError('Slug, title, and category are required.');
      return;
    }
    setLiveCourseFormLoading(true);
    setLiveCourseFormError(null);
    try {
      await courseManagementService.createCourse(liveCourseFormData);
      setShowLiveCourseForm(false);
      setLiveCourseFormData({ slug: '', title: '', subtitle: '', category: 'Software Engineering', level: 'Beginner to Advanced', duration: '12 Weeks', short_description: '', full_description: '', thumbnail_url: '' });
      await fetchLiveCourses();
    } catch (err: any) {
      setLiveCourseFormError(err.message || 'Failed to create course.');
    } finally {
      setLiveCourseFormLoading(false);
    }
  };

  const handleLiveCoursePublish = async (courseId: string) => {
    try {
      await courseManagementService.publishCourse(courseId);
      await fetchLiveCourses();
    } catch (err: any) {
      alert('Failed to publish: ' + err.message);
    }
  };

  const handleLiveCourseArchive = async (courseId: string, title: string) => {
    if (!window.confirm(`Archive course "${title}"? It will no longer be visible to students.`)) return;
    try {
      await courseManagementService.archiveCourse(courseId);
      if (selectedLiveCourse?.id === courseId) setSelectedLiveCourse(null);
      await fetchLiveCourses();
    } catch (err: any) {
      alert('Failed to archive: ' + err.message);
    }
  };

  const handleLiveCourseStatusToggle = async (course: LiveCourse) => {
    if (course.status === 'PUBLISHED') {
      await handleLiveCourseArchive(course.id, course.title);
    } else {
      await handleLiveCoursePublish(course.id);
    }
  };

  const handleLiveModuleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLiveCourse || !liveModuleFormData.title) return;
    try {
      await courseManagementService.createModule(selectedLiveCourse.id, liveModuleFormData);
      setShowLiveModuleForm(false);
      setLiveModuleFormData({ title: '', description: '', order_index: (liveModules.length + 1) });
      await fetchLiveModules(selectedLiveCourse.id);
    } catch (err: any) {
      alert('Failed to create module: ' + err.message);
    }
  };

  const handleLiveModuleArchive = async (moduleId: string) => {
    if (!selectedLiveCourse) return;
    if (!window.confirm('Archive this module? Lessons will be hidden from students.')) return;
    try {
      await courseManagementService.archiveModule(selectedLiveCourse.id, moduleId);
      await fetchLiveModules(selectedLiveCourse.id);
    } catch (err: any) {
      alert('Failed to archive module: ' + err.message);
    }
  };

  const handleLiveLessonCreate = async (e: React.FormEvent, moduleId: string) => {
    e.preventDefault();
    if (!selectedLiveCourse || !liveLessonFormData.title) return;
    try {
      await courseManagementService.createLesson(selectedLiveCourse.id, moduleId, liveLessonFormData);
      setShowLiveLessonForm(null);
      setLiveLessonFormData({ title: '', description: '', order_index: 1, lesson_type: 'VIDEO', duration_minutes: 60, is_required: true, is_preview: false });
      await fetchLiveLessons(selectedLiveCourse.id, moduleId);
    } catch (err: any) {
      alert('Failed to create lesson: ' + err.message);
    }
  };

  const handleLiveLessonPublish = async (moduleId: string, lessonId: string) => {
    if (!selectedLiveCourse) return;
    try {
      await courseManagementService.publishLesson(selectedLiveCourse.id, moduleId, lessonId);
      await fetchLiveLessons(selectedLiveCourse.id, moduleId);
    } catch (err: any) {
      alert('Failed to publish lesson: ' + err.message);
    }
  };

  const handleLiveLessonArchive = async (moduleId: string, lessonId: string, title: string) => {
    if (!selectedLiveCourse) return;
    if (!window.confirm(`Unpublish/archive lesson "${title}"?`)) return;
    try {
      await courseManagementService.archiveLesson(selectedLiveCourse.id, moduleId, lessonId);
      await fetchLiveLessons(selectedLiveCourse.id, moduleId);
    } catch (err: any) {
      alert('Failed to archive lesson: ' + err.message);
    }
  };

  const handleDeleteAdminReview = async (id: string, authorName: string) => {
    if (window.confirm(`Admin Moderation: Permanently delete review by "${authorName}"?`)) {
      const res = await reviewService.deleteReview(id);
      if (res.success) {
        setAdminReviews((prev) => prev.filter((r) => r.id !== id));
      } else {
        alert(res.error || 'Failed to delete review');
      }
    }
  };

  // Filter handlers
  const filteredStudents = studentsList.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchStudent.toLowerCase()) ||
      s.email.toLowerCase().includes(searchStudent.toLowerCase()) ||
      s.id.toLowerCase().includes(searchStudent.toLowerCase());
    const matchesBatch = filterBatch === 'all' || s.batch === filterBatch;
    return matchesSearch && matchesBatch;
  });

  const filteredCourses = coursesList.filter((c) => {
    if (filterCourseStatus === 'all') return true;
    return c.status.toLowerCase() === filterCourseStatus.toLowerCase();
  });

  const filteredClasses = classesList.filter((cl) => {
    if (filterClassStatus === 'all') return true;
    return cl.status.toLowerCase() === filterClassStatus.toLowerCase();
  });

  const toggleStudentStatus = (id: string) => {
    setStudentsList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: s.status === 'active' ? 'suspended' : 'active' } : s))
    );
  };

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle) return;
    const newCourse: AdminCourse = {
      id: `course-${Date.now()}`,
      title: newCourseTitle,
      slug: newCourseTitle.toLowerCase().replace(/\s+/g, '-'),
      description: newCourseDesc || 'Engineering course curriculum covering modern software development.',
      thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
      level: newCourseLevel,
      durationWeeks: parseInt(newCourseDuration) || 12,
      status: 'Draft',
      enrolledStudents: 0,
      activeBatchesCount: 0,
      modulesCount: 1,
      lessonsCount: 4,
      modules: [
        {
          id: `mod-init-${Date.now()}`,
          order: 1,
          title: 'Foundational Concepts & Setup',
          durationWeeks: 2,
          lessons: [
            { id: 'les-init-1', title: 'Architecture Overview & Toolchain', type: 'live', durationMin: 90 },
            { id: 'les-init-2', title: 'Core Principles & Hands-on Lab', type: 'lab', durationMin: 60 }
          ]
        }
      ]
    };
    setCoursesList([newCourse, ...coursesList]);
    setNewCourseTitle('');
    setNewCourseDesc('');
    setShowCreateCourseModal(false);
  };

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBatchCode) return;
    const newBatch: CohortBatch = {
      id: `batch-${Date.now()}`,
      code: newBatchCode.toUpperCase(),
      courseTitle: newBatchCourse,
      coachName: newBatchCoach,
      enrolledCount: 0,
      capacity: 15, // Strictly capped at 15
      scheduleDays: newBatchSchedule,
      timeSlot: newBatchTime,
      status: 'upcoming',
      zoomJoinUrl: 'https://zoom.us/j/9876543299'
    };
    setBatchesList([...batchesList, newBatch]);
    setNewBatchCode('');
    setShowCreateBatchModal(false);
  };

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName || !newStudentEmail) return;
    const studentPass = newStudentPassword || generateStrongPassword();
    setIsCreatingStudent(true);

    try {
      const res = await api.adminCreateStudent({
        fullName: newStudentName,
        email: newStudentEmail,
        password: studentPass,
        phone: newStudentPhone || '+91 98765 43210',
        courseName: newStudentCourse,
        batchName: newStudentBatch
      });

      const studentCode = res?.student?.studentId || `STU-${Math.floor(1000 + Math.random() * 9000)}`;

      const newStudent: StudentRecord = {
        id: studentCode,
        name: newStudentName,
        email: newStudentEmail,
        phone: newStudentPhone || '+91 98765 43210',
        course: newStudentCourse,
        batch: newStudentBatch,
        progress: 0,
        attendance: 100,
        lastActive: 'Just registered',
        status: 'active',
        enrolledDate: 'Today',
        assignmentsSubmitted: 0,
        totalAssignments: 8,
        quizScoreAvg: 0,
        codingSubmissions: 0,
        capstoneStatus: 'In Progress',
        questionsAsked: 0,
        mockInterviewScore: null,
        certificateIssued: false
      };
      setStudentsList([newStudent, ...studentsList]);

      setCreatedCredentialsModal({
        role: 'STUDENT',
        fullName: newStudentName,
        email: newStudentEmail,
        password: studentPass,
        idCode: studentCode,
        courseOrSpecialization: newStudentCourse,
        batch: newStudentBatch
      });

      setNewStudentName('');
      setNewStudentEmail('');
      setNewStudentPassword('DPSkill@2026!');
      setNewStudentPhone('');
      setShowCreateStudentModal(false);
    } catch (err: any) {
      alert('Error creating student account: ' + (err.message || 'Check server connection'));
    } finally {
      setIsCreatingStudent(false);
    }
  };

  const handleAddCoach = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoachName) return;
    const coachEmail = newCoachEmail || `${newCoachName.toLowerCase().replace(/\s+/g, '.')}@dpskilltech.in`;
    const coachPass = newCoachPassword || generateStrongPassword();
    setIsCreatingCoach(true);

    try {
      const res = await api.adminCreateCoach({
        fullName: newCoachName,
        email: coachEmail,
        password: coachPass,
        phone: newCoachPhone || '+91 98765 00000',
        specialization: newCoachSpecialization || 'Full Stack Software Engineering',
        assignedCourses: ['Full Stack Python + AI Architecture']
      });

      const newCoach: AdminCoachProfile = {
        id: res?.coach?.userId || `cch-${Date.now()}`,
        name: newCoachName,
        email: coachEmail,
        phone: newCoachPhone || '+91 98765 00000',
        specialization: newCoachSpecialization || 'Full Stack Software Engineering',
        assignedCourses: ['Full Stack Python + AI Architecture'],
        assignedBatches: [],
        upcomingClassesCount: 0,
        completedClassesCount: 0,
        questionsAnswered: 0,
        assignmentsReviewed: 0,
        mockInterviewsConducted: 0,
        rating: 5.0,
        status: 'active'
      };
      setCoachesList([newCoach, ...coachesList]);

      setCreatedCredentialsModal({
        role: 'TEACHER',
        fullName: newCoachName,
        email: coachEmail,
        password: coachPass,
        courseOrSpecialization: newCoachSpecialization || 'Full Stack Software Engineering'
      });

      setNewCoachName('');
      setNewCoachEmail('');
      setNewCoachPassword('DPSkill@2026!');
      setNewCoachPhone('');
      setNewCoachSpecialization('');
      setShowAddCoachModal(false);
    } catch (err: any) {
      alert('Error provisioning coach: ' + (err.message || 'Check server connection'));
    } finally {
      setIsCreatingCoach(false);
    }
  };

  const handleAssignNextClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignClassBatch || !nextClassTopic) return;
    setIsAssigningClass(true);

    try {
      await api.adminAssignNextClass(assignClassBatch.id, {
        topic: nextClassTopic,
        scheduleDate: nextClassDate,
        timeSlot: nextClassTime,
        coachName: nextClassCoach,
        zoomJoinUrl: nextClassZoomUrl
      });

      // Update matching batch
      setBatchesList(prev => prev.map(b => {
        if (b.id === assignClassBatch.id) {
          return {
            ...b,
            nextTopic: nextClassTopic,
            timeSlot: nextClassTime,
            coachName: nextClassCoach,
            zoomJoinUrl: nextClassZoomUrl
          };
        }
        return b;
      }));

      const newLiveClass: AdminLiveClass = {
        id: `live-${Date.now()}`,
        courseTitle: assignClassBatch.courseTitle,
        batchCode: assignClassBatch.code,
        moduleName: 'Core Curriculum',
        lessonTitle: nextClassTopic,
        coachName: nextClassCoach,
        date: nextClassDate,
        time: nextClassTime,
        status: 'Scheduled',
        zoomJoinUrl: nextClassZoomUrl,
        recordingAvailable: false,
        attendancePresent: 0,
        attendanceTotal: assignClassBatch.enrolledCount || 14
      };
      setClassesList(prev => [newLiveClass, ...prev]);

      setShowAssignNextClassModal(false);
      setAssignClassBatch(null);
      setNextClassTopic('');
    } catch (err: any) {
      alert('Error assigning class: ' + (err.message || 'Internal error'));
    } finally {
      setIsAssigningClass(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetTarget || !resetNewPassword) return;
    setIsResettingPassword(true);
    try {
      if (resetTarget.role === 'STUDENT') {
        await api.adminResetStudentPassword({
          studentUserId: resetTarget.id,
          id: resetTarget.id,
          email: resetTarget.email,
          fullName: resetTarget.name,
          password: resetNewPassword,
          sendEmail: resetSendEmail
        });
      } else {
        await api.adminResetCoachPassword({
          coachUserId: resetTarget.id,
          id: resetTarget.id,
          email: resetTarget.email,
          fullName: resetTarget.name,
          password: resetNewPassword,
          sendEmail: resetSendEmail
        });
      }

      setShowResetPasswordModal(false);
      setCreatedCredentialsModal({
        role: resetTarget.role,
        fullName: resetTarget.name,
        email: resetTarget.email,
        password: resetNewPassword,
        courseOrSpecialization: resetTarget.courseOrBatch
      });

      setFeedbackToast(`Password updated successfully for ${resetTarget.name}!`);
      setTimeout(() => setFeedbackToast(null), 4000);
    } catch (err: any) {
      alert('Error resetting password: ' + (err.message || 'Check server connection'));
    } finally {
      setIsResettingPassword(false);
    }
  };

  const handleResendCredentials = async (target: {
    role: 'STUDENT' | 'TEACHER';
    name: string;
    email: string;
    courseOrBatch?: string;
  }) => {
    try {
      const res = await api.adminResendCredentials({
        email: target.email,
        role: target.role,
        fullName: target.name,
        courseOrBatch: target.courseOrBatch
      });
      if (res?.success) {
        setFeedbackToast(`Credentials email dispatched to ${target.email}`);
      } else {
        setFeedbackToast(`Credentials notification logged for ${target.email}`);
      }
      setTimeout(() => setFeedbackToast(null), 4000);
    } catch (err: any) {
      alert('Failed to resend credentials: ' + (err.message || 'Check server'));
    }
  };

  const handleTransferBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferStudent || !transferTargetBatch) return;

    // Strict 15-capacity check
    const targetBatchObj = batchesList.find(b => b.code === transferTargetBatch);
    if (targetBatchObj && targetBatchObj.enrolledCount >= 15) {
      alert(`Cannot transfer: Batch ${transferTargetBatch} is at full capacity (15 students maximum) per DP Skilltech educational policy.`);
      return;
    }

    setIsTransferring(true);
    try {
      await api.adminTransferStudentBatch(transferStudent.id, {
        targetBatchCode: transferTargetBatch,
        reason: transferReason
      });

      const oldBatchCode = transferStudent.batch;

      setStudentsList(prev => prev.map(s => s.id === transferStudent.id ? { ...s, batch: transferTargetBatch } : s));

      setBatchesList(prev => prev.map(b => {
        if (b.code === transferTargetBatch) return { ...b, enrolledCount: Math.min(15, b.enrolledCount + 1) };
        if (b.code === oldBatchCode) return { ...b, enrolledCount: Math.max(0, b.enrolledCount - 1) };
        return b;
      }));

      setShowTransferModal(false);
      setFeedbackToast(`Student ${transferStudent.name} successfully transferred to ${transferTargetBatch}`);
      setTimeout(() => setFeedbackToast(null), 4000);
    } catch (err: any) {
      alert('Transfer failed: ' + (err.message || 'Check server connection'));
    } finally {
      setIsTransferring(false);
    }
  };

  const handlePublishAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnTitle || !newAnnContent) return;
    const newAnn: AdminAnnouncement = {
      id: `ann-${Date.now()}`,
      title: newAnnTitle,
      content: newAnnContent,
      targetBatch: 'All Batches',
      authorName: user?.fullName || 'Siddharth Patel (Academic Director)',
      date: 'Just now',
      priority: newAnnPriority
    };
    setAnnouncementsList([newAnn, ...announcementsList]);
    setNewAnnTitle('');
    setNewAnnContent('');
    setShowAnnouncementModal(false);
  };

  const handleIssueCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCertStudentName) return;
    const certNum = Math.floor(1000 + Math.random() * 9000);
    const newCert: AdminCertificate = {
      id: `cert-${Date.now()}`,
      certificateId: `DPS-CERT-2026-${certNum}`,
      studentName: newCertStudentName,
      studentId: `STU-${Math.floor(1000 + Math.random() * 100)}`,
      courseTitle: newCertCourse,
      issueDate: 'Today',
      verificationCode: `DPS-VER-${certNum}-X`,
      status: 'Issued',
      grade: newCertGrade
    };
    setCertificatesList([newCert, ...certificatesList]);
    setNewCertStudentName('');
    setShowIssueCertModal(false);
  };

  return (
    <PortalLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onNavigateToPublic={onNavigateToPublic}
      title={
        activeTab === 'dashboard'
          ? `Executive Administration — ${user?.fullName || 'Platform Director'}`
          : activeTab === 'courses'
          ? 'Curriculum Architecture & Course Directory'
          : activeTab === 'batches'
          ? 'Cohort Capacity Governance (Strict 15-Student Cap Rule)'
          : activeTab === 'students'
          ? 'Academy Student Roster & Cohort Enrollment'
          : activeTab === 'coaches'
          ? 'Faculty & Engineering Coaches Directory'
          : activeTab === 'classes'
          ? 'Live Zoom Classes & Class Session Operations'
          : activeTab === 'assignments'
          ? 'Academic Assessments & Capstone Defense'
          : activeTab === 'questions'
          ? 'Student Questions Audit & Academy Announcements'
          : activeTab === 'mock-interviews'
          ? '1-on-1 Private Mock Interview Auditing'
          : activeTab === 'certificates'
          ? 'Verified Certificate Issuance & Validation'
          : activeTab === 'reviews'
          ? 'Student & Community Reviews Moderation (Real-Time Feed)'
          : activeTab === 'analytics'
          ? 'Academy Metrics & Auditing Intelligence'
          : activeTab === 'settings'
          ? 'Platform Configuration, RBAC & Integrations'
          : 'Academy Administration'
      }
      subtitle="Academy-wide governance: Audit cohort caps (15-student rule), monitor faculty, and review platform performance."
    >
      <div className="admin-portal-stack">
        {feedbackToast && (
          <div className="admin-floating-toast">
            <CheckCircle2 size={16} style={{ color: '#10b981' }} />
            <span>{feedbackToast}</span>
          </div>
        )}
        {/* ==================================================================
            TAB 1: EXECUTIVE DASHBOARD
            ================================================================== */}
        {activeTab === 'dashboard' && (
          <OverviewTab
            studentsList={studentsList}
            coachesList={coachesList}
            coursesList={coursesList}
            batchesList={batchesList}
            questionThreads={questionThreads}
            assignmentsList={assignmentsList}
            mockSessions={mockSessions}
            onCreateCohort={() => setShowCreateBatchModal(true)}
            onEnrollStudent={() => setShowCreateStudentModal(true)}
            onAddCoach={() => setShowAddCoachModal(true)}
            onScheduleClass={() => setShowScheduleClassModal(true)}
            onIssueCertificate={() => setShowIssueCertModal(true)}
            onSelectBatch={(batch) => {
              setFilterBatch(batch.code);
              setActiveTab('students');
            }}
          />
        )}

        {/* ==================================================================
            TAB 2: COURSES & CURRICULUM
            ================================================================== */}
        {activeTab === 'courses' && (
          <CoursesTab
            liveCourses={liveCourses}
            liveCoursesLoading={liveCoursesLoading}
            liveCoursesError={liveCoursesError}
            selectedLiveCourse={selectedLiveCourse}
            setSelectedLiveCourse={setSelectedLiveCourse}
            liveModules={liveModules}
            liveModulesLoading={liveModulesLoading}
            expandedModuleId={expandedModuleId}
            setExpandedModuleId={setExpandedModuleId}
            moduleLessonsMap={moduleLessonsMap}
            fetchLiveLessons={fetchLiveLessons}
            showLiveCourseForm={showLiveCourseForm}
            setShowLiveCourseForm={setShowLiveCourseForm}
            showLiveModuleForm={showLiveModuleForm}
            setShowLiveModuleForm={setShowLiveModuleForm}
            showLiveLessonForm={showLiveLessonForm}
            setShowLiveLessonForm={setShowLiveLessonForm}
            liveCourseFormData={liveCourseFormData}
            setLiveCourseFormData={setLiveCourseFormData}
            liveModuleFormData={liveModuleFormData}
            setLiveModuleFormData={setLiveModuleFormData}
            liveLessonFormData={liveLessonFormData}
            setLiveLessonFormData={setLiveLessonFormData}
            liveCourseFormError={liveCourseFormError}
            setLiveCourseFormError={setLiveCourseFormError}
            liveCourseFormLoading={liveCourseFormLoading}
            handleLiveCourseCreate={handleLiveCourseCreate}
            handleLiveCourseStatusToggle={handleLiveCourseStatusToggle}
            handleLiveModuleCreate={handleLiveModuleCreate}
            handleLiveModuleArchive={handleLiveModuleArchive}
            handleLiveLessonCreate={handleLiveLessonCreate}
            handleLiveLessonPublish={handleLiveLessonPublish}
            handleLiveLessonArchive={handleLiveLessonArchive}
            coursesList={coursesList}
            filteredCourses={filteredCourses}
            filterCourseStatus={filterCourseStatus}
            setFilterCourseStatus={setFilterCourseStatus}
            setShowCreateCourseModal={setShowCreateCourseModal}
            setSelectedCourseCurriculum={setSelectedCourseCurriculum}
          />
        )}

        {/* ==================================================================
            TAB 3: BATCH CAPACITY (15-CAP STRICT GOVERNANCE)
            ================================================================== */}
        {activeTab === 'batches' && (
          <BatchesTab
            batchesList={batchesList}
            setShowCreateBatchModal={setShowCreateBatchModal}
            setAssignClassBatch={setAssignClassBatch}
            setNextClassTopic={setNextClassTopic}
            setNextClassCoach={setNextClassCoach}
            setNextClassTime={setNextClassTime}
            setShowAssignNextClassModal={setShowAssignNextClassModal}
            setFilterBatch={setFilterBatch}
            setActiveTab={setActiveTab}
          />
        )}

        {/* ==================================================================
            TAB 4: STUDENTS DIRECTORY
            ================================================================== */}
        {activeTab === 'students' && (
          <StudentsTab
            studentsList={studentsList}
            filteredStudents={filteredStudents}
            batchesList={batchesList}
            searchStudent={searchStudent}
            setSearchStudent={setSearchStudent}
            filterBatch={filterBatch}
            setFilterBatch={setFilterBatch}
            setShowCreateStudentModal={setShowCreateStudentModal}
            setSelectedStudentProfile={setSelectedStudentProfile}
            setResetTarget={setResetTarget}
            setResetNewPassword={setResetNewPassword}
            setShowResetPasswordModal={setShowResetPasswordModal}
            generateStrongPassword={generateStrongPassword}
            setTransferStudent={setTransferStudent}
            setTransferTargetBatch={setTransferTargetBatch}
            setShowTransferModal={setShowTransferModal}
            handleResendCredentials={handleResendCredentials}
            toggleStudentStatus={toggleStudentStatus}
          />
        )}

        {/* ==================================================================
            TAB 5: COACHES DIRECTORY
            ================================================================== */}
        {activeTab === 'coaches' && (
          <CoachesTab
            coachesList={coachesList}
            setShowAddCoachModal={setShowAddCoachModal}
            setResetTarget={setResetTarget}
            setResetNewPassword={setResetNewPassword}
            setShowResetPasswordModal={setShowResetPasswordModal}
            generateStrongPassword={generateStrongPassword}
            handleResendCredentials={handleResendCredentials}
          />
        )}

        {/* ==================================================================
            TAB 6: LIVE CLASSES & ZOOM SESSIONS
            ================================================================== */}
        {activeTab === 'classes' && (
          <LiveClassesTab
            classesList={classesList}
            filteredClasses={filteredClasses}
            filterClassStatus={filterClassStatus}
            setFilterClassStatus={setFilterClassStatus}
            liveClassesViewMode={liveClassesViewMode}
            setLiveClassesViewMode={setLiveClassesViewMode}
            calendarMonth={calendarMonth}
            setCalendarMonth={setCalendarMonth}
            calendarYear={calendarYear}
            setCalendarYear={setCalendarYear}
            selectedCalendarClass={selectedCalendarClass}
            setSelectedCalendarClass={setSelectedCalendarClass}
            setShowScheduleClassModal={setShowScheduleClassModal}
          />
        )}

        {/* ==================================================================
            TAB 7: ASSIGNMENTS & ASSESSMENTS
            ================================================================== */}
        {activeTab === 'assignments' && (
          <AssessmentsTab assignmentsList={assignmentsList} />
        )}

        {/* ==================================================================
            TAB 8: COMMUNICATION & Q&A
            ================================================================== */}
        {activeTab === 'questions' && (
          <CommunicationTab
            announcementsList={announcementsList}
            questionThreads={questionThreads}
            setShowAnnouncementModal={setShowAnnouncementModal}
          />
        )}

        {/* ==================================================================
            TAB 9: 1-ON-1 PRIVATE MOCK INTERVIEWS
            ================================================================== */}
        {activeTab === 'mock-interviews' && (
          <MockInterviewsTab mockSessions={mockSessions} />
        )}

        {/* ==================================================================
            TAB 10: CERTIFICATES REGISTRY
            ================================================================== */}
        {activeTab === 'certificates' && (
          <CertificatesTab
            certificatesList={certificatesList}
            setShowIssueCertModal={setShowIssueCertModal}
            onNavigateToPublic={onNavigateToPublic}
          />
        )}

        {/* ==================================================================
            TAB 11: REVIEWS MODERATION
            ================================================================== */}
        {activeTab === 'reviews' && (
          <ReviewsTab
            adminReviews={adminReviews}
            searchReview={searchReview}
            setSearchReview={setSearchReview}
            filterRating={filterRating}
            setFilterRating={setFilterRating}
            handleDeleteReview={async (reviewId) => {
              const r = adminReviews.find(x => x.id === reviewId);
              await handleDeleteAdminReview(reviewId, r ? r.authorName : 'Author');
            }}
          />
        )}

        {/* ==================================================================
            TAB 12: ANALYTICS & TELEMETRY
            ================================================================== */}
        {activeTab === 'analytics' && <AnalyticsTab />}

        {/* ==================================================================
            TAB 13: SETTINGS & RBAC
            ================================================================== */}
        {activeTab === 'settings' && <SettingsTab />}

        {/* ==================================================================
            STUDENT PROFILE DRAWER / MODAL (SECTION 7 REQUIREMENTS)
            ================================================================== */}
        {selectedStudentProfile && (
          <div className="admin-modal-backdrop" onClick={() => setSelectedStudentProfile(null)}>
            <div className="admin-profile-drawer" onClick={(e) => e.stopPropagation()}>
              <div className="drawer-header">
                <div className="drawer-title-wrap">
                  <div className="student-drawer-avatar">
                    {selectedStudentProfile.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <h3>{selectedStudentProfile.name}</h3>
                    <span className="drawer-sub">{selectedStudentProfile.id} &bull; Enrolled {selectedStudentProfile.enrolledDate}</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-drawer-close"
                  onClick={() => setSelectedStudentProfile(null)}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="drawer-body">
                {/* Personal Information */}
                <div className="drawer-section">
                  <h4 className="drawer-section-title">Personal &amp; Enrollment Details</h4>
                  <div className="detail-grid">
                    <div><strong>Email:</strong> <span>{selectedStudentProfile.email}</span></div>
                    <div><strong>Phone:</strong> <span>{selectedStudentProfile.phone}</span></div>
                    <div><strong>Current Batch:</strong> <span className="batch-pill">{selectedStudentProfile.batch}</span></div>
                    <div><strong>Course:</strong> <span>{selectedStudentProfile.course}</span></div>
                    <div>
                      <strong>Account Status:</strong>{' '}
                      <span className={`status-pill pill-${selectedStudentProfile.status}`}>
                        {selectedStudentProfile.status.toUpperCase()}
                      </span>
                    </div>
                    <div><strong>Last Active:</strong> <span>{selectedStudentProfile.lastActive}</span></div>
                  </div>
                </div>

                {/* Progress & Attendance */}
                <div className="drawer-section">
                  <h4 className="drawer-section-title">Curriculum Progress &amp; Attendance</h4>
                  <div className="drawer-metric-row">
                    <div className="drawer-metric-card">
                      <span className="metric-title">Course Progress</span>
                      <strong className="metric-val text-orange">{selectedStudentProfile.progress}%</strong>
                      <div className="table-bar" style={{ width: `${selectedStudentProfile.progress}%` }}></div>
                    </div>
                    <div className="drawer-metric-card">
                      <span className="metric-title">Live Class Attendance</span>
                      <strong className="metric-val text-green">{selectedStudentProfile.attendance}%</strong>
                      <span>Consistent 6-day attendance</span>
                    </div>
                  </div>
                </div>

                {/* Academic Performance */}
                <div className="drawer-section">
                  <h4 className="drawer-section-title">Assignments &amp; Assessment Records</h4>
                  <div className="detail-grid">
                    <div>
                      <strong>Assignments:</strong>{' '}
                      <span>{selectedStudentProfile.assignmentsSubmitted} of {selectedStudentProfile.totalAssignments} Submitted</span>
                    </div>
                    <div>
                      <strong>Quiz Average:</strong>{' '}
                      <span className="text-orange font-semibold">{selectedStudentProfile.quizScoreAvg}%</span>
                    </div>
                    <div>
                      <strong>Coding Lab Runs:</strong>{' '}
                      <span>{selectedStudentProfile.codingSubmissions} Executions</span>
                    </div>
                    <div>
                      <strong>Capstone Defense:</strong>{' '}
                      <span className="status-badge badge-available">{selectedStudentProfile.capstoneStatus}</span>
                    </div>
                  </div>
                </div>

                {/* Mentorship & Career Defense */}
                <div className="drawer-section">
                  <h4 className="drawer-section-title">Ask Coach Questions &amp; Mock Defense</h4>
                  <div className="detail-grid">
                    <div>
                      <strong>Questions Asked:</strong>{' '}
                      <span>{selectedStudentProfile.questionsAsked} Inquiries Resolved</span>
                    </div>
                    <div>
                      <strong>Mock Interview Score:</strong>{' '}
                      <span>
                        {selectedStudentProfile.mockInterviewScore
                          ? `${selectedStudentProfile.mockInterviewScore} / 10 (Rubric Passed)`
                          : 'Pending Slot Scheduling'}
                      </span>
                    </div>
                    <div>
                      <strong>Certificate Issued:</strong>{' '}
                      <span>{selectedStudentProfile.certificateIssued ? 'Yes (Verified)' : 'Pending Final Defense'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="drawer-footer">
                <button
                  type="button"
                  className={`btn-admin-secondary ${selectedStudentProfile.status === 'active' ? 'btn-warn' : 'btn-success'}`}
                  onClick={() => {
                    toggleStudentStatus(selectedStudentProfile.id);
                    setSelectedStudentProfile({
                      ...selectedStudentProfile,
                      status: selectedStudentProfile.status === 'active' ? 'suspended' : 'active'
                    });
                  }}
                >
                  {selectedStudentProfile.status === 'active' ? 'Suspend Access' : 'Activate Access'}
                </button>
                <button
                  type="button"
                  className="btn-admin-primary"
                  onClick={() => setSelectedStudentProfile(null)}
                >
                  Close Dossier
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================
            COURSE SYLLABUS INSPECTOR MODAL
            ================================================================== */}
        {selectedCourseCurriculum && (
          <div className="admin-modal-backdrop" onClick={() => setSelectedCourseCurriculum(null)}>
            <div className="admin-modal-dialog" onClick={(e) => e.stopPropagation()}>
              <div className="dialog-header">
                <h3>{selectedCourseCurriculum.title} &mdash; Syllabus Modules</h3>
                <button type="button" onClick={() => setSelectedCourseCurriculum(null)}>
                  <X size={18} />
                </button>
              </div>

              <div className="dialog-body">
                <p className="dialog-desc">{selectedCourseCurriculum.description}</p>
                <div className="modules-accordion-list">
                  {selectedCourseCurriculum.modules.map((m) => (
                    <div key={m.id} className="module-inspect-box">
                      <div className="module-inspect-top">
                        <strong>Module 0{m.order}: {m.title}</strong>
                        <span>{m.durationWeeks} Weeks</span>
                      </div>
                      <div className="lesson-inspect-list">
                        {m.lessons.map((l) => (
                          <div key={l.id} className="lesson-inspect-item">
                            <span className={`lesson-type-tag tag-${l.type}`}>{l.type.toUpperCase()}</span>
                            <span>{l.title}</span>
                            <span className="lesson-duration">{l.durationMin}m</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="dialog-footer">
                <button
                  type="button"
                  className="btn-admin-primary"
                  onClick={() => setSelectedCourseCurriculum(null)}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================
            CREATE COURSE MODAL
            ================================================================== */}
        {showCreateCourseModal && (
          <div className="admin-modal-backdrop" onClick={() => setShowCreateCourseModal(false)}>
            <div className="admin-modal-dialog" onClick={(e) => e.stopPropagation()}>
              <div className="dialog-header">
                <h3>Create New Engineering Course</h3>
                <button type="button" onClick={() => setShowCreateCourseModal(false)}>
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateCourse}>
                <div className="dialog-body">
                  <div className="form-group">
                    <label className="form-label">Course Title *</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      placeholder="e.g. Distributed Systems & Golang Microservices"
                      value={newCourseTitle}
                      onChange={(e) => setNewCourseTitle(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-input"
                      rows={3}
                      placeholder="Course overview and targeted engineering competencies..."
                      value={newCourseDesc}
                      onChange={(e) => setNewCourseDesc(e.target.value)}
                    />
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label">Skill Level</label>
                      <select
                        className="form-input"
                        value={newCourseLevel}
                        onChange={(e: any) => setNewCourseLevel(e.target.value)}
                      >
                        <option value="Beginner to Advanced">Beginner to Advanced</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Duration (Weeks)</label>
                      <input
                        type="number"
                        className="form-input"
                        value={newCourseDuration}
                        onChange={(e) => setNewCourseDuration(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="dialog-footer">
                  <button
                    type="button"
                    className="btn-admin-secondary"
                    onClick={() => setShowCreateCourseModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-admin-primary">
                    Create Course Draft
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ==================================================================
            CREATE BATCH MODAL
            ================================================================== */}
        {showCreateBatchModal && (
          <div className="admin-modal-backdrop" onClick={() => setShowCreateBatchModal(false)}>
            <div className="admin-modal-dialog" onClick={(e) => e.stopPropagation()}>
              <div className="dialog-header">
                <h3>Create New Cohort (Strict 15-Cap Rule)</h3>
                <button type="button" onClick={() => setShowCreateBatchModal(false)}>
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateBatch}>
                <div className="dialog-body">
                  <div className="form-group">
                    <label className="form-label">Cohort Code *</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      placeholder="e.g. PY-FS-02 or GO-DS-01"
                      value={newBatchCode}
                      onChange={(e) => setNewBatchCode(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Curriculum</label>
                    <select
                      className="form-input"
                      value={newBatchCourse}
                      onChange={(e) => setNewBatchCourse(e.target.value)}
                    >
                      {coursesList.map((c) => (
                        <option key={c.id} value={c.title}>{c.title}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Assigned Lead Coach</label>
                    <select
                      className="form-input"
                      value={newBatchCoach}
                      onChange={(e) => setNewBatchCoach(e.target.value)}
                    >
                      {coachesList.map((c) => (
                        <option key={c.id} value={c.name}>{c.name} ({c.specialization})</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label">Schedule Days</label>
                      <input
                        type="text"
                        className="form-input"
                        value={newBatchSchedule}
                        onChange={(e) => setNewBatchSchedule(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Daily Time Slot (IST)</label>
                      <input
                        type="text"
                        className="form-input"
                        value={newBatchTime}
                        onChange={(e) => setNewBatchTime(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="rule-warning-box">
                    <ShieldCheck size={16} className="icon-green" />
                    <span>Cohort size is automatically fixed at <strong>15 students maximum</strong> per DP Skilltech educational policy.</span>
                  </div>
                </div>

                <div className="dialog-footer">
                  <button
                    type="button"
                    className="btn-admin-secondary"
                    onClick={() => setShowCreateBatchModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-admin-primary">
                    Launch Cohort
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ==================================================================
            CREATE STUDENT MODAL
            ================================================================== */}
        {showCreateStudentModal && (
          <div className="admin-modal-backdrop" onClick={() => setShowCreateStudentModal(false)}>
            <div className="admin-modal-dialog" onClick={(e) => e.stopPropagation()}>
              <div className="dialog-header">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <UserPlus size={18} style={{ color: 'var(--brand-orange)' }} />
                    <h3 style={{ margin: 0 }}>Provision Student Account</h3>
                  </div>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: 'var(--gray-500)' }}>
                    Create login credentials (Email & Password) for immediate LMS portal access.
                  </p>
                </div>
                <button type="button" onClick={() => setShowCreateStudentModal(false)}>
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateStudent}>
                <div className="dialog-body">
                  <div className="form-group">
                    <label className="form-label">Student Full Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      placeholder="e.g. Ananya Deshmukh"
                      value={newStudentName}
                      onChange={(e) => setNewStudentName(e.target.value)}
                    />
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label">Student Login Email *</label>
                      <input
                        type="email"
                        className="form-input"
                        required
                        placeholder="student@example.com"
                        value={newStudentEmail}
                        onChange={(e) => setNewStudentEmail(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone Number</label>
                      <input
                        type="tel"
                        className="form-input"
                        placeholder="+91 98765 43210"
                        value={newStudentPhone}
                        onChange={(e) => setNewStudentPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label">Enrolled Course</label>
                      <select
                        className="form-input"
                        value={newStudentCourse}
                        onChange={(e) => setNewStudentCourse(e.target.value)}
                      >
                        {coursesList.map((c) => (
                          <option key={c.id} value={c.title}>{c.title}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Assigned Cohort / Batch</label>
                      <select
                        className="form-input"
                        value={newStudentBatch}
                        onChange={(e) => setNewStudentBatch(e.target.value)}
                      >
                        {batchesList.map((b) => (
                          <option key={b.id} value={b.code}>{b.code} ({b.courseTitle})</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Login Password *</label>
                    <div className="input-with-action-row">
                      <input
                        type={showStudentPassword ? 'text' : 'password'}
                        className="form-input"
                        required
                        placeholder="Minimum 6 characters"
                        value={newStudentPassword}
                        onChange={(e) => setNewStudentPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="btn-toggle-eye"
                        onClick={() => setShowStudentPassword(!showStudentPassword)}
                        title={showStudentPassword ? 'Hide password' : 'Show password'}
                      >
                        {showStudentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <button
                        type="button"
                        className="btn-generate-pass"
                        onClick={() => setNewStudentPassword(generateStrongPassword())}
                        title="Generate strong password"
                      >
                        <RefreshCw size={13} />
                        <span>Generate</span>
                      </button>
                    </div>
                  </div>

                  <div className="rule-warning-box">
                    <Key size={16} className="icon-green" />
                    <span>The student will log in at <code>/#login</code> using this email and password immediately.</span>
                  </div>
                </div>

                <div className="dialog-footer">
                  <button
                    type="button"
                    className="btn-admin-secondary"
                    onClick={() => setShowCreateStudentModal(false)}
                    disabled={isCreatingStudent}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-admin-primary" disabled={isCreatingStudent}>
                    {isCreatingStudent ? 'Creating Account...' : 'Create Student Account'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ==================================================================
            ADD COACH MODAL
            ================================================================== */}
        {showAddCoachModal && (
          <div className="admin-modal-backdrop" onClick={() => setShowAddCoachModal(false)}>
            <div className="admin-modal-dialog" onClick={(e) => e.stopPropagation()}>
              <div className="dialog-header">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ShieldCheck size={18} style={{ color: 'var(--brand-orange)' }} />
                    <h3 style={{ margin: 0 }}>Register Faculty / Coach</h3>
                  </div>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: 'var(--gray-500)' }}>
                    Provision teacher credentials (Email & Password) for classroom and mock interview access.
                  </p>
                </div>
                <button type="button" onClick={() => setShowAddCoachModal(false)}>
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddCoach}>
                <div className="dialog-body">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      placeholder="e.g. Dr. Rajesh Verma"
                      value={newCoachName}
                      onChange={(e) => setNewCoachName(e.target.value)}
                    />
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label">Coach Email Address *</label>
                      <input
                        type="email"
                        className="form-input"
                        required
                        placeholder="name@dpskilltech.in"
                        value={newCoachEmail}
                        onChange={(e) => setNewCoachEmail(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone Number</label>
                      <input
                        type="tel"
                        className="form-input"
                        placeholder="+91 98765 00000"
                        value={newCoachPhone}
                        onChange={(e) => setNewCoachPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Technical Specialization *</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      placeholder="e.g. Distributed Systems, Kafka & Spring Cloud"
                      value={newCoachSpecialization}
                      onChange={(e) => setNewCoachSpecialization(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Coach Login Password *</label>
                    <div className="input-with-action-row">
                      <input
                        type={showCoachPassword ? 'text' : 'password'}
                        className="form-input"
                        required
                        placeholder="Minimum 6 characters"
                        value={newCoachPassword}
                        onChange={(e) => setNewCoachPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="btn-toggle-eye"
                        onClick={() => setShowCoachPassword(!showCoachPassword)}
                        title={showCoachPassword ? 'Hide password' : 'Show password'}
                      >
                        {showCoachPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <button
                        type="button"
                        className="btn-generate-pass"
                        onClick={() => setNewCoachPassword(generateStrongPassword())}
                        title="Generate strong password"
                      >
                        <RefreshCw size={13} />
                        <span>Generate</span>
                      </button>
                    </div>
                  </div>

                  <div className="rule-warning-box">
                    <Key size={16} className="icon-green" />
                    <span>Coach will receive full TEACHER role permissions to host live sessions and evaluate code.</span>
                  </div>
                </div>

                <div className="dialog-footer">
                  <button
                    type="button"
                    className="btn-admin-secondary"
                    onClick={() => setShowAddCoachModal(false)}
                    disabled={isCreatingCoach}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-admin-primary" disabled={isCreatingCoach}>
                    {isCreatingCoach ? 'Registering Coach...' : 'Register Coach'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ==================================================================
            ASSIGN NEXT CLASS MODAL
            ================================================================== */}
        {showAssignNextClassModal && assignClassBatch && (
          <div className="admin-modal-backdrop" onClick={() => setShowAssignNextClassModal(false)}>
            <div className="admin-modal-dialog" onClick={(e) => e.stopPropagation()}>
              <div className="dialog-header">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Video size={18} style={{ color: 'var(--brand-orange)' }} />
                    <h3 style={{ margin: 0 }}>Assign Next Class: {assignClassBatch.code}</h3>
                  </div>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: 'var(--gray-500)' }}>
                    Schedule next lesson topic, assigned faculty, and live session link for {assignClassBatch.courseTitle}.
                  </p>
                </div>
                <button type="button" onClick={() => setShowAssignNextClassModal(false)}>
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAssignNextClass}>
                <div className="dialog-body">
                  <div className="form-group">
                    <label className="form-label">Next Class Topic / Subject *</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      placeholder="e.g. Distributed Database Sharding & CockroachDB"
                      value={nextClassTopic}
                      onChange={(e) => setNextClassTopic(e.target.value)}
                    />
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label">Scheduled Date / Day *</label>
                      <input
                        type="text"
                        className="form-input"
                        required
                        placeholder="e.g. Tomorrow or Wednesday, 18 Mar"
                        value={nextClassDate}
                        onChange={(e) => setNextClassDate(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Daily Time Slot (IST) *</label>
                      <input
                        type="text"
                        className="form-input"
                        required
                        placeholder="e.g. 07:00 PM – 08:30 PM IST"
                        value={nextClassTime}
                        onChange={(e) => setNextClassTime(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Assigned Faculty / Coach *</label>
                    <select
                      className="form-input"
                      value={nextClassCoach}
                      onChange={(e) => setNextClassCoach(e.target.value)}
                    >
                      {coachesList.map((c) => (
                        <option key={c.id} value={c.name}>{c.name} ({c.specialization})</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Live Session Join URL (Zoom / Meet) *</label>
                    <input
                      type="url"
                      className="form-input"
                      required
                      placeholder="https://zoom.us/j/9876543299"
                      value={nextClassZoomUrl}
                      onChange={(e) => setNextClassZoomUrl(e.target.value)}
                    />
                  </div>
                </div>

                <div className="dialog-footer">
                  <button
                    type="button"
                    className="btn-admin-secondary"
                    onClick={() => setShowAssignNextClassModal(false)}
                    disabled={isAssigningClass}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-admin-primary" disabled={isAssigningClass}>
                    {isAssigningClass ? 'Saving & Notifying...' : 'Confirm & Notify Cohort'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ==================================================================
            CREATED CREDENTIALS CONFIRMATION MODAL
            ================================================================== */}
        {createdCredentialsModal && (
          <div className="admin-modal-backdrop" onClick={() => setCreatedCredentialsModal(null)}>
            <div className="admin-modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
              <div className="dialog-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'rgba(16, 185, 129, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#10b981'
                  }}>
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0 }}>Account Provisioned Successfully</h3>
                    <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: 'var(--gray-500)' }}>
                      New {createdCredentialsModal.role === 'STUDENT' ? 'Student' : 'Faculty / Coach'} credentials created.
                    </p>
                  </div>
                </div>
                <button type="button" onClick={() => setCreatedCredentialsModal(null)}>
                  <X size={18} />
                </button>
              </div>

              <div className="dialog-body">
                <div className="credentials-display-card">
                  <div className="credentials-row">
                    <strong>Role:</strong>
                    <span className="credentials-val">
                      {createdCredentialsModal.role === 'STUDENT' ? 'Student Account' : 'Faculty / Coach'}
                    </span>
                  </div>
                  <div className="credentials-row">
                    <strong>Full Name:</strong>
                    <span className="credentials-val">{createdCredentialsModal.fullName}</span>
                  </div>
                  <div className="credentials-row">
                    <strong>Login Email:</strong>
                    <span className="credentials-val" style={{ color: '#2563eb' }}>{createdCredentialsModal.email}</span>
                  </div>
                  <div className="credentials-row">
                    <strong>Login Password:</strong>
                    <span className="credentials-val" style={{ color: '#16a34a' }}>{createdCredentialsModal.password}</span>
                  </div>
                  {createdCredentialsModal.idCode && (
                    <div className="credentials-row">
                      <strong>Student ID:</strong>
                      <span className="credentials-val">{createdCredentialsModal.idCode}</span>
                    </div>
                  )}
                  {createdCredentialsModal.courseOrSpecialization && (
                    <div className="credentials-row">
                      <strong>{createdCredentialsModal.role === 'STUDENT' ? 'Course:' : 'Specialization:'}</strong>
                      <span className="credentials-val">{createdCredentialsModal.courseOrSpecialization}</span>
                    </div>
                  )}
                  {createdCredentialsModal.batch && (
                    <div className="credentials-row">
                      <strong>Cohort Batch:</strong>
                      <span className="credentials-val">{createdCredentialsModal.batch}</span>
                    </div>
                  )}
                </div>

                <div className="credentials-copy-banner">
                  <span>Ready for login at <code>/#login</code></span>
                  <button
                    type="button"
                    className="btn-copy-creds"
                    onClick={() => {
                      const text = `DP Skilltech Portal Credentials:\nRole: ${createdCredentialsModal.role}\nName: ${createdCredentialsModal.fullName}\nEmail: ${createdCredentialsModal.email}\nPassword: ${createdCredentialsModal.password}\nLogin URL: http://localhost:5173/#login`;
                      navigator.clipboard.writeText(text);
                      setCopiedNotification(true);
                      setTimeout(() => setCopiedNotification(false), 3000);
                    }}
                  >
                    {copiedNotification ? (
                      <>
                        <Check size={14} />
                        <span>Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        <span>Copy All Credentials</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="rule-warning-box" style={{ marginTop: '0.85rem' }}>
                  <ShieldCheck size={16} className="icon-green" />
                  <span>The user can immediately log in on the platform using these credentials.</span>
                </div>
              </div>

              <div className="dialog-footer">
                <button
                  type="button"
                  className="btn-admin-primary"
                  style={{ width: '100%' }}
                  onClick={() => setCreatedCredentialsModal(null)}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================
            RESET PASSWORD MODAL (STUDENT / COACH)
            ================================================================== */}
        {showResetPasswordModal && resetTarget && (
          <div className="admin-modal-backdrop" onClick={() => setShowResetPasswordModal(false)}>
            <div className="admin-modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
              <div className="dialog-header">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Key size={18} style={{ color: 'var(--brand-orange)' }} />
                    <h3 style={{ margin: 0 }}>Reset Login Password</h3>
                  </div>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: 'var(--gray-500)' }}>
                    Provision a new secure password for {resetTarget.role === 'STUDENT' ? 'Student' : 'Faculty Member'}.
                  </p>
                </div>
                <button type="button" onClick={() => setShowResetPasswordModal(false)}>
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleResetPassword}>
                <div className="dialog-body">
                  <div className="admin-target-summary-box">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong>{resetTarget.name}</strong>
                      <span className="code-badge">{resetTarget.role}</span>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#2563eb', marginTop: '0.2rem' }}>{resetTarget.email}</div>
                    {resetTarget.courseOrBatch && (
                      <div style={{ fontSize: '0.78rem', color: 'var(--gray-500)', marginTop: '0.15rem' }}>{resetTarget.courseOrBatch}</div>
                    )}
                  </div>

                  <div className="form-group" style={{ marginTop: '1rem' }}>
                    <label className="form-label">New Password *</label>
                    <div className="input-with-action-row">
                      <input
                        type={showResetPassword ? 'text' : 'password'}
                        className="form-input"
                        required
                        placeholder="Minimum 6 characters"
                        value={resetNewPassword}
                        onChange={(e) => setResetNewPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="btn-toggle-eye"
                        onClick={() => setShowResetPassword(!showResetPassword)}
                        title={showResetPassword ? 'Hide password' : 'Show password'}
                      >
                        {showResetPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <button
                        type="button"
                        className="btn-generate-pass"
                        onClick={() => setResetNewPassword(generateStrongPassword())}
                        title="Generate strong password"
                      >
                        <RefreshCw size={13} />
                        <span>Generate</span>
                      </button>
                    </div>
                  </div>

                  <div className="form-group" style={{ marginTop: '0.85rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.82rem', color: 'var(--gray-700)' }}>
                      <input
                        type="checkbox"
                        checked={resetSendEmail}
                        onChange={(e) => setResetSendEmail(e.target.checked)}
                      />
                      <span>Send updated password confirmation to <strong>{resetTarget.email}</strong></span>
                    </label>
                  </div>

                  <div className="rule-warning-box" style={{ marginTop: '0.75rem' }}>
                    <ShieldCheck size={16} className="icon-green" />
                    <span>Password update is recorded in the academic security audit trail.</span>
                  </div>
                </div>

                <div className="dialog-footer">
                  <button
                    type="button"
                    className="btn-admin-secondary"
                    onClick={() => setShowResetPasswordModal(false)}
                    disabled={isResettingPassword}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-admin-primary" disabled={isResettingPassword}>
                    {isResettingPassword ? 'Updating Password...' : 'Save & Provision Password'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ==================================================================
            STUDENT BATCH TRANSFER MODAL
            ================================================================== */}
        {showTransferModal && transferStudent && (
          <div className="admin-modal-backdrop" onClick={() => setShowTransferModal(false)}>
            <div className="admin-modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
              <div className="dialog-header">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ArrowRightLeft size={18} style={{ color: 'var(--brand-orange)' }} />
                    <h3 style={{ margin: 0 }}>Transfer Cohort Batch</h3>
                  </div>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: 'var(--gray-500)' }}>
                    Reassign student to another cohort batch. Max 15-student cap is strictly validated.
                  </p>
                </div>
                <button type="button" onClick={() => setShowTransferModal(false)}>
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleTransferBatch}>
                <div className="dialog-body">
                  <div className="admin-target-summary-box">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong>{transferStudent.name}</strong>
                      <span className="code-badge">{transferStudent.id}</span>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--gray-600)', marginTop: '0.25rem' }}>
                      Current Cohort: <strong style={{ color: '#ea580c' }}>{transferStudent.batch}</strong> ({transferStudent.course})
                    </div>
                  </div>

                  <div className="form-group" style={{ marginTop: '1rem' }}>
                    <label className="form-label">Target Cohort Batch *</label>
                    <select
                      className="form-input"
                      value={transferTargetBatch}
                      onChange={(e) => setTransferTargetBatch(e.target.value)}
                    >
                      {batchesList.map(b => (
                        <option
                          key={b.id}
                          value={b.code}
                          disabled={b.code === transferStudent.batch || b.enrolledCount >= 15}
                        >
                          {b.code} ({b.courseTitle}) — {b.enrolledCount}/15 enrolled {b.enrolledCount >= 15 ? '[FULL]' : ''} {b.code === transferStudent.batch ? '[CURRENT]' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Reason for Transfer</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Schedule conflict, academic pacing, or student request"
                      value={transferReason}
                      onChange={(e) => setTransferReason(e.target.value)}
                    />
                  </div>

                  <div className="rule-warning-box">
                    <ShieldCheck size={16} className="icon-green" />
                    <span>Rule 19: Batch size strictly capped at 15 students. Over-enrollment is blocked.</span>
                  </div>
                </div>

                <div className="dialog-footer">
                  <button
                    type="button"
                    className="btn-admin-secondary"
                    onClick={() => setShowTransferModal(false)}
                    disabled={isTransferring}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-admin-primary" disabled={isTransferring}>
                    {isTransferring ? 'Transferring...' : 'Confirm Cohort Transfer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ==================================================================
            CALENDAR CLASS SESSION INSPECTOR MODAL
            ================================================================== */}
        {selectedCalendarClass && (
          <div className="admin-modal-backdrop" onClick={() => setSelectedCalendarClass(null)}>
            <div className="admin-modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
              <div className="dialog-header">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Video size={18} style={{ color: 'var(--brand-orange)' }} />
                    <h3 style={{ margin: 0 }}>Class Session Details</h3>
                  </div>
                  <span className="code-badge" style={{ marginTop: '0.2rem', display: 'inline-block' }}>{selectedCalendarClass.batchCode}</span>
                </div>
                <button type="button" onClick={() => setSelectedCalendarClass(null)}>
                  <X size={18} />
                </button>
              </div>

              <div className="dialog-body">
                <div style={{ marginBottom: '1rem' }}>
                  <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '1.05rem', color: '#0f172a' }}>{selectedCalendarClass.lessonTitle}</h4>
                  <div style={{ fontSize: '0.82rem', color: 'var(--gray-500)' }}>{selectedCalendarClass.moduleName} • {selectedCalendarClass.courseTitle}</div>
                </div>

                <div className="admin-credentials-card" style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div className="credentials-row">
                    <strong>Scheduled Date:</strong>
                    <span className="credentials-val">{selectedCalendarClass.date}</span>
                  </div>
                  <div className="credentials-row">
                    <strong>Time Slot:</strong>
                    <span className="credentials-val">{selectedCalendarClass.time}</span>
                  </div>
                  <div className="credentials-row">
                    <strong>Lead Coach:</strong>
                    <span className="credentials-val">{selectedCalendarClass.coachName}</span>
                  </div>
                  <div className="credentials-row">
                    <strong>Status:</strong>
                    <span className={`status-pill pill-${selectedCalendarClass.status.toLowerCase()}`}>{selectedCalendarClass.status}</span>
                  </div>
                </div>

                <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <a
                    href={selectedCalendarClass.zoomJoinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-admin-primary"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', textDecoration: 'none' }}
                  >
                    <Video size={16} />
                    <span>Launch Live Zoom Classroom</span>
                  </a>
                </div>
              </div>

              <div className="dialog-footer">
                <button
                  type="button"
                  className="btn-admin-secondary"
                  style={{ width: '100%' }}
                  onClick={() => setSelectedCalendarClass(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================
            ANNOUNCEMENT BROADCAST MODAL
            ================================================================== */}
        {showAnnouncementModal && (
          <div className="admin-modal-backdrop" onClick={() => setShowAnnouncementModal(false)}>
            <div className="admin-modal-dialog" onClick={(e) => e.stopPropagation()}>
              <div className="dialog-header">
                <h3>Broadcast Academy Announcement</h3>
                <button type="button" onClick={() => setShowAnnouncementModal(false)}>
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handlePublishAnnouncement}>
                <div className="dialog-body">
                  <div className="form-group">
                    <label className="form-label">Announcement Title *</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      placeholder="e.g. Scheduled Live Workshop or Capstone Defense"
                      value={newAnnTitle}
                      onChange={(e) => setNewAnnTitle(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Content Body *</label>
                    <textarea
                      className="form-input"
                      rows={4}
                      required
                      placeholder="Detailed announcement instructions for students and coaches..."
                      value={newAnnContent}
                      onChange={(e) => setNewAnnContent(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Priority Level</label>
                    <select
                      className="form-input"
                      value={newAnnPriority}
                      onChange={(e: any) => setNewAnnPriority(e.target.value)}
                    >
                      <option value="Normal">Normal</option>
                      <option value="High">High</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div className="dialog-footer">
                  <button
                    type="button"
                    className="btn-admin-secondary"
                    onClick={() => setShowAnnouncementModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-admin-primary">
                    Send Broadcast
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ==================================================================
            ISSUE CERTIFICATE MODAL
            ================================================================== */}
        {showIssueCertModal && (
          <div className="admin-modal-backdrop" onClick={() => setShowIssueCertModal(false)}>
            <div className="admin-modal-dialog" onClick={(e) => e.stopPropagation()}>
              <div className="dialog-header">
                <h3>Issue Verified Academy Certificate</h3>
                <button type="button" onClick={() => setShowIssueCertModal(false)}>
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleIssueCertificate}>
                <div className="dialog-body">
                  <div className="form-group">
                    <label className="form-label">Student Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      placeholder="e.g. Aarav Sharma"
                      value={newCertStudentName}
                      onChange={(e) => setNewCertStudentName(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Curriculum</label>
                    <select
                      className="form-input"
                      value={newCertCourse}
                      onChange={(e) => setNewCertCourse(e.target.value)}
                    >
                      {coursesList.map((c) => (
                        <option key={c.id} value={c.title}>{c.title}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Grading Designation</label>
                    <input
                      type="text"
                      className="form-input"
                      value={newCertGrade}
                      onChange={(e) => setNewCertGrade(e.target.value)}
                    />
                  </div>

                  <div className="rule-warning-box">
                    <Award size={16} className="icon-yellow" />
                    <span>This generates an immutable certificate identifier that can be verified on the public website.</span>
                  </div>
                </div>

                <div className="dialog-footer">
                  <button
                    type="button"
                    className="btn-admin-secondary"
                    onClick={() => setShowIssueCertModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-admin-primary">
                    Issue Credential
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ==================================================================
            SCHEDULE CLASS MODAL
            ================================================================== */}
        {showScheduleClassModal && (
          <div className="admin-modal-backdrop" onClick={() => setShowScheduleClassModal(false)}>
            <div className="admin-modal-dialog" onClick={(e) => e.stopPropagation()}>
              <div className="dialog-header">
                <h3>Schedule Live Class Session</h3>
                <button type="button" onClick={() => setShowScheduleClassModal(false)}>
                  <X size={18} />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const newCls: AdminLiveClass = {
                    id: `cls-${Date.now()}`,
                    courseTitle: 'Full Stack Python + AI Architecture',
                    batchCode: 'PY-FS-01',
                    moduleName: 'Module 03 • AI Systems',
                    lessonTitle: 'Fine-Tuning Open-Source LLMs on GPUs',
                    coachName: 'Dr. Rajesh Verma',
                    date: 'Tomorrow',
                    time: '07:00 PM – 08:30 PM IST',
                    status: 'Scheduled',
                    zoomJoinUrl: 'https://zoom.us/j/9876543210',
                    recordingAvailable: false,
                    attendancePresent: 0,
                    attendanceTotal: 14
                  };
                  setClassesList([newCls, ...classesList]);
                  setShowScheduleClassModal(false);
                }}
              >
                <div className="dialog-body">
                  <div className="form-group">
                    <label className="form-label">Lesson Title</label>
                    <input
                      type="text"
                      className="form-input"
                      defaultValue="Fine-Tuning Open-Source LLMs on GPUs"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Batch</label>
                    <select className="form-input">
                      <option>PY-FS-01 (Python + AI)</option>
                      <option>JV-FS-01 (Java Microservices)</option>
                      <option>DS-AI-01 (Data Science)</option>
                    </select>
                  </div>
                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label">Date</label>
                      <input type="text" className="form-input" defaultValue="Tomorrow" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Time</label>
                      <input type="text" className="form-input" defaultValue="07:00 PM - 08:30 PM IST" />
                    </div>
                  </div>
                </div>

                <div className="dialog-footer">
                  <button
                    type="button"
                    className="btn-admin-secondary"
                    onClick={() => setShowScheduleClassModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-admin-primary">
                    Publish Session
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
};
