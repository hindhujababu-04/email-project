import React, { useState, useEffect } from 'react';
import type { Customer, EmailDraft, EmailTone } from '../../types';
import { Modal } from '../common/Modal';
import { aiService } from '../../services/aiService';
import { 
  Sparkles, 
  Send, 
  CheckCircle, 
  RefreshCw, 
  Edit3, 
  Copy, 
  Sliders,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AIEmailGeneratorModalProps {
  isOpen: boolean;
  customer: Customer | null;
  onClose: () => void;
  onSaveEmail: (email: EmailDraft) => void;
  onApproveAndSend?: (email: EmailDraft) => void;
}

export const AIEmailGeneratorModal: React.FC<AIEmailGeneratorModalProps> = ({
  isOpen,
  customer,
  onClose,
  onSaveEmail,
  onApproveAndSend
}) => {
  const [tone, setTone] = useState<EmailTone>('Professional');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [draft, setDraft] = useState<EmailDraft | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedSubject, setEditedSubject] = useState<string>('');
  const [editedBody, setEditedBody] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const tones: EmailTone[] = ['Professional', 'Friendly', 'Persuasive', 'Direct', 'Consultative'];

  const handleGenerate = async () => {
    if (!customer) return;
    setIsGenerating(true);
    try {
      const result = await aiService.generateEmail({
        customer,
        tone,
        customPrompt
      });
      setDraft(result);
      setEditedSubject(result.subject);
      setEditedBody(result.body);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (isOpen && customer) {
      handleGenerate();
    } else {
      setDraft(null);
      setIsEditing(false);
    }
  }, [isOpen, customer]);

  if (!customer) return null;

  const handleApprove = () => {
    if (!draft) return;
    const finalDraft: EmailDraft = {
      ...draft,
      subject: editedSubject,
      body: editedBody,
      tone,
      status: 'Approved',
      approvedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    onSaveEmail(finalDraft);

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 }
    });

    onClose();
  };

  const handleSendNow = () => {
    if (!draft) return;
    const finalDraft: EmailDraft = {
      ...draft,
      subject: editedSubject,
      body: editedBody,
      tone,
      status: 'Sent',
      sentAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    if (onApproveAndSend) {
      onApproveAndSend(finalDraft);
    } else {
      onSaveEmail(finalDraft);
    }

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    onClose();
  };

  const handleCopyText = () => {
    if (!editedSubject || !editedBody) return;
    navigator.clipboard.writeText(`Subject: ${editedSubject}\n\n${editedBody}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="AI Personalized Email Generator"
      subtitle="Craft human-quality personalized email outreach powered by AI"
      maxWidth="950px"
    >
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.5rem', minHeight: '500px' }}>
        {/* Left Side: Customer Context & AI Parameters */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          paddingRight: '1.25rem',
          borderRight: '1px solid var(--border-subtle)'
        }}>
          {/* Customer Profile Card */}
          <div style={{
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-surface-hover)',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.75rem' }}>
              <img 
                src={customer.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'} 
                alt={customer.name}
                style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div>
                <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-main)' }}>{customer.name}</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{customer.company}</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.75rem' }}>
              <div style={{ color: 'var(--text-muted)' }}>
                <strong style={{ color: 'var(--text-main)' }}>Email:</strong> {customer.email}
              </div>
              <div style={{ color: 'var(--accent-amber)', background: 'rgba(245, 158, 11, 0.1)', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}>
                <strong>Pain Point:</strong> {customer.problem}
              </div>
              <div style={{ color: 'var(--primary)', background: 'var(--primary-light)', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}>
                <strong>Solution Fit:</strong> {customer.service}
              </div>
            </div>
          </div>

          {/* AI Tone Selection */}
          <div>
            <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '0.5rem' }}>
              <Sliders size={14} color="var(--primary)" />
              AI Voice & Tone
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
              {tones.map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTone(t)}
                  style={{
                    padding: '0.375rem 0.625rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.75rem',
                    fontWeight: tone === t ? 700 : 500,
                    border: tone === t ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                    background: tone === t ? 'var(--primary-light)' : 'var(--bg-surface)',
                    color: tone === t ? 'var(--primary)' : 'var(--text-muted)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Instruction Prompt */}
          <div className="input-group">
            <label className="input-label">Custom AI Instruction (Optional)</label>
            <textarea 
              className="input-field"
              placeholder="e.g. Mention 20% Q3 discount or keep under 100 words..."
              value={customPrompt}
              onChange={e => setCustomPrompt(e.target.value)}
              rows={3}
              style={{ fontSize: '0.8125rem' }}
            />
          </div>

          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="btn btn-ai"
            style={{ width: '100%' }}
          >
            <RefreshCw size={16} className={isGenerating ? 'animate-spin' : ''} />
            <span>{isGenerating ? 'AI Generating...' : 'Regenerate Email'}</span>
          </button>
        </div>

        {/* Right Side: AI Generated Email Preview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Header Banner */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="badge badge-ai" style={{ fontSize: '0.8125rem' }}>
                <Sparkles size={14} /> AI Personalized Draft
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                Powered by SmartTarget Engine
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.375rem' }}>
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="btn btn-secondary"
                style={{ height: '32px', padding: '0 0.625rem', fontSize: '0.75rem' }}
              >
                <Edit3 size={14} />
                <span>{isEditing ? 'View Mode' : 'Edit Email'}</span>
              </button>
              <button 
                onClick={handleCopyText}
                className="btn btn-ghost"
                style={{ height: '32px', padding: '0 0.625rem', fontSize: '0.75rem' }}
              >
                <Copy size={14} />
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Generated Email Container */}
          <div className={`card ${isGenerating ? 'skeleton-shimmer' : 'ai-border-glow'}`} style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            padding: '1.25rem',
            background: 'var(--bg-surface)'
          }}>
            {isGenerating ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '2rem', textAlign: 'center' }}>
                <Sparkles size={32} color="var(--primary)" className="animate-spin" style={{ margin: '0 auto' }} />
                <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Crafting personalized outreach for {customer.company}...
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Analyzing pain points & solution fit: "{customer.problem}"
                </div>
              </div>
            ) : (
              <>
                {/* Subject Line Header */}
                <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                  <label style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Subject Line
                  </label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      className="input-field" 
                      value={editedSubject}
                      onChange={e => setEditedSubject(e.target.value)}
                      style={{ fontWeight: 700, fontSize: '0.9375rem', marginTop: '4px' }}
                    />
                  ) : (
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
                      {editedSubject}
                    </h3>
                  )}
                </div>

                {/* Email Body */}
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>
                    Email Content Preview
                  </label>
                  {isEditing ? (
                    <textarea 
                      className="input-field" 
                      value={editedBody}
                      onChange={e => setEditedBody(e.target.value)}
                      rows={12}
                      style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', lineHeight: 1.6 }}
                    />
                  ) : (
                    <div style={{
                      whiteSpace: 'pre-line',
                      fontSize: '0.875rem',
                      lineHeight: 1.6,
                      color: 'var(--text-main)',
                      padding: '0.75rem',
                      background: 'var(--bg-surface-hover)',
                      borderRadius: 'var(--radius-md)'
                    }}>
                      {editedBody}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Bottom Human Review Action Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <AlertCircle size={14} color="var(--primary)" />
              Human approval required prior to sending
            </span>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button 
                type="button" 
                onClick={handleApprove}
                className="btn btn-secondary"
                disabled={isGenerating || !draft}
              >
                <CheckCircle size={16} color="var(--accent-emerald)" />
                <span>Approve & Save Draft</span>
              </button>

              <button 
                type="button" 
                onClick={handleSendNow}
                className="btn btn-primary"
                disabled={isGenerating || !draft}
              >
                <Send size={16} />
                <span>Approve & Send Email</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
