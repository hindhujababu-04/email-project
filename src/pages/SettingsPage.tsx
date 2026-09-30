import React, { useState } from 'react';
import type { UserSettings, EmailTone } from '../types';
import { Save, Bot, CheckCircle, Database, Mail, RefreshCw } from 'lucide-react';
import { getSupabaseClient } from '../services/supabaseClient';
import { nodemailerService } from '../services/nodemailerService';
import confetti from 'canvas-confetti';

interface SettingsPageProps {
  settings: UserSettings;
  onSaveSettings: (settings: UserSettings) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ settings, onSaveSettings }) => {
  const [formData, setFormData] = useState<UserSettings>(settings);
  const [saved, setSaved] = useState<boolean>(false);

  // Testing states
  const [testingSupabase, setTestingSupabase] = useState<boolean>(false);
  const [supabaseResult, setSupabaseResult] = useState<{ success: boolean; message: string } | null>(null);

  const [testingSMTP, setTestingSMTP] = useState<boolean>(false);
  const [smtpResult, setSmtpResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleTestSupabase = async () => {
    setTestingSupabase(true);
    setSupabaseResult(null);
    try {
      const client = getSupabaseClient(formData.supabaseUrl, formData.supabaseAnonKey);
      if (!client) {
        setSupabaseResult({ success: false, message: 'Supabase URL and Anon Key are required.' });
        return;
      }
      const { error } = await client.from('customers').select('count', { count: 'exact', head: true });
      if (error) {
        setSupabaseResult({ success: false, message: `Connection error: ${error.message}` });
      } else {
        setSupabaseResult({ success: true, message: 'Connected to Supabase PostgreSQL database successfully!' });
      }
    } catch (err: any) {
      setSupabaseResult({ success: false, message: err.message || 'Failed to connect to Supabase.' });
    } finally {
      setTestingSupabase(false);
    }
  };

  const handleTestSMTP = async () => {
    setTestingSMTP(true);
    setSmtpResult(null);
    if (!formData.smtpHost || !formData.smtpUser || !formData.smtpPass) {
      setSmtpResult({ success: false, message: 'SMTP Host, User, and Password are required.' });
      setTestingSMTP(false);
      return;
    }
    const res = await nodemailerService.testSMTP({
      host: formData.smtpHost,
      port: formData.smtpPort || 587,
      user: formData.smtpUser,
      pass: formData.smtpPass
    });
    setSmtpResult(res);
    setTestingSMTP(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSaved(true);
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '850px' }} className="animate-fade-in">
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
          Production & System Configuration
        </h2>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          Configure Supabase PostgreSQL database, Nodemailer SMTP email server, and AI models
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* 1. Supabase PostgreSQL Settings */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Database size={18} color="var(--accent-emerald)" />
              Supabase (PostgreSQL Database)
            </h3>
            <span className="badge badge-ai" style={{ fontSize: '0.7rem' }}>Production Database</span>
          </div>

          <div className="input-group">
            <label className="input-label">Supabase Project URL</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="https://xyz.supabase.co"
              value={formData.supabaseUrl || ''}
              onChange={e => setFormData({ ...formData, supabaseUrl: e.target.value })}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Supabase Anon Public Key</label>
            <input 
              type="password" 
              className="input-field" 
              placeholder="eyJhbGciOiJIUzI1NiIsInR..."
              value={formData.supabaseAnonKey || ''}
              onChange={e => setFormData({ ...formData, supabaseAnonKey: e.target.value })}
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              See <code style={{ color: 'var(--primary)' }}>supabase_schema.sql</code> in project root to set up PostgreSQL tables in 1 click.
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem' }}>
            {supabaseResult && (
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: supabaseResult.success ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
                {supabaseResult.success ? '✓ ' : '✗ '}{supabaseResult.message}
              </span>
            )}
            <button 
              type="button" 
              onClick={handleTestSupabase}
              disabled={testingSupabase}
              className="btn btn-secondary" 
              style={{ fontSize: '0.75rem', marginLeft: 'auto' }}
            >
              <RefreshCw size={13} className={testingSupabase ? 'animate-spin' : ''} />
              <span>Test Database Connection</span>
            </button>
          </div>
        </div>

        {/* 2. Nodemailer SMTP Settings */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Mail size={18} color="var(--primary)" />
              Nodemailer (SMTP Real Email Dispatch)
            </h3>
            <span className="badge badge-ai" style={{ fontSize: '0.7rem' }}>SMTP Express Server</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
            <div className="input-group">
              <label className="input-label">SMTP Host</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="smtp.gmail.com or smtp.sendgrid.net"
                value={formData.smtpHost || ''}
                onChange={e => setFormData({ ...formData, smtpHost: e.target.value })}
              />
            </div>
            <div className="input-group">
              <label className="input-label">SMTP Port</label>
              <input 
                type="number" 
                className="input-field" 
                placeholder="587"
                value={formData.smtpPort || 587}
                onChange={e => setFormData({ ...formData, smtpPort: parseInt(e.target.value) || 587 })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group">
              <label className="input-label">SMTP User / Email</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="your.email@gmail.com"
                value={formData.smtpUser || ''}
                onChange={e => setFormData({ ...formData, smtpUser: e.target.value })}
              />
            </div>
            <div className="input-group">
              <label className="input-label">SMTP Password / App Password</label>
              <input 
                type="password" 
                className="input-field" 
                placeholder="••••••••••••"
                value={formData.smtpPass || ''}
                onChange={e => setFormData({ ...formData, smtpPass: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem' }}>
            {smtpResult && (
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: smtpResult.success ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
                {smtpResult.success ? '✓ ' : '✗ '}{smtpResult.message}
              </span>
            )}
            <button 
              type="button" 
              onClick={handleTestSMTP}
              disabled={testingSMTP}
              className="btn btn-secondary" 
              style={{ fontSize: '0.75rem', marginLeft: 'auto' }}
            >
              <RefreshCw size={13} className={testingSMTP ? 'animate-spin' : ''} />
              <span>Test SMTP Server</span>
            </button>
          </div>
        </div>

        {/* 3. Sender Profile & AI Engine */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Bot size={18} color="var(--accent-purple)" />
            AI Provider & Sender Profile
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group">
              <label className="input-label">AI Generation Engine</label>
              <select 
                className="input-field"
                value={formData.aiModel}
                onChange={e => setFormData({ ...formData, aiModel: e.target.value })}
              >
                <option value="SmartTarget AI Engine (GPT-4o / Claude 3.5 Sonnet)">SmartTarget AI Engine (GPT-4o / Claude 3.5 Sonnet)</option>
                <option value="OpenAI GPT-4o">OpenAI GPT-4o Direct</option>
                <option value="Anthropic Claude 3.5 Sonnet">Anthropic Claude 3.5 Sonnet</option>
                <option value="Local Mock AI Engine (Offline Mode)">Local Mock AI Engine (Offline Mode)</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Default Email Tone</label>
              <select 
                className="input-field"
                value={formData.defaultTone}
                onChange={e => setFormData({ ...formData, defaultTone: e.target.value as EmailTone })}
              >
                <option value="Professional">Professional</option>
                <option value="Friendly">Friendly</option>
                <option value="Persuasive">Persuasive</option>
                <option value="Direct">Direct</option>
                <option value="Consultative">Consultative</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group">
              <label className="input-label">Sender Name</label>
              <input 
                type="text" 
                className="input-field" 
                value={formData.senderName}
                onChange={e => setFormData({ ...formData, senderName: e.target.value })}
              />
            </div>
            <div className="input-group">
              <label className="input-label">Sender Email</label>
              <input 
                type="email" 
                className="input-field" 
                value={formData.senderEmail}
                onChange={e => setFormData({ ...formData, senderEmail: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {saved ? (
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle size={18} /> Settings saved successfully!
            </span>
          ) : <div />}

          <button type="submit" className="btn btn-primary">
            <Save size={16} />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
