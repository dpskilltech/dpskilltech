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
  Briefcase,
  Cpu,
  ShieldCheck,
  Zap,
  Check,
  ArrowRight,
  Terminal,
  HelpCircle
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

  // Accordion open states (default first 2 modules open for better visibility)
  const [openModules, setOpenModules] = useState<Record<string, boolean>>({
    [course.modules[0]?.id || '']: true,
    [course.modules[1]?.id || '']: false
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
                <span className="course-badge">
                  <Sparkles size={13} />
                  <span>{course.badge}</span>
                </span>
                <span className="category-pill">{course.category}</span>
                <span className="course-fee-pill">{course.feeNote}</span>
              </div>

              <h1 className="course-detail-title">
                {course.title}
              </h1>

              <p className="course-detail-lead">
                {course.fullDesc}
              </p>

              {/* Eye-catching Program Pillars / Bullet Callouts */}
              <div className="hero-pillars-card">
                <h4 className="pillars-title">Program Highlights &amp; Core Pillars:</h4>
                <div className="pillars-grid">
                  <div className="pillar-item">
                    <div className="pillar-icon-box icon-orange">
                      <Zap size={18} />
                    </div>
                    <div className="pillar-text">
                      <strong>Full Stack Production Architecture</strong>
                      <p>Master Python 3.12, FastAPI async backends, PostgreSQL pooling &amp; modern React frontends.</p>
                    </div>
                  </div>

                  <div className="pillar-item">
                    <div className="pillar-icon-box icon-blue">
                      <Cpu size={18} />
                    </div>
                    <div className="pillar-text">
                      <strong>Applied Generative AI &amp; LLM Systems</strong>
                      <p>Integrate vector embeddings, LangChain RAG pipelines, and agentic workflows into enterprise backends.</p>
                    </div>
                  </div>

                  <div className="pillar-item">
                    <div className="pillar-icon-box icon-green">
                      <ShieldCheck size={18} />
                    </div>
                    <div className="pillar-text">
                      <strong>Strict 15-Student Batch Cap</strong>
                      <p>Small intimate cohort ensures immediate instructor interaction and zero mass-lecture dilution.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fast Fact Cards */}
              <div className="fast-facts-row">
                <div className="fact-item">
                  <Clock size={20} className="fact-icon text-orange" />
                  <div>
                    <div className="fact-label">Duration</div>
                    <div className="fact-value">{course.duration}</div>
                  </div>
                </div>

                <div className="fact-item">
                  <Users size={20} className="fact-icon text-blue" />
                  <div>
                    <div className="fact-label">Cohort Size</div>
                    <div className="fact-value">{course.batchSize}</div>
                  </div>
                </div>

                <div className="fact-item">
                  <Calendar size={20} className="fact-icon text-green" />
                  <div>
                    <div className="fact-label">Class Schedule</div>
                    <div className="fact-value">{course.schedule}</div>
                  </div>
                </div>

                <div className="fact-item">
                  <Video size={20} className="fact-icon text-yellow" />
                  <div>
                    <div className="fact-label">Learning Platform</div>
                    <div className="fact-value">Live Zoom + Sandboxed Lab</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky Enrollment Action Box */}
            <div className="course-hero-card">
              <div className="enroll-card">
                <div className="enroll-card-header">
                  <span className="enroll-tag">
                    <span className="pulse-dot"></span>
                    <span>Next Live Batch Forming</span>
                  </span>
                  <h3 className="enroll-title">Join Intimate 15-Student Batch</h3>
                  <div className="batch-status-banner">
                    <Users size={16} />
                    <span>Strictly Capped at 15 • First Come, First Reserved</span>
                  </div>
                </div>

                {/* Structured High-Impact Bullet Points */}
                <div className="enroll-features-list">
                  <div className="enroll-feat">
                    <div className="feat-check-wrap">
                      <Check size={14} />
                    </div>
                    <div className="feat-copy">
                      <strong>6 Days / Week Live Training:</strong> 90 minutes daily live instructor-led session with instant doubt resolution.
                    </div>
                  </div>

                  <div className="enroll-feat">
                    <div className="feat-check-wrap">
                      <Check size={14} />
                    </div>
                    <div className="feat-copy">
                      <strong>{course.mockInterviewsCount} Private 1-on-1 Mock Interviews:</strong> Dedicated 1-to-1 video defenses with senior tech leads &amp; rubric scorecards.
                    </div>
                  </div>

                  <div className="enroll-feat">
                    <div className="feat-check-wrap">
                      <Check size={14} />
                    </div>
                    <div className="feat-copy">
                      <strong>Online Sandboxed Coding Lab:</strong> In-browser dual-panel IDE for immediate code execution &amp; automated test feedback.
                    </div>
                  </div>

                  <div className="enroll-feat">
                    <div className="feat-check-wrap">
                      <Check size={14} />
                    </div>
                    <div className="feat-copy">
                      <strong>{course.projectsCount} Production Capstone Projects:</strong> Real-world GitHub repositories with CI/CD passing, ready for recruiters.
                    </div>
                  </div>

                  <div className="enroll-feat">
                    <div className="feat-check-wrap">
                      <Check size={14} />
                    </div>
                    <div className="feat-copy">
                      <strong>Verifiable Certificate:</strong> Globally verifiable DP Skilltech credential with unique verification ID.
                    </div>
                  </div>
                </div>

                <div className="enroll-actions">
                  <button
                    className="btn btn-primary btn-lg w-100 btn-enroll-cta"
                    onClick={() => onOpenDemoModal(course.id)}
                  >
                    <Sparkles size={18} />
                    <span>Book a Free Live Demo Class</span>
                  </button>
                  <span className="enroll-guarantee">
                    🛡️ Attend 1 free live class with the coach before enrolling. Zero cost, no commitment.
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
                  <h2 className="syllabus-title">Curriculum &amp; Module Breakdown</h2>
                  <p className="syllabus-subtitle">
                    Step-by-step engineering progression designed to take you from foundational syntax to enterprise microservices and deployed AI solutions.
                  </p>
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
                              {mod.hasProject && <span className="mod-badge badge-proj"><Award size={12} /> Capstone</span>}
                            </div>
                          </div>
                        </div>
                        <ChevronDown size={20} className={`chevron-icon ${isOpen ? 'rotated' : ''}`} />
                      </div>

                      {isOpen && (
                        <div className="module-body">
                          <div className="module-objective-callout">
                            <strong>Module Focus:</strong> {mod.summary}
                          </div>

                          <div className="module-topics-section">
                            <span className="topics-heading">Key Technical Competencies:</span>
                            <div className="topics-bullets-grid">
                              {mod.topics.map((t, idx) => (
                                <div key={idx} className="topic-bullet-card">
                                  <CheckCircle2 size={16} className="topic-bullet-icon" />
                                  <span>{t}</span>
                                </div>
                              ))}
                            </div>
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
              <div className="box-header-row">
                <Terminal size={22} className="text-orange" />
                <div>
                  <h3 className="sub-heading">Tools &amp; Technologies You Will Master</h3>
                  <p className="sub-heading-desc">Master industry-standard development toolchains and modern cloud frameworks:</p>
                </div>
              </div>

              <div className="tech-categories-stack">
                <div className="tech-category-group">
                  <span className="tech-group-label">Core Languages &amp; Frameworks:</span>
                  <div className="tech-tags-list">
                    {course.skills.map((skill, i) => (
                      <span key={i} className="tech-tag primary">{skill}</span>
                    ))}
                  </div>
                </div>

                <div className="tech-category-group">
                  <span className="tech-group-label">Developer Environments &amp; Infrastructure:</span>
                  <div className="tech-tags-list">
                    {course.tools.map((tool, i) => (
                      <span key={i} className="tech-tag secondary">{tool}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Career Opportunities */}
            <div className="career-roles-box card mt-4">
              <div className="box-header-row">
                <Briefcase size={22} className="text-blue" />
                <div>
                  <h3 className="sub-heading">Career Roles You Can Target</h3>
                  <p className="roles-desc">
                    Completing this track prepares you for high-impact engineering roles across startups, product companies, and technology consultancies:
                  </p>
                </div>
              </div>

              <div className="roles-cards-grid">
                {course.careerRoles.map((role, idx) => (
                  <div key={idx} className="role-card-pro">
                    <div className="role-card-top">
                      <Briefcase size={18} className="role-icon" />
                      <h4>{role}</h4>
                    </div>
                    <ul className="role-bullets">
                      <li>Full lifecycle development &amp; microservice orchestration</li>
                      <li>REST API contracts, schema validation &amp; DB tuning</li>
                      <li>Integrated AI solutions &amp; production cloud deployment</li>
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Prerequisites & Eligibility */}
            <div className="prerequisites-box card mt-4">
              <div className="box-header-row">
                <HelpCircle size={22} className="text-green" />
                <div>
                  <h3 className="sub-heading">Prerequisites &amp; Target Audience</h3>
                  <p className="sub-heading-desc">Transparent prerequisites and suitability breakdown:</p>
                </div>
              </div>

              <div className="prereq-cards-row">
                <div className="prereq-col-card">
                  <h4 className="prereq-col-title">Who This Program Is Built For:</h4>
                  <ul className="prereq-bullet-list">
                    <li>
                      <CheckCircle2 size={16} className="text-emerald" />
                      <span><strong>Engineering Students &amp; Graduates:</strong> B.Tech, BCA, MCA, or M.Tech seeking structured industry readiness.</span>
                    </li>
                    <li>
                      <CheckCircle2 size={16} className="text-emerald" />
                      <span><strong>Working IT Professionals:</strong> Developers transitioning from legacy systems to Python, FastAPI &amp; AI.</span>
                    </li>
                    <li>
                      <CheckCircle2 size={16} className="text-emerald" />
                      <span><strong>Career Switchers:</strong> Professionals from non-IT backgrounds with strong logical and problem-solving aptitude.</span>
                    </li>
                  </ul>
                </div>

                <div className="prereq-col-card">
                  <h4 className="prereq-col-title">Technical Prerequisites:</h4>
                  <ul className="prereq-bullet-list">
                    <li>
                      <CheckCircle2 size={16} className="text-emerald" />
                      <span><strong>Zero Prior Coding Experience Required:</strong> We start from core syntax and scale systematically to architecture.</span>
                    </li>
                    <li>
                      <CheckCircle2 size={16} className="text-emerald" />
                      <span><strong>Time Commitment:</strong> 1.5 hours daily live attendance + 1 hour personal coding practice.</span>
                    </li>
                    <li>
                      <CheckCircle2 size={16} className="text-emerald" />
                      <span><strong>Hardware:</strong> Any laptop with 8GB RAM and internet connectivity (we use cloud containers for heavy training).</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="content-right">
            {/* 1-on-1 Mock Interview Showcase Card */}
            <div className="sidebar-card card mock-sidebar-card">
              <div className="sidebar-card-top">
                <div className="icon-badge-round icon-yellow">
                  <Award size={20} />
                </div>
                <div>
                  <h4>1-on-1 Mock Interview Studio</h4>
                  <span className="sidebar-sub">Private &bull; 1 Interviewer + 1 Student</span>
                </div>
              </div>

              <p className="sidebar-text">
                Every enrolled student participates in private 1-to-1 live mock interviews for this track:
              </p>

              <div className="mock-steps-pro">
                <div className="mock-step-item">
                  <div className="step-num-bubble">01</div>
                  <div className="step-content">
                    <strong>On-Demand Slot Booking</strong>
                    <p>Pick a convenient evening or weekend slot directly from your learning dashboard.</p>
                  </div>
                </div>

                <div className="mock-step-item">
                  <div className="step-num-bubble">02</div>
                  <div className="step-content">
                    <strong>Private Zoom Defense</strong>
                    <p>1-on-1 live coding, problem solving, and architecture questions with lead instructors.</p>
                  </div>
                </div>

                <div className="mock-step-item">
                  <div className="step-num-bubble">03</div>
                  <div className="step-content">
                    <strong>6-Dimension Scorecard</strong>
                    <p>Receive detailed marks on coding, problem solving, communication, and system design.</p>
                  </div>
                </div>
              </div>

              <button
                className="btn btn-primary btn-sm w-100 mt-3"
                onClick={() => onOpenDemoModal(course.id)}
              >
                <span>Register for Free Demo</span>
                <ArrowRight size={15} />
              </button>
            </div>

            {/* Academic Guidance */}
            <div className="sidebar-card card mt-4">
              <div className="sidebar-card-top">
                <div className="icon-badge-round icon-blue">
                  <Users size={20} />
                </div>
                <div>
                  <h4>Need Custom Guidance?</h4>
                  <span className="sidebar-sub">Speak with our lead mentor</span>
                </div>
              </div>

              <p className="sidebar-text">
                Unsure if this curriculum matches your current experience level or target roles? Speak directly with our lead academic counselor.
              </p>

              <div className="guidance-bullets">
                <div className="guidance-bullet-item">
                  <Check size={14} className="text-orange" />
                  <span>Curriculum roadmap assessment</span>
                </div>
                <div className="guidance-bullet-item">
                  <Check size={14} className="text-orange" />
                  <span>Current batch schedule &amp; seat availability</span>
                </div>
              </div>

              <button
                className="btn btn-secondary btn-sm w-100 mt-3"
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
