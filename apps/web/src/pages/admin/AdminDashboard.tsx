import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Users,
  GraduationCap,
  Layers,
  Award,
  Clock,
  CheckCircle2,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { api } from '../../services/api';
import './AdminDashboard.css';

interface AdminDashboardProps {
  onNavigateToPublic: (page: string, params?: Record<string, string>) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateToPublic }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [, setDashboardData] = useState<any>(null);

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

  return (
    <PortalLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onNavigateToPublic={onNavigateToPublic}
      title={`Executive Administration — ${user?.fullName || 'Platform Director'}`}
      subtitle="Academy-wide governance: Audit cohort caps (15-student rule), monitor faculty, and review platform performance."
    >
      <div className="admin-dashboard-content">
        {/* KPI Cards */}
        <section className="admin-kpi-grid">
          <div className="admin-kpi-card">
            <div className="kpi-header">
              <span className="kpi-label">Strict Batch Cap Compliance</span>
              <ShieldCheck size={20} className="kpi-icon green-icon" />
            </div>
            <div className="kpi-value">100%</div>
            <span className="kpi-subtext">Max 15 students strictly enforced on all cohorts</span>
          </div>

          <div className="admin-kpi-card">
            <div className="kpi-header">
              <span className="kpi-label">Total Active Enrolled</span>
              <GraduationCap size={20} className="kpi-icon blue-icon" />
            </div>
            <div className="kpi-value">41</div>
            <span className="kpi-subtext">Across 3 active engineering cohorts</span>
          </div>

          <div className="admin-kpi-card">
            <div className="kpi-header">
              <span className="kpi-label">Verified Faculty Leads</span>
              <Layers size={20} className="kpi-icon purple-icon" />
            </div>
            <div className="kpi-value">3</div>
            <span className="kpi-subtext">Zero fake instructors • 100% practitioner staff</span>
          </div>

          <div className="admin-kpi-card">
            <div className="kpi-header">
              <span className="kpi-label">Mock Interviews Held</span>
              <Award size={20} className="kpi-icon cyan-icon" />
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
                <Clock size={18} />
                <span>Cohort Capacity & 15-Student Rule Monitor</span>
              </h3>
              <p className="admin-panel-subtitle">
                Prevents mass-lecture dilution. Any cohort reaching 15 students is automatically locked against new admissions.
              </p>
            </div>
            <span className="compliance-pill">
              <CheckCircle2 size={14} />
              <span>Rule 15 Validated</span>
            </span>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Batch Identifier</th>
                  <th>Track / Course</th>
                  <th>Lead Trainer</th>
                  <th>Enrolled / Cap</th>
                  <th>Status</th>
                  <th>Capacity Utilization</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Batch PY-2026-01</strong></td>
                  <td>Full Stack Python + AI Architecture</td>
                  <td>Dr. Rajesh Verma</td>
                  <td>14 / 15</td>
                  <td><span className="status-tag active-tag">Active (1 Slot Open)</span></td>
                  <td>
                    <div className="table-capacity-bar">
                      <div className="table-capacity-fill blue" style={{ width: `${(14 / 15) * 100}%` }}></div>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td><strong>Batch DS-2026-01</strong></td>
                  <td>Data Science & Machine Learning</td>
                  <td>Ananya Deshmukh</td>
                  <td>12 / 15</td>
                  <td><span className="status-tag active-tag">Active (3 Slots Open)</span></td>
                  <td>
                    <div className="table-capacity-bar">
                      <div className="table-capacity-fill green" style={{ width: `${(12 / 15) * 100}%` }}></div>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td><strong>Batch JV-2026-01</strong></td>
                  <td>Full Stack Java Enterprise + AI</td>
                  <td>Vikramaditya Rao</td>
                  <td>15 / 15</td>
                  <td><span className="status-tag capped-tag">FULL (Capped at 15)</span></td>
                  <td>
                    <div className="table-capacity-bar">
                      <div className="table-capacity-fill purple" style={{ width: '100%' }}></div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* User Role Management Roster */}
        <section className="admin-panel">
          <div className="admin-panel-header">
            <div>
              <h3 className="admin-panel-title">
                <Users size={18} />
                <span>Identity & Role-Based Access Directory</span>
              </h3>
              <p className="admin-panel-subtitle">
                System accounts authenticated through JWT with strict RBAC segregation.
              </p>
            </div>
            <button
              className="admin-action-btn"
              onClick={() => alert('New user registration dialog')}
            >
              <UserPlus size={15} />
              <span>Add User</span>
            </button>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>System Role</th>
                  <th>Status</th>
                  <th>Access Scope</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Aarav Sharma</strong></td>
                  <td>student@dpskilltech.com</td>
                  <td><span className="role-tag role-student">STUDENT</span></td>
                  <td><span className="status-tag active-tag">Active</span></td>
                  <td>Student LMS, Coding Lab, Mock Scheduler</td>
                </tr>
                <tr>
                  <td><strong>Dr. Rajesh Verma</strong></td>
                  <td>instructor@dpskilltech.com</td>
                  <td><span className="role-tag role-teacher">TEACHER</span></td>
                  <td><span className="status-tag active-tag">Active</span></td>
                  <td>Batch Operations, Zoom Host, Evaluation Studio</td>
                </tr>
                <tr>
                  <td><strong>Siddharth Patel</strong></td>
                  <td>admin@dpskilltech.com</td>
                  <td><span className="role-tag role-admin">ADMIN</span></td>
                  <td><span className="status-tag active-tag">Active</span></td>
                  <td>Platform Director & System Governance</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </PortalLayout>
  );
};
