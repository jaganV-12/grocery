import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, color = 'emerald', badgeText, onClick }) {
  const colorMap = {
    emerald: {
      bg: '#ecfdf5',
      iconColor: '#059669',
      borderColor: '#d1fae5'
    },
    amber: {
      bg: '#fffbeb',
      iconColor: '#d97706',
      borderColor: '#fde68a'
    },
    blue: {
      bg: '#eff6ff',
      iconColor: '#2563eb',
      borderColor: '#bfdbfe'
    },
    rose: {
      bg: '#fef2f2',
      iconColor: '#dc2626',
      borderColor: '#fecaca'
    },
    indigo: {
      bg: '#eef2ff',
      iconColor: '#4f46e5',
      borderColor: '#c7d2fe'
    }
  };

  const scheme = colorMap[color] || colorMap.emerald;

  return (
    <div 
      className="card"
      onClick={onClick}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div>
          <span style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {title}
          </span>
          <div style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em', marginTop: '4px' }}>
            {value}
          </div>
        </div>

        <div style={{
          width: '46px',
          height: '46px',
          borderRadius: '12px',
          backgroundColor: scheme.bg,
          color: scheme.iconColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: `1px solid ${scheme.borderColor}`
        }}>
          {Icon && <Icon size={22} />}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
        <span style={{ color: '#64748b' }}>{subtitle}</span>
        {badgeText && (
          <span style={{
            fontSize: '11px',
            fontWeight: '700',
            padding: '2px 8px',
            borderRadius: '12px',
            backgroundColor: scheme.bg,
            color: scheme.iconColor,
            border: `1px solid ${scheme.borderColor}`
          }}>
            {badgeText}
          </span>
        )}
      </div>
    </div>
  );
}

