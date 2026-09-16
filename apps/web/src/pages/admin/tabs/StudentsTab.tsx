import React from 'react';
import {
  UserPlus,
  Eye,
  Key,
  ArrowRightLeft,
  Mail,
  GraduationCap
} from 'lucide-react';
import type { CohortBatch } from '../../../data/portalMockData';
import { AdminTableToolbar } from '../components/AdminTableToolbar';
import { AdminEmptyState } from '../components/AdminEmptyState';

export interface StudentRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  batch: string;
  progress: number;
  attendance: number;
  lastActive: string;
  status: 'active' | 'suspended';
  enrolledDate: string;
  assignmentsSubmitted: number;
  totalAssignments: number;
  quizScoreAvg: number;
  codingSubmissions: number;
  capstoneStatus: 'In Progress' | 'Defended' | 'Pending Review';
  questionsAsked: number;
  mockInterviewScore: number | null;
  certificateIssued: boolean;
}

interface StudentsTabProps {
  studentsList: StudentRecord[];
  filteredStudents: StudentRecord[];
  batchesList: CohortBatch[];
  searchStudent: string;
  setSearchStudent: (query: string) => void;
  filterBatch: string;
  setFilterBatch: (batch: string) => void;
  setShowCreateStudentModal: (val: boolean) => void;
  setSelectedStudentProfile: (student: StudentRecord) => void;
  setResetTarget: (target: any) => void;
  setResetNewPassword: (password: string) => void;
  setShowResetPasswordModal: (val: boolean) => void;
  generateStrongPassword: () => string;
  setTransferStudent: (student: StudentRecord) => void;
  setTransferTargetBatch: (batch: string) => void;
  setShowTransferModal: (val: boolean) => void;
  handleResendCredentials: (data: any) => Promise<void>;
  toggleStudentStatus: (studentId: string) => void;
}

export const StudentsTab: React.FC<StudentsTabProps> = ({
  studentsList,
  filteredStudents,
  batchesList,
  searchStudent,
  setSearchStudent,
  filterBatch,
  setFilterBatch,
  setShowCreateStudentModal,
  setSelectedStudentProfile,
  setResetTarget,
  setResetNewPassword,
  setShowResetPasswordModal,
  generateStrongPassword,
  setTransferStudent,
  setTransferTargetBatch,
  setShowTransferModal,
  handleResendCredentials,
  toggleStudentStatus
}) => {
  const batchFilterOptions = [
    { label: 'All Batches', value: 'all' },
    ...batchesList.map((b) => ({
      label: `Batch ${b.code} (${b.courseTitle.split('+')[0].trim()})`,
      value: b.code
    }))
  ];

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <div>
          <h3 className="admin-panel-title">
            <GraduationCap size={18} className="icon-blue" />
            <span>Student Directory &amp; Academic Records</span>
          </h3>
          <p className="admin-panel-subtitle">
            Search students, audit attendance cadence, verify assignments and quiz marks, and inspect full student dossiers.
          </p>
        </div>
        <button
          type="button"
          className="btn-admin-primary"
          onClick={() => setShowCreateStudentModal(true)}
        >
          <UserPlus size={16} />
          <span>Create Student Account</span>
        </button>
      </div>

      {/* Modern Unified Table Toolbar */}
      <AdminTableToolbar
        searchQuery={searchStudent}
        onSearchChange={setSearchStudent}
        searchPlaceholder="Search by student name, email, or student ID..."
        filterValue={filterBatch}
        onFilterChange={setFilterBatch}
        filterOptions={batchFilterOptions}
        filterLabel="Filter by Batch"
        totalCount={studentsList.length}
        filteredCount={filteredStudents.length}
        entityLabel="students"
      />

      {/* Students Table or Empty State */}
      {filteredStudents.length === 0 ? (
        <AdminEmptyState
          title="No Students Found"
          description={
            searchStudent || filterBatch !== 'all'
              ? `No student records match "${searchStudent || filterBatch}". Try clearing filters.`
              : 'No students currently enrolled in the academy.'
          }
          actionLabel={searchStudent || filterBatch !== 'all' ? undefined : 'Enroll First Student'}
          onAction={
            searchStudent || filterBatch !== 'all'
              ? undefined
              : () => setShowCreateStudentModal(true)
          }
        />
      ) : (
        <div className="cohort-table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Full Name</th>
                <th>Enrolled Course</th>
                <th>Batch</th>
                <th>Progress</th>
                <th>Attendance</th>
                <th>Last Active</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((s) => (
                <tr key={s.id}>
                  <td>
                    <span className="code-badge">{s.id}</span>
                  </td>
                  <td>
                    <strong>{s.name}</strong>
                    <div className="student-email">{s.email}</div>
                  </td>
                  <td>{s.course}</td>
                  <td>
                    <span className="batch-pill">{s.batch}</span>
                  </td>
                  <td>
                    <div className="table-progress">
                      <div className="table-bar" style={{ width: `${s.progress}%` }} />
                      <span>{s.progress}%</span>
                    </div>
                  </td>
                  <td>
                    <strong className={s.attendance >= 90 ? 'text-green' : 'text-orange'}>
                      {s.attendance}%
                    </strong>
                  </td>
                  <td>{s.lastActive}</td>
                  <td>
                    <span className={`status-pill pill-${s.status}`}>
                      {s.status.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons-row">
                      <button
                        type="button"
                        className="btn-tbl-action"
                        title="View student academic dossier"
                        onClick={() => setSelectedStudentProfile(s)}
                      >
                        <Eye size={13} />
                        <span>Profile</span>
                      </button>
                      <button
                        type="button"
                        className="btn-tbl-action btn-reset-action"
                        title="Reset student login password"
                        onClick={() => {
                          setResetTarget({
                            role: 'STUDENT',
                            id: s.id,
                            name: s.name,
                            email: s.email,
                            courseOrBatch: `${s.course} (${s.batch})`
                          });
                          setResetNewPassword(generateStrongPassword());
                          setShowResetPasswordModal(true);
                        }}
                      >
                        <Key size={13} />
                        <span>Reset Pass</span>
                      </button>
                      <button
                        type="button"
                        className="btn-tbl-action btn-transfer-action"
                        title="Transfer student to another cohort"
                        onClick={() => {
                          setTransferStudent(s);
                          setTransferTargetBatch(
                            batchesList.find((b) => b.code !== s.batch)?.code || 'PY-FS-01'
                          );
                          setShowTransferModal(true);
                        }}
                      >
                        <ArrowRightLeft size={13} />
                        <span>Transfer</span>
                      </button>
                      <button
                        type="button"
                        className="btn-tbl-action btn-resend-action"
                        title="Resend credentials to student inbox"
                        onClick={() =>
                          handleResendCredentials({
                            role: 'STUDENT',
                            name: s.name,
                            email: s.email,
                            courseOrBatch: `${s.course} (${s.batch})`
                          })
                        }
                      >
                        <Mail size={13} />
                        <span>Email</span>
                      </button>
                      <button
                        type="button"
                        className={`btn-tbl-action ${s.status === 'active' ? 'btn-warn' : 'btn-success'}`}
                        onClick={() => toggleStudentStatus(s.id)}
                      >
                        {s.status === 'active' ? 'Suspend' : 'Activate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
