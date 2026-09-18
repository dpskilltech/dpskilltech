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
  Clock,
  User,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { TerminalLoader } from '../../components/common/TerminalLoader';
import brandLogo from '../../assets/dp-skilltech-logo-transparent.png';
import brandEmblem from '../../assets/dp-skilltech-emblem.png';
import './LoginPage.css';

interface LoginPageProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
  onOpenDemoModal: () => void;
  initialError?: string | null;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate, onOpenDemoModal, initialError }) => {
  const { login, register } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Register / Create ID form state
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regCourse, setRegCourse] = useState('full-stack-python-ai');
  const [showRegPassword, setShowRegPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [loginMessage, setLoginMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(initialError || null);
  const [showForgotModal, setShowForgotModal] = useState(false);

  React.useEffect(() => {
    if (initialError) {
      setErrorMessage(initialError);
    }
  }, [initialError]);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFullName.trim() || regFullName.trim().length < 2) {
      setErrorMessage('Please enter your full name (at least 2 characters).');
      return;
    }
    if (!regEmail.trim() || !/^\S+@\S+\.\S+$/.test(regEmail.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!regPassword || regPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    setLoginMessage(null);
    setErrorMessage(null);

    try {
      const res = await register({
        fullName: regFullName.trim(),
        email: regEmail.trim(),
        password: regPassword,
        phone: regPhone.trim() || undefined,
        courseId: regCourse
      });

      if (res.success && res.user) {
        setLoginMessage(
          `Student ID created successfully for ${res.user.fullName}! Redirecting to student workspace...`
        );
        setTimeout(() => {
          onNavigate('student-dashboard');
        }, 600);
      } else {
        setErrorMessage(res.error || 'Unable to create student account. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to connect to the registration service. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
          } else if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
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
              <img
                src={brandEmblem}
                alt="DP Emblem"
                className="login-brand-tag-emblem"
              />
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
                <div className="login-card-logo-wrap">
                  <img
                    src={brandLogo}
                    alt="DP SkillTech - Learn. Build. Grow."
                    className="login-card-logo-img"
                  />
                </div>

                {/* Tab Pill Toggle */}
                <div className="auth-mode-toggle" role="tablist" aria-label="Authentication Type">
                  <button
                    type="button"
                    role="tab"
                    id="tab-login"
                    aria-selected={authMode === 'login'}
                    className={`auth-toggle-tab ${authMode === 'login' ? 'active' : ''}`}
                    onClick={() => {
                      setAuthMode('login');
                      setErrorMessage(null);
                      setLoginMessage(null);
                    }}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    role="tab"
                    id="tab-register"
                    aria-selected={authMode === 'register'}
                    className={`auth-toggle-tab ${authMode === 'register' ? 'active' : ''}`}
                    onClick={() => {
                      setAuthMode('register');
                      setErrorMessage(null);
                      setLoginMessage(null);
                    }}
                  >
                    Create Student ID
                  </button>
                </div>

                <h2>{authMode === 'login' ? 'Sign In to Academy' : 'Create Student ID'}</h2>
                <p>
                  {authMode === 'login'
                    ? 'Enter your registered credentials to access your portal workspace.'
                    : 'Generate your official DP Skilltech Student ID and enter your engineering workspace.'}
                </p>
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
                    text={authMode === 'login' ? 'Authenticating credentials...' : 'Generating Student ID & enrolling...'}
                  />
                  <p className="loader-subtext">Verifying role permissions with secure DP-Kernel...</p>
                </div>
              ) : authMode === 'login' ? (
                <>
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

                  <div className="auth-switch-prompt">
                    <span>Don't have an academy account yet?</span>
                    <button
                      type="button"
                      className="auth-switch-btn"
                      onClick={() => {
                        setAuthMode('register');
                        setErrorMessage(null);
                        setLoginMessage(null);
                      }}
                    >
                      Create Student ID &rarr;
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <form onSubmit={handleRegisterSubmit} className="login-form register-form">
                    <div className="form-group">
                      <label className="form-label" htmlFor="reg-fullname">Full Name *</label>
                      <div className="input-with-icon">
                        <User size={18} className="field-icon" />
                        <input
                          id="reg-fullname"
                          type="text"
                          className="form-input with-icon"
                          required
                          value={regFullName}
                          onChange={(e) => setRegFullName(e.target.value)}
                          placeholder="e.g. Arun Kumar"
                          autoComplete="name"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="reg-email">Email Address *</label>
                      <div className="input-with-icon">
                        <Mail size={18} className="field-icon" />
                        <input
                          id="reg-email"
                          type="email"
                          className="form-input with-icon"
                          required
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="you@example.com"
                          autoComplete="email"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="reg-phone">Phone Number (Optional)</label>
                      <div className="input-with-icon">
                        <Phone size={18} className="field-icon" />
                        <input
                          id="reg-phone"
                          type="tel"
                          className="form-input with-icon"
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          autoComplete="tel"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="reg-course">Selected Track *</label>
                      <div className="input-with-icon">
                        <BookOpen size={18} className="field-icon" />
                        <select
                          id="reg-course"
                          className="form-input with-icon form-select"
                          value={regCourse}
                          onChange={(e) => setRegCourse(e.target.value)}
                        >
                          <option value="full-stack-python-ai">Full Stack Python with AI</option>
                          <option value="full-stack-java-ai">Full Stack Java with AI</option>
                          <option value="cyber-security-ethical-hacking">Cyber Security &amp; Ethical Hacking</option>
                          <option value="data-science-analytics">Data Science &amp; Data Analytics</option>
                          <option value="ui-ux-design-specialist">UI/UX Design Specialist</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="reg-pass">Create Password * (Min. 6 chars)</label>
                      <div className="input-with-icon">
                        <Lock size={18} className="field-icon" />
                        <input
                          id="reg-pass"
                          type={showRegPassword ? 'text' : 'password'}
                          className="form-input with-icon"
                          required
                          minLength={6}
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="••••••••••••"
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          className="toggle-password-btn"
                          onClick={() => setShowRegPassword(!showRegPassword)}
                          aria-label="Toggle password visibility"
                        >
                          {showRegPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn-login-submit btn-register-submit"
                      disabled={isLoading}
                    >
                      <span>Create Student ID &amp; Enter Portal</span>
                      <ArrowRight size={18} />
                    </button>
                  </form>

                  <div className="auth-switch-prompt">
                    <span>Already have a registered account?</span>
                    <button
                      type="button"
                      className="auth-switch-btn"
                      onClick={() => {
                        setAuthMode('login');
                        setErrorMessage(null);
                        setLoginMessage(null);
                      }}
                    >
                      Sign In &rarr;
                    </button>
                  </div>
                </>
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



