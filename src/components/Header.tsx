import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Bell, 
  Moon, 
  Sun, 
  Globe, 
  Lock, 
  Sparkles, 
  Plus, 
  DownloadCloud, 
  Search, 
  CheckCircle2, 
  Cpu,
  Smartphone,
  Layout,
  MoreVertical,
  HeartHandshake
} from 'lucide-react';
import { Language, PushNotification, SecurityStatus } from '../types';
import { translations } from '../utils/translations';
import { sounds } from '../utils/soundEffects';

interface HeaderProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  notifications: PushNotification[];
  onOpenNotifications: () => void;
  securityStatus: SecurityStatus;
  onOpen2FaModal: () => void;
  onOpenIssueModal: () => void;
  onOpenExportModal?: () => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onOpenWebsiteEditor?: () => void;
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  isDarkMode,
  onToggleDarkMode,
  notifications,
  onOpenNotifications,
  securityStatus,
  onOpen2FaModal,
  onOpenIssueModal,
  onOpenExportModal,
  searchQuery = '',
  onSearchChange,
  activeTab = 'dashboard',
  onTabChange,
  onOpenWebsiteEditor,
  onToggleSidebar,
  isSidebarOpen = false,
}) => {
  const t = translations[currentLang];
  const unreadCount = notifications.filter(n => !n.read).length;
  const isRtl = currentLang === 'ar';

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#0D0D10]/95 backdrop-blur-md border-b border-slate-200 dark:border-white/[0.08] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Menu Toggle Button (Titik 3) & Logo & Platform Title */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Menu Icon Titik 3 */}
            <button
              id="header-menu-dots-btn"
              type="button"
              onClick={() => {
                sounds.playClick();
                onToggleSidebar?.();
              }}
              className={`p-2 rounded-xl border transition-all flex items-center justify-center ${
                isSidebarOpen
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/25'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#16161A] border-slate-200 dark:border-white/[0.08] hover:border-emerald-500/40 hover:text-emerald-600 dark:hover:text-emerald-400'
              }`}
              title="Buka Menu Navigasi (Icon Titik 3)"
              aria-label="Buka Menu Navigasi (Icon Titik 3)"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            <div 
              id="header-brand-logo"
              className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 cursor-pointer transition-transform hover:scale-105"
              onClick={() => onTabChange?.('dashboard')}
            >
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">
                  IslamiCity<span className="text-emerald-500 dark:text-emerald-400 font-extrabold">Pay</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-500" />
                  DSN-MUI Certified
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden md:block font-medium">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-md hidden lg:block">
            <div className="relative">
              <Search className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 ${isRtl ? 'right-3' : 'left-3'}`} />
              <input
                id="global-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
                placeholder={t.searchPlaceholder}
                className={`w-full bg-slate-100 dark:bg-[#16161A] text-slate-900 dark:text-slate-100 text-xs rounded-xl py-2 ${
                  isRtl ? 'pr-9 pl-4' : 'pl-9 pr-4'
                } border border-slate-200 dark:border-white/[0.08] focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/40 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500`}
              />
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Smart MasjidPay Quick Access Button */}
            <button
              id="header-smart-masjidpay-btn"
              onClick={() => {
                sounds.playClick();
                onTabChange?.('masjid_pay');
              }}
              title="Buka Smart MasjidPay"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all hover:scale-[1.02] ${
                activeTab === 'masjid_pay'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/25 ring-2 ring-emerald-500/40'
                  : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25'
              }`}
            >
              <HeartHandshake className="w-3.5 h-3.5 text-emerald-500" />
              <span className="hidden sm:inline">Smart MasjidPay</span>
            </button>

            {/* Go to Editor Button */}
            {onOpenWebsiteEditor && (
              <button
                id="header-go-to-editor-btn"
                onClick={() => {
                  sounds.playClick();
                  onOpenWebsiteEditor();
                }}
                title="Edit homepage with drag-and-drop visual builder"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-sm shadow-emerald-600/20 transition-all hover:scale-[1.02]"
              >
                <Layout className="w-3.5 h-3.5" />
                <span>Go to Editor</span>
              </button>
            )}

            {/* Quick Action: Issue Voucher */}
            <button
              id="header-issue-voucher-btn"
              onClick={() => {
                sounds.playClick();
                onOpenIssueModal();
              }}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm shadow-emerald-600/20 transition-all hover:scale-[1.02]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.actions.issueVoucher}</span>
            </button>

            {/* Quick Action: Export Report */}
            <button
              id="header-export-report-btn"
              onClick={() => {
                sounds.playClick();
                onOpenExportModal();
              }}
              className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-[#16161A] dark:hover:bg-[#202026] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/[0.08] transition-colors"
            >
              <DownloadCloud className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{t.actions.exportReport}</span>
            </button>

            {/* 2FA Security Pill Indicator */}
            <button
              id="header-2fa-status-btn"
              onClick={() => {
                sounds.playClick();
                onOpen2FaModal();
              }}
              title="Two-Factor Authentication & Cryptographic Keys"
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                securityStatus.twoFactorEnabled 
                  ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30' 
                  : 'bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400 dark:border-amber-500/30'
              }`}
            >
              <Lock className="w-3 h-3" />
              <span className="hidden sm:inline">2FA:</span>
              <span className="font-bold">{securityStatus.twoFactorEnabled ? 'ON' : 'OFF'}</span>
            </button>

            {/* Language Switcher */}
            <div className="relative group">
              <button 
                id="header-lang-btn"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1A1A20] border border-slate-200 dark:border-white/[0.08] transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span className="uppercase font-bold">{currentLang}</span>
              </button>
              <div className={`absolute ${isRtl ? 'left-0' : 'right-0'} mt-1.5 w-36 bg-white dark:bg-[#16161A] rounded-xl shadow-2xl border border-slate-200 dark:border-white/[0.1] py-1 hidden group-hover:block group-focus-within:block z-50`}>
                <button
                  onClick={() => {
                    sounds.playClick();
                    onLanguageChange('id');
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-100 dark:hover:bg-white/[0.06] ${currentLang === 'id' ? 'font-bold text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}
                >
                  <span>Bahasa Indonesia</span>
                  <span>🇮🇩</span>
                </button>
                <button
                  onClick={() => {
                    sounds.playClick();
                    onLanguageChange('en');
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-100 dark:hover:bg-white/[0.06] ${currentLang === 'en' ? 'font-bold text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}
                >
                  <span>English (Global)</span>
                  <span>🇬🇧</span>
                </button>
                <button
                  onClick={() => {
                    sounds.playClick();
                    onLanguageChange('ar');
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-100 dark:hover:bg-white/[0.06] font-arabic ${currentLang === 'ar' ? 'font-bold text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}
                >
                  <span>العربية (Syariah)</span>
                  <span>🇸🇦</span>
                </button>
              </div>
            </div>

            {/* Dark / Light Toggle */}
            <button
              id="header-theme-toggle-btn"
              onClick={() => {
                sounds.playClick();
                onToggleDarkMode();
              }}
              title="Toggle Dark / Light Mode"
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1A1A20] border border-slate-200 dark:border-white/[0.08] transition-colors"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Notification Bell */}
            <button
              id="header-notification-btn"
              onClick={() => {
                sounds.playClick();
                onOpenNotifications();
              }}
              className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1A1A20] border border-slate-200 dark:border-white/[0.08] transition-colors"
              title="Push Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse shadow-sm shadow-emerald-500/50">
                  {unreadCount}
                </span>
              )}
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};
