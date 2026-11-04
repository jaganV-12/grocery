import React, { useState, useEffect } from 'react';
import { 
  Store, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  Key, 
  Languages, 
  Coins, 
  Database, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  Eye, 
  EyeOff, 
  Sparkles, 
  ExternalLink,
  ShieldCheck,
  Send,
  MessageCircle,
  Clock,
  Layers,
  Sliders,
  Bell
} from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';
import api from '../services/api';

export default function Settings() {
  const { business, activeLang, geminiApiKey, saveGeminiKey, refreshAll, showToast, stats, changeLanguage } = useBusiness();

  // Local editable form state initialized from business context
  const [profile, setProfile] = useState({
    name: business?.name || 'Murugan Maligai & Department Store',
    tagline: business?.tagline || 'Daily Provisions & Fresh Essentials',
    ownerName: business?.ownerName || 'S. Murugan',
    email: business?.email || 'muruganstore@gmail.com',
    phone: business?.phone || '+91 98421 23456',
    alternatePhone: business?.alternatePhone || '+91 94432 11000',
    address: business?.address || '124, West Tower Street, Madurai, Tamil Nadu 625001',
    gstin: business?.gstin || '33AAAAA0000A1Z5',
    category: business?.category || 'Grocery & Department Store',
    currency: business?.currency || '₹',
    avatarIcon: business?.avatarIcon || '🏪',
    preferredLanguage: business?.preferredLanguage || activeLang || 'ta',
    aiProvider: business?.aiProvider || 'gemini'
  });

  const [geminiKeyInput, setGeminiKeyInput] = useState(geminiApiKey || '');
  const [showKey, setShowKey] = useState(false);
  const [copiedGst, setCopiedGst] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Sync state when context loads
  useEffect(() => {
    if (business) {
      setProfile({
        name: business.name || '',
        tagline: business.tagline || 'Daily Provisions & Fresh Essentials',
        ownerName: business.ownerName || '',
        email: business.email || 'muruganstore@gmail.com',
        phone: business.phone || '',
        alternatePhone: business.alternatePhone || '',
        address: business.address || '',
        gstin: business.gstin || '',
        category: business.category || 'Grocery & Department Store',
        currency: business.currency || '₹',
        avatarIcon: business.avatarIcon || '🏪',
        preferredLanguage: business.preferredLanguage || activeLang || 'ta',
        aiProvider: business.aiProvider || 'gemini'
      });
    }
  }, [business, activeLang]);

  const handleFieldChange = (field, val) => {
    setProfile(prev => ({ ...prev, [field]: val }));
    setHasChanges(true);
  };

  const handleSaveAll = async (e) => {
    if (e) e.preventDefault();
    try {
      setIsSaving(true);
      
      // 1. Save Business Profile Details
      await api.updateBusiness(profile);

      // 2. Save Gemini Key if modified
      if (geminiKeyInput !== geminiApiKey) {
        saveGeminiKey(geminiKeyInput);
      }

      // 3. Update active language if changed
      if (profile.preferredLanguage !== activeLang) {
        changeLanguage(profile.preferredLanguage);
      }

      setHasChanges(false);
      showToast('Profile & store settings saved successfully!');
      await refreshAll();
    } catch (err) {
      showToast('Failed to save profile: ' + err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyGst = () => {
    if (profile.gstin) {
      navigator.clipboard.writeText(profile.gstin);
      setCopiedGst(true);
      setTimeout(() => setCopiedGst(false), 2000);
      showToast('GSTIN copied to clipboard');
    }
  };

  const handleResetDemo = async () => {
    if (window.confirm('Reset all demo data back to default sample records? (Products, Customers & Transactions)')) {
      try {
        await api.resetDemoData();
        await refreshAll();
        showToast('Sample records restored successfully');
      } catch (err) {
        showToast('Reset failed: ' + err.message, 'error');
      }
    }
  };

  const storeIcons = ['🏪', '🌾', '🛒', '🛍️', '📦', '🏬', '🥛', '🥫'];

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      
      {/* Top Profile Header Bar */}
      <div className="bento-top-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
          <div style={{
            fontSize: '26px',
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            backgroundColor: '#ecfdf5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid #a7f3d0',
            flexShrink: 0
          }}>
            {profile.avatarIcon || '🏪'}
          </div>
          <div style={{ minWidth: 0, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '17px', fontWeight: '800', color: '#0f172a', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {profile.name || 'Store Profile'}
              </h2>
              <span className="badge badge-success" style={{ fontSize: '10px' }}>
                <ShieldCheck size={11} />
                Verified
              </span>
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
              Owner: <strong>{profile.ownerName}</strong>
            </div>
          </div>
        </div>

        {/* Save CTA */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
          {hasChanges ? (
            <span style={{ fontSize: '12px', color: '#d97706', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <AlertCircle size={14} />
              Unsaved changes
            </span>
          ) : <span />}

          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="btn btn-primary"
            style={{
              padding: '9px 20px',
              fontSize: '13px',
              boxShadow: hasChanges ? '0 4px 16px rgba(16, 185, 129, 0.4)' : 'none',
              transform: hasChanges ? 'scale(1.02)' : 'scale(1)',
              transition: 'all 0.2s ease'
            }}
          >
            <Save size={15} />
            <span>{isSaving ? 'Saving...' : 'Save All Changes'}</span>
          </button>
        </div>
      </div>

      {/* ==============================================================
          BENTO GRID SYSTEM
          ============================================================== */}
      <div className="bento-grid">

        {/* -------------------------------------------------------------
            TILE 1: IDENTITY & STORE BRANDING (Hero Bento Box - Span 8)
            ------------------------------------------------------------- */}
        <div className="bento-card bento-card-hero bento-col-8">
          <div className="bento-glow-blob" style={{ width: '220px', height: '220px', background: 'rgba(16, 185, 129, 0.15)', top: '-50px', right: '-50px' }}></div>
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="bento-icon-box" style={{ backgroundColor: '#059669', color: '#ffffff' }}>
                  <Store size={22} />
                </div>
                <div>
                  <span className="bento-field-label">PRIMARY IDENTITY</span>
                  <div style={{ fontSize: '16px', fontWeight: '800', color: '#064e3b' }}>
                    Store Branding & Ownership
                  </div>
                </div>
              </div>

              {/* Avatar Selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: '600', color: '#047857' }}>Store Icon:</span>
                <div style={{ display: 'flex', gap: '4px', backgroundColor: '#ffffff', padding: '3px', borderRadius: '10px', border: '1px solid #a7f3d0' }}>
                  {storeIcons.map((ic, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleFieldChange('avatarIcon', ic)}
                      style={{
                        background: profile.avatarIcon === ic ? '#ecfdf5' : 'transparent',
                        border: profile.avatarIcon === ic ? '1px solid #059669' : 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        padding: '2px 4px'
                      }}
                      title="Select store avatar"
                    >
                      {ic}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Editable Fields Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
              <div>
                <label className="bento-field-label">
                  <Store size={12} color="#059669" />
                  Business Name (கடை பெயர்)
                </label>
                <input
                  type="text"
                  className="bento-editable-input"
                  value={profile.name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  placeholder="e.g. Murugan Maligai & Department Store"
                />
              </div>

              <div>
                <label className="bento-field-label">
                  <User size={12} color="#059669" />
                  Proprietor / Owner Name
                </label>
                <input
                  type="text"
                  className="bento-editable-input"
                  value={profile.ownerName}
                  onChange={(e) => handleFieldChange('ownerName', e.target.value)}
                  placeholder="e.g. S. Murugan"
                />
              </div>

              <div>
                <label className="bento-field-label">
                  <Sparkles size={12} color="#059669" />
                  Store Tagline / Slogan
                </label>
                <input
                  type="text"
                  className="bento-editable-input"
                  value={profile.tagline}
                  onChange={(e) => handleFieldChange('tagline', e.target.value)}
                  placeholder="e.g. Quality Provisions Since 2012"
                />
              </div>

              <div>
                <label className="bento-field-label">
                  <Layers size={12} color="#059669" />
                  Business Type / Category
                </label>
                <select
                  className="bento-editable-input"
                  value={profile.category}
                  onChange={(e) => handleFieldChange('category', e.target.value)}
                >
                  <option value="Grocery & Department Store">Grocery & Department Store (மளிகை கடை)</option>
                  <option value="Supermarket & Retail">Supermarket & Retail</option>
                  <option value="Wholesale & Distribution">Wholesale & Distribution</option>
                  <option value="Textiles & Garments">Textiles & Garments (ஜவுளி கடை)</option>
                  <option value="Hardware & Electricals">Hardware & Electricals</option>
                  <option value="Stationery & General">Stationery & General Store</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* -------------------------------------------------------------
            TILE 2: DIGITAL CONTACT & EMAIL MATRIX (Span 4) — High Priority!
            ------------------------------------------------------------- */}
        <div className="bento-card bento-col-4" style={{ backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div className="bento-icon-box" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
              <Mail size={22} />
            </div>
            <div>
              <span className="bento-field-label">COMMUNICATION</span>
              <div style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>
                Contact & Email
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
            {/* Email Address */}
            <div>
              <label className="bento-field-label" style={{ color: '#2563eb' }}>
                <Mail size={12} />
                Store Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  className="bento-editable-input"
                  value={profile.email}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                  placeholder="shop@voicebiz.in"
                  style={{ paddingRight: '40px' }}
                />
                {profile.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    target="_blank"
                    rel="noreferrer"
                    title="Send test email"
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '11px',
                      color: '#2563eb',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <Send size={15} />
                  </a>
                )}
              </div>
            </div>

            {/* Primary Phone */}
            <div>
              <label className="bento-field-label">
                <Phone size={12} color="#059669" />
                Primary Business Mobile (WhatsApp)
              </label>
              <input
                type="text"
                className="bento-editable-input"
                value={profile.phone}
                onChange={(e) => handleFieldChange('phone', e.target.value)}
                placeholder="+91 98421 23456"
              />
            </div>

            {/* Alternate Phone */}
            <div>
              <label className="bento-field-label">
                <Phone size={12} color="#64748b" />
                Landline / Alternate Support
              </label>
              <input
                type="text"
                className="bento-editable-input"
                value={profile.alternatePhone}
                onChange={(e) => handleFieldChange('alternatePhone', e.target.value)}
                placeholder="+91 94432 11000"
              />
            </div>
          </div>
        </div>

        {/* -------------------------------------------------------------
            TILE 3: LOCATION & TAX IDENTITY (Span 4)
            ------------------------------------------------------------- */}
        <div className="bento-card bento-col-4">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div className="bento-icon-box" style={{ backgroundColor: '#fffbeb', color: '#d97706' }}>
              <MapPin size={22} />
            </div>
            <div>
              <span className="bento-field-label">COMPLIANCE & PREMISES</span>
              <div style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>
                Address & GST Identity
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Address */}
            <div>
              <label className="bento-field-label">
                <MapPin size={12} color="#d97706" />
                Shop Address (Printed on Invoices)
              </label>
              <textarea
                rows={2}
                className="bento-editable-input"
                value={profile.address}
                onChange={(e) => handleFieldChange('address', e.target.value)}
                placeholder="Door No, Street Name, Town, City, Pin Code"
                style={{ resize: 'none', fontSize: '13px' }}
              />
            </div>

            {/* GSTIN */}
            <div>
              <label className="bento-field-label">
                <FileText size={12} color="#d97706" />
                GSTIN / Tax Identification
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  className="bento-editable-input"
                  value={profile.gstin}
                  onChange={(e) => handleFieldChange('gstin', e.target.value.toUpperCase())}
                  placeholder="33AAAAA0000A1Z5"
                  style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}
                />
                <button
                  type="button"
                  onClick={handleCopyGst}
                  className="btn btn-secondary"
                  style={{ padding: '0 12px' }}
                  title="Copy GSTIN"
                >
                  {copiedGst ? <Check size={16} color="#059669" /> : <Copy size={16} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* -------------------------------------------------------------
            TILE 4: VOICE ASSISTANT & LANGUAGE PREFERENCES (Span 4)
            ------------------------------------------------------------- */}
        <div className="bento-card bento-col-4">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div className="bento-icon-box" style={{ backgroundColor: '#ecfdf5', color: '#059669' }}>
              <Languages size={22} />
            </div>
            <div>
              <span className="bento-field-label">SPEECH ENGINE</span>
              <div style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>
                Voice Assistant Defaults
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label className="bento-field-label">
              Default Speech Recognition Language:
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                onClick={() => handleFieldChange('preferredLanguage', 'ta')}
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  border: profile.preferredLanguage === 'ta' ? '2px solid #059669' : '1px solid #e2e8f0',
                  backgroundColor: profile.preferredLanguage === 'ta' ? '#ecfdf5' : '#ffffff',
                  color: profile.preferredLanguage === 'ta' ? '#065f46' : '#334155',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{ fontSize: '18px', marginBottom: '4px' }}>🇮🇳 தமிழ்</div>
                <div style={{ fontSize: '13px', fontWeight: '700' }}>Tamil (India)</div>
                <div style={{ fontSize: '11px', opacity: 0.8 }}>ta-IN Web Speech</div>
              </button>

              <button
                type="button"
                onClick={() => handleFieldChange('preferredLanguage', 'en')}
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  border: profile.preferredLanguage === 'en' ? '2px solid #059669' : '1px solid #e2e8f0',
                  backgroundColor: profile.preferredLanguage === 'en' ? '#ecfdf5' : '#ffffff',
                  color: profile.preferredLanguage === 'en' ? '#065f46' : '#334155',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{ fontSize: '18px', marginBottom: '4px' }}>🇬🇧 English</div>
                <div style={{ fontSize: '13px', fontWeight: '700' }}>English (India)</div>
                <div style={{ fontSize: '11px', opacity: 0.8 }}>en-IN Web Speech</div>
              </button>
            </div>

            <div style={{
              padding: '10px 12px',
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              fontSize: '12px',
              color: '#64748b',
              marginTop: '4px'
            }}>
              VoiceBiz AI recognizes commands in Tamil, English, and Tanglish with auto-translation to canonical inventory items.
            </div>
          </div>
        </div>

        {/* -------------------------------------------------------------
            TILE 5: AI BRAIN & GEMINI CONFIGURATION (Span 4)
            ------------------------------------------------------------- */}
        <div className="bento-card bento-col-4">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="bento-icon-box" style={{ backgroundColor: '#f5f3ff', color: '#7c3aed' }}>
                <Key size={22} />
              </div>
              <div>
                <span className="bento-field-label">AI INTELLIGENCE</span>
                <div style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>
                  Gemini API Core
                </div>
              </div>
            </div>

            <span className={`badge ${geminiKeyInput ? 'badge-success' : 'badge-info'}`} style={{ fontSize: '10px' }}>
              {geminiKeyInput ? 'Gemini 1.5 Active' : 'Local NLP Active'}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <label className="bento-field-label">
                Google Gemini API Key
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showKey ? 'text' : 'password'}
                  className="bento-editable-input"
                  placeholder="AIzaSy..."
                  value={geminiKeyInput}
                  onChange={(e) => {
                    setGeminiKeyInput(e.target.value);
                    setHasChanges(true);
                  }}
                  style={{ paddingRight: '40px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '11px',
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer'
                  }}
                >
                  {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.5 }}>
              Keys are stored securely on the backend environment. If no key is provided, the built-in Tamil/English rule-based NLP engine operates automatically.
            </div>

            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              style={{
                fontSize: '11px',
                color: '#7c3aed',
                fontWeight: '600',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                textDecoration: 'none'
              }}
            >
              <span>Get free Gemini API Key from Google AI Studio</span>
              <ExternalLink size={11} />
            </a>
          </div>
        </div>

        {/* -------------------------------------------------------------
            TILE 6: FINANCIAL & CURRENCY SETTINGS (Span 4)
            ------------------------------------------------------------- */}
        <div className="bento-card bento-col-4">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div className="bento-icon-box" style={{ backgroundColor: '#ecfdf5', color: '#059669' }}>
              <Coins size={22} />
            </div>
            <div>
              <span className="bento-field-label">COMMERCIAL FORMATS</span>
              <div style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>
                Currency & Billing
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label className="bento-field-label">
                Currency Symbol
              </label>
              <select
                className="bento-editable-input"
                value={profile.currency}
                onChange={(e) => handleFieldChange('currency', e.target.value)}
              >
                <option value="₹">₹ - Indian Rupee (INR)</option>
                <option value="$">$ - US Dollar (USD)</option>
                <option value="€">€ - Euro (EUR)</option>
                <option value="£">£ - British Pound (GBP)</option>
                <option value="AED">AED - UAE Dirham</option>
                <option value="SAR">SAR - Saudi Riyal</option>
              </select>
            </div>

            <div>
              <label className="bento-field-label">
                Default Credit Terms (கடன் தவணை)
              </label>
              <select
                className="bento-editable-input"
                defaultValue="Tomorrow"
              >
                <option value="Tomorrow">Tomorrow (நாளை)</option>
                <option value="Within 7 Days">Within 7 Days (ஒரு வாரத்திற்குள்)</option>
                <option value="Monthly Settlement">Monthly End (மாத இறுதியில்)</option>
              </select>
            </div>
          </div>
        </div>

        {/* -------------------------------------------------------------
            TILE 7: SYSTEM DIAGNOSTICS & DATA RESTORE (Span 8)
            ------------------------------------------------------------- */}
        <div className="bento-card bento-col-8">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="bento-icon-box" style={{ backgroundColor: '#f1f5f9', color: '#0f172a' }}>
                <Database size={22} />
              </div>
              <div>
                <span className="bento-field-label">STORAGE & LEDGER HEALTH</span>
                <div style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>
                  Database Engine & Sample Data
                </div>
              </div>
            </div>

            <span className={`badge ${stats?.isMongoActive ? 'badge-success' : 'badge-info'}`}>
              {stats?.isMongoActive ? 'MongoDB Atlas Active' : 'Persistent Local File DB Active'}
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px',
            marginBottom: '16px'
          }}>
            <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>TOTAL PRODUCTS</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>{stats?.totalProductsCount || 0} items</div>
            </div>

            <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>REGISTERED CUSTOMERS</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>{stats?.totalCustomersCount || 0} khata accounts</div>
            </div>

            <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>PENDING KHATA DUES</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#d97706' }}>{profile.currency}{stats?.totalPendingPayments?.toLocaleString('en-IN') || 0}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              Need to test voice sales with fresh records? Restore default Tamil grocery items & customers.
            </div>

            <button
              type="button"
              onClick={handleResetDemo}
              className="btn btn-secondary"
              style={{ color: '#dc2626', borderColor: '#fca5a5', fontSize: '12px', padding: '6px 14px' }}
            >
              <RotateCcw size={14} />
              <span>Restore Sample Demo Records</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
