import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  Coins, 
  Sparkles, 
  Scale, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Layers, 
  ArrowRight, 
  TrendingUp, 
  ShieldCheck, 
  BookOpen, 
  Copy, 
  Check, 
  RefreshCw, 
  DollarSign, 
  Users, 
  Sliders, 
  Briefcase, 
  Building2, 
  PieChart, 
  FileText, 
  Gift, 
  ExternalLink 
} from 'lucide-react';
import { Voucher, Language } from '../../types';
import { translations } from '../../utils/translations';
import { sounds } from '../../utils/soundEffects';

interface ZakatCalculatorModuleProps {
  currentLang: Language;
  vouchers: Voucher[];
  onShowToast?: (message: string) => void;
  onUpdateVoucher?: (updated: Voucher) => void;
}

export type ZakatCategoryType = 'maal' | 'profesi' | 'perniagaan' | 'emas' | 'fitrah';

export const ZakatCalculatorModule: React.FC<ZakatCalculatorModuleProps> = ({
  currentLang,
  vouchers,
  onShowToast,
  onUpdateVoucher,
}) => {
  const t = translations[currentLang];

  // Active Calculator Tab
  const [zakatType, setZakatType] = useState<ZakatCategoryType>('maal');

  // Custom Nisab Benchmark Prices
  const [goldPricePerGram, setGoldPricePerGram] = useState<number>(1350000); // Rp 1.350.000 / gr (Standard 2026)
  const [silverPricePerGram, setSilverPricePerGram] = useState<number>(16000); // Rp 16.000 / gr
  const [ricePricePerKg, setRicePricePerKg] = useState<number>(15000); // Rp 15.000 / kg
  const [isNisabCustomizerOpen, setIsNisabCustomizerOpen] = useState(false);

  // Selected Voucher to Link
  const [selectedVoucherId, setSelectedVoucherId] = useState<string>(
    vouchers.find(v => v.category === 'ziswaf')?.id || vouchers[0]?.id || ''
  );
  const [useVoucherAsAsset, setUseVoucherAsAsset] = useState<boolean>(false);

  // Form Inputs for Zakat Maal (Savings / Liquid Wealth)
  const [maalSavings, setMaalSavings] = useState<number>(125000000);
  const [maalInvestments, setMaalInvestments] = useState<number>(25000000);
  const [maalOtherAssets, setMaalOtherAssets] = useState<number>(0);
  const [maalShortLiabilities, setMaalShortLiabilities] = useState<number>(10000000);
  const [maalHaulMet, setMaalHaulMet] = useState<boolean>(true);

  // Form Inputs for Zakat Profesi (Income / Salary)
  const [incomeMonthlySalary, setIncomeMonthlySalary] = useState<number>(15000000);
  const [incomeOtherMonthly, setIncomeOtherMonthly] = useState<number>(3000000);
  const [incomeBasicExpenses, setIncomeBasicExpenses] = useState<number>(6000000);
  const [incomePeriod, setIncomePeriod] = useState<'monthly' | 'annual'>('monthly');

  // Form Inputs for Zakat Perniagaan (Business / Trade)
  const [businessCurrentAssets, setBusinessCurrentAssets] = useState<number>(200000000);
  const [businessInventory, setBusinessInventory] = useState<number>(80000000);
  const [businessCashReceivables, setBusinessCashReceivables] = useState<number>(40000000);
  const [businessShortLiabilities, setBusinessShortLiabilities] = useState<number>(50000000);

  // Form Inputs for Zakat Emas (Gold Bullion / Jewelry)
  const [goldWeightGrams, setGoldWeightGrams] = useState<number>(95);
  const [goldUsedForAdornment, setGoldUsedForAdornment] = useState<number>(10);

  // Form Inputs for Zakat Fitrah
  const [fitrahFamilyCount, setFitrahFamilyCount] = useState<number>(4);

  // Copy state
  const [copiedReport, setCopiedReport] = useState(false);

  // Linked selected voucher object
  const linkedVoucher = useMemo(() => {
    return vouchers.find((v) => v.id === selectedVoucherId) || null;
  }, [vouchers, selectedVoucherId]);

  // Derived Nisab Thresholds
  const annualGoldNisab = useMemo(() => 85 * goldPricePerGram, [goldPricePerGram]); // 85 gram emas
  const monthlyGoldNisab = useMemo(() => annualGoldNisab / 12, [annualGoldNisab]);
  const silverNisab = useMemo(() => 595 * silverPricePerGram, [silverPricePerGram]); // 595 gram perak

  // Main Calculation Logic
  const calculationResult = useMemo(() => {
    let totalNetAsset = 0;
    let applicableNisab = annualGoldNisab;
    let isNisabMet = false;
    let calculatedZakatAmount = 0;
    let ratePercentage = 2.5;
    let calculationFormula = '';
    let categoryTitle = '';
    let fatwaReference = '';

    // Apply voucher balance if toggled
    const voucherBonus = (useVoucherAsAsset && linkedVoucher) ? linkedVoucher.remainingBalance : 0;

    switch (zakatType) {
      case 'maal': {
        categoryTitle = 'Zakat Maal (Harta Simpanan / Deposito)';
        const gross = maalSavings + maalInvestments + maalOtherAssets + voucherBonus;
        totalNetAsset = Math.max(0, gross - maalShortLiabilities);
        applicableNisab = annualGoldNisab;
        isNisabMet = totalNetAsset >= applicableNisab && maalHaulMet;
        calculatedZakatAmount = isNisabMet ? totalNetAsset * 0.025 : 0;
        calculationFormula = `(${gross.toLocaleString('id-ID')} - ${maalShortLiabilities.toLocaleString('id-ID')}) × 2.5%`;
        fatwaReference = 'Fatwa DSN-MUI No. 116 & Peraturan BAZNAS No. 3/2018 (Nisab 85g Emas & Haul 1 Tahun)';
        break;
      }

      case 'profesi': {
        categoryTitle = 'Zakat Penghasilan / Profesi (SK BAZNAS No. 1/2024)';
        const totalIncome = incomeMonthlySalary + incomeOtherMonthly;
        const netIncome = Math.max(0, totalIncome - incomeBasicExpenses);
        
        if (incomePeriod === 'monthly') {
          totalNetAsset = netIncome;
          applicableNisab = monthlyGoldNisab;
          isNisabMet = totalIncome >= applicableNisab; // Standard BAZNAS uses Gross/Net comparison to 85g gold / 12
          calculatedZakatAmount = isNisabMet ? totalIncome * 0.025 : 0;
          calculationFormula = `Pendapatan Rp ${totalIncome.toLocaleString('id-ID')} × 2.5%`;
        } else {
          const annualGross = totalIncome * 12;
          const annualNet = netIncome * 12;
          totalNetAsset = annualNet;
          applicableNisab = annualGoldNisab;
          isNisabMet = annualGross >= applicableNisab;
          calculatedZakatAmount = isNisabMet ? annualGross * 0.025 : 0;
          calculationFormula = `Pendapatan Tahunan Rp ${annualGross.toLocaleString('id-ID')} × 2.5%`;
        }
        fatwaReference = 'Fatwa MUI No. 3 Tahun 2003 tentang Zakat Penghasilan & SK BAZNAS No. 1/2024';
        break;
      }

      case 'perniagaan': {
        categoryTitle = 'Zakat Perniagaan / Perdagangan / Usaha';
        const grossBusiness = businessCurrentAssets + businessInventory + businessCashReceivables + voucherBonus;
        totalNetAsset = Math.max(0, grossBusiness - businessShortLiabilities);
        applicableNisab = annualGoldNisab;
        isNisabMet = totalNetAsset >= applicableNisab;
        calculatedZakatAmount = isNisabMet ? totalNetAsset * 0.025 : 0;
        calculationFormula = `(Aset Lancar Rp ${grossBusiness.toLocaleString('id-ID')} - Hutang Rp ${businessShortLiabilities.toLocaleString('id-ID')}) × 2.5%`;
        fatwaReference = 'Fatwa DSN-MUI & Jumhur Ulama Zakat Tijarah (Nisab 85g Emas)';
        break;
      }

      case 'emas': {
        categoryTitle = 'Zakat Emas & Logam Mulia';
        const netGram = Math.max(0, goldWeightGrams - goldUsedForAdornment);
        totalNetAsset = netGram * goldPricePerGram;
        applicableNisab = annualGoldNisab; // 85 gram
        isNisabMet = netGram >= 85;
        calculatedZakatAmount = isNisabMet ? totalNetAsset * 0.025 : 0;
        calculationFormula = `${netGram} gr Emas × Rp ${goldPricePerGram.toLocaleString('id-ID')} × 2.5%`;
        fatwaReference = 'Hadits Riwayat Abu Dawud (Nisab 20 Dinar / 85 Gram Emas Murni)';
        break;
      }

      case 'fitrah': {
        categoryTitle = 'Zakat Fitrah (Jiwa / Ramadhan)';
        const pricePerPerson = 2.5 * ricePricePerKg;
        totalNetAsset = fitrahFamilyCount * pricePerPerson;
        applicableNisab = 0; // Wajib bagi setiap muslim yang berkecukupan pada malam Idul Fitri
        isNisabMet = fitrahFamilyCount > 0;
        calculatedZakatAmount = totalNetAsset;
        ratePercentage = 100;
        calculationFormula = `${fitrahFamilyCount} Jiwa × 2.5 kg × Rp ${ricePricePerKg.toLocaleString('id-ID')}`;
        fatwaReference = 'Hadits Riwayat Bukhari & Muslim (2.5 kg / 3.5 Liter Beras Pokok per Jiwa)';
        break;
      }
    }

    // Recommended Asnaf Allocation Split
    const asnafSplit = [
      { name: 'Fakir & Miskin (Sembako & Pangan)', percent: 70, amount: calculatedZakatAmount * 0.7, asnaf: 'Fakir & Miskin' },
      { name: 'Fisabilillah & Dakwah Umat', percent: 15, amount: calculatedZakatAmount * 0.15, asnaf: 'Fisabilillah' },
      { name: 'Gharimin & Ibnu Sabil (Pendidikan & Darurat)', percent: 10, amount: calculatedZakatAmount * 0.10, asnaf: 'Gharimin & Ibnu Sabil' },
      { name: 'Amil Zakat (Operasional Hak Amil Max 12.5%)', percent: 5, amount: calculatedZakatAmount * 0.05, asnaf: 'Amil' },
    ];

    // Voucher Comparison Metrics
    let voucherComparison = {
      coversObligation: false,
      difference: 0,
      ratioPercent: 0,
      recommendedMiniVouchers: 0,
    };

    if (linkedVoucher) {
      const vBalance = linkedVoucher.remainingBalance;
      const covers = vBalance >= calculatedZakatAmount && calculatedZakatAmount > 0;
      const diff = vBalance - calculatedZakatAmount;
      const ratio = calculatedZakatAmount > 0 ? Math.min(100, Math.round((vBalance / calculatedZakatAmount) * 100)) : 100;
      const miniVoucherCount = Math.max(1, Math.floor(calculatedZakatAmount / 100000));

      voucherComparison = {
        coversObligation: covers,
        difference: diff,
        ratioPercent: ratio,
        recommendedMiniVouchers: miniVoucherCount,
      };
    }

    return {
      categoryTitle,
      totalNetAsset,
      applicableNisab,
      isNisabMet,
      calculatedZakatAmount,
      ratePercentage,
      calculationFormula,
      fatwaReference,
      asnafSplit,
      voucherComparison,
    };
  }, [
    zakatType,
    goldPricePerGram,
    silverPricePerGram,
    ricePricePerKg,
    annualGoldNisab,
    monthlyGoldNisab,
    maalSavings,
    maalInvestments,
    maalOtherAssets,
    maalShortLiabilities,
    maalHaulMet,
    incomeMonthlySalary,
    incomeOtherMonthly,
    incomeBasicExpenses,
    incomePeriod,
    businessCurrentAssets,
    businessInventory,
    businessCashReceivables,
    businessShortLiabilities,
    goldWeightGrams,
    goldUsedForAdornment,
    fitrahFamilyCount,
    useVoucherAsAsset,
    linkedVoucher,
  ]);

  const handleCopyReport = () => {
    sounds.playClick();
    const reportText = `=== LAPORAN PERHITUNGAN ZAKAT & NISAB AI ===
Program: IslamiCityPay Sharia Compliance Engine
Kategori: ${calculationResult.categoryTitle}
Tanggal: ${new Date().toLocaleDateString('id-ID')}
Nisab Acuan: Rp ${calculationResult.applicableNisab.toLocaleString('id-ID')} (Emas: Rp ${goldPricePerGram.toLocaleString('id-ID')}/gr)
Status Fikih: ${calculationResult.isNisabMet ? 'WAJIB ZAKAT (Memenuhi Nisab & Haul)' : 'BELUM WAJIB ZAKAT (Dianjurkan Infaq/Shadaqah)'}
Total Harta/Basis Zakat: Rp ${calculationResult.totalNetAsset.toLocaleString('id-ID')}
Formula: ${calculationResult.calculationFormula}
===========================================
TOTAL KEWAJIBAN ZAKAT: Rp ${calculationResult.calculatedZakatAmount.toLocaleString('id-ID')}
===========================================
Rekomendasi Alokasi Asnaf:
1. Fakir & Miskin (70%): Rp ${calculationResult.asnafSplit[0].amount.toLocaleString('id-ID')}
2. Fisabilillah (15%): Rp ${calculationResult.asnafSplit[1].amount.toLocaleString('id-ID')}
3. Gharimin & Ibnu Sabil (10%): Rp ${calculationResult.asnafSplit[2].amount.toLocaleString('id-ID')}
4. Hak Amil (5%): Rp ${calculationResult.asnafSplit[3].amount.toLocaleString('id-ID')}

${linkedVoucher ? `Voucher Tertaut: ${linkedVoucher.code} (Saldo: Rp ${linkedVoucher.remainingBalance.toLocaleString('id-ID')})` : ''}
Dasar Fatwa: ${calculationResult.fatwaReference}`;

    navigator.clipboard.writeText(reportText);
    setCopiedReport(true);
    if (onShowToast) onShowToast('Laporan Rekomendasi Zakat berhasil disalin ke papan klip!');
    setTimeout(() => setCopiedReport(false), 2500);
  };

  return (
    <div className="space-y-6 animate-fade-in" id="zakat-calculator-module">
      
      {/* Top Banner & Header */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950 via-[#101b15] to-teal-950 text-white shadow-lg border border-emerald-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold font-mono border border-emerald-500/30">
            <Calculator className="w-3.5 h-3.5 text-emerald-400" />
            Automated Zakat & Nisab AI Recommendation Engine
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Kalkulator Zakat & Nisab Fikih Digital</span>
            <span className="text-xs px-2 py-0.5 bg-emerald-600/60 rounded-full font-mono text-emerald-200">
              BAZNAS & DSN-MUI
            </span>
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl">
            Hitung kewajiban Zakat Maal, Profesi, dan Perniagaan secara presisi dengan integrasi langsung ke nilai nominal voucher digital ZISWAF.
          </p>
        </div>

        {/* Nisab Customizer Toggle */}
        <button
          id="toggle-nisab-settings-btn"
          onClick={() => {
            sounds.playClick();
            setIsNisabCustomizerOpen(!isNisabCustomizerOpen);
          }}
          className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-xs font-bold flex items-center gap-2 text-white transition-all shrink-0"
        >
          <Sliders className="w-3.5 h-3.5 text-emerald-400" />
          <span>Pengaturan Harga Nisab Emas</span>
        </button>
      </div>

      {/* Live Nisab Ticker Bar */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-slate-700 dark:text-slate-300">Acuan Nisab Terkini:</span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-slate-500 dark:text-slate-400">Nisab Emas (85g):</span>
            <strong className="text-emerald-600 dark:text-emerald-400">
              Rp {annualGoldNisab.toLocaleString('id-ID')} / thn
            </strong>
            <span className="text-[10px] text-slate-400">(@Rp {goldPricePerGram.toLocaleString('id-ID')}/g)</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5">
            <span className="text-slate-400">•</span>
            <span className="text-slate-500 dark:text-slate-400">Nisab Bulanan:</span>
            <strong className="text-slate-700 dark:text-slate-300">
              Rp {Math.round(monthlyGoldNisab).toLocaleString('id-ID')} / bln
            </strong>
          </div>

          <div className="hidden md:flex items-center gap-1.5">
            <span className="text-slate-400">•</span>
            <span className="text-slate-500 dark:text-slate-400">Beras (Fitrah):</span>
            <strong className="text-slate-700 dark:text-slate-300">
              Rp {ricePricePerKg.toLocaleString('id-ID')} / kg
            </strong>
          </div>
        </div>
      </div>

      {/* Collapsible Nisab Price Customizer */}
      {isNisabCustomizerOpen && (
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.08] space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-500" />
              Sesuaikan Parameter Harga Komoditas Nisab Pasar
            </h4>
            <span className="text-[10px] font-mono text-slate-400">LIVE FIQH PARAMETERS</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Harga Emas Antam Murni (Rp / gram):
              </label>
              <input
                type="number"
                value={goldPricePerGram}
                onChange={(e) => setGoldPricePerGram(Math.max(100000, Number(e.target.value)))}
                className="w-full px-3 py-1.5 bg-white dark:bg-[#202026] border border-slate-300 dark:border-white/[0.1] rounded-xl text-xs font-mono text-slate-900 dark:text-slate-100 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Harga Perak Murni (Rp / gram):
              </label>
              <input
                type="number"
                value={silverPricePerGram}
                onChange={(e) => setSilverPricePerGram(Math.max(1000, Number(e.target.value)))}
                className="w-full px-3 py-1.5 bg-white dark:bg-[#202026] border border-slate-300 dark:border-white/[0.1] rounded-xl text-xs font-mono text-slate-900 dark:text-slate-100 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Harga Beras Pokok (Rp / kg):
              </label>
              <input
                type="number"
                value={ricePricePerKg}
                onChange={(e) => setRicePricePerKg(Math.max(5000, Number(e.target.value)))}
                className="w-full px-3 py-1.5 bg-white dark:bg-[#202026] border border-slate-300 dark:border-white/[0.1] rounded-xl text-xs font-mono text-slate-900 dark:text-slate-100 outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Category Tabs Switcher */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'maal', label: 'Zakat Maal & Tabungan', icon: Coins },
          { id: 'profesi', label: 'Zakat Penghasilan / Gaji', icon: Briefcase },
          { id: 'perniagaan', label: 'Zakat Perniagaan / Bisnis', icon: Building2 },
          { id: 'emas', label: 'Zakat Emas & Logam Mulia', icon: Scale },
          { id: 'fitrah', label: 'Zakat Fitrah', icon: Gift },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = zakatType === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                sounds.playClick();
                setZakatType(item.id as ZakatCategoryType);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 scale-[1.02]'
                  : 'bg-white dark:bg-[#16161A] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/[0.08]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Grid: Left Input Parameters vs Right Results & Voucher Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Input Forms & Voucher Linking (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* SECTION A: Direct Voucher Linking & Value Binding */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Tautkan Nilai Nominal Voucher (Voucher Binding):
              </span>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                AUTO-SYNC VOUCHER
              </span>
            </div>

            <div className="space-y-2">
              <select
                value={selectedVoucherId}
                onChange={(e) => {
                  sounds.playClick();
                  setSelectedVoucherId(e.target.value);
                }}
                className="w-full px-3 py-2 bg-white dark:bg-[#202026] border border-slate-300 dark:border-white/[0.1] rounded-xl text-xs font-semibold text-slate-900 dark:text-slate-100 outline-none cursor-pointer"
              >
                {vouchers.map((v) => (
                  <option key={v.id} value={v.id}>
                    [{v.category.toUpperCase()}] {v.code} — {v.title} (Saldo: Rp {v.remainingBalance.toLocaleString('id-ID')})
                  </option>
                ))}
              </select>

              {linkedVoucher && (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-[#202026] border border-slate-200 dark:border-white/[0.06] text-xs">
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-900 dark:text-white line-clamp-1">
                      {linkedVoucher.title}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      Penerima: {linkedVoucher.beneficiaryName} • Akad: {linkedVoucher.shariaContract}
                    </div>
                  </div>
                  
                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-slate-400 block">Nominal Voucher</span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      Rp {linkedVoucher.remainingBalance.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              )}

              {/* Option to use voucher as asset */}
              {(zakatType === 'maal' || zakatType === 'perniagaan') && linkedVoucher && (
                <label className="flex items-center gap-2 pt-1 text-xs text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={useVoucherAsAsset}
                    onChange={(e) => {
                      sounds.playClick();
                      setUseVoucherAsAsset(e.target.checked);
                    }}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Sertakan saldo voucher (Rp {linkedVoucher.remainingBalance.toLocaleString('id-ID')}) ke dalam basis perhitungan harta simpanan</span>
                </label>
              )}
            </div>
          </div>

          {/* SECTION B: Dynamic Form Inputs by Zakat Type */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] shadow-xs space-y-4">
            
            {/* 1. Zakat Maal Form */}
            {zakatType === 'maal' && (
              <div className="space-y-4 animate-fade-in">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Parameter Harta & Aset Likuid
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Tabungan / Giro / Deposito (Rp):
                    </label>
                    <input
                      type="number"
                      value={maalSavings}
                      onChange={(e) => setMaalSavings(Math.max(0, Number(e.target.value)))}
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-[#16161A] border border-slate-300 dark:border-white/[0.08] rounded-xl text-xs font-mono text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500/40"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Investasi / Reksadana / Saham (Rp):
                    </label>
                    <input
                      type="number"
                      value={maalInvestments}
                      onChange={(e) => setMaalInvestments(Math.max(0, Number(e.target.value)))}
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-[#16161A] border border-slate-300 dark:border-white/[0.08] rounded-xl text-xs font-mono text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500/40"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Harta Likuid Lainnya (Rp):
                    </label>
                    <input
                      type="number"
                      value={maalOtherAssets}
                      onChange={(e) => setMaalOtherAssets(Math.max(0, Number(e.target.value)))}
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-[#16161A] border border-slate-300 dark:border-white/[0.08] rounded-xl text-xs font-mono text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500/40"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Hutang / Cicilan Jatuh Tempo (Rp):
                    </label>
                    <input
                      type="number"
                      value={maalShortLiabilities}
                      onChange={(e) => setMaalShortLiabilities(Math.max(0, Number(e.target.value)))}
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-[#16161A] border border-slate-300 dark:border-white/[0.08] rounded-xl text-xs font-mono text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500/40"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={maalHaulMet}
                      onChange={(e) => {
                        sounds.playClick();
                        setMaalHaulMet(e.target.checked);
                      }}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Harta telah mengendap selama 1 Tahun Hijriyah (Memenuhi Syarat Haul)</span>
                  </label>

                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    maalHaulMet ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'
                  }`}>
                    {maalHaulMet ? 'HAUL TERPENUHI' : 'BELUM HAUL'}
                  </span>
                </div>
              </div>
            )}

            {/* 2. Zakat Profesi Form */}
            {zakatType === 'profesi' && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Pendapatan & Pengeluaran Pokok
                  </h4>

                  <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-[#16161A] rounded-lg border border-slate-200 dark:border-white/[0.08]">
                    <button
                      onClick={() => setIncomePeriod('monthly')}
                      className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                        incomePeriod === 'monthly' ? 'bg-emerald-600 text-white' : 'text-slate-500'
                      }`}
                    >
                      Bulanan
                    </button>
                    <button
                      onClick={() => setIncomePeriod('annual')}
                      className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                        incomePeriod === 'annual' ? 'bg-emerald-600 text-white' : 'text-slate-500'
                      }`}
                    >
                      Tahunan
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Gaji Pokok & Tunjangan Tetap (Rp):
                    </label>
                    <input
                      type="number"
                      value={incomeMonthlySalary}
                      onChange={(e) => setIncomeMonthlySalary(Math.max(0, Number(e.target.value)))}
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-[#16161A] border border-slate-300 dark:border-white/[0.08] rounded-xl text-xs font-mono text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500/40"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Bonus / THR / Pendapatan Sampingan (Rp):
                    </label>
                    <input
                      type="number"
                      value={incomeOtherMonthly}
                      onChange={(e) => setIncomeOtherMonthly(Math.max(0, Number(e.target.value)))}
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-[#16161A] border border-slate-300 dark:border-white/[0.08] rounded-xl text-xs font-mono text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500/40"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Pengeluaran Kebutuhan Pokok / Hutang Primer (Rp):
                    </label>
                    <input
                      type="number"
                      value={incomeBasicExpenses}
                      onChange={(e) => setIncomeBasicExpenses(Math.max(0, Number(e.target.value)))}
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-[#16161A] border border-slate-300 dark:border-white/[0.08] rounded-xl text-xs font-mono text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500/40"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#16161A] text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
                  <div className="flex items-center justify-between font-semibold text-slate-700 dark:text-slate-300">
                    <span>Nisab Penghasilan Bulanan BAZNAS:</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400">
                      Rp {Math.round(monthlyGoldNisab).toLocaleString('id-ID')}
                    </span>
                  </div>
                  <p>
                    Berdasarkan Fatwa MUI No. 3/2003 & SK BAZNAS No. 1/2024, zakat profesi dapat ditunaikan saat menerima penghasilan (2.5%) jika melampaui nisab.
                  </p>
                </div>
              </div>
            )}

            {/* 3. Zakat Perniagaan Form */}
            {zakatType === 'perniagaan' && (
              <div className="space-y-4 animate-fade-in">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Neraca Keuangan Bisnis / Toko Merchant
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Kas / Rekening Bisnis (Rp):
                    </label>
                    <input
                      type="number"
                      value={businessCurrentAssets}
                      onChange={(e) => setBusinessCurrentAssets(Math.max(0, Number(e.target.value)))}
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-[#16161A] border border-slate-300 dark:border-white/[0.08] rounded-xl text-xs font-mono text-slate-900 dark:text-slate-100 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Nilai Stok / Persediaan Barang (Rp):
                    </label>
                    <input
                      type="number"
                      value={businessInventory}
                      onChange={(e) => setBusinessInventory(Math.max(0, Number(e.target.value)))}
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-[#16161A] border border-slate-300 dark:border-white/[0.08] rounded-xl text-xs font-mono text-slate-900 dark:text-slate-100 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Piutang Lancar Dapat Ditagih (Rp):
                    </label>
                    <input
                      type="number"
                      value={businessCashReceivables}
                      onChange={(e) => setBusinessCashReceivables(Math.max(0, Number(e.target.value)))}
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-[#16161A] border border-slate-300 dark:border-white/[0.08] rounded-xl text-xs font-mono text-slate-900 dark:text-slate-100 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Hutang Dagang Jatuh Tempo (Rp):
                    </label>
                    <input
                      type="number"
                      value={businessShortLiabilities}
                      onChange={(e) => setBusinessShortLiabilities(Math.max(0, Number(e.target.value)))}
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-[#16161A] border border-slate-300 dark:border-white/[0.08] rounded-xl text-xs font-mono text-slate-900 dark:text-slate-100 outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 4. Zakat Emas Form */}
            {zakatType === 'emas' && (
              <div className="space-y-4 animate-fade-in">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Kepemilikan Logam Mulia & Perhiasan
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Total Berat Emas Dimiliki (Gram):
                    </label>
                    <input
                      type="number"
                      value={goldWeightGrams}
                      onChange={(e) => setGoldWeightGrams(Math.max(0, Number(e.target.value)))}
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-[#16161A] border border-slate-300 dark:border-white/[0.08] rounded-xl text-xs font-mono text-slate-900 dark:text-slate-100 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Emas Dipakai Sehari-hari (Bebas Zakat):
                    </label>
                    <input
                      type="number"
                      value={goldUsedForAdornment}
                      onChange={(e) => setGoldUsedForAdornment(Math.max(0, Number(e.target.value)))}
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-[#16161A] border border-slate-300 dark:border-white/[0.08] rounded-xl text-xs font-mono text-slate-900 dark:text-slate-100 outline-none"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#16161A] text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
                  <div className="flex items-center justify-between font-semibold text-slate-700 dark:text-slate-300">
                    <span>Nisab Wajib Emas:</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400">85 Gram Emas Murni</span>
                  </div>
                  <p>
                    Perhiasan yang wajar dipakai secara rutin oleh wanita tidak dikenakan zakat menurut jumhur ulama.
                  </p>
                </div>
              </div>
            )}

            {/* 5. Zakat Fitrah Form */}
            {zakatType === 'fitrah' && (
              <div className="space-y-4 animate-fade-in">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Jumlah Jiwa Tanggungan Keluarga
                </h4>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Jumlah Anggota Keluarga (Jiwa):
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={fitrahFamilyCount}
                      onChange={(e) => setFitrahFamilyCount(Math.max(1, Number(e.target.value)))}
                      className="w-32 px-3.5 py-2 bg-slate-50 dark:bg-[#16161A] border border-slate-300 dark:border-white/[0.08] rounded-xl text-xs font-mono text-slate-900 dark:text-slate-100 outline-none"
                    />
                    <span className="text-xs text-slate-500">
                      = {(fitrahFamilyCount * 2.5).toFixed(1)} kg beras (senilai Rp {(fitrahFamilyCount * 2.5 * ricePricePerKg).toLocaleString('id-ID')})
                    </span>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* RIGHT COLUMN: Results, Fiqh Assessment & Voucher Recommendation (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Main Calculation Card */}
          <div className="p-5 rounded-3xl bg-gradient-to-b from-slate-900 via-[#101915] to-[#06241a] text-white border border-emerald-500/30 shadow-xl space-y-4 relative overflow-hidden">
            
            {/* Status Badge */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono tracking-wider text-emerald-400 font-bold uppercase">
                HASIL ANALISIS FIKIH AI
              </span>

              <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold flex items-center gap-1 ${
                calculationResult.isNisabMet
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}>
                {calculationResult.isNisabMet ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    WAJIB ZAKAT
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    SUNNAH INFAQ
                  </>
                )}
              </span>
            </div>

            {/* Total Zakat Number */}
            <div className="space-y-1">
              <span className="text-xs text-slate-300 font-medium">
                Rekomendasi Kewajiban Zakat ({calculationResult.ratePercentage}%):
              </span>
              <div className="font-mono font-extrabold text-3xl text-emerald-400 tracking-tight">
                Rp {Math.round(calculationResult.calculatedZakatAmount).toLocaleString('id-ID')}
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                Basis Harta: Rp {Math.round(calculationResult.totalNetAsset).toLocaleString('id-ID')}
              </div>
            </div>

            {/* Nisab Threshold Progress Bar */}
            <div className="space-y-1.5 pt-2 border-t border-white/[0.1]">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-300">Posisi terhadap Nisab:</span>
                <span className="font-mono text-emerald-300 font-bold">
                  {calculationResult.applicableNisab > 0 
                    ? `${Math.min(200, Math.round((calculationResult.totalNetAsset / calculationResult.applicableNisab) * 100))}% dari Nisab` 
                    : '100%'}
                </span>
              </div>

              <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden border border-white/[0.1]">
                <div
                  className={`h-full transition-all duration-500 ${
                    calculationResult.isNisabMet ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                  style={{
                    width: `${Math.min(100, (calculationResult.totalNetAsset / (calculationResult.applicableNisab || 1)) * 100)}%`,
                  }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>Rp 0</span>
                <span>Nisab: Rp {Math.round(calculationResult.applicableNisab).toLocaleString('id-ID')}</span>
              </div>
            </div>

            {/* Voucher Face Value Matching Analysis */}
            {linkedVoucher && (
              <div className="p-3.5 rounded-2xl bg-white/[0.06] border border-white/[0.1] space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-300">
                  <span className="flex items-center gap-1.5">
                    <Gift className="w-3.5 h-3.5 text-emerald-400" />
                    Analisis Voucher Tertaut ({linkedVoucher.code}):
                  </span>
                  <span className="font-mono">
                    Rp {linkedVoucher.remainingBalance.toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="text-[11px] text-slate-300 leading-relaxed">
                  {calculationResult.calculatedZakatAmount === 0 ? (
                    <span>Harta belum mencapai batas nisab. Saldo voucher dapat dialokasikan sebagai <strong>Infaq / Shadaqah Tabarru'</strong>.</span>
                  ) : calculationResult.voucherComparison.coversObligation ? (
                    <span className="text-emerald-300">
                      ✓ Saldo voucher <strong>mencukupi 100%</strong> untuk memenuhi kewajiban zakat ini dengan sisa saldo Rp {calculationResult.voucherComparison.difference.toLocaleString('id-ID')}.
                    </span>
                  ) : (
                    <span className="text-amber-300">
                      Voucher ini menutupi <strong>{calculationResult.voucherComparison.ratioPercent}%</strong> dari total kewajiban zakat. Kekurangan: Rp {Math.abs(calculationResult.voucherComparison.difference).toLocaleString('id-ID')}.
                    </span>
                  )}
                </div>

                {calculationResult.calculatedZakatAmount > 0 && (
                  <div className="text-[10px] text-slate-400 font-mono pt-1 border-t border-white/[0.08]">
                    Dapat dipecah menjadi ±<strong>{calculationResult.voucherComparison.recommendedMiniVouchers} paket voucher sembako</strong> (@Rp 100.000) untuk mustahik.
                  </div>
                )}
              </div>
            )}

            {/* Asnaf Distribution Breakdown */}
            <div className="space-y-2 pt-1">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1">
                <PieChart className="w-3.5 h-3.5 text-emerald-400" />
                Rekomendasi Alokasi 8 Asnaf (QS. At-Taubah: 60):
              </span>

              <div className="space-y-1.5">
                {calculationResult.asnafSplit.map((asnaf, idx) => (
                  <div key={idx} className="flex items-center justify-between text-[11px] bg-black/20 px-2.5 py-1.5 rounded-lg">
                    <span className="text-slate-300 truncate">{asnaf.name}</span>
                    <span className="font-mono font-bold text-emerald-300 shrink-0">
                      Rp {Math.round(asnaf.amount).toLocaleString('id-ID')} ({asnaf.percent}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Copy Report Button */}
            <div className="pt-2">
              <button
                onClick={handleCopyReport}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
              >
                {copiedReport ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedReport ? 'Laporan Tersalin!' : 'Salin Laporan Fikih Zakat'}</span>
              </button>
            </div>

          </div>

          {/* Sharia Compliance & Tax Exemption Box */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.08] space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
              <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Dasar Fikih & Pengurang Pajak Penghasilan (PPh):</span>
            </div>
            
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              {calculationResult.fatwaReference}. Pembayaran zakat melalui lembaga resmi BAZNAS/LAZ dapat menjadi <strong>faktor pengurang Penghasilan Kena Pajak (PKP)</strong> sesuai UU PPh No. 36/2008 Pasal 9 ayat (1) huruf g.
            </p>

            <div className="pt-2 border-t border-slate-200 dark:border-white/[0.06] flex items-center justify-between text-[10px] text-emerald-700 dark:text-emerald-400 font-mono">
              <span>AKAD: HIBAH TABARRU' TAMLIK</span>
              <span>100% ZERO-RIBA GUARANTEE</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
