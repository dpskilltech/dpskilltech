import React from 'react';
import { Mail, Phone, MapPin, ShieldCheck, Clock, Users, ArrowRight } from 'lucide-react';
import './Footer.css';
import { COURSES_DATA } from '../../data/coursesData';

interface FooterProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
  onOpenDemoModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenDemoModal }) => {
  const handleNav = (page: string, params?: Record<string, string>) => {
    onNavigate(page, params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="site-footer">
      {/* Pre-footer Call to Action */}
      <div className="footer-cta-band">
        <div className="container footer-cta-content">
          <div>
            <span className="cta-tag">Strictly 15 Students per Batch</span>
            <h3 className="cta-heading">Ready to transform your tech career with real live training?</h3>
            <p className="cta-sub">
              Experience the DP Skilltech difference: daily live Zoom sessions, sandboxed coding labs, and 1-on-1 live mock interviews.
            </p>
          </div>
          <button className="btn btn-primary btn-lg" onClick={onOpenDemoModal}>
            <span>Book a Free Live Demo</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      <div className="container footer-main">
        {/* Col 1: Brand & Philosophy */}
        <div className="footer-col brand-col">
          <div className="footer-logo" onClick={() => handleNav('home')}>
            <div className="footer-logo-icon">DP</div>
            <div>
              <div className="footer-logo-title">DP Skilltech</div>
              <div className="footer-logo-sub">Online IT Academy</div>
            </div>
          </div>
          <p className="footer-desc">
            DP Skilltech provides premier online IT training and hands-on coding education. We empower students, graduates, and working professionals to master industry-relevant tech stacks through intimate 15-student live batches, real 1-on-1 mock interviews, and browser coding practice.
          </p>
          <div className="footer-highlights">
            <div className="highlight-item">
              <Users size={16} className="highlight-icon" />
              <span>15 Students / Batch</span>
            </div>
            <div className="highlight-item">
              <Clock size={16} className="highlight-icon" />
              <span>6 Days/Wk • 1.5h Daily</span>
            </div>
            <div className="highlight-item">
              <ShieldCheck size={16} className="highlight-icon" />
              <span>1-on-1 Live Mock Interviews</span>
            </div>
          </div>
        </div>

        {/* Col 2: Courses */}
        <div className="footer-col">
          <h4 className="footer-heading">Training Programs</h4>
          <ul className="footer-links">
            {COURSES_DATA.map((c) => (
              <li key={c.id}>
                <button
                  className="footer-link-btn"
                  onClick={() => handleNav('course-detail', { slug: c.slug })}
                >
                  {c.title}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3: Quick Navigation */}
        <div className="footer-col">
          <h4 className="footer-heading">Academy</h4>
          <ul className="footer-links">
            <li>
              <button className="footer-link-btn" onClick={() => handleNav('why-choose-us')}>
                Why Choose Us
              </button>
            </li>
            <li>
              <button className="footer-link-btn" onClick={() => handleNav('learning')}>
                Learning Methodology
              </button>
            </li>
            <li>
              <button className="footer-link-btn" onClick={() => handleNav('career-support')}>
                Career & Mock Interviews
              </button>
            </li>
            <li>
              <button className="footer-link-btn" onClick={() => handleNav('trainers')}>
                Our Instructors
              </button>
            </li>
            <li>
              <button className="footer-link-btn" onClick={() => handleNav('testimonials')}>
                Testimonials & Integrity
              </button>
            </li>
            <li>
              <button className="footer-link-btn" onClick={() => handleNav('about')}>
                About Us
              </button>
            </li>
            <li>
              <button className="footer-link-btn" onClick={() => handleNav('faq')}>
                Frequently Asked Questions
              </button>
            </li>
          </ul>
        </div>

        {/* Col 4: Contact & Platform */}
        <div className="footer-col">
          <h4 className="footer-heading">Contact & Inquiries</h4>
          <div className="footer-contact-info">
            <div className="contact-line">
              <Mail size={16} className="contact-icon" />
              <span>admissions@dpskilltech.com</span>
            </div>
            <div className="contact-line">
              <Phone size={16} className="contact-icon" />
              <span>+91 (Admissions Desk Placeholder)</span>
            </div>
            <div className="contact-line">
              <MapPin size={16} className="contact-icon" />
              <span>Online Academy • Live Across India & Worldwide</span>
            </div>
          </div>

          <div className="footer-login-box">
            <span className="box-title">Enrolled Student or Instructor?</span>
            <button className="btn btn-secondary btn-sm w-100" onClick={() => handleNav('login')}>
              Access Learning Platform &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="container bottom-content">
          <p>© {new Date().getFullYear()} DP Skilltech. All rights reserved.</p>
          <div className="bottom-links">
            <span>Terms of Service</span>
            <span>Privacy Policy</span>
            <span>Refund Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
