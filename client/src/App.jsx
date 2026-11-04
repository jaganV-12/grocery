import React, { useState } from 'react';
import { BusinessProvider, useBusiness } from './context/BusinessContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Toast from './components/Toast';
import MobileBottomNav from './components/MobileBottomNav';

// Public Liquid Glass Auth & Landing Pages
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

// Protected Business Suite Pages
import Dashboard from './pages/Dashboard';
import VoiceAssistant from './pages/VoiceAssistant';
import Inventory from './pages/Inventory';
import Customers from './pages/Customers';
import Transactions from './pages/Transactions';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

import { Loader2, Mic, Smartphone, Monitor, Wifi, X } from 'lucide-react';

function MainApp() {
  const { 
    isAuthenticated, 
    authLoading, 
    authView, 
    setAuthView, 
    toast 
  } = useBusiness();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileSimulator, setIsMobileSimulator] = useState(false);
  const [showNetworkTip, setShowNetworkTip] = useState(true);

  // 1. Initial Session Loading Screen
  if (authLoading) {
    return (
      <div className="liquid-glass-viewport" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        gap: '16px'
      }}>
        <div className="liquid-glass-bg-glow-1"></div>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #19D3A2 0%, #059669 100%)',
          color: '#041c15',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 35px rgba(25, 211, 162, 0.4)'
        }}>
          <Mic size={32} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#19D3A2', fontSize: '14px', fontWeight: '700' }}>
          <Loader2 size={16} className="animate-spin" />
          <span>VoiceBiz AI · Initializing Session...</span>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated Experience (Liquid Glass UI)
  const renderUnauthenticated = () => {
    return (
      <>
        {authView === 'login' && (
          <Login 
            onNavigateSignUp={() => setAuthView('signup')} 
            onNavigateWelcome={() => setAuthView('welcome')} 
          />
        )}

        {authView === 'signup' && (
          <SignUp 
            onNavigateLogin={() => setAuthView('login')} 
            onNavigateWelcome={() => setAuthView('welcome')} 
          />
        )}

        {authView === 'welcome' && (
          <Welcome 
            onGetStarted={() => setAuthView('signup')} 
            onLogin={() => setAuthView('login')} 
          />
        )}

        {/* Global Toast for alerts */}
        <Toast toast={toast} />
      </>
    );
  };

  // 3. Authenticated Business Management Experience
  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard setActiveTab={setActiveTab} />;
      case 'voice':
        return <VoiceAssistant setActiveTab={setActiveTab} />;
      case 'inventory':
        return <Inventory />;
      case 'customers':
        return <Customers />;
      case 'payments':
        return <Transactions />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  const renderAuthenticated = () => {
    return (
      <div className="app-layout">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />

        {/* Main Content Area */}
        <div className="main-content">
          <Header
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />

          <main style={{ flex: 1, paddingBottom: '30px' }}>
            {renderActivePage()}
          </main>
        </div>

        {/* Mobile Bottom Navigation Bar (Handhelds) */}
        <MobileBottomNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Toast Notification */}
        <Toast toast={toast} />
      </div>
    );
  };

  const content = !isAuthenticated ? renderUnauthenticated() : renderAuthenticated();

  // If Mobile Frame Simulator is active on desktop
  if (isMobileSimulator) {
    return (
      <div className="mobile-simulator-wrapper">
        {/* Floating Top Controls */}
        <div style={{
          position: 'fixed',
          top: '14px',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: 'rgba(15, 23, 42, 0.9)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          padding: '6px 14px',
          borderRadius: '24px',
          color: '#ffffff',
          boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
          fontSize: '13px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#19D3A2', fontWeight: '700' }}>
            <Smartphone size={16} />
            <span>Mobile Phone Preview (390px)</span>
          </div>

          <button
            onClick={() => setIsMobileSimulator(false)}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '14px',
              color: '#ffffff',
              padding: '4px 10px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Monitor size={14} />
            <span>Switch to Desktop View</span>
          </button>
        </div>

        {/* Smartphone Hardware Mockup Frame */}
        <div className="mobile-phone-frame">
          <div className="mobile-phone-notch">
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#090d16' }}></div>
            <div style={{ width: '48px', height: '5px', borderRadius: '3px', backgroundColor: '#090d16' }}></div>
          </div>
          <div className="mobile-phone-viewport">
            {content}
          </div>
        </div>
      </div>
    );
  }

  // Standard Direct Responsive View + Floating Mobile Switcher
  return (
    <>
      {content}

      {/* Floating Mobile Toggle Button on Desktop */}
      <aside aria-label="Device view toggle" style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
      }} className="desktop-only">
        {showNetworkTip && (
          <div style={{
            background: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid rgba(25, 211, 162, 0.3)',
            color: '#FFFFFF',
            borderRadius: '12px',
            padding: '10px 14px',
            fontSize: '12px',
            maxWidth: '310px',
            boxShadow: '0 12px 30px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px'
          }}>
            <Wifi size={16} color="#19D3A2" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '700', color: '#19D3A2' }}>Open on Actual Smartphone:</div>
              <div style={{ opacity: 0.9, marginTop: '2px' }}>
                Connect your phone to the same Wi-Fi and visit:<br />
                <code style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 4px', borderRadius: '4px', color: '#19D3A2' }}>
                  http://10.85.249.126:5173
                </code>
              </div>
            </div>
            <button
              onClick={() => setShowNetworkTip(false)}
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}
            >
              <X size={14} />
            </button>
          </div>
        )}

        <button
          onClick={() => setIsMobileSimulator(true)}
          style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            border: '1px solid rgba(25, 211, 162, 0.4)',
            color: '#ffffff',
            borderRadius: '24px',
            padding: '8px 16px',
            fontSize: '12px',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
            transition: 'all 0.2s ease',
            width: 'fit-content'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#19D3A2';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(25, 211, 162, 0.35)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(25, 211, 162, 0.4)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.3)';
          }}
          title="Toggle smartphone simulation frame"
        >
          <Smartphone size={16} color="#19D3A2" />
          <span>📱 View as Mobile Phone</span>
        </button>
      </aside>
    </>
  );
}

export default function App() {
  return (
    <BusinessProvider>
      <MainApp />
    </BusinessProvider>
  );
}
