import React from 'react';
import { CalendarCheck, Award } from 'lucide-react';
import type { MockInterviewSlot } from '../../../data/portalMockData';

interface MockInterviewsTabProps {
  mockSessions: MockInterviewSlot[];
}

export const MockInterviewsTab: React.FC<MockInterviewsTabProps> = ({ mockSessions }) => {
  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <div>
          <h3 className="admin-panel-title">
            <CalendarCheck size={18} className="icon-green" />
            <span>1-on-1 Private Mock Interview Governance</span>
          </h3>
          <p className="admin-panel-subtitle">
            Rule 17 &amp; 18: Strictly 1 Coach + 1 Student. Double-booking prevention enforced across all faculty schedules.
          </p>
        </div>
      </div>

      <div className="cohort-table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Track / Category</th>
              <th>Lead Interviewer</th>
              <th>Slot Date &amp; Timing</th>
              <th>Booked Student</th>
              <th>Session Status</th>
              <th>Scorecard Rubric</th>
            </tr>
          </thead>
          <tbody>
            {mockSessions.map((session) => (
              <tr key={session.id}>
                <td>
                  <strong>{session.category}</strong>
                </td>
                <td>{session.interviewerName}</td>
                <td>
                  {session.date} • {session.time}
                </td>
                <td>
                  {session.bookedStudentName ? (
                    <strong>{session.bookedStudentName}</strong>
                  ) : (
                    <span className="text-secondary">Available Slot</span>
                  )}
                </td>
                <td>
                  <span className={`status-pill pill-${session.status}`}>
                    {session.status.toUpperCase()}
                  </span>
                </td>
                <td>
                  {session.score ? (
                    <div className="score-cell">
                      <Award size={15} className="icon-yellow" />
                      <strong>{session.score} / 10</strong>
                      <span className="rubric-pass-tag">Passed Defense</span>
                    </div>
                  ) : (
                    <span className="text-secondary">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
