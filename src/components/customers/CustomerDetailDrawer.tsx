import React from 'react';
import type { Customer } from '../../types';
import { X, Sparkles, Mail, AlertCircle, CheckCircle2, Clock, Trash2 } from 'lucide-react';

interface CustomerDetailDrawerProps {
  customer: Customer | null;
  onClose: () => void;
  onGenerateEmail: (customer: Customer) => void;
  onDeleteCustomer: (id: string) => void;
}

export const CustomerDetailDrawer: React.FC<CustomerDetailDrawerProps> = ({
  customer,
  onClose,
  onGenerateEmail,
  onDeleteCustomer
}) => {
  if (!customer) return null;

  const statusBadgeClasses: Record<string, string> = {
    'New': 'badge-new',
    'Email Generated': 'badge-generated',
    'Sent': 'badge-sent',
    'Replied': 'badge-replied',
    'Follow-up Pending': 'badge-pending'
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      backgroundColor: 'rgba(15, 23, 42, 0.4)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      justifyContent: 'flex-end'
    }} onClick={onClose}>
      <div 
        className="animate-slide-up card"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '460px',
          height: '100vh',
          borderRadius: 0,
          borderLeft: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-surface)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img 
              src={customer.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'} 
              alt={customer.name}
              style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {customer.name}
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Mail size={12} /> {customer.email}
              </p>
            </div>
          </div>

          <button onClick={onClose} className="btn btn-ghost" style={{ padding: '0.375rem', borderRadius: '50%' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-surface-hover)', padding: '0.875rem 1rem', borderRadius: 'var(--radius-md)' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Current Status</span>
              <span className={`badge ${statusBadgeClasses[customer.status] || 'badge-new'}`}>
                {customer.status}
              </span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Company</span>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>
                {customer.company}
              </span>
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.5rem' }}>
              <AlertCircle size={16} color="var(--accent-amber)" />
              Customer Pain Point / Problem
            </span>
            <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '0.875rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
              "{customer.problem}"
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.5rem' }}>
              <CheckCircle2 size={16} color="var(--accent-emerald)" />
              Target Service / Solution
            </span>
            <div style={{ background: 'var(--bg-surface-hover)', border: '1px solid var(--border-subtle)', padding: '0.875rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary)' }}>
              {customer.service}
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.75rem' }}>
              <Clock size={16} color="var(--primary)" />
              Outreach Activity
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderLeft: '2px solid var(--border-subtle)', paddingLeft: '1rem', marginLeft: '0.5rem' }}>
              <div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-main)' }}>Contact Added</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{customer.createdAt}</div>
              </div>
              {customer.lastContact !== 'Never' && (
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--primary)' }}>Last Activity</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{customer.lastContact}</div>
                </div>
              )}
            </div>
          </div>

          {customer.notes && (
            <div>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.25rem' }}>
                Notes
              </span>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{customer.notes}</p>
            </div>
          )}
        </div>

        <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', display: 'flex', gap: '0.75rem' }}>
          <button 
            onClick={() => { onGenerateEmail(customer); onClose(); }} 
            className="btn btn-ai"
            style={{ flex: 1 }}
          >
            <Sparkles size={16} />
            <span>Generate AI Email</span>
          </button>
          <button 
            onClick={() => { onDeleteCustomer(customer.id); onClose(); }} 
            className="btn btn-danger"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
