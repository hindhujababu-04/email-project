import React, { useState } from 'react';
import type { Customer } from '../../types';
import { Modal } from '../common/Modal';
import { Upload, FileSpreadsheet, CheckCircle2, AlertTriangle, Download, ArrowRight } from 'lucide-react';

interface CSVUploaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (customers: Array<Omit<Customer, 'id' | 'createdAt' | 'status' | 'lastContact'>>) => void;
}

interface CSVRow {
  name: string;
  email: string;
  company: string;
  problem: string;
  service: string;
  industry: string;
  notes?: string;
  isValid: boolean;
  error?: string;
}

export const CSVUploaderModal: React.FC<CSVUploaderModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [parsedRows, setParsedRows] = useState<CSVRow[]>([]);
  const [fileName, setFileName] = useState<string>('');

  const sampleTemplate = `Name,Email,Company,Problem,Service,Industry,Notes
Robert Smith,r.smith@acme.com,Acme Corp,High server response time,Cloud Infrastructure,Technology,Urgent target
Clara Oswald,clara@tardis.io,Tardis Tech,Low customer retention rate,Behavioral Email Onboarding,SaaS,Pre-series A`;

  const downloadSampleCSV = () => {
    const blob = new Blob([sampleTemplate], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'smarttarget_customers_template.csv';
    a.click();
  };

  const parseCSVText = (text: string) => {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length < 2) return;

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const nameIdx = headers.findIndex(h => h.includes('name'));
    const emailIdx = headers.findIndex(h => h.includes('email'));
    const companyIdx = headers.findIndex(h => h.includes('company'));
    const problemIdx = headers.findIndex(h => h.includes('problem') || h.includes('pain'));
    const serviceIdx = headers.findIndex(h => h.includes('service') || h.includes('product'));
    const industryIdx = headers.findIndex(h => h.includes('industry'));
    const notesIdx = headers.findIndex(h => h.includes('note'));

    const rows: CSVRow[] = lines.slice(1).map((line, idx) => {
      const cols = line.split(/,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/).map(c => c.replace(/^"|"$/g, '').trim());

      const name = cols[nameIdx] || `Contact ${idx + 1}`;
      const email = cols[emailIdx] || '';
      const company = cols[companyIdx] || 'Acme Inc';
      const problem = cols[problemIdx] || 'Slow workflow processing';
      const service = cols[serviceIdx] || 'AI Automation Solution';
      const industry = cols[industryIdx] || 'Technology';
      const notes = cols[notesIdx] || '';

      const isValid = Boolean(email && email.includes('@') && company && problem);
      let error = '';
      if (!email.includes('@')) error = 'Invalid Email';

      return { name, email, company, problem, service, industry, notes, isValid, error };
    });

    setParsedRows(rows);
  };

  const handleFileUpload = (file: File) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      parseCSVText(text);
    };
    reader.readAsText(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleImport = () => {
    const validData = parsedRows.filter(r => r.isValid).map(r => ({
      name: r.name,
      email: r.email,
      company: r.company,
      problem: r.problem,
      service: r.service,
      industry: r.industry,
      notes: r.notes
    }));
    if (validData.length > 0) {
      onImportSuccess(validData);
      setParsedRows([]);
      setFileName('');
      onClose();
    }
  };

  const validCount = parsedRows.filter(r => r.isValid).length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upload Customer CSV File"
      subtitle="Import leads in bulk with drag-and-drop CSV validation"
      maxWidth="720px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {parsedRows.length === 0 ? (
          <div 
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            style={{
              border: `2px dashed ${dragActive ? 'var(--primary)' : 'var(--border-medium)'}`,
              borderRadius: 'var(--radius-lg)',
              padding: '2.5rem 1.5rem',
              textAlign: 'center',
              backgroundColor: dragActive ? 'var(--primary-light)' : 'var(--bg-surface-hover)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = '.csv';
              input.onchange = (e: any) => {
                if (e.target.files[0]) handleFileUpload(e.target.files[0]);
              };
              input.click();
            }}
          >
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <Upload size={28} />
            </div>

            <h4 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
              Drag and drop your CSV file here
            </h4>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Supports .csv files containing Name, Email, Company, Problem, Service fields
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <button type="button" className="btn btn-secondary" style={{ fontSize: '0.8125rem' }}>
                <FileSpreadsheet size={16} />
                <span>Browse File</span>
              </button>
              <button 
                type="button" 
                onClick={(e) => { e.stopPropagation(); downloadSampleCSV(); }} 
                className="btn btn-ghost" 
                style={{ fontSize: '0.8125rem' }}
              >
                <Download size={16} />
                <span>Download Sample CSV Template</span>
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileSpreadsheet size={20} color="var(--primary)" />
                <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-main)' }}>{fileName}</span>
                <span className="badge badge-ai">{parsedRows.length} Records Parsed</span>
              </div>
              <button 
                onClick={() => { setParsedRows([]); setFileName(''); }}
                className="btn btn-ghost" 
                style={{ fontSize: '0.75rem' }}
              >
                Change File
              </button>
            </div>

            <div style={{
              maxHeight: '260px',
              overflowY: 'auto',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-surface-hover)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'left' }}>
                    <th style={{ padding: '0.625rem 0.875rem' }}>Status</th>
                    <th style={{ padding: '0.625rem 0.875rem' }}>Name</th>
                    <th style={{ padding: '0.625rem 0.875rem' }}>Email</th>
                    <th style={{ padding: '0.625rem 0.875rem' }}>Company</th>
                    <th style={{ padding: '0.625rem 0.875rem' }}>Pain Point</th>
                  </tr>
                </thead>
                <tbody>
                  {parsedRows.map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)', background: row.isValid ? 'transparent' : 'rgba(244, 63, 94, 0.05)' }}>
                      <td style={{ padding: '0.625rem 0.875rem' }}>
                        {row.isValid ? (
                          <CheckCircle2 size={16} color="var(--accent-emerald)" />
                        ) : (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--accent-rose)', fontSize: '0.7rem', fontWeight: 600 }}>
                            <AlertTriangle size={14} /> {row.error}
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '0.625rem 0.875rem', fontWeight: 600 }}>{row.name}</td>
                      <td style={{ padding: '0.625rem 0.875rem' }}>{row.email}</td>
                      <td style={{ padding: '0.625rem 0.875rem' }}>{row.company}</td>
                      <td style={{ padding: '0.625rem 0.875rem', color: 'var(--text-muted)' }}>{row.problem}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.25rem' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                Ready to import <strong>{validCount}</strong> valid customer records
              </span>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="button" onClick={onClose} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="button" onClick={handleImport} className="btn btn-primary" disabled={validCount === 0}>
                  <span>Import {validCount} Customers</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
