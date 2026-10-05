import React, { useState } from 'react';
import { 
  QrCode, 
  ShieldCheck, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  Lock, 
  ArrowRight, 
  Coins, 
  Building, 
  Calendar,
  Eye
} from 'lucide-react';
import { Voucher, Language } from '../types';
import { translations } from '../utils/translations';
import { sounds } from '../utils/soundEffects';

interface VoucherCardProps {
  voucher: Voucher;
  currentLang: Language;
  onViewDetails: (v: Voucher) => void;
  onQuickRedeem: (v: Voucher) => void;
  onGenerateQr?: (v: Voucher) => void;
}

export const VoucherCard: React.FC<VoucherCardProps> = ({
  voucher,
  currentLang,
  onViewDetails,
  onQuickRedeem,
  onGenerateQr,
}) => {
  const t = translations[currentLang];
  const [copied, setCopied] = useState(false);

  const handleCopyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(voucher.code);
    setCopied(true);
    sounds.playClick();
    setTimeout(() => setCopied(false), 2000);
  };

  const percentageLeft = Math.round((voucher.remainingBalance / voucher.faceValue) * 100);

  // Category Theme Badges
  const getCategoryBadge = () => {
    switch (voucher.category) {
      case 'ziswaf':
        return { label: 'ZISWAF Berkah', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300' };
      case 'umrah_hajj':
        return { label: 'Umrah & Haji', color: 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300' };
      case 'halal_mart':
        return { label: 'Halal Mart', color: 'bg-teal-100 text-teal-800 dark:bg-teal-950/80 dark:text-teal-300 border-teal-300' };
      case 'islamic_education':
        return { label: 'Pendidikan Islami', color: 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border-blue-300' };
      case 'masjid_community':
        return { label: 'Wakaf Masjid', color: 'bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 border-purple-300' };
      case 'qurban_aqiqah':
        return { label: 'Qurban Berkah', color: 'bg-orange-100 text-orange-800 dark:bg-orange-950/80 dark:text-orange-300 border-orange-300' };
      default:
        return { label: 'Voucher Halal', color: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border-slate-300' };
    }
  };

  const categoryBadge = getCategoryBadge();

  const getStatusBadge = () => {
    switch (voucher.status) {
      case 'ACTIVE':
        return 'bg-emerald-500 text-white';
      case 'REDEEMED':
        return 'bg-slate-500 text-white';
      case 'EXPIRED':
        return 'bg-rose-500 text-white';
      case 'ALLOCATED':
        return 'bg-indigo-500 text-white';
      case 'FROZEN':
        return 'bg-amber-500 text-white';
      default:
        return 'bg-slate-500 text-white';
    }
  };

  return (
    <div 
      className="group relative bg-white dark:bg-[#121215] rounded-2xl border border-slate-200/90 dark:border-white/[0.08] shadow-sm hover:shadow-lg hover:border-emerald-500/40 dark:hover:border-emerald-500/40 transition-all overflow-hidden flex flex-col justify-between"
      id={`voucher-card-${voucher.id}`}
    >
      {/* Top Banner Pattern */}
      <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400" />

      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        
        {/* Header Badges */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${categoryBadge.color}`}>
              {categoryBadge.label}
            </span>
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase ${getStatusBadge()}`}>
              {voucher.status}
            </span>
          </div>

          <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {voucher.title}
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
            Akad: <span className="font-medium text-emerald-600 dark:text-emerald-400">{voucher.shariaContract}</span>
          </p>
        </div>

        {/* Voucher Value & Code */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.06] space-y-2">
          <div className="flex items-baseline justify-between">
            <span className="text-[11px] text-slate-400 font-medium">Saldo Voucher</span>
            <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
              Rp {voucher.remainingBalance.toLocaleString('id-ID')}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-200 dark:bg-white/[0.08] rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all"
              style={{ width: `${Math.max(percentageLeft, 5)}%` }}
            />
          </div>

          {/* Code Bar with Copy and Quick QR */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1 font-mono text-xs font-bold text-slate-800 dark:text-slate-200 tracking-wider">
              <span>{voucher.code}</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  sounds.playClick();
                  if (onGenerateQr) onGenerateQr(voucher);
                  else onViewDetails(voucher);
                }}
                className="p-1 rounded text-slate-400 hover:text-emerald-500 hover:bg-slate-200 dark:hover:bg-white/[0.08] transition-colors"
                title="Buka QR Contactless"
              >
                <QrCode className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleCopyCode}
                className="p-1 rounded text-slate-400 hover:text-emerald-500 hover:bg-slate-200 dark:hover:bg-white/[0.08] transition-colors"
                title="Copy Code"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Metadata items */}
        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
          <div className="flex items-center gap-1.5 truncate">
            <Building className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate">{voucher.beneficiaryName}</span>
          </div>
          <div className="flex items-center gap-1.5 justify-end">
            <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
            <span>Exp: {voucher.expiryDate}</span>
          </div>
        </div>

        {/* Security Hash & Signature Seal */}
        <div className="pt-2 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between text-[10px]">
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-mono font-medium">
            <Lock className="w-3 h-3" /> {voucher.securityLevel}
          </span>
          <span className="text-slate-400 font-mono text-[9px]">
            Hash: {voucher.encryptedHash.substring(0, 8)}...
          </span>
        </div>

      </div>

      {/* Action Footer */}
      <div className="px-4 py-2.5 bg-slate-50 dark:bg-[#16161A] border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between gap-2">
        <button
          onClick={() => {
            sounds.playClick();
            onViewDetails(voucher);
          }}
          className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/[0.08] rounded-xl transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Detail</span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            if (onGenerateQr) onGenerateQr(voucher);
            else onViewDetails(voucher);
          }}
          className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-xl transition-colors"
        >
          <QrCode className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>QR Code</span>
        </button>

        {voucher.status === 'ACTIVE' && (
          <button
            onClick={() => {
              sounds.playClick();
              onQuickRedeem(voucher);
            }}
            className="flex items-center justify-center gap-1 py-1.5 px-3 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-sm shadow-emerald-600/20 transition-all hover:scale-[1.02]"
          >
            <span>Tukar</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>

    </div>
  );
};
