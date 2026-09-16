import React from 'react';
import {
  Plus,
  Briefcase,
  FileCheck2,
  Award,
  Key,
  Mail
} from 'lucide-react';
import type { AdminCoachProfile } from '../../../data/portalMockData';

interface CoachesTabProps {
  coachesList: AdminCoachProfile[];
  setShowAddCoachModal: (val: boolean) => void;
  setResetTarget: (target: any) => void;
  setResetNewPassword: (password: string) => void;
  setShowResetPasswordModal: (val: boolean) => void;
  generateStrongPassword: () => string;
  handleResendCredentials: (data: any) => Promise<void>;
}

export const CoachesTab: React.FC<CoachesTabProps> = ({
  coachesList,
  setShowAddCoachModal,
  setResetTarget,
  setResetNewPassword,
  setShowResetPasswordModal,
  generateStrongPassword,
  handleResendCredentials
}) => {
  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <div>
          <h3 className="admin-panel-title">
            <Briefcase size={18} className="icon-orange" />
            <span>Faculty &amp; Engineering Coaches Directory</span>
          </h3>
          <p className="admin-panel-subtitle">
            Rule 22: Lead instructors are active software practitioners. Zero fabricated credentials or artificial profiles.
          </p>
        </div>
        <button
          type="button"
          className="btn-admin-primary"
          onClick={() => setShowAddCoachModal(true)}
        >
          <Plus size={16} />
          <span>Add Faculty Coach</span>
        </button>
      </div>

      <div className="coaches-cards-grid">
        {coachesList.map((coach) => (
          <div key={coach.id} className="coach-profile-card">
            <div className="coach-card-header">
              <div className="coach-avatar-badge">
                {coach.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)}
              </div>
              <div>
                <h4>{coach.name}</h4>
                <span className="coach-spec-label">{coach.specialization}</span>
              </div>
            </div>

            <div className="coach-contact-snippet">
              <span>{coach.email}</span> • <span>{coach.phone}</span>
            </div>

            <div className="coach-stats-row">
              <div>
                <strong>{coach.assignedBatches.join(', ') || 'Unassigned'}</strong>
                <span>Assigned Batch</span>
              </div>
              <div>
                <strong>{coach.completedClassesCount}</strong>
                <span>Classes Held</span>
              </div>
              <div>
                <strong>{coach.questionsAnswered}</strong>
                <span>Q&amp;A Answers</span>
              </div>
              <div>
                <strong>{coach.rating}/5.0</strong>
                <span>Rating</span>
              </div>
            </div>

            <div className="coach-extra-metrics">
              <div className="metric-chip">
                <FileCheck2 size={13} />
                <span>{coach.assignmentsReviewed} Assignments Reviewed</span>
              </div>
              <div className="metric-chip">
                <Award size={13} />
                <span>{coach.mockInterviewsConducted} Mock 1:1 Defenses</span>
              </div>
            </div>

            <div
              className="coach-card-actions-strip"
              style={{
                marginTop: '0.85rem',
                display: 'flex',
                gap: '0.5rem',
                borderTop: '1px solid var(--gray-200)',
                paddingTop: '0.75rem'
              }}
            >
              <button
                type="button"
                className="btn-tbl-action btn-reset-action"
                style={{ flex: 1 }}
                title="Reset faculty login password"
                onClick={() => {
                  setResetTarget({
                    role: 'TEACHER',
                    id: coach.id,
                    name: coach.name,
                    email: coach.email,
                    courseOrBatch: coach.specialization
                  });
                  setResetNewPassword(generateStrongPassword());
                  setShowResetPasswordModal(true);
                }}
              >
                <Key size={13} />
                <span>Reset Password</span>
              </button>
              <button
                type="button"
                className="btn-tbl-action btn-resend-action"
                title="Resend faculty credentials via email"
                onClick={() =>
                  handleResendCredentials({
                    role: 'TEACHER',
                    name: coach.name,
                    email: coach.email,
                    courseOrBatch: coach.specialization
                  })
                }
              >
                <Mail size={13} />
                <span>Resend Email</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
