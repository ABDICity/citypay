import React, { useEffect } from 'react';
import { 
  LayoutDashboard, 
  Ticket, 
  ShieldAlert, 
  Building2, 
  FileText, 
  Smartphone, 
  Sparkles, 
  FileSpreadsheet,
  CheckCircle2, 
  Lock, 
  Layers, 
  Settings, 
  Layout,
  X,
  ShieldCheck,
  HeartHandshake
} from 'lucide-react';
import { Language, NavigationTab } from '../types';
import { translations } from '../utils/translations';
import { sounds } from '../utils/soundEffects';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  activeTab: NavigationTab | string;
  onTabChange?: (tab: string) => void;
  onSelectTab?: (tab: NavigationTab) => void;
  vouchersCount?: number;
  activeVoucherCount?: number;
  auditLogCount?: number;
  onOpenWebsiteEditor?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  currentLang,
  activeTab,
  onTabChange,
  onSelectTab,
  vouchersCount,
  activeVoucherCount,
  onOpenWebsiteEditor,
}) => {
  const t = translations[currentLang];
  const count = activeVoucherCount ?? vouchersCount ?? 0;

  // Handle ESC key to close hidden menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        sounds.playClick();
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleSelect = (tab: string) => {
    sounds.playClick();
    if (onSelectTab) {
      onSelectTab(tab as NavigationTab);
    } else if (onTabChange) {
      onTabChange(tab);
    }
    onClose();
  };

  const navItems = [
    {
      id: 'dashboard',
      label: t.nav.dashboard,
      icon: LayoutDashboard,
      badge: 'LIVE',
      badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
    },
    {
      id: 'content',
      label: t.nav.content || 'Konten & Form',
      icon: Layers,
      badge: 'CMS',
      badgeColor: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20',
    },
    {
      id: 'vouchers',
      label: t.nav.vouchers,
      icon: Ticket,
      badge: `${count}`,
      badgeColor: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20',
    },
    {
      id: 'security',
      label: t.nav.security,
      icon: ShieldAlert,
      badge: 'AES-256',
      badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
    },
    {
      id: 'banking_api',
      label: t.nav.bankingApi,
      icon: Building2,
      badge: 'SNAP-BI',
      badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20',
    },
    {
      id: 'audit_log',
      label: t.nav.auditLog,
      icon: FileText,
      badge: 'DSN-MUI',
      badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20',
    },
    {
      id: 'mobile_wallet',
      label: t.nav.mobileWallet,
      icon: Smartphone,
      badge: 'POS',
      badgeColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20',
    },
    {
      id: 'masjid_pay',
      label: t.nav.masjidPay || 'Smart MasjidPay',
      icon: HeartHandshake,
      badge: 'INFAQ',
      badgeColor: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30',
    },
    {
      id: 'ai_advisor',
      label: t.nav.aiAdvisor,
      icon: Sparkles,
      badge: 'AI Sharia',
      badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
    },
    {
      id: 'settings',
      label: t.nav.settings,
      icon: Settings,
      badge: 'CONFIG',
      badgeColor: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex" id="hidden-sidebar-modal-root">
      {/* Dark backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={() => {
          sounds.playClick();
          onClose();
        }}
        aria-hidden="true"
      />

      {/* Slide-in Menu Drawer (Matching user's screenshot) */}
      <aside 
        id="hidden-sidebar-drawer"
        className="relative z-10 w-80 max-w-[88vw] h-full bg-white dark:bg-[#0D0D10] border-r border-slate-200 dark:border-white/[0.08] p-4 flex flex-col justify-between overflow-y-auto shadow-2xl animate-in slide-in-from-left duration-200"
      >
        <div className="space-y-4">
          
          {/* Drawer Top Bar with Brand & Close Button */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/[0.08]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-sm shadow-emerald-500/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-sm text-slate-900 dark:text-white tracking-tight">
                  IslamiCity<span className="text-emerald-500 font-extrabold">Pay</span>
                </span>
                <span className="block text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  DSN-MUI Syariah Hub
                </span>
              </div>
            </div>

            <button
              id="sidebar-drawer-close-btn"
              type="button"
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#16161A] border border-transparent hover:border-slate-200 dark:hover:border-white/[0.08] transition-colors"
              title="Tutup Menu Navigasi"
              aria-label="Tutup Menu Navigasi"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Section Header: INFRASTRUKTUR PLATFORM */}
          <div className="flex items-center justify-between px-2 pt-1">
            <span className="text-[11px] font-extrabold tracking-wider text-slate-400 dark:text-slate-500 uppercase font-mono">
              INFRASTRUKTUR PLATFORM
            </span>
            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              9 Modul
            </span>
          </div>

          {/* Navigation Items (Exact match with user image) */}
          <nav className="flex flex-col gap-1.5 w-full">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id || (item.id === 'banking_api' && activeTab === 'bankingApi') || (item.id === 'audit_log' && activeTab === 'auditLog') || (item.id === 'mobile_wallet' && activeTab === 'mobileWallet') || (item.id === 'ai_advisor' && activeTab === 'aiAdvisor');
              
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => handleSelect(item.id)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25 scale-[1.01]'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#16161A] hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`ml-2 px-2 py-0.5 rounded-md text-[10px] font-mono font-medium ${
                        isActive ? 'bg-emerald-700/80 text-white' : item.badgeColor
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

        </div>

        {/* Bottom Section in Hidden Menu */}
        <div className="pt-4 border-t border-slate-100 dark:border-white/[0.08] space-y-3">
          
          {/* Visual Website Editor Banner in Sidebar */}
          {onOpenWebsiteEditor && (
            <button
              id="sidebar-go-to-editor-btn"
              onClick={() => {
                sounds.playClick();
                onOpenWebsiteEditor();
                onClose();
              }}
              className="w-full p-3 rounded-xl bg-gradient-to-br from-emerald-600/20 via-teal-600/10 to-indigo-600/20 hover:from-emerald-600/30 hover:to-indigo-600/30 border border-emerald-500/30 text-left transition-all group shadow-xs"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <Layout className="w-3.5 h-3.5 text-emerald-500 group-hover:scale-110 transition-transform" />
                  Go to Editor
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500 text-white font-mono">
                  BERANDA
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                Edit visual website dengan kanvas drag-and-drop & live preview.
              </p>
            </button>
          )}

          {/* Sharia Status Footer Widget */}
          <div className="bg-slate-50 dark:bg-[#121215] rounded-xl p-3 border border-slate-200 dark:border-white/[0.06] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Dewan Syariah
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)] animate-pulse" />
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
              Akad: Wakalah & Mudharabah sesuai Fatwa DSN-MUI No. 116 & 131.
            </p>
            <div className="pt-2 border-t border-slate-200 dark:border-white/[0.06] flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1 font-mono text-[9px]">
                <Lock className="w-2.5 h-2.5 text-emerald-500" /> AES-256-GCM
              </span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">100% Klop</span>
            </div>
          </div>

          {/* Close Menu Button */}
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-white/[0.08] hover:bg-slate-100 dark:hover:bg-[#16161A] text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center justify-center gap-2 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span>Tutup Menu</span>
          </button>

        </div>

      </aside>
    </div>
  );
};


