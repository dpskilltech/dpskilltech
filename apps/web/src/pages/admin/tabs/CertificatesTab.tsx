import React from 'react';
import { Award, CheckCircle2, ExternalLink } from 'lucide-react';
import type { AdminCertificate } from '../../../data/portalMockData';

interface CertificatesTabProps {
  certificatesList: AdminCertificate[];
  setShowIssueCertModal: (val: boolean) => void;
  onNavigateToPublic: (page: string, params?: Record<string, string>) => void;
}

export const CertificatesTab: React.FC<CertificatesTabProps> = ({
  certificatesList,
  setShowIssueCertModal,
  onNavigateToPublic
}) => {
  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <div>
          <h3 className="admin-panel-title">
            <Award size={18} className="icon-orange" />
            <span>Verified Certificate Registry</span>
          </h3>
          <p className="admin-panel-subtitle">
            Certificates are awarded only upon 100% curriculum completion, all assignments submitted, and passing mock defense.
          </p>
        </div>
        <button
          type="button"
          className="btn-admin-primary"
          onClick={() => setShowIssueCertModal(true)}
        >
          <Award size={16} />
          <span>Issue Certificate</span>
        </button>
      </div>

      <div className="cohort-table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Certificate ID</th>
              <th>Student Name</th>
              <th>Course Curriculum</th>
              <th>Issue Date</th>
              <th>Verification Hash</th>
              <th>Academic Grade</th>
              <th>Status</th>
              <th>Public Verification</th>
            </tr>
          </thead>
          <tbody>
            {certificatesList.map((cert) => (
              <tr key={cert.id}>
                <td>
                  <span className="code-badge">{cert.certificateId}</span>
                </td>
                <td>
                  <strong>{cert.studentName}</strong>
                </td>
                <td>{cert.courseTitle}</td>
                <td>{cert.issueDate}</td>
                <td>
                  <code>{cert.verificationCode}</code>
                </td>
                <td>
                  <strong>{cert.grade}</strong>
                </td>
                <td>
                  <span className="verified-badge">
                    <CheckCircle2 size={13} /> {cert.status}
                  </span>
                </td>
                <td>
                  <button
                    type="button"
                    className="btn-admin-secondary btn-xs"
                    onClick={() =>
                      onNavigateToPublic('verify-certificate', { id: cert.certificateId })
                    }
                    title={`Open Public Verification Page for ${cert.certificateId}`}
                  >
                    <ExternalLink size={13} />
                    <span>Verify</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
