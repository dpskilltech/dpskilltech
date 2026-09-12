import React, { useState, useEffect, useRef } from 'react';
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
  Sparkles,
  Bell,
  Search,
  Menu,
  ChevronLeft,
  X,
  CheckCircle2,
  Settings,
  HelpCircle,
  FolderGit2,
  Award,
  MessageSquareQuote,
  BarChart3,
  Users2,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PORTAL_NOTIFICATIONS } from '../../data/portalMockData';
import type { PortalNotification } from '../../data/portalMockData';
import '../../styles/portal-tokens.css';
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

  // Layout UI States
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<PortalNotification[]>(PORTAL_NOTIFICATIONS);
  const [notifFilter, setNotifFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    logout();
    onNavigateToPublic('login');
  };

  const handleTabClick = (tab: string) => {
    if (onTabChange) onTabChange(tab);
    setIsMobileMenuOpen(false);
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const filteredNotifications = notifications.filter((n) => {
    if (notifFilter === 'all') return true;
    if (notifFilter === 'unread') return !n.isRead;
    return n.category === notifFilter;
  });

  const roleBadgeLabel =
    role === 'STUDENT'
      ? 'Student Portal'
      : role === 'TEACHER'
      ? 'Instructor Studio'
      : 'Admin Governance';

  return (
    <div className={`portal-shell ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Mobile Backdrop Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-overlay-backdrop" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* ====================================================================
          SIDEBAR NAVIGATION (ROLE-AWARE & COLLAPSIBLE)
          ==================================================================== */}
      <aside className={`portal-sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        {/* Sidebar Header */}
        <div className="portal-sidebar-header">
          <div className="portal-brand-block" onClick={() => onNavigateToPublic('home')}>
            <span className="brand-dot-pulse"></span>
            {!isSidebarCollapsed && <span className="brand-title-text">DP SKILLTECH</span>}
          </div>

          <div className="header-toggle-actions">
            {!isSidebarCollapsed && (
              <span className={`portal-role-pill role-${role?.toLowerCase()}`}>
                {role === 'STUDENT' && <GraduationCap size={11} />}
                {role === 'TEACHER' && <Layers size={11} />}
                {role === 'ADMIN' && <ShieldCheck size={11} />}
                <span>{roleBadgeLabel}</span>
              </span>
            )}
            <button
              type="button"
              className="sidebar-collapse-btn desktop-only"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              aria-label="Toggle sidebar"
            >
              {isSidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
            <button
              type="button"
              className="mobile-close-btn mobile-only"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Navigation Items per Role */}
        <nav className="portal-nav-menu">
          {/* ---------------- STUDENT ROLE MENU ---------------- */}
          {role === 'STUDENT' && (
            <>
              {!isSidebarCollapsed && <div className="nav-section-title">MY LEARNING</div>}
              <button
                type="button"
                className={`portal-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => handleTabClick('dashboard')}
                title="Dashboard Overview"
              >
                <GraduationCap size={18} className="nav-icon" />
                {!isSidebarCollapsed && <span>Dashboard</span>}
              </button>
              <button
                type="button"
                className={`portal-nav-item ${activeTab === 'my-courses' ? 'active' : ''}`}
                onClick={() => handleTabClick('my-courses')}
                title="My Courses & Syllabus"
              >
                <BookOpen size={18} className="nav-icon" />
                {!isSidebarCollapsed && <span>My Courses</span>}
              </button>
              <button
                type="button"
                className={`portal-nav-item ${activeTab === 'classroom' ? 'active' : ''}`}
                onClick={() => handleTabClick('classroom')}
                title="Student Classroom"
              >
                <Layers size={18} className="nav-icon" />
                {!isSidebarCollapsed && <span>Classroom</span>}
              </button>
              <button
                type="button"
                className={`portal-nav-item ${activeTab === 'live-classes' ? 'active' : ''}`}
                onClick={() => handleTabClick('live-classes')}
                title="Live Zoom Classes"
              >
                <Video size={18} className="nav-icon text-orange" />
                {!isSidebarCollapsed && (
                  <>
                    <span>Live Classes</span>
                    <span className="nav-tag tag-live">LIVE</span>
                  </>
                )}
              </button>
              <button
                type="button"
                className={`portal-nav-item ${activeTab === 'recordings' ? 'active' : ''}`}
                onClick={() => handleTabClick('recordings')}
                title="Classroom Recordings Library"
              >
                <Clock size={18} className="nav-icon" />
                {!isSidebarCollapsed && <span>Recordings</span>}
              </button>
              <button
                type="button"
                className={`portal-nav-item ${activeTab === 'materials' ? 'active' : ''}`}
                onClick={() => handleTabClick('materials')}
                title="Study Materials & Code"
              >
                <FileCheck2 size={18} className="nav-icon" />
                {!isSidebarCollapsed && <span>Study Materials</span>}
              </button>

              {!isSidebarCollapsed && <div className="nav-section-title">PRACTICE & LAB</div>}
              <button
                type="button"
                className={`portal-nav-item ${activeTab === 'coding-lab' ? 'active' : ''}`}
                onClick={() => handleTabClick('coding-lab')}
                title="In-Browser Sandboxed Coding Lab"
              >
                <Code2 size={18} className="nav-icon text-blue" />
                {!isSidebarCollapsed && (
                  <>
                    <span>Online Coding Lab</span>
                    <span className="nav-tag tag-sandbox">LAB</span>
                  </>
                )}
              </button>
              <button
                type="button"
                className={`portal-nav-item ${activeTab === 'assignments' ? 'active' : ''}`}
                onClick={() => handleTabClick('assignments')}
                title="Course Assignments"
              >
                <FileCheck2 size={18} className="nav-icon" />
                {!isSidebarCollapsed && <span>Assignments</span>}
              </button>
              <button
                type="button"
                className={`portal-nav-item ${activeTab === 'quizzes' ? 'active' : ''}`}
                onClick={() => handleTabClick('quizzes')}
                title="Evaluations & Quizzes"
              >
                <Sparkles size={18} className="nav-icon" />
                {!isSidebarCollapsed && <span>Quizzes</span>}
              </button>
              <button
                type="button"
                className={`portal-nav-item ${activeTab === 'projects' ? 'active' : ''}`}
                onClick={() => handleTabClick('projects')}
                title="Production Capstone Projects"
              >
                <FolderGit2 size={18} className="nav-icon" />
                {!isSidebarCollapsed && <span>Projects</span>}
              </button>

              {!isSidebarCollapsed && <div className="nav-section-title">SUPPORT & CAREER</div>}
              <button
                type="button"
                className={`portal-nav-item ${activeTab === 'ask-coach' ? 'active' : ''}`}
                onClick={() => handleTabClick('ask-coach')}
                title="Ask Coach Direct Question Thread"
              >
                <MessageSquareQuote size={18} className="nav-icon text-yellow" />
                {!isSidebarCollapsed && (
                  <>
                    <span>Ask Coach</span>
                    <span className="nav-tag tag-yellow">1:1</span>
                  </>
                )}
              </button>
              <button
                type="button"
                className={`portal-nav-item ${activeTab === 'mock-interviews' ? 'active' : ''}`}
                onClick={() => handleTabClick('mock-interviews')}
                title="1-on-1 Private Mock Interview"
              >
                <CalendarCheck size={18} className="nav-icon" />
                {!isSidebarCollapsed && <span>Mock Interviews</span>}
              </button>
              <button
                type="button"
                className={`portal-nav-item ${activeTab === 'certificates' ? 'active' : ''}`}
                onClick={() => handleTabClick('certificates')}
                title="Verified Completion Certificates"
              >
                <Award size={18} className="nav-icon" />
                {!isSidebarCollapsed && <span>Certificates</span>}
              </button>
            </>
          )}

          {/* ---------------- COACH ROLE MENU ---------------- */}
          {role === 'TEACHER' && (
            <>
              {!isSidebarCollapsed && <div className="nav-section-title">TEACHING STUDIO</div>}
              <button
                type="button"
                className={`portal-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => handleTabClick('dashboard')}
                title="Coach Dashboard"
              >
                <Layers size={18} className="nav-icon" />
                {!isSidebarCollapsed && <span>Dashboard</span>}
              </button>
              <button
                type="button"
                className={`portal-nav-item ${activeTab === 'batches' ? 'active' : ''}`}
                onClick={() => handleTabClick('batches')}
                title="Assigned Batches (Capped at 15)"
              >
                <Users2 size={18} className="nav-icon" />
                {!isSidebarCollapsed && (
                  <>
                    <span>My Batches</span>
                    <span className="nav-tag tag-cap">15 Cap</span>
                  </>
                )}
              </button>
              <button
                type="button"
                className={`portal-nav-item ${activeTab === 'live-classes' ? 'active' : ''}`}
                onClick={() => handleTabClick('live-classes')}
                title="Schedule & Launch Zoom Classes"
              >
                <Video size={18} className="nav-icon text-orange" />
                {!isSidebarCollapsed && <span>My Classes</span>}
              </button>
              <button
                type="button"
                className={`portal-nav-item ${activeTab === 'materials' ? 'active' : ''}`}
                onClick={() => handleTabClick('materials')}
                title="Upload & Manage Materials"
              >
                <FileCheck2 size={18} className="nav-icon" />
                {!isSidebarCollapsed && <span>Materials</span>}
              </button>

              {!isSidebarCollapsed && <div className="nav-section-title">STUDENT EVALUATION</div>}
              <button
                type="button"
                className={`portal-nav-item ${activeTab === 'students' ? 'active' : ''}`}
                onClick={() => handleTabClick('students')}
                title="My Students Directory"
              >
                <GraduationCap size={18} className="nav-icon" />
                {!isSidebarCollapsed && <span>My Students</span>}
              </button>
              <button
                type="button"
                className={`portal-nav-item ${activeTab === 'submissions' ? 'active' : ''}`}
                onClick={() => handleTabClick('submissions')}
                title="Review Assignments & Quizzes"
              >
                <FileCheck2 size={18} className="nav-icon" />
                {!isSidebarCollapsed && (
                  <>
                    <span>Submissions</span>
                    <span className="nav-tag tag-yellow">3 Pending</span>
                  </>
                )}
              </button>
              <button
                type="button"
                className={`portal-nav-item ${activeTab === 'questions' ? 'active' : ''}`}
                onClick={() => handleTabClick('questions')}
                title="Questions Inbox from Students"
              >
                <MessageSquareQuote size={18} className="nav-icon text-yellow" />
                {!isSidebarCollapsed && (
                  <>
                    <span>Question Inbox</span>
                    <span className="nav-tag tag-orange">1 New</span>
                  </>
                )}
              </button>
              <button
                type="button"
                className={`portal-nav-item ${activeTab === 'mock-interviews' ? 'active' : ''}`}
                onClick={() => handleTabClick('mock-interviews')}
                title="1-to-1 Mock Interview Schedule"
              >
                <CalendarCheck size={18} className="nav-icon" />
                {!isSidebarCollapsed && <span>Mock Interviews</span>}
              </button>
            </>
          )}

          {/* ---------------- ADMIN ROLE MENU ---------------- */}
          {role === 'ADMIN' && (
            <>
              {!isSidebarCollapsed && <div className="nav-section-title">ACADEMY GOVERNANCE</div>}
              <button
                type="button"
                className={`portal-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => handleTabClick('dashboard')}
                title="Executive Overview"
              >
                <ShieldCheck size={18} className="nav-icon" />
                {!isSidebarCollapsed && <span>Overview</span>}
              </button>
              <button
                type="button"
                className={`portal-nav-item ${activeTab === 'courses' ? 'active' : ''}`}
                onClick={() => handleTabClick('courses')}
                title="Course & Curriculum Builder"
              >
                <BookOpen size={18} className="nav-icon" />
                {!isSidebarCollapsed && <span>Courses</span>}
              </button>
              <button
                type="button"
                className={`portal-nav-item ${activeTab === 'batches' ? 'active' : ''}`}
                onClick={() => handleTabClick('batches')}
                title="Batch Capacity Management"
              >
                <Clock size={18} className="nav-icon text-orange" />
                {!isSidebarCollapsed && (
                  <>
                    <span>Batches (15 Cap)</span>
                    <span className="nav-tag tag-cap">Strict</span>
                  </>
                )}
              </button>

              {!isSidebarCollapsed && <div className="nav-section-title">PEOPLE &amp; FACULTY</div>}
              <button
                type="button"
                className={`portal-nav-item ${activeTab === 'students' ? 'active' : ''}`}
                onClick={() => handleTabClick('students')}
                title="Student Roster Management"
              >
                <GraduationCap size={18} className="nav-icon" />
                {!isSidebarCollapsed && <span>Students</span>}
              </button>
              <button
                type="button"
                className={`portal-nav-item ${activeTab === 'coaches' ? 'active' : ''}`}
                onClick={() => handleTabClick('coaches')}
                title="Faculty & Coach Management"
              >
                <Briefcase size={18} className="nav-icon" />
                {!isSidebarCollapsed && <span>Coaches</span>}
              </button>

              {!isSidebarCollapsed && <div className="nav-section-title">LEARNING OPERATIONS</div>}
              <button
                type="button"
                className={`portal-nav-item ${activeTab === 'classes' ? 'active' : ''}`}
                onClick={() => handleTabClick('classes')}
                title="Live Classes & Zoom Links"
              >
                <Video size={18} className="nav-icon text-orange" />
                {!isSidebarCollapsed && <span>Live Classes</span>}
              </button>
              <button
                type="button"
                className={`portal-nav-item ${activeTab === 'assignments' ? 'active' : ''}`}
                onClick={() => handleTabClick('assignments')}
                title="Assignments, Quizzes & Projects"
              >
                <FileCheck2 size={18} className="nav-icon" />
                {!isSidebarCollapsed && <span>Assessments</span>}
              </button>
              <button
                type="button"
                className={`portal-nav-item ${activeTab === 'questions' ? 'active' : ''}`}
                onClick={() => handleTabClick('questions')}
                title="Questions & Announcements"
              >
                <MessageSquareQuote size={18} className="nav-icon text-yellow" />
                {!isSidebarCollapsed && <span>Communication</span>}
              </button>

              {!isSidebarCollapsed && <div className="nav-section-title">CAREER &amp; METRICS</div>}
              <button
                type="button"
                className={`portal-nav-item ${activeTab === 'mock-interviews' ? 'active' : ''}`}
                onClick={() => handleTabClick('mock-interviews')}
                title="Mock Interview Audits"
              >
                <CalendarCheck size={18} className="nav-icon" />
                {!isSidebarCollapsed && <span>Mock Interviews</span>}
              </button>
              <button
                type="button"
                className={`portal-nav-item ${activeTab === 'certificates' ? 'active' : ''}`}
                onClick={() => handleTabClick('certificates')}
                title="Verified Certificate Issuance"
              >
                <Award size={18} className="nav-icon text-orange" />
                {!isSidebarCollapsed && <span>Certificates</span>}
              </button>
              <button
                type="button"
                className={`portal-nav-item ${activeTab === 'reviews' ? 'active' : ''}`}
                onClick={() => handleTabClick('reviews')}
                title="Student Reviews & Feedback Moderation"
              >
                <MessageSquareQuote size={18} className="nav-icon text-yellow" />
                {!isSidebarCollapsed && <span>Reviews Moderation</span>}
              </button>
              <button
                type="button"
                className={`portal-nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
                onClick={() => handleTabClick('analytics')}
                title="Academy Analytics & Audits"
              >
                <BarChart3 size={18} className="nav-icon text-blue" />
                {!isSidebarCollapsed && <span>Analytics</span>}
              </button>
              <button
                type="button"
                className={`portal-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => handleTabClick('settings')}
                title="Platform Settings & RBAC"
              >
                <Settings size={18} className="nav-icon" />
                {!isSidebarCollapsed && <span>Settings</span>}
              </button>
            </>
          )}
        </nav>

        {/* Sidebar Footer */}
        <div className="portal-sidebar-footer">
          <button
            type="button"
            className="btn-exit-to-site"
            onClick={() => onNavigateToPublic('home')}
            title="Return to Public Website"
          >
            <ExternalLink size={15} />
            {!isSidebarCollapsed && <span>Public Website</span>}
          </button>
        </div>
      </aside>

      {/* ====================================================================
          MAIN SURFACE (HEADER + CONTENT)
          ==================================================================== */}
      <div className="portal-surface">
        {/* Global Topbar Header */}
        <header className="portal-topbar">
          <div className="topbar-left-cluster">
            <button
              type="button"
              className="mobile-menu-trigger mobile-only"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open navigation menu"
            >
              <Menu size={20} />
            </button>

            <div className="topbar-page-info">
              <div className="topbar-breadcrumbs">
                <span>DP Skilltech</span>
                <ChevronRight size={13} className="crumb-arrow" />
                <span className="active-crumb-text">{roleBadgeLabel}</span>
              </div>
              <h1 className="topbar-main-title">{title}</h1>
              {subtitle && <p className="topbar-sub-title">{subtitle}</p>}
            </div>
          </div>

          <div className="topbar-right-cluster">
            {/* Quick Search Input */}
            <div className="topbar-search-box">
              <Search size={15} className="search-box-icon" />
              <input
                type="text"
                placeholder={
                  role === 'STUDENT'
                    ? 'Search courses, lessons, lab...'
                    : role === 'TEACHER'
                    ? 'Search students, questions, batches...'
                    : 'Search academy database...'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="topbar-search-input"
              />
            </div>

            {/* Notification Center */}
            <div className="topbar-dropdown-wrap" ref={notifRef}>
              <button
                type="button"
                className={`topbar-icon-btn ${isNotificationsOpen ? 'active' : ''}`}
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  setIsProfileMenuOpen(false);
                }}
                aria-label="Notifications"
                title="Notifications"
              >
                <Bell size={18} />
                {unreadCount > 0 && <span className="notif-badge-pill">{unreadCount}</span>}
              </button>

              {/* Notification Flyout Menu */}
              {isNotificationsOpen && (
                <div className="notifications-flyout">
                  <div className="flyout-header">
                    <div className="flyout-title-row">
                      <span className="flyout-title">Notifications</span>
                      {unreadCount > 0 && (
                        <button type="button" className="btn-mark-read" onClick={markAllAsRead}>
                          Mark all as read
                        </button>
                      )}
                    </div>
                    {/* Category Filter Chips */}
                    <div className="flyout-filter-chips">
                      <button
                        type="button"
                        className={`filter-chip ${notifFilter === 'all' ? 'active' : ''}`}
                        onClick={() => setNotifFilter('all')}
                      >
                        All
                      </button>
                      <button
                        type="button"
                        className={`filter-chip ${notifFilter === 'unread' ? 'active' : ''}`}
                        onClick={() => setNotifFilter('unread')}
                      >
                        Unread
                      </button>
                      <button
                        type="button"
                        className={`filter-chip ${notifFilter === 'class' ? 'active' : ''}`}
                        onClick={() => setNotifFilter('class')}
                      >
                        Classes
                      </button>
                      <button
                        type="button"
                        className={`filter-chip ${notifFilter === 'question' ? 'active' : ''}`}
                        onClick={() => setNotifFilter('question')}
                      >
                        Questions
                      </button>
                      <button
                        type="button"
                        className={`filter-chip ${notifFilter === 'mock' ? 'active' : ''}`}
                        onClick={() => setNotifFilter('mock')}
                      >
                        Mocks
                      </button>
                    </div>
                  </div>

                  <div className="flyout-list">
                    {filteredNotifications.length === 0 ? (
                      <div className="flyout-empty-state">
                        <CheckCircle2 size={24} className="empty-check-icon" />
                        <p>No notifications in this category.</p>
                      </div>
                    ) : (
                      filteredNotifications.map((item) => (
                        <div key={item.id} className={`flyout-item ${!item.isRead ? 'unread' : ''}`}>
                          <div className="item-indicator-dot" />
                          <div className="item-text-body">
                            <div className="item-header-row">
                              <strong className="item-headline">{item.title}</strong>
                              <span className="item-time">{item.timestamp}</span>
                            </div>
                            <p className="item-desc">{item.description}</p>
                            {item.meta && <span className="item-meta-badge">{item.meta}</span>}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="topbar-dropdown-wrap" ref={profileRef}>
              <button
                type="button"
                className="topbar-user-trigger"
                onClick={() => {
                  setIsProfileMenuOpen(!isProfileMenuOpen);
                  setIsNotificationsOpen(false);
                }}
                aria-label="User profile menu"
              >
                <div className="user-avatar-circle">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.fullName} />
                  ) : (
                    <User size={17} />
                  )}
                </div>
                <div className="user-text-info desktop-only">
                  <span className="user-name-text">{user?.fullName || 'Academic User'}</span>
                  <span className="user-role-subtext">{role}</span>
                </div>
              </button>

              {/* Profile Menu Dropdown */}
              {isProfileMenuOpen && (
                <div className="profile-flyout-menu">
                  <div className="profile-flyout-header">
                    <strong>{user?.fullName}</strong>
                    <span>{user?.email}</span>
                  </div>
                  <div className="profile-menu-links">
                    <button
                      type="button"
                      className="profile-menu-item"
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        handleTabClick('profile');
                      }}
                    >
                      <User size={16} />
                      <span>My Profile</span>
                    </button>
                    <button
                      type="button"
                      className="profile-menu-item"
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        handleTabClick('settings');
                      }}
                    >
                      <Settings size={16} />
                      <span>Settings</span>
                    </button>
                    <button
                      type="button"
                      className="profile-menu-item"
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onNavigateToPublic('contact');
                      }}
                    >
                      <HelpCircle size={16} />
                      <span>Help &amp; Support</span>
                    </button>
                  </div>
                  <div className="profile-menu-footer">
                    <button type="button" className="btn-profile-signout" onClick={handleSignOut}>
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Body View */}
        <main className="portal-main-canvas">{children}</main>

        {/* Mobile Bottom Navigation Bar */}
        <div className="mobile-bottom-nav mobile-only">
          <button
            type="button"
            className={`bottom-nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleTabClick('dashboard')}
          >
            <GraduationCap size={18} />
            <span>Overview</span>
          </button>
          {role === 'STUDENT' && (
            <>
              <button
                type="button"
                className={`bottom-nav-btn ${activeTab === 'classroom' ? 'active' : ''}`}
                onClick={() => handleTabClick('classroom')}
              >
                <BookOpen size={18} />
                <span>Classroom</span>
              </button>
              <button
                type="button"
                className={`bottom-nav-btn ${activeTab === 'coding-lab' ? 'active' : ''}`}
                onClick={() => handleTabClick('coding-lab')}
              >
                <Code2 size={18} />
                <span>Lab</span>
              </button>
              <button
                type="button"
                className={`bottom-nav-btn ${activeTab === 'ask-coach' ? 'active' : ''}`}
                onClick={() => handleTabClick('ask-coach')}
              >
                <MessageSquareQuote size={18} />
                <span>Coach</span>
              </button>
            </>
          )}
          {role === 'TEACHER' && (
            <>
              <button
                type="button"
                className={`bottom-nav-btn ${activeTab === 'batches' ? 'active' : ''}`}
                onClick={() => handleTabClick('batches')}
              >
                <Users2 size={18} />
                <span>Batches</span>
              </button>
              <button
                type="button"
                className={`bottom-nav-btn ${activeTab === 'questions' ? 'active' : ''}`}
                onClick={() => handleTabClick('questions')}
              >
                <MessageSquareQuote size={18} />
                <span>Inbox</span>
              </button>
            </>
          )}
          {role === 'ADMIN' && (
            <>
              <button
                type="button"
                className={`bottom-nav-btn ${activeTab === 'batches' ? 'active' : ''}`}
                onClick={() => handleTabClick('batches')}
              >
                <Clock size={18} />
                <span>15-Cap</span>
              </button>
              <button
                type="button"
                className={`bottom-nav-btn ${activeTab === 'students' ? 'active' : ''}`}
                onClick={() => handleTabClick('students')}
              >
                <GraduationCap size={18} />
                <span>Students</span>
              </button>
            </>
          )}
          <button
            type="button"
            className="bottom-nav-btn"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={18} />
            <span>More</span>
          </button>
        </div>
      </div>
    </div>
  );
};
