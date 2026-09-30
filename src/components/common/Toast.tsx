import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '1.5rem',
      right: '1.5rem',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.625rem',
      maxWidth: '380px',
      width: '100%'
    }}>
      {toasts.map(toast => {
        const icon = {
          success: <CheckCircle2 size={20} color="var(--accent-emerald)" />,
          error: <AlertCircle size={20} color="var(--accent-rose)" />,
          info: <Info size={20} color="var(--primary)" />
        }[toast.type];

        return (
          <div 
            key={toast.id}
            className="animate-slide-up card"
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              padding: '0.875rem 1rem',
              background: 'var(--bg-surface)',
              borderLeft: `4px solid ${
                toast.type === 'success' ? 'var(--accent-emerald)' :
                toast.type === 'error' ? 'var(--accent-rose)' : 'var(--primary)'
              }`,
              boxShadow: 'var(--shadow-lg)'
            }}
          >
            <div style={{ marginTop: '2px' }}>{icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>
                {toast.title}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {toast.message}
              </div>
            </div>
            <button 
              onClick={() => onDismiss(toast.id)}
              style={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer' }}
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
