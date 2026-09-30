import React, { useState } from 'react';
import type { Customer } from '../types';
import { 
  Users, 
  UserPlus, 
  Upload, 
  Filter, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight,
  Eye
} from 'lucide-react';

interface CustomersPageProps {
  customers: Customer[];
  searchQuery: string;
  onOpenAddCustomer: () => void;
  onOpenCSVImport: () => void;
  onSelectCustomerDetail: (customer: Customer) => void;
  onGenerateEmailForCustomer: (customer: Customer) => void;
  onDeleteCustomer: (id: string) => void;
}

export const CustomersPage: React.FC<CustomersPageProps> = ({
  customers,
  searchQuery,
  onOpenAddCustomer,
  onOpenCSVImport,
  onSelectCustomerDetail,
  onGenerateEmailForCustomer
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  // Filtering
  const filteredCustomers = customers.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.problem.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage) || 1;
  const paginatedCustomers = filteredCustomers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const statusBadgeClasses: Record<string, string> = {
    'New': 'badge-new',
    'Email Generated': 'badge-generated',
    'Sent': 'badge-sent',
    'Replied': 'badge-replied',
    'Follow-up Pending': 'badge-pending'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fade-in">
      {/* Page Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Customer Directory ({customers.length})
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            Segment target accounts & maintain customer pain point intelligence
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={onOpenCSVImport} className="btn btn-secondary">
            <Upload size={16} />
            <span>Upload CSV</span>
          </button>
          <button onClick={onOpenAddCustomer} className="btn btn-primary">
            <UserPlus size={16} />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="card" style={{ padding: '0.875rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Filter size={14} /> Filter Status:
          </span>
          {['All', 'New', 'Email Generated', 'Sent', 'Replied', 'Follow-up Pending'].map(st => (
            <button
              key={st}
              onClick={() => { setStatusFilter(st); setCurrentPage(1); }}
              style={{
                padding: '0.375rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.75rem',
                fontWeight: statusFilter === st ? 700 : 500,
                border: 'none',
                background: statusFilter === st ? 'var(--primary)' : 'var(--bg-surface-hover)',
                color: statusFilter === st ? 'white' : 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              {st}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Showing {paginatedCustomers.length} of {filteredCustomers.length} records</span>
        </div>
      </div>

      {/* Data Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--bg-surface-hover)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '0.875rem 1.25rem' }}>Customer Name</th>
                <th style={{ padding: '0.875rem 1rem' }}>Company</th>
                <th style={{ padding: '0.875rem 1rem' }}>Pain Point / Problem</th>
                <th style={{ padding: '0.875rem 1rem' }}>Target Service</th>
                <th style={{ padding: '0.875rem 1rem' }}>Status</th>
                <th style={{ padding: '0.875rem 1rem' }}>Last Contact</th>
                <th style={{ padding: '0.875rem 1.25rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '3rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <Users size={36} color="var(--border-medium)" style={{ margin: '0 auto 0.5rem auto' }} />
                    <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>No matching customers found</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '4px' }}>Try clearing search filters or add a new customer</div>
                  </td>
                </tr>
              ) : (
                paginatedCustomers.map(c => (
                  <tr 
                    key={c.id}
                    onClick={() => onSelectCustomerDetail(c)}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      transition: 'background var(--transition-fast)',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-surface-hover)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '0.875rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img 
                          src={c.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'} 
                          alt={c.name}
                          style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{c.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.email}</div>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '0.875rem 1rem', fontWeight: 600, color: 'var(--text-main)' }}>
                      {c.company}
                    </td>

                    <td style={{ padding: '0.875rem 1rem', maxWidth: '240px' }}>
                      <span style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        fontSize: '0.8125rem',
                        color: 'var(--text-muted)'
                      }}>
                        {c.problem}
                      </span>
                    </td>

                    <td style={{ padding: '0.875rem 1rem', fontSize: '0.8125rem', color: 'var(--primary)', fontWeight: 600 }}>
                      {c.service}
                    </td>

                    <td style={{ padding: '0.875rem 1rem' }}>
                      <span className={`badge ${statusBadgeClasses[c.status] || 'badge-new'}`}>
                        {c.status}
                      </span>
                    </td>

                    <td style={{ padding: '0.875rem 1rem', fontSize: '0.75rem', color: 'var(--text-light)' }}>
                      {c.lastContact}
                    </td>

                    <td style={{ padding: '0.875rem 1.25rem', textAlign: 'right' }} onClick={e => e.stopPropagation()}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.375rem' }}>
                        <button 
                          onClick={() => onGenerateEmailForCustomer(c)}
                          className="btn btn-ai"
                          style={{ padding: '0.375rem 0.625rem', fontSize: '0.75rem' }}
                          title="Generate AI Email"
                        >
                          <Sparkles size={13} />
                          <span>AI Email</span>
                        </button>
                        <button 
                          onClick={() => onSelectCustomerDetail(c)}
                          className="btn btn-ghost"
                          style={{ padding: '0.375rem', borderRadius: '50%' }}
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div style={{ padding: '0.875rem 1.25rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-surface)' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
          </span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="btn btn-secondary" 
              style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem' }}
            >
              <ChevronLeft size={14} /> Previous
            </button>
            <button 
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="btn btn-secondary" 
              style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem' }}
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
