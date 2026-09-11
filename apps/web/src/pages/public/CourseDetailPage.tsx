import React, { useState } from 'react';
import {
  Clock,
  Users,
  Calendar,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  FileCheck,
  Award,
  Video,
  Code2,
  Briefcase
} from 'lucide-react';
import './CourseDetailPage.css';
import { getCourseBySlug, COURSES_DATA } from '../../data/coursesData';

interface CourseDetailPageProps {
  slug: string;
  onNavigate: (page: string, params?: Record<string, string>) => void;
  onOpenDemoModal: (courseId?: string) => void;
}

export const CourseDetailPage: React.FC<CourseDetailPageProps> = ({
  slug,
  onNavigate,
  onOpenDemoModal
}) => {
  const course = getCourseBySlug(slug) || COURSES_DATA[0];

  // Accordion open states (default first module open)
  const [openModules, setOpenModules] = useState<Record<string, boolean>>({
    [course.modules[0]?.id || '']: true
  });

  const toggleModule = (id: string) => {
    setOpenModules((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="course-detail-page">
      {/* Top Breadcrumb & Hero */}
      <section className="course-hero">
        <div className="container">
          <div className="breadcrumb">
            <button className="breadcrumb-link" onClick={() => onNavigate('home')}>Home</button>
            <span>/</span>
            <button className="breadcrumb-link" onClick={() => onNavigate('courses')}>Courses</button>
            <span>/</span>
            <span className="breadcrumb-current">{course.title}</span>
          </div>

          <div className="course-hero-grid">
            <div className="course-hero-main">
              <div className="hero-badge-row">
                <span className="course-badge">{course.badge}</span>
                <span className="category-pill">{course.category}</span>
                <span className="course-fee-pill">{course.feeNote}</span>
              </div>

              <h1 className="course-detail-title">{course.title}</h1>
              <p className="course-detail-lead">{course.fullDesc}</p>

              {/* Fast Fact Cards */}
              <div className="fast-facts-row">
                <div className="fact-item">
                  <Clock size={18} className="fact-icon" />
                  <div>
                    <div className="fact-label">Duration</div>
                    <div className="fact-value">{course.duration}</div>
                  </div>
                </div>

                <div className="fact-item">
                  <Users size={18} className="fact-icon" />
                  <div>
                    <div className="fact-label">Batch Size</div>
                    <div className="fact-value">{course.batchSize}</div>
                  </div>
                </div>

                <div className="fact-item">
                  <Calendar size={18} className="fact-icon" />
                  <div>
                    <div className="fact-label">Schedule</div>
                    <div className="fact-value">{course.schedule}</div>
                  </div>
                </div>

                <div className="fact-item">
                  <Video size={18} className="fact-icon" />
                  <div>
                    <div className="fact-label">Live Platform</div>
                    <div className="fact-value">Interactive Zoom Room</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky Enrollment Action Box */}
            <div className="course-hero-card">
              <div className="enroll-card">
                <div className="enroll-card-header">
                  <span className="enroll-tag">Next Live Batch Forming</span>
                  <h3 className="enroll-title">Join Intimate 15-Student Batch</h3>
                  <div className="batch-status-banner">
                    <Users size={15} />
                    <span>Seats Capped at 15 • First Come, First Reserved</span>
                  </div>
                </div>

                <div className="enroll-features-list">
                  <div className="enroll-feat">
                    <CheckCircle2 size={16} className="feat-icon" />
                    <span>6 Days a Week Live Training (1.5h Daily)</span>
                  </div>
                  <div className="enroll-feat">
                    <CheckCircle2 size={16} className="feat-icon" />
                    <span>{course.mockInterviewsCount} Private 1-on-1 Live Mock Interviews</span>
                  </div>
                  <div className="enroll-feat">
                    <CheckCircle2 size={16} className="feat-icon" />
                    <span>Integrated Online Coding Lab Practice</span>
                  </div>
                  <div className="enroll-feat">
                    <CheckCircle2 size={16} className="feat-icon" />
                    <span>{course.projectsCount} Full Production Capstone Projects</span>
                  </div>
                  <div className="enroll-feat">
                    <CheckCircle2 size={16} className="feat-icon" />
                    <span>Verifiable DP Skilltech Certification</span>
                  </div>
                </div>

                <div className="enroll-actions">
                  <button
                    className="btn btn-primary btn-lg w-100"
                    onClick={() => onOpenDemoModal(course.id)}
                  >
                    <Sparkles size={18} />
                    <span>Book a Free Live Demo</span>
                  </button>
                  <span className="enroll-guarantee">
                    🛡️ Attend 1 free live class before committing. Zero risk.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="section-py course-content-section">
        <div className="container content-grid">
          <div className="content-left">
            {/* Syllabus Curriculum */}
            <div className="syllabus-box">
              <div className="syllabus-header">
                <div>
                  <span className="section-tag">Comprehensive Syllabus</span>
                  <h2 className="syllabus-title">Curriculum & Module Breakdown</h2>
                </div>
                <span className="module-count-badge">{course.modules.length} Detailed Modules</span>
              </div>

              <div className="modules-accordion">
                {course.modules.map((mod, index) => {
                  const isOpen = !!openModules[mod.id];
                  return (
                    <div key={mod.id} className={`module-item ${isOpen ? 'open' : ''}`}>
                      <div
                        className="module-header"
                        onClick={() => toggleModule(mod.id)}
                      >
                        <div className="module-title-wrap">
                          <span className="module-number">0{index + 1}</span>
                          <div>
                            <h4 className="module-title">{mod.title}</h4>
                            <div className="module-meta-row">
                              <span className="module-dur">{mod.duration}</span>
                              {mod.hasLab && <span className="mod-badge badge-lab"><Code2 size={12} /> Lab Included</span>}
                              {mod.hasQuiz && <span className="mod-badge badge-quiz"><FileCheck size={12} /> Quiz</span>}
                              {mod.hasProject && <span className="mod-badge badge-proj"><Award size={12} /> Project</span>}
                            </div>
                          </div>
                        </div>
                        <ChevronDown size={20} className={`chevron-icon ${isOpen ? 'rotated' : ''}`} />
                      </div>

                      {isOpen && (
                        <div className="module-body">
                          <p className="module-summary">{mod.summary}</p>
                          <div className="module-topics-list">
                            <span className="topics-heading">Key Topics Covered:</span>
                            <ul>
                              {mod.topics.map((t, idx) => (
                                <li key={idx}>
                                  <CheckCircle2 size={14} className="topic-bullet" />
                                  <span>{t}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Skills & Tools Section */}
            <div className="tech-stack-box card mt-4">
              <h3 className="sub-heading">Tools & Technologies You Will Master</h3>
              <div className="tech-tags-list">
                {course.skills.map((skill, i) => (
                  <span key={i} className="tech-tag primary">{skill}</span>
                ))}
                {course.tools.map((tool, i) => (
                  <span key={i} className="tech-tag secondary">{tool}</span>
                ))}
              </div>
            </div>

            {/* Career Opportunities */}
            <div className="career-roles-box card mt-4">
              <h3 className="sub-heading">Career Roles You Can Apply For</h3>
              <p className="roles-desc">
                Graduating from this program equips you for high-impact software roles across startups, product enterprises, and technology consulting firms:
              </p>
              <div className="roles-grid">
                {course.careerRoles.map((role, idx) => (
                  <div key={idx} className="role-item">
                    <Briefcase size={16} className="role-icon" />
                    <span>{role}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Prerequisites */}
            <div className="prerequisites-box card mt-4">
              <h3 className="sub-heading">Prerequisites & Target Audience</h3>
              <ul className="prereq-list">
                {course.prerequisites.map((p, idx) => (
                  <li key={idx}>
                    <CheckCircle2 size={15} className="text-emerald" />
                    <span>{p}</span>
                  </li>
                ))}
                <li>
                  <CheckCircle2 size={15} className="text-emerald" />
                  <span>Ideal for: Engineering students, BCA/MCA graduates, working IT professionals upskilling in AI, and career switchers.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="content-right">
            <div className="sidebar-card card">
              <h4>1-on-1 Mock Interview Format</h4>
              <p className="sidebar-text">
                Every enrolled student participates in private 1-to-1 live mock interviews for this track:
              </p>
              <div className="mock-steps">
                <div className="mock-step">
                  <strong>1. Slot Booking:</strong> Pick a convenient time slot from your learning dashboard.
                </div>
                <div className="mock-step">
                  <strong>2. Live Session:</strong> 1-on-1 private Zoom interview with live code screening and problem-solving.
                </div>
                <div className="mock-step">
                  <strong>3. Detailed Feedback:</strong> Receive an objective scorecard, technical strengths breakdown, and improvement tips.
                </div>
              </div>
              <button
                className="btn btn-primary btn-sm w-100 mt-3"
                onClick={() => onOpenDemoModal(course.id)}
              >
                Register for Free Demo
              </button>
            </div>

            <div className="sidebar-card card mt-4">
              <h4>Need Custom Guidance?</h4>
              <p className="sidebar-text">
                Unsure if this curriculum fits your current experience level? Speak directly with our lead academic counselor.
              </p>
              <button
                className="btn btn-secondary btn-sm w-100"
                onClick={() => onNavigate('contact')}
              >
                Contact Admissions Team
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
