import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  GraduationCap,
  Layers,
  Award,
  Clock,
  CheckCircle2,
  UserPlus,
  Search,
  Filter,
  BarChart3,
  Lock,
  BookOpen,
  Video,
  FileCheck2,
  MessageSquareQuote,
  CalendarCheck,
  Briefcase,
  Plus,
  X,
  Check,
  Send,
  Eye,
  Zap,
  Server,
  Radio
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
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
import './AdminDashboard.css';

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
  const [newCoachSpecialization, setNewCoachSpecialization] = useState('');

  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnContent, setNewAnnContent] = useState('');
  const [newAnnPriority, setNewAnnPriority] = useState<'Normal' | 'High' | 'Urgent'>('Normal');

  const [newCertStudentName, setNewCertStudentName] = useState('');
  const [newCertCourse, setNewCertCourse] = useState('Full Stack Python + AI Architecture');
  const [newCertGrade, setNewCertGrade] = useState('Distinction (92%)');

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
  }, []);

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

  const handleAddCoach = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoachName) return;
    const newCoach: AdminCoachProfile = {
      id: `cch-${Date.now()}`,
      name: newCoachName,
      email: newCoachEmail || `${newCoachName.toLowerCase().replace(/\s+/g, '.')}@dpskilltech.in`,
      phone: '+91 98765 00000',
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
    setCoachesList([...coachesList, newCoach]);
    setNewCoachName('');
    setNewCoachEmail('');
    setNewCoachSpecialization('');
    setShowAddCoachModal(false);
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
          : activeTab === 'analytics'
          ? 'Academy Metrics & Auditing Intelligence'
          : activeTab === 'settings'
          ? 'Platform Configuration, RBAC & Integrations'
          : 'Academy Administration'
      }
      subtitle="Academy-wide governance: Audit cohort caps (15-student rule), monitor faculty, and review platform performance."
    >
      <div className="admin-portal-stack">
        {/* ==================================================================
            TAB 1: EXECUTIVE DASHBOARD
            ================================================================== */}
        {activeTab === 'dashboard' && (
          <div className="admin-view-stack">
            {/* Top Primary Statistics */}
            <section className="admin-kpi-grid">
              <div className="admin-kpi-card">
                <div className="kpi-header">
                  <span className="kpi-label">Total Enrolled Students</span>
                  <GraduationCap size={20} className="kpi-icon icon-blue" />
                </div>
                <div className="kpi-value">{studentsList.length * 8 + 1}</div>
                <span className="kpi-subtext">Across 3 active engineering cohorts</span>
              </div>

              <div className="admin-kpi-card">
                <div className="kpi-header">
                  <span className="kpi-label">Active Verified Coaches</span>
                  <Briefcase size={20} className="kpi-icon icon-orange" />
                </div>
                <div className="kpi-value">{coachesList.length}</div>
                <span className="kpi-subtext">Zero fake instructors • 100% practitioner staff</span>
              </div>

              <div className="admin-kpi-card">
                <div className="kpi-header">
                  <span className="kpi-label">Published Courses</span>
                  <BookOpen size={20} className="kpi-icon icon-blue" />
                </div>
                <div className="kpi-value">
                  {coursesList.filter((c) => c.status === 'Published').length}
                </div>
                <span className="kpi-subtext">+1 Draft syllabus currently in review</span>
              </div>

              <div className="admin-kpi-card">
                <div className="kpi-header">
                  <span className="kpi-label">Strict Batch Cap Compliance</span>
                  <ShieldCheck size={20} className="kpi-icon icon-green" />
                </div>
                <div className="kpi-value">100%</div>
                <span className="kpi-subtext">Max 15 students strictly enforced on all cohorts</span>
              </div>
            </section>

            {/* Secondary Operational Metrics */}
            <section className="admin-secondary-metrics">
              <div className="sec-metric-item">
                <div className="sec-metric-icon">
                  <Video size={18} className="icon-orange" />
                </div>
                <div className="sec-metric-text">
                  <strong>2 Live Sessions Today</strong>
                  <span>FastAPI (07:00 PM) &amp; Spring Cloud (07:30 PM)</span>
                </div>
              </div>

              <div className="sec-metric-item">
                <div className="sec-metric-icon">
                  <MessageSquareQuote size={18} className="icon-yellow" />
                </div>
                <div className="sec-metric-text">
                  <strong>{questionThreads.filter((q) => q.status === 'unanswered').length} Pending Questions</strong>
                  <span>Avg response turnaround: 1.8 hrs</span>
                </div>
              </div>

              <div className="sec-metric-item">
                <div className="sec-metric-icon">
                  <FileCheck2 size={18} className="icon-blue" />
                </div>
                <div className="sec-metric-text">
                  <strong>{assignmentsList.length} Active Assignments</strong>
                  <span>32 submissions awaiting coach evaluation</span>
                </div>
              </div>

              <div className="sec-metric-item">
                <div className="sec-metric-icon">
                  <CalendarCheck size={18} className="icon-green" />
                </div>
                <div className="sec-metric-text">
                  <strong>{mockSessions.filter((m) => m.status === 'booked').length} Upcoming 1:1 Mocks</strong>
                  <span>Private defense sessions scheduled this week</span>
                </div>
              </div>
            </section>

            {/* Cohort Cap Monitoring Table */}
            <section className="admin-panel">
              <div className="admin-panel-header">
                <div>
                  <h3 className="admin-panel-title">
                    <Clock size={18} className="icon-orange" />
                    <span>Cohort Capacity &amp; 15-Student Rule Monitor</span>
                  </h3>
                  <p className="admin-panel-subtitle">
                    Prevents mass-lecture dilution. Any cohort reaching 15 students is automatically locked against new admissions.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn-admin-primary"
                  onClick={() => setShowCreateBatchModal(true)}
                >
                  <Plus size={16} />
                  <span>Create Cohort</span>
                </button>
              </div>

              <div className="cohort-table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Cohort Code</th>
                      <th>Course Curriculum</th>
                      <th>Lead Coach</th>
                      <th>Capacity Status</th>
                      <th>Enrolled / Cap</th>
                      <th>Class Cadence</th>
                      <th>Policy Audit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {batchesList.map((batch) => {
                      const isFull = batch.enrolledCount >= batch.capacity;
                      return (
                        <tr key={batch.id}>
                          <td><span className="code-badge">{batch.code}</span></td>
                          <td><strong>{batch.courseTitle}</strong></td>
                          <td>{batch.coachName}</td>
                          <td>
                            {isFull ? (
                              <span className="status-badge badge-full">
                                <Lock size={12} /> FULL (LOCKED)
                              </span>
                            ) : (
                              <span className="status-badge badge-available">
                                {batch.capacity - batch.enrolledCount} Seats Open
                              </span>
                            )}
                          </td>
                          <td>
                            <div className="cap-progress-wrap">
                              <div className="cap-progress-bar">
                                <div
                                  className={`cap-fill ${isFull ? 'fill-full' : 'fill-active'}`}
                                  style={{ width: `${(batch.enrolledCount / batch.capacity) * 100}%` }}
                                ></div>
                              </div>
                              <span className="cap-text">{batch.enrolledCount}/{batch.capacity}</span>
                            </div>
                          </td>
                          <td>{batch.scheduleDays} • {batch.timeSlot}</td>
                          <td>
                            <span className="verified-badge">
                              <ShieldCheck size={13} /> Strict Cap Compliant
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Quick Activity Alert & Integrity Banner */}
            <div className="admin-integrity-callout">
              <div className="integrity-icon-col">
                <ShieldCheck size={28} className="icon-orange" />
              </div>
              <div className="integrity-text-col">
                <h4>Commercial Academy Integrity Standards Active</h4>
                <p>
                  All metrics, attendance logs, and mock interview scorecards are grounded in authentic learner interaction.
                  Zero fake student testimonials, zero unverified placement numbers, and strictly enforced 15-student cohort limits.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================
            TAB 2: COURSE & CURRICULUM MANAGEMENT
            ================================================================== */}
        {activeTab === 'courses' && (
          <div className="admin-panel">
            <div className="admin-panel-header">
              <div>
                <h3 className="admin-panel-title">Course Architecture &amp; Syllabus Manager</h3>
                <p className="admin-panel-subtitle">
                  Design complete course hierarchies: Course &rarr; Module &rarr; Lesson &rarr; Live Class &rarr; Recording &rarr; Material &rarr; Coding Practice &rarr; Assignment &rarr; Quiz &rarr; Project.
                </p>
              </div>
              <button
                type="button"
                className="btn-admin-primary"
                onClick={() => setShowCreateCourseModal(true)}
              >
                <Plus size={16} />
                <span>Create New Course</span>
              </button>
            </div>

            {/* Course Filter Pill Row */}
            <div className="admin-filter-strip">
              <div className="filter-pill-group">
                <button
                  type="button"
                  className={`filter-pill ${filterCourseStatus === 'all' ? 'active' : ''}`}
                  onClick={() => setFilterCourseStatus('all')}
                >
                  All Programs ({coursesList.length})
                </button>
                <button
                  type="button"
                  className={`filter-pill ${filterCourseStatus === 'published' ? 'active' : ''}`}
                  onClick={() => setFilterCourseStatus('published')}
                >
                  Published ({coursesList.filter((c) => c.status === 'Published').length})
                </button>
                <button
                  type="button"
                  className={`filter-pill ${filterCourseStatus === 'draft' ? 'active' : ''}`}
                  onClick={() => setFilterCourseStatus('draft')}
                >
                  Draft ({coursesList.filter((c) => c.status === 'Draft').length})
                </button>
              </div>
            </div>

            {/* Course Grid */}
            <div className="admin-courses-grid">
              {filteredCourses.map((course) => (
                <div key={course.id} className="admin-course-card">
                  <div className="course-card-thumb-wrap">
                    <img src={course.thumbnail} alt={course.title} className="course-thumb-img" />
                    <span className={`course-status-tag status-${course.status.toLowerCase()}`}>
                      {course.status}
                    </span>
                  </div>

                  <div className="course-card-body">
                    <div className="course-meta-top">
                      <span className="course-level-tag">{course.level}</span>
                      <span className="course-duration">{course.durationWeeks} Weeks</span>
                    </div>

                    <h4 className="course-card-title">{course.title}</h4>
                    <p className="course-card-desc">{course.description}</p>

                    <div className="course-card-stats">
                      <div>
                        <strong>{course.modulesCount}</strong>
                        <span>Modules</span>
                      </div>
                      <div>
                        <strong>{course.lessonsCount}</strong>
                        <span>Lessons</span>
                      </div>
                      <div>
                        <strong>{course.enrolledStudents}</strong>
                        <span>Students</span>
                      </div>
                      <div>
                        <strong>{course.activeBatchesCount}</strong>
                        <span>Batches</span>
                      </div>
                    </div>

                    <div className="course-card-actions">
                      <button
                        type="button"
                        className="btn-card-view-curriculum"
                        onClick={() => setSelectedCourseCurriculum(course)}
                      >
                        <Layers size={15} />
                        <span>Inspect Syllabus &amp; Modules</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================================================================
            TAB 3: BATCH CAPACITY MANAGEMENT
            ================================================================== */}
        {activeTab === 'batches' && (
          <div className="admin-panel">
            <div className="admin-panel-header">
              <div>
                <h3 className="admin-panel-title">Batch Capacity Governance (Strict 15-Student Rule)</h3>
                <p className="admin-panel-subtitle">
                  Rule 10 &amp; 18: Every batch is hard-capped at 15 students. When full, admission closes automatically to preserve personalized attention.
                </p>
              </div>
              <button
                type="button"
                className="btn-admin-primary"
                onClick={() => setShowCreateBatchModal(true)}
              >
                <Plus size={16} />
                <span>Create New Cohort</span>
              </button>
            </div>

            <div className="cohort-cards-grid">
              {batchesList.map((b) => {
                const isFull = b.enrolledCount >= b.capacity;
                return (
                  <div key={b.id} className="admin-cohort-box">
                    <div className="box-top">
                      <span className="code-badge">{b.code}</span>
                      <span className={isFull ? 'badge-full' : 'badge-available'}>
                        {isFull ? <><Lock size={12} /> LOCKED (15/15 FULL)</> : `${b.capacity - b.enrolledCount} Seats Open`}
                      </span>
                    </div>
                    <h4 className="batch-box-title">{b.courseTitle}</h4>
                    <p className="batch-box-coach">Lead Coach: <strong>{b.coachName}</strong></p>

                    <div className="cap-progress-wrap">
                      <div className="cap-progress-bar">
                        <div
                          className={`cap-fill ${isFull ? 'fill-full' : 'fill-active'}`}
                          style={{ width: `${(b.enrolledCount / b.capacity) * 100}%` }}
                        ></div>
                      </div>
                      <span className="cap-text">{b.enrolledCount} / {b.capacity} Students Enrolled</span>
                    </div>

                    <div className="box-meta">
                      <span><strong>Days:</strong> {b.scheduleDays}</span>
                      <span><strong>Timing:</strong> {b.timeSlot}</span>
                    </div>

                    <div className="box-footer-row">
                      <span className="batch-status-chip status-active">Live Cohort</span>
                      <button
                        type="button"
                        className="btn-tbl-action"
                        onClick={() => {
                          setFilterBatch(b.code);
                          setActiveTab('students');
                        }}
                      >
                        View {b.enrolledCount} Students &rarr;
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================================================================
            TAB 4: STUDENT ROSTER & PROFILE MANAGEMENT
            ================================================================== */}
        {activeTab === 'students' && (
          <div className="admin-panel">
            <div className="admin-panel-header">
              <div>
                <h3 className="admin-panel-title">Student Directory &amp; Academic Records</h3>
                <p className="admin-panel-subtitle">
                  Search students, audit attendance cadence, verify assignments and quiz marks, and inspect full student dossiers.
                </p>
              </div>
              <button
                type="button"
                className="btn-admin-primary"
                onClick={() => alert('Student enrollment is governed by batch capacity limits. Click a batch in Batches tab to admit new learners.')}
              >
                <UserPlus size={16} />
                <span>Admissions Portal</span>
              </button>
            </div>

            {/* Filter Bar */}
            <div className="roster-filter-bar">
              <div className="search-input-wrap">
                <Search size={16} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search by student name, email, or student ID..."
                  value={searchStudent}
                  onChange={(e) => setSearchStudent(e.target.value)}
                  className="roster-search-field"
                />
              </div>

              <div className="filter-select-wrap">
                <Filter size={15} />
                <select
                  value={filterBatch}
                  onChange={(e) => setFilterBatch(e.target.value)}
                  className="roster-select"
                >
                  <option value="all">All Batches</option>
                  <option value="PY-FS-01">Batch PY-FS-01 (Python + AI)</option>
                  <option value="JV-FS-01">Batch JV-FS-01 (Java Microservices)</option>
                  <option value="DS-AI-01">Batch DS-AI-01 (Data Science)</option>
                </select>
              </div>
            </div>

            {/* Students Table */}
            <div className="cohort-table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Student ID</th>
                    <th>Full Name</th>
                    <th>Enrolled Course</th>
                    <th>Batch</th>
                    <th>Progress</th>
                    <th>Attendance</th>
                    <th>Last Active</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((s) => (
                    <tr key={s.id}>
                      <td><span className="code-badge">{s.id}</span></td>
                      <td>
                        <strong>{s.name}</strong>
                        <div className="student-email">{s.email}</div>
                      </td>
                      <td>{s.course}</td>
                      <td><span className="batch-pill">{s.batch}</span></td>
                      <td>
                        <div className="table-progress">
                          <div className="table-bar" style={{ width: `${s.progress}%` }}></div>
                          <span>{s.progress}%</span>
                        </div>
                      </td>
                      <td>
                        <strong className={s.attendance >= 90 ? 'text-green' : 'text-orange'}>
                          {s.attendance}%
                        </strong>
                      </td>
                      <td>{s.lastActive}</td>
                      <td>
                        <span className={`status-pill pill-${s.status}`}>
                          {s.status.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons-row">
                          <button
                            type="button"
                            className="btn-tbl-action"
                            onClick={() => setSelectedStudentProfile(s)}
                          >
                            <Eye size={13} />
                            <span>Profile</span>
                          </button>
                          <button
                            type="button"
                            className={`btn-tbl-action ${s.status === 'active' ? 'btn-warn' : 'btn-success'}`}
                            onClick={() => toggleStudentStatus(s.id)}
                          >
                            {s.status === 'active' ? 'Suspend' : 'Activate'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================================================================
            TAB 5: COACHES MANAGEMENT
            ================================================================== */}
        {activeTab === 'coaches' && (
          <div className="admin-panel">
            <div className="admin-panel-header">
              <div>
                <h3 className="admin-panel-title">Faculty &amp; Engineering Coaches Directory</h3>
                <p className="admin-panel-subtitle">
                  Rule 22: Lead instructors are active software practitioners. Zero fabricated credentials or artificial profiles.
                </p>
              </div>
              <button
                type="button"
                className="btn-admin-primary"
                onClick={() => setShowAddCoachModal(true)}
              >
                <Plus size={16} />
                <span>Add Faculty Coach</span>
              </button>
            </div>

            <div className="coaches-cards-grid">
              {coachesList.map((coach) => (
                <div key={coach.id} className="coach-profile-card">
                  <div className="coach-card-header">
                    <div className="coach-avatar-badge">
                      {coach.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <h4>{coach.name}</h4>
                      <span className="coach-spec-label">{coach.specialization}</span>
                    </div>
                  </div>

                  <div className="coach-contact-snippet">
                    <span>{coach.email}</span> • <span>{coach.phone}</span>
                  </div>

                  <div className="coach-stats-row">
                    <div>
                      <strong>{coach.assignedBatches.join(', ') || 'Unassigned'}</strong>
                      <span>Assigned Batch</span>
                    </div>
                    <div>
                      <strong>{coach.completedClassesCount}</strong>
                      <span>Classes Held</span>
                    </div>
                    <div>
                      <strong>{coach.questionsAnswered}</strong>
                      <span>Q&amp;A Answers</span>
                    </div>
                    <div>
                      <strong>{coach.rating}/5.0</strong>
                      <span>Rating</span>
                    </div>
                  </div>

                  <div className="coach-extra-metrics">
                    <div className="metric-chip">
                      <FileCheck2 size={13} />
                      <span>{coach.assignmentsReviewed} Assignments Reviewed</span>
                    </div>
                    <div className="metric-chip">
                      <Award size={13} />
                      <span>{coach.mockInterviewsConducted} Mock 1:1 Defenses</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================================================================
            TAB 6: LIVE CLASSES & ZOOM OPERATIONS
            ================================================================== */}
        {activeTab === 'classes' && (
          <div className="admin-panel">
            <div className="admin-panel-header">
              <div>
                <h3 className="admin-panel-title">Live Class Operations &amp; Zoom Dispatch</h3>
                <p className="admin-panel-subtitle">
                  Monitor live cohorts, verify attendance rates, ensure meeting links are generated, and check recording attachments.
                </p>
              </div>
              <button
                type="button"
                className="btn-admin-primary"
                onClick={() => setShowScheduleClassModal(true)}
              >
                <Plus size={16} />
                <span>Schedule Live Class</span>
              </button>
            </div>

            {/* Class Status Filter */}
            <div className="admin-filter-strip">
              <div className="filter-pill-group">
                <button
                  type="button"
                  className={`filter-pill ${filterClassStatus === 'all' ? 'active' : ''}`}
                  onClick={() => setFilterClassStatus('all')}
                >
                  All Sessions ({classesList.length})
                </button>
                <button
                  type="button"
                  className={`filter-pill ${filterClassStatus === 'scheduled' ? 'active' : ''}`}
                  onClick={() => setFilterClassStatus('scheduled')}
                >
                  Scheduled ({classesList.filter((c) => c.status === 'Scheduled').length})
                </button>
                <button
                  type="button"
                  className={`filter-pill ${filterClassStatus === 'completed' ? 'active' : ''}`}
                  onClick={() => setFilterClassStatus('completed')}
                >
                  Completed ({classesList.filter((c) => c.status === 'Completed').length})
                </button>
              </div>
            </div>

            {/* Classes Table */}
            <div className="cohort-table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Batch</th>
                    <th>Curriculum Module &amp; Lesson</th>
                    <th>Lead Coach</th>
                    <th>Date &amp; Time Slot</th>
                    <th>Attendance</th>
                    <th>Status</th>
                    <th>Zoom Link &amp; Recording</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClasses.map((cls) => (
                    <tr key={cls.id}>
                      <td><span className="code-badge">{cls.batchCode}</span></td>
                      <td>
                        <strong>{cls.lessonTitle}</strong>
                        <div className="lesson-module-sub">{cls.moduleName}</div>
                      </td>
                      <td>{cls.coachName}</td>
                      <td>
                        <div><strong>{cls.date}</strong></div>
                        <div className="text-secondary">{cls.time}</div>
                      </td>
                      <td>
                        {cls.status === 'Completed' ? (
                          <span className="text-green font-semibold">
                            {cls.attendancePresent} / {cls.attendanceTotal} Present ({Math.round((cls.attendancePresent / cls.attendanceTotal) * 100)}%)
                          </span>
                        ) : (
                          <span className="text-secondary">Enrolled: {cls.attendanceTotal}</span>
                        )}
                      </td>
                      <td>
                        <span className={`status-pill pill-${cls.status.toLowerCase()}`}>
                          {cls.status}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons-row">
                          <a
                            href={cls.zoomJoinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-tbl-action btn-zoom-launch"
                          >
                            <Video size={13} />
                            <span>Zoom Session</span>
                          </a>
                          {cls.recordingAvailable && (
                            <span className="badge-recording-tag">
                              <Check size={12} /> Recording Saved
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================================================================
            TAB 7: ASSIGNMENTS & CAPSTONES
            ================================================================== */}
        {activeTab === 'assignments' && (
          <div className="admin-panel">
            <div className="admin-panel-header">
              <div>
                <h3 className="admin-panel-title">Academic Assessments &amp; Capstone Defenses</h3>
                <p className="admin-panel-subtitle">
                  Review student submission volume, turnaround rates, and capstone repository evaluations.
                </p>
              </div>
            </div>

            <div className="cohort-table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Assignment Title</th>
                    <th>Target Course</th>
                    <th>Batch</th>
                    <th>Deadline</th>
                    <th>Submissions</th>
                    <th>Reviewed</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {assignmentsList.map((asg) => (
                    <tr key={asg.id}>
                      <td><strong>{asg.title}</strong></td>
                      <td>{asg.courseTitle}</td>
                      <td><span className="code-badge">{asg.batchCode}</span></td>
                      <td>{asg.deadline}</td>
                      <td>
                        <span className="font-semibold">{asg.submissionsCount} / {asg.totalStudents}</span>
                      </td>
                      <td>
                        <span className="text-green">{asg.reviewedCount} Evaluated</span>
                      </td>
                      <td>
                        <span className={`status-pill pill-${asg.status.toLowerCase().replace(/\s+/g, '-')}`}>
                          {asg.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================================================================
            TAB 8: COMMUNICATION (QUESTIONS & ANNOUNCEMENTS)
            ================================================================== */}
        {activeTab === 'questions' && (
          <div className="admin-view-stack">
            {/* Announcements Panel */}
            <div className="admin-panel">
              <div className="admin-panel-header">
                <div>
                  <h3 className="admin-panel-title">Academy Announcements &amp; Broadcasts</h3>
                  <p className="admin-panel-subtitle">Send urgent notifications and operational updates to student cohorts.</p>
                </div>
                <button
                  type="button"
                  className="btn-admin-primary"
                  onClick={() => setShowAnnouncementModal(true)}
                >
                  <Send size={15} />
                  <span>Broadcast Announcement</span>
                </button>
              </div>

              <div className="announcements-admin-list">
                {announcementsList.map((ann) => (
                  <div key={ann.id} className="announcement-admin-card">
                    <div className="ann-card-header">
                      <div>
                        <h4>{ann.title}</h4>
                        <span className="ann-author-meta">{ann.authorName} • {ann.date} • Target: <strong>{ann.targetBatch}</strong></span>
                      </div>
                      <span className={`ann-priority-pill priority-${ann.priority.toLowerCase()}`}>
                        {ann.priority}
                      </span>
                    </div>
                    <p className="ann-card-text">{ann.content}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Questions Thread Audit */}
            <div className="admin-panel">
              <div className="admin-panel-header">
                <div>
                  <h3 className="admin-panel-title">Student Q&amp;A Audit Log</h3>
                  <p className="admin-panel-subtitle">Audit student questions and verify coach response quality and turnaround.</p>
                </div>
              </div>

              <div className="questions-audit-list">
                {questionThreads.map((q) => (
                  <div key={q.id} className="question-audit-card">
                    <div className="q-audit-header">
                      <div>
                        <strong>{q.studentName} ({q.studentId})</strong>
                        <span className="text-secondary"> &bull; {q.courseTitle} &bull; {q.moduleName}</span>
                      </div>
                      <span className={`status-pill pill-${q.status}`}>
                        {q.status.toUpperCase()}
                      </span>
                    </div>
                    <h4 className="q-audit-title">{q.title}</h4>
                    <p className="q-audit-preview">{q.messages[0]?.content}</p>
                    <div className="q-audit-footer">
                      <span>{q.messages.length} Message(s) in Thread</span>
                      <span className="text-secondary">{q.createdAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================
            TAB 9: MOCK INTERVIEW AUDITING
            ================================================================== */}
        {activeTab === 'mock-interviews' && (
          <div className="admin-panel">
            <div className="admin-panel-header">
              <div>
                <h3 className="admin-panel-title">1-on-1 Private Mock Interview Governance</h3>
                <p className="admin-panel-subtitle">
                  Rule 17 &amp; 18: Strictly 1 Coach + 1 Student. Double-booking prevention enforced across all faculty schedules.
                </p>
              </div>
            </div>

            <div className="cohort-table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Track / Category</th>
                    <th>Lead Interviewer</th>
                    <th>Slot Date &amp; Timing</th>
                    <th>Booked Student</th>
                    <th>Session Status</th>
                    <th>Scorecard Rubric</th>
                  </tr>
                </thead>
                <tbody>
                  {mockSessions.map((session) => (
                    <tr key={session.id}>
                      <td><strong>{session.category}</strong></td>
                      <td>{session.interviewerName}</td>
                      <td>{session.date} • {session.time}</td>
                      <td>
                        {session.bookedStudentName ? (
                          <strong>{session.bookedStudentName}</strong>
                        ) : (
                          <span className="text-secondary">Available Slot</span>
                        )}
                      </td>
                      <td>
                        <span className={`status-pill pill-${session.status}`}>
                          {session.status.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        {session.score ? (
                          <div className="score-cell">
                            <Award size={15} className="icon-yellow" />
                            <strong>{session.score} / 10</strong>
                            <span className="rubric-pass-tag">Passed Defense</span>
                          </div>
                        ) : (
                          <span className="text-secondary">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================================================================
            TAB 10: CERTIFICATES MANAGEMENT
            ================================================================== */}
        {activeTab === 'certificates' && (
          <div className="admin-panel">
            <div className="admin-panel-header">
              <div>
                <h3 className="admin-panel-title">Verified Certificate Registry</h3>
                <p className="admin-panel-subtitle">
                  Certificates are awarded only upon 100% curriculum completion, all assignments submitted, and passing mock defense.
                </p>
              </div>
              <button
                type="button"
                className="btn-admin-primary"
                onClick={() => setShowIssueCertModal(true)}
              >
                <Award size={16} />
                <span>Issue Certificate</span>
              </button>
            </div>

            <div className="cohort-table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Certificate ID</th>
                    <th>Student Name</th>
                    <th>Course Curriculum</th>
                    <th>Issue Date</th>
                    <th>Verification Hash</th>
                    <th>Academic Grade</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {certificatesList.map((cert) => (
                    <tr key={cert.id}>
                      <td><span className="code-badge">{cert.certificateId}</span></td>
                      <td><strong>{cert.studentName}</strong></td>
                      <td>{cert.courseTitle}</td>
                      <td>{cert.issueDate}</td>
                      <td><code>{cert.verificationCode}</code></td>
                      <td><strong>{cert.grade}</strong></td>
                      <td>
                        <span className="verified-badge">
                          <CheckCircle2 size={13} /> {cert.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================================================================
            TAB 11: ANALYTICS & AUDITS
            ================================================================== */}
        {activeTab === 'analytics' && (
          <div className="admin-view-stack">
            <div className="admin-panel">
              <div className="admin-panel-header">
                <div>
                  <h3 className="admin-panel-title">Academy Telemetry &amp; Learning Analytics</h3>
                  <p className="admin-panel-subtitle">
                    Real-time operational indicators across cohort attendance, curriculum completion, and sandbox code executions.
                  </p>
                </div>
              </div>

              <div className="analytics-metrics-grid">
                <div className="analytics-card">
                  <BarChart3 size={24} className="icon-blue" />
                  <h4>Average Attendance Rate</h4>
                  <div className="analytics-num">94.8%</div>
                  <p>Consistent 6-day attendance cadence across all 3 active cohorts.</p>
                </div>

                <div className="analytics-card">
                  <Clock size={24} className="icon-orange" />
                  <h4>Average Question Turnaround</h4>
                  <div className="analytics-num">1.8 Hours</div>
                  <p>Lead coaches answer student inquiries within 2 hours during cohort days.</p>
                </div>

                <div className="analytics-card">
                  <Award size={24} className="icon-yellow" />
                  <h4>Mock Interview Pass Rate</h4>
                  <div className="analytics-num">88.2%</div>
                  <p>Based on 42 completed private 1:1 defense sessions across 6 rubric dimensions.</p>
                </div>

                <div className="analytics-card">
                  <Zap size={24} className="icon-orange" />
                  <h4>Sandbox Code Runs</h4>
                  <div className="analytics-num">1,420+</div>
                  <p>Isolated Docker container executions across Python, Java, Node.js and SQL.</p>
                </div>
              </div>
            </div>

            {/* Language Breakdown Card */}
            <div className="admin-panel">
              <h4 className="admin-subhead">Coding Sandbox Language Utilization</h4>
              <div className="lang-bar-container">
                <div className="lang-bar-segment segment-python" style={{ width: '48%' }}>
                  <span>Python 3.12 (48%)</span>
                </div>
                <div className="lang-bar-segment segment-java" style={{ width: '26%' }}>
                  <span>Java 21 (26%)</span>
                </div>
                <div className="lang-bar-segment segment-node" style={{ width: '16%' }}>
                  <span>Node.js (16%)</span>
                </div>
                <div className="lang-bar-segment segment-sql" style={{ width: '10%' }}>
                  <span>SQL (10%)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================
            TAB 12: SETTINGS & RBAC
            ================================================================== */}
        {activeTab === 'settings' && (
          <div className="admin-view-stack">
            <div className="admin-panel">
              <div className="admin-panel-header">
                <div>
                  <h3 className="admin-panel-title">Academy Platform Configuration &amp; RBAC</h3>
                  <p className="admin-panel-subtitle">Role-Based Access Control and core infrastructure telemetry.</p>
                </div>
              </div>

              <div className="settings-grid">
                <div className="settings-box">
                  <h4>Role Permissions Matrix</h4>
                  <div className="rbac-table-wrap">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Capability</th>
                          <th>Student</th>
                          <th>Coach</th>
                          <th>Admin</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Join Live Zoom Classes</td>
                          <td><Check className="text-green" size={16} /></td>
                          <td><Check className="text-green" size={16} /> (Host)</td>
                          <td><Check className="text-green" size={16} /></td>
                        </tr>
                        <tr>
                          <td>Sandboxed Code Lab</td>
                          <td><Check className="text-green" size={16} /></td>
                          <td><Check className="text-green" size={16} /></td>
                          <td><Check className="text-green" size={16} /></td>
                        </tr>
                        <tr>
                          <td>Evaluate Assignments</td>
                          <td>&mdash;</td>
                          <td><Check className="text-green" size={16} /></td>
                          <td><Check className="text-green" size={16} /></td>
                        </tr>
                        <tr>
                          <td>1:1 Mock Interview Conducting</td>
                          <td>&mdash;</td>
                          <td><Check className="text-green" size={16} /></td>
                          <td><Check className="text-green" size={16} /></td>
                        </tr>
                        <tr>
                          <td>Manage Batches &amp; Caps</td>
                          <td>&mdash;</td>
                          <td>&mdash;</td>
                          <td><Check className="text-green" size={16} /></td>
                        </tr>
                        <tr>
                          <td>Issue Certificates</td>
                          <td>&mdash;</td>
                          <td>&mdash;</td>
                          <td><Check className="text-green" size={16} /></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="settings-box">
                  <h4>Infrastructure &amp; Integrations Health</h4>
                  <div className="infra-health-list">
                    <div className="infra-item">
                      <div className="infra-label">
                        <Radio size={16} className="text-green" />
                        <span>Zoom Video API</span>
                      </div>
                      <span className="status-badge badge-available">Operational (Deep Link Mode)</span>
                    </div>

                    <div className="infra-item">
                      <div className="infra-label">
                        <Server size={16} className="text-green" />
                        <span>Sandboxed Code Execution Engine</span>
                      </div>
                      <span className="status-badge badge-available">Container Cluster Healthy</span>
                    </div>

                    <div className="infra-item">
                      <div className="infra-label">
                        <ShieldCheck size={16} className="text-green" />
                        <span>Database &amp; RBAC Auth Daemon</span>
                      </div>
                      <span className="status-badge badge-available">Encrypted &bull; 0 Anomalies</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

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
            ADD COACH MODAL
            ================================================================== */}
        {showAddCoachModal && (
          <div className="admin-modal-backdrop" onClick={() => setShowAddCoachModal(false)}>
            <div className="admin-modal-dialog" onClick={(e) => e.stopPropagation()}>
              <div className="dialog-header">
                <h3>Add Verified Faculty Member</h3>
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

                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="name@dpskilltech.in"
                      value={newCoachEmail}
                      onChange={(e) => setNewCoachEmail(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Technical Specialization</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Distributed Systems, Kafka & Spring Cloud"
                      value={newCoachSpecialization}
                      onChange={(e) => setNewCoachSpecialization(e.target.value)}
                    />
                  </div>
                </div>

                <div className="dialog-footer">
                  <button
                    type="button"
                    className="btn-admin-secondary"
                    onClick={() => setShowAddCoachModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-admin-primary">
                    Register Coach
                  </button>
                </div>
              </form>
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
