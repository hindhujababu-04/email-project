import React from 'react';
import type { ReplyThread } from '../types';
import { ReplyThreadCard } from '../components/replies/ReplyThreadCard';

interface RepliesPageProps {
  replies: ReplyThread[];
  onSendResponse?: (threadId: string, text: string) => void;
}

export const RepliesPage: React.FC<RepliesPageProps> = ({ replies, onSendResponse }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fade-in">
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
          Replies & Inbox ({replies.length})
        </h2>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          Monitor incoming customer replies and manage automated follow-up status
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {replies.map(thread => (
          <ReplyThreadCard 
            key={thread.id} 
            thread={thread} 
            onSendResponse={onSendResponse}
          />
        ))}
      </div>
    </div>
  );
};
