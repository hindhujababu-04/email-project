import React from 'react';
import type { ReplyThread } from '../types';
import { Clock, Calendar, CheckCircle2, PauseCircle } from 'lucide-react';

interface FollowUpsPageProps {
  replies: ReplyThread[];
}

export const FollowUpsPage: React.FC<FollowUpsPageProps> = ({ replies }) => {
  const pendingFollowups = replies.filter(r => r.status.includes('Follow-up Pending'));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fade-in">
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
          Automated Follow-up Sequences ({pendingFollowups.length})
        </h2>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          Manage automated touchpoints for prospects who haven't replied yet
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {pendingFollowups.length === 0 ? (
          <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <CheckCircle2 size={36} color="var(--accent-emerald)" style={{ margin: '0 auto 0.5rem auto' }} />
            <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>All follow-up queues are clear!</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '4px' }}>All contacted customers have either replied or been resolved.</div>
          </div>
        ) : (
          pendingFollowups.map(item => (
            <div key={item.id} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  padding: '0.625rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(245, 158, 11, 0.1)',
                  color: 'var(--accent-amber)'
                }}>
                  <Clock size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {item.customerName} ({item.company})
                  </h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Original outreach: "{item.sentEmailSubject}"
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Scheduled Dispatch</span>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={14} /> {item.followUpScheduledAt || 'Oct 2, 10:00 AM'}
                  </span>
                </div>

                <button className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.375rem 0.625rem' }}>
                  <PauseCircle size={14} /> Pause Sequence
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
