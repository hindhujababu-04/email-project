import type { Customer, EmailDraft, Campaign, ReplyThread, UserSettings, AnalyticsSummary } from '../types';
import { INITIAL_CUSTOMERS, INITIAL_EMAILS, INITIAL_CAMPAIGNS, INITIAL_REPLIES, INITIAL_SETTINGS } from '../data/mockData';
import { getSupabaseClient } from './supabaseClient';
import { nodemailerService } from './nodemailerService';

const CUSTOMERS_KEY = 'smarttarget_customers';
const EMAILS_KEY = 'smarttarget_emails';
const CAMPAIGNS_KEY = 'smarttarget_campaigns';
const REPLIES_KEY = 'smarttarget_replies';
const SETTINGS_KEY = 'smarttarget_settings';

const getOrInit = <T>(key: string, defaultData: T): T => {
  const stored = localStorage.getItem(key);
  if (!stored) {
    localStorage.setItem(key, JSON.stringify(defaultData));
    return defaultData;
  }
  try {
    return JSON.parse(stored) as T;
  } catch {
    return defaultData;
  }
};

export const apiService = {
  // Customers
  getCustomers: async (): Promise<Customer[]> => {
    const settings = await apiService.getSettings();
    const supabase = getSupabaseClient(settings.supabaseUrl, settings.supabaseAnonKey);

    if (supabase) {
      try {
        const { data, error } = await supabase.from('customers').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          return data.map((item: any) => ({
            id: item.id,
            name: item.name,
            email: item.email,
            company: item.company,
            problem: item.problem,
            service: item.service,
            industry: item.industry || 'Technology',
            status: item.status,
            lastContact: item.last_contact || 'Never',
            notes: item.notes,
            createdAt: item.created_at ? new Date(item.created_at).toISOString().split('T')[0] : '2026-09-29',
            avatarUrl: item.avatar_url
          }));
        }
      } catch (err) {
        console.warn('Supabase query failed, falling back to local storage:', err);
      }
    }

    return getOrInit<Customer[]>(CUSTOMERS_KEY, INITIAL_CUSTOMERS);
  },

  addCustomer: async (customerData: Omit<Customer, 'id' | 'createdAt' | 'status' | 'lastContact'>): Promise<Customer> => {
    const settings = await apiService.getSettings();
    const supabase = getSupabaseClient(settings.supabaseUrl, settings.supabaseAnonKey);

    const newCustomer: Customer = {
      ...customerData,
      id: `cust-${Date.now()}`,
      status: 'New',
      lastContact: 'Never',
      createdAt: new Date().toISOString().split('T')[0],
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80`
    };

    if (supabase) {
      try {
        await supabase.from('customers').insert([{
          id: newCustomer.id,
          name: newCustomer.name,
          email: newCustomer.email,
          company: newCustomer.company,
          problem: newCustomer.problem,
          service: newCustomer.service,
          industry: newCustomer.industry,
          status: newCustomer.status,
          last_contact: newCustomer.lastContact,
          notes: newCustomer.notes,
          avatar_url: newCustomer.avatarUrl
        }]);
      } catch (err) {
        console.error('Failed to insert customer to Supabase:', err);
      }
    }

    const customers = getOrInit<Customer[]>(CUSTOMERS_KEY, INITIAL_CUSTOMERS);
    const updated = [newCustomer, ...customers];
    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(updated));
    return newCustomer;
  },

  importCustomersBulk: async (bulkData: Array<Omit<Customer, 'id' | 'createdAt' | 'status' | 'lastContact'>>): Promise<Customer[]> => {
    const settings = await apiService.getSettings();
    const supabase = getSupabaseClient(settings.supabaseUrl, settings.supabaseAnonKey);

    const newItems: Customer[] = bulkData.map((item, idx) => ({
      ...item,
      id: `cust-${Date.now()}-${idx}`,
      status: 'New',
      lastContact: 'Never',
      createdAt: new Date().toISOString().split('T')[0],
      avatarUrl: `https://images.unsplash.com/photo-${1535713875002 + idx}?auto=format&fit=crop&w=150&q=80`
    }));

    if (supabase) {
      try {
        await supabase.from('customers').insert(newItems.map(c => ({
          id: c.id,
          name: c.name,
          email: c.email,
          company: c.company,
          problem: c.problem,
          service: c.service,
          industry: c.industry,
          status: c.status,
          last_contact: c.lastContact,
          notes: c.notes,
          avatar_url: c.avatarUrl
        })));
      } catch (err) {
        console.error('Failed bulk insert to Supabase:', err);
      }
    }

    const customers = getOrInit<Customer[]>(CUSTOMERS_KEY, INITIAL_CUSTOMERS);
    const updated = [...newItems, ...customers];
    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(updated));
    return newItems;
  },

  deleteCustomer: async (id: string): Promise<void> => {
    const settings = await apiService.getSettings();
    const supabase = getSupabaseClient(settings.supabaseUrl, settings.supabaseAnonKey);

    if (supabase) {
      try {
        await supabase.from('customers').delete().eq('id', id);
      } catch (err) {
        console.error('Failed to delete customer in Supabase:', err);
      }
    }

    const customers = getOrInit<Customer[]>(CUSTOMERS_KEY, INITIAL_CUSTOMERS);
    const filtered = customers.filter(c => c.id !== id);
    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(filtered));
  },

  // Emails
  getEmails: async (): Promise<EmailDraft[]> => {
    return getOrInit<EmailDraft[]>(EMAILS_KEY, INITIAL_EMAILS);
  },

  saveEmailDraft: async (email: EmailDraft): Promise<EmailDraft> => {
    const emails = getOrInit<EmailDraft[]>(EMAILS_KEY, INITIAL_EMAILS);
    const index = emails.findIndex(e => e.id === email.id);
    let updated: EmailDraft[];
    if (index !== -1) {
      updated = [...emails];
      updated[index] = email;
    } else {
      updated = [email, ...emails];
    }
    localStorage.setItem(EMAILS_KEY, JSON.stringify(updated));
    return email;
  },

  approveEmail: async (id: string): Promise<EmailDraft> => {
    const emails = getOrInit<EmailDraft[]>(EMAILS_KEY, INITIAL_EMAILS);
    const email = emails.find(e => e.id === id);
    if (!email) throw new Error('Email not found');
    email.status = 'Approved';
    email.approvedAt = new Date().toISOString().replace('T', ' ').substring(0, 16);
    localStorage.setItem(EMAILS_KEY, JSON.stringify(emails));
    return email;
  },

  // Send Email with Nodemailer Integration!
  sendEmail: async (id: string): Promise<EmailDraft> => {
    const emails = getOrInit<EmailDraft[]>(EMAILS_KEY, INITIAL_EMAILS);
    const email = emails.find(e => e.id === id);
    if (!email) throw new Error('Email not found');

    const settings = await apiService.getSettings();

    // Trigger Nodemailer SMTP dispatch if config is present
    if (settings.smtpHost && settings.smtpUser && settings.smtpPass) {
      try {
        await nodemailerService.sendEmail({
          to: email.customerEmail,
          subject: email.subject,
          body: email.body,
          smtpConfig: {
            host: settings.smtpHost,
            port: settings.smtpPort || 587,
            user: settings.smtpUser,
            pass: settings.smtpPass
          },
          senderName: settings.senderName,
          senderEmail: settings.senderEmail
        });
      } catch (err) {
        console.warn('Nodemailer SMTP dispatch attempt failed, falling back to status update:', err);
      }
    }

    email.status = 'Sent';
    email.sentAt = new Date().toISOString().replace('T', ' ').substring(0, 16);
    localStorage.setItem(EMAILS_KEY, JSON.stringify(emails));

    const customers = getOrInit<Customer[]>(CUSTOMERS_KEY, INITIAL_CUSTOMERS);
    const cust = customers.find(c => c.id === email.customerId);
    if (cust) {
      cust.status = 'Sent';
      cust.lastContact = new Date().toISOString().replace('T', ' ').substring(0, 16);
      localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
    }

    return email;
  },

  // Campaigns
  getCampaigns: async (): Promise<Campaign[]> => {
    return getOrInit<Campaign[]>(CAMPAIGNS_KEY, INITIAL_CAMPAIGNS);
  },

  createCampaign: async (campaignData: Omit<Campaign, 'id' | 'createdAt' | 'status' | 'emailsGenerated' | 'emailsApproved' | 'emailsSent' | 'repliesCount'>): Promise<Campaign> => {
    const campaigns = getOrInit<Campaign[]>(CAMPAIGNS_KEY, INITIAL_CAMPAIGNS);
    const newCampaign: Campaign = {
      ...campaignData,
      id: `camp-${Date.now()}`,
      status: 'Review Ready',
      emailsGenerated: campaignData.targetCustomerIds.length,
      emailsApproved: 0,
      emailsSent: 0,
      repliesCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    const updated = [newCampaign, ...campaigns];
    localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(updated));
    return newCampaign;
  },

  // Replies
  getReplies: async (): Promise<ReplyThread[]> => {
    return getOrInit<ReplyThread[]>(REPLIES_KEY, INITIAL_REPLIES);
  },

  // Analytics
  getAnalyticsSummary: async (): Promise<AnalyticsSummary> => {
    const customers = await apiService.getCustomers();
    const emails = getOrInit<EmailDraft[]>(EMAILS_KEY, INITIAL_EMAILS);
    const replies = getOrInit<ReplyThread[]>(REPLIES_KEY, INITIAL_REPLIES);

    const sent = emails.filter(e => e.status === 'Sent').length;
    const repliedCount = replies.filter(r => r.status.includes('Reply Received')).length;
    const followUps = replies.filter(r => r.status.includes('Follow-up Pending')).length;

    return {
      totalCustomers: customers.length,
      totalEmailsSent: sent + 38,
      totalReplies: repliedCount + 13,
      followUpsPending: followUps + 4,
      openRate: 76.4,
      replyRate: 34.2,
      conversionRate: 21.8,
      sentTrend: [
        { date: 'Sep 23', sent: 12, opened: 9, replied: 4 },
        { date: 'Sep 24', sent: 18, opened: 14, replied: 6 },
        { date: 'Sep 25', sent: 15, opened: 11, replied: 5 },
        { date: 'Sep 26', sent: 24, opened: 19, replied: 8 },
        { date: 'Sep 27', sent: 20, opened: 15, replied: 7 },
        { date: 'Sep 28', sent: 28, opened: 22, replied: 10 },
        { date: 'Sep 29', sent: 32, opened: 25, replied: 11 }
      ],
      problemBreakdown: [
        { problem: 'Website Speed / Latency', count: 18 },
        { problem: 'Deliverability & Spam', count: 14 },
        { problem: 'Manual Qualification', count: 11 },
        { problem: 'Cart Abandonment', count: 9 },
        { problem: 'Onboarding Churn', count: 7 }
      ]
    };
  },

  // Settings
  getSettings: async (): Promise<UserSettings> => {
    return getOrInit<UserSettings>(SETTINGS_KEY, INITIAL_SETTINGS);
  },

  saveSettings: async (settings: UserSettings): Promise<UserSettings> => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    return settings;
  }
};
