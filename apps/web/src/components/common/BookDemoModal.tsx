import React, { useState } from 'react';
import { X, CheckCircle, Sparkles, Send, Clock, Users, Video } from 'lucide-react';
import './BookDemoModal.css';
import { COURSES_DATA } from '../../data/coursesData';

interface BookDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedCourseId?: string;
}

export const BookDemoModal: React.FC<BookDemoModalProps> = ({
  isOpen,
  onClose,
  preselectedCourseId
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    courseId: preselectedCourseId || COURSES_DATA[0].id,
    experienceLevel: 'Student / Recent Graduate',
    preferredSlot: 'Evening (07:30 PM - 09:00 PM IST)',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      errs.email = 'Valid email address is required';
    }
    if (!formData.phone.trim() || formData.phone.length < 8) {
      errs.phone = 'Valid phone number is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Simulate API call to POST /api/v1/public/demo-booking
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      courseId: COURSES_DATA[0].id,
      experienceLevel: 'Student / Recent Graduate',
      preferredSlot: 'Evening (07:30 PM - 09:00 PM IST)',
      message: ''
    });
    setErrors({});
    onClose();
  };

  const selectedCourse = COURSES_DATA.find((c) => c.id === formData.courseId) || COURSES_DATA[0];

  return (
    <div className="modal-backdrop" onClick={handleResetAndClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={handleResetAndClose} aria-label="Close modal">
          <X size={20} />
        </button>

        {submitted ? (
          <div className="modal-success">
            <div className="success-icon-wrap">
              <CheckCircle size={48} className="success-icon" />
            </div>
            <h3 className="success-title">Demo Session Reserved!</h3>
            <p className="success-text">
              Thank you, <strong>{formData.name}</strong>. We have registered your request for the{' '}
              <strong>{selectedCourse.title}</strong> live interactive demo.
            </p>
            <div className="success-details-card">
              <div className="success-detail-row">
                <Video size={16} />
                <span>Format: Live Interactive Class on Zoom</span>
              </div>
              <div className="success-detail-row">
                <Clock size={16} />
                <span>Slot: {formData.preferredSlot}</span>
              </div>
              <div className="success-detail-row">
                <Users size={16} />
                <span>Group Size: Max 15 Attendees</span>
              </div>
            </div>
            <p className="success-sub">
              Our academic coordinator will send the Zoom join link and orientation syllabus to <strong>{formData.email}</strong> and connect with you shortly on WhatsApp / Phone.
            </p>
            <button className="btn btn-primary w-100" onClick={handleResetAndClose}>
              Done & Explore Platform
            </button>
          </div>
        ) : (
          <div className="modal-body">
            <div className="modal-header">
              <div className="modal-tag">
                <Sparkles size={14} />
                <span>Zero Cost • Free 90-Minute Live Demo</span>
              </div>
              <h2 className="modal-title">Experience a Real DP Skilltech Class</h2>
              <p className="modal-desc">
                Attend an actual 15-student live session on Zoom. Meet our instructors, view the browser coding lab, and ask any questions before enrolling.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              {/* Name */}
              <div className="form-group">
                <label className="form-label" htmlFor="name">Full Name *</label>
                <input
                  id="name"
                  type="text"
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  placeholder="e.g. Ramesh Kumar"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                {errors.name && <span className="form-error">{errors.name}</span>}
              </div>

              {/* Email & Phone */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="email">Email Address *</label>
                  <input
                    id="email"
                    type="email"
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  {errors.email && <span className="form-error">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="phone">Phone / WhatsApp Number *</label>
                  <input
                    id="phone"
                    type="tel"
                    className={`form-input ${errors.phone ? 'error' : ''}`}
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                  {errors.phone && <span className="form-error">{errors.phone}</span>}
                </div>
              </div>

              {/* Course Selection */}
              <div className="form-group">
                <label className="form-label" htmlFor="course">Program of Interest *</label>
                <select
                  id="course"
                  className="form-select"
                  value={formData.courseId}
                  onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                >
                  {COURSES_DATA.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} ({c.duration})
                    </option>
                  ))}
                </select>
              </div>

              {/* Experience Level & Preferred Slot */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="exp">Current Background</label>
                  <select
                    id="exp"
                    className="form-select"
                    value={formData.experienceLevel}
                    onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                  >
                    <option value="Student / Recent Graduate">Student / Recent Graduate</option>
                    <option value="Working Professional (IT)">Working Professional (IT)</option>
                    <option value="Working Professional (Non-IT)">Working Professional (Non-IT)</option>
                    <option value="Career Switcher / Break">Career Switcher / Returning</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="slot">Preferred Demo Time</label>
                  <select
                    id="slot"
                    className="form-select"
                    value={formData.preferredSlot}
                    onChange={(e) => setFormData({ ...formData, preferredSlot: e.target.value })}
                  >
                    <option value="Morning (07:30 AM - 09:00 AM IST)">Morning (07:30 AM - 09:00 AM IST)</option>
                    <option value="Morning (09:30 AM - 11:00 AM IST)">Morning (09:30 AM - 11:00 AM IST)</option>
                    <option value="Afternoon (02:00 PM - 03:30 PM IST)">Afternoon (02:00 PM - 03:30 PM IST)</option>
                    <option value="Evening (05:30 PM - 07:00 PM IST)">Evening (05:30 PM - 07:00 PM IST)</option>
                    <option value="Evening (07:30 PM - 09:00 PM IST)">Evening (07:30 PM - 09:00 PM IST)</option>
                    <option value="Night (09:00 PM - 10:30 PM IST)">Night (09:00 PM - 10:30 PM IST)</option>
                    <option value="Weekend Saturday (11:00 AM - 12:30 PM IST)">Weekend Saturday (11:00 AM - 12:30 PM IST)</option>
                    <option value="Weekend Sunday (10:00 AM - 11:30 AM IST)">Weekend Sunday (10:00 AM - 11:30 AM IST)</option>
                  </select>
                </div>
              </div>

              <div className="modal-submit-wrap">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-100"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span>Registering Demo...</span>
                  ) : (
                    <>
                      <Send size={18} />
                      <span>Confirm Free Live Demo Booking</span>
                    </>
                  )}
                </button>
                <span className="submit-footnote">
                  🔒 We respect your privacy. No promotional spam. Only official academy details.
                </span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
