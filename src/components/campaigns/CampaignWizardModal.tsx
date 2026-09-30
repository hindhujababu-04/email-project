import React, { useState } from 'react';
import type { Customer, EmailTone, Campaign, EmailDraft } from '../../types';
import { Modal } from '../common/Modal';
import { aiService } from '../../services/aiService';
import { 
  Users, 
  Sparkles, 
  CheckSquare, 
  Send, 
  BarChart, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Filter
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CampaignWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  customers: Customer[];
  onCampaignCreated: (campaign: Campaign, generatedEmails: EmailDraft[]) => void;
}

export const CampaignWizardModal: React.FC<CampaignWizardModalProps> = ({
  isOpen,
  onClose,
  customers,
  onCampaignCreated
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [campaignName, setCampaignName] = useState<string>('');
  const [campaignDesc, setCampaignDesc] = useState<string>('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All');
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<string[]>([]);
  const [tone, setTone] = useState<EmailTone>('Professional');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedEmails, setGeneratedEmails] = useState<EmailDraft[]>([]);
  const [scheduledDate, setScheduledDate] = useState<string>('');

  const filteredCustomers = customers.filter(c => {
    return selectedIndustry === 'All' || c.industry === selectedIndustry;
  });

  const toggleSelectCustomer = (id: string) => {
    if (selectedCustomerIds.includes(id)) {
      setSelectedCustomerIds(selectedCustomerIds.filter(i => i !== id));
    } else {
      setSelectedCustomerIds([...selectedCustomerIds, id]);
    }
  };

  const selectAllFiltered = () => {
    setSelectedCustomerIds(filteredCustomers.map(c => c.id));
  };

  const handleStep2GenerateBatch = async () => {
    setIsGenerating(true);
    try {
      const targetList = customers.filter(c => selectedCustomerIds.includes(c.id));
      const drafts = await aiService.generateCampaignEmailsBatch(targetList, tone);
      setGeneratedEmails(drafts);
      setCurrentStep(3);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFinishCampaign = () => {
    const newCampaign: Campaign = {
      id: `camp-${Date.now()}`,
      name: campaignName || 'New Outreach Campaign',
      description: campaignDesc || 'Targeted AI outreach campaign',
      targetIndustry: selectedIndustry !== 'All' ? selectedIndustry : undefined,
      totalTargeted: selectedCustomerIds.length,
      emailsGenerated: generatedEmails.length,
      emailsApproved: generatedEmails.length,
      emailsSent: scheduledDate ? 0 : generatedEmails.length,
      repliesCount: 0,
      status: scheduledDate ? 'Scheduled' : 'Active',
      createdAt: new Date().toISOString().split('T')[0],
      scheduledDate,
      targetCustomerIds: selectedCustomerIds
    };

    onCampaignCreated(newCampaign, generatedEmails);

    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.5 }
    });

    onClose();
  };

  const steps = [
    { num: 1, title: '1. Select Customers', icon: Users },
    { num: 2, title: '2. Generate Emails', icon: Sparkles },
    { num: 3, title: '3. Review & Edit', icon: CheckSquare },
    { num: 4, title: '4. Schedule/Send', icon: Send },
    { num: 5, title: '5. Track', icon: BarChart }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Outreach Campaign"
      subtitle="5-Step Guided AI Campaign Creation Wizard"
      maxWidth="850px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Stepper Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '1rem'
        }}>
          {steps.map(s => {
            const isDone = currentStep > s.num;
            const isCurrent = currentStep === s.num;
            return (
              <div key={s.num} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: isDone ? 'var(--accent-emerald)' : isCurrent ? 'var(--primary)' : 'var(--bg-surface-hover)',
                  color: isDone || isCurrent ? 'white' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 700
                }}>
                  {isDone ? <Check size={14} /> : s.num}
                </div>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: isCurrent ? 700 : 500,
                  color: isCurrent ? 'var(--primary)' : 'var(--text-muted)'
                }}>
                  {s.title}
                </span>
              </div>
            );
          })}
        </div>

        {/* STEP 1: Select Target Customers */}
        {currentStep === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="input-group">
                <label className="input-label">Campaign Name *</label>
                <input 
                  type="text" 
                  className="input-field"
                  placeholder="e.g. Q4 Enterprise Logistics Sprint"
                  value={campaignName}
                  onChange={e => setCampaignName(e.target.value)}
                />
              </div>
              <div className="input-group">
                <label className="input-label">Description / Goal</label>
                <input 
                  type="text" 
                  className="input-field"
                  placeholder="Targeting accounts with speed bottlenecks"
                  value={campaignDesc}
                  onChange={e => setCampaignDesc(e.target.value)}
                />
              </div>
            </div>

            {/* Audience Filters */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--bg-surface-hover)',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Filter size={14} /> Audience Filters:
                </span>
                <select 
                  className="input-field"
                  style={{ height: '32px', fontSize: '0.75rem' }}
                  value={selectedIndustry}
                  onChange={e => setSelectedIndustry(e.target.value)}
                >
                  <option value="All">All Industries</option>
                  <option value="Logistics & Tech">Logistics & Tech</option>
                  <option value="Cloud Software">Cloud Software</option>
                  <option value="E-Commerce">E-Commerce</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span className="badge badge-ai" style={{ fontSize: '0.8125rem' }}>
                  <strong>{selectedCustomerIds.length}</strong> customers selected
                </span>
                <button type="button" onClick={selectAllFiltered} className="btn btn-ghost" style={{ fontSize: '0.75rem' }}>
                  Select All Filtered
                </button>
              </div>
            </div>

            {/* Customer List Selection Table */}
            <div style={{ maxHeight: '220px', overflowY: 'auto', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-surface-hover)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'left' }}>
                    <th style={{ padding: '0.5rem 0.75rem', width: '40px' }}>Select</th>
                    <th style={{ padding: '0.5rem 0.75rem' }}>Customer</th>
                    <th style={{ padding: '0.5rem 0.75rem' }}>Company</th>
                    <th style={{ padding: '0.5rem 0.75rem' }}>Pain Point</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map(c => {
                    const isSelected = selectedCustomerIds.includes(c.id);
                    return (
                      <tr 
                        key={c.id}
                        onClick={() => toggleSelectCustomer(c.id)}
                        style={{
                          borderBottom: '1px solid var(--border-subtle)',
                          background: isSelected ? 'var(--primary-light)' : 'transparent',
                          cursor: 'pointer'
                        }}
                      >
                        <td style={{ padding: '0.5rem 0.75rem' }}>
                          <input 
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                          />
                        </td>
                        <td style={{ padding: '0.5rem 0.75rem', fontWeight: 600 }}>{c.name}</td>
                        <td style={{ padding: '0.5rem 0.75rem' }}>{c.company}</td>
                        <td style={{ padding: '0.5rem 0.75rem', color: 'var(--text-muted)' }}>{c.problem}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button 
                type="button" 
                onClick={() => setCurrentStep(2)} 
                className="btn btn-primary"
                disabled={selectedCustomerIds.length === 0}
              >
                <span>Continue to AI Generation</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Configure AI Parameters & Generate */}
        {currentStep === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'center', padding: '1.5rem 0' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'var(--ai-gradient)',
              color: 'white',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              boxShadow: 'var(--shadow-glow)'
            }}>
              <Sparkles size={32} />
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Batch AI Email Generation
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto' }}>
              SmartTarget AI will synthesize custom emails for <strong>{selectedCustomerIds.length} target accounts</strong> based on their unique pain points.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', margin: '0.5rem 0' }}>
              {(['Professional', 'Friendly', 'Persuasive', 'Direct'] as EmailTone[]).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTone(t)}
                  className={`btn ${tone === t ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.8125rem' }}
                >
                  {t}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
              <button type="button" onClick={() => setCurrentStep(1)} className="btn btn-secondary">
                <ArrowLeft size={16} /> Back
              </button>
              <button 
                type="button" 
                onClick={handleStep2GenerateBatch} 
                className="btn btn-ai"
                disabled={isGenerating}
              >
                <Sparkles size={16} className={isGenerating ? 'animate-spin' : ''} />
                <span>{isGenerating ? 'Generating Emails...' : `Generate ${selectedCustomerIds.length} Personalized Emails`}</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Review Generated Batch */}
        {currentStep === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h4 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>
                Generated Email Review Queue ({generatedEmails.length})
              </h4>
              <span className="badge badge-ai">100% Personalization Applied</span>
            </div>

            <div style={{ maxHeight: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {generatedEmails.map((e) => (
                <div key={e.id} className="card" style={{ padding: '0.875rem 1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '0.875rem', color: 'var(--text-main)' }}>{e.customerName} ({e.company})</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>{e.tone}</span>
                  </div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)' }}>Subject: {e.subject}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
              <button type="button" onClick={() => setCurrentStep(2)} className="btn btn-secondary">
                <ArrowLeft size={16} /> Back
              </button>
              <button type="button" onClick={() => setCurrentStep(4)} className="btn btn-primary">
                <span>Approve All & Continue</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Schedule / Send */}
        {currentStep === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h4 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>
              Schedule Campaign Delivery
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <label className="input-group">
                <span className="input-label">Select Dispatch Schedule</span>
                <input 
                  type="datetime-local" 
                  className="input-field" 
                  value={scheduledDate}
                  onChange={e => setScheduledDate(e.target.value)}
                />
              </label>

              <div style={{ padding: '1rem', background: 'var(--primary-light)', borderRadius: 'var(--radius-md)', fontSize: '0.8125rem', color: 'var(--primary)' }}>
                <strong>Instant Dispatch:</strong> Leaving schedule blank will send emails immediately upon confirmation.
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
              <button type="button" onClick={() => setCurrentStep(3)} className="btn btn-secondary">
                <ArrowLeft size={16} /> Back
              </button>
              <button type="button" onClick={() => setCurrentStep(5)} className="btn btn-primary">
                <span>Confirm Delivery Plan</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Track & Launch */}
        {currentStep === 5 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'center', padding: '1.5rem 0' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.1)',
              color: 'var(--accent-emerald)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto'
            }}>
              <Send size={32} />
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Campaign Ready for Launch!
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Campaign "<strong>{campaignName || 'New Campaign'}</strong>" will target {selectedCustomerIds.length} accounts.
            </p>

            <button 
              type="button" 
              onClick={handleFinishCampaign} 
              className="btn btn-primary"
              style={{ width: '240px', margin: '1rem auto 0 auto' }}
            >
              <Sparkles size={18} />
              <span>Launch Campaign Now</span>
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};
