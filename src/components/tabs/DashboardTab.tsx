import React, { useState, useEffect } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  Bar 
} from 'recharts';
import { 
  Ticket, 
  Coins, 
  TrendingUp, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowUpRight, 
  Building2, 
  Sparkles, 
  Plus, 
  ScanLine, 
  DownloadCloud, 
  Lock,
  Activity,
  Layers,
  Clock,
  Scale,
  FileText,
  Users,
  HeartHandshake
} from 'lucide-react';
import { Voucher, Transaction, Language, SecurityStatus } from '../../types';
import { translations } from '../../utils/translations';
import { sounds } from '../../utils/soundEffects';
import { WebsiteTelemetryCard } from '../WebsiteTelemetryCard';
import { ShariaContractDonutChart } from '../charts/ShariaContractDonutChart';
import { SmartZakatDistribution } from '../SmartZakatDistribution';

interface DashboardTabProps {
  currentLang: Language;
  vouchers: Voucher[];
  transactions: Transaction[];
  securityStatus: SecurityStatus;
  onOpenIssueModal: () => void;
  onOpenRedeemModal: () => void;
  onOpenExportModal: () => void;
  onViewVoucherDetails: (v: Voucher) => void;
  onOpenSmartMasjidPay?: () => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  currentLang,
  vouchers,
  transactions,
  securityStatus,
  onOpenIssueModal,
  onOpenRedeemModal,
  onOpenExportModal,
  onViewVoucherDetails,
  onOpenSmartMasjidPay,
}) => {
  const t = translations[currentLang];
  const [pulseKey, setPulseKey] = useState(0);

  // Financial Metrics Calculation
  const totalCirculation = vouchers.reduce((acc, v) => acc + v.remainingBalance, 0);
  const activeCount = vouchers.filter(v => v.status === 'ACTIVE').length;
  const totalTransactionsVolume = transactions.reduce((acc, tx) => acc + tx.amount, 0);
  const totalUjrahRevenue = transactions.reduce((acc, tx) => acc + tx.feeUjrah, 0);
  const ziswafTotal = vouchers
    .filter(v => v.category === 'ziswaf' || v.category === 'islamic_education' || v.category === 'masjid_community')
    .reduce((acc, v) => acc + v.faceValue, 0);

  // Real-time chart data: Hourly flow simulation
  const hourlyData = [
    { hour: '08:00', volume: 4500000, count: 6 },
    { hour: '10:00', volume: 12000000, count: 14 },
    { hour: '12:00', volume: 28500000, count: 32 },
    { hour: '14:00', volume: 19800000, count: 21 },
    { hour: '16:00', volume: 34200000, count: 38 },
    { hour: 'Sekarang', volume: totalTransactionsVolume > 0 ? Math.round(totalTransactionsVolume * 0.3) : 15000000, count: 18 },
  ];

  // Bank Gateway Volume Chart Data
  const bankData = [
    { name: 'BSI', amount: 42.5 },
    { name: 'Muamalat', amount: 28.0 },
    { name: 'BCA Syariah', amount: 31.0 },
    { name: 'CIMB Syariah', amount: 19.5 },
    { name: 'QRIS Syariah', amount: 62.0 },
  ];

  return (
    <div className="space-y-6 animate-fade-in" id="dashboard-tab-container">
      
      {/* Top Banner / Sharia Alert Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/90 via-[#121215] to-teal-950/80 text-white shadow-xl border border-emerald-500/20 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Infrastruktur FinTech Syariah 100% Real-Time
          </div>
          <h2 className="text-lg md:text-xl font-bold tracking-tight text-white">
            Pusat Komando Manajemen Voucher Digital IslamiCityPay
          </h2>
          <p className="text-xs text-slate-300/90 max-w-2xl">
            Terkoneksi langsung ke gateway Bank Syariah Indonesia, Bank Muamalat & QRIS Nasional dengan perlindungan E2EE (AES-256-GCM) serta sertifikasi kepatuhan DSN-MUI.
          </p>
        </div>

        <div className="flex items-center gap-2 relative z-10 shrink-0">
          <button
            onClick={() => {
              sounds.playClick();
              onOpenIssueModal();
            }}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition-all flex items-center gap-1.5 hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>Terbitkan Voucher</span>
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              onOpenRedeemModal();
            }}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs backdrop-blur-md border border-white/15 transition-all flex items-center gap-1.5 hover:scale-[1.02]"
          >
            <ScanLine className="w-4 h-4" />
            <span>Tukar Voucher</span>
          </button>
        </div>
      </div>

      {/* Website & Server Infrastructure Telemetry Overview */}
      <WebsiteTelemetryCard currentLang={currentLang} />

      {/* Smart MasjidPay Remix Highlight Feature Card */}
      {onOpenSmartMasjidPay && (
        <div 
          onClick={() => {
            sounds.playClick();
            onOpenSmartMasjidPay();
          }}
          className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-[#0C2219] to-teal-950/80 border border-emerald-500/30 text-white shadow-md hover:border-emerald-400/60 cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-white tracking-tight">
                  Smart MasjidPay
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                  INFAQ TRANSAKSI
                </span>
              </div>
              <p className="text-xs text-slate-300 max-w-xl">
                Setiap transaksi digital kini otomatis mengalirkan biaya admin 100% menjadi donasi & infaq ke kas masjid. Sederhana, transparan, dan mudah dipakai semua kalangan.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              className="px-4 py-2 rounded-xl bg-emerald-600 group-hover:bg-emerald-500 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Buka MasjidPay</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* KPI Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Active Vouchers */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] shadow-xs hover:border-emerald-500/40 dark:hover:border-emerald-500/40 transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {t.metrics.activeVouchers}
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <Ticket className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
              {activeCount} <span className="text-xs font-sans font-normal text-slate-400">Lembar</span>
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1 font-medium">
              <ArrowUpRight className="w-3 h-3" />
              <span>+18.4% alokasi minggu ini</span>
            </div>
          </div>
        </div>

        {/* Card 2: Total Liquidity Value */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] shadow-xs hover:border-emerald-500/40 dark:hover:border-emerald-500/40 transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {t.metrics.totalCirculation}
            </span>
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl font-black text-slate-900 dark:text-white font-mono truncate">
              Rp {totalCirculation.toLocaleString('id-ID')}
            </div>
            <div className="text-[11px] text-teal-600 dark:text-teal-400 flex items-center gap-1 mt-1 font-medium">
              <span>Pool Wadiah di Bank BSI & Muamalat</span>
            </div>
          </div>
        </div>

        {/* Card 3: Sharia Ujrah Revenue */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] shadow-xs hover:border-emerald-500/40 dark:hover:border-emerald-500/40 transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {t.metrics.shariaRevenue}
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl font-black text-slate-900 dark:text-white font-mono truncate">
              Rp {totalUjrahRevenue.toLocaleString('id-ID')}
            </div>
            <div className="text-[11px] text-amber-600 dark:text-amber-400 flex items-center gap-1 mt-1 font-medium">
              <span>Nisbah Wakalah 0.5% transparan</span>
            </div>
          </div>
        </div>

        {/* Card 4: Sharia & E2EE Integrity Index */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] shadow-xs hover:border-emerald-500/40 dark:hover:border-emerald-500/40 transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Kepatuhan DSN & E2EE
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-500 dark:text-emerald-400 font-mono flex items-center gap-1">
              100% <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="text-[11px] text-purple-600 dark:text-purple-400 flex items-center gap-1 mt-1 font-medium">
              <Lock className="w-3 h-3" />
              <span>AES-256-GCM + Anti-Double Spend</span>
            </div>
          </div>
        </div>

      </div>

      {/* Smart Zakat Distribution Dashboard: Real-time progress toward annual targets per project category */}
      <SmartZakatDistribution
        currentLang={currentLang}
        vouchers={vouchers}
        transactions={transactions}
        onOpenIssueModal={onOpenIssueModal}
        onOpenExportModal={onOpenExportModal}
      />

      {/* NEW: Dedicated Sharia Contract Distribution Donut Chart */}
      <ShariaContractDonutChart
        vouchers={vouchers}
        currentLang={currentLang}
        onViewVoucherDetails={onViewVoucherDetails}
      />

      {/* Visual Analytics Charts Section: Real-Time Flow & Bank Liquidity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Real-Time Transaction Volume Area Chart (7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-500" />
                Arus Transaksi & Penebusan Voucher Real-Time
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Volume per jam terhubung ke gateway BI-FAST & SNAP-BI
              </p>
            </div>
            <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.7)]" />
              Live Feed
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="hour" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `Rp ${(v / 1000000).toFixed(0)}Jt`} />
                <Tooltip 
                  formatter={(value: number) => [`Rp ${value.toLocaleString('id-ID')}`, 'Volume']}
                  contentStyle={{ backgroundColor: '#16161A', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="volume" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorVolume)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bank Liquidity Settlement Breakdown Bar Chart (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] space-y-4 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-500" />
              Volume Kliring Bank Syariah
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Rerata penyelesaian per gateway (dalam Miliar Rp)
            </p>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bankData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip 
                  formatter={(value: number) => [`Rp ${value} Miliar`, 'Volume']}
                  contentStyle={{ backgroundColor: '#16161A', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '11px' }}
                />
                <Bar dataKey="amount" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-[11px] text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 flex items-center justify-between">
            <span>SLA Penyelesaian BI-FAST:</span>
            <span className="font-mono font-bold">&lt; 15 detik</span>
          </div>
        </div>

      </div>

      {/* Live Transactions Stream & Bank Liquidity Routing */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Live Transaction Stream Feed (2 cols) */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-500" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Live Transaction Stream (Jejak Penebusan Terkini)
              </h3>
            </div>
            <button
              onClick={() => {
                sounds.playClick();
                onOpenExportModal();
              }}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              <DownloadCloud className="w-3.5 h-3.5" />
              <span>Ekspor PDF/Excel</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-[#16161A] text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-white/[0.06]">
                <tr>
                  <th className="py-2.5 px-3">Waktu</th>
                  <th className="py-2.5 px-3">Kode Voucher</th>
                  <th className="py-2.5 px-3">Bank / Kanal</th>
                  <th className="py-2.5 px-3">Nominal</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">E2EE Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/[0.06]">
                {transactions.slice(0, 5).map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/80 dark:hover:bg-white/[0.03] transition-colors">
                    <td className="py-2.5 px-3 font-mono text-slate-500 dark:text-slate-400">
                      {tx.timestamp.substring(11, 19)}
                    </td>
                    <td className="py-2.5 px-3 font-bold font-mono text-emerald-600 dark:text-emerald-400">
                      {tx.voucherCode}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-700 dark:text-slate-300">
                      {tx.bankChannel}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900 dark:text-white">
                      Rp {tx.amount.toLocaleString('id-ID')}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-400 text-[10px]">
                      {tx.endToEndHash.substring(0, 8)}...
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Asnaf Digital Ledger & DSN Compliance Summary Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Scale className="w-4 h-4 text-emerald-500" />
                Ledger Kepatuhan 8 Asnaf
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                DSN-MUI 100%
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Integritas alokasi mustahiq tersinkronisasi SiMBA & BAZNAS
            </p>
          </div>

          <div className="space-y-2.5 py-1">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#18181D] border border-slate-200 dark:border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-teal-500" />
                <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">e-KYC NIK Terverifikasi</span>
              </div>
              <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">24.580 Jiwa</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#18181D] border border-slate-200 dark:border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">Validasi Smart Contract</span>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">Active Nonce</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#18181D] border border-slate-200 dark:border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-500" />
                <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">Klaim Terdistribusi Real-time</span>
              </div>
              <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">Zero Ujrah Fee</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-[11px] text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 flex items-center justify-between">
            <span>Audit Trail Terenkripsi:</span>
            <span className="font-mono font-bold">SHA-256 Validated</span>
          </div>
        </div>

      </div>

    </div>
  );
};
