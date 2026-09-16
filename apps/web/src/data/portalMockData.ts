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
  nextTopic?: string;
  nextSessionDate?: string;
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

// --------------------------------------------------------------------------
// 5. ADMIN CURRICULUM & COURSES DATA
// --------------------------------------------------------------------------
export interface AdminCourseModule {
  id: string;
  order: number;
  title: string;
  durationWeeks: number;
  lessons: {
    id: string;
    title: string;
    type: 'live' | 'recording' | 'lab' | 'assignment' | 'quiz' | 'project';
    durationMin: number;
  }[];
}

export interface AdminCourse {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  level: 'Beginner to Advanced' | 'Intermediate' | 'Advanced';
  durationWeeks: number;
  status: 'Published' | 'Draft' | 'Archived';
  enrolledStudents: number;
  activeBatchesCount: number;
  modulesCount: number;
  lessonsCount: number;
  modules: AdminCourseModule[];
}

export const ADMIN_COURSES: AdminCourse[] = [
  {
    id: 'course-py-ai',
    title: 'Full Stack Python + AI Architecture',
    slug: 'full-stack-python-ai',
    description: 'Master enterprise Python 3.12, FastAPI async microservices, PostgreSQL, Docker, and fine-tuning Open-Source LLMs.',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
    level: 'Beginner to Advanced',
    durationWeeks: 12,
    status: 'Published',
    enrolledStudents: 14,
    activeBatchesCount: 1,
    modulesCount: 6,
    lessonsCount: 48,
    modules: [
      {
        id: 'mod-1',
        order: 1,
        title: 'Python Core & Memory Model',
        durationWeeks: 2,
        lessons: [
          { id: 'les-1', title: 'CPython Internals & Bytecode Execution', type: 'live', durationMin: 90 },
          { id: 'les-2', title: 'Data Types, References & Mutability', type: 'recording', durationMin: 75 },
          { id: 'les-3', title: 'Decorators, Closures & Context Managers', type: 'lab', durationMin: 60 },
          { id: 'les-4', title: 'Core Python Quiz & Coding Check', type: 'quiz', durationMin: 30 }
        ]
      },
      {
        id: 'mod-2',
        order: 2,
        title: 'Asynchronous Concurrency & Asyncio',
        durationWeeks: 2,
        lessons: [
          { id: 'les-5', title: 'Event Loops, Tasks & Coroutine Scheduling', type: 'live', durationMin: 90 },
          { id: 'les-6', title: 'Async FastAPI Microservices Design', type: 'live', durationMin: 90 },
          { id: 'les-7', title: 'Asyncpg & PostgreSQL Pool Optimization', type: 'lab', durationMin: 90 },
          { id: 'les-8', title: 'Async Service Benchmarking Assignment', type: 'assignment', durationMin: 45 }
        ]
      },
      {
        id: 'mod-3',
        order: 3,
        title: 'Enterprise AI & LLM Systems',
        durationWeeks: 3,
        lessons: [
          { id: 'les-9', title: 'Vector Embeddings & pgvector Indexing', type: 'live', durationMin: 90 },
          { id: 'les-10', title: 'RAG Pipeline Architecture with LangChain', type: 'lab', durationMin: 90 },
          { id: 'les-11', title: 'Production Capstone Defense Project', type: 'project', durationMin: 180 }
        ]
      }
    ]
  },
  {
    id: 'course-java-micro',
    title: 'Full Stack Java & Spring Cloud Microservices',
    slug: 'full-stack-java-microservices',
    description: 'Enterprise Java 21, Spring Boot 3, Spring Cloud Gateway, Kafka event streaming, and Kubernetes deployment.',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
    level: 'Beginner to Advanced',
    durationWeeks: 14,
    status: 'Published',
    enrolledStudents: 15,
    activeBatchesCount: 1,
    modulesCount: 7,
    lessonsCount: 52,
    modules: [
      {
        id: 'mod-j1',
        order: 1,
        title: 'Modern Java 21 & Virtual Threads',
        durationWeeks: 2,
        lessons: [
          { id: 'les-j1', title: 'Project Loom Virtual Threads & Concurrency', type: 'live', durationMin: 90 },
          { id: 'les-j2', title: 'Pattern Matching, Records & Sealed Classes', type: 'lab', durationMin: 60 }
        ]
      },
      {
        id: 'mod-j2',
        order: 2,
        title: 'Spring Boot 3 & Distributed Tracing',
        durationWeeks: 3,
        lessons: [
          { id: 'les-j3', title: 'Reactive Microservices with WebFlux', type: 'live', durationMin: 90 },
          { id: 'les-j4', title: 'Distributed Transactions with Saga Pattern', type: 'assignment', durationMin: 120 }
        ]
      }
    ]
  },
  {
    id: 'course-ds-genai',
    title: 'Data Science & Enterprise GenAI',
    slug: 'data-science-genai',
    description: 'Deep Learning, PyTorch, LoRA fine-tuning, Agentic Workflows, and Multi-Modal Foundation Models.',
    thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=600&q=80',
    level: 'Intermediate',
    durationWeeks: 12,
    status: 'Published',
    enrolledStudents: 12,
    activeBatchesCount: 1,
    modulesCount: 6,
    lessonsCount: 44,
    modules: [
      {
        id: 'mod-d1',
        order: 1,
        title: 'PyTorch Deep Learning Foundations',
        durationWeeks: 2,
        lessons: [
          { id: 'les-d1', title: 'Tensors, Autograd & GPU Acceleration', type: 'live', durationMin: 90 },
          { id: 'les-d2', title: 'Training Custom CNNs & Transformers', type: 'lab', durationMin: 90 }
        ]
      }
    ]
  },
  {
    id: 'course-devops-cloud',
    title: 'Cloud Native DevOps & Kubernetes SRE',
    slug: 'cloud-devops-kubernetes',
    description: 'CI/CD Pipelines, Terraform Infrastructure as Code, Prometheus monitoring, and production Kubernetes clusters.',
    thumbnail: 'https://images.unsplash.com/photo-1618401471353-b98aedd04e11?auto=format&fit=crop&w=600&q=80',
    level: 'Advanced',
    durationWeeks: 10,
    status: 'Draft',
    enrolledStudents: 0,
    activeBatchesCount: 0,
    modulesCount: 5,
    lessonsCount: 36,
    modules: []
  }
];

// --------------------------------------------------------------------------
// 6. ADMIN CLASSES & LIVE SCHEDULE DATA
// --------------------------------------------------------------------------
export interface AdminLiveClass {
  id: string;
  courseTitle: string;
  batchCode: string;
  moduleName: string;
  lessonTitle: string;
  coachName: string;
  date: string;
  time: string;
  status: 'Live' | 'Scheduled' | 'Completed' | 'Cancelled';
  zoomJoinUrl: string;
  recordingAvailable: boolean;
  attendancePresent: number;
  attendanceTotal: number;
}

export const ADMIN_LIVE_CLASSES: AdminLiveClass[] = [
  {
    id: 'cls-101',
    courseTitle: 'Full Stack Python + AI Architecture',
    batchCode: 'PY-FS-01',
    moduleName: 'Module 02 • Concurrency',
    lessonTitle: 'FastAPI Concurrency & Microservices Architecture',
    coachName: 'Dr. Rajesh Verma',
    date: 'Today',
    time: '07:00 PM – 08:30 PM IST',
    status: 'Scheduled',
    zoomJoinUrl: 'https://zoom.us/j/9876543210',
    recordingAvailable: false,
    attendancePresent: 0,
    attendanceTotal: 14
  },
  {
    id: 'cls-102',
    courseTitle: 'Full Stack Java & Spring Microservices',
    batchCode: 'JV-FS-01',
    moduleName: 'Module 02 • Spring Boot',
    lessonTitle: 'Spring Cloud Gateway & JWT Interceptor Filters',
    coachName: 'Karthik Ramanathan',
    date: 'Today',
    time: '07:30 PM – 09:00 PM IST',
    status: 'Scheduled',
    zoomJoinUrl: 'https://zoom.us/j/9876543211',
    recordingAvailable: false,
    attendancePresent: 0,
    attendanceTotal: 15
  },
  {
    id: 'cls-103',
    courseTitle: 'Data Science & Enterprise GenAI',
    batchCode: 'DS-AI-01',
    moduleName: 'Module 01 • PyTorch Tensors',
    lessonTitle: 'GPU Memory Management & Mixed Precision Training',
    coachName: 'Sneha Kapoor',
    date: 'Yesterday',
    time: '08:30 PM – 10:00 PM IST',
    status: 'Completed',
    zoomJoinUrl: 'https://zoom.us/j/9876543212',
    recordingAvailable: true,
    attendancePresent: 11,
    attendanceTotal: 12
  },
  {
    id: 'cls-104',
    courseTitle: 'Full Stack Python + AI Architecture',
    batchCode: 'PY-FS-01',
    moduleName: 'Module 01 • Python Internals',
    lessonTitle: 'Memory Management, Garbage Collection & Cython',
    coachName: 'Dr. Rajesh Verma',
    date: 'Sept 10, 2026',
    time: '07:00 PM – 08:30 PM IST',
    status: 'Completed',
    zoomJoinUrl: 'https://zoom.us/j/9876543210',
    recordingAvailable: true,
    attendancePresent: 13,
    attendanceTotal: 14
  }
];

// --------------------------------------------------------------------------
// 7. ADMIN FACULTY / COACHES DATA
// --------------------------------------------------------------------------
export interface AdminCoachProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  assignedCourses: string[];
  assignedBatches: string[];
  upcomingClassesCount: number;
  completedClassesCount: number;
  questionsAnswered: number;
  assignmentsReviewed: number;
  mockInterviewsConducted: number;
  rating: number;
  status: 'active' | 'inactive';
}

export const ADMIN_COACHES: AdminCoachProfile[] = [
  {
    id: 'cch-01',
    name: 'Dr. Rajesh Verma',
    email: 'instructor@dpskilltech.in',
    phone: '+91 98765 11223',
    specialization: 'Python Core, Async Microservices & LLM Engineering',
    assignedCourses: ['Full Stack Python + AI Architecture'],
    assignedBatches: ['PY-FS-01'],
    upcomingClassesCount: 4,
    completedClassesCount: 38,
    questionsAnswered: 89,
    assignmentsReviewed: 62,
    mockInterviewsConducted: 24,
    rating: 4.9,
    status: 'active'
  },
  {
    id: 'cch-02',
    name: 'Karthik Ramanathan',
    email: 'karthik.r@dpskilltech.in',
    phone: '+91 98765 11224',
    specialization: 'Enterprise Java 21, Spring Cloud & Distributed Messaging',
    assignedCourses: ['Full Stack Java & Spring Microservices'],
    assignedBatches: ['JV-FS-01'],
    upcomingClassesCount: 5,
    completedClassesCount: 42,
    questionsAnswered: 74,
    assignmentsReviewed: 58,
    mockInterviewsConducted: 18,
    rating: 4.8,
    status: 'active'
  },
  {
    id: 'cch-03',
    name: 'Sneha Kapoor',
    email: 'sneha.k@dpskilltech.in',
    phone: '+91 98765 11225',
    specialization: 'PyTorch Deep Learning, LoRA Fine-Tuning & Computer Vision',
    assignedCourses: ['Data Science & Enterprise GenAI'],
    assignedBatches: ['DS-AI-01'],
    upcomingClassesCount: 3,
    completedClassesCount: 29,
    questionsAnswered: 61,
    assignmentsReviewed: 45,
    mockInterviewsConducted: 14,
    rating: 4.9,
    status: 'active'
  }
];

// --------------------------------------------------------------------------
// 8. ADMIN CERTIFICATES DATA
// --------------------------------------------------------------------------
export interface AdminCertificate {
  id: string;
  certificateId: string;
  studentName: string;
  studentId: string;
  courseTitle: string;
  issueDate: string;
  verificationCode: string;
  status: 'Issued' | 'Revoked';
  grade: string;
}

export const ADMIN_CERTIFICATES: AdminCertificate[] = [
  {
    id: 'cert-123',
    certificateId: 'DPSK-2026-000123',
    studentName: 'Arjun Sharma',
    studentId: 'STU-1088',
    courseTitle: 'Cybersecurity & Ethical Hacking',
    issueDate: 'August 28, 2026',
    verificationCode: 'a8f9c2d1e4b7891234567890abcdef1234567890abcdef1234567890abcdef12',
    status: 'Issued',
    grade: 'Distinction (94%)'
  },
  {
    id: 'cert-124',
    certificateId: 'DPSK-2026-000124',
    studentName: 'Priya Raman',
    studentId: 'STU-1089',
    courseTitle: 'Full Stack Web Development',
    issueDate: 'September 02, 2026',
    verificationCode: 'b3e4f5a6c7d8901234567890abcdef1234567890abcdef1234567890abcdef34',
    status: 'Issued',
    grade: 'Distinction (96%)'
  },
  {
    id: 'cert-125',
    certificateId: 'DPSK-2026-000125',
    studentName: 'Rahul Deshmukh',
    studentId: 'STU-1090',
    courseTitle: 'Full Stack Python + AI Architecture',
    issueDate: 'September 08, 2026',
    verificationCode: 'c5d6e7f8a9b0123456789012abcdef1234567890abcdef1234567890abcdef56',
    status: 'Issued',
    grade: 'First Class (89%)'
  },
  {
    id: 'cert-01',
    certificateId: 'DPS-PY-2026-8821',
    studentName: 'Vikram Malhotra',
    studentId: 'STU-1070',
    courseTitle: 'Full Stack Python + AI Architecture',
    issueDate: 'Sept 01, 2026',
    verificationCode: 'DPS-VER-98921-A',
    status: 'Issued',
    grade: 'Distinction (94%)'
  },
  {
    id: 'cert-02',
    certificateId: 'DPS-JV-2026-4412',
    studentName: 'Meera Nambiar',
    studentId: 'STU-1072',
    courseTitle: 'Full Stack Java & Spring Microservices',
    issueDate: 'Aug 24, 2026',
    verificationCode: 'DPS-VER-77123-B',
    status: 'Issued',
    grade: 'Excellence (91%)'
  }
];

// --------------------------------------------------------------------------
// 9. ADMIN ANNOUNCEMENTS DATA
// --------------------------------------------------------------------------
export interface AdminAnnouncement {
  id: string;
  title: string;
  content: string;
  targetBatch: string;
  authorName: string;
  date: string;
  priority: 'Normal' | 'High' | 'Urgent';
}

export const ADMIN_ANNOUNCEMENTS: AdminAnnouncement[] = [
  {
    id: 'ann-01',
    title: 'Capstone Repository Defense Schedules Open',
    content: 'All students in PY-FS-01 and JV-FS-01 must submit their final GitHub repository with CI/CD passing before reserving their 1-to-1 panel defense slots.',
    targetBatch: 'All Batches',
    authorName: 'Siddharth Patel (Academic Director)',
    date: 'Today, 10:00 AM',
    priority: 'High'
  },
  {
    id: 'ann-02',
    title: 'Scheduled Cloud Lab Maintenance Window',
    content: 'The sandboxed code execution cluster will undergo a rolling kernel patch on Sunday from 02:00 AM to 03:00 AM IST. No downtime expected for active sessions.',
    targetBatch: 'Academy Wide',
    authorName: 'Platform Infrastructure Ops',
    date: 'Yesterday',
    priority: 'Normal'
  }
];

// --------------------------------------------------------------------------
// 10. ADMIN ASSIGNMENTS DATA
// --------------------------------------------------------------------------
export interface AdminAssignment {
  id: string;
  title: string;
  courseTitle: string;
  batchCode: string;
  deadline: string;
  submissionsCount: number;
  totalStudents: number;
  reviewedCount: number;
  status: 'Active' | 'Under Review' | 'Closed';
}

export const ADMIN_ASSIGNMENTS: AdminAssignment[] = [
  {
    id: 'asg-01',
    title: 'Dockerizing Celery Task Workers with Redis Backend',
    courseTitle: 'Full Stack Python + AI Architecture',
    batchCode: 'PY-FS-01',
    deadline: 'Tomorrow, 11:59 PM IST',
    submissionsCount: 11,
    totalStudents: 14,
    reviewedCount: 8,
    status: 'Active'
  },
  {
    id: 'asg-02',
    title: 'Distributed Transaction Saga Pattern with Kafka',
    courseTitle: 'Full Stack Java & Spring Microservices',
    batchCode: 'JV-FS-01',
    deadline: 'Sept 15, 2026',
    submissionsCount: 15,
    totalStudents: 15,
    reviewedCount: 12,
    status: 'Under Review'
  },
  {
    id: 'asg-03',
    title: 'PyTorch LoRA Fine-Tuning Script with Quantization',
    courseTitle: 'Data Science & Enterprise GenAI',
    batchCode: 'DS-AI-01',
    deadline: 'Sept 18, 2026',
    submissionsCount: 6,
    totalStudents: 12,
    reviewedCount: 2,
    status: 'Active'
  }
];
