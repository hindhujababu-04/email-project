import type { Customer, EmailDraft, Campaign, ReplyThread, UserSettings } from '../types';

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'John Doe',
    email: 'john@abc.com',
    company: 'ABC Logistics',
    problem: 'Website load time is too slow (>4s)',
    service: 'Enterprise High-Performance Hosting',
    industry: 'Logistics & Tech',
    status: 'Replied',
    lastContact: '2026-09-28 14:30',
    notes: 'Interested in reducing server latency by 50%. Mentioned AWS budget constraints.',
    createdAt: '2026-09-20',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'cust-2',
    name: 'Sarah Jenkins',
    email: 's.jenkins@apexcloud.io',
    company: 'Apex Cloud Solutions',
    problem: 'Low email deliverability & spam placement',
    service: 'AI Cold Email Warmup & Verified Delivery',
    industry: 'Cloud Software',
    status: 'Email Generated',
    lastContact: '2026-09-29 09:15',
    notes: 'Domain health score dropped to 72%. Urgent outreach needed.',
    createdAt: '2026-09-22',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'cust-3',
    name: 'Michael Chang',
    email: 'm.chang@fintechhub.com',
    company: 'FinTech Hub Solutions',
    problem: 'Manual lead qualification takes 15+ hours/week',
    service: 'AI Sales Lead Automation Engine',
    industry: 'Financial Services',
    status: 'Sent',
    lastContact: '2026-09-27 16:45',
    notes: 'Requested case studies on B2B conversion rate uplift.',
    createdAt: '2026-09-18',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'cust-4',
    name: 'Elena Rostova',
    email: 'elena@biotechlabs.org',
    company: 'BioTech Labs International',
    problem: 'High customer churn after free trial onboarding',
    service: 'Behavioral Email Onboarding Automation',
    industry: 'Healthcare / BioTech',
    status: 'Follow-up Pending',
    lastContact: '2026-09-25 11:00',
    notes: 'Opened previous email 3 times. Follow-up scheduled for tomorrow.',
    createdAt: '2026-09-15',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'cust-5',
    name: 'David Vance',
    email: 'd.vance@vancemedia.co',
    company: 'Vance Digital Marketing',
    problem: 'Inability to scale personalized video outreach',
    service: 'Dynamic AI Video & Email Generator',
    industry: 'Marketing Agency',
    status: 'New',
    lastContact: 'Never',
    notes: 'Imported via CSV import batch #402.',
    createdAt: '2026-09-29',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'cust-6',
    name: 'Amanda Thorne',
    email: 'athorne@nexusretail.com',
    company: 'Nexus E-Commerce Group',
    problem: 'Cart abandonment rate exceeds 68%',
    service: 'AI Real-Time Cart Recovery Sequences',
    industry: 'E-Commerce',
    status: 'Replied',
    lastContact: '2026-09-29 18:20',
    notes: 'Wants a live demo next Tuesday at 2 PM EST.',
    createdAt: '2026-09-19',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80'
  }
];

export const INITIAL_EMAILS: EmailDraft[] = [
  {
    id: 'email-1',
    customerId: 'cust-1',
    customerName: 'John Doe',
    customerEmail: 'john@abc.com',
    company: 'ABC Logistics',
    subject: 'Accelerate ABC Logistics’s website performance by 3.2x',
    body: `Hi John,\n\nI noticed ABC Logistics's website could benefit from faster hosting. A slow load speed (>4 seconds) often leads to a drop in inbound lead conversions and higher bounce rates.\n\nOur Enterprise High-Performance Hosting infrastructure has helped logistics platforms cut page load times down to 0.8s while lowering cloud server costs.\n\nI’d love to show you how improved hosting performance could help your visitors have a smoother experience and boost conversions.\n\nWould you be open to a 10-minute quick chat this Thursday?\n\nBest regards,\nAlex Mercer\nHead of Outreach, SmartTarget AI`,
    tone: 'Professional',
    status: 'Sent',
    generatedAt: '2026-09-20 10:15',
    aiModelUsed: 'SmartTarget AI Engine v4.2',
    approvedAt: '2026-09-20 10:30',
    sentAt: '2026-09-20 11:00'
  },
  {
    id: 'email-2',
    customerId: 'cust-2',
    customerName: 'Sarah Jenkins',
    customerEmail: 's.jenkins@apexcloud.io',
    company: 'Apex Cloud Solutions',
    subject: 'Fix Apex Cloud’s spam deliverability issues automatically',
    body: `Hi Sarah,\n\nWe recently analyzed outreach metrics across cloud software teams and noticed many struggle with deliverability drops into spam folders.\n\nWith our AI Cold Email Warmup & Verified Delivery system, Apex Cloud Solutions can restore domain health above 98% within 7 days, guaranteeing inbox placement.\n\nWould you like a complimentary domain health audit report?\n\nBest,\nAlex Mercer`,
    tone: 'Persuasive',
    status: 'Approved',
    generatedAt: '2026-09-29 09:15',
    aiModelUsed: 'SmartTarget AI Engine v4.2',
    approvedAt: '2026-09-29 09:45'
  },
  {
    id: 'email-3',
    customerId: 'cust-5',
    customerName: 'David Vance',
    customerEmail: 'd.vance@vancemedia.co',
    company: 'Vance Digital Marketing',
    subject: 'Scale personalized marketing outreach without extra headcount',
    body: `Hey David,\n\nRunning a digital agency means your team is spending countless hours manually customizing pitch decks and emails for clients.\n\nOur Dynamic AI Video & Email Generator lets Vance Digital Marketing create 100% personalized campaign sequences tailored to each prospect's exact pain points in seconds.\n\nLet me know if you'd like to check out a brief 2-minute walkthrough.\n\nCheers,\nAlex Mercer`,
    tone: 'Friendly',
    status: 'Draft',
    generatedAt: '2026-09-29 13:00',
    aiModelUsed: 'SmartTarget AI Engine v4.2'
  }
];

export const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 'camp-1',
    name: 'Q3 Enterprise Hosting Outreach',
    description: 'Targeting SaaS & Logistics tech companies suffering slow website speed & latency.',
    targetIndustry: 'Logistics & Tech',
    problemCategory: 'Website Speed',
    totalTargeted: 24,
    emailsGenerated: 24,
    emailsApproved: 22,
    emailsSent: 20,
    repliesCount: 7,
    status: 'Active',
    createdAt: '2026-09-18',
    targetCustomerIds: ['cust-1', 'cust-3']
  },
  {
    id: 'camp-2',
    name: 'E-Commerce Cart Recovery Sprint',
    description: 'Re-engaging high-volume online retailers to lower cart dropouts with AI sequences.',
    targetIndustry: 'E-Commerce',
    problemCategory: 'Cart Abandonment',
    totalTargeted: 18,
    emailsGenerated: 18,
    emailsApproved: 18,
    emailsSent: 18,
    repliesCount: 6,
    status: 'Active',
    createdAt: '2026-09-21',
    targetCustomerIds: ['cust-6']
  },
  {
    id: 'camp-3',
    name: 'Agency Scalability & Warmup Batch',
    description: 'Outreach to digital agencies seeking email domain deliverability protection.',
    targetIndustry: 'Cloud Software',
    problemCategory: 'Deliverability',
    totalTargeted: 15,
    emailsGenerated: 12,
    emailsApproved: 8,
    emailsSent: 0,
    repliesCount: 0,
    status: 'Review Ready',
    createdAt: '2026-09-28',
    targetCustomerIds: ['cust-2', 'cust-5']
  }
];

export const INITIAL_REPLIES: ReplyThread[] = [
  {
    id: 'reply-1',
    customerId: 'cust-1',
    customerName: 'John Doe',
    customerEmail: 'john@abc.com',
    company: 'ABC Logistics',
    campaignName: 'Q3 Enterprise Hosting Outreach',
    sentEmailSubject: 'Accelerate ABC Logistics’s website performance by 3.2x',
    sentEmailBody: `Hi John, I noticed ABC Logistics's website could benefit from faster hosting...`,
    sentDate: '2026-09-20 11:00',
    replySubject: 'Re: Accelerate ABC Logistics’s website performance by 3.2x',
    replyBody: `Hi Alex,\n\nThanks for reaching out! You actually caught us at the right time. Our site latency during peak hours has been a major pain point for our freight ops team.\n\nCould you send over pricing options and details on migration downtime?\n\nBest,\nJohn Doe\nVP Technology, ABC Logistics`,
    receivedAt: '2026-09-28 14:30',
    status: 'Reply Received — Follow-up Stopped',
    aiSuggestedReply: `Hi John,\n\nGreat to hear from you! We guarantee zero downtime during migration with our live sync technology. Our enterprise tier starts at $299/mo.\n\nI can send over a tailored migration plan for ABC Logistics today. Are you free for a brief call tomorrow afternoon?\n\nBest,\nAlex`
  },
  {
    id: 'reply-2',
    customerId: 'cust-6',
    customerName: 'Amanda Thorne',
    customerEmail: 'athorne@nexusretail.com',
    company: 'Nexus E-Commerce Group',
    campaignName: 'E-Commerce Cart Recovery Sprint',
    sentEmailSubject: 'Recover 22% of abandoned carts at Nexus E-Commerce',
    sentEmailBody: `Hi Amanda, Nexus E-Commerce has great product selection but cart abandonment...`,
    sentDate: '2026-09-21 09:00',
    replySubject: 'Re: Recover 22% of abandoned carts at Nexus E-Commerce',
    replyBody: `Hey Alex,\n\nInteresting timing. We lost nearly $40k in unrecovered carts last month. How fast can this AI integration be set up on Shopify Plus?\n\nThanks,\nAmanda`,
    receivedAt: '2026-09-29 18:20',
    status: 'Reply Received — Follow-up Stopped',
    aiSuggestedReply: `Hi Amanda,\n\nOur Shopify Plus app integrates in under 15 minutes without any custom coding required. I can set up a live sandbox demo for you tomorrow!\n\nBest regards,\nAlex`
  },
  {
    id: 'reply-3',
    customerId: 'cust-4',
    customerName: 'Elena Rostova',
    customerEmail: 'elena@biotechlabs.org',
    company: 'BioTech Labs International',
    campaignName: 'Q3 Enterprise Hosting Outreach',
    sentEmailSubject: 'Reduce trial churn with AI-powered onboarding',
    sentEmailBody: `Hi Elena, noticed BioTech Labs has a high trial sign up volume...`,
    sentDate: '2026-09-25 11:00',
    status: 'No Reply — Follow-up Pending',
    followUpScheduledAt: '2026-09-30 10:00 AM'
  }
];

export const INITIAL_SETTINGS: UserSettings = {
  aiModel: 'SmartTarget AI Engine (GPT-4o / Claude 3.5 Sonnet)',
  apiKey: '',
  senderName: 'Alex Mercer',
  senderEmail: 'alex@smarttarget.ai',
  companyName: 'SmartTarget AI Solutions',
  defaultTone: 'Professional',
  autoFollowUpDays: 3,
  theme: 'light'
};
