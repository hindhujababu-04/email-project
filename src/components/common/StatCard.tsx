import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  color: 'indigo' | 'purple' | 'emerald' | 'amber' | 'rose' | 'sky';
  subtitle?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  icon: Icon,
  color,
  subtitle,
  onClick
}) => {
  const colorClasses = {
    indigo: { bg: 'rgba(79, 70, 229, 0.1)', text: '#4f46e5' },
    purple: { bg: 'rgba(139, 92, 246, 0.1)', text: '#8b5cf6' },
    emerald: { bg: 'rgba(16, 185, 129, 0.1)', text: '#10b981' },
    amber: { bg: 'rgba(245, 158, 11, 0.1)', text: '#f59e0b' },
    rose: { bg: 'rgba(244, 63, 94, 0.1)', text: '#f43f5e' },
    sky: { bg: 'rgba(2, 132, 199, 0.1)', text: '#0284c7' }
  }[color];

  return (
    <div 
      className={`card ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>
          {title}
        </span>
        <div style={{
          padding: '0.5rem',
          borderRadius: 'var(--radius-md)',
          background: colorClasses.bg,
          color: colorClasses.text,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Icon size={20} />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
        <span style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
          {value}
        </span>
        {change && (
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.125rem',
            color: isPositive ? 'var(--accent-emerald)' : 'var(--accent-rose)',
            background: isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
            padding: '0.125rem 0.375rem',
            borderRadius: '9999px'
          }}>
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {change}
          </span>
        )}
      </div>

      {subtitle && (
        <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
          {subtitle}
        </span>
      )}
    </div>
  );
};
