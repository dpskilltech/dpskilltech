import React from 'react';
import {
  Check,
  Radio,
  Server,
  ShieldCheck,
  Settings
} from 'lucide-react';

export const SettingsTab: React.FC = () => {
  return (
    <div className="admin-view-stack">
      <div className="admin-panel">
        <div className="admin-panel-header">
          <div>
            <h3 className="admin-panel-title">
              <Settings size={18} className="icon-blue" />
              <span>Academy Platform Configuration &amp; RBAC</span>
            </h3>
            <p className="admin-panel-subtitle">
              Role-Based Access Control and core infrastructure telemetry.
            </p>
          </div>
        </div>

        <div className="settings-grid">
          <div className="settings-box">
            <h4>Role Permissions Matrix</h4>
            <div className="rbac-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Capability</th>
                    <th>Student</th>
                    <th>Coach</th>
                    <th>Admin</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Join Live Zoom Classes</td>
                    <td>
                      <Check className="text-green" size={16} />
                    </td>
                    <td>
                      <Check className="text-green" size={16} /> (Host)
                    </td>
                    <td>
                      <Check className="text-green" size={16} />
                    </td>
                  </tr>
                  <tr>
                    <td>Sandboxed Code Lab</td>
                    <td>
                      <Check className="text-green" size={16} />
                    </td>
                    <td>
                      <Check className="text-green" size={16} />
                    </td>
                    <td>
                      <Check className="text-green" size={16} />
                    </td>
                  </tr>
                  <tr>
                    <td>Evaluate Assignments</td>
                    <td>&mdash;</td>
                    <td>
                      <Check className="text-green" size={16} />
                    </td>
                    <td>
                      <Check className="text-green" size={16} />
                    </td>
                  </tr>
                  <tr>
                    <td>1:1 Mock Interview Conducting</td>
                    <td>&mdash;</td>
                    <td>
                      <Check className="text-green" size={16} />
                    </td>
                    <td>
                      <Check className="text-green" size={16} />
                    </td>
                  </tr>
                  <tr>
                    <td>Manage Batches &amp; Caps</td>
                    <td>&mdash;</td>
                    <td>&mdash;</td>
                    <td>
                      <Check className="text-green" size={16} />
                    </td>
                  </tr>
                  <tr>
                    <td>Issue Certificates</td>
                    <td>&mdash;</td>
                    <td>&mdash;</td>
                    <td>
                      <Check className="text-green" size={16} />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="settings-box">
            <h4>Infrastructure &amp; Integrations Health</h4>
            <div className="infra-health-list">
              <div className="infra-item">
                <div className="infra-label">
                  <Radio size={16} className="text-green" />
                  <span>Zoom Video API</span>
                </div>
                <span className="status-badge badge-available">
                  Operational (Deep Link Mode)
                </span>
              </div>

              <div className="infra-item">
                <div className="infra-label">
                  <Server size={16} className="text-green" />
                  <span>Sandboxed Code Execution Engine</span>
                </div>
                <span className="status-badge badge-available">Container Cluster Healthy</span>
              </div>

              <div className="infra-item">
                <div className="infra-label">
                  <ShieldCheck size={16} className="text-green" />
                  <span>Database &amp; RBAC Auth Daemon</span>
                </div>
                <span className="status-badge badge-available">Encrypted &bull; 0 Anomalies</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
