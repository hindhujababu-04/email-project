import React, { useState } from 'react';
import type { EmailDraft, Customer } from '../types';
import { 
  Sparkles, 
  CheckCircle, 
  Send, 
  RefreshCw, 
  Mail
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface EmailsPageProps {
  emails: EmailDraft[];
  customers: Customer[];
  onApproveEmail: (id: string) => void;
  onSendEmail: (id: string) => void;
  onOpenGeneratorForCustomer: (customer: Customer) => void;
}

export const EmailsPage: React.FC<EmailsPageProps> = ({
  emails,
  customers,
  onApproveEmail,
  onSendEmail,
  onOpenGeneratorForCustomer
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const filteredEmails = emails.filter(e => {
    if (filterStatus === 'All') return true;
    return e.status === filterStatus;
  });

  const handleApprove = (id: string) => {
    onApproveEmail(id);
    confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
  };

  const handleSend = (id: string) => {
    onSendEmail(id);
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
  };

  const statusBadges: Record<string, string> = {
    Draft: 'badge-new',
    Approved: 'badge-generated',
    Sent: 'badge-sent',
    Rejected: 'badge-pending'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fade-in">
      {/* Top Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Email Review Queue ({emails.length})
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            Review, edit, approve and dispatch AI generated customer emails
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['All', 'Draft', 'Approved', 'Sent'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`btn ${filterStatus === st ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.75rem', padding: '0.375rem 0.75rem' }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Email Review Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredEmails.length === 0 ? (
          <div className="card" style={{ padding: '3rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Mail size={36} color="var(--border-medium)" style={{ margin: '0 auto 0.5rem auto' }} />
            <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>No emails found in queue</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '4px' }}>Select a customer to generate personalized email outreach</div>
          </div>
        ) : (
          filteredEmails.map(email => {
            const customer = customers.find(c => c.id === email.customerId);
            return (
              <div key={email.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'var(--primary-light)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.875rem'
                    }}>
                      {email.customerName.charAt(0)}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-main)' }}>
                        {email.customerName} <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>({email.company})</span>
                      </h4>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {email.customerEmail} • Tone: <strong>{email.tone}</strong>
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="badge badge-ai" style={{ fontSize: '0.7rem' }}>
                      <Sparkles size={12} /> AI Generated
                    </span>
                    <span className={`badge ${statusBadges[email.status] || 'badge-new'}`}>
                      {email.status}
                    </span>
                  </div>
                </div>

                <div style={{ background: 'var(--bg-surface-hover)', padding: '1rem', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-main)' }}>
                    Subject: {email.subject}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-main)', whiteSpace: 'pre-line', lineHeight: 1.5 }}>
                    {email.body}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-light)' }}>
                    Generated: {email.generatedAt}
                  </span>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {customer && (
                      <button 
                        onClick={() => onOpenGeneratorForCustomer(customer)}
                        className="btn btn-secondary"
                        style={{ fontSize: '0.75rem', padding: '0.375rem 0.625rem' }}
                      >
                        <RefreshCw size={13} />
                        <span>Regenerate</span>
                      </button>
                    )}

                    {email.status === 'Draft' && (
                      <button 
                        onClick={() => handleApprove(email.id)}
                        className="btn btn-secondary"
                        style={{ fontSize: '0.75rem', padding: '0.375rem 0.625rem' }}
                      >
                        <CheckCircle size={13} color="var(--accent-emerald)" />
                        <span>Approve</span>
                      </button>
                    )}

                    {email.status !== 'Sent' && (
                      <button 
                        onClick={() => handleSend(email.id)}
                        className="btn btn-primary"
                        style={{ fontSize: '0.75rem', padding: '0.375rem 0.625rem' }}
                      >
                        <Send size={13} />
                        <span>Send Email</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
