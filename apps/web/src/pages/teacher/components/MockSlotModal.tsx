import React, { useState } from 'react';
import { X, CalendarCheck, ShieldCheck } from 'lucide-react';
import type { MockInterviewSlot } from '../../../data/portalMockData';

interface MockSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSlot: (slot: Omit<MockInterviewSlot, 'id'>) => void;
  coachName?: string;
}

export const MockSlotModal: React.FC<MockSlotModalProps> = ({
  isOpen,
  onClose,
  onAddSlot,
  coachName = 'Dr. Rajesh Verma'
}) => {
  const [category, setCategory] = useState<MockInterviewSlot['category']>('Python Technical');
  const [date, setDate] = useState('This Saturday');
  const [time, setTime] = useState('10:00 AM – 10:45 AM');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddSlot({
      category,
      date,
      time,
      durationMinutes: 45,
      interviewerName: coachName,
      interviewerTitle: 'Lead Software Architect',
      status: 'available',
      bookedStudentName: undefined
    });
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
              <CalendarCheck size={18} style={{ color: 'var(--brand-orange)' }} />
              <h3 style={{ margin: 0 }}>Open 1-on-1 Mock Interview Slot</h3>
            </div>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.82rem', color: 'var(--gray-500)' }}>
              Rule 17 &amp; 18: Strictly 1 Coach + 1 Student. Double-booking prevention enforced.
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="dialog-body">
            <div className="form-group">
              <label className="form-label">Interview Track / Category *</label>
              <select
                className="form-input"
                value={category}
                onChange={(e) => setCategory(e.target.value as MockInterviewSlot['category'])}
              >
                <option value="Python Technical">Python Technical (Full Stack &amp; AI)</option>
                <option value="Java Technical">Java Technical (Spring Boot &amp; Microservices)</option>
                <option value="System Design">System Design &amp; Cloud Architecture</option>
                <option value="Coding DSA">Coding DSA &amp; Algorithmic Problem Solving</option>
                <option value="HR & Culture">HR &amp; Culture Readiness</option>
              </select>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Interview Date *</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="e.g. This Saturday or Sep 20, 2026"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Time Window (IST) *</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="e.g. 10:00 AM – 10:45 AM"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
            </div>

            <div className="rule-warning-box">
              <ShieldCheck size={16} className="icon-green" />
              <span>
                Once published, students in the matching track can book this single slot. The slot will automatically lock to prevent duplicate bookings.
              </span>
            </div>
          </div>

          <div className="dialog-footer">
            <button type="button" className="btn-admin-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-admin-primary">
              Publish Available Slot
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
