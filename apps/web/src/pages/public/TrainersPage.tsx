import React from 'react';
import { Sparkles, Award, CheckCircle2, ArrowRight } from 'lucide-react';
import './TrainersPage.css';
import { TRAINERS_DATA } from '../../data/trainersData';

interface TrainersPageProps {
  onNavigate: (page: string) => void;
  onOpenDemoModal: () => void;
}

export const TrainersPage: React.FC<TrainersPageProps> = ({ onNavigate, onOpenDemoModal }) => {
  return (
    <div className="trainers-page">
      {/* Hero Header */}
      <section className="trainers-hero">
        <div className="container text-center">
          <span className="section-tag">Practitioner Faculty</span>
          <h1 className="trainers-hero-title">Learn from Active Software Engineers</h1>
          <p className="trainers-hero-desc">
            Our faculty members have spent decades building production systems, designing scalable backends, and hiring engineering talent.
          </p>
        </div>
      </section>

      {/* Trainers Showcase */}
      <section className="section-py faculty-section">
        <div className="container">
          <div className="faculty-grid">
            {TRAINERS_DATA.map((tr) => (
              <div key={tr.id} className="faculty-card card">
                <div className="faculty-card-header">
                  <div className="faculty-avatar">
                    <span>{tr.initials}</span>
                  </div>
                  <div>
                    <h3 className="faculty-name">{tr.name}</h3>
                    <div className="faculty-role">{tr.role}</div>
                    <div className="faculty-spec">{tr.specialization}</div>
                  </div>
                </div>

                <div className="faculty-badge">
                  <Award size={15} />
                  <span>{tr.experienceLabel}</span>
                </div>

                <p className="faculty-bio">{tr.bio}</p>

                <div className="faculty-skills-section">
                  <span className="skills-heading">Core Competencies:</span>
                  <div className="faculty-skills-chips">
                    {tr.topSkills.map((skill, idx) => (
                      <span key={idx} className="faculty-skill-chip">{skill}</span>
                    ))}
                  </div>
                </div>

                <div className="faculty-card-footer">
                  <button className="btn btn-secondary btn-sm w-100" onClick={onOpenDemoModal}>
                    Attend a Session with {tr.name.split(' ')[0]}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Faculty Standards */}
      <section className="section-py faculty-standards-section">
        <div className="container">
          <div className="standards-card">
            <div className="standards-content">
              <span className="section-tag">Our Faculty Commitment</span>
              <h2>How Our Mentors Teach You</h2>
              <ul className="standards-list">
                <li>
                  <CheckCircle2 size={18} className="text-emerald" />
                  <span><strong>Live Coding, Never Slide Reading:</strong> Every technical concept is demonstrated in live IDE code editors and terminal sessions.</span>
                </li>
                <li>
                  <CheckCircle2 size={18} className="text-emerald" />
                  <span><strong>Line-by-Line Code Review:</strong> With only 15 students per batch, instructors inspect your submissions directly and guide refactoring.</span>
                </li>
                <li>
                  <CheckCircle2 size={18} className="text-emerald" />
                  <span><strong>Personal Mock Interview Panels:</strong> Instructors conduct the private 1-to-1 mock interviews to assess your actual interview readiness.</span>
                </li>
              </ul>
            </div>
            <div className="standards-cta">
              <button className="btn btn-primary btn-lg" onClick={onOpenDemoModal}>
                <Sparkles size={18} />
                <span>Book Free Demo Class</span>
              </button>
              <button className="btn btn-secondary btn-lg" onClick={() => onNavigate('courses')}>
                <span>Explore Mentored Programs</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
