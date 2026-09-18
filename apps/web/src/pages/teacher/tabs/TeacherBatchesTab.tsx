import React from 'react';
import {
  Video,
  Eye
} from 'lucide-react';
import type { CohortBatch } from '../../../data/portalMockData';

interface TeacherBatchesTabProps {
  batchesList: CohortBatch[];
  onOpenRoster: (batch: CohortBatch) => void;
  onLaunchZoom: (batch: CohortBatch) => void;
}

export const TeacherBatchesTab: React.FC<TeacherBatchesTabProps> = ({
  batchesList,
  onOpenRoster,
  onLaunchZoom
}) => {
  return (
    <div className="teacher-panel">
      <div className="panel-header-row">
        <div>
          <h3 className="panel-title">Active Cohorts &amp; 15-Student Roster Governance</h3>
          <p className="panel-subtext">
            Rule 18 &amp; 19: DP Skilltech instructors manage batches capped at 15 students to ensure direct code screen-sharing and hands-on guidance.
          </p>
        </div>
        <span className="panel-status-pill">100% Compliant</span>
      </div>

      <div className="cohorts-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
        {batchesList.map((batch) => {
          const isFull = batch.enrolledCount >= 15;
          const isNearCap = batch.enrolledCount >= 12 && !isFull;

          return (
            <div
              key={batch.id}
              className="cohort-card"
              style={{
                background: '#ffffff',
                border: '1.5px solid #e2e8f0',
                borderRadius: '10px',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem'
              }}
            >
              <div className="cohort-card-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span className="code-badge" style={{ marginBottom: '0.35rem', display: 'inline-block' }}>
                    {batch.code}
                  </span>
                  <h4 className="cohort-name" style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
                    {batch.courseTitle}
                  </h4>
                </div>
                <span
                  className={`batch-cap-indicator ${
                    isFull ? 'cap-full' : isNearCap ? 'cap-warning' : 'cap-normal'
                  }`}
                >
                  {batch.enrolledCount} / {batch.capacity} Students
                </span>
              </div>

              {/* Progress bar */}
              <div className="batch-progress-bar-wrap">
                <div
                  className={`batch-progress-bar-fill ${
                    isFull ? 'fill-full' : isNearCap ? 'fill-warning' : 'fill-normal'
                  }`}
                  style={{ width: `${(batch.enrolledCount / batch.capacity) * 100}%` }}
                ></div>
              </div>

              {/* Batch Metadata */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.5rem',
                  fontSize: '0.78rem',
                  color: '#475569',
                  background: '#f8fafc',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '6px'
                }}
              >
                <div>
                  <span style={{ display: 'block', color: '#94a3b8', fontSize: '0.7rem' }}>DAILY TIMING</span>
                  <strong>{batch.timeSlot}</strong>
                </div>
                <div>
                  <span style={{ display: 'block', color: '#94a3b8', fontSize: '0.7rem' }}>DAYS</span>
                  <strong>{batch.scheduleDays}</strong>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.25rem' }}>
                <button
                  type="button"
                  className="btn-admin-secondary"
                  style={{ flex: 1, padding: '0.45rem 0.75rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  onClick={() => onOpenRoster(batch)}
                >
                  <Eye size={14} />
                  <span>View 15 Roster</span>
                </button>

                <button
                  type="button"
                  className="btn-admin-primary"
                  style={{ flex: 1, padding: '0.45rem 0.75rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  onClick={() => onLaunchZoom(batch)}
                >
                  <Video size={14} />
                  <span>Start Zoom</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
