import React from 'react';
import { 
  LayoutDashboard, 
  Mic, 
  Package, 
  Users, 
  Receipt, 
  BarChart3, 
  Settings, 
  Store,
  Sparkles,
  AlertCircle,
  LogOut
} from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';

export default function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen }) {
  const { stats, business, activeLang, logoutUser } = useBusiness();

  const navItems = [
    {
      id: 'dashboard',
      label: activeLang === 'ta' ? 'முகப்பு பலகை' : 'Dashboard',
      icon: LayoutDashboard
    },
    {
      id: 'voice',
      label: activeLang === 'ta' ? 'குரல் உதவியாளர்' : 'Voice Assistant',
      icon: Mic,
      badge: 'AI'
    },
    {
      id: 'inventory',
      label: activeLang === 'ta' ? 'சரக்கு இருப்பு' : 'Inventory',
      icon: Package,
      alertCount: stats?.lowStockCount || 0
    },
    {
      id: 'customers',
      label: activeLang === 'ta' ? 'வாடிக்கையாளர்கள்' : 'Customers',
      icon: Users
    },
    {
      id: 'payments',
      label: activeLang === 'ta' ? 'பரிவர்த்தனைகள்' : 'Payments & Sales',
      icon: Receipt
    },
    {
      id: 'reports',
      label: activeLang === 'ta' ? 'அறிக்கைகள்' : 'Reports',
      icon: BarChart3
    },
    {
      id: 'settings',
      label: activeLang === 'ta' ? 'சுயவிவரம் & அமைப்புகள்' : 'Profile & Settings',
      icon: Settings
    }
  ];

  return (
    <>
      {isOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setIsOpen(false)}
          title="Click to close menu"
        />
      )}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      {/* Brand Header */}
      <div style={{
        padding: '24px 20px',
        borderBottom: '1px solid #f1f5f9',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          backgroundColor: '#059669',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)'
        }}>
          <Mic size={22} />
        </div>
        <div>
          <div style={{ fontWeight: '800', fontSize: '18px', color: '#0f172a', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '6px' }}>
            VoiceBiz <span style={{ color: '#059669' }}>AI</span>
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '500' }}>
            {activeLang === 'ta' ? 'குரல் வணிக மேலாண்மை' : 'Voice Business Manager'}
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={{ padding: '20px 14px', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (window.innerWidth <= 900) setIsOpen(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                padding: '12px 14px',
                borderRadius: '10px',
                background: isActive ? '#ecfdf5' : 'transparent',
                color: isActive ? '#059669' : '#475569',
                border: 'none',
                fontWeight: isActive ? '700' : '500',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = '#f8fafc';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Icon size={19} color={isActive ? '#059669' : '#64748b'} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span style={{
                  backgroundColor: '#059669',
                  color: '#ffffff',
                  fontSize: '10px',
                  fontWeight: '800',
                  padding: '2px 7px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px'
                }}>
                  <Sparkles size={9} />
                  {item.badge}
                </span>
              )}

              {item.alertCount > 0 && (
                <span style={{
                  backgroundColor: '#fef2f2',
                  color: '#ef4444',
                  fontSize: '11px',
                  fontWeight: '700',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  border: '1px solid #fecaca'
                }}>
                  {item.alertCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Shop Info Footer - Clickable to open Profile */}
      <div 
        onClick={() => {
          setActiveTab('settings');
          if (window.innerWidth <= 900) setIsOpen(false);
        }}
        style={{
          padding: '16px',
          margin: '14px',
          backgroundColor: activeTab === 'settings' ? '#ecfdf5' : '#f8fafc',
          borderRadius: '14px',
          border: activeTab === 'settings' ? '1.5px solid #10b981' : '1px solid #e2e8f0',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
        title="Click to view & edit Profile details"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div style={{
            fontSize: '20px',
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            backgroundColor: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid #e2e8f0'
          }}>
            {business?.avatarIcon || '🏪'}
          </div>
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <div style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {business?.name || 'Murugan Store'}
            </div>
            <div style={{ fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>{business?.ownerName || 'S. Murugan'}</span>
              <span>· Edit</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px dashed #cbd5e1', fontSize: '11px' }}>
          <span style={{ color: '#64748b' }}>Storage:</span>
          <span style={{
            color: stats?.isMongoActive ? '#059669' : '#0284c7',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: stats?.isMongoActive ? '#10b981' : '#0284c7' }}></span>
            {stats?.isMongoActive ? 'MongoDB Atlas' : 'Local JSON DB'}
          </span>
        </div>
      </div>

      {/* Logout button at bottom */}
      <div style={{ padding: '0 14px 14px 14px' }}>
        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to log out of VoiceBiz AI?')) {
              logoutUser();
            }
          }}
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '8px',
            border: '1px solid #fee2e2',
            backgroundColor: '#fef2f2',
            color: '#dc2626',
            fontSize: '12px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fecaca'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
        >
          <LogOut size={14} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
    </>
  );
}

