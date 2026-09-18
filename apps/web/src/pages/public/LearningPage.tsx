import React, { useState } from 'react';
import {
  Video,
  Code2,
  FileCheck,
  Award,
  Users,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Terminal,
  Play
} from 'lucide-react';
import { SEOHead } from '../../components/common/SEOHead';
import './LearningPage.css';

interface LearningPageProps {
  onNavigate: (page: string) => void;
  onOpenDemoModal: () => void;
}

export const LearningPage: React.FC<LearningPageProps> = ({ onNavigate, onOpenDemoModal }) => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      step: '01',
      title: 'Interactive Live Class (Zoom)',
      icon: Video,
      tag: '1 Teacher to Max 15 Students',
      summary: 'Every class is a live, interactive 1.5-hour workshop held 6 days a week. We do not broadcast static lectures. Instructors code live, ask targeted questions, and review your screen.',
      highlights: [
        'Live voice and screen interaction on Zoom',
        'Strict 15-student ceiling for intimate focus',
        'Direct real-time code walkthroughs and debugging',
        'Sunday weekly off to consolidate and recharge'
      ]
    },
    {
      step: '02',
      title: 'Post-Class Lesson Recordings & PDFs',
      icon: Play,
      tag: 'Zero Missed Concepts',
      summary: 'Every session is immediately processed and attached to the relevant module inside your student dashboard, alongside downloadable PDF cheatsheets and lecture notes.',
      highlights: [
        'Organized hierarchically: Course → Module → Lesson',
        'Playback speed controls (0.75x to 2x)',
        'Downloadable lesson summary slides and code repositories',
        'Available 24/7 for the duration of your program'
      ]
    },
    {
      step: '03',
      title: 'Online Coding Lab Practice',
      icon: Terminal,
      tag: 'Sandboxed Cloud Execution',
      summary: 'Do not worry about complex local setups, PATH errors, or driver conflicts. Write and run code directly in your browser with our integrated sandboxed runtime.',
      highlights: [
        'Supports Python, Java, JavaScript, SQL, and C/C++',
        'Instant stdout/stderr and execution time metrics',
        'Pre-configured algorithmic and real-world exercises',
        'Isolated Docker containers ensuring safety and speed'
      ]
    },
    {
      step: '04',
      title: 'Graded Assignments & Timed Quizzes',
      icon: FileCheck,
      tag: 'Continuous Knowledge Verification',
      summary: 'Compounding knowledge requires continuous testing. After every key milestone, you complete timed multiple-choice quizzes and submit real code assignments for instructor evaluation.',
      highlights: [
        'Automated scoring and comprehensive explanations for quizzes',
        'Instructor-graded assignments with line-by-line feedback',
        'Rubric-based evaluation to identify weak spots early',
        'Student progress dashboard tracking overall milestone health'
      ]
    },
    {
      step: '05',
      title: 'Production Capstone Projects',
      icon: Code2,
      tag: 'Real-World Software Architecture',
      summary: 'You do not build trivial "to-do lists". Every course culminates in end-to-end production applications featuring REST APIs, database schemas, CI/CD pipelines, and modern frontend interfaces.',
      highlights: [
        'Full architecture: Frontend + Backend + Database + AI/Security',
        'Clean Git commit hygiene and README documentation',
        'Live deployment to cloud services (AWS, Docker, Vercel)',
        'Codebase ready to showcase on your GitHub and resume'
      ]
    },
    {
      step: '06',
      title: '1-to-1 Live Mock Interviews',
      icon: Users,
      tag: '1 Interviewer to 1 Student',
      summary: 'Before facing real company interview panels, you undergo realistic 1-to-1 mock interviews covering coding, system design, technical concepts, and HR communication.',
      highlights: [
        'Double-booking protected slot booking engine',
        'Private 1-on-1 Zoom video session with senior engineer',
        'Live problem-solving and resume deep-dive',
        'Objective rubric scorecard and improvement action plan'
      ]
    },
    {
      step: '07',
      title: 'Verifiable Certification & Career Launch',
      icon: Award,
      tag: 'Cryptographically Verifiable',
      summary: 'Upon completing all course modules, assignments, and mock interview milestones, you are awarded an official DP Skill Tech Completion Certificate.',
      highlights: [
        'Unique cryptographic verification code',
        'Public verification link shareable on LinkedIn and resumes',
        'Dedicated career assistance: resume optimization and interview referrals',
        'Lifetime alumni community network access'
      ]
    }
  ];

  return (
    <div className="learning-page">
      <SEOHead
        title="The DP Skill Tech Learning Engine | 7-Stage Engineering Curriculum"
        description="Explore the 7-stage learning pedagogy at DP Skill Tech: interactive Zoom classes, cloud coding labs, graded assignments, capstone projects, and 1-on-1 mock interviews."
        canonicalPath="/learning"
        schema={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'DP Skill Tech Learning Engine',
          url: 'https://www.dpskilltech.in/learning',
          description: 'A 7-stage engineering curriculum bridging the gap between beginner theory and production-grade software development.'
        }}
      />

      {/* Hero Header */}
      <section className="learning-hero">
        <div className="container text-center">
          <div className="learning-hero-badge">
            <span className="learning-badge-dot"></span>
            <span>PEDAGOGICAL PHILOSOPHY • THE 7-STAGE CURRICULUM</span>
          </div>
          <h1 className="learning-hero-title">
            The DP Skill Tech <span className="learning-title-gradient">Learning Engine</span>
          </h1>
          <p className="learning-hero-desc">
            A structured, 7-step engineering curriculum designed to bridge the gap between beginner theory and production-grade software mastery.
          </p>
        </div>
      </section>

      {/* Interactive Flow Walker */}
      <section className="learning-flow-section">
        <div className="container">
          <div className="flow-layout">
            {/* Step Selector Column (01 to 07) */}
            <div className="flow-steps-nav">
              <div className="nav-column-header">
                <span className="column-title">Curriculum Progression (7 Phases)</span>
                <span className="column-sub">Click any stage to inspect execution details</span>
              </div>
              {steps.map((s, idx) => {
                const Icon = s.icon;
                const isActive = activeStep === idx;
                return (
                  <div
                    key={idx}
                    className={`flow-nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => setActiveStep(idx)}
                  >
                    <div className="nav-step-badge">{s.step}</div>
                    <div className="nav-step-info">
                      <div className="nav-step-title">{s.title}</div>
                      <div className="nav-step-tag">{s.tag}</div>
                    </div>
                    <div className="nav-icon-wrap">
                      <Icon size={18} className="nav-step-icon" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Step Detail Display */}
            <div className="flow-detail-card">
              <div className="detail-card-topbar" />
              <div className="detail-card-body">
                <div className="detail-top">
                  <span className="detail-step-badge">Phase {steps[activeStep].step}</span>
                  <span className="detail-tag">{steps[activeStep].tag}</span>
                </div>

                <h2 className="detail-title">{steps[activeStep].title}</h2>
                <p className="detail-summary">{steps[activeStep].summary}</p>

                <div className="detail-highlights">
                  <h4>What Happens in this Phase:</h4>
                  <ul>
                    {steps[activeStep].highlights.map((h, i) => (
                      <li key={i}>
                        <CheckCircle2 size={18} className="highlight-icon" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="detail-actions">
                  <button type="button" className="btn-detail-demo" onClick={onOpenDemoModal}>
                    <Sparkles size={16} />
                    <span>Book a Live Class Demo</span>
                  </button>
                  <button type="button" className="btn-detail-courses" onClick={() => onNavigate('courses')}>
                    <span>View Courses Using this Engine</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="learning-cta-section">
        <div className="container">
          <div className="learning-cta-card">
            <div className="learning-cta-content">
              <span className="learning-cta-badge">STRICTLY 15 STUDENTS PER BATCH</span>
              <h2 className="learning-cta-title">
                Ready to transform your tech career with <span className="cta-title-mix">real live training?</span>
              </h2>
              <p className="learning-cta-desc">
                Experience the DP Skilltech difference: daily live Zoom sessions, sandboxed coding labs, and 1-on-1 live mock interviews.
              </p>
            </div>
            <div className="learning-cta-actions">
              <button type="button" className="btn-cta-primary" onClick={onOpenDemoModal}>
                <Sparkles size={18} />
                <span>Book a Free Live Demo</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

