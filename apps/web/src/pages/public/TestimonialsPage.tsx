import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  MessageSquareQuote,
  AlertCircle,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Star,
  Trash2
} from 'lucide-react';
import './TestimonialsPage.css';
import { TESTIMONIALS_DATA } from '../../data/testimonialsData';
import { reviewService, type Review } from '../../services/reviewService';
import { ReviewModal } from '../../components/modals/ReviewModal';
import { useAuth } from '../../context/AuthContext';

interface TestimonialsPageProps {
  onNavigate: (page: string) => void;
  onOpenDemoModal: () => void;
}

export const TestimonialsPage: React.FC<TestimonialsPageProps> = ({ onNavigate, onOpenDemoModal }) => {
  const { role } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  useEffect(() => {
    reviewService.fetchReviews().then((data) => {
      if (data && data.length > 0) {
        setReviews(data);
      }
    });
  }, []);

  const handleReviewSubmitted = (newReview: Review) => {
    setReviews((prev) => [newReview, ...prev.filter((r) => r.id !== newReview.id)]);
  };

  const handleDeleteReview = async (id: string, authorName: string) => {
    if (window.confirm(`Admin Action: Permanently delete review by "${authorName}"?`)) {
      await reviewService.deleteReview(id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
    }
  };

  return (
    <div className="testimonials-page">
      {/* Hero Header */}
      <section className="testimonials-hero">
        <div className="container text-center">
          <span className="section-tag">Authenticity &amp; Integrity Policy</span>
          <h1 className="testimonials-hero-title">Student &amp; Alumni Feedback</h1>
          <p className="testimonials-hero-desc">
            At DP Skill Tech, trust is earned through genuine engineering depth, not fabricated placement claims or paid actor reviews. Anyone who learns with us can share an authentic review.
          </p>

          <div className="testi-hero-actions-row mt-4">
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={() => setIsReviewModalOpen(true)}
            >
              <Star size={18} fill="#ffffff" />
              <span>Write a Real Review</span>
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-lg"
              onClick={onOpenDemoModal}
            >
              <Sparkles size={18} />
              <span>Attend Free Live Demo</span>
            </button>
          </div>
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
              <h3>Our Strict Zero-Fake-Review Commitment (Rule 22)</h3>
              <p>
                In compliance with project integrity guidelines, DP Skilltech will only display authentic, verifiable reviews from verified students who participate in our 15-student live batches or demo labs. Submitted reviews appear live below in real-time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Real-Time Community Reviews Grid */}
      <section className="section-py real-reviews-section">
        <div className="container">
          <div className="section-editorial-header text-center mb-4">
            <span className="editorial-tag">Real-Time Community Feed</span>
            <h2 className="editorial-title">Verified Learner Reviews</h2>
            <p className="editorial-subtitle">
              Authentic feedback submitted directly by enrolled students, alumni, and demo participants.
            </p>
          </div>

          <div className="real-reviews-grid">
            {reviews.map((rev) => (
              <div key={rev.id} className="real-review-card card">
                <div className="real-card-top">
                  <div className="stars-row">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={17}
                        fill={s <= rev.rating ? '#f59e0b' : 'none'}
                        color={s <= rev.rating ? '#f59e0b' : '#cbd5e1'}
                      />
                    ))}
                    <span className="star-score-text">{rev.rating}.0 / 5.0</span>
                  </div>

                  <div className="real-card-badges">
                    <span className="testi-badge">{rev.batchOrCohort || 'Verified Learner'}</span>
                    {role === 'ADMIN' && (
                      <button
                        type="button"
                        className="btn-admin-del-card"
                        onClick={() => handleDeleteReview(rev.id, rev.authorName)}
                        title="Admin Action: Delete Review"
                      >
                        <Trash2 size={13} />
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="quote-icon-wrap-sm">
                  <MessageSquareQuote size={24} />
                </div>

                <p className="real-review-text">"{rev.reviewText}"</p>

                <div className="real-review-author-box">
                  <div className="author-avatar-initials">
                    {rev.authorName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="author-name-text">{rev.authorName}</div>
                    <div className="author-role-sub">
                      {rev.roleOrCourse} •{' '}
                      {new Date(rev.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Ongoing Cohort Placeholders Grid */}
      <section className="section-py placeholders-section">
        <div className="container">
          <div className="section-editorial-header text-center mb-4">
            <span className="editorial-tag">Batch Progress Trackers</span>
            <h2 className="editorial-title">Ongoing Cohort Status</h2>
            <p className="editorial-subtitle">
              Our 15-student batches progress through lectures, sandboxed challenges, and 1-on-1 mock interviews.
            </p>
          </div>

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

      {/* Review Modal Dialog */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onReviewSubmitted={handleReviewSubmitted}
      />
    </div>
  );
};
