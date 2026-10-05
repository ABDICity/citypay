import React, { useState, useEffect } from 'react';
import { MoreVertical, CheckCircle2 } from 'lucide-react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { TwoFactorModal } from './components/TwoFactorModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { VoucherDetailModal } from './components/VoucherDetailModal';
import { IssueVoucherModal } from './components/IssueVoucherModal';
import { RedeemVoucherModal } from './components/RedeemVoucherModal';
import { ExportReportModal } from './components/ExportReportModal';
import { VisualWebsiteEditorModal } from './components/modals/VisualWebsiteEditorModal';

// Tab Views
import { DashboardTab } from './components/tabs/DashboardTab';
import { ContentManagementTab } from './components/tabs/ContentManagementTab';
import { VouchersTab } from './components/tabs/VouchersTab';
import { SecurityTab } from './components/tabs/SecurityTab';
import { BankingApiTab } from './components/tabs/BankingApiTab';
import { AuditLogTab } from './components/tabs/AuditLogTab';
import { MobileWalletTab } from './components/tabs/MobileWalletTab';
import { AiAdvisorTab } from './components/tabs/AiAdvisorTab';
import { SmartMasjidPayRemix } from './components/tabs/SmartMasjidPayRemix';
import { SettingsTab } from './components/tabs/SettingsTab';

import { 
  Voucher, 
  Transaction, 
  AuditLog, 
  PushNotification, 
  SecurityStatus, 
  NavigationTab,
  RecurringVoucherSchedule
} from './types';
import { 
  initialVouchers, 
  initialTransactions, 
  initialAuditLogs, 
  initialNotifications, 
  initialSecurityStatus,
  initialRecurringSchedules
} from './utils/mockData';
import { sounds } from './utils/soundEffects';

export default function App() {
  // Theme & Language State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [currentLang, setCurrentLang] = useState<'id' | 'en' | 'ar'>('id');

  // Navigation State
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');

  // Core Business Ledger State
  const [vouchers, setVouchers] = useState<Voucher[]>(initialVouchers);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);
  const [notifications, setNotifications] = useState<PushNotification[]>(initialNotifications);
  const [securityStatus, setSecurityStatus] = useState<SecurityStatus>(initialSecurityStatus);
  const [recurringSchedules, setRecurringSchedules] = useState<RecurringVoucherSchedule[]>(initialRecurringSchedules);

  // Modal Control State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [is2FaModalOpen, setIs2FaModalOpen] = useState(false);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [isRedeemModalOpen, setIsRedeemModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isWebsiteEditorOpen, setIsWebsiteEditorOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedVoucherForDetail, setSelectedVoucherForDetail] = useState<Voucher | null>(null);
  const [selectedVoucherForRedeem, setSelectedVoucherForRedeem] = useState<Voucher | null>(null);

  const tabTitles: Record<string, string> = {
    dashboard: 'Analitik Real-Time',
    content: 'Konten & Formulir (CMS)',
    vouchers: 'Kelola Voucher',
    security: 'Keamanan & Enkripsi',
    banking_api: 'Gateway API Syariah',
    bankingApi: 'Gateway API Syariah',
    audit_log: 'Audit Log & Regulasi',
    auditLog: 'Audit Log & Regulasi',
    mobile_wallet: 'Dompet Digital Mobile',
    mobileWallet: 'Dompet Digital Mobile',
    ai_advisor: 'AI Sharia & Anomali',
    aiAdvisor: 'AI Sharia & Anomali',
    masjid_pay: 'Smart MasjidPay',
    masjidPay: 'Smart MasjidPay',
    settings: 'Pengaturan & Kustomisasi'
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Sync Dark Mode class with HTML document element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Sync RTL for Arabic language
  useEffect(() => {
    if (currentLang === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
    }
  }, [currentLang]);

  // Handle Voucher Issuance
  const handleIssueVoucher = (newVoucher: Voucher) => {
    setVouchers(prev => [newVoucher, ...prev]);

    // Create Audit Log
    const newLog: AuditLog = {
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      category: 'TRANSACTION',
      action: `Penerbitan Voucher Syariah: ${newVoucher.code} (${newVoucher.title})`,
      actor: 'Admin Lazis / Sharia Officer',
      role: 'Super Admin',
      ipAddress: '103.144.172.58',
      severity: 'AUDIT_SEALED',
      payloadHash: newVoucher.encryptedHash,
      notes: `Voucher senilai Rp ${newVoucher.faceValue.toLocaleString('id-ID')} diterbitkan dengan akad ${newVoucher.shariaContract}.`,
      dsnMuiCompliance: true,
    };
    setAuditLogs(prev => [newLog, ...prev]);

    // Create Notification
    const newNotif: PushNotification = {
      id: `notif-${Date.now()}`,
      title: 'Voucher Baru Diterbitkan',
      message: `Voucher ${newVoucher.code} (${newVoucher.title}) berhasil diterbitkan dan disegel digital.`,
      timestamp: 'Baru saja',
      type: 'TRANSACTION',
      read: false,
      voucherCode: newVoucher.code,
      amount: newVoucher.faceValue,
    };
    setNotifications(prev => [newNotif, ...prev]);
    sounds.playNotification();
  };

  // Handle Voucher Redemption
  const handleRedeemSuccess = (transaction: Transaction, updatedVoucher: Voucher) => {
    // Update voucher in list
    setVouchers(prev => prev.map(v => v.id === updatedVoucher.id ? updatedVoucher : v));
    // Prepend transaction
    setTransactions(prev => [transaction, ...prev]);

    // Create Audit Log
    const newLog: AuditLog = {
      id: `AUD-${Date.now()}`,
      timestamp: transaction.timestamp,
      category: 'TRANSACTION',
      action: `Penebusan Voucher: ${transaction.voucherCode} sebesar Rp ${transaction.amount.toLocaleString('id-ID')}`,
      actor: transaction.merchantName,
      role: 'Merchant POS',
      ipAddress: transaction.ipAddress || '103.144.172.58',
      severity: 'AUDIT_SEALED',
      payloadHash: transaction.endToEndHash,
      notes: `Penyelesaian real-time via ${transaction.bankChannel} (Audit ID: ${transaction.shariaAuditId}).`,
      dsnMuiCompliance: true,
    };
    setAuditLogs(prev => [newLog, ...prev]);

    // Notification
    const newNotif: PushNotification = {
      id: `notif-${Date.now()}`,
      title: 'Penebusan Voucher Berhasil',
      message: `Voucher ${transaction.voucherCode} senilai Rp ${transaction.amount.toLocaleString('id-ID')} berhasil ditebus di ${transaction.merchantName}.`,
      timestamp: 'Baru saja',
      type: 'TRANSACTION',
      read: false,
      voucherCode: transaction.voucherCode,
      amount: transaction.amount,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Notification actions
  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    sounds.playClick();
  };

  const handleClearAllNotifs = () => {
    setNotifications([]);
    sounds.playClick();
  };

  // Recurring Schedule Management Handlers
  const handleSaveRecurringSchedule = (schedule: RecurringVoucherSchedule, shouldIssueNow: boolean) => {
    setRecurringSchedules(prev => [schedule, ...prev]);

    if (shouldIssueNow) {
      const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const code = `ICP-REC-${randomNum}-${randomHex}`;

      const newVoucher: Voucher = {
        id: `vch-${Date.now()}`,
        code,
        title: `${schedule.programTitle} (Siklus #${schedule.cyclesCompleted || 1})`,
        category: schedule.category,
        shariaContract: schedule.shariaContract,
        faceValue: schedule.amountPerVoucher,
        remainingBalance: schedule.amountPerVoucher,
        currency: 'IDR',
        status: 'ACTIVE',
        issuedDate: new Date().toISOString().split('T')[0],
        expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        beneficiaryName: `${schedule.beneficiaryGroup} (#${Math.floor(100 + Math.random() * 900)})`,
        beneficiaryPhone: '+6281299887766',
        beneficiaryEmail: 'mustahiq.baznas@islamicitypay.org',
        merchantsAllowed: ['Halal Mart Madani Syariah', 'Sentra Ternak Qurban BAZNAS', 'Toko Perlengkapan Haji Madinah'],
        encryptedHash: '7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b',
        digitalSignature: 'SIG_DSN_MUI_2026_RECURRING_AUTO_OK',
        qrPayload: `ISLAMICITYPAY://VOUCHER?CODE=${code}&AUTH=SHA256`,
        pinRequired: false,
        securityLevel: 'AES-256-GCM',
        totalUsageCount: 0,
        maxUsageCount: 1,
        description: schedule.description,
        terms: 'Voucher hasil penerbitan berkala program zakat dan bantuan kemanusiaan DSN-MUI.',
      };

      handleIssueVoucher(newVoucher);
    }

    showToast(`Jadwal "${schedule.programTitle}" berhasil diaktifkan!`);
  };

  const handleToggleScheduleStatus = (id: string) => {
    setRecurringSchedules(prev => prev.map(s => {
      if (s.id === id) {
        const nextStatus = s.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
        sounds.playToggle();
        showToast(`Jadwal "${s.programTitle}" diubah ke status ${nextStatus === 'ACTIVE' ? 'Aktif' : 'Dijeda'}.`);
        return { ...s, status: nextStatus };
      }
      return s;
    }));
  };

  const handleExecuteScheduleNow = (schedule: RecurringVoucherSchedule) => {
    sounds.playSuccess();
    const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const code = `ICP-REC-${randomNum}-${randomHex}`;

    const newVoucher: Voucher = {
      id: `vch-${Date.now()}`,
      code,
      title: `${schedule.programTitle} (Eksekusi Siklus #${schedule.cyclesCompleted + 1})`,
      category: schedule.category,
      shariaContract: schedule.shariaContract,
      faceValue: schedule.amountPerVoucher,
      remainingBalance: schedule.amountPerVoucher,
      currency: 'IDR',
      status: 'ACTIVE',
      issuedDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      beneficiaryName: `${schedule.beneficiaryGroup} (#${Math.floor(100 + Math.random() * 900)})`,
      beneficiaryPhone: '+6281299887766',
      beneficiaryEmail: 'mustahiq.baznas@islamicitypay.org',
      merchantsAllowed: ['Halal Mart Madani Syariah', 'Sentra Ternak Qurban BAZNAS', 'Toko Perlengkapan Haji Madinah'],
      encryptedHash: '7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b',
      digitalSignature: 'SIG_DSN_MUI_2026_RECURRING_MANUAL_EXEC_OK',
      qrPayload: `ISLAMICITYPAY://VOUCHER?CODE=${code}&AUTH=SHA256`,
      pinRequired: false,
      securityLevel: 'AES-256-GCM',
      totalUsageCount: 0,
      maxUsageCount: 1,
      description: schedule.description,
      terms: 'Voucher hasil eksekusi langsung siklus penyaluran zakat/infaq berkala.',
    };

    handleIssueVoucher(newVoucher);

    setRecurringSchedules(prev => prev.map(s => {
      if (s.id === schedule.id) {
        return {
          ...s,
          cyclesCompleted: s.cyclesCompleted + 1,
          totalDisbursed: s.totalDisbursed + s.amountPerVoucher * s.recipientCount,
          lastExecutedDate: new Date().toISOString().split('T')[0],
        };
      }
      return s;
    }));

    showToast(`Siklus "${schedule.programTitle}" dieksekusi! Voucher ${code} diterbitkan.`);
  };

  const handleDeleteSchedule = (id: string) => {
    sounds.playAlert();
    setRecurringSchedules(prev => prev.filter(s => s.id !== id));
    showToast('Jadwal voucher berulang berhasil dihapus.');
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#0A0A0B] text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200 selection:bg-emerald-500/30 selection:text-emerald-300">
      
      {/* Top Main Navigation Header */}
      <Header
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        securityStatus={securityStatus}
        onOpen2FaModal={() => {
          sounds.playClick();
          setIs2FaModalOpen(true);
        }}
        notifications={notifications}
        onOpenNotifications={() => {
          sounds.playClick();
          setIsNotificationOpen(true);
        }}
        onOpenIssueModal={() => {
          sounds.playClick();
          setIsIssueModalOpen(true);
        }}
        onOpenExportModal={() => {
          sounds.playClick();
          setIsExportModalOpen(true);
        }}
        onOpenWebsiteEditor={() => {
          sounds.playClick();
          setIsWebsiteEditorOpen(true);
        }}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => {
          sounds.playClick();
          setIsSidebarOpen(prev => !prev);
        }}
        activeTab={activeTab}
        onTabChange={(tab) => {
          sounds.playClick();
          setActiveTab(tab as NavigationTab);
        }}
      />

      {/* Hidden Navigation Menu Drawer (Opens via Garis 3 or Titik 3) */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeTab={activeTab}
        onSelectTab={(tab) => {
          sounds.playClick();
          setActiveTab(tab);
        }}
        currentLang={currentLang}
        activeVoucherCount={vouchers.filter(v => v.status === 'ACTIVE').length}
        auditLogCount={auditLogs.length}
        onOpenWebsiteEditor={() => {
          sounds.playClick();
          setIsWebsiteEditorOpen(true);
        }}
      />

      {/* Main Body Layout with Content Area */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto p-4 md:p-6 gap-6">

        {/* Tab Content Render Area (Full Width since Sidebar is now a hidden drawer) */}
        <main className="flex-1 min-w-0">
          
          {/* Quick Menu Opener & Breadcrumb */}
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 p-3 bg-white dark:bg-[#0D0D10] rounded-2xl border border-slate-200 dark:border-white/[0.08] shadow-xs">
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                id="content-open-menu-btn"
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setIsSidebarOpen(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-2 text-xs font-bold shadow-sm shadow-emerald-600/20 transition-all hover:scale-[1.02]"
                title="Buka Menu Navigasi (Icon Titik 3)"
              >
                <MoreVertical className="w-4 h-4" />
                <span>Buka Menu</span>
              </button>

              <div className="h-4 w-px bg-slate-200 dark:bg-white/[0.1] hidden sm:block" />

              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <span className="hidden sm:inline">Modul Aktif:</span>
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {tabTitles[activeTab] || activeTab}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono hidden md:inline">
                Klik icon titik 3 untuk memilih modul
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                DSN-MUI
              </span>
            </div>
          </div>
          
          {activeTab === 'dashboard' && (
            <DashboardTab
              currentLang={currentLang}
              vouchers={vouchers}
              transactions={transactions}
              securityStatus={securityStatus}
              onOpenIssueModal={() => setIsIssueModalOpen(true)}
              onOpenRedeemModal={() => {
                setSelectedVoucherForRedeem(null);
                setIsRedeemModalOpen(true);
              }}
              onOpenExportModal={() => setIsExportModalOpen(true)}
              onViewVoucherDetails={(v) => setSelectedVoucherForDetail(v)}
              onOpenSmartMasjidPay={() => {
                sounds.playClick();
                setActiveTab('masjid_pay');
              }}
            />
          )}

          {activeTab === 'content' && (
            <ContentManagementTab 
              currentLang={currentLang} 
              onOpenWebsiteEditor={() => {
                sounds.playClick();
                setIsWebsiteEditorOpen(true);
              }}
            />
          )}

          {activeTab === 'vouchers' && (
            <VouchersTab
              currentLang={currentLang}
              vouchers={vouchers}
              recurringSchedules={recurringSchedules}
              onOpenIssueModal={() => setIsIssueModalOpen(true)}
              onViewDetails={(v) => setSelectedVoucherForDetail(v)}
              onQuickRedeem={(v) => {
                setSelectedVoucherForRedeem(v);
                setIsRedeemModalOpen(true);
              }}
              onOpenExportModal={() => setIsExportModalOpen(true)}
              onShowToast={(msg) => showToast(msg)}
              onSaveSchedule={handleSaveRecurringSchedule}
              onToggleScheduleStatus={handleToggleScheduleStatus}
              onExecuteScheduleNow={handleExecuteScheduleNow}
              onDeleteSchedule={handleDeleteSchedule}
            />
          )}

          {activeTab === 'security' && (
            <SecurityTab
              currentLang={currentLang}
              securityStatus={securityStatus}
              onUpdateSecurityStatus={(updated) => setSecurityStatus(prev => ({ ...prev, ...updated }))}
              onOpen2FaModal={() => setIs2FaModalOpen(true)}
            />
          )}

          {activeTab === 'banking_api' && (
            <BankingApiTab currentLang={currentLang} />
          )}

          {activeTab === 'audit_log' && (
            <AuditLogTab
              currentLang={currentLang}
              auditLogs={auditLogs}
              onOpenExportModal={() => setIsExportModalOpen(true)}
            />
          )}

          {activeTab === 'mobile_wallet' && (
            <MobileWalletTab
              currentLang={currentLang}
              vouchers={vouchers}
              transactions={transactions}
              onOpenRedeemModal={(v) => {
                setSelectedVoucherForRedeem(v || null);
                setIsRedeemModalOpen(true);
              }}
              onViewDetails={(v) => setSelectedVoucherForDetail(v)}
              onOpenSmartMasjidPay={() => {
                sounds.playClick();
                setActiveTab('masjid_pay');
              }}
            />
          )}

          {activeTab === 'ai_advisor' && (
            <AiAdvisorTab
              currentLang={currentLang}
              vouchers={vouchers}
              transactions={transactions}
              onUpdateVoucher={(updated) => setVouchers(prev => prev.map(v => v.id === updated.id ? updated : v))}
              onShowToast={(msg) => showToast(msg)}
            />
          )}

          {activeTab === 'masjid_pay' && (
            <SmartMasjidPayRemix
              currentLang={currentLang}
              vouchers={vouchers}
              transactions={transactions}
              onAddTransaction={(newTx) => {
                setTransactions(prev => [newTx, ...prev]);
                setNotifications(prev => [
                  {
                    id: 'notif-' + Date.now(),
                    title: '🕌 Infaq Smart MasjidPay Diterima',
                    message: `Alhamdulillah! Infaq Rp ${(newTx.feeUjrah || 1500).toLocaleString('id-ID')} dari biaya admin transaksi berhasil disalurkan ke ${newTx.merchantName}.`,
                    type: 'TRANSACTION',
                    timestamp: new Date().toISOString(),
                    read: false,
                    amount: newTx.amount
                  },
                  ...prev
                ]);
              }}
              onShowToast={(msg) => showToast(msg)}
              onViewVoucherDetails={(v) => setSelectedVoucherForDetail(v)}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsTab
              currentLang={currentLang}
              onLanguageChange={setCurrentLang}
            />
          )}

        </main>

      </div>

      {/* Global Modals */}

      {/* 2FA Security Modal */}
      <TwoFactorModal
        isOpen={is2FaModalOpen}
        onClose={() => setIs2FaModalOpen(false)}
        currentLang={currentLang}
        securityStatus={securityStatus}
        onToggle2Fa={(enabled) => {
          setSecurityStatus(prev => ({ ...prev, twoFactorEnabled: enabled }));
        }}
      />

      {/* Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllRead}
        onClearAll={handleClearAllAllNotifs => handleClearAllNotifs()}
        onSelectNotification={(notif) => {
          setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
        }}
      />

      {/* Voucher Detail Modal */}
      <VoucherDetailModal
        voucher={selectedVoucherForDetail}
        isOpen={!!selectedVoucherForDetail}
        onClose={() => setSelectedVoucherForDetail(null)}
        currentLang={currentLang}
        onRedeemClick={(v) => {
          setSelectedVoucherForDetail(null);
          setSelectedVoucherForRedeem(v);
          setIsRedeemModalOpen(true);
        }}
      />

      {/* Issue Voucher Modal */}
      <IssueVoucherModal
        isOpen={isIssueModalOpen}
        onClose={() => setIsIssueModalOpen(false)}
        currentLang={currentLang}
        onIssueVoucher={handleIssueVoucher}
      />

      {/* Redeem Voucher Modal */}
      <RedeemVoucherModal
        voucher={selectedVoucherForRedeem}
        isOpen={isRedeemModalOpen}
        onClose={() => {
          setIsRedeemModalOpen(false);
          setSelectedVoucherForRedeem(null);
        }}
        currentLang={currentLang}
        securityStatus={securityStatus}
        allVouchers={vouchers}
        onRedeemSuccess={handleRedeemSuccess}
      />

      {/* Export Report Modal */}
      <ExportReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        currentLang={currentLang}
        vouchers={vouchers}
        transactions={transactions}
        auditLogs={auditLogs}
      />

      {/* Visual Drag & Drop Website Editor Modal */}
      <VisualWebsiteEditorModal
        isOpen={isWebsiteEditorOpen}
        onClose={() => setIsWebsiteEditorOpen(false)}
        currentLang={currentLang}
        onSaveToast={(msg) => showToast(msg)}
      />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-slate-900/95 dark:bg-emerald-950/90 text-white border border-emerald-500/40 shadow-2xl backdrop-blur-md flex items-center gap-3 animate-fade-in text-xs font-semibold max-w-md">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
          <span>{toastMessage}</span>
          <button 
            onClick={() => setToastMessage(null)}
            className="ml-auto text-slate-400 hover:text-white"
          >
            &times;
          </button>
        </div>
      )}

    </div>
  );
}
