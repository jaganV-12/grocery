import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 size={18} className="text-emerald-500" />,
    warning: <AlertTriangle size={18} className="text-amber-500" />,
    error: <AlertCircle size={18} className="text-rose-500" />
  };

  const bgStyles = {
    success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
    warning: 'border-amber-200 bg-amber-50 text-amber-900',
    error: 'border-rose-200 bg-rose-50 text-rose-900'
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 18px',
      borderRadius: '10px',
      border: '1px solid',
      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15)',
      fontSize: '14px',
      fontWeight: '500',
      animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
    }} className={bgStyles[toast.type] || bgStyles.success}>
      {icons[toast.type] || icons.success}
      <span>{toast.message}</span>
      {onClose && (
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', opacity: 0.6 }}
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}

