import React from 'react';
import {
  ShieldCheck,
  FileCode,
  Sparkles,
  Award,
  ArrowRight,
  GitBranch,
  FileCheck2,
  MessageSquareCode
} from 'lucide-react';
import { SEOHead } from '../../components/common/SEOHead';
import './CareerSupportPage.css';

interface CareerSupportPageProps {
  onNavigate: (page: string) => void;
  onOpenDemoModal: () => void;
}

export const CareerSupportPage: React.FC<CareerSupportPageProps> = ({ onNavigate, onOpenDemoModal }) => {
  const interviewCategories = [
    { title: 'Python Technical Screening', desc: 'Core OOP, memory models, decorators, async FastAPI/Django backend problems, and algorithmic puzzles.' },
    { title: 'Java & Spring Boot Evaluation', desc: 'Java 21 concurrency, JVM internals, Spring Boot microservice architectures, and JPA optimization.' },
    { title: 'SQL & Database Engineering', desc: 'Complex query challenges, window functions, query execution plan analysis, and database schema design.' },
    { title: 'Full Stack End-to-End Defense', desc: 'Connecting React client lifecycles with secure REST/GraphQL backend services and distributed databases.' },
    { title: 'Cybersecurity Threat & Defense', desc: 'OWASP vulnerability exploitation analysis, penetration testing scenarios, and SIEM event triage.' },
    { title: 'Live Coding & Data Structures', desc: 'Real-time whiteboard/editor problem solving in our sandboxed browser coding lab with runtime analysis.' },
    { title: 'HR & Behavioral Communication', desc: 'STAR technique behavioral responses, team conflict resolution, background transitions, and salary negotiation.' }
  ];

  return (
    <div className="career-support-page">
      <SEOHead
        title="Career Support & 1-on-1 Mock Interviews | DP Skill Tech"
        description="Accelerate your tech career with DP Skill Tech's career services: private 1-on-1 mock interviews, ATS resume reviews, GitHub portfolio polishing, and technical defense."
        canonicalPath="/career-support"
        schema={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'DP Skill Tech Career Support & Mock Interviews',
          url: 'https://www.dpskilltech.in/career-support',
          description: 'Real technical competence with private 1-on-1 live mock interviews and objective evaluation scorecards.'
        }}
      />

      {/* Header Banner */}
      <section className="career-hero">
        <div className="container text-center">
          <div className="career-hero-badge">
            <span className="career-badge-dot"></span>
            <span>CAREER & PLACEMENT PREPAREDNESS • INTEGRITY FIRST</span>
          </div>
          <h1 className="career-hero-title">
            Real Technical Competence Over <span className="career-title-gradient">Fake Placement Promises</span>
          </h1>
          <p className="career-hero-desc">
            We don't manufacture misleading placement claims or fake testimonials. We prepare you to pass actual corporate technical interviews through rigorous 1-to-1 live mock interviews, Git code reviews, and capstone project defenses.
          </p>
        </div>
      </section>

      {/* 1-on-1 Mock Interview Spotlight */}
      <section className="mock-interview-section">
        <div className="container">
          <div className="mock-spotlight-card">
            <div className="spotlight-topbar" />
            <div className="spotlight-content">
              <div className="spotlight-badge">
                <ShieldCheck size={16} />
                <span>Strictly 1 Interviewer : 1 Student Model</span>
              </div>

              <h2 className="spotlight-title">How Our 1-to-1 Live Mock Interview System Works</h2>
              <p className="spotlight-lead">
                Unlike other platforms that group 30 students into a passive session, our mock interviews are strictly private. You sit across from a senior engineering mentor on live Zoom, defend your code, and receive real-time feedback.
              </p>

              <div className="mock-features-grid">
                <div className="mock-feature-box">
                  <div className="feature-num">01</div>
                  <h4>Zero Double-Booking Guarantee</h4>
                  <p>
                    Our platform's booking engine enforces strict transactional locking. When an interviewer publishes open slots, once reserved, that slot is exclusively locked for you.
                  </p>
                </div>

                <div className="mock-feature-box">
                  <div className="feature-num">02</div>
                  <h4>Live Screen Code Challenge</h4>
                  <p>
                    You share your screen and solve algorithmic and architectural challenges in real-time inside the DP Skill Tech coding lab under authentic interview pressure.
                  </p>
                </div>

                <div className="mock-feature-box">
                  <div className="feature-num">03</div>
                  <h4>Objective Rubric Scorecard</h4>
                  <p>
                    After the session, the interviewer grades you on Problem Solving, Code Quality, Technical Depth, and Communication, logging detailed written feedback to your dashboard.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="categories-section">
        <div className="container">
          <div className="section-editorial-header text-center">
            <span className="editorial-pill">Targeted Simulations</span>
            <h2 className="editorial-title">Specialized Mock Interview Tracks</h2>
            <p className="editorial-desc">
              Book the exact interview type that matches your target job applications.
            </p>
          </div>

          <div className="categories-grid">
            {interviewCategories.map((cat, idx) => (
              <div key={idx} className="category-card">
                <div className="category-icon-wrap">
                  <MessageSquareCode size={22} />
                </div>
                <h4>{cat.title}</h4>
                <p>{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The 4 Pillars of Career Preparation */}
      <section className="prep-pillars-section">
        <div className="container">
          <div className="section-editorial-header text-center">
            <span className="editorial-pill">End-to-End Preparation</span>
            <h2 className="editorial-title">Beyond Just Writing Code</h2>
            <p className="editorial-desc">
              Holistic engineering readiness designed to give you a competitive edge with tech hiring managers.
            </p>
          </div>

          <div className="prep-grid">
            <div className="prep-card">
              <div className="prep-icon-wrap">
                <GitBranch size={26} className="prep-icon" />
              </div>
              <h4>GitHub Portfolio Curation</h4>
              <p>
                We review your commit messages, branching conventions, and project READMEs to present an authentic software engineering presence to tech hiring managers.
              </p>
            </div>

            <div className="prep-card">
              <div className="prep-icon-wrap">
                <FileCheck2 size={26} className="prep-icon" />
              </div>
              <h4>ATS-Optimized Resume Crafting</h4>
              <p>
                Transform academic jargon into impact-driven engineering bullets that pass Applicant Tracking Systems (ATS) and catch recruiter attention.
              </p>
            </div>

            <div className="prep-card">
              <div className="prep-icon-wrap">
                <FileCode size={26} className="prep-icon" />
              </div>
              <h4>Capstone Project Code Reviews</h4>
              <p>
                Instructors perform pull-request reviews on your capstone projects, ensuring clean code principles, test coverage, and modular architecture.
              </p>
            </div>

            <div className="prep-card">
              <div className="prep-icon-wrap">
                <Award size={26} className="prep-icon" />
              </div>
              <h4>Verifiable Credential Profile</h4>
              <p>
                Every graduate receives a tamper-proof digital certificate with a unique validation URL to back up skills claims on LinkedIn and job applications.
              </p>
            </div>
          </div>

          <div className="career-cta-card">
            <div className="career-cta-body">
              <h3>Ready to experience a real engineering interview?</h3>
              <p>Schedule your free 90-minute live demo class and inspect our curriculum firsthand.</p>
            </div>
            <div className="career-cta-actions">
              <button type="button" className="btn-career-primary" onClick={onOpenDemoModal}>
                <Sparkles size={18} />
                <span>Book Free Live Demo</span>
              </button>
              <a
                href="/courses"
                className="btn-career-secondary"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('courses');
                }}
              >
                <span>Browse All Curricula</span>
                <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
