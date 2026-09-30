import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Sparkles, 
  Plus, 
  Menu, 
  Moon, 
  Sun,
  CheckCircle,
  MessageSquare,
  X
} from 'lucide-react';
import type { NavRoute } from './Sidebar';

interface HeaderProps {
  currentRoute: NavRoute;
  onOpenMobileSidebar: () => void;
  onQuickGenerate: () => void;
  onQuickAddCustomer: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRoute,
  onOpenMobileSidebar,
  onQuickGenerate,
  onQuickAddCustomer,
  searchQuery,
  onSearchChange,
  isDarkMode,
  onToggleDarkMode
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, title: 'Reply Received', desc: 'John Doe from ABC Logistics replied to email', time: '10m ago', type: 'reply' },
    { id: 2, title: 'Campaign Completed', desc: 'Q3 Enterprise Hosting batch approved (22 emails)', time: '1h ago', type: 'success' },
    { id: 3, title: 'AI Generation Ready', desc: 'AI generated draft for Sarah Jenkins', time: '2h ago', type: 'ai' }
  ];

  const pageTitles: Record<NavRoute, { title: string; subtitle: string }> = {
    dashboard: { title: 'Dashboard Overview', subtitle: 'Turn customer data into personalized outreach' },
    customers: { title: 'Customer Management', subtitle: 'Manage, segment, and import target contacts' },
    campaigns: { title: 'Outreach Campaigns', subtitle: 'Launch multi-step AI email sequences' },
    emails: { title: 'Email Queue & Review', subtitle: 'Review, edit and approve AI generated emails' },
    replies: { title: 'Replies & Follow-ups', subtitle: 'Monitor incoming customer responses' },
    'follow-ups': { title: 'Automated Follow-ups', subtitle: 'Manage scheduled sequence touchpoints' },
    analytics: { title: 'Outreach Analytics', subtitle: 'Track deliverability, open rates, and replies' },
    settings: { title: 'System Settings', subtitle: 'Configure AI models, tone presets, and credentials' }
  };

  const currentInfo = pageTitles[currentRoute] || pageTitles.dashboard;

  return (
    <header style={{
      height: '70px',
      position: 'sticky',
      top: 0,
      zIndex: 30,
      backgroundColor: 'var(--bg-surface-glass)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-subtle)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1.5rem 0 1.5rem'
    }}>
      {/* Left: Mobile Menu & Page Titles */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button 
          className="btn btn-ghost mobile-menu-btn"
          onClick={onOpenMobileSidebar}
          style={{ padding: '0.375rem', display: 'none' }}
        >
          <Menu size={22} />
        </button>

        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
            {currentInfo.title}
          </h1>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {currentInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Search, Actions & Profile Notifications */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ position: 'relative', width: '240px' }} className="header-search-bar">
          <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
          <input 
            type="text" 
            placeholder="Search customers, emails..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="input-field"
            style={{
              paddingLeft: '2.25rem',
              height: '38px',
              fontSize: '0.8125rem'
            }}
          />
          {searchQuery && (
            <button 
              onClick={() => onSearchChange('')}
              style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer' }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        <button 
          onClick={onQuickGenerate}
          className="btn btn-ai"
          style={{ height: '38px', padding: '0 0.875rem', fontSize: '0.8125rem' }}
        >
          <Sparkles size={16} />
          <span>Generate Email</span>
        </button>

        <button 
          onClick={onQuickAddCustomer}
          className="btn btn-secondary"
          style={{ height: '38px', padding: '0 0.875rem', fontSize: '0.8125rem' }}
        >
          <Plus size={16} />
          <span>Add Customer</span>
        </button>

        <button 
          onClick={onToggleDarkMode}
          className="btn btn-ghost"
          style={{ width: '38px', height: '38px', padding: 0, borderRadius: '50%' }}
          title="Toggle Theme"
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="btn btn-ghost"
            style={{ width: '38px', height: '38px', padding: 0, borderRadius: '50%', position: 'relative' }}
          >
            <Bell size={18} />
            <span style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-rose)',
              boxShadow: '0 0 6px var(--accent-rose)'
            }} />
          </button>

          {showNotifications && (
            <div className="animate-slide-up glass-panel" style={{
              position: 'absolute',
              right: 0,
              top: '48px',
              width: '320px',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)',
              padding: '1rem',
              zIndex: 100
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-main)' }}>Notifications</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 600 }}>Mark all read</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {notifications.map(n => (
                  <div key={n.id} style={{ display: 'flex', gap: '0.625rem', padding: '0.5rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-hover)' }}>
                    {n.type === 'reply' ? <MessageSquare size={16} color="var(--accent-emerald)" /> : <CheckCircle size={16} color="var(--primary)" />}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-main)' }}>{n.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{n.desc}</div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-light)', marginTop: '2px' }}>{n.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
