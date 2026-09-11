import React, { useState, useEffect } from 'react';
import {
  Video,
  Users,
  CalendarCheck,
  Clock,
  ShieldCheck,
  Award
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { api } from '../../services/api';
import './TeacherDashboard.css';

interface TeacherDashboardProps {
  onNavigateToPublic: (page: string, params?: Record<string, string>) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onNavigateToPublic }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [, setDashboardData] = useState<any>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.getTeacherDashboard();
        if (res.success && res.data) {
          setDashboardData(res.data);
        }
      } catch (err) {
        console.warn('Teacher dashboard fetch fallback:', err);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <PortalLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onNavigateToPublic={onNavigateToPublic}
      title={`Instructor Studio — ${user?.fullName || 'Faculty Lead'}`}
      subtitle="Manage assigned cohorts (15 max batch cap), host live Zoom classrooms, review code submissions, and conduct 1-on-1 mock interviews."
    >
      <div className="teacher-dashboard-content">
        {/* Next Live Class Launcher Banner */}
        <section className="teacher-hero-card">
          <div className="teacher-hero-meta">
            <span className="live-status-pill">
              <span className="pulse-dot-green"></span>
              SCHEDULED TONIGHT
            </span>
            <span className="cohort-tag">Batch PY-2026-01 • 14/15 Students Enrolled</span>
          </div>

          <div className="teacher-hero-body">
            <div>
              <h2 className="teacher-class-title">Async I/O & FastAPI Concurrency Patterns</h2>
              <div className="teacher-details-row">
                <span><Clock size={16} /> 07:00 PM - 08:30 PM IST</span>
                <span><Users size={16} /> 14 Active Cohort Students</span>
                <span><ShieldCheck size={16} /> Max 15 Capacity Enforced</span>
              </div>
            </div>

            <div className="teacher-action-block">
              <button
                className="launch-zoom-host-btn"
                onClick={() => alert('Starting Zoom Host Session for Batch PY-2026-01...')}
              >
                <Video size={20} />
                <span>Start Zoom Meeting as Host</span>
              </button>
              <span className="host-note">Cloud recording will automatically attach to student portal</span>
            </div>
          </div>
        </section>

        {/* Cohort Health & Cap Monitoring */}
        <div className="teacher-grid-split">
          {/* Active Cohorts */}
          <div className="teacher-panel">
            <div className="panel-header-row">
              <h3 className="panel-title">
                <Users size={18} />
                <span>Assigned Batches (Max 15 Cap)</span>
              </h3>
              <span className="panel-status-pill">Rule 15 Compliant</span>
            </div>

            <div className="cohorts-list">
              <div className="cohort-card">
                <div className="cohort-card-top">
                  <h4 className="cohort-name">Full Stack Python + AI (Batch 01)</h4>
                  <span className="cohort-capacity-badge">14 / 15 Enrolled</span>
                </div>
                <div className="cohort-capacity-bar">
                  <div className="capacity-fill" style={{ width: `${(14 / 15) * 100}%` }}></div>
                </div>
                <div className="cohort-footer">
                  <span>Schedule: Mon - Sat | 07:00 PM IST</span>
                  <span className="cohort-free-slots">1 slot available</span>
                </div>
              </div>

              <div className="cohort-card">
                <div className="cohort-card-top">
                  <h4 className="cohort-name">Data Science & ML (Batch 01)</h4>
                  <span className="cohort-capacity-badge">12 / 15 Enrolled</span>
                </div>
                <div className="cohort-capacity-bar">
                  <div className="capacity-fill" style={{ width: `${(12 / 15) * 100}%` }}></div>
                </div>
                <div className="cohort-footer">
                  <span>Schedule: Mon - Sat | 08:30 PM IST</span>
                  <span className="cohort-free-slots">3 slots available</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pending Reviews & Mock Interview Requests */}
          <div className="teacher-panel">
            <div className="panel-header-row">
              <h3 className="panel-title">
                <CalendarCheck size={18} />
                <span>1-on-1 Mock Interview Requests</span>
              </h3>
              <span className="panel-status-pill mock-pill">Anti-Double-Booking Active</span>
            </div>

            <div className="mock-requests-list">
              <div className="mock-request-card">
                <div className="mock-req-details">
                  <span className="req-student-name">Aarav Sharma</span>
                  <span className="req-track">Track: Full Stack Python + AI</span>
                  <span className="req-time"><Clock size={14} /> Requested: Tomorrow, 05:00 PM IST</span>
                </div>
                <button
                  className="confirm-slot-btn"
                  onClick={() => alert('Confirmed 1-on-1 mock interview session. Slot locked from double-booking.')}
                >
                  Confirm Slot
                </button>
              </div>

              <div className="mock-availability-box">
                <span className="avail-title">Your Weekly Availability:</span>
                <p className="avail-desc">
                  Mon, Wed, Fri (04:00 PM - 06:00 PM IST). Individual 30-minute private 1:1 video slots with rubric scoring.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Student Roster Preview */}
        <section className="teacher-panel">
          <div className="panel-header-row">
            <h3 className="panel-title">
              <Award size={18} />
              <span>Enrolled Student Roster (Batch PY-2026-01)</span>
            </h3>
            <span className="panel-status-pill">14 Students</span>
          </div>

          <div className="student-roster-table-wrapper">
            <table className="roster-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Email</th>
                  <th>Attendance</th>
                  <th>Enrolled Cohort</th>
                  <th>Mock Interview Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Aarav Sharma</strong></td>
                  <td>student@dpskilltech.com</td>
                  <td><span className="attendance-pill high">94% (Verified)</span></td>
                  <td>Batch PY-2026-01</td>
                  <td>1 Completed (8.2 / 10 Rubric)</td>
                </tr>
                <tr>
                  <td><strong>Neha Patel</strong></td>
                  <td>neha.p@example.com</td>
                  <td><span className="attendance-pill high">98% (Verified)</span></td>
                  <td>Batch PY-2026-01</td>
                  <td>Scheduled for Thursday</td>
                </tr>
                <tr>
                  <td><strong>Karan Singhal</strong></td>
                  <td>karan.s@example.com</td>
                  <td><span className="attendance-pill mid">88% (Verified)</span></td>
                  <td>Batch PY-2026-01</td>
                  <td>Eligible (2 credits)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </PortalLayout>
  );
};
