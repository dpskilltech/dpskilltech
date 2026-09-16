import React from 'react';
import {
  Plus,
  UserPlus,
  Video,
  Briefcase,
  Award,
  Sparkles
} from 'lucide-react';

interface AdminQuickActionBarProps {
  onCreateCohort: () => void;
  onEnrollStudent: () => void;
  onAddCoach: () => void;
  onScheduleClass: () => void;
  onIssueCertificate: () => void;
}

export const AdminQuickActionBar: React.FC<AdminQuickActionBarProps> = ({
  onCreateCohort,
  onEnrollStudent,
  onAddCoach,
  onScheduleClass,
  onIssueCertificate
}) => {
  return (
    <div className="admin-quick-action-bar">
      <div className="quick-action-left">
        <div className="quick-action-tag">
          <Sparkles size={14} className="icon-sparkle text-orange" />
          <span>Quick Actions</span>
        </div>
        <p className="quick-action-hint">
          Execute essential academy operations in one click:
        </p>
      </div>

      <div className="quick-action-buttons">
        <button
          type="button"
          className="quick-action-btn btn-cohort"
          onClick={onCreateCohort}
          title="Create a new 15-student cohort"
        >
          <Plus size={15} />
          <span>New Cohort</span>
          <span className="btn-mini-badge">15 Cap</span>
        </button>

        <button
          type="button"
          className="quick-action-btn"
          onClick={onEnrollStudent}
          title="Enroll student and generate secure credentials"
        >
          <UserPlus size={15} />
          <span>Enroll Student</span>
        </button>

        <button
          type="button"
          className="quick-action-btn"
          onClick={onAddCoach}
          title="Onboard verified practitioner faculty"
        >
          <Briefcase size={15} />
          <span>Onboard Coach</span>
        </button>

        <button
          type="button"
          className="quick-action-btn"
          onClick={onScheduleClass}
          title="Schedule live Zoom lecture session"
        >
          <Video size={15} />
          <span>Schedule Class</span>
        </button>

        <button
          type="button"
          className="quick-action-btn btn-cert"
          onClick={onIssueCertificate}
          title="Issue tamper-proof completion certificate"
        >
          <Award size={15} />
          <span>Issue Certificate</span>
        </button>
      </div>
    </div>
  );
};
