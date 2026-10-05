import React, { useState, useMemo } from 'react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Sector 
} from 'recharts';
import { 
  Layers, 
  Scale, 
  ShieldCheck, 
  Info, 
  TrendingUp, 
  Coins, 
  Ticket, 
  ChevronRight, 
  Sparkles, 
  BookOpen 
} from 'lucide-react';
import { Voucher, Language, ShariaContract } from '../../types';
import { translations } from '../../utils/translations';
import { sounds } from '../../utils/soundEffects';

interface ShariaContractDonutChartProps {
  vouchers: Voucher[];
  currentLang: Language;
  onViewVoucherDetails?: (v: Voucher) => void;
}

interface ContractMeta {
  name: ShariaContract;
  arabic: string;
  color: string;
  hoverColor: string;
  bgLight: string;
  fatwa: string;
  description: string;
  corePrinciple: string;
}

const CONTRACT_METADATA: Record<string, ContractMeta> = {
  'Wakalah bil Ujrah': {
    name: 'Wakalah bil Ujrah',
    arabic: 'الوِكَالَةُ بِالأُجْرَة',
    color: '#059669', // Emerald-600
    hoverColor: '#10b981',
    bgLight: 'rgba(5, 150, 105, 0.1)',
    fatwa: 'Fatwa DSN-MUI No. 113/DSN-MUI/IX/2017 & No. 52/2006',
    description: 'Pelimpahan kuasa perwakilan dari penerbit kepada platform untuk memproses penyaluran sembako & jasa dengan imbalan ujrah tetap yang transparan.',
    corePrinciple: 'Pemberian Kuasa + Ujrah Pasti Tanpa Riba',
  },
  'Hibah / Tabarru': {
    name: 'Hibah / Tabarru',
    arabic: 'الهِبَة / التَّبَرُّع',
    color: '#10b981', // Emerald-500
    hoverColor: '#34d399',
    bgLight: 'rgba(16, 185, 129, 0.1)',
    fatwa: 'Fatwa DSN-MUI No. 116/DSN-MUI/IX/2017 (ZISWAF & Kemanusiaan)',
    description: 'Akad pemberian sukarela untuk tujuan kebajikan sosial (Tamlik mutlak), bebas biaya potongan ujrah bagi penerima manfaat (Mustahik).',
    corePrinciple: 'Tabarru murni tanpa syarat komersial',
  },
  'Mudharabah': {
    name: 'Mudharabah',
    arabic: 'المُضَارَبَة',
    color: '#f59e0b', // Amber-500
    hoverColor: '#fbbf24',
    bgLight: 'rgba(245, 158, 11, 0.1)',
    fatwa: 'Fatwa DSN-MUI No. 115/DSN-MUI/IX/2017 & No. 07/2000',
    description: 'Kemitraan bagi hasil usaha halal antara Shahibul Mal (penyedia dana voucher produktif) dan Mudharib (pengelola UMKM mitra).',
    corePrinciple: 'Nisbah Bagi Hasil Proporsional Sesuai Realisasi',
  },
  'Wadiah Yad Dhamanah': {
    name: 'Wadiah Yad Dhamanah',
    arabic: 'الوَدِيعَةُ يَدُ الضَّمَانَة',
    color: '#3b82f6', // Blue-500
    hoverColor: '#60a5fa',
    bgLight: 'rgba(59, 130, 246, 0.1)',
    fatwa: 'Fatwa DSN-MUI No. 86/DSN-MUI/XII/2012 & Standar AAOIFI',
    description: 'Titipan dana likuiditas voucher yang dijamin keutuhannya 100% dan ditempatkan pada rekening giro/escrow bank syariah mitra.',
    corePrinciple: 'Jaminan Keutuhan Pokok Titipan 100%',
  },
};

export const ShariaContractDonutChart: React.FC<ShariaContractDonutChartProps> = ({
  vouchers,
  currentLang,
  onViewVoucherDetails,
}) => {
  const t = translations[currentLang];
  const [metricMode, setMetricMode] = useState<'count' | 'nominal'>('count');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Compute Distribution Data
  const contractStats = useMemo(() => {
    const totalCount = vouchers.length;
    const totalNominal = vouchers.reduce((acc, v) => acc + (v.remainingBalance || v.faceValue), 0);

    const contractMap = new Map<string, { count: number; nominal: number; vouchers: Voucher[] }>();

    // Initialize all standard contracts
    Object.keys(CONTRACT_METADATA).forEach((key) => {
      contractMap.set(key, { count: 0, nominal: 0, vouchers: [] });
    });

    // Populate from actual voucher data
    vouchers.forEach((v) => {
      const contractKey = v.shariaContract || 'Wakalah bil Ujrah';
      if (!contractMap.has(contractKey)) {
        contractMap.set(contractKey, { count: 0, nominal: 0, vouchers: [] });
      }
      const item = contractMap.get(contractKey)!;
      item.count += 1;
      item.nominal += (v.remainingBalance || v.faceValue);
      item.vouchers.push(v);
    });

    // Build chart array
    const chartData = Array.from(contractMap.entries())
      .map(([name, data]) => {
        const meta = CONTRACT_METADATA[name] || {
          name: name as ShariaContract,
          arabic: 'عَقْدٌ شَرْعِيّ',
          color: '#8b5cf6',
          hoverColor: '#a78bfa',
          bgLight: 'rgba(139, 92, 246, 0.1)',
          fatwa: 'Fatwa Standar DSN-MUI FinTech',
          description: 'Akad kepatuhan syariah pada voucher digital IslamiCityPay.',
          corePrinciple: 'Bebas Riba, Gharar, dan Maysir',
        };

        const countPercent = totalCount > 0 ? (data.count / totalCount) * 100 : 0;
        const nominalPercent = totalNominal > 0 ? (data.nominal / totalNominal) * 100 : 0;
        const value = metricMode === 'count' ? data.count : data.nominal;

        return {
          name,
          value,
          count: data.count,
          nominal: data.nominal,
          countPercent,
          nominalPercent,
          activePercent: metricMode === 'count' ? countPercent : nominalPercent,
          meta,
          vouchers: data.vouchers,
        };
      })
      .filter((item) => item.count > 0 || vouchers.length === 0);

    return {
      chartData,
      totalCount,
      totalNominal,
    };
  }, [vouchers, metricMode]);

  // Active or Default selected contract item
  const selectedContract = useMemo(() => {
    if (activeIndex !== null && contractStats.chartData[activeIndex]) {
      return contractStats.chartData[activeIndex];
    }
    return contractStats.chartData[0] || null;
  }, [activeIndex, contractStats.chartData]);

  // Custom Active Shape Renderer for smooth interactive Donut Slice expansion
  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius - 2}
          outerRadius={outerRadius + 6}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          style={{ filter: 'drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.35))' }}
        />
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={outerRadius + 8}
          outerRadius={outerRadius + 11}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      </g>
    );
  };

  return (
    <div 
      className="p-5 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] shadow-sm space-y-4 relative overflow-hidden" 
      id="sharia-contract-donut-chart-card"
    >
      {/* Header & Metric Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100 dark:border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <span>Distribusi Voucher Berdasarkan Akad Syariah</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                  DSN-MUI
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Analisis proporsi instrumen syariah (Mudharabah, Wadiah, Wakalah, Hibah)
              </p>
            </div>
          </div>
        </div>

        {/* Metric Selector Toggle (Jumlah Lembar vs Nominal Rupiah) */}
        <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-[#18181D] rounded-xl border border-slate-200 dark:border-white/[0.08] self-start sm:self-auto">
          <button
            id="sharia-metric-count-btn"
            onClick={() => {
              sounds.playClick();
              setMetricMode('count');
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              metricMode === 'count'
                ? 'bg-white dark:bg-[#25252d] text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>Jumlah Lembar</span>
          </button>

          <button
            id="sharia-metric-nominal-btn"
            onClick={() => {
              sounds.playClick();
              setMetricMode('nominal');
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              metricMode === 'nominal'
                ? 'bg-white dark:bg-[#25252d] text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            <span>Total Nominal (Rp)</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Donut Chart with Center Stat vs Right Detail Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        
        {/* Left Column: Donut Chart Area (5 Cols) */}
        <div className="md:col-span-5 flex flex-col items-center justify-center relative">
          <div className="w-full h-52 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={contractStats.chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={56}
                  outerRadius={82}
                  paddingAngle={4}
                  dataKey="value"
                  activeIndex={activeIndex !== null ? activeIndex : undefined}
                  activeShape={renderActiveShape}
                  onMouseEnter={(_, index) => {
                    setActiveIndex(index);
                  }}
                  onMouseLeave={() => {
                    // Keep the last hovered or reset
                  }}
                >
                  {contractStats.chartData.map((entry, index) => (
                    <Cell 
                      key={`contract-cell-${index}`} 
                      fill={entry.meta.color}
                      stroke="rgba(0,0,0,0.2)"
                      strokeWidth={1}
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-3 bg-[#16161A]/95 backdrop-blur-md border border-white/10 rounded-xl shadow-xl text-xs space-y-1 z-50 text-white min-w-[190px]">
                          <div className="flex items-center gap-2">
                            <span 
                              className="w-2.5 h-2.5 rounded-full" 
                              style={{ backgroundColor: data.meta.color }} 
                            />
                            <span className="font-bold">{data.name}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono italic">
                            {data.meta.arabic}
                          </div>
                          <div className="pt-1.5 border-t border-white/[0.08] space-y-0.5 text-[11px]">
                            <div className="flex justify-between">
                              <span className="text-slate-400">Porsi:</span>
                              <span className="font-mono font-bold text-emerald-400">
                                {data.activePercent.toFixed(1)}%
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Jumlah:</span>
                              <span className="font-mono font-bold">{data.count} Voucher</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Total Nilai:</span>
                              <span className="font-mono font-bold text-teal-300">
                                Rp {data.nominal.toLocaleString('id-ID')}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Centered Donut Summary Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {metricMode === 'count' ? 'Total Voucher' : 'Total Nilai'}
              </span>
              <span className="text-sm sm:text-base font-black font-mono text-slate-900 dark:text-white leading-tight">
                {metricMode === 'count' ? (
                  `${contractStats.totalCount} Lembar`
                ) : (
                  `Rp ${(contractStats.totalNominal / 1000000).toFixed(1)}Jt`
                )}
              </span>
              <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-medium">
                100% Syariah
              </span>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 text-center font-mono">
            Hover segmen untuk inspeksi klausul akad
          </div>
        </div>

        {/* Right Column: Interactive Contract Legend & Fiqh Details Card (7 Cols) */}
        <div className="md:col-span-7 space-y-3">
          
          {/* Interactive Legend Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {contractStats.chartData.map((item, idx) => {
              const isSelected = selectedContract?.name === item.name;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    sounds.playClick();
                    setActiveIndex(idx);
                  }}
                  onMouseEnter={() => setActiveIndex(idx)}
                  className={`p-2.5 rounded-xl border text-left transition-all flex items-start justify-between gap-2 ${
                    isSelected
                      ? 'bg-slate-50 dark:bg-[#1a1a22] border-emerald-500/50 shadow-xs scale-[1.02]'
                      : 'bg-white dark:bg-[#16161A] border-slate-200/80 dark:border-white/[0.06] hover:border-slate-300 dark:hover:border-white/[0.12]'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span 
                        className="w-2.5 h-2.5 rounded-full shrink-0" 
                        style={{ backgroundColor: item.meta.color }} 
                      />
                      <span className="font-bold text-xs text-slate-800 dark:text-slate-200 line-clamp-1">
                        {item.name}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono pl-4">
                      {item.meta.arabic}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-black font-mono text-emerald-600 dark:text-emerald-400 block">
                      {item.activePercent.toFixed(1)}%
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {metricMode === 'count' ? `${item.count} lbr` : `Rp ${(item.nominal / 1000).toLocaleString('id-ID')}k`}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detailed Selected Contract Sharia Compliance Card */}
          {selectedContract && (
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.08] space-y-2 text-xs animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: selectedContract.meta.color }} 
                  />
                  <strong className="text-slate-900 dark:text-white text-xs">
                    {selectedContract.name} ({selectedContract.meta.arabic})
                  </strong>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-mono font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-500" />
                  DSN-MUI CERTIFIED
                </span>
              </div>

              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedContract.meta.description}
              </p>

              <div className="pt-2 border-t border-slate-200 dark:border-white/[0.06] flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                <div className="flex items-center gap-1">
                  <BookOpen className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span>{selectedContract.meta.fatwa}</span>
                </div>
                <div className="text-emerald-700 dark:text-emerald-400 font-bold">
                  Karakteristik: {selectedContract.meta.corePrinciple}
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Bottom Sharia Assurance Bar */}
      <div className="p-2.5 rounded-xl bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-500/20 flex flex-wrap items-center justify-between gap-2 text-[11px] text-emerald-800 dark:text-emerald-300">
        <div className="flex items-center gap-1.5 font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Seluruh penerbitan dan penebusan voucher diverifikasi otomatis terhadap klausul akad syariah yang sah.</span>
        </div>
        <div className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
          ZERO-RIBA & ZERO-GHARAR
        </div>
      </div>

    </div>
  );
};
