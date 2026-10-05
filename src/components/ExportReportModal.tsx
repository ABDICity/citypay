import React, { useState } from 'react';
import { 
  X, 
  DownloadCloud, 
  FileText, 
  FileSpreadsheet, 
  ShieldCheck, 
  CheckCircle2, 
  Check, 
  Layers,
  Calendar,
  Sparkles
} from 'lucide-react';
import { Voucher, Transaction, AuditLog, Language } from '../types';
import { translations } from '../utils/translations';
import { exportVouchersToExcel, generateOfficialAuditPdf, exportToCsv } from '../utils/exportUtils';
import { sounds } from '../utils/soundEffects';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  vouchers: Voucher[];
  transactions: Transaction[];
  auditLogs: AuditLog[];
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  isOpen,
  onClose,
  currentLang,
  vouchers,
  transactions,
  auditLogs,
}) => {
  const t = translations[currentLang];
  const [reportType, setReportType] = useState<'ALL' | 'DAILY_RECON' | 'DSN_AUDIT' | 'MERCHANT_SETTLEMENT'>('ALL');
  const [includeAuditHashes, setIncludeAuditHashes] = useState(true);
  const [includeShariaSeals, setIncludeShariaSeals] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExportPdf = () => {
    setIsExporting(true);
    sounds.playClick();
    setTimeout(() => {
      generateOfficialAuditPdf({
        vouchers,
        transactions,
        auditLogs,
        reportTitle: reportType === 'DAILY_RECON' 
          ? 'LAPORAN REKONSILIASI HARIAN PERBANKAN SYARIAH'
          : reportType === 'DSN_AUDIT'
          ? 'SERTIFIKAT KEPATUHAN & AUDIT SYARIAH DSN-MUI'
          : reportType === 'MERCHANT_SETTLEMENT'
          ? 'REKAP SETTLEMENT MERCHANT & UJRAH VOUCHER'
          : 'LAPORAN LENGKAP AUDIT & MANAJEMEN VOUCHER ISLAMICITYPAY',
      });
      setIsExporting(false);
      setExportSuccess('PDF');
      sounds.playSuccess();
      setTimeout(() => setExportSuccess(null), 3000);
    }, 600);
  };

  const handleExportExcel = () => {
    setIsExporting(true);
    sounds.playClick();
    setTimeout(() => {
      exportVouchersToExcel(vouchers, transactions, auditLogs, 'IslamiCityPay_Sharia_Audit_Ledger');
      setIsExporting(false);
      setExportSuccess('Excel');
      sounds.playSuccess();
      setTimeout(() => setExportSuccess(null), 3000);
    }, 600);
  };

  const handleExportCsv = () => {
    setIsExporting(true);
    sounds.playClick();
    setTimeout(() => {
      const csvData = transactions.map(t => ({
        id: t.id,
        voucher_code: t.voucherCode,
        amount: t.amount,
        bank: t.bankChannel,
        status: t.status,
        timestamp: t.timestamp,
        e2ee_hash: t.endToEndHash,
      }));
      exportToCsv(csvData, 'IslamiCityPay_Transactions_Stream');
      setIsExporting(false);
      setExportSuccess('CSV');
      sounds.playSuccess();
      setTimeout(() => setExportSuccess(null), 3000);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-[#121215] w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 dark:border-white/[0.08] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-white/[0.08] flex items-center justify-between bg-slate-50 dark:bg-[#16161A]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <DownloadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {t.export.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t.export.subtitle}
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

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700 dark:text-slate-200 flex-1">
          
          {/* Report Type Selector */}
          <div>
            <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1.5">
              {t.export.selectType}:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                { id: 'ALL', title: 'Laporan Komprehensif', desc: 'Voucher, Transaksi & Audit Log Lengkap' },
                { id: 'DAILY_RECON', title: 'Rekonsiliasi Bank Syariah', desc: 'Mutasi kliring BSI, Muamalat & BI-FAST' },
                { id: 'DSN_AUDIT', title: 'Sertifikat Audit DSN-MUI', desc: 'Validasi akad fikih & bebas riba' },
                { id: 'MERCHANT_SETTLEMENT', title: 'Rekap Settlement Merchant', desc: 'Rincian pencairan & Ujrah fee' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setReportType(item.id as unknown as typeof reportType);
                    sounds.playClick();
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    reportType === item.id
                      ? 'bg-emerald-50 dark:bg-emerald-950/25 border-emerald-500 text-emerald-900 dark:text-emerald-200 shadow-xs'
                      : 'bg-slate-50 dark:bg-[#16161A] border-slate-200 dark:border-white/[0.08] hover:border-slate-400 dark:hover:border-white/[0.15]'
                  }`}
                >
                  <div className="font-bold">{item.title}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Compliance Option Toggles */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.08] space-y-2.5">
            <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800 dark:text-slate-200">
              <input
                type="checkbox"
                checked={includeAuditHashes}
                onChange={(e) => setIncludeAuditHashes(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
              />
              <span>{t.export.includeAudit}</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800 dark:text-slate-200">
              <input
                type="checkbox"
                checked={includeShariaSeals}
                onChange={(e) => setIncludeShariaSeals(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
              />
              <span>{t.export.includeShariaSeals}</span>
            </label>
          </div>

          {/* Export Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <div className="font-bold text-slate-800 dark:text-slate-200">
              Pilih Format Dokumen Ekspor:
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* PDF Export */}
              <button
                type="button"
                onClick={handleExportPdf}
                disabled={isExporting}
                className="p-3 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 border border-rose-200 dark:border-rose-500/25 text-rose-800 dark:text-rose-200 flex flex-col items-center justify-center gap-1.5 transition-all hover:scale-[1.02]"
              >
                <FileText className="w-6 h-6 text-rose-600 dark:text-rose-400" />
                <span className="font-bold text-xs">Dokumen PDF Resmi</span>
                <span className="text-[10px] text-rose-600/80 dark:text-rose-400/80 font-mono">Format Cetak A4</span>
              </button>

              {/* Excel Export */}
              <button
                type="button"
                onClick={handleExportExcel}
                disabled={isExporting}
                className="p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/25 text-emerald-800 dark:text-emerald-200 flex flex-col items-center justify-center gap-1.5 transition-all hover:scale-[1.02]"
              >
                <FileSpreadsheet className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                <span className="font-bold text-xs">Excel Multi-Sheet</span>
                <span className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 font-mono">.xlsx Kripto</span>
              </button>

              {/* CSV Export */}
              <button
                type="button"
                onClick={handleExportCsv}
                disabled={isExporting}
                className="p-3 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 border border-blue-200 dark:border-blue-500/25 text-blue-800 dark:text-blue-200 flex flex-col items-center justify-center gap-1.5 transition-all hover:scale-[1.02]"
              >
                <Layers className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <span className="font-bold text-xs">Raw CSV Ledger</span>
                <span className="text-[10px] text-blue-600/80 dark:text-blue-400/80 font-mono">Import BI-FAST</span>
              </button>
            </div>
          </div>

          {/* Success Banner */}
          {exportSuccess && (
            <div className="p-3 rounded-lg bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Berkas {exportSuccess} telah berhasil dibuat dan diunduh ke perangkat Anda!</span>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#16161A] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/[0.06] rounded-lg transition-colors"
          >
            {t.actions.close}
          </button>
        </div>

      </div>
    </div>
  );
};
