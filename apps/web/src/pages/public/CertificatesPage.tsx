import React from 'react';
import {
  Award,
  ShieldCheck,
  CheckCircle,
  FileCheck2,
  Search,
  ArrowRight,
  Layers,
  Users,
  Code
} from 'lucide-react';
import './CertificatesPage.css';

interface CertificatesPageProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
  onOpenDemoModal?: () => void;
}

export const CertificatesPage: React.FC<CertificatesPageProps> = ({ onNavigate }) => {
  return (
    <div className="certs-page-root">
      {/* Hero Banner */}
      <section className="certs-hero-section">
        <div className="container">
          <div className="certs-hero-badge">
            <Award size={16} />
            <span>Academic Credentials &amp; Standards</span>
          </div>

          <h1 className="certs-hero-title">
            Verifiable Credentials That Prove Real Engineering Competence
          </h1>

          <p className="certs-hero-desc">
            At DP Skill Tech, certificates are not attendance souvenirs. They are earned through our rigorous 7-stage academic pipeline and verified publicly by employers worldwide.
          </p>

          <div className="certs-hero-actions">
            <button
              type="button"
              className="btn-certs-primary"
              onClick={() => onNavigate('verify-certificate')}
            >
              <Search size={18} />
              <span>Verify a Certificate</span>
            </button>

            <button
              type="button"
              className="btn-certs-secondary"
              onClick={() => onNavigate('courses')}
            >
              <span>Explore Courses</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* The 7-Stage Learning Pipeline Highlight */}
      <section className="pipeline-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-kicker">THE ACADEMIC MODEL</span>
            <h2 className="section-title">The 7-Stage Engineering Pipeline</h2>
            <p className="section-desc">
              Every credential is mathematically linked to tangible student effort, audited code, and verified defenses.
            </p>
          </div>

          <div className="pipeline-visual-container">
            <div className="pipeline-flow-grid">
              <div className="pipeline-card">
                <span className="p-step">01</span>
                <div className="p-icon-wrap icon-blue">
                  <BookOpenIcon />
                </div>
                <h3>Learn</h3>
                <p>Interactive live lectures with industry practitioners. Zero pre-recorded shortcuts.</p>
              </div>

              <div className="pipeline-arrow-icon">&rarr;</div>

              <div className="pipeline-card">
                <span className="p-step">02</span>
                <div className="p-icon-wrap icon-cyan">
                  <Code size={22} />
                </div>
                <h3>Practice</h3>
                <p>Sandboxed in-browser coding labs with automated test suites and real-time execution.</p>
              </div>

              <div className="pipeline-arrow-icon">&rarr;</div>

              <div className="pipeline-card">
                <span className="p-step">03</span>
                <div className="p-icon-wrap icon-orange">
                  <Layers size={22} />
                </div>
                <h3>Project</h3>
                <p>Architecting full production repositories: Web backends, security defense networks, and AI apps.</p>
              </div>

              <div className="pipeline-arrow-icon">&rarr;</div>

              <div className="pipeline-card">
                <span className="p-step">04</span>
                <div className="p-icon-wrap icon-navy">
                  <FileCheck2 size={22} />
                </div>
                <h3>Assessment</h3>
                <p>Rigorous multi-topic examinations, algorithmic drills, and code review criteria.</p>
              </div>

              <div className="pipeline-arrow-icon">&rarr;</div>

              <div className="pipeline-card">
                <span className="p-step">05</span>
                <div className="p-icon-wrap icon-purple">
                  <Users size={22} />
                </div>
                <h3>Completion</h3>
                <p>1-on-1 technical defense with faculty and fulfillment of all cohort milestone requirements.</p>
              </div>

              <div className="pipeline-arrow-icon">&rarr;</div>

              <div className="pipeline-card">
                <span className="p-step">06</span>
                <div className="p-icon-wrap icon-gold">
                  <Award size={22} />
                </div>
                <h3>Certificate</h3>
                <p>Issuance of official DP Skill Tech credential with an immutable identifier.</p>
              </div>

              <div className="pipeline-arrow-icon">&rarr;</div>

              <div className="pipeline-card highlight-card">
                <span className="p-step">07</span>
                <div className="p-icon-wrap icon-green">
                  <ShieldCheck size={22} />
                </div>
                <h3>Public Verification</h3>
                <p>Instant online verification for employers and universities via QR code or direct URL lookup.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What the Certificate Represents */}
      <section className="rep-section">
        <div className="container">
          <div className="rep-grid">
            <div className="rep-content">
              <span className="section-kicker">EMPLOYER &amp; PARENT ASSURANCE</span>
              <h2 className="section-title">What a DP Skill Tech Certificate Represents</h2>
              <p className="rep-lead">
                Unlike mass-market video completion badges, our certificates guarantee that a candidate has personally written, tested, and defended working software.
              </p>

              <div className="rep-bullets">
                <div className="rep-bullet">
                  <div className="bullet-icon-check">
                    <CheckCircle size={20} />
                  </div>
                  <div>
                    <strong>Demonstrated Hands-on Competence:</strong>
                    <p>Evidence that the learner completed practical lab exercises in simulated production environments.</p>
                  </div>
                </div>

                <div className="rep-bullet">
                  <div className="bullet-icon-check">
                    <CheckCircle size={20} />
                  </div>
                  <div>
                    <strong>Inspected Code &amp; Projects:</strong>
                    <p>Verification that at least 3 to 5 real-world GitHub-hosted capstone projects were audited by senior mentors.</p>
                  </div>
                </div>

                <div className="rep-bullet">
                  <div className="bullet-icon-check">
                    <CheckCircle size={20} />
                  </div>
                  <div>
                    <strong>Live Defense &amp; Assessment Passed:</strong>
                    <p>The student defended their architectural choices and passed timed technical examinations.</p>
                  </div>
                </div>

                <div className="rep-bullet">
                  <div className="bullet-icon-check">
                    <CheckCircle size={20} />
                  </div>
                  <div>
                    <strong>Zero Cryptographic Tampering:</strong>
                    <p>Each certificate features an immutable hash registered in our official database.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rep-preview-panel">
              <div className="showcase-card-container">
                <div className="showcase-image-wrapper">
                  <img
                    src="/images/certificate-verification-showcase.jpg"
                    alt="Official DP Skill Tech Certificate of Completion with Anti-Tamper Verification"
                    className="showcase-cert-img"
                  />
                  <div className="showcase-cert-overlay">
                    <div className="cert-verified-pill">
                      <ShieldCheck size={16} />
                      <span>Tamper-Proof &amp; Digitally Verified</span>
                    </div>
                    <button
                      type="button"
                      className="btn-showcase-verify"
                      onClick={() => onNavigate('verify-certificate', { id: 'DPSK-2026-000123' })}
                    >
                      <Search size={15} />
                      <span>Verify This Credential Live</span>
                    </button>
                  </div>
                </div>
                <div className="showcase-caption">
                  <span>Certificate ID: <strong>DPSK-2026-000123</strong> • Recipient: <strong>Aarav Sharma</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Verification CTA Banner */}
      <section className="verify-cta-banner">
        <div className="container">
          <div className="cta-banner-card">
            <div className="cta-copy">
              <h2>Are you an Employer or University?</h2>
              <p>
                Verify a candidate's credentials in seconds without registration, phone calls, or paperwork.
              </p>
            </div>
            <button
              type="button"
              className="btn-banner-verify"
              onClick={() => onNavigate('verify-certificate')}
            >
              <span>Verify a Candidate's Certificate</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

function BookOpenIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
    </svg>
  );
}
