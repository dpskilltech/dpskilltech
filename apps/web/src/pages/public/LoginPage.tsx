import React, { useState } from 'react';
import {
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
  Layers,
  GraduationCap,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  X,
  Phone,
  Clock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { TerminalLoader } from '../../components/common/TerminalLoader';
import './LoginPage.css';

interface LoginPageProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
  onOpenDemoModal: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate, onOpenDemoModal }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginMessage, setLoginMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginMessage(null);
    setErrorMessage(null);

    try {
      const res = await login(email.trim(), password);
      if (res.success && res.user) {
        const role = (res.user.role || '').toUpperCase();
        setLoginMessage(
          `Authentication successful for ${res.user.fullName}. Redirecting to your workspace...`
        );
        setTimeout(() => {
          if (role === 'STUDENT') {
            onNavigate('student-dashboard');
          } else if (role === 'TEACHER') {
            onNavigate('teacher-dashboard');
          } else if (role === 'ADMIN') {
            onNavigate('admin-dashboard');
          } else {
            onNavigate('home');
          }
        }, 500);
      } else {
        setErrorMessage(res.error || 'Authentication failed. Please check your credentials.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to connect to the authentication server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="container login-container">
        <div className="login-grid">
          {/* Left Info Column */}
          <div className="login-info-panel">
            <div className="login-brand-tag">
              <span className="brand-dot"></span>
              <span>DP Skilltech Learning Platform</span>
            </div>

            <h1 className="login-main-title">
              Welcome to Your <span className="gradient-text-login">Virtual Academy</span>
            </h1>

            <p className="panel-desc">
              Access your daily live Zoom classes, watch past session recordings, practice in the browser coding lab, submit assignments, and book private 1-on-1 mock interviews.
            </p>

            <div className="panel-feature-list">
              <div className="panel-feature-card">
                <div className="feature-icon-wrap icon-blue">
                  <GraduationCap size={22} />
                </div>
                <div className="feature-card-text">
                  <strong>Student Learning Portal</strong>
                  <p>Daily live sessions, recorded library, cloud coding lab, and progress certificates.</p>
                </div>
              </div>

              <div className="panel-feature-card">
                <div className="feature-icon-wrap icon-orange">
                  <Layers size={22} />
                </div>
                <div className="feature-card-text">
                  <strong>Teacher &amp; Mentor Studio</strong>
                  <p>Batch management, Zoom class scheduling, grading rubrics, and mock interview slots.</p>
                </div>
              </div>

              <div className="panel-feature-card">
                <div className="feature-icon-wrap icon-navy">
                  <ShieldCheck size={22} />
                </div>
                <div className="feature-card-text">
                  <strong>Administrative Console</strong>
                  <p>15-student batch caps, course curriculum builder, user accounts, and analytical reports.</p>
                </div>
              </div>
            </div>

            <div className="new-student-callout">
              <div className="callout-copy">
                <strong>Not yet enrolled in a 15-student batch?</strong>
                <p>Attend a free 90-minute live demo class and inspect our curriculum firsthand.</p>
              </div>
              <button type="button" className="btn-book-demo" onClick={onOpenDemoModal}>
                <Sparkles size={15} />
                <span>Book Free Demo</span>
              </button>
            </div>
          </div>

          {/* Right Form Card */}
          <div className="login-form-panel">
            <div className="login-card">
              <div className="login-card-header">
                <h2>Sign In to Academy</h2>
                <p>Enter your registered credentials to access your portal workspace.</p>
              </div>

              {loginMessage && (
                <div className="login-alert-box login-success-box">
                  <CheckCircle2 size={18} className="alert-icon success-icon" />
                  <span>{loginMessage}</span>
                </div>
              )}

              {errorMessage && (
                <div className="login-alert-box login-error-box">
                  <AlertCircle size={18} className="alert-icon error-icon" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {isLoading ? (
                <div className="login-loader-wrap">
                  <TerminalLoader
                    title="Auth-Daemon"
                    text="Authenticating credentials..."
                  />
                  <p className="loader-subtext">Verifying role permissions with secure DP-Kernel...</p>
                </div>
              ) : (
                <form onSubmit={handleLoginSubmit} className="login-form">
                  <div className="form-group">
                    <label className="form-label" htmlFor="login-email">Email Address</label>
                    <div className="input-with-icon">
                      <Mail size={18} className="field-icon" />
                      <input
                        id="login-email"
                        type="email"
                        className="form-input with-icon"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@dpskilltech.in"
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <div className="password-label-row">
                      <label className="form-label" htmlFor="login-pass">Password</label>
                      <button
                        type="button"
                        className="forgot-link-btn"
                        onClick={() => setShowForgotModal(true)}
                      >
                        Forgot password?
                      </button>
                    </div>

                    <div className="input-with-icon">
                      <Lock size={18} className="field-icon" />
                      <input
                        id="login-pass"
                        type={showPassword ? 'text' : 'password'}
                        className="form-input with-icon"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        className="toggle-password-btn"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="remember-me-row">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <span>Keep me signed in for 7 days</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="btn-login-submit"
                    disabled={isLoading}
                  >
                    <span>Sign In to Academy</span>
                    <ArrowRight size={18} />
                  </button>
                </form>
              )}

              <div className="login-security-footer">
                <ShieldCheck size={16} className="security-icon" />
                <span>Protected by DP Skilltech RBAC &amp; Session Rotation</span>
              </div>

              <div className="return-website-row">
                <button
                  type="button"
                  className="btn-return-home"
                  onClick={() => onNavigate('home')}
                >
                  &larr; Return to Public Website
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password / Admin Assistance Modal */}
      {showForgotModal && (
        <div className="login-modal-overlay" onClick={() => setShowForgotModal(false)}>
          <div
            className="login-modal-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="modal-close-btn"
              onClick={() => setShowForgotModal(false)}
              aria-label="Close dialog"
            >
              <X size={20} />
            </button>

            <div className="modal-icon-badge">
              <HelpCircle size={28} />
            </div>

            <h3 id="modal-title" className="modal-title">Account Credentials Assistance</h3>

            <p className="modal-desc">
              DP Skilltech student and instructor accounts are provisioned directly by our academic administration upon batch enrollment. Self-service password resets are restricted for security.
            </p>

            <div className="modal-contact-card">
              <div className="contact-row">
                <Mail size={16} className="contact-row-icon" />
                <div>
                  <strong>Email Support:</strong>
                  <a href="mailto:support@dpskilltech.in" className="contact-link">support@dpskilltech.in</a>
                </div>
              </div>

              <div className="contact-row">
                <Phone size={16} className="contact-row-icon" />
                <div>
                  <strong>Admissions Desk:</strong>
                  <span>+91 98765 43210</span>
                </div>
              </div>

              <div className="contact-row">
                <Clock size={16} className="contact-row-icon" />
                <div>
                  <strong>Desk Hours:</strong>
                  <span>Mon – Sat, 9:00 AM – 8:00 PM IST</span>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn-modal-contact"
                onClick={() => {
                  setShowForgotModal(false);
                  onNavigate('contact');
                }}
              >
                Open Admissions Inquiry Form
              </button>
              <button
                type="button"
                className="btn-modal-cancel"
                onClick={() => setShowForgotModal(false)}
              >
                Back to Sign In
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};



