import React, { useState, useMemo } from 'react';
import { 
  Target, 
  TrendingUp, 
  Coins, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  ChevronRight, 
  Filter, 
  Sparkles, 
  Plus, 
  RefreshCw, 
  HeartHandshake, 
  BookOpen, 
  Stethoscope, 
  Utensils, 
  Compass, 
  Droplets, 
  ArrowUpRight, 
  ShieldCheck, 
  Scale,
  Building,
  Info,
  SlidersHorizontal,
  FileSpreadsheet
} from 'lucide-react';
import { Voucher, Transaction, Language } from '../types';
import { translations } from '../utils/translations';
import { sounds } from '../utils/soundEffects';

export interface ZakatProjectCategory {
  id: string;
  code: string;
  name: string;
  asnaf: string[];
  targetAmount: number;
  baseDistributedAmount: number;
  voucherCategoryKey?: string; // key matching VoucherCategory
  icon: React.ElementType;
  themeColor: {
    bg: string;
    text: string;
    border: string;
    progressFill: string;
    progressGlow: string;
    badgeBg: string;
  };
  beneficiariesCount: number;
  unitLabel: string;
  locationScope: string;
  kpiMilestone: string;
  description: string;
}

interface SmartZakatDistributionProps {
  currentLang: Language;
  vouchers: Voucher[];
  transactions: Transaction[];
  onOpenIssueModal?: () => void;
  onOpenExportModal?: () => void;
}

export const SmartZakatDistribution: React.FC<SmartZakatDistributionProps> = ({
  currentLang,
  vouchers,
  transactions,
  onOpenIssueModal,
  onOpenExportModal,
}) => {
  const t = translations[currentLang];

  // Selected fiscal period filter
  const [selectedFiscalYear, setSelectedFiscalYear] = useState<'2026' | '1447H' | 'Q3_2026'>('2026');
  // Asnaf Filter
  const [selectedAsnaf, setSelectedAsnaf] = useState<string>('ALL');
  // Selected category for detail drilldown
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>('CAT_PRODUKTIF');
  // Quick simulation increment state to demonstrate live progress bar updates
  const [simulatedBoost, setSimulatedBoost] = useState<Record<string, number>>({});
  // Feedback toast state
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Initial Target & Category definitions based on national BAZNAS & FinTech Syariah guidelines
  const categoriesDefinition: ZakatProjectCategory[] = useMemo(() => [
    {
      id: 'CAT_PRODUKTIF',
      code: 'ZKT-ECO-01',
      name: 'Zakat Produktif & Modal UMKM Mustahiq',
      asnaf: ['Fakir', 'Miskin'],
      targetAmount: 6500000000, // Rp 6.5 Miliar
      baseDistributedAmount: 5120000000, // ~78.8%
      voucherCategoryKey: 'ziswaf',
      icon: TrendingUp,
      themeColor: {
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-700 dark:text-emerald-400',
        border: 'border-emerald-500/20',
        progressFill: 'from-emerald-600 to-teal-500',
        progressGlow: 'shadow-emerald-500/30',
        badgeBg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50'
      },
      beneficiariesCount: 1420,
      unitLabel: 'KK Dhuafa Produktif',
      locationScope: 'Nasional (14 Provinsi)',
      kpiMilestone: '92% usaha mikro binaan mandiri setelah 6 bulan',
      description: 'Penyaluran modal bergulir tanpa bunga (Qardhul Hasan) dan voucher alat kerja bagi pedagang kecil dan pengrajin mustahiq.'
    },
    {
      id: 'CAT_PENDIDIKAN',
      code: 'ZKT-EDU-02',
      name: 'Beasiswa Pendidikan Santri & Generasi Emas',
      asnaf: ['Fi Sabilillah', 'Ibnu Sabil'],
      targetAmount: 5000000000, // Rp 5.0 Miliar
      baseDistributedAmount: 4200000000, // 84.0%
      voucherCategoryKey: 'islamic_education',
      icon: BookOpen,
      themeColor: {
        bg: 'bg-teal-500/10',
        text: 'text-teal-700 dark:text-teal-400',
        border: 'border-teal-500/20',
        progressFill: 'from-teal-600 to-cyan-500',
        progressGlow: 'shadow-teal-500/30',
        badgeBg: 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800/50'
      },
      beneficiariesCount: 3850,
      unitLabel: 'Santri & Pelajar Dhuafa',
      locationScope: '120 Pesantren & Madrasah',
      kpiMilestone: '100% kelulusan & 84 santri hafiz 30 juz',
      description: 'Voucher SPP, buku digital, dan biaya hidup santri prasejahtera untuk menjamin keberlanjutan pendidikan Islam.'
    },
    {
      id: 'CAT_SEMBAKO',
      code: 'ZKT-FD-03',
      name: 'Pangan Darurat & Sembako Halal Mart',
      asnaf: ['Fakir', 'Miskin', 'Gharimin'],
      targetAmount: 4500000000, // Rp 4.5 Miliar
      baseDistributedAmount: 3870000000, // 86.0%
      voucherCategoryKey: 'halal_mart',
      icon: Utensils,
      themeColor: {
        bg: 'bg-amber-500/10',
        text: 'text-amber-700 dark:text-amber-400',
        border: 'border-amber-500/20',
        progressFill: 'from-amber-500 to-orange-500',
        progressGlow: 'shadow-amber-500/30',
        badgeBg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/50'
      },
      beneficiariesCount: 15600,
      unitLabel: 'Paket Sembako Tertebus',
      locationScope: 'Kawasan Padat & 3T',
      kpiMilestone: 'Zero kelaparan mustahiq di 42 titik binaan',
      description: 'Voucher pangan berkode QR aman yang hanya dapat ditebus untuk beras, minyak, dan kebutuhan pokok halal di toko mitra.'
    },
    {
      id: 'CAT_KESEHATAN',
      code: 'ZKT-HLT-04',
      name: 'Layanan Medis & Pengobatan Mustahiq',
      asnaf: ['Fakir', 'Miskin', 'Gharimin'],
      targetAmount: 3500000000, // Rp 3.5 Miliar
      baseDistributedAmount: 2520000000, // 72.0%
      voucherCategoryKey: 'ziswaf',
      icon: Stethoscope,
      themeColor: {
        bg: 'bg-blue-500/10',
        text: 'text-blue-700 dark:text-blue-400',
        border: 'border-blue-500/20',
        progressFill: 'from-blue-600 to-indigo-500',
        progressGlow: 'shadow-blue-500/30',
        badgeBg: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/50'
      },
      beneficiariesCount: 2240,
      unitLabel: 'Tindakan Medis & Pasien',
      locationScope: '18 RS Islam & Klinik Pratama',
      kpiMilestone: 'Rata-rata respon ambulans darurat < 25 menit',
      description: 'Subsidi biaya cuci darah, operasi katarak dhuafa, penebusan obat kronis, dan layanan ambulans gratis.'
    },
    {
      id: 'CAT_DAKWAH',
      code: 'ZKT-DKW-05',
      name: 'Dakwah Pedalaman & Pembinaan Muallaf',
      asnaf: ['Muallaf', 'Fi Sabilillah'],
      targetAmount: 3000000000, // Rp 3.0 Miliar
      baseDistributedAmount: 1980000000, // 66.0%
      voucherCategoryKey: 'masjid_community',
      icon: Compass,
      themeColor: {
        bg: 'bg-purple-500/10',
        text: 'text-purple-700 dark:text-purple-400',
        border: 'border-purple-500/20',
        progressFill: 'from-purple-600 to-violet-500',
        progressGlow: 'shadow-purple-500/30',
        badgeBg: 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/50'
      },
      beneficiariesCount: 1310,
      unitLabel: 'Da\'i & Muallaf Terdampingi',
      locationScope: 'Perbatasan & Suku Terpencil',
      kpiMilestone: 'Penyelenggaraan kajian rutin di 65 pos dakwah',
      description: 'Kafalah da\'i penjuru nusantara serta paket kemandirian ekonomi bagi muallaf yang kehilangan mata pencaharian.'
    },
    {
      id: 'CAT_WAKAF_AIR',
      code: 'ZKT-WTR-06',
      name: 'Sarana Air Bersih & Sanitasi Desa Dhuafa',
      asnaf: ['Fi Sabilillah', 'Fakir'],
      targetAmount: 2500000000, // Rp 2.5 Miliar
      baseDistributedAmount: 1650000000, // 66.0%
      voucherCategoryKey: 'masjid_community',
      icon: Droplets,
      themeColor: {
        bg: 'bg-sky-500/10',
        text: 'text-sky-700 dark:text-sky-400',
        border: 'border-sky-500/20',
        progressFill: 'from-sky-600 to-blue-500',
        progressGlow: 'shadow-sky-500/30',
        badgeBg: 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800/50'
      },
      beneficiariesCount: 36,
      unitLabel: 'Titik Sumur Bor & MCK',
      locationScope: 'Daerah Rawan Kekeringan',
      kpiMilestone: 'Mengaliri air bersih untuk 18.000 jiwa',
      description: 'Pembangunan sumur bor dalam (deep well), pipanisasi sumber mata air pegunungan, dan filter air minum masjid pedesaan.'
    }
  ], []);

  // Compute Live Real-time Distribution incorporating live Vouchers from the app!
  const computedCategories = useMemo(() => {
    return categoriesDefinition.map(cat => {
      // Find vouchers matching this category key
      const matchingVouchers = vouchers.filter(v => {
        if (!cat.voucherCategoryKey) return false;
        return v.category === cat.voucherCategoryKey;
      });

      // Sum face value of redeemed or active vouchers that represent live allocated Zakat
      const liveVoucherAllocation = matchingVouchers.reduce((acc, v) => {
        // redeemed vouchers count as 100% distributed, active as 50% allocated in transit
        const distributedPart = (v.faceValue - v.remainingBalance) + (v.status === 'ACTIVE' ? v.remainingBalance * 0.4 : 0);
        return acc + distributedPart;
      }, 0);

      const boost = simulatedBoost[cat.id] || 0;
      const currentRealized = Math.min(cat.targetAmount, cat.baseDistributedAmount + liveVoucherAllocation + boost);
      const remaining = Math.max(0, cat.targetAmount - currentRealized);
      const percentage = Math.min(100, (currentRealized / cat.targetAmount) * 100);

      let velocityStatus: 'AHEAD' | 'ON_TRACK' | 'ACCELERATING' | 'NEEDS_FOCUS' = 'ON_TRACK';
      if (percentage >= 85) velocityStatus = 'AHEAD';
      else if (percentage >= 75) velocityStatus = 'ON_TRACK';
      else if (percentage >= 65) velocityStatus = 'ACCELERATING';
      else velocityStatus = 'NEEDS_FOCUS';

      return {
        ...cat,
        currentRealized,
        remaining,
        percentage,
        velocityStatus,
        activeVouchersInCatalog: matchingVouchers.length,
      };
    });
  }, [categoriesDefinition, vouchers, simulatedBoost]);

  // Aggregate Totals across all project categories
  const overallMetrics = useMemo(() => {
    const totalTarget = computedCategories.reduce((acc, c) => acc + c.targetAmount, 0);
    const totalRealized = computedCategories.reduce((acc, c) => acc + c.currentRealized, 0);
    const totalRemaining = Math.max(0, totalTarget - totalRealized);
    const overallPercentage = totalTarget > 0 ? (totalRealized / totalTarget) * 100 : 0;
    const totalBeneficiaries = computedCategories.reduce((acc, c) => acc + c.beneficiariesCount, 0);

    return {
      totalTarget,
      totalRealized,
      totalRemaining,
      overallPercentage,
      totalBeneficiaries,
      totalProjectsCount: computedCategories.length,
    };
  }, [computedCategories]);

  // Filtered categories according to Asnaf selection
  const filteredCategories = useMemo(() => {
    if (selectedAsnaf === 'ALL') return computedCategories;
    return computedCategories.filter(cat => cat.asnaf.includes(selectedAsnaf));
  }, [computedCategories, selectedAsnaf]);

  // Active Category for detailed inspection
  const activeCategory = useMemo(() => {
    return computedCategories.find(c => c.id === selectedCategoryId) || computedCategories[0];
  }, [computedCategories, selectedCategoryId]);

  // Handle Quick Real-time Simulation Boost (+Rp 50.000.000) to show progress bar movement
  const handleSimulateDisbursement = (catId: string, catName: string) => {
    sounds.playSuccess();
    const boostAmount = 50000000; // Rp 50 Juta
    setSimulatedBoost(prev => ({
      ...prev,
      [catId]: (prev[catId] || 0) + boostAmount,
    }));

    setFeedbackMessage(`+Rp 50 Juta berhasil disalurkan ke "${catName}" (Progress bar ter-update otomatis)`);
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  // Reset simulation
  const handleResetSimulation = () => {
    sounds.playClick();
    setSimulatedBoost({});
    setFeedbackMessage('Data penyaluran dikembalikan ke pembukuan standar.');
    setTimeout(() => setFeedbackMessage(null), 2500);
  };

  return (
    <section 
      id="smart-zakat-distribution-dashboard"
      aria-label="Smart Zakat Distribution Dashboard"
      className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] shadow-sm space-y-6 relative overflow-hidden"
    >
      {/* Decorative Sharia Watermark Glow */}
      <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-teal-500/5 blur-3xl pointer-events-none" />

      {/* SECTION HEADER: Title, Target Badge, & Interactive Controls */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-100 dark:border-white/[0.06] pb-5">
        
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
              <Target className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              SMART ZAKAT DISTRIBUTION (BAZNAS ALIGNED)
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-[#18181D] border border-slate-200 dark:border-white/[0.06]">
              <Calendar className="w-3 h-3 text-emerald-500" />
              Tahun Anggaran 1447 H / 2026 M
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono text-teal-600 dark:text-teal-400 bg-teal-500/10 border border-teal-500/20">
              <Sparkles className="w-3 h-3 animate-pulse" />
              Live Ledger Synced
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>Dashboard Penyaluran Zakat Cerdas</span>
          </h2>

          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            Pemantauan real-time realisasi target distribusi Zakat, Infaq & Sedekah per kategori proyek mustahiq dengan sistem verifikasi voucher digital anti-salah-sasaran (8 Asnaf DSN-MUI).
          </p>
        </div>

        {/* Action Controls & Fiscal Year Toggle */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-start lg:justify-end">
          
          {/* Fiscal Period Switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-[#18181D] p-1 rounded-xl border border-slate-200 dark:border-white/[0.08] text-xs">
            <button
              type="button"
              onClick={() => {
                sounds.playToggle();
                setSelectedFiscalYear('2026');
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                selectedFiscalYear === '2026'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              TA 2026
            </button>
            <button
              type="button"
              onClick={() => {
                sounds.playToggle();
                setSelectedFiscalYear('1447H');
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                selectedFiscalYear === '1447H'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              1447 H
            </button>
            <button
              type="button"
              onClick={() => {
                sounds.playToggle();
                setSelectedFiscalYear('Q3_2026');
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                selectedFiscalYear === 'Q3_2026'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Kuartal 3
            </button>
          </div>

          {/* Issue Zakat Voucher CTA */}
          {onOpenIssueModal && (
            <button
              id="smart-zakat-issue-voucher-btn"
              type="button"
              onClick={() => {
                sounds.playClick();
                onOpenIssueModal();
              }}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/25 transition-all flex items-center gap-1.5 hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" />
              <span>Terbitkan Voucher Zakat</span>
            </button>
          )}

          {/* Export Report CTA */}
          {onOpenExportModal && (
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onOpenExportModal();
              }}
              className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-[#18181D] hover:bg-slate-200 dark:hover:bg-[#222228] text-slate-700 dark:text-slate-300 font-bold text-xs border border-slate-200 dark:border-white/[0.08] transition-all flex items-center gap-1.5"
              title="Unduh Laporan Penyaluran Zakat BAZNAS / OJK"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden sm:inline">Laporan Asnaf</span>
            </button>
          )}
        </div>

      </div>

      {/* TOAST FEEDBACK NOTIFICATION */}
      {feedbackMessage && (
        <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 text-xs flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{feedbackMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackMessage(null)}
            className="text-xs font-bold hover:underline"
          >
            Tutup
          </button>
        </div>
      )}

      {/* OVERALL ANNUAL AGGREGATE SUMMARY HERO CARD */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-[#111722] to-emerald-950 text-white border border-emerald-500/30 shadow-lg relative overflow-hidden">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          
          {/* Main Numbers */}
          <div className="space-y-3 flex-1">
            <div className="flex items-center justify-between sm:justify-start gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Target Distribusi Nasional 1447 H
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Pencapaian: {overallMetrics.overallPercentage.toFixed(1)}%
              </span>
            </div>

            <div className="flex flex-wrap items-baseline gap-3">
              <div className="text-2xl sm:text-4xl font-black font-mono tracking-tight text-white">
                Rp {overallMetrics.totalRealized.toLocaleString('id-ID')}
              </div>
              <div className="text-xs sm:text-sm text-slate-300 font-mono">
                / Rp {overallMetrics.totalTarget.toLocaleString('id-ID')}
              </div>
            </div>

            {/* Micro Details */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Tersisa: <strong className="font-mono text-white">Rp {overallMetrics.totalRemaining.toLocaleString('id-ID')}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-teal-400" />
                <span>Penerima Manfaat: <strong className="font-mono text-white">{overallMetrics.totalBeneficiaries.toLocaleString('id-ID')} Jiwa / KK</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-blue-400" />
                <span>6 Kluster Kategori</span>
              </div>
            </div>
          </div>

          {/* Circular Percentage Quick Visual */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 border-t sm:border-t-0 pt-4 sm:pt-0 border-white/10">
            <div className="text-left sm:text-right">
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Status Laju Distribusi</div>
              <div className="text-xs font-bold text-emerald-400 flex items-center sm:justify-end gap-1 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Sesuai Proyeksi (On Schedule)</span>
              </div>
            </div>

            {Object.keys(simulatedBoost).length > 0 && (
              <button
                type="button"
                onClick={handleResetSimulation}
                className="text-[11px] font-mono text-amber-400 hover:text-amber-300 underline flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset Simulasi (+{Object.keys(simulatedBoost).length})</span>
              </button>
            )}
          </div>

        </div>

        {/* OVERALL ANIMATED PROGRESS BAR */}
        <div className="mt-5 space-y-2 relative z-10">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
            <span className="flex items-center gap-1">
              <span>Progres Agregat Realisasi</span>
              <span className="text-emerald-400 font-bold">({overallMetrics.overallPercentage.toFixed(1)}%)</span>
            </span>
            <span>Target Akhir Tahun: 100%</span>
          </div>

          {/* Progress Bar Container */}
          <div className="h-4 sm:h-5 w-full bg-slate-800/90 rounded-full p-0.5 overflow-hidden border border-white/15 relative">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-700 ease-out relative shadow-[0_0_15px_rgba(16,185,129,0.5)]"
              style={{ width: `${Math.min(100, Math.max(2, overallMetrics.overallPercentage))}%` }}
            >
              {/* Shimmer / light effect on progress bar */}
              <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
            </div>

            {/* Quarter Milestones Markers (25%, 50%, 75%) */}
            <div className="absolute top-0 bottom-0 left-1/4 w-0.5 bg-white/25 pointer-events-none" title="Target Q1: 25%" />
            <div className="absolute top-0 bottom-0 left-2/4 w-0.5 bg-white/25 pointer-events-none" title="Target Q2: 50%" />
            <div className="absolute top-0 bottom-0 left-3/4 w-0.5 bg-white/25 pointer-events-none" title="Target Q3: 75%" />
          </div>

          {/* Milestone Labels */}
          <div className="flex justify-between text-[10px] font-mono text-slate-400 px-1 pt-0.5">
            <span>0% (Jan)</span>
            <span>Q1 (25%)</span>
            <span>Q2 (50%)</span>
            <span className="text-emerald-400 font-bold">Q3 (75% - Sekarang)</span>
            <span>100% (Des)</span>
          </div>
        </div>

      </div>

      {/* ASNAF FILTER BUTTONS & QUICK STATS */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
        
        {/* Asnaf Chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Asnaf:
          </span>

          {[
            { id: 'ALL', label: 'Semua 8 Asnaf' },
            { id: 'Fakir', label: 'Fakir' },
            { id: 'Miskin', label: 'Miskin' },
            { id: 'Fi Sabilillah', label: 'Fi Sabilillah' },
            { id: 'Ibnu Sabil', label: 'Ibnu Sabil' },
            { id: 'Muallaf', label: 'Muallaf' },
            { id: 'Gharimin', label: 'Gharimin' },
          ].map(asnafItem => (
            <button
              key={asnafItem.id}
              type="button"
              onClick={() => {
                sounds.playClick();
                setSelectedAsnaf(asnafItem.id);
              }}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                selectedAsnaf === asnafItem.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-[#18181D] text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-[#222228]'
              }`}
            >
              {asnafItem.label}
            </button>
          ))}
        </div>

        {/* Real-time Indicator */}
        <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>Live Calculation ({filteredCategories.length} Kategori Tampil)</span>
        </div>

      </div>

      {/* PROJECT CATEGORIES GRID: EACH WITH DEDICATED PROGRESS BAR */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCategories.map((category) => {
          const Icon = category.icon;
          const isSelected = selectedCategoryId === category.id;

          return (
            <div
              key={category.id}
              onClick={() => {
                sounds.playClick();
                setSelectedCategoryId(category.id);
              }}
              className={`p-5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between space-y-4 ${
                isSelected
                  ? 'bg-white dark:bg-[#151519] border-emerald-500 dark:border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                  : 'bg-white dark:bg-[#121215] border-slate-200 dark:border-white/[0.08] hover:border-emerald-500/40 dark:hover:border-emerald-500/40 shadow-xs'
              }`}
            >
              
              {/* Card Header: Icon, Category Name, Asnaf Badges */}
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-xl ${category.themeColor.bg} ${category.themeColor.text} flex items-center justify-center border ${category.themeColor.border} shrink-0`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                        {category.code}
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                        {category.name}
                      </h3>
                    </div>
                  </div>

                  {/* Percentage Pill */}
                  <div className={`px-2 py-0.5 rounded-lg text-xs font-mono font-bold shrink-0 ${
                    category.percentage >= 80 
                      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30' 
                      : category.percentage >= 70
                      ? 'bg-teal-500/15 text-teal-700 dark:text-teal-400 border border-teal-500/30'
                      : 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30'
                  }`}>
                    {category.percentage.toFixed(1)}%
                  </div>
                </div>

                {/* Asnaf tags */}
                <div className="flex flex-wrap items-center gap-1 pt-1">
                  <span className="text-[10px] font-mono text-slate-400 mr-1">Asnaf:</span>
                  {category.asnaf.map((asnafName, idx) => (
                    <span 
                      key={idx}
                      className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-[#1c1c22] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/[0.06]"
                    >
                      {asnafName}
                    </span>
                  ))}
                </div>
              </div>

              {/* Realized vs Target Numbers */}
              <div className="space-y-1">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Realisasi Zakat:</span>
                  <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                    Rp {category.currentRealized.toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="flex items-baseline justify-between text-[11px] text-slate-400 font-mono">
                  <span>Target Tahunan:</span>
                  <span>Rp {category.targetAmount.toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* CATEGORY PROGRESS BAR VISUALIZATION */}
              <div className="space-y-1.5">
                <div className="h-2.5 w-full bg-slate-100 dark:bg-[#1a1a20] rounded-full overflow-hidden border border-slate-200 dark:border-white/[0.06] relative">
                  <div 
                    className={`h-full rounded-full bg-gradient-to-r ${category.themeColor.progressFill} transition-all duration-500 ${category.themeColor.progressGlow} shadow-xs`}
                    style={{ width: `${Math.min(100, Math.max(3, category.percentage))}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>Sisa: Rp {(category.remaining / 1000000).toFixed(0)} Juta</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {category.beneficiariesCount.toLocaleString('id-ID')} {category.unitLabel}
                  </span>
                </div>
              </div>

              {/* Bottom Card Footer: Interactive simulate button + Details indicator */}
              <div className="pt-2 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSimulateDisbursement(category.id, category.name);
                  }}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 dark:bg-[#1a1a20] hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 border border-slate-200 dark:border-white/[0.08] transition-all flex items-center gap-1"
                  title="Simulasikan Penyaluran +Rp 50 Juta untuk Menguji Gerakan Progress Bar"
                >
                  <Plus className="w-3 h-3 text-emerald-500" />
                  <span>+50 Jt Cepat</span>
                </button>

                <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  <span>Lihat Detail</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* SELECTED CATEGORY DRILLDOWN & AUDIT TRAIL INSPECTION PANEL */}
      {activeCategory && (
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.08] space-y-4 animate-fade-in">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 dark:border-white/[0.06] pb-3">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${activeCategory.themeColor.bg} ${activeCategory.themeColor.text} flex items-center justify-center border ${activeCategory.themeColor.border} shrink-0`}>
                <activeCategory.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-white dark:bg-[#202026] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/[0.08]">
                    {activeCategory.code}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Kepatuhan Akad Fikih 100% (DSN-MUI)
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  Rincian Penyaluran: {activeCategory.name}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleSimulateDisbursement(activeCategory.id, activeCategory.name)}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5"
              >
                <Coins className="w-3.5 h-3.5" />
                <span>Salurkan Dana Zakat (+Rp 50 Jt)</span>
              </button>
            </div>
          </div>

          {/* Description & Impact Metrics */}
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {activeCategory.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            
            <div className="p-3 rounded-xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.06]">
              <div className="text-[10px] font-mono uppercase text-slate-400">Target Tahunan (Budget)</div>
              <div className="text-base font-black font-mono text-slate-900 dark:text-white mt-0.5">
                Rp {activeCategory.targetAmount.toLocaleString('id-ID')}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Ditetapkan Dewan Syariah</div>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.06]">
              <div className="text-[10px] font-mono uppercase text-slate-400">Telah Terealisasi</div>
              <div className="text-base font-black font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                Rp {activeCategory.currentRealized.toLocaleString('id-ID')}
              </div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 font-semibold">
                {activeCategory.percentage.toFixed(1)}% dari target tahunan
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.06]">
              <div className="text-[10px] font-mono uppercase text-slate-400">Jangkauan Wilayah</div>
              <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 truncate">
                {activeCategory.locationScope}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                {activeCategory.beneficiariesCount.toLocaleString('id-ID')} {activeCategory.unitLabel}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.06]">
              <div className="text-[10px] font-mono uppercase text-slate-400">Capaian Dampak (KPI)</div>
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5 line-clamp-2">
                {activeCategory.kpiMilestone}
              </div>
            </div>

          </div>

        </div>
      )}

    </section>
  );
};
