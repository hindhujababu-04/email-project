import React from 'react';
import type { Campaign } from '../types';
import { Sparkles } from 'lucide-react';

interface CampaignsPageProps {
  campaigns: Campaign[];
  onOpenCampaignWizard: () => void;
}

export const CampaignsPage: React.FC<CampaignsPageProps> = ({
  campaigns,
  onOpenCampaignWizard
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fade-in">
      {/* Top Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Outreach Campaigns ({campaigns.length})
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            Manage multi-account outreach campaigns and monitor real-time delivery
          </p>
        </div>

        <button onClick={onOpenCampaignWizard} className="btn btn-ai">
          <Sparkles size={16} />
          <span>New Campaign</span>
        </button>
      </div>

      {/* Campaign Grid Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
        {campaigns.map(camp => {
          const approvalPercent = Math.round((camp.emailsApproved / (camp.totalTargeted || 1)) * 100);
          return (
            <div key={camp.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span className="badge badge-ai" style={{ fontSize: '0.7rem' }}>
                    {camp.status}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                    Created {camp.createdAt}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                  {camp.name}
                </h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  {camp.description}
                </p>
              </div>

              {/* Campaign Metric Stats */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '0.5rem',
                background: 'var(--bg-surface-hover)',
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                textAlign: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Targeted</div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>{camp.totalTargeted}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Approved</div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary)' }}>{camp.emailsApproved}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Sent</div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-sky)' }}>{camp.emailsSent}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Replies</div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>{camp.repliesCount}</div>
                </div>
              </div>

              {/* Progress Indicator */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.375rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Approval Progress</span>
                  <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{approvalPercent}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'var(--bg-surface-hover)', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${approvalPercent}%`,
                    height: '100%',
                    background: 'var(--primary-gradient)',
                    borderRadius: '9999px',
                    transition: 'width 0.5s ease'
                  }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
