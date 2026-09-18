import React, { useState, useEffect } from 'react';
import {
  X,
  FileCheck2,
  ExternalLink,
  Code2,
  CheckCircle2
} from 'lucide-react';

export interface StudentSubmission {
  id: string;
  studentName: string;
  studentId: string;
  taskTitle: string;
  courseTitle: string;
  batchCode: string;
  submittedAt: string;
  githubUrl?: string;
  codeSnippet?: string;
  score?: number;
  status: 'pending' | 'graded' | 'revision_requested';
  feedback?: string;
}

interface SubmissionReviewModalProps {
  submission: StudentSubmission | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitGrade: (submissionId: string, score: number, feedback: string, status: 'graded' | 'revision_requested') => void;
}

export const SubmissionReviewModal: React.FC<SubmissionReviewModalProps> = ({
  submission,
  isOpen,
  onClose,
  onSubmitGrade
}) => {
  const [score, setScore] = useState<number>(submission?.score || 85);
  const [feedback, setFeedback] = useState<string>(submission?.feedback || '');
  const [reviewStatus, setReviewStatus] = useState<'graded' | 'revision_requested'>('graded');

  useEffect(() => {
    if (submission) {
      setScore(submission.score ?? 85);
      setFeedback(submission.feedback || '');
      setReviewStatus(submission.status === 'revision_requested' ? 'revision_requested' : 'graded');
    }
  }, [submission]);

  if (!isOpen || !submission) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitGrade(submission.id, score, feedback, reviewStatus);
    onClose();
  };

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div
        className="admin-modal-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '680px' }}
      >
        <div className="dialog-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileCheck2 size={18} style={{ color: 'var(--brand-orange)' }} />
              <h3 style={{ margin: 0 }}>Code Review &amp; Grading</h3>
            </div>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.82rem', color: 'var(--gray-500)' }}>
              {submission.taskTitle} • {submission.studentName} ({submission.batchCode})
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="dialog-body" style={{ maxHeight: '72vh', overflowY: 'auto' }}>
            {/* Metadata Bar */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.75rem',
                background: '#f8fafc',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                fontSize: '0.82rem'
              }}
            >
              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem' }}>STUDENT</span>
                <strong>{submission.studentName}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem' }}>BATCH</span>
                <span className="code-badge">{submission.batchCode}</span>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem' }}>SUBMITTED</span>
                <span>{submission.submittedAt}</span>
              </div>
            </div>

            {/* GitHub Repository Link */}
            {submission.githubUrl && (
              <div style={{ marginTop: '0.75rem' }}>
                <a
                  href={submission.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.82rem',
                    color: '#2563eb',
                    textDecoration: 'none',
                    fontWeight: 600
                  }}
                >
                  <ExternalLink size={14} />
                  <span>Inspect GitHub Pull Request / Repository</span>
                </a>
              </div>
            )}

            {/* Submitted Code / Output */}
            <div style={{ marginTop: '0.75rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  marginBottom: '0.35rem',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: '#334155'
                }}
              >
                <Code2 size={15} />
                <span>Submitted Code &amp; Architecture Solution</span>
              </div>
              <pre
                style={{
                  background: '#0f172a',
                  color: '#38bdf8',
                  padding: '1rem',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontFamily: 'monospace',
                  overflowX: 'auto',
                  maxHeight: '220px',
                  lineHeight: 1.45
                }}
              >
                {submission.codeSnippet ||
                  `# Task: ${submission.taskTitle}\n# Student: ${submission.studentName}\nimport celery\n\napp = celery.Celery('tasks', broker='redis://redis:6379/0')\n\n@app.task(bind=True, max_retries=3)\ndef execute_pipeline(self, payload):\n    print(f"[Worker] Processing async payload: {payload}")\n    return {"status": "SUCCESS", "retries": self.request.retries}`}
              </pre>
            </div>

            {/* Scoring & Status Selection */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Score (0 – 100) *</label>
                <input
                  type="number"
                  className="form-input"
                  min={0}
                  max={100}
                  required
                  value={score}
                  onChange={(e) => setScore(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Evaluation Status</label>
                <select
                  className="form-input"
                  value={reviewStatus}
                  onChange={(e: any) => setReviewStatus(e.target.value)}
                >
                  <option value="graded">Graded &amp; Approved</option>
                  <option value="revision_requested">Needs Code Revision</option>
                </select>
              </div>
            </div>

            {/* Written Feedback */}
            <div className="form-group" style={{ marginTop: '0.75rem' }}>
              <label className="form-label">Instructor Feedback &amp; Architecture Notes *</label>
              <textarea
                className="form-input"
                rows={3}
                required
                placeholder="Detail code structure, error handling, performance considerations, and suggestions for refinement..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
            </div>

            <div className="rule-warning-box" style={{ marginTop: '0.75rem' }}>
              <CheckCircle2 size={16} className="icon-green" />
              <span>
                Grade and written feedback will immediately update the student portal and notification stream.
              </span>
            </div>
          </div>

          <div className="dialog-footer">
            <button type="button" className="btn-admin-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-admin-primary">
              Publish Grade &amp; Notify Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
