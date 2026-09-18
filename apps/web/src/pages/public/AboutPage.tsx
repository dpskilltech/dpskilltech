import React from 'react';
import { Target, Users, ShieldCheck, HeartHandshake, Sparkles, ArrowRight, Award } from 'lucide-react';
import { SEOHead } from '../../components/common/SEOHead';
import './AboutPage.css';

interface AboutPageProps {
  onNavigate: (page: string) => void;
  onOpenDemoModal: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate, onOpenDemoModal }) => {
  return (
    <div className="about-page">
      <SEOHead
        title="About DP Skill Tech | Our Mission & Mentorship Philosophy"
        description="Discover DP Skill Tech's mission to deliver rigorous live technical training in Full Stack Python, Java, Cyber Security, and Data Science in intimate 15-student batches."
        canonicalPath="/about"
        schema={{
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          name: 'About DP Skill Tech',
          description: 'DP Skill Tech is an online coding academy offering instructor-led live training with strict 15-student batch limits and 1-on-1 mentorship.',
          url: 'https://www.dpskilltech.in/about'
        }}
      />

      {/* Header */}
      <section className="about-hero">
        <div className="container text-center">
          <span className="section-tag">About DP Skill Tech</span>
          <h1 className="about-hero-title">Restoring Craftsmanship to Online IT Education</h1>
          <p className="about-hero-desc">
            DP Skill Tech was founded on a simple premise: learning to code requires direct mentorship, disciplined daily practice, and individual accountability—not mass webinars with hundreds of passive spectators.
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
            Join the next intimate 15-student live batch at DP Skill Tech.
          </p>
          <div className="cta-row">
            <button className="btn btn-primary btn-lg" onClick={onOpenDemoModal}>
              <Sparkles size={18} />
              <span>Book a Free Live Demo</span>
            </button>
            <a
              href="/courses"
              className="btn btn-secondary btn-lg"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('courses');
              }}
            >
              <span>Explore Programs</span>
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
