import React, { useState } from 'react';
import {
  Award,
  Video,
  Plus
} from 'lucide-react';
import type { MockInterviewSlot } from '../../../data/portalMockData';
import { AdminTableToolbar } from '../../admin/components/AdminTableToolbar';
import { AdminEmptyState } from '../../admin/components/AdminEmptyState';

interface TeacherMockInterviewsTabProps {
  mockSessions: MockInterviewSlot[];
  onOpenAddSlotModal: () => void;
  onStartSession: (slot: MockInterviewSlot) => void;
  onEvaluateSession: (slot: MockInterviewSlot) => void;
}

export const TeacherMockInterviewsTab: React.FC<TeacherMockInterviewsTabProps> = ({
  mockSessions,
  onOpenAddSlotModal,
  onStartSession,
  onEvaluateSession
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filtered = mockSessions.filter((slot) => {
    const matchesSearch =
      (slot.bookedStudentName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      slot.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      slot.time.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === 'all' || slot.status.toLowerCase() === filterStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="teacher-panel">
      <div className="panel-header-row">
        <div>
          <h3 className="panel-title">1-on-1 Private Mock Interview Scheduling &amp; Defense</h3>
          <p className="panel-subtext">
            Rule 17 &amp; 18: Strictly 1 Coach + 1 Student. Double-booking prevention enforced across all faculty schedules.
          </p>
        </div>
        <button
          type="button"
          className="btn-admin-primary"
          onClick={onOpenAddSlotModal}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <Plus size={15} />
          <span>+ Open Mock Slot</span>
        </button>
      </div>

      {/* Toolbar */}
      <AdminTableToolbar
        searchPlaceholder="Search by student candidate or track..."
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterOptions={[
          { label: 'All Interview Slots', value: 'all' },
          { label: 'Booked Sessions', value: 'booked' },
          { label: 'Available Slots', value: 'available' },
          { label: 'Completed Defenses', value: 'completed' }
        ]}
        filterValue={filterStatus}
        onFilterChange={setFilterStatus}
        totalCount={mockSessions.length}
        filteredCount={filtered.length}
        entityLabel="slots"
      />

      <div className="cohort-table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Category / Track</th>
              <th>Date &amp; Time Window</th>
              <th>Student Candidate</th>
              <th>Status</th>
              <th>Score / Decision</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((slot) => (
              <tr key={slot.id}>
                <td>
                  <strong>{slot.category}</strong>
                  <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Private 1:1 Defense</div>
                </td>
                <td>
                  <strong>{slot.date}</strong>
                  <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{slot.time}</div>
                </td>
                <td>
                  {slot.bookedStudentName ? (
                    <div>
                      <strong style={{ color: '#0f172a' }}>{slot.bookedStudentName}</strong>
                      <span style={{ display: 'block', fontSize: '0.72rem', color: '#16a34a' }}>
                        Confirmed Booking
                      </span>
                    </div>
                  ) : (
                    <span style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '0.82rem' }}>
                      Open for student booking
                    </span>
                  )}
                </td>
                <td>
                  <span
                    className={`status-pill ${
                      slot.status === 'booked'
                        ? 'pill-pending'
                        : slot.status === 'completed'
                        ? 'pill-active'
                        : 'pill-available'
                    }`}
                  >
                    {slot.status.toUpperCase()}
                  </span>
                </td>
                <td>
                  {slot.score !== null && slot.score !== undefined ? (
                    <strong style={{ color: '#16a34a', fontSize: '0.88rem' }}>
                      {slot.score} / 10 (PASSED)
                    </strong>
                  ) : slot.status === 'booked' ? (
                    <span style={{ color: '#d97706', fontSize: '0.8rem' }}>Pending Defense</span>
                  ) : (
                    <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>&mdash;</span>
                  )}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    {slot.status === 'booked' && (
                      <>
                        <button
                          type="button"
                          className="btn-tbl-action btn-tbl-modules"
                          onClick={() => onStartSession(slot)}
                          title="Open private 1:1 meeting room"
                        >
                          <Video size={13} />
                          <span>Start Room</span>
                        </button>

                        <button
                          type="button"
                          className="btn-tbl-action btn-tbl-publish"
                          onClick={() => onEvaluateSession(slot)}
                          title="Submit evaluation remarks and decision"
                        >
                          <Award size={13} />
                          <span>Grade</span>
                        </button>
                      </>
                    )}

                    {slot.status === 'completed' && (
                      <button
                        type="button"
                        className="btn-tbl-action"
                        onClick={() => onEvaluateSession(slot)}
                        title="View or update evaluation remarks"
                      >
                        <span>View Evaluation</span>
                      </button>
                    )}

                    {slot.status === 'available' && (
                      <span style={{ fontSize: '0.74rem', color: '#16a34a', fontWeight: 600 }}>
                        Awaiting student selection
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <AdminEmptyState
            title="No mock interview slots match this filter"
            description="You can open new 1:1 private interview availability using the '+ Open Mock Slot' button above."
            actionLabel="+ Open Mock Slot"
            onAction={onOpenAddSlotModal}
          />
        )}
      </div>
    </div>
  );
};
