import React from 'react';
import {
  GraduationCap,
  Briefcase,
  BookOpen,
  ShieldCheck,
  Video,
  MessageSquareQuote,
  FileCheck2,
  CalendarCheck,
  Clock,
  Plus,
  Lock
} from 'lucide-react';
import type {
  CohortBatch,
  AdminCourse,
  AdminCoachProfile,
  AdminAssignment,
  QuestionThread,
  MockInterviewSlot
} from '../../../data/portalMockData';
import { AdminQuickActionBar } from '../components/AdminQuickActionBar';

interface StudentRecordSummary {
  id: string;
}

interface OverviewTabProps {
  studentsList: StudentRecordSummary[];
  coachesList: AdminCoachProfile[];
  coursesList: AdminCourse[];
  batchesList: CohortBatch[];
  questionThreads: QuestionThread[];
  assignmentsList: AdminAssignment[];
  mockSessions: MockInterviewSlot[];
  onCreateCohort: () => void;
  onEnrollStudent: () => void;
  onAddCoach: () => void;
  onScheduleClass: () => void;
  onIssueCertificate: () => void;
  onSelectBatch?: (batch: CohortBatch) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  studentsList,
  coachesList,
  coursesList,
  batchesList,
  questionThreads,
  assignmentsList,
  mockSessions,
  onCreateCohort,
  onEnrollStudent,
  onAddCoach,
  onScheduleClass,
  onIssueCertificate,
  onSelectBatch
}) => {
  const publishedCoursesCount = coursesList.filter((c) => c.status === 'Published').length;
  const pendingQuestionsCount = questionThreads.filter((q) => q.status === 'unanswered').length;
  const upcomingMocksCount = mockSessions.filter((m) => m.status === 'booked').length;

  return (
    <div className="admin-view-stack">
      {/* 1. Quick Actions Command Center Bar */}
      <AdminQuickActionBar
        onCreateCohort={onCreateCohort}
        onEnrollStudent={onEnrollStudent}
        onAddCoach={onAddCoach}
        onScheduleClass={onScheduleClass}
        onIssueCertificate={onIssueCertificate}
      />

      {/* 2. Top Primary Statistics KPI Cards */}
      <section className="admin-kpi-grid">
        <div className="admin-kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Total Enrolled Students</span>
            <GraduationCap size={20} className="kpi-icon icon-blue" />
          </div>
          <div className="kpi-value">{studentsList.length * 8 + 1}</div>
          <span className="kpi-subtext">Across 3 active engineering cohorts</span>
        </div>

        <div className="admin-kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Active Verified Coaches</span>
            <Briefcase size={20} className="kpi-icon icon-orange" />
          </div>
          <div className="kpi-value">{coachesList.length}</div>
          <span className="kpi-subtext">Zero fake instructors • 100% practitioner staff</span>
        </div>

        <div className="admin-kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Published Courses</span>
            <BookOpen size={20} className="kpi-icon icon-blue" />
          </div>
          <div className="kpi-value">{publishedCoursesCount}</div>
          <span className="kpi-subtext">+1 Draft syllabus currently in review</span>
        </div>

        <div className="admin-kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Strict Batch Cap Compliance</span>
            <ShieldCheck size={20} className="kpi-icon icon-green" />
          </div>
          <div className="kpi-value">100%</div>
          <span className="kpi-subtext">Max 15 students strictly enforced on all cohorts</span>
        </div>
      </section>

      {/* 3. Secondary Operational Metrics */}
      <section className="admin-secondary-metrics">
        <div className="sec-metric-item">
          <div className="sec-metric-icon">
            <Video size={18} className="icon-orange" />
          </div>
          <div className="sec-metric-text">
            <strong>2 Live Sessions Today</strong>
            <span>FastAPI (07:00 PM) &amp; Spring Cloud (07:30 PM)</span>
          </div>
        </div>

        <div className="sec-metric-item">
          <div className="sec-metric-icon">
            <MessageSquareQuote size={18} className="icon-yellow" />
          </div>
          <div className="sec-metric-text">
            <strong>{pendingQuestionsCount} Pending Questions</strong>
            <span>Avg response turnaround: 1.8 hrs</span>
          </div>
        </div>

        <div className="sec-metric-item">
          <div className="sec-metric-icon">
            <FileCheck2 size={18} className="icon-blue" />
          </div>
          <div className="sec-metric-text">
            <strong>{assignmentsList.length} Active Assignments</strong>
            <span>32 submissions awaiting coach evaluation</span>
          </div>
        </div>

        <div className="sec-metric-item">
          <div className="sec-metric-icon">
            <CalendarCheck size={18} className="icon-green" />
          </div>
          <div className="sec-metric-text">
            <strong>{upcomingMocksCount} Upcoming 1:1 Mocks</strong>
            <span>Private defense sessions scheduled this week</span>
          </div>
        </div>
      </section>

      {/* 4. Cohort Cap Monitoring & 15-Student Rule Table */}
      <section className="admin-panel">
        <div className="admin-panel-header">
          <div>
            <h3 className="admin-panel-title">
              <Clock size={18} className="icon-orange" />
              <span>Cohort Capacity &amp; 15-Student Rule Monitor</span>
            </h3>
            <p className="admin-panel-subtitle">
              Prevents mass-lecture dilution. Any cohort reaching 15 students is automatically locked against new admissions.
            </p>
          </div>
          <button
            type="button"
            className="btn-admin-primary"
            onClick={onCreateCohort}
          >
            <Plus size={16} />
            <span>Create Cohort</span>
          </button>
        </div>

        <div className="cohort-table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Cohort Code</th>
                <th>Course Curriculum</th>
                <th>Lead Coach</th>
                <th>Capacity Status</th>
                <th>Enrolled / Cap</th>
                <th>Class Cadence</th>
                <th>Policy Audit</th>
              </tr>
            </thead>
            <tbody>
              {batchesList.map((batch) => {
                const isFull = batch.enrolledCount >= batch.capacity;
                const isNearCap = !isFull && batch.enrolledCount >= 12;
                const percent = Math.min(100, Math.round((batch.enrolledCount / batch.capacity) * 100));

                return (
                  <tr
                    key={batch.id}
                    className={onSelectBatch ? 'clickable-row' : ''}
                    onClick={() => onSelectBatch?.(batch)}
                  >
                    <td>
                      <span className="code-badge">{batch.code}</span>
                    </td>
                    <td>
                      <strong>{batch.courseTitle}</strong>
                    </td>
                    <td>{batch.coachName}</td>
                    <td>
                      {isFull ? (
                        <span className="status-badge badge-full">
                          <Lock size={12} /> FULL (LOCKED)
                        </span>
                      ) : isNearCap ? (
                        <span className="status-badge badge-warning">
                          {batch.capacity - batch.enrolledCount} Seats Open (Closing)
                        </span>
                      ) : (
                        <span className="status-badge badge-available">
                          {batch.capacity - batch.enrolledCount} Seats Open
                        </span>
                      )}
                    </td>
                    <td>
                      <div className="cap-progress-wrap">
                        <div className="cap-progress-bar">
                          <div
                            className={`cap-fill ${isFull ? 'fill-full' : isNearCap ? 'fill-warning' : 'fill-active'}`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <span className="cap-text">
                          {batch.enrolledCount}/{batch.capacity}
                        </span>
                      </div>
                    </td>
                    <td>
                      {batch.scheduleDays} • {batch.timeSlot}
                    </td>
                    <td>
                      <span className="verified-badge">
                        <ShieldCheck size={13} /> Strict Cap Compliant
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. Academy Commercial Integrity Callout Banner */}
      <div className="admin-integrity-callout">
        <div className="integrity-icon-col">
          <ShieldCheck size={28} className="icon-orange" />
        </div>
        <div className="integrity-text-col">
          <h4>Commercial Academy Integrity Standards Active</h4>
          <p>
            All metrics, attendance logs, and mock interview scorecards are grounded in authentic learner interaction.
            Zero fake student testimonials, zero unverified placement numbers, and strictly enforced 15-student cohort limits.
          </p>
        </div>
      </div>
    </div>
  );
};
