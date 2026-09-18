import React from 'react';
import {
  Video,
  Users,
  CalendarCheck,
  Clock,
  ShieldCheck
} from 'lucide-react';
import type { CohortBatch, MockInterviewSlot } from '../../../data/portalMockData';
import { TeacherQuickActionBar } from '../components/TeacherQuickActionBar';

interface TeacherOverviewTabProps {
  activeBatch: CohortBatch;
  batchesList: CohortBatch[];
  mockSessions: MockInterviewSlot[];
  pendingSubmissionsCount: number;
  unansweredQuestionsCount: number;
  onLaunchZoom: () => void;
  onOpenMockSlot: () => void;
  onGoToSubmissions: () => void;
  onGoToMaterials: () => void;
  onGoToBatches: () => void;
  onStartMockSession: (slot: MockInterviewSlot) => void;
}

export const TeacherOverviewTab: React.FC<TeacherOverviewTabProps> = ({
  activeBatch,
  batchesList,
  mockSessions,
  pendingSubmissionsCount,
  unansweredQuestionsCount,
  onLaunchZoom,
  onOpenMockSlot,
  onGoToSubmissions,
  onGoToMaterials,
  onGoToBatches,
  onStartMockSession
}) => {
  const bookedMocks = mockSessions.filter((s) => s.status === 'booked');

  return (
    <div className="teacher-overview-flow" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Quick Action Command Center */}
      <TeacherQuickActionBar
        onLaunchZoom={onLaunchZoom}
        onOpenMockSlot={onOpenMockSlot}
        onGoToSubmissions={onGoToSubmissions}
        onGoToMaterials={onGoToMaterials}
        onGoToBatches={onGoToBatches}
        pendingSubmissionsCount={pendingSubmissionsCount}
        unansweredQuestionsCount={unansweredQuestionsCount}
      />

      {/* Live Class Launcher Banner */}
      <section className="teacher-hero-card">
        <div className="teacher-hero-meta">
          <span className="live-status-pill">
            <span className="pulse-dot-green"></span>
            SCHEDULED TONIGHT
          </span>
          <span className="cohort-tag">
            Cohort {activeBatch.code} • {activeBatch.enrolledCount}/{activeBatch.capacity} Students Enrolled
          </span>
        </div>

        <div className="teacher-hero-body">
          <div>
            <h2 className="teacher-class-title">Async I/O &amp; FastAPI Concurrency Patterns</h2>
            <div className="teacher-details-row">
              <span>
                <Clock size={16} /> {activeBatch.timeSlot}
              </span>
              <span>
                <Users size={16} /> {activeBatch.enrolledCount} Active Cohort Students
              </span>
              <span>
                <ShieldCheck size={16} /> Max 15 Capacity Enforced
              </span>
            </div>
          </div>

          <div className="teacher-action-block">
            <a
              href={activeBatch.zoomJoinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="launch-zoom-host-btn"
            >
              <Video size={19} />
              <span>Start Zoom Meeting as Host</span>
            </a>
            <span className="host-note">Cloud recording will automatically attach to student portal</span>
          </div>
        </div>
      </section>

      {/* Quick Metric Cards */}
      <section className="teacher-kpi-grid">
        <div className="teacher-kpi-card" onClick={onGoToBatches} style={{ cursor: 'pointer' }}>
          <span className="kpi-title">Active Batches</span>
          <span className="kpi-val">{batchesList.length}</span>
          <span className="kpi-sub">PY-FS-01 &amp; JV-FS-01 (100% cap compliant)</span>
        </div>

        <div className="teacher-kpi-card">
          <span className="kpi-title">Pending Questions</span>
          <span className="kpi-val text-orange">{unansweredQuestionsCount}</span>
          <span className="kpi-sub">Turnaround target: &lt; 2 hours</span>
        </div>

        <div className="teacher-kpi-card" onClick={onGoToSubmissions} style={{ cursor: 'pointer' }}>
          <span className="kpi-title">Pending Submissions</span>
          <span className="kpi-val text-yellow">{pendingSubmissionsCount}</span>
          <span className="kpi-sub">Code tasks awaiting review</span>
        </div>

        <div className="teacher-kpi-card">
          <span className="kpi-title">Mock Interviews</span>
          <span className="kpi-val text-blue">{bookedMocks.length}</span>
          <span className="kpi-sub">1:1 private slots booked this week</span>
        </div>
      </section>

      {/* Active Cohorts & Mock Interviews Split */}
      <div className="teacher-grid-split">
        {/* Active Cohorts */}
        <div className="teacher-panel">
          <div className="panel-header-row">
            <h3 className="panel-title">
              <Users size={18} />
              <span>Assigned Batches (Max 15 Cap)</span>
            </h3>
            <span className="panel-status-pill">Rule 18 Compliant</span>
          </div>

          <div className="cohorts-list">
            {batchesList.map((batch) => (
              <div key={batch.id} className="cohort-card">
                <div className="cohort-card-top">
                  <h4 className="cohort-name">
                    {batch.courseTitle} ({batch.code})
                  </h4>
                  <span className="cohort-capacity-badge">
                    {batch.enrolledCount} / {batch.capacity} Enrolled
                  </span>
                </div>
                <div className="cohort-capacity-bar">
                  <div
                    className="capacity-fill"
                    style={{ width: `${(batch.enrolledCount / batch.capacity) * 100}%` }}
                  ></div>
                </div>
                <div className="cohort-meta-row">
                  <span>
                    Schedule: <strong>{batch.timeSlot}</strong>
                  </span>
                  <span>
                    Cadence: <strong>{batch.scheduleDays}</strong>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mock Interview Slots */}
        <div className="teacher-panel">
          <div className="panel-header-row">
            <h3 className="panel-title">
              <CalendarCheck size={18} />
              <span>1-on-1 Mock Interview Schedule</span>
            </h3>
            <span className="panel-badge-orange">Private Sessions</span>
          </div>

          <div className="interview-slots-list">
            {bookedMocks.length > 0 ? (
              bookedMocks.map((slot) => (
                <div key={slot.id} className="interview-slot-row">
                  <div className="slot-info">
                    <span className="slot-type-pill">{slot.category}</span>
                    <h4>Candidate: {slot.bookedStudentName}</h4>
                    <span>
                      {slot.date} • {slot.time}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="btn-start-interview"
                    onClick={() => onStartMockSession(slot)}
                  >
                    Start 1:1 Room
                  </button>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#64748b', fontSize: '0.84rem' }}>
                No active 1-on-1 bookings pending right now.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
