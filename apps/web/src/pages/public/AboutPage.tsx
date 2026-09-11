import React from 'react';
import { Target, Users, ShieldCheck, HeartHandshake, Sparkles, ArrowRight, Award } from 'lucide-react';
import './AboutPage.css';

interface AboutPageProps {
  onNavigate: (page: string) => void;
  onOpenDemoModal: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate, onOpenDemoModal }) => {
  return (
    <div className="about-page">
      {/* Header */}
      <section className="about-hero">
        <div className="container text-center">
          <span className="section-tag">About DP Skilltech</span>
          <h1 className="about-hero-title">Restoring Craftsmanship to Online IT Education</h1>
          <p className="about-hero-desc">
            DP Skilltech was founded on a simple premise: learning to code requires direct mentorship, disciplined daily practice, and individual accountability—not mass webinars with hundreds of passive spectators.
          </p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="section-py vision-section">
        <div className="container">
          <div className="vision-grid">
            <div className="vision-card card">
              <div className="vision-icon-wrap">
                <Target size={30} />
              </div>
              <h2>Our Mission</h2>
              <p>
                To provide rigorous, accessible, and production-oriented IT training that empowers students, college graduates, and working professionals to build enterprise-grade software and thrive in the modern technology economy.
              </p>
            </div>

            <div className="vision-card card">
              <div className="vision-icon-wrap">
                <Award size={30} />
              </div>
              <h2>Our Standards</h2>
              <p>
                We do not sell pre-recorded video packs or mass webinar tickets. Every student is enrolled in a live batch of strictly 15 learners, meets an instructor daily for 1.5 hours, codes in sandboxed browser labs, and undergoes private 1-to-1 mock interviews.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Principles */}
      <section className="section-py principles-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Guiding Principles</span>
            <h2 className="section-title">The Commitments That Define Us</h2>
          </div>

          <div className="principles-grid">
            <div className="principle-item card">
              <Users size={28} className="principle-icon" />
              <h4>Intimate Batch Ceiling</h4>
              <p>
                We limit every batch to 15 students so our instructors know your strengths, debug your code live, and guide you personally throughout the program.
              </p>
            </div>

            <div className="principle-item card">
              <ShieldCheck size={28} className="principle-icon" />
              <h4>100% Ethical Transparency</h4>
              <p>
                We never use fake statistics, fake testimonials, or manufactured placement guarantees. We let our curriculum depth and student code speak for themselves.
              </p>
            </div>

            <div className="principle-item card">
              <HeartHandshake size={28} className="principle-icon" />
              <h4>Individual 1-on-1 Mentorship</h4>
              <p>
                Our 1 interviewer to 1 student mock interview sessions provide personalized technical and communication scorecards that prepare you for the real job market.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="section-py about-cta-section">
        <div className="container text-center">
          <h2>Ready to Begin Your Engineering Journey?</h2>
          <p className="max-w-600 mx-auto mb-4">
            Join the next intimate 15-student live batch at DP Skilltech.
          </p>
          <div className="cta-row">
            <button className="btn btn-primary btn-lg" onClick={onOpenDemoModal}>
              <Sparkles size={18} />
              <span>Book a Free Live Demo</span>
            </button>
            <button className="btn btn-secondary btn-lg" onClick={() => onNavigate('courses')}>
              <span>Explore Programs</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
