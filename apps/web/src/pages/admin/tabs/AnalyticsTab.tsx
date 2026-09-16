import React from 'react';
import { BarChart3, Clock, Award, Zap } from 'lucide-react';

export const AnalyticsTab: React.FC = () => {
  return (
    <div className="admin-view-stack">
      <div className="admin-panel">
        <div className="admin-panel-header">
          <div>
            <h3 className="admin-panel-title">
              <BarChart3 size={18} className="icon-blue" />
              <span>Academy Telemetry &amp; Learning Analytics</span>
            </h3>
            <p className="admin-panel-subtitle">
              Real-time operational indicators across cohort attendance, curriculum completion, and sandbox code executions.
            </p>
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

          <div className="analytics-card">
            <Zap size={24} className="icon-orange" />
            <h4>Sandbox Code Runs</h4>
            <div className="analytics-num">1,420+</div>
            <p>Isolated Docker container executions across Python, Java, Node.js and SQL.</p>
          </div>
        </div>
      </div>

      {/* Language Breakdown Card */}
      <div className="admin-panel">
        <h4 className="admin-subhead">Coding Sandbox Language Utilization</h4>
        <div className="lang-bar-container">
          <div className="lang-bar-segment segment-python" style={{ width: '48%' }}>
            <span>Python 3.12 (48%)</span>
          </div>
          <div className="lang-bar-segment segment-java" style={{ width: '26%' }}>
            <span>Java 21 (26%)</span>
          </div>
          <div className="lang-bar-segment segment-node" style={{ width: '16%' }}>
            <span>Node.js (16%)</span>
          </div>
          <div className="lang-bar-segment segment-sql" style={{ width: '10%' }}>
            <span>SQL (10%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
