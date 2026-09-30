import React from 'react';
import type { AnalyticsSummary } from '../../types';
import { BarChart3, PieChart } from 'lucide-react';

interface AnalyticsChartsProps {
  data: AnalyticsSummary;
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ data }) => {
  const maxSent = Math.max(...data.sentTrend.map(t => t.sent), 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Conversion Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Email Open Rate</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.25rem' }}>
            {data.openRate}%
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--accent-emerald)', marginTop: '4px', fontWeight: 600 }}>
            ↑ 4.2% higher than industry avg
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Reply Rate</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-emerald)', marginTop: '0.25rem' }}>
            {data.replyRate}%
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--accent-emerald)', marginTop: '4px', fontWeight: 600 }}>
            ↑ 12.8% response rate lift with AI
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Conversion Rate</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-purple)', marginTop: '0.25rem' }}>
            {data.conversionRate}%
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-light)', marginTop: '4px' }}>
            Meetings booked from replies
          </div>
        </div>
      </div>

      {/* Main Bar Chart: Emails Sent vs Opened vs Replied over Time */}
      <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <BarChart3 size={18} color="var(--primary)" />
              Daily Email Performance Trend
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Outreach volume, open rates, and customer reply conversions
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.75rem' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'var(--primary)' }} /> Sent
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'var(--accent-sky)' }} /> Opened
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'var(--accent-emerald)' }} /> Replied
            </span>
          </div>
        </div>

        {/* Visual Bar Graph */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '200px', padding: '1rem 0 0 0', borderBottom: '1px solid var(--border-subtle)', gap: '0.5rem' }}>
          {data.sentTrend.map((pt, idx) => {
            const sentH = (pt.sent / maxSent) * 160;
            const openedH = (pt.opened / maxSent) * 160;
            const repliedH = (pt.replied / maxSent) * 160;

            return (
              <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px' }}>
                  <div 
                    title={`Sent: ${pt.sent}`}
                    style={{
                      width: '14px',
                      height: `${sentH}px`,
                      background: 'var(--primary)',
                      borderRadius: '4px 4px 0 0',
                      transition: 'height 0.4s ease'
                    }} 
                  />
                  <div 
                    title={`Opened: ${pt.opened}`}
                    style={{
                      width: '14px',
                      height: `${openedH}px`,
                      background: 'var(--accent-sky)',
                      borderRadius: '4px 4px 0 0',
                      transition: 'height 0.4s ease'
                    }} 
                  />
                  <div 
                    title={`Replied: ${pt.replied}`}
                    style={{
                      width: '14px',
                      height: `${repliedH}px`,
                      background: 'var(--accent-emerald)',
                      borderRadius: '4px 4px 0 0',
                      transition: 'height 0.4s ease'
                    }} 
                  />
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>{pt.date}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pain Point Distribution Breakdown */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <PieChart size={18} color="var(--accent-purple)" />
          Top Targeted Customer Pain Points
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {data.problemBreakdown.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{item.problem}</span>
                <span style={{ color: 'var(--text-muted)' }}>{item.count} Accounts</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'var(--bg-surface-hover)', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{
                  width: `${(item.count / 20) * 100}%`,
                  height: '100%',
                  background: 'var(--ai-gradient)',
                  borderRadius: '9999px'
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
