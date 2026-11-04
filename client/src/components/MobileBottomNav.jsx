import React from 'react';
import { LayoutDashboard, Mic, Package, Users, Settings } from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';

export default function MobileBottomNav({ activeTab, setActiveTab }) {
  const { stats, activeLang } = useBusiness();

  const navItems = [
    {
      id: 'dashboard',
      label: activeLang === 'ta' ? 'முகப்பு' : 'Home',
      icon: LayoutDashboard
    },
    {
      id: 'inventory',
      label: activeLang === 'ta' ? 'இருப்பு' : 'Stock',
      icon: Package,
      alertCount: stats?.lowStockCount || 0
    },
    {
      id: 'voice',
      label: activeLang === 'ta' ? 'குரல்' : 'Voice AI',
      icon: Mic,
      isCenterAction: true
    },
    {
      id: 'customers',
      label: activeLang === 'ta' ? 'கடன்' : 'Khata',
      icon: Users
    },
    {
      id: 'settings',
      label: activeLang === 'ta' ? 'சுயவிவரம்' : 'Profile',
      icon: Settings
    }
  ];

  return (
    <div className="mobile-bottom-nav glass-capsule-dock-wrapper" aria-label="Mobile Navigation Dock">
      <nav className="glass-capsule-dock">
        {/* Specular Top Gloss Sheen Reflection */}
        <div className="glass-capsule-sheen" />

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          // Center Elevated Circular Action Button (Voice AI)
          if (item.isCenterAction) {
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`capsule-center-btn ${isActive ? 'active' : ''}`}
                title="Speak to VoiceBiz AI (Tamil & English)"
                aria-label="Voice Assistant"
              >
                <div className="capsule-center-aura" />
                <div className="capsule-center-circle">
                  <Mic size={22} className="capsule-mic-icon" />
                </div>
                <span className="capsule-center-label">
                  {item.label}
                </span>
              </button>
            );
          }

          // Flanking Standard Capsule Navigation Items
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`capsule-item ${isActive ? 'active' : ''}`}
              aria-label={item.label}
            >
              <div className="capsule-icon-box">
                <Icon size={19} className="capsule-icon" />
                {item.alertCount > 0 && (
                  <span className="capsule-alert-dot" title={`${item.alertCount} low stock alerts`}>
                    <span className="capsule-alert-ping" />
                  </span>
                )}
              </div>
              <span className="capsule-label">
                {item.label}
              </span>
              {isActive && <span className="capsule-active-dot" />}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
