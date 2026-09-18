import React from 'react';
import {
  Video,
  CalendarCheck,
  FileCheck2,
  BookOpen,
  Users,
  Sparkles
} from 'lucide-react';

interface TeacherQuickActionBarProps {
  onLaunchZoom: () => void;
  onOpenMockSlot: () => void;
  onGoToSubmissions: () => void;
  onGoToMaterials: () => void;
  onGoToBatches: () => void;
  pendingSubmissionsCount?: number;
  unansweredQuestionsCount?: number;
}

export const TeacherQuickActionBar: React.FC<TeacherQuickActionBarProps> = ({
  onLaunchZoom,
  onOpenMockSlot,
  onGoToSubmissions,
  onGoToMaterials,
  onGoToBatches,
  pendingSubmissionsCount = 3,
  unansweredQuestionsCount = 1
}) => {
  return (
    <div className="admin-quick-action-bar">
      <div className="quick-action-header">
        <div className="quick-action-title">
          <Sparkles size={16} style={{ color: 'var(--brand-orange)' }} />
          <span>Instructor Command Center</span>
        </div>
        <span className="quick-action-badge">Faculty Operations</span>
      </div>

      <div className="quick-action-buttons">
        <button
          type="button"
          className="quick-action-btn btn-action-primary"
          onClick={onLaunchZoom}
          title="Start daily live Zoom classroom session as host"
        >
          <Video size={16} />
          <span>Start Live Class (Host)</span>
        </button>

        <button
          type="button"
          className="quick-action-btn btn-action-secondary"
          onClick={onOpenMockSlot}
          title="Schedule new 1-on-1 private mock interview availability"
        >
          <CalendarCheck size={16} className="text-green" />
          <span>+ Open Mock Slot</span>
        </button>

        <button
          type="button"
          className="quick-action-btn btn-action-secondary"
          onClick={onGoToSubmissions}
          title="Review and grade pending student assignments"
        >
          <FileCheck2 size={16} className="text-orange" />
          <span>Grade Submissions</span>
          {pendingSubmissionsCount > 0 && (
            <span className="btn-mini-badge" style={{ background: '#fef3c7', color: '#b45309' }}>
              {pendingSubmissionsCount} Pending
            </span>
          )}
        </button>

        <button
          type="button"
          className="quick-action-btn btn-action-secondary"
          onClick={onGoToMaterials}
          title="Distribute lecture slides, code repositories, and notes"
        >
          <BookOpen size={16} className="text-blue" />
          <span>Share Materials</span>
        </button>

        <button
          type="button"
          className="quick-action-btn btn-action-secondary"
          onClick={onGoToBatches}
          title="Inspect assigned cohort batch capacities and 15-cap governance"
        >
          <Users size={16} />
          <span>Assigned Batches (15 Cap)</span>
          {unansweredQuestionsCount > 0 && (
            <span className="btn-mini-badge" style={{ background: '#eff6ff', color: '#1d4ed8' }}>
              {unansweredQuestionsCount} Q&A
            </span>
          )}
        </button>
      </div>
    </div>
  );
};
