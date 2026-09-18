import React, { useState } from 'react';
import {
  FileCheck2,
  Code2
} from 'lucide-react';
import { AdminTableToolbar } from '../../admin/components/AdminTableToolbar';
import { AdminEmptyState } from '../../admin/components/AdminEmptyState';
import type { StudentSubmission } from '../components/SubmissionReviewModal';

interface TeacherSubmissionsTabProps {
  submissionsList: StudentSubmission[];
  onReviewSubmission: (submission: StudentSubmission) => void;
}

export const TeacherSubmissionsTab: React.FC<TeacherSubmissionsTabProps> = ({
  submissionsList,
  onReviewSubmission
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filtered = submissionsList.filter((sub) => {
    const matchesSearch =
      sub.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.taskTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.batchCode.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'pending' && sub.status === 'pending') ||
      (filterStatus === 'graded' && sub.status === 'graded') ||
      (filterStatus === 'revision' && sub.status === 'revision_requested');

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="teacher-panel">
      <div className="panel-header-row">
        <div>
          <h3 className="panel-title">Student Code Submissions &amp; Academic Grading</h3>
          <p className="panel-subtext">
            Review submitted repository pull requests, execution outputs, and assign scores with personalized architecture feedback.
          </p>
        </div>
        <span className="panel-badge-orange">
          {submissionsList.filter((s) => s.status === 'pending').length} Pending Evaluation
        </span>
      </div>

      {/* Table Toolbar */}
      <AdminTableToolbar
        searchPlaceholder="Search by student name, task, or batch code..."
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterOptions={[
          { label: 'All Submissions', value: 'all' },
          { label: 'Pending Review', value: 'pending' },
          { label: 'Graded & Approved', value: 'graded' },
          { label: 'Needs Revision', value: 'revision' }
        ]}
        filterValue={filterStatus}
        onFilterChange={setFilterStatus}
        totalCount={submissionsList.length}
        filteredCount={filtered.length}
        entityLabel="submissions"
      />

      {/* Submissions List */}
      <div className="cohort-table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Task / Problem Statement</th>
              <th>Cohort Batch</th>
              <th>Submitted Date</th>
              <th>Score</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((sub) => (
              <tr key={sub.id}>
                <td>
                  <strong>{sub.studentName}</strong>
                  <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{sub.studentId}</div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Code2 size={14} style={{ color: '#2563eb' }} />
                    <strong>{sub.taskTitle}</strong>
                  </div>
                  <span style={{ fontSize: '0.74rem', color: '#64748b' }}>{sub.courseTitle}</span>
                </td>
                <td>
                  <span className="code-badge">{sub.batchCode}</span>
                </td>
                <td>
                  <span style={{ fontSize: '0.82rem', color: '#334155' }}>{sub.submittedAt}</span>
                </td>
                <td>
                  {sub.score !== undefined ? (
                    <strong style={{ color: sub.score >= 80 ? '#16a34a' : '#d97706', fontSize: '0.9rem' }}>
                      {sub.score} / 100
                    </strong>
                  ) : (
                    <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Unscored</span>
                  )}
                </td>
                <td>
                  <span
                    className={`status-pill ${
                      sub.status === 'graded'
                        ? 'pill-active'
                        : sub.status === 'revision_requested'
                        ? 'pill-suspended'
                        : 'pill-pending'
                    }`}
                  >
                    {sub.status === 'graded'
                      ? 'GRADED'
                      : sub.status === 'revision_requested'
                      ? 'REVISION'
                      : 'PENDING'}
                  </span>
                </td>
                <td>
                  <button
                    type="button"
                    className="btn-tbl-action btn-tbl-modules"
                    style={{ whiteSpace: 'nowrap' }}
                    onClick={() => onReviewSubmission(sub)}
                  >
                    <FileCheck2 size={13} />
                    <span>{sub.status === 'graded' ? 'Edit Grade' : 'Review & Grade'}</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <AdminEmptyState
            title="No submissions match your query"
            description="Try clearing your search query or selecting 'All Submissions' to view the entire evaluation queue."
            actionLabel="Reset Search & Filters"
            onAction={() => {
              setSearchQuery('');
              setFilterStatus('all');
            }}
          />
        )}
      </div>
    </div>
  );
};
