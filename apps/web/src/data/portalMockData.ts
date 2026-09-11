// ==========================================================================
// DP SKILLTECH — AUTHENTICATED PLATFORM MOCK DATA STORE
// Realistic, non-fake commercial EdTech datasets for Student, Coach & Admin
// ==========================================================================

export interface PortalNotification {
  id: string;
  category: 'class' | 'question' | 'assignment' | 'quiz' | 'mock' | 'announcement' | 'certificate' | 'system';
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  meta?: string;
}

export interface CohortBatch {
  id: string;
  code: string;
  courseTitle: string;
  coachName: string;
  coachAvatar?: string;
  enrolledCount: number;
  capacity: number; // strictly capped at 15
  scheduleDays: string;
  timeSlot: string;
  status: 'active' | 'upcoming' | 'completed';
  zoomJoinUrl: string;
}

export interface QuestionThreadMessage {
  id: string;
  senderName: string;
  senderRole: 'STUDENT' | 'COACH';
  content: string;
  codeSnippet?: string;
  timestamp: string;
}

export interface QuestionThread {
  id: string;
  title: string;
  studentName: string;
  studentId: string;
  courseTitle: string;
  moduleName: string;
  status: 'unanswered' | 'answered' | 'resolved';
  priority: 'normal' | 'high';
  createdAt: string;
  messages: QuestionThreadMessage[];
}

export interface MockInterviewSlot {
  id: string;
  category: 'Python Technical' | 'Java Technical' | 'System Design' | 'Coding DSA' | 'HR & Culture';
  interviewerName: string;
  interviewerTitle: string;
  date: string;
  time: string;
  durationMinutes: number;
  status: 'available' | 'booked' | 'completed';
  bookedStudentName?: string;
  score?: number;
  rubricScores?: {
    technicalKnowledge: number;
    problemSolving: number;
    coding: number;
    communication: number;
    confidence: number;
    projectKnowledge: number;
  };
  feedbackSummary?: string;
}

// --------------------------------------------------------------------------
// 1. GLOBAL NOTIFICATIONS STORE
// --------------------------------------------------------------------------
export const PORTAL_NOTIFICATIONS: PortalNotification[] = [
  {
    id: 'notif-1',
    category: 'class',
    title: 'Live Zoom Class Today',
    description: 'FastAPI Concurrency & Microservices Architecture starts at 07:00 PM IST.',
    timestamp: '15 mins ago',
    isRead: false,
    meta: 'Batch PY-FS-01'
  },
  {
    id: 'notif-2',
    category: 'question',
    title: 'Coach Answered Your Question',
    description: 'Dr. Rajesh Verma replied to "Handling Database Locks in SQLAlchemy Session".',
    timestamp: '2 hours ago',
    isRead: false,
    meta: 'Question #104'
  },
  {
    id: 'notif-3',
    category: 'assignment',
    title: 'Assignment Feedback Published',
    description: 'Your submission for "Dockerizing Celery Task Workers" received 95/100.',
    timestamp: '5 hours ago',
    isRead: true,
    meta: 'Score: 95%'
  },
  {
    id: 'notif-4',
    category: 'mock',
    title: 'Mock Interview Confirmed',
    description: '1-on-1 Python Technical defense scheduled for Saturday, 11:00 AM IST.',
    timestamp: 'Yesterday',
    isRead: true,
    meta: '1-to-1 Session'
  },
  {
    id: 'notif-5',
    category: 'quiz',
    title: 'New Quiz Unlocked',
    description: 'Module 04 Knowledge Check: Advanced Asynchronous Coroutines is now available.',
    timestamp: '1 day ago',
    isRead: true,
    meta: 'Time Limit: 25 mins'
  },
  {
    id: 'notif-6',
    category: 'announcement',
    title: 'Capstones Submission Date',
    description: 'Production capstone repo defense slots open next Monday for PY-FS-01.',
    timestamp: '2 days ago',
    isRead: true,
    meta: 'Academy Admin'
  }
];

// --------------------------------------------------------------------------
// 2. ACTIVE COHORT BATCHES (STRICT 15-STUDENT CAP ENFORCED)
// --------------------------------------------------------------------------
export const COHORT_BATCHES: CohortBatch[] = [
  {
    id: 'batch-py-01',
    code: 'PY-FS-01',
    courseTitle: 'Full Stack Python + AI Architecture',
    coachName: 'Dr. Rajesh Verma',
    enrolledCount: 14,
    capacity: 15,
    scheduleDays: 'Monday – Saturday',
    timeSlot: '07:00 PM – 08:30 PM IST',
    status: 'active',
    zoomJoinUrl: 'https://zoom.us/j/9876543210'
  },
  {
    id: 'batch-jv-01',
    code: 'JV-FS-01',
    courseTitle: 'Full Stack Java & Spring Microservices',
    coachName: 'Karthik Ramanathan',
    enrolledCount: 15,
    capacity: 15,
    scheduleDays: 'Monday – Saturday',
    timeSlot: '07:30 PM – 09:00 PM IST',
    status: 'active',
    zoomJoinUrl: 'https://zoom.us/j/9876543211'
  },
  {
    id: 'batch-ds-01',
    code: 'DS-AI-01',
    courseTitle: 'Data Science & Enterprise GenAI',
    coachName: 'Sneha Kapoor',
    enrolledCount: 12,
    capacity: 15,
    scheduleDays: 'Monday – Saturday',
    timeSlot: '08:30 PM – 10:00 PM IST',
    status: 'active',
    zoomJoinUrl: 'https://zoom.us/j/9876543212'
  }
];

// --------------------------------------------------------------------------
// 3. ASK COACH QUESTION THREADS
// --------------------------------------------------------------------------
export const INITIAL_QUESTION_THREADS: QuestionThread[] = [
  {
    id: 'q-101',
    title: 'PostgreSQL Connection Pooling exhaustion during async FastAPI load',
    studentName: 'Aarav Sharma',
    studentId: 'STU-1082',
    courseTitle: 'Full Stack Python + AI',
    moduleName: 'Module 03 • Database Concurrency',
    status: 'answered',
    priority: 'high',
    createdAt: '3 hours ago',
    messages: [
      {
        id: 'msg-1',
        senderName: 'Aarav Sharma',
        senderRole: 'STUDENT',
        content:
          'When running 50 concurrent simulated users through Locust, the asyncpg pool raises `TooManyConnectionsError`. I set pool_size=20 and max_overflow=10.',
        codeSnippet: `engine = create_async_engine(\n  DATABASE_URL,\n  pool_size=20,\n  max_overflow=10,\n  pool_timeout=30\n)`,
        timestamp: '3 hours ago'
      },
      {
        id: 'msg-2',
        senderName: 'Dr. Rajesh Verma',
        senderRole: 'COACH',
        content:
          'Check your dependency injection in FastAPI. If you are creating a new session without `async with` context managers, the connection stays open until garbage collection. Use `yield session` inside your `get_db()` dependency.',
        codeSnippet: `async def get_db() -> AsyncGenerator[AsyncSession, None]:\n  async with AsyncSessionLocal() as session:\n    try:\n      yield session\n      await session.commit()\n    except Exception:\n      await session.rollback()\n      raise`,
        timestamp: '2 hours ago'
      }
    ]
  },
  {
    id: 'q-102',
    title: 'PyTorch CUDA memory fragmentation on Tensor allocation',
    studentName: 'Priya Iyer',
    studentId: 'STU-1094',
    courseTitle: 'Data Science & Enterprise GenAI',
    moduleName: 'Module 04 • PyTorch Neural Tensors',
    status: 'unanswered',
    priority: 'normal',
    createdAt: '45 mins ago',
    messages: [
      {
        id: 'msg-3',
        senderName: 'Priya Iyer',
        senderRole: 'STUDENT',
        content:
          'I am training a LoRA adapter on LLaMA-3. After epoch 2, torch.cuda.OutOfMemoryError triggers even though batch size is only 2.',
        codeSnippet: `torch.cuda.empty_cache()\nmodel = get_peft_model(base_model, lora_config)`,
        timestamp: '45 mins ago'
      }
    ]
  }
];

// --------------------------------------------------------------------------
// 4. MOCK INTERVIEW SCHEDULES & SCORECARDS
// --------------------------------------------------------------------------
export const MOCK_INTERVIEW_SESSIONS: MockInterviewSlot[] = [
  {
    id: 'mock-1',
    category: 'Python Technical',
    interviewerName: 'Dr. Rajesh Verma',
    interviewerTitle: 'Lead Software Architect',
    date: 'Saturday, Sept 14',
    time: '11:00 AM – 11:45 AM IST',
    durationMinutes: 45,
    status: 'booked',
    bookedStudentName: 'Rohan Gupta'
  },
  {
    id: 'mock-2',
    category: 'Coding DSA',
    interviewerName: 'Karthik Ramanathan',
    interviewerTitle: 'Principal Backend Engineer',
    date: 'Sunday, Sept 15',
    time: '02:00 PM – 02:45 PM IST',
    durationMinutes: 45,
    status: 'available'
  },
  {
    id: 'mock-3',
    category: 'System Design',
    interviewerName: 'Dr. Rajesh Verma',
    interviewerTitle: 'Lead Software Architect',
    date: 'Monday, Sept 16',
    time: '06:00 PM – 06:45 PM IST',
    durationMinutes: 45,
    status: 'available'
  },
  {
    id: 'mock-4',
    category: 'Python Technical',
    interviewerName: 'Dr. Rajesh Verma',
    interviewerTitle: 'Lead Software Architect',
    date: 'Last Week',
    time: 'Completed Session',
    durationMinutes: 45,
    status: 'completed',
    bookedStudentName: 'Student User',
    score: 8.6,
    rubricScores: {
      technicalKnowledge: 9,
      problemSolving: 8,
      coding: 9,
      communication: 8,
      confidence: 9,
      projectKnowledge: 9
    },
    feedbackSummary:
      'Strong grasp of Python concurrency (asyncio event loops) and database schema normalization. Recommended to brush up on Redis cache eviction policies under heavy burst traffic.'
  }
];
