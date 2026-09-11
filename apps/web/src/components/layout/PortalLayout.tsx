import React from 'react';
import {
  GraduationCap,
  Layers,
  ShieldCheck,
  Video,
  Code2,
  CalendarCheck,
  BookOpen,
  FileCheck2,
  LogOut,
  ExternalLink,
  ChevronRight,
  User,
  Clock,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './PortalLayout.css';

interface PortalLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange?: (tab: string) => void;
  onNavigateToPublic: (page: string) => void;
  title: string;
  subtitle?: string;
}

export const PortalLayout: React.FC<PortalLayoutProps> = ({
  children,
  activeTab,
  onTabChange,
  onNavigateToPublic,
  title,
  subtitle
}) => {
  const { user, role, logout } = useAuth();

  const handleSignOut = () => {
    logout();
    onNavigateToPublic('login');
  };

  const roleLabel =
    role === 'STUDENT'
      ? 'Student Portal'
      : role === 'TEACHER'
      ? 'Instructor Studio'
      : 'Admin Management';

  const roleBadgeColor =
    role === 'STUDENT'
      ? 'badge-student'
      : role === 'TEACHER'
      ? 'badge-teacher'
      : 'badge-admin';

  return (
    <div className="portal-shell">
      {/* Sidebar Navigation */}
      <aside className="portal-sidebar">
        <div className="portal-sidebar-header">
          <div className="portal-brand" onClick={() => onNavigateToPublic('home')}>
            <span className="brand-dot pulse-dot"></span>
            <span className="brand-name">DP Skilltech</span>
          </div>
          <span className={`portal-role-tag ${roleBadgeColor}`}>
            {role === 'STUDENT' && <GraduationCap size={12} />}
            {role === 'TEACHER' && <Layers size={12} />}
            {role === 'ADMIN' && <ShieldCheck size={12} />}
            <span>{roleLabel}</span>
          </span>
        </div>

        <nav className="portal-nav-menu">
          {role === 'STUDENT' && (
            <>
              <div className="nav-group-title">ACADEMIC WORKSPACE</div>
              <button
                className={`portal-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => onTabChange && onTabChange('dashboard')}
              >
                <GraduationCap size={18} />
                <span>Dashboard Overview</span>
              </button>
              <button
                className={`portal-nav-item ${activeTab === 'courses' ? 'active' : ''}`}
                onClick={() => onTabChange && onTabChange('courses')}
              >
                <BookOpen size={18} />
                <span>My Courses & Syllabus</span>
              </button>
              <button
                className={`portal-nav-item ${activeTab === 'live' ? 'active' : ''}`}
                onClick={() => onTabChange && onTabChange('live')}
              >
                <Video size={18} />
                <span>Live Zoom Class</span>
                <span className="nav-badge live-indicator">LIVE</span>
              </button>
              <button
                className={`portal-nav-item ${activeTab === 'lab' ? 'active' : ''}`}
                onClick={() => onTabChange && onTabChange('lab')}
              >
                <Code2 size={18} />
                <span>Cloud Coding Lab</span>
              </button>
              <button
                className={`portal-nav-item ${activeTab === 'mock' ? 'active' : ''}`}
                onClick={() => onTabChange && onTabChange('mock')}
              >
                <CalendarCheck size={18} />
                <span>1-on-1 Mock Interview</span>
              </button>
              <button
                className={`portal-nav-item ${activeTab === 'assignments' ? 'active' : ''}`}
                onClick={() => onTabChange && onTabChange('assignments')}
              >
                <FileCheck2 size={18} />
                <span>Assignments & Quizzes</span>
              </button>
            </>
          )}

          {role === 'TEACHER' && (
            <>
              <div className="nav-group-title">INSTRUCTOR OPERATIONS</div>
              <button
                className={`portal-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => onTabChange && onTabChange('dashboard')}
              >
                <Layers size={18} />
                <span>Instructor Overview</span>
              </button>
              <button
                className={`portal-nav-item ${activeTab === 'batches' ? 'active' : ''}`}
                onClick={() => onTabChange && onTabChange('batches')}
              >
                <GraduationCap size={18} />
                <span>Active Cohorts (Max 15)</span>
              </button>
              <button
                className={`portal-nav-item ${activeTab === 'live-classes' ? 'active' : ''}`}
                onClick={() => onTabChange && onTabChange('live-classes')}
              >
                <Video size={18} />
                <span>Launch Zoom Class</span>
              </button>
              <button
                className={`portal-nav-item ${activeTab === 'evaluations' ? 'active' : ''}`}
                onClick={() => onTabChange && onTabChange('evaluations')}
              >
                <FileCheck2 size={18} />
                <span>Student Submissions</span>
                <span className="nav-badge count-indicator">5</span>
              </button>
              <button
                className={`portal-nav-item ${activeTab === 'mock-interviews' ? 'active' : ''}`}
                onClick={() => onTabChange && onTabChange('mock-interviews')}
              >
                <CalendarCheck size={18} />
                <span>Mock Interview Slots</span>
              </button>
            </>
          )}

          {role === 'ADMIN' && (
            <>
              <div className="nav-group-title">ACADEMY GOVERNANCE</div>
              <button
                className={`portal-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => onTabChange && onTabChange('dashboard')}
              >
                <ShieldCheck size={18} />
                <span>Executive Dashboard</span>
              </button>
              <button
                className={`portal-nav-item ${activeTab === 'students' ? 'active' : ''}`}
                onClick={() => onTabChange && onTabChange('students')}
              >
                <GraduationCap size={18} />
                <span>Student Roster</span>
              </button>
              <button
                className={`portal-nav-item ${activeTab === 'faculty' ? 'active' : ''}`}
                onClick={() => onTabChange && onTabChange('faculty')}
              >
                <Layers size={18} />
                <span>Faculty Directory</span>
              </button>
              <button
                className={`portal-nav-item ${activeTab === 'cohorts' ? 'active' : ''}`}
                onClick={() => onTabChange && onTabChange('cohorts')}
              >
                <Clock size={18} />
                <span>Batch Cap Monitoring</span>
              </button>
            </>
          )}
        </nav>

        {/* Sidebar Footer & User Profile */}
        <div className="portal-sidebar-footer">
          <button
            className="portal-back-btn"
            onClick={() => onNavigateToPublic('home')}
            title="Return to Public Website"
          >
            <ExternalLink size={15} />
            <span>Public Website</span>
          </button>

          <div className="portal-user-card">
            <div className="portal-user-avatar">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.fullName} />
              ) : (
                <User size={18} />
              )}
            </div>
            <div className="portal-user-details">
              <span className="portal-user-name">{user?.fullName || 'User'}</span>
              <span className="portal-user-email">{user?.email}</span>
            </div>
            <button
              className="portal-logout-btn"
              onClick={handleSignOut}
              title="Sign Out of LMS"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Portal Content Surface */}
      <div className="portal-content-surface">
        {/* Top Header Bar */}
        <header className="portal-topbar">
          <div className="portal-topbar-left">
            <div className="portal-breadcrumbs">
              <span>Virtual Academy</span>
              <ChevronRight size={14} />
              <span className="active-crumb">{roleLabel}</span>
            </div>
            <h1 className="portal-page-title">{title}</h1>
            {subtitle && <p className="portal-page-subtitle">{subtitle}</p>}
          </div>

          <div className="portal-topbar-right">
            {role === 'STUDENT' && user?.studentProfile && (
              <div className="topbar-batch-pill">
                <span className="pill-dot green-dot"></span>
                <span>{user.studentProfile.batchName}</span>
              </div>
            )}
            {role === 'TEACHER' && (
              <div className="topbar-batch-pill">
                <span className="pill-dot blue-dot"></span>
                <span>Instructor Lead • Mon - Sat Cadence</span>
              </div>
            )}
            {role === 'ADMIN' && (
              <div className="topbar-batch-pill">
                <span className="pill-dot purple-dot"></span>
                <span>Audit & Governance Active</span>
              </div>
            )}
            <button
              className="topbar-action-btn"
              onClick={() => onNavigateToPublic('courses')}
            >
              <Sparkles size={14} />
              <span>Browse Catalog</span>
            </button>
          </div>
        </header>

        {/* Dynamic Portal Body */}
        <main className="portal-main-view">{children}</main>
      </div>
    </div>
  );
};
