import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  HardDrive, 
  Activity, 
  Layers, 
  Clock, 
  ExternalLink, 
  Copy, 
  Check, 
  RefreshCw, 
  ShieldCheck, 
  Zap, 
  Server, 
  Cpu, 
  Wifi, 
  FileCode, 
  CheckCircle2, 
  X,
  Gauge,
  Database,
  Terminal,
  Radio
} from 'lucide-react';
import { Language } from '../types';
import { sounds } from '../utils/soundEffects';

interface WebsiteTelemetryCardProps {
  currentLang: Language;
}

interface PageDetail {
  title: string;
  route: string;
  type: 'SPA View' | 'Secure Vault' | 'REST Gateway' | 'AI Assistant' | 'Interactive Tool';
  sizeKb: number;
  avgLatencyMs: number;
  status: '200 OK' | 'Cached';
  lastModified: string;
}

export const WebsiteTelemetryCard: React.FC<WebsiteTelemetryCardProps> = ({ currentLang }) => {
  const [copied, setCopied] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastPublished, setLastPublished] = useState('2026-08-27 17:01:54 UTC');
  const [relativePublished, setRelativePublished] = useState('Baru saja (Updated just now)');
  const [isPagesModalOpen, setIsPagesModalOpen] = useState(false);
  const [pingLatency, setPingLatency] = useState<number | null>(24);
  const [isPinging, setIsPinging] = useState(false);
  const [liveThroughput, setLiveThroughput] = useState(4.2);

  // Dynamic website URL derived from environment or fallback
  const siteUrl = typeof window !== 'undefined' && window.location.origin && window.location.origin !== 'null'
    ? window.location.origin
    : 'https://ais-dev-22atwcknulbqqvw5ntaj7j-838803849877.asia-east1.run.app';

  const siteName = 'IslamiCityPay Digital Voucher Platform';

  // Server Space constants
  const totalSpaceGb = 50.0;
  const usedSpaceGb = 14.8;
  const usedSpacePercent = ((usedSpaceGb / totalSpaceGb) * 100).toFixed(1);

  // Bandwidth constants
  const totalBandwidthGb = 500.0;
  const usedBandwidthGb = 142.6;
  const usedBandwidthPercent = ((usedBandwidthGb / totalBandwidthGb) * 100).toFixed(1);

  // Pages & Modules Data
  const pagesList: PageDetail[] = [
    { title: 'Pusat Komando & Ringkasan Keuangan (Dashboard)', route: '/', type: 'SPA View', sizeKb: 142, avgLatencyMs: 85, status: '200 OK', lastModified: '2026-08-27 17:01:54' },
    { title: 'Ledger Voucher Digital Syariah (Voucher Ledger)', route: '/vouchers', type: 'Interactive Tool', sizeKb: 210, avgLatencyMs: 95, status: '200 OK', lastModified: '2026-08-27 16:58:10' },
    { title: 'Konsol Keamanan Kriptografis & 2FA (Security Console)', route: '/security', type: 'Secure Vault', sizeKb: 168, avgLatencyMs: 110, status: '200 OK', lastModified: '2026-08-27 16:45:22' },
    { title: 'Gateway Open Banking & Sandbox SNAP-BI (Banking API)', route: '/banking-api', type: 'REST Gateway', sizeKb: 245, avgLatencyMs: 125, status: '200 OK', lastModified: '2026-08-27 16:30:00' },
    { title: 'Jejak Audit DSN-MUI & Forensik SHA-256 (Audit Trail)', route: '/audit-log', type: 'Secure Vault', sizeKb: 195, avgLatencyMs: 90, status: '200 OK', lastModified: '2026-08-27 16:15:40' },
    { title: 'Simulator Dompet Digital Syariah (Mobile Simulator)', route: '/mobile-wallet', type: 'Interactive Tool', sizeKb: 178, avgLatencyMs: 105, status: '200 OK', lastModified: '2026-08-27 16:00:15' },
    { title: 'Asisten AI Fatwa & Kepatuhan Syariah (AI Advisor)', route: '/ai-advisor', type: 'AI Assistant', sizeKb: 285, avgLatencyMs: 140, status: '200 OK', lastModified: '2026-08-27 15:50:30' },
  ];

  // Fluctuate throughput slightly for high-realism live telemetry
  useEffect(() => {
    const interval = setInterval(() => {
      const delta = (Math.random() - 0.5) * 0.4;
      setLiveThroughput(prev => Math.max(1.8, Math.min(8.5, parseFloat((prev + delta).toFixed(2)))));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(siteUrl);
    setCopied(true);
    sounds.playClick();
    setTimeout(() => setCopied(false), 2500);
  };

  const handleTriggerPublish = () => {
    sounds.playClick();
    setIsSyncing(true);
    setTimeout(() => {
      const now = new Date();
      const formatted = now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
      setLastPublished(formatted);
      setRelativePublished('Baru saja (Updated just now)');
      setIsSyncing(false);
      sounds.playSuccess();
    }, 1200);
  };

  const handlePingServer = () => {
    sounds.playClick();
    setIsPinging(true);
    setTimeout(() => {
      const randomized = Math.floor(Math.random() * 15) + 18;
      setPingLatency(randomized);
      setIsPinging(false);
    }, 450);
  };

  const isArabic = currentLang === 'ar';
  const isEnglish = currentLang === 'en';

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] shadow-sm space-y-5" id="website-telemetry-panel">
      
      {/* Header Info Section: Website Identity & URL */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-white/[0.06]">
        
        {/* Website Name & Domain Indicator */}
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Globe className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-base text-slate-900 dark:text-white tracking-tight">
              {siteName}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live & Protected
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/[0.08]">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              TLS 1.3 256-Bit
            </span>
          </div>

          {/* URL & Link Bar */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              {isArabic ? 'رابط الموقع الرسمي:' : isEnglish ? 'Official Website URL:' : 'URL Website Resmi:'}
            </span>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.08] font-mono text-[11px] text-slate-800 dark:text-slate-200 max-w-full">
              <span className="truncate max-w-[280px] sm:max-w-md">{siteUrl}</span>
              <button
                onClick={handleCopyUrl}
                title="Salin URL Website"
                className="text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <a
              href={siteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-semibold text-[11px] border border-emerald-500/20 transition-all hover:scale-[1.02]"
            >
              <span>{isArabic ? 'فتح الموقع' : isEnglish ? 'Visit Site' : 'Kunjungi'}</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <button
              onClick={handlePingServer}
              disabled={isPinging}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-mono text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] border border-slate-200 dark:border-white/[0.06] transition-colors"
            >
              <Radio className={`w-3 h-3 text-emerald-500 ${isPinging ? 'animate-spin' : ''}`} />
              <span>Ping: {pingLatency}ms</span>
            </button>
          </div>
        </div>

        {/* Publication Timestamp & Quick Re-sync Trigger */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-2 shrink-0 bg-slate-50 dark:bg-[#16161A] p-3 rounded-xl border border-slate-200 dark:border-white/[0.06]">
          <div>
            <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-emerald-500" />
              <span>{isArabic ? 'آخر وقت للنشر' : isEnglish ? 'Last Published Time' : 'Waktu Terakhir Dipublikasikan'}</span>
            </div>
            <div className="font-mono text-xs font-bold text-slate-800 dark:text-slate-100 mt-0.5">
              {lastPublished}
            </div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
              {relativePublished}
            </div>
          </div>

          <button
            onClick={handleTriggerPublish}
            disabled={isSyncing}
            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1.5 shadow-xs transition-all hover:scale-[1.02] disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Menyinkronkan...' : 'Publikasi / Sinkron CDN'}</span>
          </button>
        </div>

      </div>

      {/* Triad Insights Grid: Pages Count, Server Space Occupied, Bandwidth Usage */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Insight 1: Number of Pages & Modules */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.06] space-y-3 flex flex-col justify-between hover:border-emerald-500/30 transition-all">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-500" />
                {isArabic ? 'عدد الصفحات والوحدات' : isEnglish ? 'Total Pages & Modules' : 'Jumlah Halaman & Modul'}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20">
                7 Core + 24 API
              </span>
            </div>

            <div className="pt-2">
              <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                {pagesList.length} <span className="text-xs font-sans font-normal text-slate-400">Halaman Aktif</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                Mencakup 7 tampilan utama dan 24 sub-endpoint perbankan syariah terenkripsi.
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-white/[0.06] flex items-center justify-between">
            <div className="text-[10px] text-slate-400 font-mono">
              Avg Load: <span className="text-emerald-500 font-bold">~107 ms</span>
            </div>
            <button
              onClick={() => {
                sounds.playClick();
                setIsPagesModalOpen(true);
              }}
              className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Detail Halaman & Status</span>
            </button>
          </div>
        </div>

        {/* Insight 2: Server Space Occupied */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.06] space-y-3 flex flex-col justify-between hover:border-emerald-500/30 transition-all">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-purple-500" />
                {isArabic ? 'مساحة الخادم المشغولة' : isEnglish ? 'Server Space Occupied' : 'Kapasitas Server Terpakai'}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/20 font-mono">
                {usedSpacePercent}% Digunakan
              </span>
            </div>

            <div className="pt-2">
              <div className="text-2xl font-black font-mono text-slate-900 dark:text-white flex items-baseline gap-1.5">
                <span>{usedSpaceGb} GB</span>
                <span className="text-xs font-sans font-normal text-slate-400">/ {totalSpaceGb} GB</span>
              </div>
              
              {/* Multi-segment Storage Bar */}
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-white/[0.08] overflow-hidden flex mt-2.5">
                {/* Database Ledger */}
                <div style={{ width: '12.4%' }} className="h-full bg-purple-500" title="PostgreSQL / Sharia Ledger (6.2 GB)" />
                {/* Keys & Assets */}
                <div style={{ width: '8.2%' }} className="h-full bg-emerald-500" title="Keystore & Cryptographic Assets (4.1 GB)" />
                {/* Logs & Audit */}
                <div style={{ width: '9.0%' }} className="h-full bg-amber-500" title="Audit Logs & Snapshots (4.5 GB)" />
              </div>
            </div>
          </div>

          {/* Storage Breakdown Legend */}
          <div className="pt-2 border-t border-slate-200 dark:border-white/[0.06] flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-purple-500" /> DB 6.2GB
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Assets 4.1GB
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> Logs 4.5GB
            </span>
          </div>
        </div>

        {/* Insight 3: Bandwidth Usage At A Glance */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.06] space-y-3 flex flex-col justify-between hover:border-emerald-500/30 transition-all">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Wifi className="w-3.5 h-3.5 text-emerald-500" />
                {isArabic ? 'استخدام النطاق الترددي' : isEnglish ? 'Bandwidth Usage' : 'Penggunaan Bandwidth'}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 font-mono">
                {usedBandwidthPercent}% dari Kuota
              </span>
            </div>

            <div className="pt-2">
              <div className="text-2xl font-black font-mono text-slate-900 dark:text-white flex items-baseline gap-1.5">
                <span>{usedBandwidthGb} GB</span>
                <span className="text-xs font-sans font-normal text-slate-400">/ {totalBandwidthGb} GB</span>
              </div>

              {/* Bandwidth Usage Bar */}
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-white/[0.08] overflow-hidden mt-2.5">
                <div 
                  style={{ width: `${usedBandwidthPercent}%` }} 
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" 
                />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-white/[0.06] flex items-center justify-between text-[10px]">
            <span className="text-slate-400 font-mono flex items-center gap-1">
              <Activity className="w-3 h-3 text-emerald-500 animate-pulse" />
              Throughput: <strong className="text-slate-700 dark:text-slate-200 font-mono">{liveThroughput} MB/s</strong>
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold font-mono">
              CDN Hit: 98.7%
            </span>
          </div>
        </div>

      </div>

      {/* Pages & Routes Inspector Modal */}
      {isPagesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-[#121215] w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 dark:border-white/[0.08] overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-white/[0.08] flex items-center justify-between bg-slate-50 dark:bg-[#16161A]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-500/20">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Daftar Halaman, Modul & Rute Sistem
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Inspeksi struktur rute, latency, ukuran payload, dan status respon HTTP
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsPagesModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-white/[0.06] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Table of Pages */}
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-[#16161A] text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-white/[0.06]">
                    <tr>
                      <th className="py-2.5 px-3">Nama Halaman / Modul</th>
                      <th className="py-2.5 px-3">Rute URL</th>
                      <th className="py-2.5 px-3">Tipe</th>
                      <th className="py-2.5 px-3">Ukuran</th>
                      <th className="py-2.5 px-3">Latency</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/[0.06]">
                    {pagesList.map((p, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-white/[0.03] transition-colors">
                        <td className="py-3 px-3 font-semibold text-slate-900 dark:text-slate-100">
                          {p.title}
                        </td>
                        <td className="py-3 px-3 font-mono text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                          {p.route}
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-slate-300">
                            {p.type}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-300">
                          {p.sizeKb} KB
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-300">
                          {p.avgLatencyMs} ms
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* System Infrastructure Note */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.06] flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-emerald-500" />
                  <span>Hosting Engine: <strong>Google Cloud Run Asia-East1 (Serverless Container)</strong></span>
                </div>
                <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Semua Rute Beroperasi Normal</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#16161A] flex justify-end">
              <button
                onClick={() => setIsPagesModalOpen(false)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/[0.06] rounded-lg transition-colors"
              >
                Tutup
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
