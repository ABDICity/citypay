import React from 'react';
import { 
  Bell, 
  X, 
  Check, 
  Trash2, 
  CheckCircle2, 
  ShieldAlert, 
  Sparkles, 
  ArrowUpRight,
  Volume2,
  VolumeX
} from 'lucide-react';
import { PushNotification, Language } from '../types';
import { translations } from '../utils/translations';
import { sounds } from '../utils/soundEffects';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: PushNotification[];
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  currentLang: Language;
  pushEnabled: boolean;
  onTogglePush: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onClearAll,
  currentLang,
  pushEnabled,
  onTogglePush,
}) => {
  const t = translations[currentLang];
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-md flex justify-end">
      <div className="w-full max-w-md bg-white dark:bg-[#121215] h-full shadow-2xl border-l border-slate-200 dark:border-white/[0.08] flex flex-col animate-slide-left">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-white/[0.08] flex items-center justify-between bg-slate-50 dark:bg-[#16161A]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {t.notifications.title}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {notifications.length} notifikasi tersimpan
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Push Settings Quick Bar */}
        <div className="p-3 bg-emerald-50 dark:bg-[#16161A] border-b border-emerald-200 dark:border-white/[0.08] flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 font-medium text-emerald-900 dark:text-emerald-300">
            {pushEnabled ? <Volume2 className="w-4 h-4 text-emerald-500" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            {pushEnabled ? t.notifications.pushEnabled : t.notifications.pushDisabled}
          </span>
          <button
            onClick={() => {
              sounds.playClick();
              onTogglePush();
            }}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all hover:scale-105 ${
              pushEnabled 
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs' 
                : 'bg-slate-200 dark:bg-white/[0.06] text-slate-700 dark:text-slate-300'
            }`}
          >
            {pushEnabled ? 'Aktif' : 'Mute'}
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-16 text-slate-400 space-y-2">
              <Bell className="w-10 h-10 mx-auto stroke-1 text-slate-300 dark:text-slate-700" />
              <p className="text-xs">{t.notifications.noNotifications}</p>
            </div>
          ) : (
            notifications.map((n) => {
              let Icon = Bell;
              let bgIcon = 'bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20';

              if (n.type === 'TRANSACTION') {
                Icon = ArrowUpRight;
                bgIcon = 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20';
              } else if (n.type === 'SECURITY') {
                Icon = ShieldAlert;
                bgIcon = 'bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20';
              } else if (n.type === 'SHARIA_ALERT') {
                Icon = CheckCircle2;
                bgIcon = 'bg-purple-100 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20';
              }

              return (
                <div
                  key={n.id}
                  className={`p-3 rounded-xl border transition-all ${
                    n.read
                      ? 'bg-white dark:bg-[#16161A] border-slate-200 dark:border-white/[0.06] opacity-75'
                      : 'bg-slate-50 dark:bg-[#16161A] border-emerald-300 dark:border-emerald-500/40 shadow-xs'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg ${bgIcon} border flex items-center justify-center shrink-0`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {n.title}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 shrink-0">
                          {n.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug">
                        {n.message}
                      </p>
                      {n.voucherCode && (
                        <div className="mt-2 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 border border-transparent dark:border-emerald-500/20 px-2 py-0.5 rounded inline-block">
                          {n.voucherCode}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer controls */}
        <div className="p-3 border-t border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#16161A] flex items-center justify-between text-xs">
          <button
            onClick={() => {
              sounds.playClick();
              onMarkAllAsRead();
            }}
            disabled={notifications.length === 0}
            className="flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors disabled:opacity-40"
          >
            <Check className="w-3.5 h-3.5" />
            <span>{t.actions.markAsRead}</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onClearAll();
            }}
            disabled={notifications.length === 0}
            className="flex items-center gap-1 text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 transition-colors disabled:opacity-40"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t.actions.clearAll}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
