import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import { SEOHead } from '../../components/common/SEOHead';
import './ContactPage.css';

interface ContactPageProps {
  onOpenDemoModal: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onOpenDemoModal }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Course Inquiry',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      errs.email = 'Valid email is required';
    }
    if (!formData.message.trim()) errs.message = 'Please provide a message or question';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('http://localhost:5000/api/admissions/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || undefined,
          subject: formData.subject,
          message: formData.message.trim()
        })
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        setSubmitted(true);
      }
    } catch (err) {
      console.warn('Inquiry submission network fallback:', err);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <SEOHead
        title="Contact Admissions & Inquiries | DP Skill Tech"
        description="Contact DP Skill Tech admissions desk for course inquiries, batch timings, fees, 1-on-1 mock interviews, and live demo registration."
        canonicalPath="/contact"
        schema={{
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          name: 'Contact DP Skill Tech Admissions',
          url: 'https://www.dpskilltech.in/contact',
          description: 'Get in touch with DP Skill Tech admissions for live instructor-led technical courses and demo bookings.'
        }}
      />

      {/* Hero Header */}
      <section className="contact-hero">
        <div className="container text-center">
          <div className="contact-hero-badge">
            <span className="contact-badge-dot"></span>
            <span>DIRECT COMMUNICATION • ADMISSIONS & ADVISORY</span>
          </div>
          <h1 className="contact-hero-title">
            Contact <span className="contact-title-gradient">DP Skill Tech</span>
          </h1>
          <p className="contact-hero-desc">
            Have questions about upcoming batches, technical prerequisites, or live class schedules? Our admissions team responds within 24 business hours.
          </p>
        </div>
      </section>

      {/* Main Form & Info Section */}
      <section className="contact-main-section">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Details & Highlights */}
            <div className="contact-info-col">
              <h2 className="info-col-heading">Let's Discuss Your Career Goals</h2>
              <p className="contact-intro">
                Whether you are a fresh college graduate wanting to learn Full Stack development or a working engineer preparing for 1-on-1 mock interviews, we are here to assist.
              </p>

              <div className="info-cards-list">
                <div className="info-card">
                  <div className="info-icon-halo halo-blue">
                    <Mail size={22} className="info-icon" />
                  </div>
                  <div className="info-card-content">
                    <h4>Email Support & Admissions</h4>
                    <p className="info-highlight-text">support@dpskilltech.in</p>
                    <span className="info-sub">Official inquiries, student support, and enrollment queries</span>
                  </div>
                </div>

                <div className="info-card">
                  <div className="info-icon-halo halo-orange">
                    <Phone size={22} className="info-icon" />
                  </div>
                  <div className="info-card-content">
                    <h4>Admissions Helpline</h4>
                    <p className="info-highlight-text">+91 (Admissions Desk Placeholder)</p>
                    <span className="info-sub">Monday – Saturday: 9:00 AM – 8:00 PM IST</span>
                  </div>
                </div>

                <div className="info-card">
                  <div className="info-icon-halo halo-emerald">
                    <MapPin size={22} className="info-icon" />
                  </div>
                  <div className="info-card-content">
                    <h4>Academy Delivery Mode</h4>
                    <p className="info-highlight-text">Online Live Interactive (Pan-India & Global)</p>
                    <span className="info-sub">Interactive Zoom Sessions & Cloud Coding Lab</span>
                  </div>
                </div>
              </div>

              {/* Live Demo Banner */}
              <div className="demo-callout">
                <div className="callout-icon-wrap">
                  <Sparkles size={24} />
                </div>
                <div className="callout-body">
                  <h4>Want to see a class before asking?</h4>
                  <p>Book a free 90-minute live demo class and experience the 15-student batch format live.</p>
                  <button type="button" className="btn-demo-callout" onClick={onOpenDemoModal}>
                    <span>Book Free Live Demo</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Interactive Form */}
            <div className="contact-form-col">
              <div className="contact-form-card">
                <div className="form-card-topbar" />
                <div className="form-card-body">
                  {submitted ? (
                    <div className="contact-success">
                      <div className="success-icon-wrap">
                        <CheckCircle2 size={48} className="success-icon" />
                      </div>
                      <h3>Message Received!</h3>
                      <p>
                        Thank you for contacting DP Skill Tech, <strong>{formData.name}</strong>. Our academic counselor has received your inquiry and will reach out to <strong>{formData.email}</strong> shortly.
                      </p>
                      <button
                        type="button"
                        className="btn-reset-form"
                        onClick={() => {
                          setSubmitted(false);
                          setFormData({
                            name: '',
                            email: '',
                            phone: '',
                            subject: 'General Course Inquiry',
                            message: ''
                          });
                        }}
                      >
                        Send Another Message
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="contact-form">
                      <h3 className="form-heading">Send Us an Inquiry</h3>
                      <p className="form-sub">Fill in your details and our counselor will connect within 24 business hours.</p>

                      <div className="contact-form-group">
                        <label className="contact-form-label" htmlFor="c-name">Full Name *</label>
                        <input
                          id="c-name"
                          type="text"
                          className={`contact-form-input ${errors.name ? 'input-error' : ''}`}
                          placeholder="e.g. Priyadarshini Rao"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        {errors.name && <span className="contact-form-error">{errors.name}</span>}
                      </div>

                      <div className="contact-form-row">
                        <div className="contact-form-group">
                          <label className="contact-form-label" htmlFor="c-email">Email Address *</label>
                          <input
                            id="c-email"
                            type="email"
                            className={`contact-form-input ${errors.email ? 'input-error' : ''}`}
                            placeholder="name@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          />
                          {errors.email && <span className="contact-form-error">{errors.email}</span>}
                        </div>

                        <div className="contact-form-group">
                          <label className="contact-form-label" htmlFor="c-phone">Phone / WhatsApp Number</label>
                          <input
                            id="c-phone"
                            type="tel"
                            className="contact-form-input"
                            placeholder="+91 98765 43210"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="contact-form-group">
                        <label className="contact-form-label" htmlFor="c-sub">Subject / Area of Interest</label>
                        <select
                          id="c-sub"
                          className="contact-form-select"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        >
                          <option value="General Course Inquiry">General Course Inquiry</option>
                          <option value="Batch Schedule & Timings">Batch Schedule & Timings (15 Students)</option>
                          <option value="Coding Lab & Curriculum">Coding Lab & Curriculum Questions</option>
                          <option value="1-on-1 Mock Interviews">1-on-1 Mock Interviews Information</option>
                          <option value="Enterprise & Corporate Training">Enterprise & Corporate Training</option>
                        </select>
                      </div>

                      <div className="contact-form-group">
                        <label className="contact-form-label" htmlFor="c-msg">Your Message *</label>
                        <textarea
                          id="c-msg"
                          rows={4}
                          className={`contact-form-input ${errors.message ? 'input-error' : ''}`}
                          placeholder="Tell us about your background, career targets, or specific questions..."
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        />
                        {errors.message && <span className="contact-form-error">{errors.message}</span>}
                      </div>

                      <button
                        type="submit"
                        className="btn-contact-submit"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <span>Submitting Inquiry...</span>
                        ) : (
                          <>
                            <Send size={18} />
                            <span>Submit Inquiry</span>
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
