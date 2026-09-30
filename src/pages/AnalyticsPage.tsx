import React from 'react';
import type { AnalyticsSummary } from '../types';
import { AnalyticsCharts } from '../components/analytics/AnalyticsCharts';

interface AnalyticsPageProps {
  analytics: AnalyticsSummary;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ analytics }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fade-in">
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
          Analytics & Performance Dashboard
        </h2>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          Detailed performance metrics for cold outreach conversion and deliverability
        </p>
      </div>

      <AnalyticsCharts data={analytics} />
    </div>
  );
};
