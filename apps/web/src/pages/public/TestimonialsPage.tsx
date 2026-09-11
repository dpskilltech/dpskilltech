import React from 'react';
import { ShieldCheck, MessageSquareQuote, AlertCircle, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import './TestimonialsPage.css';
import { TESTIMONIALS_DATA } from '../../data/testimonialsData';

interface TestimonialsPageProps {
  onNavigate: (page: string) => void;
  onOpenDemoModal: () => void;
}

export const TestimonialsPage: React.FC<TestimonialsPageProps> = ({ onNavigate, onOpenDemoModal }) => {
  return (
    <div className="testimonials-page">
      {/* Hero Header */}
      <section className="testimonials-hero">
        <div className="container text-center">
          <span className="section-tag">Authenticity & Integrity Policy</span>
          <h1 className="testimonials-hero-title">Student & Alumni Feedback</h1>
          <p className="testimonials-hero-desc">
            At DP Skilltech, we believe trust is earned through engineering depth, not fabricated placement claims or paid actor reviews.
          </p>
        </div>
      </section>

      {/* Transparency Banner */}
      <section className="section-py policy-banner-section">
        <div className="container">
          <div className="transparency-notice card">
            <div className="notice-icon-wrap">
              <ShieldCheck size={32} />
            </div>
            <div>
              <h3>Our Strict Zero-Fake-Review Commitment</h3>
              <p>
                In compliance with project integrity guidelines, DP Skilltech will only display authentic, verifiable reviews from verified students who complete our 15-student live batches. Below are current status indicators as our ongoing cohorts progress through their training and 1-on-1 mock interviews.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Placeholders Grid */}
      <section className="section-py placeholders-section">
        <div className="container">
          <div className="placeholders-grid">
            {TESTIMONIALS_DATA.map((item) => (
              <div key={item.id} className="testimonial-card card">
                <div className="testi-card-top">
                  <span className="testi-badge">{item.badge}</span>
                  <span className="testi-category">{item.category}</span>
                </div>

                <div className="quote-icon-wrap">
                  <MessageSquareQuote size={28} />
                </div>

                <h3 className="testi-title">{item.placeholderTitle}</h3>
                <div className="testi-status-banner">
                  <AlertCircle size={15} />
                  <span>{item.statusNote}</span>
                </div>

                <p className="testi-desc">{item.description}</p>

                <div className="testi-author-box">
                  <div className="author-avatar-ph">PH</div>
                  <div>
                    <div className="author-name">{item.authorPlaceholder}</div>
                    <div className="author-role">{item.rolePlaceholder}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="transparency-checklist card mt-4">
            <h4>What We Promise Every Prospective Learner:</h4>
            <ul className="checklist">
              <li>
                <CheckCircle2 size={16} className="text-emerald" />
                <span>No fabricated placement percentages (e.g. "100% Guaranteed Job")</span>
              </li>
              <li>
                <CheckCircle2 size={16} className="text-emerald" />
                <span>No fabricated salary figures (e.g. "Average 24 LPA")</span>
              </li>
              <li>
                <CheckCircle2 size={16} className="text-emerald" />
                <span>No fake testimonial quotes or stock photo models</span>
              </li>
              <li>
                <CheckCircle2 size={16} className="text-emerald" />
                <span>Actual live 90-minute demo class where you see our teaching quality firsthand</span>
              </li>
            </ul>
          </div>

          <div className="text-center mt-4 cta-buttons-row">
            <button className="btn btn-primary btn-lg" onClick={onOpenDemoModal}>
              <Sparkles size={18} />
              <span>Attend a Live Demo Session</span>
            </button>
            <button className="btn btn-secondary btn-lg" onClick={() => onNavigate('courses')}>
              <span>Browse All Courses</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
