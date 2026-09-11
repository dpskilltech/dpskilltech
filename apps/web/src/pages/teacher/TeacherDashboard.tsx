import React, { useState, useEffect } from 'react';
import {
  Video,
  Users,
  CalendarCheck,
  Clock,
  ShieldCheck,
  Send
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
import './TeacherDashboard.css';

interface TeacherDashboardProps {
  onNavigateToPublic: (page: string, params?: Record<string, string>) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onNavigateToPublic }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [, setDashboardData] = useState<any>(null);

  // Question Inbox State
  const [questionThreads, setQuestionThreads] = useState<QuestionThread[]>(INITIAL_QUESTION_THREADS);
  const [selectedThreadId, setSelectedThreadId] = useState<string>('q-102');
  const [replyText, setReplyText] = useState<string>('');

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

  const activeBatch = COHORT_BATCHES[0];
  const selectedThread = questionThreads.find((t) => t.id === selectedThreadId) || questionThreads[0];

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

  return (
    <PortalLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onNavigateToPublic={onNavigateToPublic}
      title={
        activeTab === 'dashboard'
          ? `Instructor Studio — ${user?.fullName || 'Faculty Lead'}`
          : activeTab === 'batches'
          ? 'Assigned Batches (Max 15 Cap Monitoring)'
          : activeTab === 'questions'
          ? 'Student Question Inbox & Threads'
          : activeTab === 'submissions'
          ? 'Student Code & Assignment Evaluations'
          : activeTab === 'mock-interviews'
          ? '1-on-1 Mock Interview Schedules'
          : 'Instructor Operations'
      }
      subtitle="Manage assigned cohorts (15 max batch cap), host live Zoom classrooms, review code submissions, and conduct 1-on-1 mock interviews."
    >
      <div className="teacher-portal-stack">
        {/* ==================================================================
            TAB 1: COACH DASHBOARD OVERVIEW
            ================================================================== */}
        {activeTab === 'dashboard' && (
          <div className="teacher-overview-flow">
            {/* Live Class Launcher Banner */}
            <section className="teacher-hero-card">
              <div className="teacher-hero-meta">
                <span className="live-status-pill">
                  <span className="pulse-dot-green"></span>
                  SCHEDULED TONIGHT
                </span>
                <span className="cohort-tag">
                  Cohort {activeBatch.code} • {activeBatch.enrolledCount}/{activeBatch.capacity} Students Enrolled
                </span>
              </div>

              <div className="teacher-hero-body">
                <div>
                  <h2 className="teacher-class-title">Async I/O &amp; FastAPI Concurrency Patterns</h2>
                  <div className="teacher-details-row">
                    <span><Clock size={16} /> {activeBatch.timeSlot}</span>
                    <span><Users size={16} /> {activeBatch.enrolledCount} Active Cohort Students</span>
                    <span><ShieldCheck size={16} /> Max 15 Capacity Enforced</span>
                  </div>
                </div>

                <div className="teacher-action-block">
                  <a
                    href={activeBatch.zoomJoinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="launch-zoom-host-btn"
                  >
                    <Video size={19} />
                    <span>Start Zoom Meeting as Host</span>
                  </a>
                  <span className="host-note">Cloud recording will automatically attach to student portal</span>
                </div>
              </div>
            </section>

            {/* Quick Metric Cards */}
            <section className="teacher-kpi-grid">
              <div className="teacher-kpi-card">
                <span className="kpi-title">Active Batches</span>
                <span className="kpi-val">2</span>
                <span className="kpi-sub">PY-FS-01 &amp; JV-FS-01 (100% cap compliant)</span>
              </div>
              <div className="teacher-kpi-card">
                <span className="kpi-title">Pending Questions</span>
                <span className="kpi-val text-orange">1</span>
                <span className="kpi-sub">Priya Iyer • PyTorch CUDA Memory</span>
              </div>
              <div className="teacher-kpi-card">
                <span className="kpi-title">Pending Submissions</span>
                <span className="kpi-val text-yellow">3</span>
                <span className="kpi-sub">Dockerizing Celery workers tasks</span>
              </div>
              <div className="teacher-kpi-card">
                <span className="kpi-title">Mock Interviews</span>
                <span className="kpi-val text-blue">2</span>
                <span className="kpi-sub">1:1 slots scheduled this weekend</span>
              </div>
            </section>

            {/* Active Cohorts & Mock Interviews */}
            <div className="teacher-grid-split">
              {/* Active Cohorts */}
              <div className="teacher-panel">
                <div className="panel-header-row">
                  <h3 className="panel-title">
                    <Users size={18} />
                    <span>Assigned Batches (Max 15 Cap)</span>
                  </h3>
                  <span className="panel-status-pill">Rule 15 Compliant</span>
                </div>

                <div className="cohorts-list">
                  {COHORT_BATCHES.map((batch) => (
                    <div key={batch.id} className="cohort-card">
                      <div className="cohort-card-top">
                        <h4 className="cohort-name">{batch.courseTitle} ({batch.code})</h4>
                        <span className="cohort-capacity-badge">
                          {batch.enrolledCount} / {batch.capacity} Enrolled
                        </span>
                      </div>
                      <div className="cohort-capacity-bar">
                        <div
                          className="capacity-fill"
                          style={{ width: `${(batch.enrolledCount / batch.capacity) * 100}%` }}
                        ></div>
                      </div>
                      <div className="cohort-meta-row">
                        <span>Schedule: <strong>{batch.timeSlot}</strong></span>
                        <span>Cadence: <strong>{batch.scheduleDays}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mock Interview Slots */}
              <div className="teacher-panel">
                <div className="panel-header-row">
                  <h3 className="panel-title">
                    <CalendarCheck size={18} />
                    <span>1-on-1 Mock Interview Schedule</span>
                  </h3>
                  <span className="panel-badge-orange">Private Sessions</span>
                </div>

                <div className="interview-slots-list">
                  {MOCK_INTERVIEW_SESSIONS.filter((s) => s.status === 'booked').map((slot) => (
                    <div key={slot.id} className="interview-slot-row">
                      <div className="slot-info">
                        <span className="slot-type-pill">{slot.category}</span>
                        <h4>Candidate: {slot.bookedStudentName}</h4>
                        <span>{slot.date} • {slot.time}</span>
                      </div>
                      <button
                        type="button"
                        className="btn-start-interview"
                        onClick={() => alert(`Starting 1-on-1 Mock Interview session with ${slot.bookedStudentName}`)}
                      >
                        Start 1:1 Room
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================
            TAB 2: QUESTION INBOX
            ================================================================== */}
        {activeTab === 'questions' && (
          <div className="coach-inbox-split">
            <div className="inbox-list-col">
              <div className="inbox-header">
                <h3>Student Questions</h3>
                <span className="badge-count">1 Unanswered</span>
              </div>
              <div className="inbox-cards">
                {questionThreads.map((thread) => (
                  <div
                    key={thread.id}
                    className={`inbox-card ${selectedThreadId === thread.id ? 'active' : ''}`}
                    onClick={() => setSelectedThreadId(thread.id)}
                  >
                    <div className="card-top">
                      <strong>{thread.studentName}</strong>
                      <span className={`status-pill pill-${thread.status}`}>{thread.status}</span>
                    </div>
                    <h4 className="inbox-question-title">{thread.title}</h4>
                    <span className="inbox-course-info">{thread.courseTitle}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="inbox-thread-col">
              <div className="thread-detail-header">
                <div>
                  <h2>{selectedThread.title}</h2>
                  <span>Student: <strong>{selectedThread.studentName}</strong> ({selectedThread.studentId}) • {selectedThread.moduleName}</span>
                </div>
              </div>

              <div className="thread-bubbles">
                {selectedThread.messages.map((m) => (
                  <div key={m.id} className={`msg-card ${m.senderRole === 'COACH' ? 'coach' : 'student'}`}>
                    <div className="msg-meta">
                      <strong>{m.senderName}</strong>
                      <span>{m.senderRole}</span>
                      <span className="time">{m.timestamp}</span>
                    </div>
                    <p>{m.content}</p>
                    {m.codeSnippet && <pre className="code-box">{m.codeSnippet}</pre>}
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendCoachReply} className="coach-reply-box">
                <textarea
                  className="reply-textarea"
                  rows={3}
                  placeholder="Provide technical solution, architectural explanation, or code guidance..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  required
                />
                <button type="submit" className="btn-coach-send">
                  <Send size={16} />
                  <span>Send Answer to Student</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ==================================================================
            TAB 3: BATCH CAPACITY MONITOR
            ================================================================== */}
        {activeTab === 'batches' && (
          <div className="teacher-panel">
            <div className="panel-header-row">
              <div>
                <h3 className="panel-title">Active Cohorts (Strict 15-Student Cap Enforcement)</h3>
                <p className="panel-subtext">Instructors manage batches of at most 15 students to ensure personalized code walkthroughs and screen-sharing.</p>
              </div>
              <span className="panel-status-pill">100% Compliant</span>
            </div>

            <div className="cohorts-list">
              {COHORT_BATCHES.map((b) => (
                <div key={b.id} className="cohort-card">
                  <div className="cohort-card-top">
                    <h4 className="cohort-name">{b.courseTitle} — Cohort {b.code}</h4>
                    <span className="cohort-capacity-badge">{b.enrolledCount} / {b.capacity} Students Enrolled</span>
                  </div>
                  <div className="cohort-capacity-bar">
                    <div className="capacity-fill" style={{ width: `${(b.enrolledCount / b.capacity) * 100}%` }}></div>
                  </div>
                  <div className="cohort-meta-row">
                    <span>Assigned Coach: <strong>{b.coachName}</strong></span>
                    <span>Class Time: <strong>{b.timeSlot}</strong></span>
                    <span>Schedule: <strong>{b.scheduleDays}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================================================================
            TAB 4: SUBMISSIONS EVALUATION
            ================================================================== */}
        {activeTab === 'submissions' && (
          <div className="teacher-panel">
            <div className="panel-header-row">
              <h3 className="panel-title">Pending Code &amp; Assignment Reviews</h3>
              <span className="panel-badge-orange">3 Submissions Queued</span>
            </div>
            <div className="submissions-list">
              <div className="submission-row">
                <div>
                  <strong>Aarav Sharma — Task 02: Dockerizing Celery Workers</strong>
                  <span>Submitted 4 hours ago • Full Stack Python + AI</span>
                </div>
                <button type="button" className="btn-review-submission">Review Code &amp; Grade</button>
              </div>
              <div className="submission-row">
                <div>
                  <strong>Rohan Gupta — Task 01: Multi-threaded Web Crawler</strong>
                  <span>Submitted Yesterday • Full Stack Python + AI</span>
                </div>
                <button type="button" className="btn-review-submission">Review Code &amp; Grade</button>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================
            TAB 5: MOCK INTERVIEWS
            ================================================================== */}
        {activeTab === 'mock-interviews' && (
          <div className="teacher-panel">
            <div className="panel-header-row">
              <h3 className="panel-title">1-on-1 Mock Interview Schedule &amp; Rubric Scores</h3>
              <span className="panel-badge-orange">Private 1:1 Protocol</span>
            </div>
            <div className="interview-slots-list">
              {MOCK_INTERVIEW_SESSIONS.map((s) => (
                <div key={s.id} className="interview-slot-row">
                  <div className="slot-info">
                    <span className="slot-type-pill">{s.category}</span>
                    <h4>{s.bookedStudentName ? `Candidate: ${s.bookedStudentName}` : 'Available Slot'}</h4>
                    <span>{s.date} • {s.time}</span>
                  </div>
                  {s.status === 'booked' ? (
                    <button type="button" className="btn-start-interview">Start 1:1 Session</button>
                  ) : s.status === 'completed' ? (
                    <span className="score-badge">Score: {s.score}/10</span>
                  ) : (
                    <span className="status-open-pill">Open for Booking</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
};
