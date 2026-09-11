import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Sparkles } from 'lucide-react';
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Simulate API call to POST /api/v1/public/contact
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="contact-page">
      {/* Hero Header */}
      <section className="contact-hero">
        <div className="container text-center">
          <span className="section-tag">Direct Communication</span>
          <h1 className="contact-hero-title">Contact DP Skilltech Academy</h1>
          <p className="contact-hero-desc">
            Have questions about upcoming batches, technical prerequisites, or live class schedules? Our admissions team responds within 24 business hours.
          </p>
        </div>
      </section>

      {/* Main Form & Info Section */}
      <section className="section-py contact-main-section">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Details & Highlights */}
            <div className="contact-info-col">
              <h2>Let's Discuss Your Career Goals</h2>
              <p className="contact-intro">
                Whether you are a fresh college graduate wanting to learn Full Stack development or a working engineer preparing for 1-on-1 mock interviews, we are here to assist.
              </p>

              <div className="info-cards-list">
                <div className="info-card card">
                  <Mail size={22} className="info-icon" />
                  <div>
                    <h4>Email Admissions Desk</h4>
                    <p>admissions@dpskilltech.com</p>
                    <span className="info-sub">Official inquiries and enrollment queries</span>
                  </div>
                </div>

                <div className="info-card card">
                  <Phone size={22} className="info-icon" />
                  <div>
                    <h4>Admissions Helpline</h4>
                    <p>+91 (Admissions Desk Placeholder)</p>
                    <span className="info-sub">Monday – Saturday: 9:00 AM – 8:00 PM IST</span>
                  </div>
                </div>

                <div className="info-card card">
                  <MapPin size={22} className="info-icon" />
                  <div>
                    <h4>Academy Delivery Mode</h4>
                    <p>Online Live Interactive (Pan-India & Global)</p>
                    <span className="info-sub">Interactive Zoom Sessions & Cloud Coding Lab</span>
                  </div>
                </div>
              </div>

              {/* Live Demo Banner */}
              <div className="demo-callout card mt-4">
                <div className="callout-icon">
                  <Sparkles size={24} />
                </div>
                <div>
                  <h4>Want to see a class before asking?</h4>
                  <p>Book a free 90-minute live demo class and experience the 15-student batch format live.</p>
                  <button className="btn btn-primary btn-sm mt-2" onClick={onOpenDemoModal}>
                    Book Free Live Demo &rarr;
                  </button>
                </div>
              </div>
            </div>

            {/* Interactive Form */}
            <div className="contact-form-col">
              <div className="contact-form-card card">
                {submitted ? (
                  <div className="contact-success">
                    <CheckCircle2 size={54} className="success-icon" />
                    <h3>Message Received!</h3>
                    <p>
                      Thank you for contacting DP Skilltech, <strong>{formData.name}</strong>. Our academic team has received your inquiry and will reach out to <strong>{formData.email}</strong> shortly.
                    </p>
                    <button
                      className="btn btn-secondary mt-3"
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
                    <h3>Send Us an Inquiry</h3>
                    <p className="form-sub">Fill in your information and our academic counselor will connect with you.</p>

                    <div className="form-group">
                      <label className="form-label" htmlFor="c-name">Full Name *</label>
                      <input
                        id="c-name"
                        type="text"
                        className={`form-input ${errors.name ? 'error' : ''}`}
                        placeholder="e.g. Priyadarshini Rao"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                      {errors.name && <span className="form-error">{errors.name}</span>}
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label" htmlFor="c-email">Email Address *</label>
                        <input
                          id="c-email"
                          type="email"
                          className={`form-input ${errors.email ? 'error' : ''}`}
                          placeholder="name@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                        {errors.email && <span className="form-error">{errors.email}</span>}
                      </div>

                      <div className="form-group">
                        <label className="form-label" htmlFor="c-phone">Phone / WhatsApp Number</label>
                        <input
                          id="c-phone"
                          type="tel"
                          className="form-input"
                          placeholder="+91 98765 43210"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="c-sub">Subject / Area of Interest</label>
                      <select
                        id="c-sub"
                        className="form-select"
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

                    <div className="form-group">
                      <label className="form-label" htmlFor="c-msg">Your Message *</label>
                      <textarea
                        id="c-msg"
                        rows={4}
                        className={`form-input ${errors.message ? 'error' : ''}`}
                        placeholder="Tell us about your background, career targets, or specific questions..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      />
                      {errors.message && <span className="form-error">{errors.message}</span>}
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary btn-lg w-100"
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
      </section>
    </div>
  );
};
