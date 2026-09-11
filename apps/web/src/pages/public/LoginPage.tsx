import React, { useState } from 'react';
import {
  User,
  GraduationCap,
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
  Layers,
  Zap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle } from 'lucide-react';
import { TerminalLoader } from '../../components/common/TerminalLoader';
import './LoginPage.css';

interface LoginPageProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
  onOpenDemoModal: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate, onOpenDemoModal }) => {
  const { login } = useAuth();
  const [activeRole, setActiveRole] = useState<'student' | 'teacher' | 'admin'>('student');
  const [email, setEmail] = useState('student@dpskilltech.in');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginMessage, setLoginMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRoleSelect = (role: 'student' | 'teacher' | 'admin') => {
    setActiveRole(role);
    setLoginMessage(null);
    setErrorMessage(null);
    if (role === 'student') {
      setEmail('student@dpskilltech.in');
      setPassword('password123');
    } else if (role === 'teacher') {
      setEmail('instructor@dpskilltech.in');
      setPassword('password123');
    } else {
      setEmail('admin@dpskilltech.in');
      setPassword('password123');
    }
  };


  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginMessage(null);
    setErrorMessage(null);

    try {
      const res = await login(email, password);
      if (res.success && res.user) {
        setLoginMessage(
          `Authentication successful for ${res.user.fullName}. Redirecting to ${res.user.role} workspace...`
        );
        setTimeout(() => {
          if (res.user?.role === 'STUDENT') {
            onNavigate('student-dashboard');
          } else if (res.user?.role === 'TEACHER') {
            onNavigate('teacher-dashboard');
          } else if (res.user?.role === 'ADMIN') {
            onNavigate('admin-dashboard');
          } else {
            onNavigate('home');
          }
        }, 600);
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
                  <strong>Teacher & Mentor Studio</strong>
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
              {/* Role Selector Tabs */}
              <div className="role-selector-tabs">
                <button
                  type="button"
                  className={`role-tab ${activeRole === 'student' ? 'active' : ''}`}
                  onClick={() => handleRoleSelect('student')}
                >
                  <User size={16} />
                  <span>Student</span>
                </button>
                <button
                  type="button"
                  className={`role-tab ${activeRole === 'teacher' ? 'active' : ''}`}
                  onClick={() => handleRoleSelect('teacher')}
                >
                  <GraduationCap size={16} />
                  <span>Teacher</span>
                </button>
                <button
                  type="button"
                  className={`role-tab ${activeRole === 'admin' ? 'active' : ''}`}
                  onClick={() => handleRoleSelect('admin')}
                >
                  <ShieldCheck size={16} />
                  <span>Admin</span>
                </button>
              </div>

              {/* Fast Test Credential Switcher Chips */}
              <div className="quick-fill-section">
                <span className="quick-fill-label">
                  <Zap size={13} className="quick-fill-icon" />
                  Quick Fill:
                </span>
                <div className="quick-fill-chips">
                  <button
                    type="button"
                    className={`chip-btn ${activeRole === 'student' ? 'chip-active' : ''}`}
                    onClick={() => handleRoleSelect('student')}
                    title="Fill student credentials"
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    className={`chip-btn ${activeRole === 'teacher' ? 'chip-active' : ''}`}
                    onClick={() => handleRoleSelect('teacher')}
                    title="Fill teacher credentials"
                  >
                    Teacher
                  </button>
                  <button
                    type="button"
                    className={`chip-btn ${activeRole === 'admin' ? 'chip-active' : ''}`}
                    onClick={() => handleRoleSelect('admin')}
                    title="Fill admin credentials"
                  >
                    Admin
                  </button>
                </div>
              </div>

              <div className="login-card-header">
                <h2>{activeRole.charAt(0).toUpperCase() + activeRole.slice(1)} Sign In</h2>
                <p>Enter your credentials to access the authenticated portal.</p>
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
                    text={`Authenticating ${activeRole}...`}
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
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <div className="password-label-row">
                      <label className="form-label" htmlFor="login-pass">Password</label>
                      <button
                        type="button"
                        className="forgot-link-btn"
                        onClick={() => alert('Please contact academy admin at support@dpskilltech.in to reset your credentials.')}
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
                      <input type="checkbox" defaultChecked />
                      <span>Keep me signed in for 7 days</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="btn-login-submit"
                    disabled={isLoading}
                  >
                    <span>Sign In to {activeRole.charAt(0).toUpperCase() + activeRole.slice(1)} Portal</span>
                    <ArrowRight size={18} />
                  </button>
                </form>
              )}

              <div className="login-security-footer">
                <ShieldCheck size={16} className="security-icon" />
                <span>Protected by DP Skilltech RBAC & Session Rotation</span>
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
    </div>
  );
};

