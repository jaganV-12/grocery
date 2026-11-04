import React from 'react';
import { Menu, RotateCw, LogOut, Mic, Globe } from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';

export default function Header({ activeTab, setActiveTab, onToggleSidebar }) {
  const { business, activeLang, changeLanguage, refreshAll, loading, logoutUser } = useBusiness();

  const titles = {
    dashboard: {
      en: "Today's Dashboard",
      ta: "இன்றைய முகப்பு பலகை",
      subEn: "Live overview of daily sales, outstanding balances, and inventory health",
      subTa: "விற்பனை, நிலுவைத் தொகை மற்றும் இருப்பு நிலை கண்ணோட்டம்"
    },
    voice: {
      en: "AI Voice Assistant",
      ta: "AI குரல் உதவியாளர்",
      subEn: "Speak sales orders in Tamil or English to generate verified transactions",
      subTa: "தமிழ் அல்லது ஆங்கிலத்தில் பேசி பில் மற்றும் ரசீது உருவாக்கவும்"
    },
    inventory: {
      en: "Inventory & Stock",
      ta: "சரக்கு இருப்பு மேலாண்மை",
      subEn: "Track available quantity, purchase/selling margins, and low stock thresholds",
      subTa: "பொருட்கள், விலை மற்றும் குறைந்த இருப்பு விவரங்கள்"
    },
    customers: {
      en: "Customer Khata",
      ta: "வாடிக்கையாளர் கணக்கு",
      subEn: "Manage customer contact details, purchase histories, and credit balances",
      subTa: "கடன் பாக்கி மற்றும் வாடிக்கையாளர் விவரங்கள்"
    },
    payments: {
      en: "Sales & Invoices",
      ta: "விற்பனை & ரசீதுகள்",
      subEn: "Audit verified transaction records, payment statuses, and invoice receipts",
      subTa: "அனைத்து விற்பனை மற்றும் பணப் பரிவர்த்தனைகள்"
    },
    reports: {
      en: "Business Reports",
      ta: "வணிக அறிக்கைகள்",
      subEn: "Sales growth, profit margins, top-selling items, and credit summaries",
      subTa: "விற்பனை புள்ளிவிவரங்கள் மற்றும் லாப அறிக்கைகள்"
    },
    settings: {
      en: "Profile & Settings",
      ta: "சுயவிவரம் & அமைப்புகள்",
      subEn: "Bento Grid control center for shop identity, email, phone, GSTIN, and AI parameters",
      subTa: "கடை விவரம், மின்னஞ்சல், தொலைபேசி மற்றும் AI கட்டமைப்பு"
    }
  };

  const current = titles[activeTab] || titles.dashboard;

  return (
    <header className="top-header">
      {/* Left side: Hamburger (Mobile) + Clean Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
        <button
          onClick={onToggleSidebar}
          className="mobile-only-btn header-menu-btn"
          title="Open menu"
          aria-label="Open sidebar menu"
        >
          <Menu size={20} />
        </button>

        <div style={{ minWidth: 0, flex: 1 }}>
          <h1 style={{
            fontSize: '17px',
            fontWeight: '800',
            color: '#0f172a',
            letterSpacing: '-0.02em',
            margin: 0,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {activeLang === 'ta' ? current.ta : current.en}
          </h1>
          <p className="desktop-only" style={{ fontSize: '12px', color: '#64748b', margin: 0, marginTop: '2px' }}>
            {activeLang === 'ta' ? current.subTa : current.subEn}
          </p>
        </div>
      </div>

      {/* Right side: Clean, uncrowded controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        {/* MOBILE CONTROLS (Only 2 compact items: Language pill + Store avatar) */}
        <button
          onClick={() => changeLanguage(activeLang === 'ta' ? 'en' : 'ta')}
          className="mobile-only-btn mobile-header-lang-btn"
          title="Switch language between Tamil and English"
        >
          {activeLang === 'ta' ? '🇮🇳 தமிழ்' : '🇬🇧 EN'}
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className="mobile-only-btn mobile-header-avatar-btn"
          title="Store Profile & Settings"
          aria-label="Store Profile"
        >
          <span>{business?.avatarIcon || '🏪'}</span>
        </button>

        {/* DESKTOP-ONLY CONTROLS */}
        <button
          onClick={refreshAll}
          title="Refresh store data"
          disabled={loading}
          className="desktop-only desktop-header-refresh-btn"
        >
          <RotateCw size={15} className={loading ? 'animate-spin' : ''} />
        </button>

        {/* Desktop Segmented Language Switcher */}
        <div className="desktop-only desktop-header-lang-segmented">
          <button
            onClick={() => changeLanguage('ta')}
            style={{
              padding: '5px 10px',
              fontSize: '12px',
              fontWeight: activeLang === 'ta' ? '700' : '500',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeLang === 'ta' ? '#ffffff' : 'transparent',
              color: activeLang === 'ta' ? '#059669' : '#64748b',
              boxShadow: activeLang === 'ta' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            🇮🇳 தமிழ்
          </button>
          <button
            onClick={() => changeLanguage('en')}
            style={{
              padding: '5px 10px',
              fontSize: '12px',
              fontWeight: activeLang === 'en' ? '700' : '500',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeLang === 'en' ? '#ffffff' : 'transparent',
              color: activeLang === 'en' ? '#059669' : '#64748b',
              boxShadow: activeLang === 'en' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            🇬🇧 English
          </button>
        </div>

        {/* Desktop Profile Pill */}
        <button
          onClick={() => setActiveTab('settings')}
          className="desktop-only desktop-header-profile-pill"
          title="Open Profile & Settings"
        >
          <span className="desktop-header-avatar">
            {business?.avatarIcon || '🏪'}
          </span>
          <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#0f172a' }}>
              {business?.name || business?.ownerName || 'Profile'}
            </div>
          </div>
        </button>

        {/* Desktop Quick Voice Sale CTA */}
        {activeTab !== 'voice' && (
          <button
            onClick={() => setActiveTab('voice')}
            className="btn btn-primary desktop-only"
            style={{ padding: '8px 14px', fontSize: '13px' }}
          >
            <Mic size={15} />
            <span>{activeLang === 'ta' ? 'குரல் விற்பனை' : 'Voice Sale'}</span>
          </button>
        )}

        {/* Desktop Logout Button */}
        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to log out of VoiceBiz AI?')) {
              logoutUser();
            }
          }}
          className="btn btn-secondary desktop-only"
          style={{ padding: '7px 9px', color: '#64748b', borderRadius: '8px' }}
          title="Sign out of account"
        >
          <LogOut size={15} />
        </button>
      </div>
    </header>
  );
}
