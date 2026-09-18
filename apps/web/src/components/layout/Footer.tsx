import React from 'react';
import { Mail, Phone, MapPin, ShieldCheck, Clock, Users, ArrowRight } from 'lucide-react';
import './Footer.css';
import { COURSES_DATA } from '../../data/coursesData';
import brandLogoFull from '../../assets/dp-skilltech-logo-full.png';

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
              Experience the DP Skill Tech difference: daily live Zoom sessions, sandboxed coding labs, and 1-on-1 live mock interviews.
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
          <a
            href="/"
            className="footer-logo"
            onClick={(e) => {
              e.preventDefault();
              handleNav('home');
            }}
            aria-label="DP Skill Tech Home"
          >
            <div className="footer-logo-badge">
              <img
                src={brandLogoFull}
                alt="DP Skill Tech - Learn. Build. Grow."
                className="footer-logo-img"
              />
            </div>
          </a>
          <p className="footer-desc">
            DP Skill Tech provides premier online IT training and hands-on coding education. We empower students, graduates, and working professionals to master industry-relevant tech stacks through intimate 15-student live batches, real 1-on-1 mock interviews, and browser coding practice.
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
                <a
                  href={`/courses/${c.slug}`}
                  className="footer-link-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNav('course-detail', { slug: c.slug });
                  }}
                >
                  {c.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3: Quick Navigation */}
        <div className="footer-col">
          <h4 className="footer-heading">Academy</h4>
          <ul className="footer-links">
            <li>
              <a
                href="/why-choose-us"
                className="footer-link-btn"
                onClick={(e) => {
                  e.preventDefault();
                  handleNav('why-choose-us');
                }}
              >
                Why Choose Us
              </a>
            </li>
            <li>
              <a
                href="/learning"
                className="footer-link-btn"
                onClick={(e) => {
                  e.preventDefault();
                  handleNav('learning');
                }}
              >
                Learning Methodology
              </a>
            </li>
            <li>
              <a
                href="/career-support"
                className="footer-link-btn"
                onClick={(e) => {
                  e.preventDefault();
                  handleNav('career-support');
                }}
              >
                Career &amp; Mock Interviews
              </a>
            </li>
            <li>
              <a
                href="/certificates"
                className="footer-link-btn"
                onClick={(e) => {
                  e.preventDefault();
                  handleNav('certificates');
                }}
              >
                Certificates &amp; Standards
              </a>
            </li>
            <li>
              <a
                href="/verify-certificate"
                className="footer-link-btn"
                onClick={(e) => {
                  e.preventDefault();
                  handleNav('verify-certificate');
                }}
              >
                Verify Certificate ID
              </a>
            </li>
            <li>
              <a
                href="/trainers"
                className="footer-link-btn"
                onClick={(e) => {
                  e.preventDefault();
                  handleNav('trainers');
                }}
              >
                Our Instructors
              </a>
            </li>
            <li>
              <a
                href="/testimonials"
                className="footer-link-btn"
                onClick={(e) => {
                  e.preventDefault();
                  handleNav('testimonials');
                }}
              >
                Testimonials &amp; Integrity
              </a>
            </li>
            <li>
              <a
                href="/about"
                className="footer-link-btn"
                onClick={(e) => {
                  e.preventDefault();
                  handleNav('about');
                }}
              >
                About Us
              </a>
            </li>
            <li>
              <a
                href="/faq"
                className="footer-link-btn"
                onClick={(e) => {
                  e.preventDefault();
                  handleNav('faq');
                }}
              >
                Frequently Asked Questions
              </a>
            </li>
          </ul>
        </div>

        {/* Col 4: Contact & Platform */}
        <div className="footer-col">
          <h4 className="footer-heading">Contact &amp; Inquiries</h4>
          <div className="footer-contact-info">
            <div className="contact-line">
              <Mail size={16} className="contact-icon" />
              <a href="mailto:support@dpskilltech.in" className="footer-contact-email">support@dpskilltech.in</a>
            </div>

            <div className="contact-line">
              <Phone size={16} className="contact-icon" />
              <span>+91 98765 43210</span>
            </div>
            <div className="contact-line">
              <MapPin size={16} className="contact-icon" />
              <span>Online Academy • Live Across India &amp; Worldwide</span>
            </div>
          </div>

          <div className="footer-login-box">
            <span className="box-title">Enrolled Student or Instructor?</span>
            <a
              href="/login"
              className="btn btn-secondary btn-sm w-100"
              onClick={(e) => {
                e.preventDefault();
                handleNav('login');
              }}
            >
              Access Learning Platform &rarr;
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="container bottom-content">
          <p>© {new Date().getFullYear()} DP Skill Tech. All rights reserved.</p>
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
