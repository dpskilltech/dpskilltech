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

  const [activePage, setActivePage] = useState<string>('home');
  const [pageParams, setPageParams] = useState<Record<string, string>>({});
  const [demoModalOpen, setDemoModalOpen] = useState<boolean>(false);
  const [demoCourseId, setDemoCourseId] = useState<string | undefined>(undefined);

  // Hash-based URL synchronizer for seamless navigation and back/forward browser support
  useEffect(() => {
    if (isLoading) return;

    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      if (!hash) {
        setActivePage('home');
        setPageParams({});
        return;
      }

      if (hash.startsWith('course/')) {
        const slug = hash.replace('course/', '');
        setActivePage('course-detail');
        setPageParams({ slug });
      } else if (hash.startsWith('verify-certificate/')) {
        const id = hash.replace('verify-certificate/', '');
        setActivePage('verify-certificate');
        setPageParams({ id });
      } else if (hash === 'admin' || hash.startsWith('admin/') || hash === 'admin-dashboard') {
        navigate('admin-dashboard');
      } else if (hash === 'super-admin' || hash.startsWith('super-admin/')) {
        navigate('admin-dashboard', { mode: 'super-admin' });
      } else if (hash === 'teacher' || hash.startsWith('teacher/') || hash === 'teacher-dashboard') {
        navigate('teacher-dashboard');
      } else if (hash === 'student' || hash.startsWith('student/') || hash === 'student-dashboard') {
        navigate('student-dashboard');
      } else if (hash === 'parent' || hash.startsWith('parent/') || hash === 'parent-dashboard') {
        navigate('parent-dashboard');
      } else {
        setActivePage(hash);
        setPageParams({});
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isLoading, isAuthenticated, role]);

  const navigate = (page: string, params?: Record<string, string>) => {
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
    } catch (_) {}

    // Role-Based Route Guard (Rule 15, 16, 32: Server & Client-side Protection)
    let nextParams = { ...(params || {}) };
    if ((page === 'student-dashboard' || page === 'student') && (!effectiveAuth || effectiveRole !== 'STUDENT')) {
      page = 'login';
      nextParams = { ...nextParams, error: 'Access Restricted: Please sign in with an enrolled Student account to access this portal.' };
    } else if ((page === 'teacher-dashboard' || page === 'teacher') && (!effectiveAuth || (effectiveRole !== 'TEACHER' && effectiveRole !== 'ADMIN' && effectiveRole !== 'SUPER_ADMIN'))) {
      page = 'login';
      nextParams = { ...nextParams, error: 'Access Restricted: Instructor credentials required to enter this studio.' };
    } else if ((page === 'admin-dashboard' || page === 'admin') && (!effectiveAuth || (effectiveRole !== 'ADMIN' && effectiveRole !== 'SUPER_ADMIN'))) {
      page = 'login';
      nextParams = { ...nextParams, error: 'Access Restricted: Administrator credentials required for Academy Governance.' };
    } else if (page === 'super-admin' && (!effectiveAuth || effectiveRole !== 'SUPER_ADMIN')) {
      page = 'login';
      nextParams = { ...nextParams, error: 'Access Restricted: Super Administrator credentials required.' };
    } else if (page === 'parent-dashboard' && (!effectiveAuth || effectiveRole !== 'PARENT')) {
      page = 'login';
      nextParams = { ...nextParams, error: 'Access Restricted: Please sign in with an authorized Parent account.' };
    }

    setActivePage(page);
    setPageParams(nextParams);

    if (page === 'home') {
      window.location.hash = '';
    } else if (page === 'course-detail' && nextParams?.slug) {
      window.location.hash = `course/${nextParams.slug}`;
    } else if (page === 'verify-certificate' && nextParams?.id) {
      window.location.hash = `verify-certificate/${nextParams.id}`;
    } else {
      window.location.hash = page;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
