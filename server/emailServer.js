import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'SmartTarget Nodemailer Email Dispatcher' });
});

// Test SMTP Connection Endpoint
app.post('/api/test-smtp', async (req, res) => {
  const { host, port, user, pass, secure } = req.body;

  if (!host || !user || !pass) {
    return res.status(400).json({ success: false, message: 'SMTP Host, User, and Password are required.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port: Number(port) || 587,
      secure: Boolean(secure) || Number(port) === 465,
      auth: { user, pass }
    });

    await transporter.verify();
    return res.json({ success: true, message: 'SMTP connection verified successfully!' });
  } catch (err) {
    console.error('SMTP Test Error:', err);
    return res.status(500).json({ success: false, message: err.message || 'Failed to authenticate SMTP server.' });
  }
});

// Send Email via Nodemailer SMTP Endpoint
app.post('/api/send-email', async (req, res) => {
  const { 
    to, 
    subject, 
    body, 
    smtpConfig,
    senderName,
    senderEmail
  } = req.body;

  if (!to || !subject || !body) {
    return res.status(400).json({ success: false, message: 'Recipient (to), subject, and body are required.' });
  }

  // Use provided SMTP config or fallback to environment variables
  const host = smtpConfig?.host || process.env.SMTP_HOST;
  const port = Number(smtpConfig?.port || process.env.SMTP_PORT || 587);
  const user = smtpConfig?.user || process.env.SMTP_USER;
  const pass = smtpConfig?.pass || process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return res.status(400).json({ 
      success: false, 
      message: 'SMTP credentials missing. Please configure SMTP settings in Settings page or .env file.' 
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass }
    });

    const fromAddress = senderEmail 
      ? `"${senderName || 'Outreach Manager'}" <${senderEmail}>`
      : `"${senderName || 'SmartTarget AI'}" <${user}>`;

    const info = await transporter.sendMail({
      from: fromAddress,
      to,
      subject,
      text: body,
      html: `<div style="font-family: sans-serif; line-height: 1.6; color: #1e293b;">
        <div style="white-space: pre-line;">${body}</div>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="font-size: 12px; color: #94a3b8;">Sent via SmartTarget AI Outreach System</p>
      </div>`
    });

    console.log(`[Nodemailer] Email dispatched to ${to}. MessageId: ${info.messageId}`);
    return res.json({ 
      success: true, 
      messageId: info.messageId, 
      message: `Email dispatched successfully to ${to}` 
    });
  } catch (err) {
    console.error('[Nodemailer Error]', err);
    return res.status(500).json({ success: false, message: err.message || 'Failed to dispatch email via Nodemailer SMTP.' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 SmartTarget Nodemailer Email Dispatch Server running at http://localhost:${PORT}`);
});
