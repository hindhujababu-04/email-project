-- ===================================================
-- AI TARGETED CUSTOMER EMAIL SYSTEM - SUPABASE POSTGRESQL SCHEMA
-- Execute this SQL in your Supabase SQL Editor to create all required tables
-- ===================================================

-- 1. Customers Table
CREATE TABLE IF NOT EXISTS customers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT NOT NULL,
    problem TEXT NOT NULL,
    service TEXT NOT NULL,
    industry TEXT,
    status TEXT NOT NULL DEFAULT 'New',
    last_contact TEXT DEFAULT 'Never',
    notes TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 2. Emails Table
CREATE TABLE IF NOT EXISTS emails (
    id TEXT PRIMARY KEY,
    customer_id TEXT REFERENCES customers(id) ON DELETE CASCADE,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    company TEXT NOT NULL,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    tone TEXT NOT NULL DEFAULT 'Professional',
    status TEXT NOT NULL DEFAULT 'Draft',
    generated_at TEXT NOT NULL,
    ai_model_used TEXT,
    approved_at TEXT,
    sent_at TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 3. Campaigns Table
CREATE TABLE IF NOT EXISTS campaigns (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    target_industry TEXT,
    total_targeted INT DEFAULT 0,
    emails_generated INT DEFAULT 0,
    emails_approved INT DEFAULT 0,
    emails_sent INT DEFAULT 0,
    replies_count INT DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'Review Ready',
    scheduled_date TEXT,
    target_customer_ids JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 4. Replies Table
CREATE TABLE IF NOT EXISTS replies (
    id TEXT PRIMARY KEY,
    customer_id TEXT REFERENCES customers(id) ON DELETE CASCADE,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    company TEXT NOT NULL,
    campaign_name TEXT,
    sent_email_subject TEXT NOT NULL,
    sent_email_body TEXT NOT NULL,
    sent_date TEXT NOT NULL,
    reply_subject TEXT,
    reply_body TEXT,
    received_at TEXT,
    status TEXT NOT NULL,
    follow_up_scheduled_at TEXT,
    ai_suggested_reply TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 5. User Settings Table
CREATE TABLE IF NOT EXISTS user_settings (
    id INT PRIMARY KEY DEFAULT 1,
    ai_model TEXT NOT NULL,
    api_key TEXT,
    sender_name TEXT NOT NULL,
    sender_email TEXT NOT NULL,
    company_name TEXT NOT NULL,
    default_tone TEXT NOT NULL,
    auto_follow_up_days INT DEFAULT 3,
    smtp_host TEXT,
    smtp_port INT DEFAULT 587,
    smtp_user TEXT,
    smtp_pass TEXT,
    supabase_url TEXT,
    supabase_key TEXT
);

-- Enable Row Level Security (RLS) policies for public access (or key-based access)
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read customers" ON customers FOR SELECT USING (true);
CREATE POLICY "Allow public insert customers" ON customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update customers" ON customers FOR UPDATE USING (true);
CREATE POLICY "Allow public delete customers" ON customers FOR DELETE USING (true);

CREATE POLICY "Allow public all emails" ON emails FOR ALL USING (true);
CREATE POLICY "Allow public all campaigns" ON campaigns FOR ALL USING (true);
CREATE POLICY "Allow public all replies" ON replies FOR ALL USING (true);
CREATE POLICY "Allow public all user_settings" ON user_settings FOR ALL USING (true);
