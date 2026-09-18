import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  ArrowRight,
  User,
  Sparkles,
  ChevronDown,
  Phone,
  MessageSquare
} from 'lucide-react';
import './Navbar.css';
import { COURSES_DATA } from '../../data/coursesData';
import { useAuth } from '../../context/AuthContext';
import brandLogo from '../../assets/dp-skilltech-logo-transparent.png';

interface NavbarProps {
  activePage: string;
  onNavigate: (page: string, params?: Record<string, string>) => void;
  onOpenDemoModal: (courseId?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  onNavigate,
  onOpenDemoModal
}) => {
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [coursesDropdownOpen, setCoursesDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (page: string, params?: Record<string, string>) => {
    onNavigate(page, params);
    setMobileMenuOpen(false);
    setCoursesDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Top Admissions & Helpline Strip (Inspired by Quality Thought & Byju's) */}
      <div className="nav-announcement-strip">
        <div className="container announcement-inner">
          <div className="announcement-left">
            <span className="live-pulse-dot" />
            <span className="announcement-tag">ADMISSIONS OPEN:</span>
            <span className="announcement-text">
              Strict 15-Student Batches • 6 Days a Week Live on Zoom • 1-on-1 Mock Interviews
            </span>
          </div>
          <div className="announcement-right">
            <a href="tel:+919876543210" className="announcement-link">
              <Phone size={12} />
              <span>+91 98765 43210</span>
            </a>
            <span className="announcement-sep">•</span>
            <a
              href="https://wa.me/919876543210?text=Hi%20DP%20Skilltech,%20I%20want%20to%20know%20about%20the%2015-student%20live%20batches."
              target="_blank"
              rel="noopener noreferrer"
              className="announcement-link whatsapp-link"
            >
              <MessageSquare size={12} />
              <span>WhatsApp</span>
            </a>
            <span className="announcement-sep">•</span>
            <span className="announcement-badge">Strict 15 Cap</span>
          </div>
        </div>
      </div>

      {/* Main Luxury Navigation Bar */}
      <header className={`navbar-wrapper ${isScrolled ? 'navbar-scrolled' : 'navbar-top'}`}>
        <div className="container nav-inner">
          {/* Brand Logo */}
          <a
            href="/"
            className="brand-link"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('home');
            }}
            aria-label="DP Skill Tech Home"
          >
            <img
              src={brandLogo}
              alt="DP Skill Tech - Learn. Build. Grow."
              className="brand-logo-img"
            />
          </a>

          {/* Desktop Navigation Links */}
          <nav className="desktop-menu" aria-label="Main Navigation">
            <a
              href="/"
              className={`menu-item ${activePage === 'home' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('home');
              }}
            >
              Home
            </a>

            {/* Courses Dropdown */}
            <div
              className="menu-dropdown-container"
              onMouseEnter={() => setCoursesDropdownOpen(true)}
              onMouseLeave={() => setCoursesDropdownOpen(false)}
            >
              <a
                href="/courses"
                className={`menu-item dropdown-btn ${activePage === 'courses' || activePage === 'course-detail' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('courses');
                }}
              >
                <span>Courses</span>
                <ChevronDown size={14} className={`dropdown-arrow ${coursesDropdownOpen ? 'rotated' : ''}`} />
              </a>

              {coursesDropdownOpen && (
                <div className="courses-dropdown-panel">
                  <div className="dropdown-panel-header">
                    <span className="panel-category-title">Core Engineering Tracks (Max 15 / Batch)</span>
                    <a
                      href="/courses"
                      className="panel-all-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavClick('courses');
                      }}
                    >
                      All 5 Curricula &rarr;
                    </a>
                  </div>
                  <div className="dropdown-panel-grid">
                    {COURSES_DATA.map((course) => (
                      <a
                        key={course.id}
                        href={`/courses/${course.slug}`}
                        className="dropdown-course-item"
                        onClick={(e) => {
                          e.preventDefault();
                          handleNavClick('course-detail', { slug: course.slug });
                        }}
                      >
                        <div className="dropdown-course-title">{course.title}</div>
                        <div className="dropdown-course-meta">
                          <span>{course.duration}</span> • <span>{course.batchSize}</span> • <span className="meta-accent">Live Zoom</span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <a
              href="/learning"
              className={`menu-item ${activePage === 'learning' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('learning');
              }}
            >
              Learning
            </a>

            <a
              href="/career-support"
              className={`menu-item ${activePage === 'career-support' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('career-support');
              }}
            >
              Career &amp; Mocks
            </a>

            <a
              href="/why-choose-us"
              className={`menu-item ${activePage === 'why-choose-us' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('why-choose-us');
              }}
            >
              Why Us
            </a>

            <a
              href="/certificates"
              className={`menu-item ${activePage === 'certificates' || activePage === 'verify-certificate' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('certificates');
              }}
            >
              Certificates
            </a>

            <a
              href="/about"
              className={`menu-item ${activePage === 'about' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('about');
              }}
            >
              About
            </a>

            <a
              href="/contact"
              className={`menu-item ${activePage === 'contact' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('contact');
              }}
            >
              Contact
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="nav-right-actions">
            {user ? (
              <button
                className="btn-premium btn-premium-secondary btn-sm nav-auth-badge"
                onClick={() => {
                  if (user.role === 'STUDENT') handleNavClick('student-dashboard');
                  else if (user.role === 'TEACHER') handleNavClick('teacher-dashboard');
                  else if (user.role === 'ADMIN') handleNavClick('admin-dashboard');
                }}
                title={`Logged in as ${user.fullName} (${user.role}). Click to open LMS Workspace.`}
              >
                <div className="nav-user-avatar-mini">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.fullName} />
                  ) : (
                    <User size={14} />
                  )}
                </div>
                <span>{user.fullName.split(' ')[0]}</span>
                <span className="nav-role-pill">{user.role}</span>
              </button>
            ) : (
              <button
                className="btn-premium btn-premium-secondary btn-sm"
                onClick={() => handleNavClick('login')}
              >
                <User size={15} />
                <span>Student Login</span>
              </button>
            )}

            <button
              className="btn-premium btn-premium-primary btn-sm btn-glow"
              onClick={() => onOpenDemoModal()}
            >
              <Sparkles size={15} />
              <span>Book Free Demo</span>
            </button>

            {/* Mobile Hamburger Trigger */}
            <button
              className="mobile-menu-trigger"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Luxury Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-nav-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-drawer-header">
              <a
                href="/"
                className="brand-link"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('home');
                }}
                aria-label="DP Skill Tech Home"
              >
                <img
                  src={brandLogo}
                  alt="DP Skill Tech - Learn. Build. Grow."
                  className="brand-logo-img brand-logo-mobile"
                />
              </a>
              <button className="mobile-close-btn" onClick={() => setMobileMenuOpen(false)}>
                <X size={22} />
              </button>
            </div>

            {/* Quick Contact Row in Mobile Drawer */}
            <div className="mobile-drawer-contact-bar">
              <a href="tel:+919876543210" className="mobile-contact-chip">
                <Phone size={14} />
                <span>Call Admissions</span>
              </a>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="mobile-contact-chip whatsapp-chip"
              >
                <MessageSquare size={14} />
                <span>WhatsApp</span>
              </a>
            </div>

            <div className="mobile-nav-links">
              <a
                href="/"
                className={`mobile-nav-link ${activePage === 'home' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('home');
                }}
              >
                Home
              </a>
              <a
                href="/courses"
                className={`mobile-nav-link ${activePage === 'courses' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('courses');
                }}
              >
                Courses Catalog (5 Tracks)
              </a>
              <div className="mobile-subcourses">
                {COURSES_DATA.map((c) => (
                  <a
                    key={c.id}
                    href={`/courses/${c.slug}`}
                    className="mobile-subcourse-link"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick('course-detail', { slug: c.slug });
                    }}
                  >
                    <span>{c.title}</span>
                    <ArrowRight size={13} />
                  </a>
                ))}
              </div>
              <a
                href="/learning"
                className={`mobile-nav-link ${activePage === 'learning' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('learning');
                }}
              >
                Learning Engine &amp; Labs
              </a>
              <a
                href="/career-support"
                className={`mobile-nav-link ${activePage === 'career-support' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('career-support');
                }}
              >
                1-on-1 Mock Interviews
              </a>
              <a
                href="/why-choose-us"
                className={`mobile-nav-link ${activePage === 'why-choose-us' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('why-choose-us');
                }}
              >
                Why DP Skill Tech (15 Cap)
              </a>
              <a
                href="/certificates"
                className={`mobile-nav-link ${activePage === 'certificates' || activePage === 'verify-certificate' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('certificates');
                }}
              >
                Certificates &amp; Verification
              </a>
              <a
                href="/about"
                className={`mobile-nav-link ${activePage === 'about' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('about');
                }}
              >
                About Us
              </a>
              <a
                href="/contact"
                className={`mobile-nav-link ${activePage === 'contact' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('contact');
                }}
              >
                Contact Admissions
              </a>
            </div>

            <div className="mobile-drawer-footer">
              <button
                className="btn-premium btn-premium-primary w-100 mb-2"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenDemoModal();
                }}
              >
                <Sparkles size={16} />
                <span>Book Free Live Demo</span>
              </button>
              <button
                className="btn-premium btn-premium-secondary w-100"
                onClick={() => handleNavClick(user ? (user.role === 'STUDENT' ? 'student-dashboard' : user.role === 'TEACHER' ? 'teacher-dashboard' : 'admin-dashboard') : 'login')}
              >
                <User size={16} />
                <span>{user ? `Open ${user.role} Portal` : 'Student Portal Login'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Mobile Bottom Bar (Inspired by Quality Thought & Byju's) */}
      <div className="mobile-sticky-bottom-bar" aria-label="Mobile Quick Actions">
        <a href="tel:+919876543210" className="sticky-mobile-btn sticky-call">
          <Phone size={16} />
          <span>Call</span>
        </a>
        <a
          href="https://wa.me/919876543210?text=Hello%20DP%20Skilltech,%20I%20would%20like%20to%20know%20about%20upcoming%20live%20batches."
          target="_blank"
          rel="noopener noreferrer"
          className="sticky-mobile-btn sticky-whatsapp"
        >
          <MessageSquare size={16} />
          <span>WhatsApp</span>
        </a>
        <button
          className="sticky-mobile-btn sticky-demo-cta"
          onClick={() => onOpenDemoModal()}
        >
          <span className="live-dot-pulse"></span>
          <span>Book Free Demo</span>
        </button>
      </div>
    </>
  );
};
