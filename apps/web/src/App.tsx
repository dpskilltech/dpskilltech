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
      } else {
        setActivePage(hash);
        setPageParams({});
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (page: string, params?: Record<string, string>) => {
    // Role-Based Route Guard (Rule 15 & 16)
    if (page === 'student-dashboard' && (!isAuthenticated || role !== 'STUDENT')) {
      alert('Access Restricted: Please log in with a Student account to access this portal.');
      page = 'login';
    } else if (page === 'teacher-dashboard' && (!isAuthenticated || (role !== 'TEACHER' && role !== 'ADMIN'))) {
      alert('Access Restricted: Instructor credentials required to enter this studio.');
      page = 'login';
    } else if (page === 'admin-dashboard' && (!isAuthenticated || role !== 'ADMIN')) {
      alert('Access Restricted: Administrator credentials required for Academy Governance.');
      page = 'login';
    }

    setActivePage(page);
    setPageParams(params || {});

    if (page === 'home') {
      window.location.hash = '';
    } else if (page === 'course-detail' && params?.slug) {
      window.location.hash = `course/${params.slug}`;
    } else if (page === 'verify-certificate' && params?.id) {
      window.location.hash = `verify-certificate/${params.id}`;
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
          <LoginPage onNavigate={navigate} onOpenDemoModal={openDemoModal} />
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
