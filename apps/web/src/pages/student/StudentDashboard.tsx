import React, { useState, useEffect } from 'react';
import {
  Video,
  Play,
  Clock,
  Calendar,
  Code2,
  FileText,
  Award,
  ArrowRight,
  BookOpen,
  UserCheck,
  CheckCircle2,
  Terminal,
  Send,
  Download,
  ShieldCheck,
  FolderGit2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PortalLayout } from '../../components/layout/PortalLayout';
import {
  COHORT_BATCHES,
  INITIAL_QUESTION_THREADS,
  MOCK_INTERVIEW_SESSIONS,
  type QuestionThread
} from '../../data/portalMockData';
import { api } from '../../services/api';
import './StudentDashboard.css';

interface StudentDashboardProps {
  onNavigateToPublic: (page: string, params?: Record<string, string>) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onNavigateToPublic }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [dashboardData, setDashboardData] = useState<any>(null);

  // Coding Lab State
  const [labLanguage, setLabLanguage] = useState<'python' | 'javascript' | 'java' | 'sql'>('python');
  const [labCode, setLabCode] = useState<string>(
    `# DP Skilltech Sandboxed Code Execution Lab\nimport asyncio\n\nasync def simulate_batch_stream(batch_id: str):\n    print(f"[Kernel] Connecting to container for {batch_id}...")\n    await asyncio.sleep(0.05)\n    return {"status": "HEALTHY", "active_students": 14, "max_cap": 15}\n\nresult = asyncio.run(simulate_batch_stream("PY-FS-01"))\nprint(f"[Output] Batch Health: {result}")`
  );
  const [labOutput, setLabOutput] = useState<string | null>(null);
  const [isRunningCode, setIsRunningCode] = useState<boolean>(false);

  // Ask Coach State
  const [questionThreads, setQuestionThreads] = useState<QuestionThread[]>(INITIAL_QUESTION_THREADS);
  const [selectedThreadId, setSelectedThreadId] = useState<string>('q-101');
  const [newReplyText, setNewReplyText] = useState<string>('');
  const [isAskingNewQuestion, setIsAskingNewQuestion] = useState<boolean>(false);
  const [newQuestionTitle, setNewQuestionTitle] = useState<string>('');
  const [newQuestionBody, setNewQuestionBody] = useState<string>('');

  // Mock Interview Booking State
  const [mockSlots, setMockSlots] = useState(MOCK_INTERVIEW_SESSIONS);
  const [bookingSuccessMsg, setBookingSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.getStudentDashboard();
        if (res.success && res.data) {
          setDashboardData(res.data);
        }
      } catch (err) {
        console.warn('Dashboard fetch fallback to local profile:', err);
      }
    };
    fetchDashboard();
  }, []);

  const activeBatch = COHORT_BATCHES[0];
  const selectedThread = questionThreads.find((t) => t.id === selectedThreadId) || questionThreads[0];

  // Run Code in Sandboxed Simulator
  const handleRunCode = () => {
    setIsRunningCode(true);
    setLabOutput(null);
    setTimeout(() => {
      setIsRunningCode(false);
      if (labLanguage === 'python') {
        setLabOutput(
          `[Kernel] Sandboxed execution started (Container ID: dps-py-box-892)\n[Kernel] Connecting to container for PY-FS-01...\n[Output] Batch Health: {'status': 'HEALTHY', 'active_students': 14, 'max_cap': 15}\n\nExecution finished in 0.082s with exit code 0.`
        );
      } else if (labLanguage === 'javascript') {
        setLabOutput(
          `[V8 Engine] Output:\n{\n  "batch": "PY-FS-01",\n  "status": "active",\n  "verified": true\n}\n\nExecution finished in 0.045s.`
        );
      } else {
        setLabOutput(`[Container] Code compiled and executed successfully with 0 warnings.`);
      }
    }, 550);
  };

  // Submit Coach Reply
  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReplyText.trim()) return;

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
                senderName: user?.fullName || 'Aarav Sharma',
                senderRole: 'STUDENT',
                content: newReplyText.trim(),
                timestamp: 'Just now'
              }
            ]
          };
        }
        return thread;
      })
    );
    setNewReplyText('');
  };

  // Create New Question
  const handleCreateNewQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionTitle.trim() || !newQuestionBody.trim()) return;

    const created: QuestionThread = {
      id: `q-${Date.now()}`,
      title: newQuestionTitle.trim(),
      studentName: user?.fullName || 'Student User',
      studentId: 'STU-1082',
      courseTitle: 'Full Stack Python + AI',
      moduleName: 'Module 04 • Microservices',
      status: 'unanswered',
      priority: 'normal',
      createdAt: 'Just now',
      messages: [
        {
          id: `msg-${Date.now()}`,
          senderName: user?.fullName || 'Student User',
          senderRole: 'STUDENT',
          content: newQuestionBody.trim(),
          timestamp: 'Just now'
        }
      ]
    };

    setQuestionThreads([created, ...questionThreads]);
    setSelectedThreadId(created.id);
    setIsAskingNewQuestion(false);
    setNewQuestionTitle('');
    setNewQuestionBody('');
  };

  // Book 1-on-1 Mock Interview Slot
  const handleBookMockSlot = (slotId: string) => {
    setMockSlots((prev) =>
      prev.map((slot) => {
        if (slot.id === slotId) {
          return {
            ...slot,
            status: 'booked',
            bookedStudentName: user?.fullName || 'Student User'
          };
        }
        return slot;
      })
    );
    setBookingSuccessMsg(
      'Private 1-on-1 Mock Interview slot reserved! Anti-double booking lock confirmed.'
    );
    setTimeout(() => setBookingSuccessMsg(null), 5000);
  };

  return (
    <PortalLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onNavigateToPublic={onNavigateToPublic}
      title={
        activeTab === 'dashboard'
          ? `Welcome Back, ${user?.fullName?.split(' ')[0] || 'Student'}`
          : activeTab === 'classroom'
          ? 'Student Interactive Classroom'
          : activeTab === 'coding-lab'
          ? 'Cloud Coding Sandbox Lab'
          : activeTab === 'ask-coach'
          ? 'Ask Coach Direct Question Thread'
          : activeTab === 'mock-interviews'
          ? '1-on-1 Private Mock Interview Studio'
          : activeTab === 'assignments'
          ? 'Assignments & Evaluations'
          : activeTab === 'my-courses'
          ? 'My Enrolled Courses & Modules'
          : activeTab === 'recordings'
          ? 'Recorded Class Library'
          : activeTab === 'materials'
          ? 'Study Materials & Source Code'
          : activeTab === 'certificates'
          ? 'Verified Completion Certificates'
          : 'Academic Portal'
      }
      subtitle={
        activeTab === 'dashboard'
          ? 'Track your live cohorts, assignments, sandboxed coding practice, and mock interviews.'
          : activeTab === 'classroom'
          ? 'Daily structured lecture syllabus with integrated coding exercises and notes.'
          : activeTab === 'coding-lab'
          ? 'Isolated browser containers for Python, JavaScript, Java, and SQL.'
          : activeTab === 'mock-interviews'
          ? 'Private 1 interviewer + 1 student sessions with rubric scoring and strict double-booking protection.'
          : 'DP Skilltech Authenticated Learning Platform'
      }
    >
      <div className="student-portal-wrapper">
        {/* ==================================================================
            TAB 1: DASHBOARD OVERVIEW
            ================================================================== */}
        {activeTab === 'dashboard' && (
          <div className="dashboard-view-stack">
            {/* Live Class Hero Banner */}
            <section className="live-class-card">
              <div className="card-top-badge-row">
                <span className="badge-live-pulse">
                  <span className="pulse-dot-red"></span>
                  TODAY&apos;S LIVE ZOOM CLASS
                </span>
                <span className="batch-cap-tag">
                  Cohort: <strong>{activeBatch.code}</strong> • {activeBatch.enrolledCount}/{activeBatch.capacity} Students (Capped)
                </span>
              </div>

              <div className="live-card-body">
                <div className="live-left-content">
                  <h2 className="live-session-headline">
                    {dashboardData?.nextLiveClass?.title || 'Async I/O & FastAPI Concurrency Patterns'}
                  </h2>
                  <div className="live-meta-badges">
                    <span className="meta-pill">
                      <UserCheck size={15} />
                      <span>Lead Instructor: <strong>{activeBatch.coachName}</strong></span>
                    </span>
                    <span className="meta-pill">
                      <Clock size={15} />
                      <span>Schedule: <strong>{activeBatch.timeSlot}</strong></span>
                    </span>
                    <span className="meta-pill">
                      <Calendar size={15} />
                      <span>Cadence: <strong>{activeBatch.scheduleDays}</strong></span>
                    </span>
                  </div>
                </div>

                <div className="live-right-cta">
                  <a
                    href={activeBatch.zoomJoinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-join-zoom"
                  >
                    <Video size={19} />
                    <span>Join Zoom Classroom</span>
                  </a>
                  <span className="zoom-guarantee-note">
                    <ShieldCheck size={13} />
                    <span>Passcode pre-configured • 15 Students Max</span>
                  </span>
                </div>
              </div>
            </section>

            {/* Academic Progress Metrics */}
            <section className="metrics-four-grid">
              <div className="metric-box">
                <div className="metric-top">
                  <span className="metric-heading">Class Attendance</span>
                  <Award size={18} className="icon-green" />
                </div>
                <div className="metric-num">94%</div>
                <div className="bar-track">
                  <div className="bar-fill fill-green" style={{ width: '94%' }}></div>
                </div>
                <span className="metric-caption">Verified 6-day weekly attendance record</span>
              </div>

              <div className="metric-box">
                <div className="metric-top">
                  <span className="metric-heading">Curriculum Progress</span>
                  <BookOpen size={18} className="icon-blue" />
                </div>
                <div className="metric-num">
                  24 <span className="metric-sub-num">/ 48 Lessons</span>
                </div>
                <div className="bar-track">
                  <div className="bar-fill fill-blue" style={{ width: '50%' }}></div>
                </div>
                <span className="metric-caption">Full Stack Python + AI Track</span>
              </div>

              <div className="metric-box">
                <div className="metric-top">
                  <span className="metric-heading">Assignments Reviewed</span>
                  <FileText size={18} className="icon-orange" />
                </div>
                <div className="metric-num">
                  7 <span className="metric-sub-num">/ 8 Tasks</span>
                </div>
                <div className="bar-track">
                  <div className="bar-fill fill-orange" style={{ width: '87.5%' }}></div>
                </div>
                <span className="metric-caption">1 pending submission for review</span>
              </div>

              <div className="metric-box">
                <div className="metric-top">
                  <span className="metric-heading">Mock Interview Credits</span>
                  <Calendar size={18} className="icon-yellow" />
                </div>
                <div className="metric-num">2 Slots</div>
                <button
                  type="button"
                  className="btn-quick-slot"
                  onClick={() => setActiveTab('mock-interviews')}
                >
                  <span>Book 1-on-1 Session</span>
                  <ArrowRight size={14} />
                </button>
                <span className="metric-caption">Private 1:1 • Anti-double booking</span>
              </div>
            </section>

            {/* Split Row: Recordings Library & Coding Lab CTA */}
            <div className="dashboard-split-row">
              {/* Recordings Card */}
              <div className="white-card recordings-card">
                <div className="card-header-row">
                  <div className="header-left">
                    <Play size={18} className="card-header-icon icon-orange" />
                    <h3>Recent Class Recordings</h3>
                  </div>
                  <button
                    type="button"
                    className="btn-view-all-link"
                    onClick={() => setActiveTab('recordings')}
                  >
                    View All Library &rarr;
                  </button>
                </div>

                <div className="rec-items-list">
                  <div className="rec-row">
                    <div className="rec-icon-wrap">
                      <Play size={15} />
                    </div>
                    <div className="rec-meta-box">
                      <h4>Python Metaclasses &amp; Custom Decorators</h4>
                      <span>Yesterday • 1h 32m • {activeBatch.coachName}</span>
                    </div>
                    <button
                      type="button"
                      className="btn-rec-play"
                      onClick={() => setActiveTab('recordings')}
                    >
                      Watch HD
                    </button>
                  </div>

                  <div className="rec-row">
                    <div className="rec-icon-wrap">
                      <Play size={15} />
                    </div>
                    <div className="rec-meta-box">
                      <h4>PostgreSQL Advanced Indexing &amp; Query Plans</h4>
                      <span>2 days ago • 1h 28m • {activeBatch.coachName}</span>
                    </div>
                    <button
                      type="button"
                      className="btn-rec-play"
                      onClick={() => setActiveTab('recordings')}
                    >
                      Watch HD
                    </button>
                  </div>
                </div>
              </div>

              {/* In-Browser Coding Lab Preview */}
              <div className="white-card lab-card">
                <div className="card-header-row">
                  <div className="header-left">
                    <Code2 size={18} className="card-header-icon icon-blue" />
                    <h3>In-Browser Coding Lab</h3>
                  </div>
                  <span className="badge-container-ready">Container Active</span>
                </div>

                <p className="lab-intro-text">
                  Write, run, and evaluate production code inside isolated sandboxed containers without local configuration.
                </p>

                <div className="terminal-mini-preview">
                  <div className="terminal-top-dots">
                    <span className="t-dot red"></span>
                    <span className="t-dot yellow"></span>
                    <span className="t-dot green"></span>
                    <span className="t-filename">async_worker.py</span>
                  </div>
                  <pre className="t-code">
{`async def fetch_user_data(user_id: str):
    await asyncio.sleep(0.05)
    return {"cohort": "PY-FS-01", "status": "active"}`}
                  </pre>
                </div>

                <button
                  type="button"
                  className="btn-launch-lab"
                  onClick={() => setActiveTab('coding-lab')}
                >
                  <Code2 size={17} />
                  <span>Launch Cloud Coding Sandbox</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================
            TAB 2: STUDENT CLASSROOM
            ================================================================== */}
        {activeTab === 'classroom' && (
          <div className="classroom-layout-grid">
            {/* Left Module Sidebar */}
            <aside className="classroom-modules-nav">
              <div className="modules-header">
                <h3>Full Stack Python + AI</h3>
                <span className="syllabus-status">Module 03 of 08 Active</span>
              </div>
              <div className="modules-list">
                <div className="module-group">
                  <div className="module-title-bar completed">
                    <CheckCircle2 size={16} className="status-icon" />
                    <strong>Module 01: Core Python &amp; Data Structures</strong>
                  </div>
                </div>
                <div className="module-group">
                  <div className="module-title-bar completed">
                    <CheckCircle2 size={16} className="status-icon" />
                    <strong>Module 02: OOP &amp; Metaclasses</strong>
                  </div>
                </div>
                <div className="module-group active">
                  <div className="module-title-bar in-progress">
                    <Clock size={16} className="status-icon" />
                    <strong>Module 03: AsyncIO &amp; FastAPI Microservices</strong>
                  </div>
                  <div className="module-lessons-list">
                    <button type="button" className="lesson-item completed">
                      <CheckCircle2 size={14} />
                      <span>3.1 Event Loops &amp; Coroutines</span>
                    </button>
                    <button type="button" className="lesson-item active">
                      <Play size={14} />
                      <span>3.2 FastAPI Concurrency &amp; Sessions</span>
                    </button>
                    <button type="button" className="lesson-item pending">
                      <Clock size={14} />
                      <span>3.3 Redis Caching &amp; Celery Workers</span>
                    </button>
                    <button type="button" className="lesson-item pending">
                      <FileText size={14} />
                      <span>3.4 Module 03 Capstone Evaluation</span>
                    </button>
                  </div>
                </div>
              </div>
            </aside>

            {/* Right Main Lesson Viewer */}
            <main className="classroom-main-lesson">
              <div className="lesson-hero-frame">
                <div className="lesson-player-placeholder">
                  <div className="player-inner-content">
                    <Video size={48} className="player-icon" />
                    <h3>Lesson 3.2: FastAPI Concurrency &amp; Async Database Sessions</h3>
                    <p>Instructor: {activeBatch.coachName} • Cohort PY-FS-01</p>
                    <a
                      href={activeBatch.zoomJoinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-join-zoom"
                    >
                      <Video size={17} />
                      <span>Launch Live Zoom Session</span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="lesson-content-card">
                <div className="lesson-tabs-bar">
                  <button type="button" className="lesson-tab-btn active">
                    Lesson Notes &amp; Theory
                  </button>
                  <button
                    type="button"
                    className="lesson-tab-btn"
                    onClick={() => setActiveTab('coding-lab')}
                  >
                    Open in Coding Lab
                  </button>
                  <button
                    type="button"
                    className="lesson-tab-btn"
                    onClick={() => setActiveTab('ask-coach')}
                  >
                    Ask Coach a Question
                  </button>
                </div>

                <div className="lesson-text-body">
                  <h4>Session Overview</h4>
                  <p>
                    In this session, we dissect why synchronous ORM drivers block the Python asyncio event loop. We implement asynchronous connection pools using <code>asyncpg</code> and FastAPI dependency injection context managers.
                  </p>
                  <h4>Core Engineering Takeaways</h4>
                  <ul>
                    <li>Never execute blocking I/O calls directly inside <code>async def</code> route handlers.</li>
                    <li>Always use <code>yield session</code> with an async context manager to release database handles back to the pool.</li>
                    <li>Configure connection pool size based on PostgreSQL maximum open connections and CPU cores.</li>
                  </ul>
                </div>

                <div className="lesson-navigation-footer">
                  <button type="button" className="btn-lesson-nav">
                    &larr; Previous: 3.1 Event Loops
                  </button>
                  <button
                    type="button"
                    className="btn-lesson-nav primary"
                    onClick={() => setActiveTab('coding-lab')}
                  >
                    <span>Practice in Coding Sandbox &rarr;</span>
                  </button>
                </div>
              </div>
            </main>
          </div>
        )}

        {/* ==================================================================
            TAB 3: ONLINE CODING LAB (SANDBOXED RUNTIME)
            ================================================================== */}
        {activeTab === 'coding-lab' && (
          <div className="coding-lab-container">
            <div className="lab-toolbar">
              <div className="toolbar-left">
                <span className="lab-badge-live">SANDBOXED RUNTIME</span>
                <label htmlFor="lang-select" className="sr-only">Language</label>
                <select
                  id="lang-select"
                  className="lang-picker"
                  value={labLanguage}
                  onChange={(e) => setLabLanguage(e.target.value as any)}
                >
                  <option value="python">Python 3.12 (Isolated)</option>
                  <option value="javascript">Node.js v20 (V8 Engine)</option>
                  <option value="java">Java 21 OpenJDK</option>
                  <option value="sql">PostgreSQL 16 Engine</option>
                </select>
              </div>

              <div className="toolbar-right">
                <button
                  type="button"
                  className="btn-lab-ask-coach"
                  onClick={() => setActiveTab('ask-coach')}
                  title="Attach code to question"
                >
                  Ask Coach With This Code
                </button>
                <button
                  type="button"
                  className="btn-lab-run"
                  onClick={handleRunCode}
                  disabled={isRunningCode}
                >
                  {isRunningCode ? (
                    <span>Executing...</span>
                  ) : (
                    <>
                      <Play size={16} />
                      <span>Run Code</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="lab-split-surface">
              {/* Code Editor Surface */}
              <div className="editor-pane">
                <div className="pane-tab-header">
                  <span className="file-pill">main.py</span>
                  <span className="save-indicator">Auto-saved to student workspace</span>
                </div>
                <textarea
                  className="code-editor-textarea"
                  value={labCode}
                  onChange={(e) => setLabCode(e.target.value)}
                  spellCheck={false}
                />
              </div>

              {/* Terminal Output Surface */}
              <div className="terminal-pane">
                <div className="pane-tab-header">
                  <div className="terminal-label">
                    <Terminal size={14} />
                    <span>Execution Terminal</span>
                  </div>
                  {labOutput && (
                    <button type="button" className="btn-clear-term" onClick={() => setLabOutput(null)}>
                      Clear
                    </button>
                  )}
                </div>

                <div className="terminal-output-area">
                  {labOutput ? (
                    <pre className="term-output-text">{labOutput}</pre>
                  ) : (
                    <div className="term-placeholder">
                      <p>Click &quot;Run Code&quot; to execute inside isolated DP-Kernel container.</p>
                      <span className="security-notice">
                        🔒 Sandboxed execution: Student code does not run on host application server.
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================
            TAB 4: ASK COACH QUESTION THREAD
            ================================================================== */}
        {activeTab === 'ask-coach' && (
          <div className="ask-coach-split-layout">
            {/* Left Column: Questions List */}
            <div className="threads-list-pane">
              <div className="threads-header">
                <h3>My Questions to Coach</h3>
                <button
                  type="button"
                  className="btn-new-question"
                  onClick={() => setIsAskingNewQuestion(!isAskingNewQuestion)}
                >
                  {isAskingNewQuestion ? 'Cancel' : '+ New Question'}
                </button>
              </div>

              <div className="threads-scroll-area">
                {questionThreads.map((thread) => (
                  <div
                    key={thread.id}
                    className={`thread-card ${selectedThreadId === thread.id ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedThreadId(thread.id);
                      setIsAskingNewQuestion(false);
                    }}
                  >
                    <div className="thread-top-row">
                      <span className={`status-tag status-${thread.status}`}>
                        {thread.status.toUpperCase()}
                      </span>
                      <span className="thread-date">{thread.createdAt}</span>
                    </div>
                    <h4 className="thread-card-title">{thread.title}</h4>
                    <span className="thread-module-name">{thread.moduleName}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Thread Messages */}
            <div className="thread-content-pane">
              {isAskingNewQuestion ? (
                <form onSubmit={handleCreateNewQuestion} className="new-question-form">
                  <h3>Submit New Question to Coach</h3>
                  <div className="form-group">
                    <label>Question Title</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Asyncpg connection timeout under heavy Locust load"
                      value={newQuestionTitle}
                      onChange={(e) => setNewQuestionTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Describe the Problem &amp; What You Tried</label>
                    <textarea
                      className="form-textarea"
                      rows={6}
                      placeholder="Include error stack traces, current implementation logic, or questions..."
                      value={newQuestionBody}
                      onChange={(e) => setNewQuestionBody(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn-submit-question">
                    <span>Submit Question to {activeBatch.coachName}</span>
                    <Send size={16} />
                  </button>
                </form>
              ) : (
                <div className="active-thread-view">
                  <div className="thread-view-header">
                    <div>
                      <h2>{selectedThread.title}</h2>
                      <span className="thread-sub-meta">
                        {selectedThread.moduleName} • Lead Coach: <strong>{activeBatch.coachName}</strong>
                      </span>
                    </div>
                    <span className={`status-pill pill-${selectedThread.status}`}>
                      {selectedThread.status}
                    </span>
                  </div>

                  <div className="messages-stream">
                    {selectedThread.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`msg-bubble ${msg.senderRole === 'STUDENT' ? 'from-student' : 'from-coach'}`}
                      >
                        <div className="msg-author-row">
                          <strong>{msg.senderName}</strong>
                          <span className="msg-role-tag">{msg.senderRole}</span>
                          <span className="msg-time">{msg.timestamp}</span>
                        </div>
                        <p className="msg-text">{msg.content}</p>
                        {msg.codeSnippet && (
                          <pre className="msg-code-block">{msg.codeSnippet}</pre>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Reply Box */}
                  <form onSubmit={handleSendReply} className="thread-reply-form">
                    <input
                      type="text"
                      className="reply-input"
                      placeholder="Type your follow-up reply to the coach..."
                      value={newReplyText}
                      onChange={(e) => setNewReplyText(e.target.value)}
                    />
                    <button type="submit" className="btn-send-reply">
                      <Send size={16} />
                      <span>Reply</span>
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================================================================
            TAB 5: 1-ON-1 MOCK INTERVIEWS
            ================================================================== */}
        {activeTab === 'mock-interviews' && (
          <div className="mock-interview-view">
            {bookingSuccessMsg && (
              <div className="booking-alert-banner">
                <CheckCircle2 size={18} />
                <span>{bookingSuccessMsg}</span>
              </div>
            )}

            {/* Rule 17 & 18 Notice */}
            <div className="mock-rule-banner">
              <ShieldCheck size={20} className="icon-orange" />
              <div>
                <strong>Private 1-on-1 Interview Guarantee (1 Interviewer + 1 Student)</strong>
                <p>Mock sessions are strictly private and protected against double-booking at the database level.</p>
              </div>
            </div>

            {/* Available Booking Slots */}
            <div className="mock-section-block">
              <h3 className="section-title">Available Mock Interview Sessions</h3>
              <div className="slots-grid">
                {mockSlots.filter((s) => s.status === 'available').map((slot) => (
                  <div key={slot.id} className="slot-card">
                    <div className="slot-category-badge">{slot.category}</div>
                    <h4 className="slot-interviewer">{slot.interviewerName}</h4>
                    <span className="slot-title">{slot.interviewerTitle}</span>

                    <div className="slot-timing-row">
                      <Clock size={15} />
                      <span>{slot.date} • {slot.time}</span>
                    </div>

                    <button
                      type="button"
                      className="btn-book-slot"
                      onClick={() => handleBookMockSlot(slot.id)}
                    >
                      Book Private Slot
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Past Completed Mock Scorecards */}
            <div className="mock-section-block">
              <h3 className="section-title">Completed Interview Scorecards &amp; Feedback</h3>
              <div className="scorecards-list">
                {mockSlots.filter((s) => s.status === 'completed').map((slot) => (
                  <div key={slot.id} className="scorecard-card">
                    <div className="scorecard-header">
                      <div>
                        <h4>{slot.category} Defense</h4>
                        <span>Interviewer: {slot.interviewerName} ({slot.interviewerTitle})</span>
                      </div>
                      <div className="scorecard-rating-badge">
                        <span className="score-num">{slot.score}</span>
                        <span className="score-scale">/ 10</span>
                      </div>
                    </div>

                    {slot.rubricScores && (
                      <div className="rubric-grid">
                        <div className="rubric-item">
                          <span>Technical Knowledge</span>
                          <strong>{slot.rubricScores.technicalKnowledge}/10</strong>
                        </div>
                        <div className="rubric-item">
                          <span>Problem Solving</span>
                          <strong>{slot.rubricScores.problemSolving}/10</strong>
                        </div>
                        <div className="rubric-item">
                          <span>Coding &amp; Execution</span>
                          <strong>{slot.rubricScores.coding}/10</strong>
                        </div>
                        <div className="rubric-item">
                          <span>Communication</span>
                          <strong>{slot.rubricScores.communication}/10</strong>
                        </div>
                        <div className="rubric-item">
                          <span>Confidence &amp; Defense</span>
                          <strong>{slot.rubricScores.confidence}/10</strong>
                        </div>
                        <div className="rubric-item">
                          <span>Project Architecture</span>
                          <strong>{slot.rubricScores.projectKnowledge}/10</strong>
                        </div>
                      </div>
                    )}

                    <div className="rubric-feedback-note">
                      <strong>Coach Feedback:</strong>
                      <p>{slot.feedbackSummary}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================
            TAB 6: ASSIGNMENTS & EVALUATIONS
            ================================================================== */}
        {activeTab === 'assignments' && (
          <div className="assignments-view-stack">
            <div className="assignments-table-card">
              <div className="card-top-header">
                <h3>Course Assignments &amp; Coding Evaluations</h3>
                <span className="pending-badge">1 Pending Submission</span>
              </div>

              <div className="assignments-list">
                <div className="assignment-row">
                  <div className="assignment-info">
                    <h4>Task 01: Multi-threaded Web Crawler with asyncio</h4>
                    <span className="task-deadline">Deadline: Passed • Module 02</span>
                  </div>
                  <span className="task-status graded">Graded: 95/100</span>
                  <button type="button" className="btn-assignment-action">View Feedback</button>
                </div>

                <div className="assignment-row">
                  <div className="assignment-info">
                    <h4>Task 02: Dockerizing Celery Workers with Redis Queue</h4>
                    <span className="task-deadline">Deadline: Tomorrow, 11:59 PM • Module 03</span>
                  </div>
                  <span className="task-status submitted">Under Review</span>
                  <button type="button" className="btn-assignment-action">Resubmit</button>
                </div>

                <div className="assignment-row">
                  <div className="assignment-info">
                    <h4>Task 03: PostgreSQL Read Replica Query Load Balancer</h4>
                    <span className="task-deadline">Deadline: Saturday, Sept 21 • Module 04</span>
                  </div>
                  <span className="task-status pending">Pending</span>
                  <button type="button" className="btn-assignment-action primary">Submit Work</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================
            FALLBACK / OTHER TABS (RECORDINGS, MATERIALS, CERTIFICATES)
            ================================================================== */}
        {activeTab === 'recordings' && (
          <div className="general-tab-card">
            <h3>Full High-Definition Class Recording Library</h3>
            <p className="tab-desc">Every 1.5h live class recording is indexed here with searchable timestamps.</p>
            <div className="rec-items-list">
              <div className="rec-row">
                <div className="rec-icon-wrap"><Play size={16} /></div>
                <div className="rec-meta-box">
                  <h4>Session 24: Asyncio Event Loops &amp; Concurrency</h4>
                  <span>Sept 10 • 1h 32m • {activeBatch.coachName}</span>
                </div>
                <button type="button" className="btn-rec-play">Watch HD (1080p)</button>
              </div>
              <div className="rec-row">
                <div className="rec-icon-wrap"><Play size={16} /></div>
                <div className="rec-meta-box">
                  <h4>Session 23: PostgreSQL Composite Indexing &amp; Query Plans</h4>
                  <span>Sept 09 • 1h 28m • {activeBatch.coachName}</span>
                </div>
                <button type="button" className="btn-rec-play">Watch HD (1080p)</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'materials' && (
          <div className="general-tab-card">
            <h3>Curriculum Study Materials &amp; Source Code</h3>
            <p className="tab-desc">Download instructor slide decks, starter templates, and reference architectures.</p>
            <div className="materials-list">
              <div className="material-item">
                <FileText size={20} className="icon-orange" />
                <div className="material-details">
                  <strong>AsyncIO Architecture Cheat Sheet (PDF)</strong>
                  <span>Module 03 • 2.4 MB • Uploaded by {activeBatch.coachName}</span>
                </div>
                <button type="button" className="btn-download-mat">
                  <Download size={16} />
                  <span>Download</span>
                </button>
              </div>
              <div className="material-item">
                <FolderGit2 size={20} className="icon-blue" />
                <div className="material-details">
                  <strong>FastAPI Microservices Production Boilerplate (.zip)</strong>
                  <span>Module 03 • 4.8 MB • Clean architecture with pytest fixtures</span>
                </div>
                <button type="button" className="btn-download-mat">
                  <Download size={16} />
                  <span>Download</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'certificates' && (
          <div className="general-tab-card certificate-card">
            <Award size={48} className="cert-big-icon icon-orange" />
            <h3>DP Skilltech Verified Certificate of Completion</h3>
            <p className="cert-status-notice">
              Certificates are unlocked upon completing 100% of live cohort lectures, passing all module evaluations, and defending the production capstone.
            </p>
            <div className="cert-progress-box">
              <div className="cert-item-check">
                <CheckCircle2 size={16} className="icon-green" />
                <span>Attendance Requirement Met (94% / 85% required)</span>
              </div>
              <div className="cert-item-check">
                <Clock size={16} className="icon-yellow" />
                <span>Curriculum Modules: 50% Completed (In Progress)</span>
              </div>
              <div className="cert-item-check">
                <Clock size={16} className="icon-yellow" />
                <span>Production Capstone Defense: Scheduled after Module 08</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
};
