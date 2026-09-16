import React from 'react';
import { FileCheck2 } from 'lucide-react';
import type { AdminAssignment } from '../../../data/portalMockData';

interface AssessmentsTabProps {
  assignmentsList: AdminAssignment[];
}

export const AssessmentsTab: React.FC<AssessmentsTabProps> = ({ assignmentsList }) => {
  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <div>
          <h3 className="admin-panel-title">
            <FileCheck2 size={18} className="icon-blue" />
            <span>Academic Assessments &amp; Capstone Defenses</span>
          </h3>
          <p className="admin-panel-subtitle">
            Review student submission volume, turnaround rates, and capstone repository evaluations.
          </p>
        </div>
      </div>

      <div className="cohort-table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Assignment Title</th>
              <th>Target Course</th>
              <th>Batch</th>
              <th>Deadline</th>
              <th>Submissions</th>
              <th>Reviewed</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {assignmentsList.map((asg) => (
              <tr key={asg.id}>
                <td>
                  <strong>{asg.title}</strong>
                </td>
                <td>{asg.courseTitle}</td>
                <td>
                  <span className="code-badge">{asg.batchCode}</span>
                </td>
                <td>{asg.deadline}</td>
                <td>
                  <span className="font-semibold">
                    {asg.submissionsCount} / {asg.totalStudents}
                  </span>
                </td>
                <td>
                  <span className="text-green">{asg.reviewedCount} Evaluated</span>
                </td>
                <td>
                  <span className={`status-pill pill-${asg.status.toLowerCase().replace(/\s+/g, '-')}`}>
                    {asg.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
