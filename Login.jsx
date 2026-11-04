import React, { useState } from 'react';
import { 
  Mic, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';
import api from '../services/api';

export default function Login({ onNavigateSignUp, onNavigateWelcome }) {
  const { loginUser, showToast } = useBusiness();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Forgot password modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMsg, setForgotMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter both your email address and password.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.login({ email, password });
      if (res.success && res.token && res.user) {
        loginUser(res.token, res.user);
      } else {
        setErrorMsg(res.error || 'Authentication failed. Please check your credentials.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  // 1-Click Demo Fill
  const handleFillDemo = async () => {
    setEmail('murugan@voicebiz.in');
    setPassword('VoiceBiz@123');
    setErrorMsg('');

    try {
      setLoading(true);
      const res = await api.login({ email: 'murugan@voicebiz.in', password: 'VoiceBiz@123' });
      if (res.success && res.token && res.user) {
        loginUser(res.token, res.user);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    try {
      const res = await api.forgotPassword(forgotEmail);
      setForgotMsg(res.message || 'Password reset instructions sent!');
    } catch (err) {
      setForgotMsg(err.message || 'Error requesting password reset.');
    }
  };

  return (
    <div className="liquid-glass-viewport" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Ambient Emerald Ambient Glows */}
      <div className="liquid-glass-bg-glow-1"></div>
      <div className="liquid-glass-bg-glow-2"></div>

      {/* Top Header */}
      <header style={{ padding: '20px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 10 }}>
        <button
          onClick={onNavigateWelcome}
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.16)',
            borderRadius: '12px',
            color: '#CDCDCD',
            padding: '8px 16px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#FFFFFF'; e.currentTarget.style.borderColor = '#19D3A2'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#CDCDCD'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.16)'; }}
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={onNavigateWelcome}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #19D3A2 0%, #059669 100%)',
            color: '#041c15',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Mic size={17} />
          </div>
          <span style={{ fontWeight: '800', fontSize: '16px', color: '#FFFFFF' }}>VoiceBiz AI</span>
        </div>
      </header>

      {/* Main Content Area */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '30px 20px',
        position: 'relative',
        zIndex: 10
      }}>
        <div className="liquid-glass-card" style={{
          maxWidth: '460px',
          width: '100%',
          padding: '38px 32px',
          backgroundColor: 'rgba(18, 18, 18, 0.75)'
        }}>
          <div className="liquid-glass-card-reflection"></div>

          {/* Card Header */}
          <div style={{ textAlign: 'center', marginBottom: '26px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'radial-gradient(circle, rgba(25, 211, 162, 0.25) 0%, rgba(25, 211, 162, 0.05) 70%)',
              border: '1px solid rgba(25, 211, 162, 0.4)',
              color: '#19D3A2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px auto',
              boxShadow: '0 0 25px rgba(25, 211, 162, 0.25)'
            }}>
              <ShieldCheck size={28} />
            </div>

            <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#FFFFFF', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
              Welcome Back
            </h2>
            <p style={{ fontSize: '13px', color: '#CDCDCD', margin: 0 }}>
              Sign in to manage your voice sales and inventory
            </p>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div style={{
              padding: '12px 14px',
              borderRadius: '10px',
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              color: '#FCA5A5',
              fontSize: '13px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px'
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Email Address */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#CDCDCD', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  required
                  className="liquid-glass-input"
                  placeholder="murugan@voicebiz.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ paddingLeft: '40px' }}
                />
                <Mail size={16} style={{ position: 'absolute', left: '14px', top: '15px', color: '#CDCDCD' }} />
              </div>
            </div>

            {/* Password */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#CDCDCD', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  style={{ background: 'none', border: 'none', color: '#19D3A2', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                >
                  Forgot password?
                </button>
              </div>

              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="liquid-glass-input"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingLeft: '40px', paddingRight: '40px' }}
                />
                <Lock size={16} style={{ position: 'absolute', left: '14px', top: '15px', color: '#CDCDCD' }} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '13px', background: 'none', border: 'none', color: '#CDCDCD', cursor: 'pointer', padding: '2px' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: '#19D3A2', cursor: 'pointer' }}
              />
              <label htmlFor="rememberMe" style={{ fontSize: '13px', color: '#CDCDCD', cursor: 'pointer' }}>
                Keep me signed in on this device
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="liquid-glass-btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '15px', marginTop: '6px' }}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* 1-Click Demo Login Button */}
          <div style={{ marginTop: '20px', paddingTop: '18px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <button
              type="button"
              onClick={handleFillDemo}
              disabled={loading}
              className="liquid-glass-btn-secondary"
              style={{
                width: '100%',
                padding: '11px',
                fontSize: '13px',
                borderColor: 'rgba(25, 211, 162, 0.4)',
                color: '#19D3A2'
              }}
            >
              <Zap size={14} />
              <span>1-Click Demo Login (Murugan Store)</span>
            </button>
          </div>

          {/* Switch to Sign Up */}
          <div style={{ textAlign: 'center', marginTop: '22px', fontSize: '13px', color: '#CDCDCD' }}>
            Don't have an account yet?{' '}
            <button
              type="button"
              onClick={onNavigateSignUp}
              style={{
                background: 'none',
                border: 'none',
                color: '#19D3A2',
                fontWeight: '700',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Sign Up Free
            </button>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="modal-overlay" onClick={() => setShowForgotModal(false)}>
          <div className="liquid-glass-card" style={{ maxWidth: '420px', width: '100%', padding: '28px', backgroundColor: '#0f0f0f' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#FFFFFF', marginBottom: '8px' }}>
              Reset Password
            </h3>
            <p style={{ fontSize: '13px', color: '#CDCDCD', marginBottom: '18px' }}>
              Enter your registered email address to receive password reset instructions.
            </p>

            {forgotMsg && (
              <div style={{ padding: '10px 14px', borderRadius: '8px', backgroundColor: 'rgba(25, 211, 162, 0.1)', border: '1px solid rgba(25, 211, 162, 0.3)', color: '#19D3A2', fontSize: '12px', marginBottom: '14px' }}>
                {forgotMsg}
              </div>
            )}

            <form onSubmit={handleForgotSubmit}>
              <input
                type="email"
                required
                className="liquid-glass-input"
                placeholder="murugan@voicebiz.in"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                style={{ marginBottom: '16px' }}
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="liquid-glass-btn-secondary"
                  style={{ padding: '8px 16px', fontSize: '13px' }}
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="liquid-glass-btn-primary"
                  style={{ padding: '8px 18px', fontSize: '13px' }}
                >
                  Send Reset Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

