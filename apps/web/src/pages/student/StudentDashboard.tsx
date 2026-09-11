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
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { api } from '../../services/api';
import './StudentDashboard.css';

interface StudentDashboardProps {
  onNavigateToPublic: (page: string, params?: Record<string, string>) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onNavigateToPublic }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [dashboardData, setDashboardData] = useState<any>(null);

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

  const profile = user?.studentProfile;

  return (
    <PortalLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onNavigateToPublic={onNavigateToPublic}
      title={`Welcome Back, ${user?.fullName?.split(' ')[0] || 'Student'}`}
      subtitle="Track your live cohorts, assignments, sandboxed coding practice, and mock interviews."
    >
      <div className="student-dashboard-content">
        {/* Next Live Class Hero Banner */}
        <section className="live-class-hero-card">
          <div className="live-badge-row">
            <span className="live-pulse-badge">
              <span className="pulse-circle"></span>
              TODAY'S LIVE ZOOM CLASS
            </span>
            <span className="batch-pill-indicator">
              {profile?.batchName || 'Batch PY-2026-01 (14/15 Students)'}
            </span>
          </div>

          <div className="live-hero-details">
            <div className="live-info-left">
              <h2 className="live-class-title">
                {dashboardData?.nextLiveClass?.title || 'Async I/O & FastAPI Concurrency Patterns'}
              </h2>
              <div className="live-meta-row">
                <span className="meta-item">
                  <UserCheck size={16} />
                  <span>Lead Instructor: <strong>{dashboardData?.nextLiveClass?.instructor || 'Dr. Rajesh Verma'}</strong></span>
                </span>
                <span className="meta-item">
                  <Clock size={16} />
                  <span>Schedule: <strong>07:00 PM - 08:30 PM IST</strong></span>
                </span>
                <span className="meta-item">
                  <Calendar size={16} />
                  <span>Duration: <strong>1.5 Hours Live</strong></span>
                </span>
              </div>
            </div>

            <div className="live-action-right">
              <a
                href={dashboardData?.nextLiveClass?.zoomJoinUrl || 'https://zoom.us/j/9876543210'}
                target="_blank"
                rel="noopener noreferrer"
                className="join-zoom-btn"
              >
                <Video size={20} />
                <span>Join Zoom Classroom</span>
              </a>
              <span className="zoom-subtext">Passcode pre-configured • 15 Students Max</span>
            </div>
          </div>
        </section>

        {/* Academic Progress Metrics */}
        <section className="metrics-grid">
          <div className="metric-card">
            <div className="metric-header">
              <span className="metric-label">Course Attendance</span>
              <Award size={20} className="metric-icon green-icon" />
            </div>
            <div className="metric-value">{profile?.attendanceRate || 94}%</div>
            <div className="progress-bar-bg">
              <div
                className="progress-bar-fill green-fill"
                style={{ width: `${profile?.attendanceRate || 94}%` }}
              ></div>
            </div>
            <span className="metric-subtext">Verified 6-day weekly attendance record</span>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <span className="metric-label">Curriculum Completion</span>
              <BookOpen size={20} className="metric-icon blue-icon" />
            </div>
            <div className="metric-value">
              {profile?.completedLessons || 24} <span className="metric-denom">/ {profile?.totalLessons || 48}</span>
            </div>
            <div className="progress-bar-bg">
              <div
                className="progress-bar-fill blue-fill"
                style={{ width: `${((profile?.completedLessons || 24) / (profile?.totalLessons || 48)) * 100}%` }}
              ></div>
            </div>
            <span className="metric-subtext">Track: Full Stack Python + AI Architecture</span>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <span className="metric-label">Assignments Evaluated</span>
              <FileText size={20} className="metric-icon purple-icon" />
            </div>
            <div className="metric-value">
              {profile?.submittedAssignments || 7} <span className="metric-denom">/ {profile?.totalAssignments || 8}</span>
            </div>
            <div className="progress-bar-bg">
              <div
                className="progress-bar-fill purple-fill"
                style={{ width: `${((profile?.submittedAssignments || 7) / (profile?.totalAssignments || 8)) * 100}%` }}
              ></div>
            </div>
            <span className="metric-subtext">1 pending submission for peer review</span>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <span className="metric-label">Mock Interview Credits</span>
              <Calendar size={20} className="metric-icon cyan-icon" />
            </div>
            <div className="metric-value">
              {profile?.mockInterviewCredits || 2} <span className="metric-denom">Slots Available</span>
            </div>
            <button
              className="book-slot-link"
              onClick={() => onNavigateToPublic('career-support')}
            >
              <span>Book 1-on-1 Session</span>
              <ArrowRight size={14} />
            </button>
            <span className="metric-subtext">Private 1:1 session • Anti-double-booking</span>
          </div>
        </section>

        {/* Content Split: Lecture Recordings & Coding Lab Action */}
        <div className="dashboard-columns-split">
          {/* Recent Lecture Recordings */}
          <div className="dashboard-panel recordings-panel">
            <div className="panel-top-row">
              <h3 className="panel-heading">
                <Play size={18} />
                <span>Recent Live Class Recordings</span>
              </h3>
              <span className="panel-badge">High Definition</span>
            </div>

            <div className="recordings-list">
              <div className="recording-item">
                <div className="rec-icon-box">
                  <Play size={16} />
                </div>
                <div className="rec-info">
                  <h4 className="rec-title">Python Metaclasses & Custom Decorators</h4>
                  <div className="rec-meta">
                    <span>Yesterday</span> • <span>1h 32m</span> • <span>Dr. Rajesh Verma</span>
                  </div>
                </div>
                <button
                  className="watch-rec-btn"
                  onClick={() => alert('Opening HD Class Recording viewer')}
                >
                  <span>Watch</span>
                </button>
              </div>

              <div className="recording-item">
                <div className="rec-icon-box">
                  <Play size={16} />
                </div>
                <div className="rec-info">
                  <h4 className="rec-title">PostgreSQL Advanced Indexing & Query Plans</h4>
                  <div className="rec-meta">
                    <span>2 days ago</span> • <span>1h 28m</span> • <span>Dr. Rajesh Verma</span>
                  </div>
                </div>
                <button
                  className="watch-rec-btn"
                  onClick={() => alert('Opening HD Class Recording viewer')}
                >
                  <span>Watch</span>
                </button>
              </div>

              <div className="recording-item">
                <div className="rec-icon-box">
                  <Play size={16} />
                </div>
                <div className="rec-info">
                  <h4 className="rec-title">FastAPI Dependency Injection & Middleware</h4>
                  <div className="rec-meta">
                    <span>3 days ago</span> • <span>1h 40m</span> • <span>Dr. Rajesh Verma</span>
                  </div>
                </div>
                <button
                  className="watch-rec-btn"
                  onClick={() => alert('Opening HD Class Recording viewer')}
                >
                  <span>Watch</span>
                </button>
              </div>
            </div>
          </div>

          {/* Cloud Coding Lab Quick Action */}
          <div className="dashboard-panel lab-promo-panel">
            <div className="panel-top-row">
              <h3 className="panel-heading">
                <Code2 size={18} />
                <span>In-Browser Sandboxed Lab</span>
              </h3>
              <span className="panel-badge lab-status-badge">Container Ready</span>
            </div>

            <p className="lab-promo-desc">
              Execute Python, JavaScript, and SQL in an isolated sandboxed runtime without configuring local virtual environments.
            </p>

            <div className="code-snippet-preview">
              <div className="code-snippet-header">
                <span className="dot-red"></span>
                <span className="dot-yellow"></span>
                <span className="dot-green"></span>
                <span className="code-tab-label">exercise_04_async.py</span>
              </div>
              <pre className="code-text">
{`import asyncio

async def fetch_student_progress(user_id: str):
    await asyncio.sleep(0.05)
    return {"status": "enrolled", "batch": "PY-2026-01"}

asyncio.run(fetch_student_progress("usr_student_01"))`}
              </pre>
            </div>

            <button
              className="open-lab-btn"
              onClick={() => onNavigateToPublic('home')}
            >
              <Code2 size={18} />
              <span>Launch Cloud Coding Lab</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};
