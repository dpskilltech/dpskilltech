import React from 'react';
import {
  Users,
  ShieldCheck,
  Code2,
  Clock,
  Check,
  X,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { SEOHead } from '../../components/common/SEOHead';
import './WhyChooseUsPage.css';

interface WhyChooseUsPageProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
  onOpenDemoModal: () => void;
}

export const WhyChooseUsPage: React.FC<WhyChooseUsPageProps> = ({ onNavigate, onOpenDemoModal }) => {
  const comparisonItems = [
    {
      feature: 'Batch Size & Attendance',
      dpskilltech: 'Strictly capped at 15 students per batch',
      others: '150 - 300+ students packed in passive webinars'
    },
    {
      feature: 'Class Schedule & Cadence',
      dpskilltech: '6 Days a Week (1.5 hours/day) • Sunday Off',
      others: 'Occasional weekend classes with zero daily habit'
    },
    {
      feature: 'Live Doubt Resolution',
      dpskilltech: 'Instant live voice & screen-share code reviews',
      others: 'Chats disabled or moderated by junior assistants'
    },
    {
      feature: 'Mock Interviews Model',
      dpskilltech: 'Strictly 1-to-1 private video sessions + scorecards',
      others: 'Group mock sessions or zero personalized feedback'
    },
    {
      feature: 'Coding Lab Environment',
      dpskilltech: 'Browser sandboxed execution (Python, Java, SQL)',
      others: 'Messy local setups, dependency conflicts'
    },
    {
      feature: 'Recorded Class Access',
      dpskilltech: 'High-res recordings mapped directly to lesson modules',
      others: 'Messy Google Drive links or delayed uploads'
    },
    {
      feature: 'Integrity & Transparency',
      dpskilltech: '100% honest curriculum, no fake placement statistics',
      others: 'Unrealistic guarantees and fake placement claims'
    }
  ];

  return (
    <div className="why-choose-us-page">
      <SEOHead
        title="Why Choose DP Skill Tech | 15-Student Live Batches & 1-on-1 Mentorship"
        description="Compare DP Skill Tech with traditional EdTech platforms: strict 15-student live batches, 6 days a week instruction, 1-on-1 private mock interviews, and cloud coding labs."
        canonicalPath="/why-choose-us"
        schema={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Why Choose DP Skill Tech',
          url: 'https://www.dpskilltech.in/why-choose-us',
          description: 'Learn why DP Skill Tech offers superior technical training with intimate 15-student batches and individual 1-on-1 mentorship.'
        }}
      />

      {/* Hero Header */}
      <section className="why-hero-section">
        <div className="container text-center">
          <span className="section-tag">Quality-First Philosophy</span>
          <h1 className="why-hero-title">Why Serious Coders Choose DP Skill Tech</h1>
          <p className="why-hero-desc">
            We built DP Skill Tech because we were exhausted by EdTech factories treating students as numbers. Here is how our engineering-first, 15-student academy produces real software engineers.
          </p>
        </div>
      </section>

      {/* Comparison Table Section */}
      <section className="section-py comparison-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">The Head-to-Head Comparison</span>
            <h2 className="section-title">DP Skill Tech vs. Generic Online Platforms</h2>
            <p className="section-desc">
              Compare our transparent standards side-by-side with typical industry providers.
            </p>
          </div>

          <div className="comparison-table-wrap">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th className="th-feature">Core Training Parameter</th>
                  <th className="th-dp">
                    <div className="th-brand">
                      <span>DP Skill Tech</span>
                      <span className="badge-highlight">The Standard</span>
                    </div>
                  </th>
                  <th className="th-others">Typical EdTech Platforms</th>
                </tr>
              </thead>
              <tbody>
                {comparisonItems.map((item, idx) => (
                  <tr key={idx}>
                    <td className="td-feature">{item.feature}</td>
                    <td className="td-dp">
                      <div className="td-content">
                        <Check size={18} className="icon-check" />
                        <span>{item.dpskilltech}</span>
                      </div>
                    </td>
                    <td className="td-others">
                      <div className="td-content">
                        <X size={18} className="icon-cross" />
                        <span>{item.others}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 4 Pillars In Depth */}
      <section className="section-py pillars-detail-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Our 4 Core Pillars</span>
            <h2 className="section-title">Engineered for Rapid Skill Compounding</h2>
          </div>

          <div className="detail-pillars-grid">
            <div className="detail-pillar card">
              <div className="pillar-num">01</div>
              <Users size={32} className="text-primary-600 mb-2" />
              <h3>The 15-Student Batch Limit</h3>
              <p>
                In a class of 15, you cannot hide, and you cannot be left behind. Instructors know every student by name, monitor code outputs in real-time, and pause to ensure everyone understands fundamental algorithms before advancing.
              </p>
            </div>

            <div className="detail-pillar card">
              <div className="pillar-num">02</div>
              <Clock size={32} className="text-primary-600 mb-2" />
              <h3>6 Days a Week Disciplined Rhythm</h3>
              <p>
                Learning software development requires relentless repetition. A 1.5-hour daily session Monday through Saturday ensures that concepts stay fresh, homework is completed promptly, and momentum is never broken.
              </p>
            </div>

            <div className="detail-pillar card">
              <div className="pillar-num">03</div>
              <ShieldCheck size={32} className="text-primary-600 mb-2" />
              <h3>Private 1-on-1 Live Mock Interviews</h3>
              <p>
                Coding knowledge is only half the battle; defending your code under pressure is the other half. Our private 1 interviewer to 1 student mock interviews simulate real technical screening and HR interviews with objective scorecards.
              </p>
            </div>

            <div className="detail-pillar card">
              <div className="pillar-num">04</div>
              <Code2 size={32} className="text-primary-600 mb-2" />
              <h3>Browser Sandboxed Coding Lab</h3>
              <p>
                Eliminate the friction of compiler configurations, PATH errors, and missing database drivers. Our online lab executes Python, Java, SQL, and C++ with real-time test case evaluation inside secure cloud containers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="section-py why-cta-section">
        <div className="container text-center">
          <h2>Experience the Difference Firsthand</h2>
          <p className="max-w-600 mx-auto mb-4">
            Attend an actual live session on Zoom. Talk to our instructor, see the coding lab, and ask any questions before making your decision.
          </p>
          <div className="cta-buttons-row">
            <button className="btn btn-primary btn-lg" onClick={onOpenDemoModal}>
              <Sparkles size={18} />
              <span>Book Your Free Live Demo</span>
            </button>
            <a
              href="/courses"
              className="btn btn-secondary btn-lg"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('courses');
              }}
            >
              <span>Browse All Courses</span>
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
