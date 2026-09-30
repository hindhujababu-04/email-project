import type { Customer, EmailTone, EmailDraft } from '../types';

interface GenerationOptions {
  customer: Customer;
  tone: EmailTone;
  customPrompt?: string;
  senderName?: string;
  senderCompany?: string;
}

export const aiService = {
  generateEmail: async ({
    customer,
    tone,
    customPrompt = '',
    senderName = 'Alex Mercer',
    senderCompany = 'SmartTarget AI'
  }: GenerationOptions): Promise<EmailDraft> => {
    await new Promise(resolve => setTimeout(resolve, 1200));

    const companyName = customer.company || 'your team';
    const contactFirstName = customer.name.split(' ')[0] || 'there';
    const problem = customer.problem || 'workflow bottlenecks';
    const service = customer.service || 'our automated intelligence platform';

    let subject = '';
    let body = '';

    switch (tone) {
      case 'Friendly':
        subject = `Quick idea for ${companyName} regarding ${customer.service ? customer.service.split(' ')[0] : 'growth'}`;
        body = `Hi ${contactFirstName},\n\nI was following ${companyName}'s growth recently and noticed you might be dealing with ${problem.toLowerCase()}.\n\nWe built ${service} specifically to help team leads like you overcome this without taking on extra overhead.\n\n${customPrompt ? `Note: ${customPrompt}\n\n` : ''}I'd love to share a 2-minute video breakdown of how other ${customer.industry || 'industry'} companies solved this!\n\nWould you be open to checking it out?\n\nBest,\n${senderName}\n${senderCompany}`;
        break;

      case 'Persuasive':
        subject = `Accelerate ${companyName}’s ROI & solve ${problem.substring(0, 30)}...`;
        body = `Dear ${contactFirstName},\n\nIs ${problem.toLowerCase()} currently capping ${companyName}’s growth potential?\n\nBy leveraging ${service}, our customers typically see a 3x increase in operational efficiency within the first 14 days.\n\n${customPrompt ? `Special instructions applied: ${customPrompt}\n\n` : ''}Let's schedule a brief 10-minute executive briefing to explore how much time and budget ${companyName} could save this quarter.\n\nWarm regards,\n${senderName}\n${senderCompany}`;
        break;

      case 'Direct':
        subject = `${problem.substring(0, 35)} — ${service.substring(0, 30)}`;
        body = `Hi ${contactFirstName},\n\nNoticed ${companyName} is facing ${problem.toLowerCase()}.\n\nOur ${service} resolves this directly by automating the entire workflow.\n\n${customPrompt ? `Custom emphasis: ${customPrompt}\n\n` : ''}Are you available for a 5-minute call tomorrow at 10 AM?\n\nThanks,\n${senderName}`;
        break;

      case 'Consultative':
        subject = `Strategic analysis for ${companyName}: Addressing ${problem.substring(0, 30)}`;
        body = `Hello ${contactFirstName},\n\nIn our recent benchmark analysis of the ${customer.industry || 'tech'} sector, we found that ${problem.toLowerCase()} is one of the highest leverage areas to optimize.\n\nWe designed ${service} to address this exact challenge while seamlessly integrating with your existing setup.\n\n${customPrompt ? `Note: ${customPrompt}\n\n` : ''}Would you be open to reviewing a personalized ROI assessment for ${companyName}?\n\nKind regards,\n${senderName}\nSenior Outreach Strategist, ${senderCompany}`;
        break;

      case 'Professional':
      default:
        subject = `Optimizing ${companyName}'s workflow with ${service}`;
        body = `Hi ${contactFirstName},\n\nI noticed ${companyName}'s team might benefit from addressing ${problem.toLowerCase()}.\n\nOur ${service} has helped organizations in ${customer.industry || 'your industry'} streamline their process and drive measurable performance improvements.\n\n${customPrompt ? `Additional Note: ${customPrompt}\n\n` : ''}I’d love to show you how improved performance could help your team achieve smoother results.\n\nBest regards,\n${senderName}\n${senderCompany}`;
        break;
    }

    return {
      id: `email-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      customerId: customer.id,
      customerName: customer.name,
      customerEmail: customer.email,
      company: customer.company,
      subject,
      body,
      tone,
      status: 'Draft',
      generatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      aiModelUsed: 'SmartTarget AI Engine (GPT-4o)'
    };
  },

  generateCampaignEmailsBatch: async (customers: Customer[], tone: EmailTone): Promise<EmailDraft[]> => {
    const results = await Promise.all(
      customers.map(c => aiService.generateEmail({ customer: c, tone }))
    );
    return results;
  },

  generateCounterReply: async (customerName: string): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const firstName = customerName.split(' ')[0] || 'there';
    return `Hi ${firstName},\n\nThank you for getting back to me! I completely understand your focus on ROI and implementation timing.\n\nTo answer your question: setup takes less than 15 minutes, and we provide dedicated onboarding support to ensure zero disruption.\n\nWould tomorrow at 2 PM EST work for a quick 10-minute demo?\n\nBest regards,\nAlex Mercer`;
  }
};
