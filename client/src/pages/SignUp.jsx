import React, { useState } from 'react';
import { 
  Mic, 
  Mail, 
  Lock, 
  User, 
  Store, 
  Phone, 
  Layers, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  ShieldCheck
} from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';
import api from '../services/api';

export default function SignUp({ onNavigateLogin, onNavigateWelcome }) {
  const { loginUser, showToast } = useBusiness();

  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    email: '',
    phone: '',
    category: 'Grocery & Department Store',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim() || !formData.businessName.trim() || !formData.email.trim() || !formData.password) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify your passwords.');
      return;
    }

    if (!agreeTerms) {
      setErrorMsg('Please agree to the Terms of Service and Privacy Policy to continue.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.register(formData);
      if (res.success && res.token && res.user) {
        loginUser(res.token, res.user);
      } else {
        setErrorMsg(res.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Error creating account. Please try again.');
    } finally {
      setLoading(false);
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
          maxWidth: '560px',
          width: '100%',
          padding: '38px 32px',
          backgroundColor: 'rgba(18, 18, 18, 0.8)'
        }}>
          <div className="liquid-glass-card-reflection"></div>

          {/* Card Header */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
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
              <Store size={28} />
            </div>

            <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#FFFFFF', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
              Create Your Business Account
            </h2>
            <p style={{ fontSize: '13px', color: '#CDCDCD', margin: 0 }}>
              Join hundreds of shop owners managing sales with Tamil and English voice commands
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

          {/* Registration Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Row 1: Full Name & Business Name */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#CDCDCD', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
                  Your Full Name*
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    required
                    className="liquid-glass-input"
                    placeholder="e.g. S. Murugan"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    style={{ paddingLeft: '38px' }}
                  />
                  <User size={15} style={{ position: 'absolute', left: '13px', top: '15px', color: '#CDCDCD' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#CDCDCD', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
                  Business / Shop Name*
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    required
                    className="liquid-glass-input"
                    placeholder="e.g. Murugan Maligai"
                    value={formData.businessName}
                    onChange={(e) => handleChange('businessName', e.target.value)}
                    style={{ paddingLeft: '38px' }}
                  />
                  <Store size={15} style={{ position: 'absolute', left: '13px', top: '15px', color: '#CDCDCD' }} />
                </div>
              </div>
            </div>

            {/* Row 2: Email & Mobile Number */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#CDCDCD', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
                  Email Address*
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    required
                    className="liquid-glass-input"
                    placeholder="murugan@store.in"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    style={{ paddingLeft: '38px' }}
                  />
                  <Mail size={15} style={{ position: 'absolute', left: '13px', top: '15px', color: '#CDCDCD' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#CDCDCD', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
                  Mobile / WhatsApp Number
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    className="liquid-glass-input"
                    placeholder="+91 98421 23456"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    style={{ paddingLeft: '38px' }}
                  />
                  <Phone size={15} style={{ position: 'absolute', left: '13px', top: '15px', color: '#CDCDCD' }} />
                </div>
              </div>
            </div>

            {/* Business Category */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#CDCDCD', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
                Business Category
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  className="liquid-glass-input"
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  style={{ paddingLeft: '38px', backgroundColor: '#141414' }}
                >
                  <option value="Grocery & Department Store">Grocery & Department Store (மளிகை கடை)</option>
                  <option value="Supermarket & Retail">Supermarket & Retail</option>
                  <option value="Wholesale & Distribution">Wholesale & Distribution (மொத்த வியாபாரம்)</option>
                  <option value="Textiles & Garments">Textiles & Garments (ஜவுளி கடை)</option>
                  <option value="Hardware & Electricals">Hardware & Electricals</option>
                  <option value="Dairy & Beverages">Dairy & Beverages</option>
                  <option value="Other Retail Business">Other Retail Business</option>
                </select>
                <Layers size={15} style={{ position: 'absolute', left: '13px', top: '15px', color: '#CDCDCD' }} />
              </div>
            </div>

            {/* Row 3: Password & Confirm Password */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#CDCDCD', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
                  Password (Min 6 chars)*
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="liquid-glass-input"
                    placeholder="••••••••••••"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    style={{ paddingLeft: '38px', paddingRight: '36px' }}
                  />
                  <Lock size={15} style={{ position: 'absolute', left: '13px', top: '15px', color: '#CDCDCD' }} />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '10px', top: '13px', background: 'none', border: 'none', color: '#CDCDCD', cursor: 'pointer', padding: '2px' }}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#CDCDCD', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
                  Confirm Password*
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="liquid-glass-input"
                    placeholder="••••••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    style={{ paddingLeft: '38px' }}
                  />
                  <Lock size={15} style={{ position: 'absolute', left: '13px', top: '15px', color: '#CDCDCD' }} />
                </div>
              </div>
            </div>

            {/* Terms Agreement Checkbox */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginTop: '4px' }}>
              <input
                type="checkbox"
                id="agreeTerms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                style={{ accentColor: '#19D3A2', marginTop: '3px', cursor: 'pointer' }}
              />
              <label htmlFor="agreeTerms" style={{ fontSize: '12px', color: '#CDCDCD', lineHeight: 1.4, cursor: 'pointer' }}>
                I agree to the VoiceBiz AI Terms of Service and Privacy Policy. All voice records and store data remain private to my business.
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="liquid-glass-btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '15px', marginTop: '10px' }}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Business Account</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Switch to Login */}
          <div style={{ textAlign: 'center', marginTop: '22px', fontSize: '13px', color: '#CDCDCD' }}>
            Already have an account?{' '}
            <button
              type="button"
              onClick={onNavigateLogin}
              style={{
                background: 'none',
                border: 'none',
                color: '#19D3A2',
                fontWeight: '700',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

