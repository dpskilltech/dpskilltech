import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import type { CohortBatch } from '../../../data/portalMockData';

export interface CohortStudentMember {
  id: string;
  name: string;
  email: string;
  attendanceRate: number;
  assignmentsSubmitted: number;
  totalAssignments: number;
  todayAttendance?: 'present' | 'absent' | 'late';
}

interface CohortRosterDrawerProps {
  batch: CohortBatch | null;
  isOpen: boolean;
  onClose: () => void;
  students: CohortStudentMember[];
  onUpdateAttendance: (studentId: string, status: 'present' | 'absent' | 'late') => void;
}

export const CohortRosterDrawer: React.FC<CohortRosterDrawerProps> = ({
  batch,
  isOpen,
  onClose,
  students,
  onUpdateAttendance
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen || !batch) return null;

  const handleMark = (studentId: string, name: string, status: 'present' | 'absent' | 'late') => {
    onUpdateAttendance(studentId, status);
    setToastMessage(`Attendance for ${name} marked as ${status.toUpperCase()}`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const presentCount = students.filter((s) => s.todayAttendance === 'present').length;

  return (
    <div className="admin-drawer-backdrop" onClick={onClose}>
      <div
        className="admin-detail-drawer"
        style={{ maxWidth: '560px' }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="admin-drawer-header">
          <div className="drawer-header-text">
            <div className="drawer-title-row">
              <h3 className="drawer-title">Cohort Roster: {batch.code}</h3>
              <span className="batch-cap-indicator cap-warning">
                {batch.enrolledCount} / {batch.capacity} Max
              </span>
            </div>
            <p className="drawer-subtitle">{batch.courseTitle}</p>
          </div>
          <button
            type="button"
            className="drawer-close-btn"
            onClick={onClose}
            aria-label="Close drawer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="admin-drawer-body">
          {/* Quick Stats banner */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.75rem',
              background: '#f8fafc',
              padding: '0.85rem 1rem',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              textAlign: 'center'
            }}
          >
            <div>
              <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>TOTAL ENROLLED</span>
              <strong style={{ fontSize: '1.1rem', color: '#0f172a' }}>{batch.enrolledCount} / 15</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>MARKED PRESENT</span>
              <strong style={{ fontSize: '1.1rem', color: '#16a34a' }}>{presentCount}</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>CLASS CADENCE</span>
              <strong style={{ fontSize: '0.82rem', color: '#d97706' }}>Mon – Sat</strong>
            </div>
          </div>

          {toastMessage && (
            <div
              style={{
                background: '#ecfdf5',
                color: '#065f46',
                border: '1px solid #a7f3d0',
                padding: '0.5rem 0.85rem',
                borderRadius: '6px',
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <CheckCircle2 size={15} />
              <span>{toastMessage}</span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ margin: 0, fontSize: '0.88rem', fontWeight: 700, color: '#334155' }}>
              Enrolled Students ({students.length})
            </h4>
            <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
              Click to toggle today's attendance
            </span>
          </div>

          {/* Student list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {students.map((student, idx) => (
              <div
                key={student.id}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '0.75rem 0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: '#eff6ff',
                      color: '#2563eb',
                      fontWeight: 800,
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    0{idx + 1}
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.86rem', color: '#0f172a', display: 'block' }}>
                      {student.name}
                    </strong>
                    <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                      {student.attendanceRate}% Attended • {student.assignmentsSubmitted}/{student.totalAssignments} Tasks
                    </span>
                  </div>
                </div>

                {/* Attendance Buttons */}
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    type="button"
                    style={{
                      padding: '4px 8px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      borderRadius: '4px',
                      border: '1px solid',
                      cursor: 'pointer',
                      background: student.todayAttendance === 'present' ? '#16a34a' : '#f0fdf4',
                      color: student.todayAttendance === 'present' ? '#ffffff' : '#16a34a',
                      borderColor: '#bbf7d0'
                    }}
                    onClick={() => handleMark(student.id, student.name, 'present')}
                    title="Mark Present"
                  >
                    Present
                  </button>
                  <button
                    type="button"
                    style={{
                      padding: '4px 8px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      borderRadius: '4px',
                      border: '1px solid',
                      cursor: 'pointer',
                      background: student.todayAttendance === 'late' ? '#d97706' : '#fffbeb',
                      color: student.todayAttendance === 'late' ? '#ffffff' : '#d97706',
                      borderColor: '#fde68a'
                    }}
                    onClick={() => handleMark(student.id, student.name, 'late')}
                    title="Mark Late"
                  >
                    Late
                  </button>
                  <button
                    type="button"
                    style={{
                      padding: '4px 8px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      borderRadius: '4px',
                      border: '1px solid',
                      cursor: 'pointer',
                      background: student.todayAttendance === 'absent' ? '#dc2626' : '#fef2f2',
                      color: student.todayAttendance === 'absent' ? '#ffffff' : '#dc2626',
                      borderColor: '#fecaca'
                    }}
                    onClick={() => handleMark(student.id, student.name, 'absent')}
                    title="Mark Absent"
                  >
                    Absent
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="rule-warning-box">
            <ShieldCheck size={16} className="icon-green" />
            <span>
              Rule 18: Cohort size is hard-capped at 15 students. Attendance updates automatically synchronize with student completion records.
            </span>
          </div>
        </div>

        <div className="admin-drawer-footer">
          <button type="button" className="btn-admin-primary" onClick={onClose}>
            Done Reviewing Roster
          </button>
        </div>
      </div>
    </div>
  );
};
