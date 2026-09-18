import React, { useState } from 'react';
import { X, Award, CheckCircle2 } from 'lucide-react';
import type { MockInterviewSlot } from '../../../data/portalMockData';

interface MockEvaluationModalProps {
  slot: MockInterviewSlot | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitEvaluation: (slotId: string, status: 'completed', score: number, remarks: string, outcome: 'pass' | 'fail' | 'needs_revision') => void;
}

export const MockEvaluationModal: React.FC<MockEvaluationModalProps> = ({
  slot,
  isOpen,
  onClose,
  onSubmitEvaluation
}) => {
  const [outcome, setOutcome] = useState<'pass' | 'fail' | 'needs_revision'>('pass');
  const [score, setScore] = useState<number>(8.5);
  const [remarks, setRemarks] = useState<string>(
    'Demonstrated solid grasp of concurrency patterns and async programming. Code walkthrough was structured and clear.'
  );

  if (!isOpen || !slot) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitEvaluation(slot.id, 'completed', score, remarks, outcome);
    onClose();
  };

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div
        className="admin-modal-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '520px' }}
      >
        <div className="dialog-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={18} style={{ color: 'var(--brand-orange)' }} />
              <h3 style={{ margin: 0 }}>Mock Interview Evaluation</h3>
            </div>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.82rem', color: 'var(--gray-500)' }}>
              Candidate: <strong>{slot.bookedStudentName || 'Student'}</strong> • {slot.category}
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="dialog-body">
            {/* Outcome Selection */}
            <div className="form-group">
              <label className="form-label">Interview Outcome / Decision *</label>
              <select
                className="form-input"
                value={outcome}
                onChange={(e: any) => {
                  setOutcome(e.target.value);
                  if (e.target.value === 'pass') setScore(8.5);
                  else if (e.target.value === 'needs_revision') setScore(6.0);
                  else setScore(4.5);
                }}
              >
                <option value="pass">PASS — Cleared Capstone / Mock Defense</option>
                <option value="needs_revision">NEEDS REVISION — Minor Improvements Required</option>
                <option value="fail">FAIL — Requires Retake &amp; Additional Preparation</option>
              </select>
            </div>

            {/* Score */}
            <div className="form-group">
              <label className="form-label">Numerical Score (out of 10) *</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                className="form-input"
                required
                value={score}
                onChange={(e) => setScore(parseFloat(e.target.value) || 0)}
              />
            </div>

            {/* Remarks */}
            <div className="form-group">
              <label className="form-label">Instructor Remarks &amp; Feedback *</label>
              <textarea
                className="form-input"
                rows={4}
                required
                placeholder="Detail technical strengths, coding speed, architecture explanations, and areas for improvement..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>

            <div className="rule-warning-box">
              <CheckCircle2 size={16} className="icon-green" />
              <span>
                The student will receive this evaluation and official score on their portal. Successful pass status is recorded toward certificate eligibility.
              </span>
            </div>
          </div>

          <div className="dialog-footer">
            <button type="button" className="btn-admin-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-admin-primary">
              Record Evaluation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
