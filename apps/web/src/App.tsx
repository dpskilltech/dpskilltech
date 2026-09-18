import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { BookDemoModal } from './components/common/BookDemoModal';
import { TerminalLoader } from './components/common/TerminalLoader';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { CoursesPage } from './pages/public/CoursesPage';
import { CourseDetailPage } from './pages/public/CourseDetailPage';
import { WhyChooseUsPage } from './pages/public/WhyChooseUsPage';
import { LearningPage } from './pages/public/LearningPage';
import { CareerSupportPage } from './pages/public/CareerSupportPage';
import { AboutPage } from './pages/public/AboutPage';
import { TrainersPage } from './pages/public/TrainersPage';
import { TestimonialsPage } from './pages/public/TestimonialsPage';
import { FAQPage } from './pages/public/FAQPage';
import { ContactPage } from './pages/public/ContactPage';
import { LoginPage } from './pages/public/LoginPage';
import { CertificatesPage } from './pages/public/CertificatesPage';
import { VerifyCertificatePage } from './pages/public/VerifyCertificatePage';

// Authenticated Portals (Rule 20: Clean separation of LMS from marketing site)
import { StudentDashboard } from './pages/student/StudentDashboard';
import { TeacherDashboard } from './pages/teacher/TeacherDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';

const AppContent: React.FC = () => {
  const { role, isAuthenticated, isLoading } = useAuth();

  // Helper to parse route and params from either HTML5 pathname or legacy hash
  const parseCurrentLocation = React.useCallback((): { page: string; params: Record<string, string> } => {
    const rawHash = window.location.hash.replace(/^#\/?/, '').trim();
    const rawPath = window.location.pathname.replace(/^\/+|\/+$/g, '').trim();

    // Prefer hash if present (for backward compatibility / anchor links), otherwise use pathname
    const target = rawHash || rawPath;

    if (!target) {
      return { page: 'home', params: {} };
    }

    // Courses directory or Course detail
    if (target === 'courses') {
      return { page: 'courses', params: {} };
    }
    if (target.startsWith('courses/') || target.startsWith('course/')) {
      const slug = target.replace(/^(courses|course)\//, '').trim();
      return { page: 'course-detail', params: { slug } };
    }

    // Certificate verification
    if (target === 'verify-certificate') {
      return { page: 'verify-certificate', params: {} };
    }
    if (target.startsWith('verify-certificate/')) {
      const id = target.replace('verify-certificate/', '').trim();
      return { page: 'verify-certificate', params: { id } };
    }

    // Portals & Admin routes
    if (target === 'admin' || target.startsWith('admin/') || target === 'admin-dashboard') {
      return { page: 'admin-dashboard', params: {} };
    }
    if (target === 'super-admin' || target.startsWith('super-admin/')) {
      return { page: 'admin-dashboard', params: { mode: 'super-admin' } };
    }
    if (target === 'teacher' || target.startsWith('teacher/') || target === 'teacher-dashboard') {
      return { page: 'teacher-dashboard', params: {} };
    }
    if (target === 'student' || target.startsWith('student/') || target === 'student-dashboard') {
      return { page: 'student-dashboard', params: {} };
    }
    if (target === 'parent' || target.startsWith('parent/') || target === 'parent-dashboard') {
      return { page: 'parent-dashboard', params: {} };
    }

    // Known public pages
    const publicPages = [
      'why-choose-us',
      'learning',
      'career-support',
      'about',
      'trainers',
      'testimonials',
      'faq',
      'contact',
      'login',
      'certificates'
    ];

    if (publicPages.includes(target)) {
      return { page: target, params: {} };
    }

    return { page: 'home', params: {} };
  }, []);

  const [activePage, setActivePage] = useState<string>(() => parseCurrentLocation().page);
  const [pageParams, setPageParams] = useState<Record<string, string>>(() => parseCurrentLocation().params);
  const [demoModalOpen, setDemoModalOpen] = useState<boolean>(false);
  const [demoCourseId, setDemoCourseId] = useState<string | undefined>(undefined);

  const navigate = React.useCallback((page: string, params?: Record<string, string>, pushState = true) => {
    // Immediate fallback to localStorage to avoid React state batching race conditions
    let effectiveRole = role;
    let effectiveAuth = isAuthenticated;
    try {
      const cachedProfile = localStorage.getItem('dpskilltech_user_profile');
      const cachedToken = localStorage.getItem('dpskilltech_auth_token');
      if (cachedProfile && cachedToken) {
        const parsed = JSON.parse(cachedProfile);
        if (parsed?.role) {
          effectiveRole = parsed.role;
          effectiveAuth = true;
        }
      }
    } catch {
      // Safe fallback
    }

    // Role-Based Route Guard (Rule 15, 16, 32: Server & Client-side Protection)
    let nextParams = { ...(params || {}) };
    let targetPage = page;
    if ((targetPage === 'student-dashboard' || targetPage === 'student') && (!effectiveAuth || effectiveRole !== 'STUDENT')) {
      targetPage = 'login';
      nextParams = { ...nextParams, error: 'Access Restricted: Please sign in with an enrolled Student account to access this portal.' };
    } else if ((targetPage === 'teacher-dashboard' || targetPage === 'teacher') && (!effectiveAuth || (effectiveRole !== 'TEACHER' && effectiveRole !== 'ADMIN' && effectiveRole !== 'SUPER_ADMIN'))) {
      targetPage = 'login';
      nextParams = { ...nextParams, error: 'Access Restricted: Instructor credentials required to enter this studio.' };
    } else if ((targetPage === 'admin-dashboard' || targetPage === 'admin') && (!effectiveAuth || (effectiveRole !== 'ADMIN' && effectiveRole !== 'SUPER_ADMIN'))) {
      targetPage = 'login';
      nextParams = { ...nextParams, error: 'Access Restricted: Administrator credentials required for Academy Governance.' };
    } else if (targetPage === 'super-admin' && (!effectiveAuth || effectiveRole !== 'SUPER_ADMIN')) {
      targetPage = 'login';
      nextParams = { ...nextParams, error: 'Access Restricted: Super Administrator credentials required.' };
    } else if (targetPage === 'parent-dashboard' && (!effectiveAuth || effectiveRole !== 'PARENT')) {
      targetPage = 'login';
      nextParams = { ...nextParams, error: 'Access Restricted: Please sign in with an authorized Parent account.' };
    }

    setActivePage(targetPage);
    setPageParams(nextParams);

    // Compute canonical URL path for history pushState
    let targetPath = '/';
    if (targetPage === 'home') {
      targetPath = '/';
    } else if (targetPage === 'course-detail' && nextParams?.slug) {
      targetPath = `/courses/${nextParams.slug}`;
    } else if (targetPage === 'verify-certificate' && nextParams?.id) {
      targetPath = `/verify-certificate/${nextParams.id}`;
    } else if (targetPage === 'admin-dashboard' && nextParams?.mode === 'super-admin') {
      targetPath = '/super-admin';
    } else if (targetPage === 'admin-dashboard') {
      targetPath = '/admin-dashboard';
    } else if (targetPage === 'teacher-dashboard') {
      targetPath = '/teacher-dashboard';
    } else if (targetPage === 'student-dashboard') {
      targetPath = '/student-dashboard';
    } else if (targetPage === 'parent-dashboard') {
      targetPath = '/parent-dashboard';
    } else {
      targetPath = `/${targetPage}`;
    }

    if (pushState && (window.location.pathname !== targetPath || window.location.hash)) {
      window.history.pushState({ page: targetPage, params: nextParams }, '', targetPath);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [role, isAuthenticated]);

  // Handle browser back/forward buttons and hash changes
  useEffect(() => {
    if (isLoading) return;

    const handleLocationChange = () => {
      const resolved = parseCurrentLocation();
      navigate(resolved.page, resolved.params, false);
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, [isLoading, parseCurrentLocation, navigate]);

  const openDemoModal = (courseId?: string) => {
    setDemoCourseId(courseId);
    setDemoModalOpen(true);
  };

  const closeDemoModal = () => {
    setDemoModalOpen(false);
    setDemoCourseId(undefined);
  };

  if (isLoading) {
    return <TerminalLoader fullscreen title="DP-Kernel" text="Initializing..." fast />;
  }

  // Rule 20: Keep public website and authenticated learning platform logically separated
  const isPortalView =
    activePage === 'student-dashboard' ||
    activePage === 'teacher-dashboard' ||
    activePage === 'admin-dashboard';


  if (isPortalView) {
    return (
      <div className="portal-container-root">
        {activePage === 'student-dashboard' && (
          <StudentDashboard onNavigateToPublic={navigate} />
        )}
        {activePage === 'teacher-dashboard' && (
          <TeacherDashboard onNavigateToPublic={navigate} />
        )}
        {activePage === 'admin-dashboard' && (
          <AdminDashboard onNavigateToPublic={navigate} />
        )}
      </div>
    );
  }

  return (
    <div className="app-shell">
      {/* Universal Public Navigation */}
      <Navbar
        activePage={activePage}
        onNavigate={navigate}
        onOpenDemoModal={openDemoModal}
      />

      {/* Dynamic Public Page Router */}
      <main className="main-content">
        {activePage === 'home' && (
          <HomePage onNavigate={navigate} onOpenDemoModal={openDemoModal} />
        )}
        {activePage === 'courses' && (
          <CoursesPage onNavigate={navigate} onOpenDemoModal={openDemoModal} />
        )}
        {activePage === 'course-detail' && (
          <CourseDetailPage
            slug={pageParams.slug || 'full-stack-python-ai'}
            onNavigate={navigate}
            onOpenDemoModal={openDemoModal}
          />
        )}
        {activePage === 'why-choose-us' && (
          <WhyChooseUsPage onNavigate={navigate} onOpenDemoModal={openDemoModal} />
        )}
        {activePage === 'learning' && (
          <LearningPage onNavigate={navigate} onOpenDemoModal={openDemoModal} />
        )}
        {activePage === 'career-support' && (
          <CareerSupportPage onNavigate={navigate} onOpenDemoModal={openDemoModal} />
        )}
        {activePage === 'about' && (
          <AboutPage onNavigate={navigate} onOpenDemoModal={openDemoModal} />
        )}
        {activePage === 'trainers' && (
          <TrainersPage onNavigate={navigate} onOpenDemoModal={openDemoModal} />
        )}
        {activePage === 'testimonials' && (
          <TestimonialsPage onNavigate={navigate} onOpenDemoModal={openDemoModal} />
        )}
        {activePage === 'faq' && (
          <FAQPage onOpenDemoModal={openDemoModal} />
        )}
        {activePage === 'contact' && (
          <ContactPage onOpenDemoModal={openDemoModal} />
        )}
        {activePage === 'login' && (
          <LoginPage
            onNavigate={navigate}
            onOpenDemoModal={openDemoModal}
            initialError={pageParams.error}
          />
        )}
        {activePage === 'certificates' && (
          <CertificatesPage onNavigate={navigate} onOpenDemoModal={openDemoModal} />
        )}
        {activePage === 'verify-certificate' && (
          <VerifyCertificatePage initialCertificateId={pageParams.id} onNavigate={navigate} />
        )}
      </main>

      {/* Universal Public Footer */}
      <Footer onNavigate={navigate} onOpenDemoModal={openDemoModal} />

      {/* Global Interactive Demo Reservation Modal */}
      <BookDemoModal
        isOpen={demoModalOpen}
        onClose={closeDemoModal}
        preselectedCourseId={demoCourseId}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
