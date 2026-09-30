import React, { useState } from 'react';
import type { Customer } from '../../types';
import { Modal } from '../common/Modal';
import { UserPlus } from 'lucide-react';

interface CustomerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (customer: Omit<Customer, 'id' | 'createdAt' | 'status' | 'lastContact'>) => void;
}

export const CustomerFormModal: React.FC<CustomerFormModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    problem: '',
    service: '',
    industry: 'Technology',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) errs.email = 'Valid email is required';
    if (!formData.company.trim()) errs.company = 'Company name is required';
    if (!formData.problem.trim()) errs.problem = 'Pain point / problem description is required';
    if (!formData.service.trim()) errs.service = 'Target service / product is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(formData);
    setFormData({
      name: '',
      email: '',
      company: '',
      problem: '',
      service: '',
      industry: 'Technology',
      notes: ''
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Target Customer"
      subtitle="Enter customer pain point data for AI email personalization"
      maxWidth="600px"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="input-group">
            <label className="input-label">Customer Name *</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="e.g. John Doe"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
            {errors.name && <span style={{ fontSize: '0.75rem', color: 'var(--accent-rose)' }}>{errors.name}</span>}
          </div>

          <div className="input-group">
            <label className="input-label">Email Address *</label>
            <input 
              type="email" 
              className="input-field" 
              placeholder="john@company.com"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
            {errors.email && <span style={{ fontSize: '0.75rem', color: 'var(--accent-rose)' }}>{errors.email}</span>}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="input-group">
            <label className="input-label">Company Name *</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="ABC Logistics"
              value={formData.company}
              onChange={e => setFormData({ ...formData, company: e.target.value })}
            />
            {errors.company && <span style={{ fontSize: '0.75rem', color: 'var(--accent-rose)' }}>{errors.company}</span>}
          </div>

          <div className="input-group">
            <label className="input-label">Industry</label>
            <select 
              className="input-field"
              value={formData.industry}
              onChange={e => setFormData({ ...formData, industry: e.target.value })}
            >
              <option value="Logistics & Tech">Logistics & Tech</option>
              <option value="Cloud Software">Cloud Software</option>
              <option value="Financial Services">Financial Services</option>
              <option value="E-Commerce">E-Commerce</option>
              <option value="Healthcare / BioTech">Healthcare / BioTech</option>
              <option value="Marketing Agency">Marketing Agency</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">Customer Pain Point / Problem *</label>
          <textarea 
            className="input-field" 
            placeholder="e.g. Website load time is too slow (>4s), losing 30% of visitors..."
            value={formData.problem}
            onChange={e => setFormData({ ...formData, problem: e.target.value })}
            rows={3}
          />
          {errors.problem && <span style={{ fontSize: '0.75rem', color: 'var(--accent-rose)' }}>{errors.problem}</span>}
        </div>

        <div className="input-group">
          <label className="input-label">Target Service / Solution *</label>
          <input 
            type="text" 
            className="input-field" 
            placeholder="e.g. Enterprise High-Performance Hosting"
            value={formData.service}
            onChange={e => setFormData({ ...formData, service: e.target.value })}
          />
          {errors.service && <span style={{ fontSize: '0.75rem', color: 'var(--accent-rose)' }}>{errors.service}</span>}
        </div>

        <div className="input-group">
          <label className="input-label">Optional Notes</label>
          <input 
            type="text" 
            className="input-field" 
            placeholder="Key decision maker, preferred timeline..."
            value={formData.notes}
            onChange={e => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            <UserPlus size={16} />
            <span>Add Customer</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
