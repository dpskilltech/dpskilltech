import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Search,
  ShieldCheck,
  Award,
  Calendar,
  Building2,
  QrCode,
  Copy,
  ArrowRight,
  CheckCircle,
  FileCheck2
} from 'lucide-react';
import { findCertificateById, type VerifiableCertificate } from '../../data/certificatesData';
import './VerifyCertificatePage.css';

interface VerifyCertificatePageProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
  initialCertificateId?: string;
}

export const VerifyCertificatePage: React.FC<VerifyCertificatePageProps> = ({
  onNavigate,
  initialCertificateId
}) => {
  const [searchQuery, setSearchQuery] = useState(initialCertificateId || 'DPSK-2026-000123');
  const [searchedCert, setSearchedCert] = useState<VerifiableCertificate | undefined>(undefined);
  const [hasSearched, setHasSearched] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const idToLookup = initialCertificateId || 'DPSK-2026-000123';
    setSearchQuery(idToLookup);
    const found = findCertificateById(idToLookup);
    setSearchedCert(found);
    setHasSearched(true);
  }, [initialCertificateId]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    const found = findCertificateById(searchQuery);
    setSearchedCert(found);
    setHasSearched(true);
  };

  const handleSelectSample = (sampleId: string) => {
    setSearchQuery(sampleId);
    const found = findCertificateById(sampleId);
    setSearchedCert(found);
    setHasSearched(true);
  };

  const handleCopyLink = () => {
    if (!searchedCert) return;
    const url = `https://www.dpskilltech.in/#verify-certificate/${searchedCert.certificateId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="verify-page-root">
      {/* Top Header Banner */}
      <section className="verify-header-section">
        <div className="container">
          <div className="verify-badge">
            <ShieldCheck size={16} />
            <span>Public Academic Registry</span>
          </div>
          <h1 className="verify-title">Official Certificate Verification</h1>
          <p className="verify-subtitle">
            Instantly authenticate credentials issued by <strong>DP Skill Tech</strong>. Employers, organizations, and academic institutions can verify curriculum completion, evaluated projects, and practical competence.
          </p>

          {/* Search Bar */}
          <form className="verify-search-card" onSubmit={handleSearch}>
            <div className="search-input-wrap">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                className="verify-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter Certificate ID (e.g. DPSK-2026-000123)"
                aria-label="Certificate ID"
              />
            </div>
            <button type="submit" className="btn-verify-submit">
              <span>Verify Certificate</span>
              <ArrowRight size={17} />
            </button>
          </form>

          {/* Sample Chips */}
          <div className="sample-id-row">
            <span className="sample-label">Try verifiable examples:</span>
            <button
              type="button"
              className="sample-chip"
              onClick={() => handleSelectSample('DPSK-2026-000123')}
            >
              DPSK-2026-000123 (Python + AI)
            </button>
            <button
              type="button"
              className="sample-chip"
              onClick={() => handleSelectSample('DPSK-2026-000124')}
            >
              DPSK-2026-000124 (Cyber Security)
            </button>
            <button
              type="button"
              className="sample-chip"
              onClick={() => handleSelectSample('DPSK-2026-000125')}
            >
              DPSK-2026-000125 (Web Dev)
            </button>
          </div>
        </div>
      </section>

      {/* Verification Result Section */}
      <section className="verify-results-section">
        <div className="container">
          {hasSearched && searchedCert ? (
            <div className="cert-display-card">
              {/* Status Header */}
              <div className="cert-status-banner status-verified">
                <div className="status-left">
                  <div className="status-icon-bubble">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <div className="status-kicker">AUTHENTIC ACADEMY CREDENTIAL</div>
                    <div className="status-heading">
                      Certificate Status: <span className="status-pill">VERIFIED · ACTIVE</span>
                    </div>
                  </div>
                </div>

                <div className="status-right-actions">
                  <button type="button" className="btn-copy-verification" onClick={handleCopyLink}>
                    <Copy size={15} />
                    <span>{copied ? 'Verification Link Copied!' : 'Copy Verification URL'}</span>
                  </button>
                </div>
              </div>

              {/* Certificate Detail Grid */}
              <div className="cert-inner-content">
                <div className="cert-header-watermark">
                  <div className="academy-brand">
                    <span className="brand-dot-verify"></span>
                    <strong>DP SKILL TECH</strong>
                  </div>
                  <span className="academy-sub">Official Registry Record</span>
                </div>

                <div className="cert-meta-grid">
                  <div className="meta-box highlight-box">
                    <span className="meta-label">Certified Student</span>
                    <strong className="meta-value student-name">{searchedCert.studentName}</strong>
                    <span className="privacy-badge">Verified Individual Record</span>
                  </div>

                  <div className="meta-box highlight-box">
                    <span className="meta-label">Completed Course Program</span>
                    <strong className="meta-value course-name">{searchedCert.courseName}</strong>
                    <span className="track-sub">{searchedCert.curriculumTrack}</span>
                  </div>

                  <div className="meta-box">
                    <span className="meta-label">Issuing Organization</span>
                    <strong className="meta-value">
                      <Building2 size={16} className="inline-icon" />
                      {searchedCert.issuingOrganization}
                    </strong>
                    <span className="desc-sub">Accredited Engineering Academy</span>
                  </div>

                  <div className="meta-box">
                    <span className="meta-label">Certificate ID</span>
                    <strong className="meta-value cert-id-code">{searchedCert.certificateId}</strong>
                    <span className="desc-sub">Unique Immutable Identifier</span>
                  </div>

                  <div className="meta-box">
                    <span className="meta-label">Completion Date</span>
                    <strong className="meta-value">
                      <Calendar size={16} className="inline-icon" />
                      {searchedCert.completionDate}
                    </strong>
                    <span className="desc-sub">Issued on {searchedCert.issueDate}</span>
                  </div>

                  <div className="meta-box">
                    <span className="meta-label">Academic Evaluation</span>
                    <strong className="meta-value grade-value">
                      <Award size={16} className="inline-icon" />
                      {searchedCert.evaluationGrade}
                    </strong>
                    <span className="desc-sub">Project Defense &amp; Assessment</span>
                  </div>
                </div>

                {/* 7-Stage Academic Learning Pipeline Verification */}
                <div className="pipeline-audit-card">
                  <h3 className="pipeline-audit-title">
                    <FileCheck2 size={18} />
                    <span>Academic Fulfillment Audit (7-Stage Pipeline Verified)</span>
                  </h3>
                  <div className="pipeline-steps-strip">
                    <span className="pipeline-tag tag-active">Learn</span>
                    <span className="pipeline-arrow">&rarr;</span>
                    <span className="pipeline-tag tag-active">Practice</span>
                    <span className="pipeline-arrow">&rarr;</span>
                    <span className="pipeline-tag tag-active">Project</span>
                    <span className="pipeline-arrow">&rarr;</span>
                    <span className="pipeline-tag tag-active">Assessment</span>
                    <span className="pipeline-arrow">&rarr;</span>
                    <span className="pipeline-tag tag-active">Completion</span>
                    <span className="pipeline-arrow">&rarr;</span>
                    <span className="pipeline-tag tag-active">Certificate</span>
                    <span className="pipeline-arrow">&rarr;</span>
                    <span className="pipeline-tag tag-verified">Public Verification</span>
                  </div>

                  <div className="criteria-checklist-grid">
                    <div className="criteria-item">
                      <CheckCircle size={16} className="criteria-check" />
                      <div>
                        <strong>Live Classes Attended:</strong>
                        <span>{searchedCert.learningPipeline.classesAttended}</span>
                      </div>
                    </div>
                    <div className="criteria-item">
                      <CheckCircle size={16} className="criteria-check" />
                      <div>
                        <strong>Hands-On Assignments:</strong>
                        <span>{searchedCert.learningPipeline.assignmentsCompleted}</span>
                      </div>
                    </div>
                    <div className="criteria-item">
                      <CheckCircle size={16} className="criteria-check" />
                      <div>
                        <strong>Portfolio Projects:</strong>
                        <span>{searchedCert.learningPipeline.projectsBuilt}</span>
                      </div>
                    </div>
                    <div className="criteria-item">
                      <CheckCircle size={16} className="criteria-check" />
                      <div>
                        <strong>Technical Assessment:</strong>
                        <span>{searchedCert.learningPipeline.assessmentScore}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Skills Mastered */}
                <div className="skills-mastered-box">
                  <h4 className="skills-title">Verified Competencies &amp; Technologies:</h4>
                  <div className="skills-pill-wrap">
                    {searchedCert.skillsMastered.map((skill, i) => (
                      <span key={i} className="skill-verify-pill">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Cryptographic Hash & QR Safeguard */}
                <div className="qr-verification-footer">
                  <div className="qr-visual-box">
                    <QrCode size={56} className="qr-icon-svg" />
                    <span className="qr-label">Scan to Verify</span>
                  </div>
                  <div className="qr-info">
                    <strong>Cryptographic Verification Hash:</strong>
                    <code className="crypto-hash">{searchedCert.verificationHash}</code>
                    <p className="privacy-note">
                      <strong>Privacy Protection:</strong> Sensitive personal data (phone numbers, residential addresses, and private identification) are intentionally excluded from public registry records in compliance with student data privacy guidelines.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : hasSearched ? (
            <div className="cert-not-found-card">
              <div className="not-found-icon">
                <AlertTriangle size={32} />
              </div>
              <h3>Certificate Record Not Found</h3>
              <p>
                No active credential was found matching Certificate ID: <code>{searchQuery}</code>.
              </p>
              <p className="help-text">
                Please double-check the ID format (e.g. <code>DPSK-2026-000123</code>). If you believe this is an error, please contact our academic registry office at <a href="mailto:certificates@dpskilltech.in">certificates@dpskilltech.in</a>.
              </p>
            </div>
          ) : null}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="verify-explainer-section">
        <div className="container">
          <div className="explainer-box">
            <h2 className="explainer-title">How DP Skill Tech Certificates Are Earned</h2>
            <p className="explainer-desc">
              At DP Skill Tech, certificates cannot be purchased or earned merely by watching videos. Every student must complete the rigorous 7-stage academic pipeline:
            </p>

            <div className="explainer-steps-grid">
              <div className="step-card">
                <span className="step-num">01</span>
                <strong>Live Attendance</strong>
                <p>Minimum 90% attendance in live interactive instructor-led classes.</p>
              </div>
              <div className="step-card">
                <span className="step-num">02</span>
                <strong>Practical Labs</strong>
                <p>All hands-on programming and security lab assignments reviewed by mentors.</p>
              </div>
              <div className="step-card">
                <span className="step-num">03</span>
                <strong>Production Projects</strong>
                <p>Complete deployment of real applications, security setups, or data models.</p>
              </div>
              <div className="step-card">
                <span className="step-num">04</span>
                <strong>Evaluated Defense</strong>
                <p>Passing technical examinations and live 1-on-1 code defense.</p>
              </div>
            </div>

            <div className="explainer-actions">
              <button
                type="button"
                className="btn-explore-courses-link"
                onClick={() => onNavigate('courses')}
              >
                <span>Explore Academy Curriculum</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
