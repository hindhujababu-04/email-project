import React from 'react';
import type { Customer, EmailDraft, Campaign, ReplyThread, AnalyticsSummary } from '../types';
import { StatCard } from '../components/common/StatCard';
import { 
  Users, 
  Send, 
  MessageSquare, 
  Clock, 
  Sparkles, 
  UserPlus, 
  Upload, 
  ArrowRight, 
  CheckCircle
} from 'lucide-react';
import type { NavRoute } from '../components/common/Sidebar';

interface DashboardPageProps {
  customers: Customer[];
  emails: EmailDraft[];
  campaigns: Campaign[];
  replies: ReplyThread[];
  analytics: AnalyticsSummary;
  onNavigate: (route: NavRoute) => void;
  onOpenGenerator: (customer?: Customer) => void;
  onOpenAddCustomer: () => void;
  onOpenCSVImport: () => void;
  onOpenCampaignWizard: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  emails,
  campaigns,
  replies,
  analytics,
  onNavigate,
  onOpenGenerator,
  onOpenAddCustomer,
  onOpenCSVImport,
  onOpenCampaignWizard
}) => {
  const pendingEmailsCount = emails.filter(e => e.status === 'Draft').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      {/* Hero Section */}
      <div style={{
        borderRadius: 'var(--radius-xl)',
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 100%)',
        padding: '2.25rem 2rem',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '240px',
          height: '240px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.35) 0%, rgba(79,70,229,0) 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: '650px', position: 'relative', zIndex: 10 }}>
          <span className="badge badge-ai" style={{ marginBottom: '0.75rem', background: 'rgba(255,255,255,0.15)', color: '#a5b4fc', border: '1px solid rgba(255,255,255,0.2)' }}>
            <Sparkles size={14} /> AI Outreach Engine Active
          </span>

          <h2 style={{ fontSize: '1.875rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: '0.625rem' }}>
            Turn customer data into personalized conversations.
          </h2>

          <p style={{ fontSize: '0.9375rem', color: '#c7d2fe', lineHeight: 1.5, marginBottom: '1.5rem' }}>
            Import target contacts, synthesize custom cold email outreach based on real customer pain points, and monitor automated replies & follow-ups in one view.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.875rem' }}>
            <button 
              onClick={onOpenCampaignWizard} 
              className="btn btn-ai"
              style={{ padding: '0.75rem 1.5rem', fontSize: '0.9375rem' }}
            >
              <Sparkles size={18} />
              <span>Generate Campaign</span>
            </button>

            <button 
              onClick={onOpenAddCustomer} 
              className="btn btn-secondary"
              style={{ padding: '0.75rem 1.25rem', fontSize: '0.9375rem', background: 'rgba(255,255,255,0.1)', color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}
            >
              <UserPlus size={18} />
              <span>Add Customer</span>
            </button>

            <button 
              onClick={onOpenCSVImport} 
              className="btn btn-ghost"
              style={{ padding: '0.75rem 1.25rem', fontSize: '0.9375rem', color: '#e0e7ff' }}
            >
              <Upload size={18} />
              <span>Upload CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <StatCard
          title="Total Customers"
          value={analytics.totalCustomers}
          change="+14% this month"
          isPositive={true}
          icon={Users}
          color="indigo"
          subtitle="Target accounts imported"
          onClick={() => onNavigate('customers')}
        />
        <StatCard
          title="Emails Sent"
          value={analytics.totalEmailsSent}
          change="+28%"
          isPositive={true}
          icon={Send}
          color="sky"
          subtitle="Delivered outreach"
          onClick={() => onNavigate('emails')}
        />
        <StatCard
          title="Replies Received"
          value={analytics.totalReplies}
          change="+34.2% response rate"
          isPositive={true}
          icon={MessageSquare}
          color="emerald"
          subtitle="Customer responses"
          onClick={() => onNavigate('replies')}
        />
        <StatCard
          title="Follow-ups Pending"
          value={analytics.followUpsPending}
          icon={Clock}
          color="amber"
          subtitle="Scheduled sequences"
          onClick={() => onNavigate('follow-ups')}
        />
      </div>

      {/* Main Grid: Active Campaigns & Recent Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }} className="dashboard-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  Active Outreach Campaigns
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Recent multi-step campaign progress and approval metrics
                </p>
              </div>
              <button onClick={() => onNavigate('campaigns')} className="btn btn-ghost" style={{ fontSize: '0.8125rem' }}>
                View All <ArrowRight size={14} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {campaigns.slice(0, 3).map(camp => {
                const progress = Math.round((camp.emailsApproved / (camp.totalTargeted || 1)) * 100);
                return (
                  <div key={camp.id} style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    background: 'var(--bg-surface)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <div>
                        <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-main)' }}>
                          {camp.name}
                        </h4>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{camp.description}</p>
                      </div>
                      <span className="badge badge-ai" style={{ fontSize: '0.7rem' }}>
                        {camp.status}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.75rem' }}>
                      <div style={{ flex: 1, height: '8px', background: 'var(--bg-surface-hover)', borderRadius: '9999px', overflow: 'hidden' }}>
                        <div style={{
                          width: `${progress}%`,
                          height: '100%',
                          background: 'var(--primary-gradient)',
                          borderRadius: '9999px',
                          transition: 'width 0.5s ease'
                        }} />
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)' }}>
                        {progress}% Approved ({camp.emailsApproved}/{camp.totalTargeted})
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            <div 
              onClick={onOpenCSVImport} 
              className="card" 
              style={{ cursor: 'pointer', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
            >
              <div style={{ padding: '0.625rem', borderRadius: 'var(--radius-md)', background: 'var(--primary-light)', color: 'var(--primary)' }}>
                <Upload size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>Upload CSV</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Import bulk leads</div>
              </div>
            </div>

            <div 
              onClick={() => onOpenGenerator()} 
              className="card" 
              style={{ cursor: 'pointer', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
            >
              <div style={{ padding: '0.625rem', borderRadius: 'var(--radius-md)', background: 'rgba(139, 92, 246, 0.1)', color: 'var(--accent-purple)' }}>
                <Sparkles size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>AI Generator</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Craft email for contact</div>
              </div>
            </div>

            <div 
              onClick={() => onNavigate('emails')} 
              className="card" 
              style={{ cursor: 'pointer', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
            >
              <div style={{ padding: '0.625rem', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-emerald)' }}>
                <CheckCircle size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>Review Queue</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{pendingEmailsCount} pending review</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="card" style={{ flex: 1 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1rem' }}>
              Recent Activity Feed
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {replies.slice(0, 3).map(r => (
                <div key={r.id} style={{ display: 'flex', gap: '0.625rem', fontSize: '0.8125rem' }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'rgba(16, 185, 129, 0.15)',
                    color: 'var(--accent-emerald)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.75rem'
                  }}>
                    R
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                      {r.customerName} replied to outreach
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      "{r.replySubject || 'Re: Partnership'}"
                    </div>
                  </div>
                </div>
              ))}

              {emails.slice(0, 2).map(e => (
                <div key={e.id} style={{ display: 'flex', gap: '0.625rem', fontSize: '0.8125rem' }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'var(--primary-light)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.75rem'
                  }}>
                    AI
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                      AI Generated email draft for {e.customerName}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      Tone: {e.tone}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
