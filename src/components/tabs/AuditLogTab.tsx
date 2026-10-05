import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  Search, 
  Filter, 
  DownloadCloud, 
  Lock, 
  AlertTriangle, 
  Sparkles,
  Calendar,
  Layers,
  Copy,
  Check
} from 'lucide-react';
import { AuditLog, AuditCategory, AuditSeverity, Language } from '../../types';
import { translations } from '../../utils/translations';
import { sounds } from '../../utils/soundEffects';

interface AuditLogTabProps {
  currentLang: Language;
  auditLogs: AuditLog[];
  onOpenExportModal: () => void;
}

export const AuditLogTab: React.FC<AuditLogTabProps> = ({
  currentLang,
  auditLogs,
  onOpenExportModal,
}) => {
  const t = translations[currentLang];

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      const matchCat = selectedCategory === 'ALL' || log.category === selectedCategory;
      const matchSev = selectedSeverity === 'ALL' || log.severity === selectedSeverity;
      const query = searchQuery.toLowerCase();
      const matchSearch =
        !searchQuery ||
        log.actor.toLowerCase().includes(query) ||
        log.action.toLowerCase().includes(query) ||
        log.payloadHash.toLowerCase().includes(query) ||
        log.notes.toLowerCase().includes(query);

      return matchCat && matchSev && matchSearch;
    });
  }, [auditLogs, selectedCategory, selectedSeverity, searchQuery]);

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    sounds.playClick();
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const getSeverityBadge = (severity: AuditSeverity) => {
    switch (severity) {
      case 'AUDIT_SEALED':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-300';
      case 'CRITICAL':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300';
      case 'WARNING':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300';
      case 'INFO':
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in" id="audit-log-tab-container">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Modul Audit Log & Kepatuhan Regulasi Finansial
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Jejak transaksi abadi (immutable ledger) terverifikasi DSN-MUI, OJK, dan Bank Indonesia.
          </p>
        </div>

        <button
          onClick={() => {
            sounds.playClick();
            onOpenExportModal();
          }}
          className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition-all flex items-center gap-1.5"
        >
          <DownloadCloud className="w-4 h-4" />
          <span>{t.audit.exportAuditTrail}</span>
        </button>
      </div>

      {/* Compliance Certification Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="p-4 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] shadow-xs flex items-center gap-3.5 hover:border-emerald-500/30 transition-all">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-xs text-slate-900 dark:text-white">
              Sertifikasi DSN-MUI
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              Fatwa No. 116 / DSN-MUI / IX / 2017
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] shadow-xs flex items-center gap-3.5 hover:border-blue-500/30 transition-all">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-xs text-slate-900 dark:text-white">
              Standar OJK & BI-FAST
            </div>
            <div className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">
              POJK No. 11 / POJK.03 / 2022
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] shadow-xs flex items-center gap-3.5 hover:border-purple-500/30 transition-all">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-xs text-slate-900 dark:text-white">
              Integritas Kriptografis
            </div>
            <div className="text-[11px] text-purple-600 dark:text-purple-400 font-medium">
              SHA-256 Hash Chain Immutable
            </div>
          </div>
        </div>

      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari aktor, aktivitas, atau SHA-256 hash..."
            className="w-full pl-9 pr-3 py-2 bg-slate-100 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.08] rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/40 outline-none transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-slate-100 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.08] rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 outline-none cursor-pointer"
          >
            <option value="ALL">Semua Kategori</option>
            <option value="SECURITY">Keamanan Kripto</option>
            <option value="TRANSACTION">Transaksi Voucher</option>
            <option value="SHARIA_COMPLIANCE">Kepatuhan Syariah</option>
            <option value="API_INTEGRATION">Integrasi API Bank</option>
            <option value="USER_AUTH">Autentikasi User / 2FA</option>
          </select>

          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="px-3 py-2 bg-slate-100 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.08] rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 outline-none cursor-pointer"
          >
            <option value="ALL">Semua Tingkat</option>
            <option value="AUDIT_SEALED">Audit Sealed (Resmi)</option>
            <option value="INFO">Info</option>
            <option value="WARNING">Warning</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </div>

      </div>

      {/* Audit Logs Table */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] overflow-x-auto shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-[#16161A] text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-white/[0.06]">
            <tr>
              <th className="py-3 px-3">Waktu & Tanggal</th>
              <th className="py-3 px-3">Aktor / Role</th>
              <th className="py-3 px-3">Aktivitas Sistem</th>
              <th className="py-3 px-3">Tingkat</th>
              <th className="py-3 px-3">Kepatuhan DSN</th>
              <th className="py-3 px-3">SHA-256 Hash</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/[0.06]">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors">
                <td className="py-3 px-3 font-mono text-slate-500 dark:text-slate-400 whitespace-nowrap">
                  {log.timestamp}
                </td>
                <td className="py-3 px-3">
                  <div className="font-bold text-slate-900 dark:text-white">{log.actor}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{log.role}</div>
                </td>
                <td className="py-3 px-3 max-w-xs">
                  <div className="font-medium text-slate-800 dark:text-slate-200 leading-snug">{log.action}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{log.notes}</div>
                </td>
                <td className="py-3 px-3 whitespace-nowrap">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getSeverityBadge(log.severity)}`}>
                    {log.severity}
                  </span>
                </td>
                <td className="py-3 px-3 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    Tersertifikasi
                  </span>
                </td>
                <td className="py-3 px-3 font-mono text-[10px] text-slate-400">
                  <div className="flex items-center gap-1">
                    <span>{log.payloadHash.substring(0, 10)}...</span>
                    <button
                      onClick={() => handleCopyHash(log.payloadHash)}
                      className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
                      title="Salin Hash Lengkap"
                    >
                      {copiedHash === log.payloadHash ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
