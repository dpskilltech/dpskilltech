import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PortalLayout } from '../../components/layout/PortalLayout';
import {
  COHORT_BATCHES,
  INITIAL_QUESTION_THREADS,
  MOCK_INTERVIEW_SESSIONS
} from '../../data/portalMockData';
import type {
  CohortBatch,
  QuestionThread,
  MockInterviewSlot
} from '../../data/portalMockData';
import { api } from '../../services/api';

// Reusable Components
import { SubmissionReviewModal, type StudentSubmission } from './components/SubmissionReviewModal';
import { MockSlotModal } from './components/MockSlotModal';
import { MockEvaluationModal } from './components/MockEvaluationModal';
import { CohortRosterDrawer, type CohortStudentMember } from './components/CohortRosterDrawer';

// Modular Tabs
import { TeacherOverviewTab } from './tabs/TeacherOverviewTab';
import { TeacherBatchesTab } from './tabs/TeacherBatchesTab';
import { TeacherSubmissionsTab } from './tabs/TeacherSubmissionsTab';
import { TeacherQuestionsTab } from './tabs/TeacherQuestionsTab';
import { TeacherMockInterviewsTab } from './tabs/TeacherMockInterviewsTab';
import { TeacherMaterialsTab } from './tabs/TeacherMaterialsTab';

import './TeacherDashboard.css';

interface TeacherDashboardProps {
  onNavigateToPublic: (page: string, params?: Record<string, string>) => void;
}

const INITIAL_SUBMISSIONS: StudentSubmission[] = [
  {
    id: 'sub-01',
    studentName: 'Aarav Sharma',
    studentId: 'STU-1048',
    taskTitle: 'Task 02: Dockerizing Celery Workers & Redis Queue',
    courseTitle: 'Full Stack Python + AI Architecture',
    batchCode: 'PY-FS-01',
    submittedAt: '4 hours ago',
    githubUrl: 'https://github.com/aaravsharma/fastapi-celery-worker-lab',
    codeSnippet: `# Docker compose configuration for asynchronous Celery worker\nversion: '3.8'\nservices:\n  redis:\n    image: redis:7-alpine\n    ports:\n      - "6379:6379"\n  worker:\n    build: .\n    command: celery -A core.celery_app worker --loglevel=info -c 4\n    depends_on:\n      - redis`,
    status: 'pending'
  },
  {
    id: 'sub-02',
    studentName: 'Rohan Gupta',
    studentId: 'STU-1082',
    taskTitle: 'Task 01: Multi-threaded Web Crawler with asyncio & aiohttp',
    courseTitle: 'Full Stack Python + AI Architecture',
    batchCode: 'PY-FS-01',
    submittedAt: 'Yesterday',
    githubUrl: 'https://github.com/rohangupta/async-web-crawler',
    codeSnippet: `import asyncio\nimport aiohttp\n\nasync def fetch(session, url):\n    async with session.get(url, timeout=5) as resp:\n        return await resp.text()\n\nasync def crawl(urls):\n    async with aiohttp.ClientSession() as session:\n        tasks = [fetch(session, u) for u in urls]\n        return await asyncio.gather(*tasks)`,
    status: 'pending'
  },
  {
    id: 'sub-03',
    studentName: 'Priya Iyer',
    studentId: 'STU-1065',
    taskTitle: 'Task 03: PyTorch Distributed Tensor Parallelism',
    courseTitle: 'Full Stack Python + AI Architecture',
    batchCode: 'PY-FS-01',
    submittedAt: '2 days ago',
    githubUrl: 'https://github.com/priyaiyer/tensor-parallel-pytorch',
    codeSnippet: `import torch\nimport torch.distributed as dist\n\ndef init_process(rank, size, fn, backend='gloo'):\n    dist.init_process_group(backend, rank=rank, world_size=size)\n    fn(rank, size)`,
    score: 95,
    status: 'graded',
    feedback: 'Exceptional comprehension of NCCL backend and CUDA stream synchronization.'
  }
];

const INITIAL_COHORT_STUDENTS: Record<string, CohortStudentMember[]> = {
  'PY-FS-01': [
    { id: 'stu-01', name: 'Aarav Sharma', email: 'aarav.sharma@dpskilltech.in', attendanceRate: 94.2, assignmentsSubmitted: 5, totalAssignments: 6, todayAttendance: 'present' },
    { id: 'stu-02', name: 'Priya Iyer', email: 'priya.iyer@dpskilltech.in', attendanceRate: 92.0, assignmentsSubmitted: 4, totalAssignments: 6, todayAttendance: 'present' },
    { id: 'stu-03', name: 'Rohan Gupta', email: 'rohan.gupta@dpskilltech.in', attendanceRate: 88.5, assignmentsSubmitted: 4, totalAssignments: 6, todayAttendance: 'late' },
    { id: 'stu-04', name: 'Ananya Deshmukh', email: 'ananya.d@dpskilltech.in', attendanceRate: 96.0, assignmentsSubmitted: 6, totalAssignments: 6, todayAttendance: 'present' },
    { id: 'stu-05', name: 'Karthik Raja', email: 'karthik.r@dpskilltech.in', attendanceRate: 90.0, assignmentsSubmitted: 5, totalAssignments: 6, todayAttendance: 'present' },
    { id: 'stu-06', name: 'Meera Nambiar', email: 'meera.n@dpskilltech.in', attendanceRate: 85.0, assignmentsSubmitted: 4, totalAssignments: 6, todayAttendance: 'present' },
    { id: 'stu-07', name: 'Vikram Joshi', email: 'vikram.j@dpskilltech.in', attendanceRate: 93.0, assignmentsSubmitted: 5, totalAssignments: 6, todayAttendance: 'present' },
    { id: 'stu-08', name: 'Neha Reddy', email: 'neha.reddy@dpskilltech.in', attendanceRate: 91.5, assignmentsSubmitted: 5, totalAssignments: 6, todayAttendance: 'present' },
    { id: 'stu-09', name: 'Aditya Sen', email: 'aditya.sen@dpskilltech.in', attendanceRate: 89.0, assignmentsSubmitted: 4, totalAssignments: 6, todayAttendance: 'present' },
    { id: 'stu-10', name: 'Sneha Patel', email: 'sneha.patel@dpskilltech.in', attendanceRate: 95.0, assignmentsSubmitted: 6, totalAssignments: 6, todayAttendance: 'present' },
    { id: 'stu-11', name: 'Devendra Kulkarni', email: 'devendra.k@dpskilltech.in', attendanceRate: 87.0, assignmentsSubmitted: 4, totalAssignments: 6, todayAttendance: 'absent' },
    { id: 'stu-12', name: 'Tanvi Nair', email: 'tanvi.nair@dpskilltech.in', attendanceRate: 92.5, assignmentsSubmitted: 5, totalAssignments: 6, todayAttendance: 'present' },
    { id: 'stu-13', name: 'Gaurav Mehta', email: 'gaurav.m@dpskilltech.in', attendanceRate: 94.0, assignmentsSubmitted: 5, totalAssignments: 6, todayAttendance: 'present' },
    { id: 'stu-14', name: 'Ishaan Verma', email: 'ishaan.v@dpskilltech.in', attendanceRate: 96.5, assignmentsSubmitted: 6, totalAssignments: 6, todayAttendance: 'present' }
  ],
  'JV-FS-01': [
    { id: 'stu-jv-01', name: 'Harsh Vardhan', email: 'harsh.v@dpskilltech.in', attendanceRate: 92.0, assignmentsSubmitted: 4, totalAssignments: 5, todayAttendance: 'present' },
    { id: 'stu-jv-02', name: 'Ananya Sen', email: 'ananya.sen@dpskilltech.in', attendanceRate: 95.0, assignmentsSubmitted: 5, totalAssignments: 5, todayAttendance: 'present' },
    { id: 'stu-jv-03', name: 'Rajesh Nair', email: 'rajesh.nair@dpskilltech.in', attendanceRate: 88.0, assignmentsSubmitted: 3, totalAssignments: 5, todayAttendance: 'present' }
  ]
};

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onNavigateToPublic }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [, setDashboardData] = useState<any>(null);

  // Entities state
  const [batchesList] = useState<CohortBatch[]>(COHORT_BATCHES);
  const [submissionsList, setSubmissionsList] = useState<StudentSubmission[]>(INITIAL_SUBMISSIONS);
  const [questionThreads, setQuestionThreads] = useState<QuestionThread[]>(INITIAL_QUESTION_THREADS);
  const [mockSessions, setMockSessions] = useState<MockInterviewSlot[]>(MOCK_INTERVIEW_SESSIONS);
  const [cohortStudents, setCohortStudents] = useState<Record<string, CohortStudentMember[]>>(INITIAL_COHORT_STUDENTS);

  // Question Inbox State
  const [selectedThreadId, setSelectedThreadId] = useState<string>('q-102');
  const [replyText, setReplyText] = useState<string>('');

  // Modals & Drawers State
  const [selectedSubmission, setSelectedSubmission] = useState<StudentSubmission | null>(null);
  const [showMockSlotModal, setShowMockSlotModal] = useState<boolean>(false);
  const [evaluatingMockSlot, setEvaluatingMockSlot] = useState<MockInterviewSlot | null>(null);
  const [selectedBatchRoster, setSelectedBatchRoster] = useState<CohortBatch | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.getTeacherDashboard();
        if (res.success && res.data) {
          setDashboardData(res.data);
        }
      } catch (err) {
        console.warn('Teacher dashboard fetch fallback:', err);
      }
    };
    fetchDashboard();
  }, []);

  const activeBatch = batchesList[0];

  // Q&A reply handler
  const handleSendCoachReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setQuestionThreads((prev) =>
      prev.map((thread) => {
        if (thread.id === selectedThreadId) {
          return {
            ...thread,
            status: 'answered',
            messages: [
              ...thread.messages,
              {
                id: `msg-${Date.now()}`,
                senderName: user?.fullName || 'Dr. Rajesh Verma',
                senderRole: 'COACH',
                content: replyText.trim(),
                timestamp: 'Just now'
              }
            ]
          };
        }
        return thread;
      })
    );
    setReplyText('');
  };

  // Grade submission handler
  const handleSubmitGrade = (
    submissionId: string,
    score: number,
    feedback: string,
    status: 'graded' | 'revision_requested'
  ) => {
    setSubmissionsList((prev) =>
      prev.map((sub) =>
        sub.id === submissionId ? { ...sub, score, feedback, status } : sub
      )
    );
  };

  // Add mock interview slot handler
  const handleAddMockSlot = (slotData: Omit<MockInterviewSlot, 'id'>) => {
    const newSlot: MockInterviewSlot = {
      ...slotData,
      id: `slot-${Date.now()}`
    };
    setMockSessions([newSlot, ...mockSessions]);
  };

  // Evaluate mock interview handler
  const handleEvaluateMockSlot = (
    slotId: string,
    _status: 'completed',
    score: number,
    remarks: string,
    outcome: 'pass' | 'fail' | 'needs_revision'
  ) => {
    setMockSessions((prev) =>
      prev.map((slot) =>
        slot.id === slotId
          ? {
              ...slot,
              status: 'completed',
              score,
              feedback: `${outcome.toUpperCase()}: ${remarks}`
            }
          : slot
      )
    );
  };

  // Update cohort student attendance
  const handleUpdateStudentAttendance = (studentId: string, status: 'present' | 'absent' | 'late') => {
    if (!selectedBatchRoster) return;
    const batchCode = selectedBatchRoster.code;

    setCohortStudents((prev) => {
      const currentList = prev[batchCode] || [];
      const updated = currentList.map((s) =>
        s.id === studentId ? { ...s, todayAttendance: status } : s
      );
      return { ...prev, [batchCode]: updated };
    });
  };

  const pendingSubmissionsCount = submissionsList.filter((s) => s.status === 'pending').length;
  const unansweredQuestionsCount = questionThreads.filter((q) => q.status === 'unanswered').length;

  return (
    <PortalLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onNavigateToPublic={onNavigateToPublic}
      title={
        activeTab === 'dashboard'
          ? `Instructor Studio — ${user?.fullName || 'Faculty Lead'}`
          : activeTab === 'batches'
          ? 'Assigned Batches (Strict 15-Cap Governance)'
          : activeTab === 'submissions'
          ? 'Student Code & Assignment Evaluations'
          : activeTab === 'questions'
          ? 'Student Question Inbox & Mentorship Threads'
          : activeTab === 'mock-interviews'
          ? '1-on-1 Mock Interview Schedules'
          : activeTab === 'materials'
          ? 'Study Materials, Slides & Repository Links'
          : 'Instructor Operations'
      }
      subtitle="Manage assigned cohorts (15 max batch cap), host live Zoom classrooms, review code submissions, and conduct 1-on-1 mock interviews."
    >
      <div className="teacher-portal-stack">
        {/* ==================================================================
            TAB 1: OVERVIEW & COMMAND CENTER
            ================================================================== */}
        {activeTab === 'dashboard' && (
          <TeacherOverviewTab
            activeBatch={activeBatch}
            batchesList={batchesList}
            mockSessions={mockSessions}
            pendingSubmissionsCount={pendingSubmissionsCount}
            unansweredQuestionsCount={unansweredQuestionsCount}
            onLaunchZoom={() => window.open(activeBatch.zoomJoinUrl, '_blank')}
            onOpenMockSlot={() => setShowMockSlotModal(true)}
            onGoToSubmissions={() => setActiveTab('submissions')}
            onGoToMaterials={() => setActiveTab('materials')}
            onGoToBatches={() => setActiveTab('batches')}
            onStartMockSession={(slot) => {
              window.open(`https://zoom.us/j/98765432101?pwd=mock&student=${encodeURIComponent(slot.bookedStudentName || 'candidate')}`, '_blank');
            }}
          />
        )}

        {/* ==================================================================
            TAB 2: BATCHES & 15-CAP ROSTER
            ================================================================== */}
        {activeTab === 'batches' && (
          <TeacherBatchesTab
            batchesList={batchesList}
            onOpenRoster={(batch) => setSelectedBatchRoster(batch)}
            onLaunchZoom={(batch) => window.open(batch.zoomJoinUrl, '_blank')}
          />
        )}

        {/* ==================================================================
            TAB 3: SUBMISSIONS & CODE GRADING
            ================================================================== */}
        {activeTab === 'submissions' && (
          <TeacherSubmissionsTab
            submissionsList={submissionsList}
            onReviewSubmission={(sub) => setSelectedSubmission(sub)}
          />
        )}

        {/* ==================================================================
            TAB 4: QUESTION INBOX & THREADS
            ================================================================== */}
        {activeTab === 'questions' && (
          <TeacherQuestionsTab
            questionThreads={questionThreads}
            selectedThreadId={selectedThreadId}
            onSelectThread={setSelectedThreadId}
            replyText={replyText}
            onChangeReplyText={setReplyText}
            onSendReply={handleSendCoachReply}
          />
        )}

        {/* ==================================================================
            TAB 5: 1-ON-1 PRIVATE MOCK INTERVIEWS
            ================================================================== */}
        {activeTab === 'mock-interviews' && (
          <TeacherMockInterviewsTab
            mockSessions={mockSessions}
            onOpenAddSlotModal={() => setShowMockSlotModal(true)}
            onStartSession={(slot) => {
              window.open(`https://zoom.us/j/98765432101?pwd=mock&student=${encodeURIComponent(slot.bookedStudentName || 'candidate')}`, '_blank');
            }}
            onEvaluateSession={(slot) => setEvaluatingMockSlot(slot)}
          />
        )}

        {/* ==================================================================
            TAB 6: STUDY MATERIALS & REPOSITORIES
            ================================================================== */}
        {activeTab === 'materials' && <TeacherMaterialsTab />}

        {/* ==================================================================
            MODALS & DRAWERS
            ================================================================== */}
        {/* Code Review & Grading Modal */}
        <SubmissionReviewModal
          submission={selectedSubmission}
          isOpen={!!selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
          onSubmitGrade={handleSubmitGrade}
        />

        {/* Open Mock Slot Modal */}
        <MockSlotModal
          isOpen={showMockSlotModal}
          onClose={() => setShowMockSlotModal(false)}
          onAddSlot={handleAddMockSlot}
          coachName={user?.fullName || 'Dr. Rajesh Verma'}
        />

        {/* Mock Evaluation Modal */}
        <MockEvaluationModal
          slot={evaluatingMockSlot}
          isOpen={!!evaluatingMockSlot}
          onClose={() => setEvaluatingMockSlot(null)}
          onSubmitEvaluation={handleEvaluateMockSlot}
        />

        {/* Cohort Roster & Attendance Drawer */}
        <CohortRosterDrawer
          batch={selectedBatchRoster}
          isOpen={!!selectedBatchRoster}
          onClose={() => setSelectedBatchRoster(null)}
          students={selectedBatchRoster ? cohortStudents[selectedBatchRoster.code] || [] : []}
          onUpdateAttendance={handleUpdateStudentAttendance}
        />
      </div>
    </PortalLayout>
  );
};
