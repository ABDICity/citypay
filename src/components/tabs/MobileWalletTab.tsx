import React, { useState } from 'react';
import { 
  Smartphone, 
  Wallet, 
  QrCode, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  History, 
  ShieldCheck, 
  Sparkles, 
  Ticket,
  ChevronRight,
  CheckCircle2,
  HeartHandshake
} from 'lucide-react';
import { Voucher, Transaction, Language } from '../../types';
import { translations } from '../../utils/translations';
import { sounds } from '../../utils/soundEffects';

interface MobileWalletTabProps {
  currentLang: Language;
  vouchers: Voucher[];
  transactions: Transaction[];
  onOpenRedeemModal: (voucher?: Voucher) => void;
  onViewDetails: (voucher: Voucher) => void;
  onOpenSmartMasjidPay?: () => void;
}

export const MobileWalletTab: React.FC<MobileWalletTabProps> = ({
  currentLang,
  vouchers,
  transactions,
  onOpenRedeemModal,
  onViewDetails,
  onOpenSmartMasjidPay,
}) => {
  const t = translations[currentLang];
  const [activeWalletTab, setActiveWalletTab] = useState<'vouchers' | 'history'>('vouchers');

  const activeVouchers = vouchers.filter(v => v.status === 'ACTIVE');
  const totalUserBalance = activeVouchers.reduce((acc, v) => acc + v.remainingBalance, 0);

  return (
    <div className="space-y-6 animate-fade-in" id="mobile-wallet-tab-container">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Simulator Aplikasi Pengguna (IslamiCityPay Mobile Wallet)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Tampilan interaktif bagi penerima manfaat (Mustahiq) dan nasabah syariah untuk menukarkan voucher secara digital.
          </p>
        </div>
      </div>

      {/* Centered Mobile Mockup Container */}
      <div className="flex justify-center items-center py-4">
        <div className="w-full max-w-sm rounded-[36px] bg-[#0A0A0B] p-3 shadow-2xl border-4 border-[#1F1F24] relative">
          
          {/* Top Speaker & Camera Notch */}
          <div className="w-32 h-4 bg-[#141418] rounded-full mx-auto mb-2 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-[#202026] mr-2" />
            <div className="w-10 h-1 bg-[#202026] rounded-full" />
          </div>

          {/* Phone Screen Canvas */}
          <div className="bg-slate-50 dark:bg-[#0D0D10] rounded-[28px] overflow-hidden border border-slate-200 dark:border-white/[0.08] text-xs flex flex-col h-[620px]">
            
            {/* Mobile App Header */}
            <div className="p-4 bg-gradient-to-br from-emerald-950 via-[#121215] to-teal-950 text-white rounded-b-2xl shadow-md border-b border-emerald-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center font-bold text-xs text-emerald-400">
                    AF
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-300">Assalamu'alaikum,</div>
                    <div className="font-bold text-xs text-white">Ahmad Fauzi (Mustahiq)</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                  Terverifikasi 2FA
                </span>
              </div>

              {/* Total Balance Card */}
              <div className="p-3 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 space-y-1">
                <span className="text-[10px] text-slate-300 font-medium">Total Nilai Voucher Aktif:</span>
                <div className="text-xl font-extrabold font-mono tracking-tight text-white">
                  Rp {totalUserBalance.toLocaleString('id-ID')}
                </div>
                <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>{activeVouchers.length} Voucher Siap Dibelanjakan Halal</span>
                </div>
              </div>

              {/* Quick Mobile Actions */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => {
                    sounds.playClick();
                    onOpenRedeemModal();
                  }}
                  className="py-2 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shadow-xs flex items-center justify-center gap-1 transition-all hover:scale-[1.02]"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Bayar QRIS</span>
                </button>
                <button
                  onClick={() => {
                    sounds.playClick();
                    if (activeVouchers.length > 0) onViewDetails(activeVouchers[0]);
                  }}
                  className="py-2 px-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-[11px] border border-white/10 flex items-center justify-center gap-1 transition-all hover:scale-[1.02]"
                >
                  <Ticket className="w-3.5 h-3.5" />
                  <span>Tampilkan Barcode</span>
                </button>
              </div>
            </div>

            {/* Sub-Tab Navigation inside Mobile App */}
            <div className="flex border-b border-slate-200 dark:border-white/[0.08] text-xs font-bold bg-white dark:bg-[#0D0D10]">
              <button
                onClick={() => setActiveWalletTab('vouchers')}
                className={`flex-1 py-2.5 text-center border-b-2 transition-colors ${
                  activeWalletTab === 'vouchers'
                    ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                    : 'border-transparent text-slate-400'
                }`}
              >
                Voucher Saya ({activeVouchers.length})
              </button>
              <button
                onClick={() => setActiveWalletTab('history')}
                className={`flex-1 py-2.5 text-center border-b-2 transition-colors ${
                  activeWalletTab === 'history'
                    ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                    : 'border-transparent text-slate-400'
                }`}
              >
                Riwayat Transaksi
              </button>
            </div>

            {/* Mobile Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
              
              {/* Smart MasjidPay Remix Mini Feature Banner */}
              {onOpenSmartMasjidPay && (
                <div 
                  onClick={() => {
                    sounds.playClick();
                    onOpenSmartMasjidPay();
                  }}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-950 via-[#0B251B] to-teal-950 border border-emerald-500/30 text-white cursor-pointer hover:border-emerald-400 transition-all flex items-center justify-between shadow-xs"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <HeartHandshake className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] font-extrabold flex items-center gap-1">
                        <span>Smart MasjidPay</span>
                      </div>
                      <div className="text-[9px] text-slate-300">Biaya admin 100% dialirkan ke kas masjid</div>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </div>
              )}

              {activeWalletTab === 'vouchers' ? (
                activeVouchers.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 space-y-2">
                    <Ticket className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700" />
                    <p className="text-xs">Belum ada voucher aktif yang dialokasikan.</p>
                  </div>
                ) : (
                  activeVouchers.map((v) => (
                    <div
                      key={v.id}
                      onClick={() => onViewDetails(v)}
                      className="p-3 rounded-xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] shadow-xs hover:border-emerald-500/50 cursor-pointer space-y-2 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900 dark:text-white truncate max-w-[170px]">
                          {v.title}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-500/20">
                          {v.shariaContract}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-mono">{v.code}</span>
                          <span className="font-extrabold text-sm text-emerald-600 dark:text-emerald-400 font-mono">
                            Rp {v.remainingBalance.toLocaleString('id-ID')}
                          </span>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenRedeemModal(v);
                          }}
                          className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-[11px] font-bold hover:bg-emerald-500 shadow-xs"
                        >
                          Tukar
                        </button>
                      </div>

                      <div className="text-[9px] text-slate-400 flex items-center justify-between pt-1.5 border-t border-slate-100 dark:border-white/[0.06]">
                        <span>Kedaluwarsa: {v.expiryDate}</span>
                        <span className="text-emerald-500 font-medium">E2EE Protected</span>
                      </div>
                    </div>
                  ))
                )
              ) : (
                /* History List */
                <div className="space-y-2">
                  {transactions.slice(0, 6).map((tx) => (
                    <div
                      key={tx.id}
                      className="p-2.5 rounded-xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] flex items-center justify-between text-[11px]"
                    >
                      <div className="space-y-0.5">
                        <div className="font-bold text-slate-900 dark:text-white truncate max-w-[150px]">
                          {tx.merchantName}
                        </div>
                        <div className="text-[9px] text-slate-400 font-mono">{tx.timestamp.substring(5, 16)}</div>
                      </div>

                      <div className="text-right">
                        <div className="font-bold text-rose-500 dark:text-rose-400 font-mono">
                          -Rp {tx.amount.toLocaleString('id-ID')}
                        </div>
                        <span className="text-[9px] text-emerald-500">{tx.bankChannel}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Bottom Navigation Bar */}
            <div className="p-2.5 bg-white dark:bg-[#0D0D10] border-t border-slate-200 dark:border-white/[0.08] flex justify-around text-slate-400 text-[10px]">
              <div className="flex flex-col items-center text-emerald-500 font-bold">
                <Wallet className="w-4 h-4" />
                <span>Dompet</span>
              </div>
              <div className="flex flex-col items-center">
                <Ticket className="w-4 h-4" />
                <span>Voucher</span>
              </div>
              <div className="flex flex-col items-center">
                <History className="w-4 h-4" />
                <span>Riwayat</span>
              </div>
            </div>

          </div>

          {/* Bottom Home Indicator */}
          <div className="w-24 h-1 bg-[#2A2A32] rounded-full mx-auto mt-2" />
        </div>
      </div>

    </div>
  );
};
