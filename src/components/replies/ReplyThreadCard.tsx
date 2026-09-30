import React, { useState } from 'react';
import type { ReplyThread } from '../../types';
import { aiService } from '../../services/aiService';
import { 
  Clock, 
  CheckCircle, 
  Sparkles, 
  Send, 
  User, 
  CornerDownRight, 
  Bot
} from 'lucide-react';

interface ReplyThreadCardProps {
  thread: ReplyThread;
  onSendResponse?: (threadId: string, text: string) => void;
}

export const ReplyThreadCard: React.FC<ReplyThreadCardProps> = ({
  thread,
  onSendResponse
}) => {
  const [showAIReply, setShowAIReply] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [isSent, setIsSent] = useState(false);

  const isReplyReceived = thread.status.includes('Reply Received');

  const handleGenerateAIReply = async () => {
    setIsGenerating(true);
    try {
      const generated = await aiService.generateCounterReply(thread.customerName);
      setResponseText(generated);
      setShowAIReply(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSend = () => {
    if (!responseText.trim()) return;
    if (onSendResponse) onSendResponse(thread.id, responseText);
    setIsSent(true);
  };

  return (
    <div className="card animate-fade-in" style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      padding: '1.25rem',
      borderLeft: `4px solid ${isReplyReceived ? 'var(--accent-emerald)' : 'var(--accent-amber)'}`
    }}>
      {/* Thread Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: isReplyReceived ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
            color: isReplyReceived ? 'var(--accent-emerald)' : 'var(--accent-amber)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700
          }}>
            {thread.customerName.charAt(0)}
          </div>

          <div>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {thread.customerName} <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>({thread.company})</span>
            </h4>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {thread.customerEmail} {thread.campaignName && `• ${thread.campaignName}`}
            </div>
          </div>
        </div>

        <span className={`badge ${isReplyReceived ? 'badge-replied' : 'badge-pending'}`} style={{ fontSize: '0.75rem' }}>
          {isReplyReceived ? (
            <>
              <CheckCircle size={14} /> Reply Received — Follow-up Stopped
            </>
          ) : (
            <>
              <Clock size={14} /> No Reply — Follow-up Pending ({thread.followUpScheduledAt || 'Tomorrow'})
            </>
          )}
        </span>
      </div>

      {/* Conversation History */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        background: 'var(--bg-surface-hover)',
        padding: '1rem',
        borderRadius: 'var(--radius-md)'
      }}>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <div style={{ color: 'var(--primary)', marginTop: '2px' }}>
            <User size={16} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>
              You sent on {thread.sentDate}
            </div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '2px' }}>
              Subject: {thread.sentEmailSubject}
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '4px', whiteSpace: 'pre-line' }}>
              {thread.sentEmailBody}
            </p>
          </div>
        </div>

        {isReplyReceived && thread.replyBody && (
          <div style={{
            display: 'flex',
            gap: '0.75rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--border-subtle)'
          }}>
            <div style={{ color: 'var(--accent-emerald)', marginTop: '2px' }}>
              <CornerDownRight size={18} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-emerald)', display: 'flex', justifyContent: 'space-between' }}>
                <span>Incoming Reply from {thread.customerName}</span>
                <span>{thread.receivedAt}</span>
              </div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
                {thread.replySubject}
              </div>
              <div style={{
                background: 'var(--bg-surface)',
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                marginTop: '6px',
                fontSize: '0.875rem',
                color: 'var(--text-main)',
                lineHeight: 1.5,
                borderLeft: '3px solid var(--accent-emerald)'
              }}>
                {thread.replyBody}
              </div>
            </div>
          </div>
        )}
      </div>

      {isReplyReceived && !isSent && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {!showAIReply ? (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button 
                onClick={handleGenerateAIReply}
                disabled={isGenerating}
                className="btn btn-ai"
                style={{ fontSize: '0.8125rem' }}
              >
                <Sparkles size={16} className={isGenerating ? 'animate-spin' : ''} />
                <span>{isGenerating ? 'Generating AI Response...' : 'Suggest AI Response'}</span>
              </button>
            </div>
          ) : (
            <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', background: 'rgba(99,102,241,0.05)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(139,92,246,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Bot size={14} /> AI Suggested Response
                </span>
                <button onClick={handleGenerateAIReply} className="btn btn-ghost" style={{ fontSize: '0.7rem' }}>
                  Regenerate
                </button>
              </div>

              <textarea 
                className="input-field" 
                value={responseText}
                onChange={e => setResponseText(e.target.value)}
                rows={4}
                style={{ fontSize: '0.8125rem' }}
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button onClick={() => setShowAIReply(false)} className="btn btn-secondary" style={{ fontSize: '0.8125rem' }}>
                  Dismiss
                </button>
                <button onClick={handleSend} className="btn btn-primary" style={{ fontSize: '0.8125rem' }}>
                  <Send size={14} /> Send Reply
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {isSent && (
        <div style={{ padding: '0.5rem 0.75rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-emerald)', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', fontWeight: 700 }}>
          ✓ Reply dispatched to customer successfully.
        </div>
      )}
    </div>
  );
};
