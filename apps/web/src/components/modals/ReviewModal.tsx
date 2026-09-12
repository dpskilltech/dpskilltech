import React, { useState } from 'react';
import { Star, X, CheckCircle2, AlertCircle, Send, ShieldCheck } from 'lucide-react';
import { reviewService, type Review } from '../../services/reviewService';
import './ReviewModal.css';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReviewSubmitted: (newReview: Review) => void;
  defaultCourse?: string;
}

const AVAILABLE_COURSES = [
  'Full Stack Python + AI Architecture',
  'Cyber Security Fundamentals & Ethical Defense',
  'Modern Web Development (React, Node & TypeScript)',
  'Data Science & Machine Learning Systems',
  'Full Stack Java + Spring Boot Enterprise',
  'Cloud DevOps & Site Reliability Engineering',
  'Free Interactive Demo Session Attendee',
  'Alumni / Self-Paced Student'
];

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  onReviewSubmitted,
  defaultCourse
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [authorName, setAuthorName] = useState<string>('');
  const [roleOrCourse, setRoleOrCourse] = useState<string>(defaultCourse || AVAILABLE_COURSES[0]);
  const [batchOrCohort, setBatchOrCohort] = useState<string>('');
  const [reviewText, setReviewText] = useState<string>('');
  const [integrityAgreed, setIntegrityAgreed] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!authorName.trim() || authorName.trim().length < 2) {
      setErrorMessage('Please enter your full name (minimum 2 characters).');
      return;
    }

    if (!reviewText.trim() || reviewText.trim().length < 10) {
      setErrorMessage('Please provide a meaningful review (minimum 10 characters).');
      return;
    }

    if (!integrityAgreed) {
      setErrorMessage('Please confirm that this review represents authentic feedback.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await reviewService.submitReview({
        authorName: authorName.trim(),
        roleOrCourse: roleOrCourse.trim(),
        rating,
        reviewText: reviewText.trim(),
        batchOrCohort: batchOrCohort.trim() || 'Verified Learner'
      });

      if (res.success && res.data) {
        setShowSuccessToast(true);
        onReviewSubmitted(res.data);
        setTimeout(() => {
          setShowSuccessToast(false);
          onClose();
          // Reset form
          setAuthorName('');
          setReviewText('');
          setBatchOrCohort('');
          setRating(5);
        }, 1400);
      } else {
        setErrorMessage(res.error || 'Failed to submit review. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingLabel = (val: number) => {
    switch (val) {
      case 5:
        return 'Exceptional (5/5) — Exceeded expectations';
      case 4:
        return 'Very Good (4/5) — Practical & high quality';
      case 3:
        return 'Good (3/5) — Met course objectives';
      case 2:
        return 'Fair (2/5) — Needs minor improvements';
      case 1:
        return 'Needs Work (1/5) — Room for growth';
      default:
        return '';
    }
  };

  return (
    <div className="review-modal-overlay" onClick={onClose}>
      <div
        className="review-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="review-modal-header">
          <div className="review-modal-title-group">
            <span className="review-modal-tag">
              <ShieldCheck size={14} /> Rule 22 Authentic Feedback
            </span>
            <h3 className="review-modal-title">Share Your Honest Experience</h3>
            <p className="review-modal-subtitle">
              Your feedback is published in real-time. Authentic reviews help fellow learners make informed decisions.
            </p>
          </div>
          <button
            type="button"
            className="review-modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Success Toast */}
        {showSuccessToast && (
          <div className="review-success-banner">
            <CheckCircle2 size={20} className="text-emerald" />
            <div>
              <strong>Thank You! Your Review Is Live.</strong>
              <p>Your authentic feedback has been published in real-time on our platform.</p>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="review-error-banner">
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Body */}
        <form className="review-modal-form" onSubmit={handleSubmit}>
          {/* Star Rating Picker */}
          <div className="form-group">
            <label className="form-label">
              Your Overall Rating <span className="text-danger">*</span>
            </label>
            <div className="star-rating-interactive">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  className={`star-btn ${star <= (hoverRating || rating) ? 'filled' : ''}`}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  aria-label={`${star} Stars`}
                >
                  <Star
                    size={28}
                    fill={star <= (hoverRating || rating) ? '#f59e0b' : 'none'}
                    color={star <= (hoverRating || rating) ? '#f59e0b' : '#cbd5e1'}
                  />
                </button>
              ))}
              <span className="rating-text-hint">{getRatingLabel(hoverRating || rating)}</span>
            </div>
          </div>

          <div className="form-grid-2col">
            {/* Full Name */}
            <div className="form-group">
              <label htmlFor="rev-author-name" className="form-label">
                Full Name <span className="text-danger">*</span>
              </label>
              <input
                id="rev-author-name"
                type="text"
                className="review-input"
                placeholder="e.g. Sumanth Rao"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                required
                maxLength={80}
              />
            </div>

            {/* Batch / Cohort (Optional) */}
            <div className="form-group">
              <label htmlFor="rev-batch" className="form-label">
                Batch or Status <span className="optional-tag">(Optional)</span>
              </label>
              <input
                id="rev-batch"
                type="text"
                className="review-input"
                placeholder="e.g. Batch #2026-A1 or Demo Attendee"
                value={batchOrCohort}
                onChange={(e) => setBatchOrCohort(e.target.value)}
                maxLength={60}
              />
            </div>
          </div>

          {/* Course / Program */}
          <div className="form-group">
            <label htmlFor="rev-course" className="form-label">
              Program or Track Enrolled <span className="text-danger">*</span>
            </label>
            <select
              id="rev-course"
              className="review-select"
              value={roleOrCourse}
              onChange={(e) => setRoleOrCourse(e.target.value)}
            >
              {AVAILABLE_COURSES.map((course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </select>
          </div>

          {/* Review Text */}
          <div className="form-group">
            <div className="label-with-counter">
              <label htmlFor="rev-text" className="form-label">
                Your Review &amp; Experience <span className="text-danger">*</span>
              </label>
              <span className="char-counter">{reviewText.length} / 1000</span>
            </div>
            <textarea
              id="rev-text"
              className="review-textarea"
              rows={4}
              placeholder="What stood out to you? Mention our 15-student batch cap, 1-on-1 mock interviews, coding labs, or faculty support..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              required
              maxLength={1000}
            />
          </div>

          {/* Integrity Declaration */}
          <div className="integrity-checkbox-wrap">
            <input
              type="checkbox"
              id="integrity-ack"
              checked={integrityAgreed}
              onChange={(e) => setIntegrityAgreed(e.target.checked)}
            />
            <label htmlFor="integrity-ack" className="integrity-ack-label">
              I certify this review represents an authentic student or demo experience at DP Skill Tech (Strict Zero-Fake-Review Policy).
            </label>
          </div>

          {/* Footer Actions */}
          <div className="review-modal-actions">
            <button
              type="button"
              className="btn-review-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-review-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span>Publishing...</span>
              ) : (
                <>
                  <Send size={16} />
                  <span>Publish Real-Time Review</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
