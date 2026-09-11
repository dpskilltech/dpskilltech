import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  GraduationCap,
  Layers,
  Award,
  Clock,
  CheckCircle2,
  UserPlus,
  Search,
  Filter,
  BarChart3,
  Lock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { COHORT_BATCHES } from '../../data/portalMockData';
import { api } from '../../services/api';
import './AdminDashboard.css';

interface AdminDashboardProps {
  onNavigateToPublic: (page: string, params?: Record<string, string>) => void;
}

interface StudentRecord {
  id: string;
  name: string;
  email: string;
  course: string;
  batch: string;
  progress: number;
  attendance: number;
  lastActive: string;
  status: 'active' | 'suspended';
}

const MOCK_STUDENTS: StudentRecord[] = [
  {
    id: 'STU-1081',
    name: 'Rohan Gupta',
    email: 'rohan.gupta@example.com',
    course: 'Full Stack Python + AI',
    batch: 'PY-FS-01',
    progress: 58,
    attendance: 96,
    lastActive: 'Today, 02:15 PM',
    status: 'active'
  },
  {
    id: 'STU-1082',
    name: 'Aarav Sharma',
    email: 'student@dpskilltech.in',
    course: 'Full Stack Python + AI',
    batch: 'PY-FS-01',
    progress: 50,
    attendance: 94,
    lastActive: '10 mins ago',
    status: 'active'
  },
  {
    id: 'STU-1083',
    name: 'Priya Iyer',
    email: 'priya.iyer@example.com',
    course: 'Data Science & Enterprise GenAI',
    batch: 'DS-AI-01',
    progress: 42,
    attendance: 91,
    lastActive: 'Yesterday',
    status: 'active'
  },
  {
    id: 'STU-1084',
    name: 'Ananya Verma',
    email: 'ananya.verma@example.com',
    course: 'Full Stack Java & Microservices',
    batch: 'JV-FS-01',
    progress: 74,
    attendance: 98,
    lastActive: 'Today, 11:30 AM',
    status: 'active'
  }
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateToPublic }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [, setDashboardData] = useState<any>(null);

  // Student Roster State
  const [studentsList, setStudentsList] = useState<StudentRecord[]>(MOCK_STUDENTS);
  const [searchStudent, setSearchStudent] = useState<string>('');
  const [filterBatch, setFilterBatch] = useState<string>('all');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.getAdminDashboard();
        if (res.success && res.data) {
          setDashboardData(res.data);
        }
      } catch (err) {
        console.warn('Admin dashboard fetch fallback:', err);
      }
    };
    fetchDashboard();
  }, []);

  const filteredStudents = studentsList.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchStudent.toLowerCase()) ||
      s.email.toLowerCase().includes(searchStudent.toLowerCase()) ||
      s.id.toLowerCase().includes(searchStudent.toLowerCase());
    const matchesBatch = filterBatch === 'all' || s.batch === filterBatch;
    return matchesSearch && matchesBatch;
  });

  const toggleStudentStatus = (id: string) => {
    setStudentsList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: s.status === 'active' ? 'suspended' : 'active' } : s))
    );
  };

  return (
    <PortalLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onNavigateToPublic={onNavigateToPublic}
      title={
        activeTab === 'dashboard'
          ? `Executive Administration — ${user?.fullName || 'Platform Director'}`
          : activeTab === 'students'
          ? 'Academy Student Roster & Cohort Enrollment'
          : activeTab === 'batches'
          ? 'Batch Capacity Governance (Strict 15-Student Cap Rule)'
          : activeTab === 'coaches'
          ? 'Faculty & Engineering Coaches Directory'
          : activeTab === 'analytics'
          ? 'Academy Metrics & Auditing Intelligence'
          : 'Academy Administration'
      }
      subtitle="Academy-wide governance: Audit cohort caps (15-student rule), monitor faculty, and review platform performance."
    >
      <div className="admin-portal-stack">
        {/* ==================================================================
            TAB 1: EXECUTIVE DASHBOARD
            ================================================================== */}
        {activeTab === 'dashboard' && (
          <div className="admin-view-stack">
            {/* KPI Cards */}
            <section className="admin-kpi-grid">
              <div className="admin-kpi-card">
                <div className="kpi-header">
                  <span className="kpi-label">Strict Batch Cap Compliance</span>
                  <ShieldCheck size={20} className="kpi-icon icon-green" />
                </div>
                <div className="kpi-value">100%</div>
                <span className="kpi-subtext">Max 15 students strictly enforced on all cohorts</span>
              </div>

              <div className="admin-kpi-card">
                <div className="kpi-header">
                  <span className="kpi-label">Total Active Enrolled</span>
                  <GraduationCap size={20} className="kpi-icon icon-blue" />
                </div>
                <div className="kpi-value">41</div>
                <span className="kpi-subtext">Across 3 active engineering cohorts</span>
              </div>

              <div className="admin-kpi-card">
                <div className="kpi-header">
                  <span className="kpi-label">Verified Faculty Leads</span>
                  <Layers size={20} className="kpi-icon icon-orange" />
                </div>
                <div className="kpi-value">3</div>
                <span className="kpi-subtext">Zero fake instructors • 100% practitioner staff</span>
              </div>

              <div className="admin-kpi-card">
                <div className="kpi-header">
                  <span className="kpi-label">Mock Interviews Held</span>
                  <Award size={20} className="kpi-icon icon-yellow" />
                </div>
                <div className="kpi-value">42</div>
                <span className="kpi-subtext">Private 1-to-1 video sessions with rubric scores</span>
              </div>
            </section>

            {/* Cohort Cap Monitoring Table */}
            <section className="admin-panel">
              <div className="admin-panel-header">
                <div>
                  <h3 className="admin-panel-title">
                    <Clock size={18} className="icon-orange" />
                    <span>Cohort Capacity &amp; 15-Student Rule Monitor</span>
                  </h3>
                  <p className="admin-panel-subtitle">
                    Prevents mass-lecture dilution. Any cohort reaching 15 students is automatically locked against new admissions.
                  </p>
                </div>
                <span className="compliance-tag">
                  <CheckCircle2 size={14} />
                  <span>Rule 15 Audited</span>
                </span>
              </div>

              <div className="cohort-table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Cohort Code</th>
                      <th>Course Curriculum</th>
                      <th>Lead Coach</th>
                      <th>Capacity Status</th>
                      <th>Enrolled / Cap</th>
                      <th>Class Cadence</th>
                      <th>Policy Audit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {COHORT_BATCHES.map((batch) => {
                      const isFull = batch.enrolledCount >= batch.capacity;
                      return (
                        <tr key={batch.id}>
                          <td><span className="code-badge">{batch.code}</span></td>
                          <td><strong>{batch.courseTitle}</strong></td>
                          <td>{batch.coachName}</td>
                          <td>
                            {isFull ? (
                              <span className="status-badge badge-full">
                                <Lock size={12} /> FULL (LOCKED)
                              </span>
                            ) : (
                              <span className="status-badge badge-available">
                                {batch.capacity - batch.enrolledCount} Seats Open
                              </span>
                            )}
                          </td>
                          <td>
                            <div className="cap-progress-wrap">
                              <div className="cap-progress-bar">
                                <div
                                  className={`cap-fill ${isFull ? 'fill-full' : 'fill-active'}`}
                                  style={{ width: `${(batch.enrolledCount / batch.capacity) * 100}%` }}
                                ></div>
                              </div>
                              <span className="cap-text">{batch.enrolledCount}/{batch.capacity}</span>
                            </div>
                          </td>
                          <td>{batch.scheduleDays} • {batch.timeSlot}</td>
                          <td>
                            <span className="verified-badge">
                              <ShieldCheck size={13} /> Strict Cap Compliant
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {/* ==================================================================
            TAB 2: STUDENT ROSTER MANAGEMENT
            ================================================================== */}
        {activeTab === 'students' && (
          <div className="admin-panel">
            <div className="admin-panel-header">
              <div>
                <h3 className="admin-panel-title">Student Directory &amp; Performance Roster</h3>
                <p className="admin-panel-subtitle">Manage enrolled students, verify attendance percentages, track course completion, and control permissions.</p>
              </div>
              <button
                type="button"
                className="btn-admin-primary"
                onClick={() => alert('Opening Student Enrollment Modal')}
              >
                <UserPlus size={16} />
                <span>Enroll New Student</span>
              </button>
            </div>

            {/* Filter Bar */}
            <div className="roster-filter-bar">
              <div className="search-input-wrap">
                <Search size={16} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search by student name, email, or ID..."
                  value={searchStudent}
                  onChange={(e) => setSearchStudent(e.target.value)}
                  className="roster-search-field"
                />
              </div>

              <div className="filter-select-wrap">
                <Filter size={15} />
                <select
                  value={filterBatch}
                  onChange={(e) => setFilterBatch(e.target.value)}
                  className="roster-select"
                >
                  <option value="all">All Batches</option>
                  <option value="PY-FS-01">Batch PY-FS-01 (Python)</option>
                  <option value="JV-FS-01">Batch JV-FS-01 (Java)</option>
                  <option value="DS-AI-01">Batch DS-AI-01 (Data Science)</option>
                </select>
              </div>
            </div>

            {/* Students Table */}
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
                      <td><span className="code-badge">{s.id}</span></td>
                      <td>
                        <strong>{s.name}</strong>
                        <div className="student-email">{s.email}</div>
                      </td>
                      <td>{s.course}</td>
                      <td><span className="batch-pill">{s.batch}</span></td>
                      <td>
                        <div className="table-progress">
                          <div className="table-bar" style={{ width: `${s.progress}%` }}></div>
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
                            onClick={() => alert(`Viewing full profile for ${s.name}`)}
                          >
                            View
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
          </div>
        )}

        {/* ==================================================================
            TAB 3: BATCH MANAGEMENT
            ================================================================== */}
        {activeTab === 'batches' && (
          <div className="admin-panel">
            <div className="admin-panel-header">
              <div>
                <h3 className="admin-panel-title">Batch Capacity Governance (Strict 15-Student Rule)</h3>
                <p className="admin-panel-subtitle">Rule 18: Never exceed 15 students per batch. When a cohort reaches 15, the system locks enrollment to maintain high educational touchpoints.</p>
              </div>
              <button type="button" className="btn-admin-primary">
                + Create New Cohort
              </button>
            </div>

            <div className="cohort-cards-grid">
              {COHORT_BATCHES.map((b) => (
                <div key={b.id} className="admin-cohort-box">
                  <div className="box-top">
                    <span className="code-badge">{b.code}</span>
                    <span className={b.enrolledCount >= b.capacity ? 'badge-full' : 'badge-available'}>
                      {b.enrolledCount >= b.capacity ? 'LOCKED (15/15)' : `${b.capacity - b.enrolledCount} Open`}
                    </span>
                  </div>
                  <h4>{b.courseTitle}</h4>
                  <p>Coach: <strong>{b.coachName}</strong></p>
                  <div className="cap-progress-wrap">
                    <div className="cap-progress-bar">
                      <div
                        className={`cap-fill ${b.enrolledCount >= b.capacity ? 'fill-full' : 'fill-active'}`}
                        style={{ width: `${(b.enrolledCount / b.capacity) * 100}%` }}
                      ></div>
                    </div>
                    <span>{b.enrolledCount} / {b.capacity} Students</span>
                  </div>
                  <div className="box-meta">
                    <span>{b.scheduleDays}</span>
                    <span>{b.timeSlot}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================================================================
            TAB 4: COACH DIRECTORY
            ================================================================== */}
        {activeTab === 'coaches' && (
          <div className="admin-panel">
            <div className="admin-panel-header">
              <div>
                <h3 className="admin-panel-title">Faculty &amp; Engineering Coaches Directory</h3>
                <p className="admin-panel-subtitle">Rule 22: Only verified engineering practitioners. Zero fake experience or inflated credentials.</p>
              </div>
            </div>

            <div className="coaches-cards-grid">
              <div className="coach-profile-card">
                <div className="coach-card-header">
                  <div className="coach-avatar-badge">RV</div>
                  <div>
                    <h4>Dr. Rajesh Verma</h4>
                    <span>Lead Python &amp; Distributed Systems Architect</span>
                  </div>
                </div>
                <div className="coach-stats-row">
                  <div><strong>PY-FS-01</strong><span>Assigned Cohort</span></div>
                  <div><strong>14</strong><span>Students</span></div>
                  <div><strong>4.9/5.0</strong><span>Evaluation Rating</span></div>
                </div>
              </div>

              <div className="coach-profile-card">
                <div className="coach-card-header">
                  <div className="coach-avatar-badge">KR</div>
                  <div>
                    <h4>Karthik Ramanathan</h4>
                    <span>Principal Java &amp; Spring Cloud Engineer</span>
                  </div>
                </div>
                <div className="coach-stats-row">
                  <div><strong>JV-FS-01</strong><span>Assigned Cohort</span></div>
                  <div><strong>15</strong><span>Students (Full)</span></div>
                  <div><strong>4.8/5.0</strong><span>Evaluation Rating</span></div>
                </div>
              </div>

              <div className="coach-profile-card">
                <div className="coach-card-header">
                  <div className="coach-avatar-badge">SK</div>
                  <div>
                    <h4>Sneha Kapoor</h4>
                    <span>Staff Data Scientist &amp; GenAI Lead</span>
                  </div>
                </div>
                <div className="coach-stats-row">
                  <div><strong>DS-AI-01</strong><span>Assigned Cohort</span></div>
                  <div><strong>12</strong><span>Students</span></div>
                  <div><strong>4.9/5.0</strong><span>Evaluation Rating</span></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================
            TAB 5: ANALYTICS & AUDITS
            ================================================================== */}
        {activeTab === 'analytics' && (
          <div className="admin-panel">
            <div className="admin-panel-header">
              <div>
                <h3 className="admin-panel-title">Academy Performance &amp; Integrity Intelligence</h3>
                <p className="admin-panel-subtitle">Real-time telemetry on student attendance, assignments turnaround, and mock interview rubric scores.</p>
              </div>
            </div>

            <div className="analytics-metrics-grid">
              <div className="analytics-card">
                <BarChart3 size={24} className="icon-blue" />
                <h4>Average Attendance Rate</h4>
                <div className="analytics-num">94.8%</div>
                <p>Consistent 6-day attendance cadence across all 3 active cohorts.</p>
              </div>

              <div className="analytics-card">
                <Clock size={24} className="icon-orange" />
                <h4>Average Question Turnaround</h4>
                <div className="analytics-num">1.8 Hours</div>
                <p>Lead coaches answer student inquiries within 2 hours during cohort days.</p>
              </div>

              <div className="analytics-card">
                <Award size={24} className="icon-yellow" />
                <h4>Mock Interview Pass Rate</h4>
                <div className="analytics-num">88.2%</div>
                <p>Based on 42 completed private 1:1 defense sessions across 6 rubric dimensions.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
};
