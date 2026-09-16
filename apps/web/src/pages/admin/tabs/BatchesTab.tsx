import React from 'react';
import {
  Plus,
  Lock,
  CalendarCheck,
  Video,
  Clock
} from 'lucide-react';
import type { CohortBatch } from '../../../data/portalMockData';

interface BatchesTabProps {
  batchesList: CohortBatch[];
  setShowCreateBatchModal: (val: boolean) => void;
  setAssignClassBatch: (batch: CohortBatch) => void;
  setNextClassTopic: (topic: string) => void;
  setNextClassCoach: (coach: string) => void;
  setNextClassTime: (time: string) => void;
  setShowAssignNextClassModal: (val: boolean) => void;
  setFilterBatch: (batchCode: string) => void;
  setActiveTab: (tab: string) => void;
}

export const BatchesTab: React.FC<BatchesTabProps> = ({
  batchesList,
  setShowCreateBatchModal,
  setAssignClassBatch,
  setNextClassTopic,
  setNextClassCoach,
  setNextClassTime,
  setShowAssignNextClassModal,
  setFilterBatch,
  setActiveTab
}) => {
  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <div>
          <h3 className="admin-panel-title">
            <Clock size={18} className="icon-orange" />
            <span>Batch Capacity Governance (Strict 15-Student Rule)</span>
          </h3>
          <p className="admin-panel-subtitle">
            Rule 10 &amp; 18: Every batch is hard-capped at 15 students. When full, admission closes automatically to preserve personalized attention.
          </p>
        </div>
        <button
          type="button"
          className="btn-admin-primary"
          onClick={() => setShowCreateBatchModal(true)}
        >
          <Plus size={16} />
          <span>Create New Cohort</span>
        </button>
      </div>

      <div className="cohort-cards-grid">
        {batchesList.map((b) => {
          const isFull = b.enrolledCount >= b.capacity;
          const isNearCap = !isFull && b.enrolledCount >= 12;
          const percent = Math.min(100, Math.round((b.enrolledCount / b.capacity) * 100));

          return (
            <div key={b.id} className="admin-cohort-box">
              <div className="box-top">
                <span className="code-badge">{b.code}</span>
                <span className={isFull ? 'badge-full' : isNearCap ? 'badge-warning' : 'badge-available'}>
                  {isFull ? (
                    <>
                      <Lock size={12} /> LOCKED (15/15 FULL)
                    </>
                  ) : isNearCap ? (
                    `${b.capacity - b.enrolledCount} Seats Open (Closing Soon)`
                  ) : (
                    `${b.capacity - b.enrolledCount} Seats Open`
                  )}
                </span>
              </div>
              <h4 className="batch-box-title">{b.courseTitle}</h4>
              <p className="batch-box-coach">
                Lead Coach: <strong>{b.coachName}</strong>
              </p>

              <div className="cap-progress-wrap">
                <div className="cap-progress-bar">
                  <div
                    className={`cap-fill ${isFull ? 'fill-full' : isNearCap ? 'fill-warning' : 'fill-active'}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="cap-text">
                  {b.enrolledCount} / {b.capacity} Students Enrolled
                </span>
              </div>

              <div className="box-meta">
                <span>
                  <strong>Days:</strong> {b.scheduleDays}
                </span>
                <span>
                  <strong>Timing:</strong> {b.timeSlot}
                </span>
              </div>

              {b.nextTopic && (
                <div className="batch-next-class-pill">
                  <Video size={13} />
                  <span>
                    Next: <strong>{b.nextTopic}</strong>
                  </span>
                </div>
              )}

              <div className="box-footer-row">
                <button
                  type="button"
                  className="btn-tbl-action btn-assign-class"
                  onClick={() => {
                    setAssignClassBatch(b);
                    setNextClassTopic(b.nextTopic || '');
                    setNextClassCoach(b.coachName || 'Dr. Rajesh Verma');
                    setNextClassTime(b.timeSlot || '07:00 PM – 08:30 PM IST');
                    setShowAssignNextClassModal(true);
                  }}
                >
                  <CalendarCheck size={14} />
                  <span>Assign Next Class</span>
                </button>
                <button
                  type="button"
                  className="btn-tbl-action"
                  onClick={() => {
                    setFilterBatch(b.code);
                    setActiveTab('students');
                  }}
                >
                  View {b.enrolledCount} Students &rarr;
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
