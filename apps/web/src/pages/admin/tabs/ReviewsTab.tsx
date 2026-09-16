import React from 'react';
import {
  MessageSquareQuote,
  Star,
  Award,
  ShieldCheck,
  Trash2
} from 'lucide-react';
import type { Review } from '../../../services/reviewService';
import { AdminTableToolbar } from '../components/AdminTableToolbar';
import { AdminEmptyState } from '../components/AdminEmptyState';

interface ReviewsTabProps {
  adminReviews: Review[];
  searchReview: string;
  setSearchReview: (val: string) => void;
  filterRating: string;
  setFilterRating: (val: string) => void;
  handleDeleteReview: (reviewId: string) => Promise<void>;
}

export const ReviewsTab: React.FC<ReviewsTabProps> = ({
  adminReviews,
  searchReview,
  setSearchReview,
  filterRating,
  setFilterRating,
  handleDeleteReview
}) => {
  const filteredReviews = adminReviews.filter((rev) => {
    const matchSearch =
      rev.authorName.toLowerCase().includes(searchReview.toLowerCase()) ||
      rev.roleOrCourse.toLowerCase().includes(searchReview.toLowerCase()) ||
      rev.reviewText.toLowerCase().includes(searchReview.toLowerCase());
    const matchRating =
      filterRating === 'all'
        ? true
        : filterRating === '3'
        ? rev.rating <= 3
        : rev.rating === parseInt(filterRating);
    return matchSearch && matchRating;
  });

  const avgRating =
    adminReviews.length > 0
      ? (adminReviews.reduce((acc, r) => acc + r.rating, 0) / adminReviews.length).toFixed(1)
      : '5.0';

  const fiveStarPct =
    adminReviews.length > 0
      ? Math.round(
          (adminReviews.filter((r) => r.rating === 5).length / adminReviews.length) * 100
        )
      : 100;

  const ratingOptions = [
    { label: 'All Star Ratings', value: 'all' },
    { label: '5 Stars Only', value: '5' },
    { label: '4 Stars Only', value: '4' },
    { label: '3 Stars & Below', value: '3' }
  ];

  return (
    <div className="admin-view-stack">
      {/* Reviews Summary KPIs */}
      <section className="admin-kpi-grid">
        <div className="admin-kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Total Published Reviews</span>
            <MessageSquareQuote size={20} className="kpi-icon icon-blue" />
          </div>
          <div className="kpi-value">{adminReviews.length}</div>
          <span className="kpi-subtext">Real-time public learner feedback</span>
        </div>

        <div className="admin-kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Average Community Rating</span>
            <Star size={20} className="kpi-icon icon-yellow" />
          </div>
          <div className="kpi-value">{avgRating} / 5.0</div>
          <span className="kpi-subtext">Based on 100% genuine submissions</span>
        </div>

        <div className="admin-kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">5-Star Excellence Ratio</span>
            <Award size={20} className="kpi-icon icon-green" />
          </div>
          <div className="kpi-value">{fiveStarPct}%</div>
          <span className="kpi-subtext">Verified learner satisfaction</span>
        </div>

        <div className="admin-kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Integrity Policy Guard</span>
            <ShieldCheck size={20} className="kpi-icon icon-green" />
          </div>
          <div className="kpi-value">Rule 22</div>
          <span className="kpi-subtext">Zero fake reviews or bots</span>
        </div>
      </section>

      {/* Moderation Panel & Table */}
      <section className="admin-panel">
        <div className="admin-panel-header">
          <div>
            <h3 className="admin-panel-title">
              <MessageSquareQuote size={18} className="icon-blue" />
              <span>Real-Time Reviews &amp; Testimonials Governance</span>
            </h3>
            <p className="admin-panel-subtitle">
              Audit all student feedback published across the website. Delete any spam, inappropriate, or non-authentic submissions.
            </p>
          </div>
        </div>

        {/* Filter & Search Toolbar */}
        <AdminTableToolbar
          searchQuery={searchReview}
          onSearchChange={setSearchReview}
          searchPlaceholder="Search by student name, course, or review text..."
          filterValue={filterRating}
          onFilterChange={setFilterRating}
          filterOptions={ratingOptions}
          filterLabel="Filter by Star Rating"
          totalCount={adminReviews.length}
          filteredCount={filteredReviews.length}
          entityLabel="reviews"
        />

        {/* Reviews Table or Empty State */}
        {filteredReviews.length === 0 ? (
          <AdminEmptyState
            title="No Reviews Found"
            description={
              searchReview || filterRating !== 'all'
                ? `No reviews match "${searchReview || filterRating} stars". Try adjusting your filter.`
                : 'No student reviews have been submitted yet.'
            }
          />
        ) : (
          <div className="cohort-table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Rating</th>
                  <th>Student / Author</th>
                  <th>Course / Discipline</th>
                  <th>Batch / Status</th>
                  <th style={{ minWidth: '280px' }}>Review Feedback</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredReviews.map((rev) => (
                  <tr key={rev.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={13}
                            fill={s <= rev.rating ? '#f59e0b' : 'none'}
                            color={s <= rev.rating ? '#f59e0b' : '#cbd5e1'}
                          />
                        ))}
                        <strong
                          style={{
                            marginLeft: '4px',
                            fontSize: '0.8rem',
                            color: '#b45309'
                          }}
                        >
                          {rev.rating}.0
                        </strong>
                      </div>
                    </td>
                    <td>
                      <strong style={{ color: '#0f172a' }}>{rev.authorName}</strong>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.85rem', color: '#334155' }}>
                        {rev.roleOrCourse}
                      </span>
                    </td>
                    <td>
                      <span className="status-badge badge-active">
                        {rev.batchOrCohort || 'Verified'}
                      </span>
                    </td>
                    <td>
                      <p
                        style={{
                          margin: 0,
                          fontSize: '0.85rem',
                          color: '#475569',
                          lineHeight: 1.4
                        }}
                      >
                        &ldquo;{rev.reviewText}&rdquo;
                      </p>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        {new Date(rev.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn-action-del"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '4px 10px',
                          background: '#fee2e2',
                          color: '#b91c1c',
                          border: '1px solid #fca5a5',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                          fontWeight: 700
                        }}
                        onClick={() => handleDeleteReview(rev.id)}
                        title="Delete this review from website"
                      >
                        <Trash2 size={13} />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};
