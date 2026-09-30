export interface SMTPConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
}

export interface SendEmailPayload {
  to: string;
  subject: string;
  body: string;
  smtpConfig?: SMTPConfig;
  senderName?: string;
  senderEmail?: string;
}

const EMAIL_SERVER_URL = 'http://localhost:3001';

export const nodemailerService = {
  testSMTP: async (config: SMTPConfig): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch(`${EMAIL_SERVER_URL}/api/test-smtp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      const data = await response.json();
      return data;
    } catch (err: any) {
      return { 
        success: false, 
        message: 'Could not connect to Nodemailer Server on port 3001. Make sure server is running.' 
      };
    }
  },

  sendEmail: async (payload: SendEmailPayload): Promise<{ success: boolean; message: string; messageId?: string }> => {
    try {
      const response = await fetch(`${EMAIL_SERVER_URL}/api/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      return data;
    } catch (err: any) {
      return { 
        success: false, 
        message: 'Nodemailer Express service unreachable at http://localhost:3001' 
      };
    }
  }
};
