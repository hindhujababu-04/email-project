import React, { useState, useEffect } from 'react';
import type { NavRoute } from './components/common/Sidebar';
import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import type { ToastMessage } from './components/common/Toast';
import { ToastContainer } from './components/common/Toast';

import type { Customer, EmailDraft, Campaign, ReplyThread, AnalyticsSummary, UserSettings } from './types';
import { apiService } from './services/api';

import { DashboardPage } from './pages/DashboardPage';
import { CustomersPage } from './pages/CustomersPage';
import { CampaignsPage } from './pages/CampaignsPage';
import { EmailsPage } from './pages/EmailsPage';
import { RepliesPage } from './pages/RepliesPage';
import { FollowUpsPage } from './pages/FollowUpsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';

import { CustomerFormModal } from './components/customers/CustomerFormModal';
import { CSVUploaderModal } from './components/customers/CSVUploaderModal';
import { CustomerDetailDrawer } from './components/customers/CustomerDetailDrawer';
import { AIEmailGeneratorModal } from './components/generator/AIEmailGeneratorModal';
import { CampaignWizardModal } from './components/campaigns/CampaignWizardModal';

export const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<NavRoute>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Data States
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [emails, setEmails] = useState<EmailDraft[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [replies, setReplies] = useState<ReplyThread[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Toast System
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Modals & Drawers
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState<boolean>(false);
  const [isCSVImportOpen, setIsCSVImportOpen] = useState<boolean>(false);
  const [isCampaignWizardOpen, setIsCampaignWizardOpen] = useState<boolean>(false);
  const [selectedGeneratorCustomer, setSelectedGeneratorCustomer] = useState<Customer | null>(null);
  const [selectedCustomerDetail, setSelectedCustomerDetail] = useState<Customer | null>(null);

  // Initial Load from Service API Layer
  const loadData = async () => {
    try {
      const [custData, emailData, campData, replyData, analData, settData] = await Promise.all([
        apiService.getCustomers(),
        apiService.getEmails(),
        apiService.getCampaigns(),
        apiService.getReplies(),
        apiService.getAnalyticsSummary(),
        apiService.getSettings()
      ]);

      setCustomers(custData);
      setEmails(emailData);
      setCampaigns(campData);
      setReplies(replyData);
      setAnalytics(analData);
      setSettings(settData);
    } catch (err) {
      console.error('Failed to load initial app data:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Theme Toggler
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.setAttribute('data-theme', newMode ? 'dark' : 'light');
  };

  // Handlers for Data Updates
  const handleSaveCustomer = async (data: Omit<Customer, 'id' | 'createdAt' | 'status' | 'lastContact'>) => {
    const newCust = await apiService.addCustomer(data);
    setCustomers(prev => [newCust, ...prev]);
    addToast('success', 'Customer Added', `Successfully added target customer ${newCust.name} (${newCust.company})`);
  };

  const handleBulkImport = async (data: Array<Omit<Customer, 'id' | 'createdAt' | 'status' | 'lastContact'>>) => {
    const imported = await apiService.importCustomersBulk(data);
    setCustomers(prev => [...imported, ...prev]);
    addToast('success', 'CSV Import Complete', `Imported ${imported.length} new customer contacts successfully.`);
  };

  const handleDeleteCustomer = async (id: string) => {
    await apiService.deleteCustomer(id);
    setCustomers(prev => prev.filter(c => c.id !== id));
    addToast('info', 'Customer Deleted', 'Customer record was removed.');
  };

  const handleSaveEmail = async (draft: EmailDraft) => {
    const saved = await apiService.saveEmailDraft(draft);
    setEmails(prev => {
      const idx = prev.findIndex(e => e.id === saved.id);
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx] = saved;
        return copy;
      }
      return [saved, ...prev];
    });
    const updatedCusts = await apiService.getCustomers();
    setCustomers(updatedCusts);
    addToast('success', 'Email Saved', `Personalized email draft saved for ${draft.customerName}`);
  };

  const handleApproveEmail = async (id: string) => {
    const approved = await apiService.approveEmail(id);
    setEmails(prev => prev.map(e => e.id === id ? approved : e));
    const updatedCusts = await apiService.getCustomers();
    setCustomers(updatedCusts);
    addToast('success', 'Email Approved', `Email approved for ${approved.customerName}.`);
  };

  const handleSendEmail = async (id: string) => {
    const sent = await apiService.sendEmail(id);
    setEmails(prev => prev.map(e => e.id === id ? sent : e));
    const updatedCusts = await apiService.getCustomers();
    setCustomers(updatedCusts);
    addToast('success', 'Outreach Sent', `Personalized email dispatched to ${sent.customerEmail}`);
  };

  const handleCampaignCreated = async (newCamp: Campaign, newDrafts: EmailDraft[]) => {
    setCampaigns(prev => [newCamp, ...prev]);
    for (const d of newDrafts) {
      await apiService.saveEmailDraft(d);
    }
    await loadData();
    addToast('success', 'Campaign Created', `Campaign "${newCamp.name}" launched with ${newCamp.totalTargeted} personalized emails!`);
  };

  const handleSaveSettings = async (newSettings: UserSettings) => {
    await apiService.saveSettings(newSettings);
    setSettings(newSettings);
    addToast('success', 'Settings Saved', 'System configuration updated successfully.');
  };

  const pendingReviewsCount = emails.filter(e => e.status === 'Draft').length;
  const unreadRepliesCount = replies.filter(r => r.status.includes('Reply Received')).length;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      {/* Sidebar Navigation */}
      <Sidebar
        currentRoute={currentRoute}
        onNavigate={setCurrentRoute}
        pendingReviewsCount={pendingReviewsCount}
        unreadRepliesCount={unreadRepliesCount}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div style={{
        flex: 1,
        marginLeft: '260px',
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0
      }} className="main-content-layout">
        {/* Top Header Bar */}
        <Header
          currentRoute={currentRoute}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onQuickGenerate={() => {
            if (customers.length > 0) {
              setSelectedGeneratorCustomer(customers[0]);
            } else {
              setIsAddCustomerOpen(true);
            }
          }}
          onQuickAddCustomer={() => setIsAddCustomerOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
        />

        {/* Dynamic Page Views */}
        <main style={{ padding: '1.5rem', flex: 1 }}>
          {currentRoute === 'dashboard' && analytics && (
            <DashboardPage
              customers={customers}
              emails={emails}
              campaigns={campaigns}
              replies={replies}
              analytics={analytics}
              onNavigate={setCurrentRoute}
              onOpenGenerator={(cust) => setSelectedGeneratorCustomer(cust || customers[0] || null)}
              onOpenAddCustomer={() => setIsAddCustomerOpen(true)}
              onOpenCSVImport={() => setIsCSVImportOpen(true)}
              onOpenCampaignWizard={() => setIsCampaignWizardOpen(true)}
            />
          )}

          {currentRoute === 'customers' && (
            <CustomersPage
              customers={customers}
              searchQuery={searchQuery}
              onOpenAddCustomer={() => setIsAddCustomerOpen(true)}
              onOpenCSVImport={() => setIsCSVImportOpen(true)}
              onSelectCustomerDetail={(cust) => setSelectedCustomerDetail(cust)}
              onGenerateEmailForCustomer={(cust) => setSelectedGeneratorCustomer(cust)}
              onDeleteCustomer={handleDeleteCustomer}
            />
          )}

          {currentRoute === 'campaigns' && (
            <CampaignsPage
              campaigns={campaigns}
              onOpenCampaignWizard={() => setIsCampaignWizardOpen(true)}
            />
          )}

          {currentRoute === 'emails' && (
            <EmailsPage
              emails={emails}
              customers={customers}
              onApproveEmail={handleApproveEmail}
              onSendEmail={handleSendEmail}
              onOpenGeneratorForCustomer={(cust) => setSelectedGeneratorCustomer(cust)}
            />
          )}

          {currentRoute === 'replies' && (
            <RepliesPage
              replies={replies}
              onSendResponse={() => {
                addToast('success', 'Response Sent', 'Custom reply sent to prospect.');
              }}
            />
          )}

          {currentRoute === 'follow-ups' && (
            <FollowUpsPage replies={replies} />
          )}

          {currentRoute === 'analytics' && analytics && (
            <AnalyticsPage analytics={analytics} />
          )}

          {currentRoute === 'settings' && settings && (
            <SettingsPage settings={settings} onSaveSettings={handleSaveSettings} />
          )}
        </main>
      </div>

      {/* Global Modals & Drawers */}
      <CustomerFormModal
        isOpen={isAddCustomerOpen}
        onClose={() => setIsAddCustomerOpen(false)}
        onSave={handleSaveCustomer}
      />

      <CSVUploaderModal
        isOpen={isCSVImportOpen}
        onClose={() => setIsCSVImportOpen(false)}
        onImportSuccess={handleBulkImport}
      />

      <CustomerDetailDrawer
        customer={selectedCustomerDetail}
        onClose={() => setSelectedCustomerDetail(null)}
        onGenerateEmail={(cust) => setSelectedGeneratorCustomer(cust)}
        onDeleteCustomer={handleDeleteCustomer}
      />

      <AIEmailGeneratorModal
        isOpen={Boolean(selectedGeneratorCustomer)}
        customer={selectedGeneratorCustomer}
        onClose={() => setSelectedGeneratorCustomer(null)}
        onSaveEmail={handleSaveEmail}
        onApproveAndSend={(draft) => {
          handleSaveEmail(draft);
          if (draft.id) handleSendEmail(draft.id);
        }}
      />

      <CampaignWizardModal
        isOpen={isCampaignWizardOpen}
        onClose={() => setIsCampaignWizardOpen(false)}
        customers={customers}
        onCampaignCreated={handleCampaignCreated}
      />

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
};

export default App;
