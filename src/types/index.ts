export type CustomerStatus = 'New' | 'Email Generated' | 'Sent' | 'Replied' | 'Follow-up Pending' | 'Bounced';

export interface Customer {
  id: string;
  name: string;
  email: string;
  company: string;
  problem: string;
  service: string;
  industry: string;
  status: CustomerStatus;
  lastContact: string;
  notes?: string;
  createdAt: string;
  avatarUrl?: string;
}

export type EmailTone = 'Professional' | 'Friendly' | 'Persuasive' | 'Direct' | 'Consultative';
export type EmailStatus = 'Draft' | 'Approved' | 'Sent' | 'Rejected';

export interface EmailDraft {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  company: string;
  subject: string;
  body: string;
  tone: EmailTone;
  status: EmailStatus;
  generatedAt: string;
  aiModelUsed: string;
  approvedAt?: string;
  sentAt?: string;
}

export type CampaignStatus = 'Draft' | 'Generating' | 'Review Ready' | 'Scheduled' | 'Active' | 'Completed';

export interface Campaign {
  id: string;
  name: string;
  description: string;
  targetIndustry?: string;
  problemCategory?: string;
  totalTargeted: number;
  emailsGenerated: number;
  emailsApproved: number;
  emailsSent: number;
  repliesCount: number;
  status: CampaignStatus;
  createdAt: string;
  scheduledDate?: string;
  targetCustomerIds: string[];
}

export type ReplyStatus = 'Reply Received — Follow-up Stopped' | 'No Reply — Follow-up Pending';

export interface ReplyThread {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  company: string;
  campaignName?: string;
  sentEmailSubject: string;
  sentEmailBody: string;
  sentDate: string;
  replySubject?: string;
  replyBody?: string;
  receivedAt?: string;
  status: ReplyStatus;
  followUpScheduledAt?: string;
  aiSuggestedReply?: string;
}

export interface AnalyticsTrendPoint {
  date: string;
  sent: number;
  opened: number;
  replied: number;
}

export interface AnalyticsSummary {
  totalCustomers: number;
  totalEmailsSent: number;
  totalReplies: number;
  followUpsPending: number;
  openRate: number;
  replyRate: number;
  conversionRate: number;
  sentTrend: AnalyticsTrendPoint[];
  problemBreakdown: { problem: string; count: number }[];
}

export interface UserSettings {
  aiModel: string;
  apiKey?: string;
  senderName: string;
  senderEmail: string;
  companyName: string;
  defaultTone: EmailTone;
  autoFollowUpDays: number;
  theme: 'light' | 'dark';

  // Supabase PostgreSQL Credentials
  supabaseUrl?: string;
  supabaseAnonKey?: string;

  // Nodemailer SMTP Credentials
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPass?: string;
}
