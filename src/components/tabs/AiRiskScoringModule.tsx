import React, { useState, useMemo } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Activity, 
  BrainCircuit, 
  Sparkles, 
  RefreshCw, 
  Filter, 
  Search, 
  Lock, 
  Unlock, 
  Sliders, 
  Zap, 
  Clock, 
  MapPin, 
  Store, 
  Scale, 
  Copy, 
  Check, 
  AlertOctagon, 
  TrendingUp, 
  FileSpreadsheet,
  ChevronRight,
  Eye,
  Info,
  ArrowUpRight
} from 'lucide-react';
import { Voucher, Transaction, Language } from '../../types';
import { translations } from '../../utils/translations';
import { sounds } from '../../utils/soundEffects';

export interface RiskFactor {
  code: string;
  label: string;
  category: 'VELOCITY' | 'GEO_IP' | 'STRUCTURING' | 'MERCHANT' | 'SHARIA_CONTRACT' | 'INTEGRITY';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  scoreImpact: number;
  description: string;
  evidence: string;
}

export interface AnalyzedTransactionRisk {
  transaction: Transaction;
  voucher?: Voucher;
  riskScore: number; // 0 - 100
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'CLEARED' | 'SUSPICIOUS' | 'FLAGGED_ANOMALY';
  flags: RiskFactor[];
  aiAnalysisSummary: string;
  suggestedAction: string;
  isManuallyReviewed?: boolean;
}

interface AiRiskScoringModuleProps {
  currentLang: Language;
  vouchers: Voucher[];
  transactions: Transaction[];
  onUpdateVoucher?: (updated: Voucher) => void;
  onShowToast?: (message: string) => void;
}

export const AiRiskScoringModule: React.FC<AiRiskScoringModuleProps> = ({
  currentLang,
  vouchers,
  transactions,
  onUpdateVoucher,
  onShowToast,
}) => {
  const t = translations[currentLang];

  // Sensitivity configuration: standard, strict, audit
  const [sensitivity, setSensitivity] = useState<'standard' | 'strict' | 'audit'>('standard');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(100);
  const [lastScanTime, setLastScanTime] = useState<string>('Baru saja');
  
  // Filter state
  const [riskFilter, setRiskFilter] = useState<'ALL' | 'CRITICAL_HIGH' | 'MEDIUM' | 'LOW'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selected transaction detail modal/drawer
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalyzedTransactionRisk | null>(null);
  const [copiedAuditId, setCopiedAuditId] = useState<string | null>(null);

  // Review status tracking (whitelist / manual verified IDs)
  const [reviewedTxIds, setReviewedTxIds] = useState<Set<string>>(new Set());

  // Anomaly test scenarios simulation
  const [simulatedScenarios, setSimulatedScenarios] = useState<Transaction[]>([]);

  // Combined transactions
  const allTransactions = useMemo(() => {
    return [...simulatedScenarios, ...transactions];
  }, [simulatedScenarios, transactions]);

  // Automated Risk Engine Calculation
  const analyzedData: AnalyzedTransactionRisk[] = useMemo(() => {
    const sensitivityMultiplier = sensitivity === 'strict' ? 1.3 : sensitivity === 'audit' ? 1.5 : 1.0;

    return allTransactions.map((tx) => {
      const voucher = vouchers.find(v => v.id === tx.voucherId || v.code === tx.voucherCode);
      const flags: RiskFactor[] = [];
      let baseScore = 5; // Minimal baseline

      // 1. Merchant Whitelist Verification
      if (voucher && voucher.merchantsAllowed && voucher.merchantsAllowed.length > 0) {
        const isMerchantWhitelisted = voucher.merchantsAllowed.some(allowed => 
          allowed.toLowerCase().includes(tx.merchantName.toLowerCase()) || 
          tx.merchantName.toLowerCase().includes(allowed.toLowerCase()) ||
          tx.merchantName.toLowerCase().includes('baznas') ||
          tx.merchantName.toLowerCase().includes('syariah')
        );

        if (!isMerchantWhitelisted && tx.type === 'REDEEM') {
          flags.push({
            code: 'UNAUTHORIZED_MERCHANT',
            label: 'Merchant Di Luar Whitelist',
            category: 'MERCHANT',
            severity: 'HIGH',
            scoreImpact: 35,
            description: `Merchant "${tx.merchantName}" tidak terdaftar dalam daftar otorisasi resmi voucher.`,
            evidence: `Allowed: [${voucher.merchantsAllowed.join(', ')}] vs Actual: ${tx.merchantName}`,
          });
        }
      }

      // 2. Velocity / Rapid Frequency Detection
      const sameVoucherTxs = allTransactions.filter(other => 
        (other.voucherCode === tx.voucherCode || other.voucherId === tx.voucherId) &&
        other.id !== tx.id
      );

      if (sameVoucherTxs.length >= 2) {
        flags.push({
          code: 'RAPID_BURST_VELOCITY',
          label: 'Anomali Kecepatan Transaksi (Velocity Spike)',
          category: 'VELOCITY',
          severity: 'MEDIUM',
          scoreImpact: 20,
          description: `Voucher ini mengalami ${sameVoucherTxs.length + 1} aktivitas transaksi dalam rentang waktu singkat.`,
          evidence: `Frekuensi terakumulasi: ${sameVoucherTxs.length + 1} interaksi, memicu threshold mitigasi bot/fraud.`,
        });
      }

      // 3. Sharia Contract & Fee (Ujrah) Bounds Checking (DSN-MUI No. 116)
      if (voucher) {
        // Tabarru (Zakat / Infaq) should have zero fee to mustahiq
        if ((voucher.shariaContract === 'Hibah / Tabarru' || voucher.category === 'ziswaf') && tx.feeUjrah > 0 && tx.type === 'REDEEM') {
          flags.push({
            code: 'TABARRU_FEE_VIOLATION',
            label: 'Indikasi Pelanggaran Akad Tabarru (Ujrah Tidak Sah)',
            category: 'SHARIA_CONTRACT',
            severity: 'HIGH',
            scoreImpact: 30,
            description: 'Voucher berbasis akad Tabarru/Zakat tidak boleh membebankan biaya ujrah kepada Mustahiq saat penukaran.',
            evidence: `Ditemukan potongan Ujrah Rp ${tx.feeUjrah.toLocaleString('id-ID')} pada voucher Zakat/Tabarru.`,
          });
        }

        // Excess fee check (> 2% of transaction amount)
        if (tx.amount > 0 && (tx.feeUjrah / tx.amount) > 0.02) {
          flags.push({
            code: 'EXCESSIVE_UJRAH_FEE',
            label: 'Biaya Ujrah Melampaui Batas Wajar (>2%)',
            category: 'SHARIA_CONTRACT',
            severity: 'MEDIUM',
            scoreImpact: 15,
            description: 'Ujrah administrasi melampaui plafon fatwa DSN-MUI untuk uang elektronik syariah.',
            evidence: `Persentase Ujrah: ${((tx.feeUjrah / tx.amount) * 100).toFixed(2)}% dari nominal transaksi.`,
          });
        }
      }

      // 4. Amount / Structuring (Smurfing Pattern)
      if (tx.amount >= 5000000 && tx.type === 'REDEEM') {
        flags.push({
          code: 'HIGH_VALUE_REDEMPTION',
          label: 'Penebusan Nilai Tinggi (High Value Ticket)',
          category: 'STRUCTURING',
          severity: 'LOW',
          scoreImpact: 12,
          description: 'Penebusan voucher dengan nilai nominal besar membutuhkan otentikasi biometrik/PIN.',
          evidence: `Nominal Rp ${tx.amount.toLocaleString('id-ID')} melampaui ambang batas verifikasi sekunder.`,
        });
      }

      // 5. Geographic & IP Discrepancy
      if (tx.location.includes('Makassar') && tx.ipAddress.startsWith('103.')) {
        flags.push({
          code: 'GEO_IP_MISMATCH',
          label: 'Inkonsistensi Geo-Location & Routing IP',
          category: 'GEO_IP',
          severity: 'MEDIUM',
          scoreImpact: 18,
          description: 'Alamat IP teridentifikasi routing gateway Jakarta sedangkan GPS/POS terminal berlokasi di Makassar.',
          evidence: `Terminal: ${tx.location} | Subnet IP: ${tx.ipAddress}`,
        });
      }

      // 6. Cryptographic Hash & Tamper-proof status
      if (!tx.isTamperProof || tx.status === 'FLAGGED') {
        flags.push({
          code: 'HASH_TAMPER_SUSPICION',
          label: 'Integritas Kriptografis Butuh Audit Ulang',
          category: 'INTEGRITY',
          severity: 'CRITICAL',
          scoreImpact: 45,
          description: 'Sinyal hash atau integritas non-repudiation terindikasi tidak lengkap atau berstatus flagged.',
          evidence: `Status Transaksi: ${tx.status} | Tamper-proof: ${tx.isTamperProof ? 'YES' : 'NO'}`,
        });
      }

      // Calculate total score
      flags.forEach(f => {
        baseScore += f.scoreImpact;
      });

      const finalScore = Math.min(100, Math.round(baseScore * sensitivityMultiplier));
      
      let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
      let status: 'CLEARED' | 'SUSPICIOUS' | 'FLAGGED_ANOMALY' = 'CLEARED';

      if (finalScore >= 75) {
        riskLevel = 'CRITICAL';
        status = 'FLAGGED_ANOMALY';
      } else if (finalScore >= 50) {
        riskLevel = 'HIGH';
        status = 'FLAGGED_ANOMALY';
      } else if (finalScore >= 25) {
        riskLevel = 'MEDIUM';
        status = 'SUSPICIOUS';
      } else {
        riskLevel = 'LOW';
        status = 'CLEARED';
      }

      // Overrides if reviewed
      const isReviewed = reviewedTxIds.has(tx.id);
      if (isReviewed) {
        status = 'CLEARED';
      }

      // AI Analysis Summary Generator
      let summary = '';
      let suggestedAction = '';

      if (riskLevel === 'CRITICAL' || riskLevel === 'HIGH') {
        summary = `Peringatan Risiko Tinggi: Mesin AI mendeteksi ${flags.length} faktor kecurigaan pada transaksi voucher "${tx.voucherCode}". Terdeteksi anomali pada: ${flags.map(f => f.label).join(', ')}. Direkomendasikan segera lakukan validasi manual atau pembekuan saldo sementara.`;
        suggestedAction = 'Bekukan status voucher & mintakan konfirmasi otorisasi ulang dari Beneficiary.';
      } else if (riskLevel === 'MEDIUM') {
        summary = `Waspada Tingkat Sedang: Terdapat indikasi variasi pola perilaku (${flags.map(f => f.label).join(', ')}). Tidak ditemukan fraud fatal, namun tetap dalam pemantauan otomatis.`;
        suggestedAction = 'Pantau transaksi berikutnya dan pastikan verifikasi 2FA aktif.';
      } else {
        summary = `Pola Transaksi Bersih & Wajar: Seluruh parameter kriptografis SHA-256 HMAC, kesesuaian merchant, dan batasan akad fatwa DSN-MUI No. 116 terpenuhi 100%.`;
        suggestedAction = 'Transaksi sah. Tidak memerlukan tindakan intervensi.';
      }

      return {
        transaction: tx,
        voucher,
        riskScore: finalScore,
        riskLevel,
        status,
        flags,
        aiAnalysisSummary: summary,
        suggestedAction,
        isManuallyReviewed: isReviewed,
      };
    });
  }, [allTransactions, vouchers, sensitivity, reviewedTxIds]);

  // Aggregate Metrics
  const metrics = useMemo(() => {
    const total = analyzedData.length;
    const critical = analyzedData.filter(d => d.riskLevel === 'CRITICAL').length;
    const high = analyzedData.filter(d => d.riskLevel === 'HIGH').length;
    const medium = analyzedData.filter(d => d.riskLevel === 'MEDIUM').length;
    const low = analyzedData.filter(d => d.riskLevel === 'LOW').length;

    const avgScore = total > 0 
      ? Math.round(analyzedData.reduce((acc, curr) => acc + curr.riskScore, 0) / total)
      : 0;

    const safePercentage = total > 0 ? (((low + medium) / total) * 100).toFixed(1) : '100';

    return {
      total,
      critical,
      high,
      medium,
      low,
      avgScore,
      safePercentage,
      anomaliesCount: critical + high,
    };
  }, [analyzedData]);

  // Filtered List
  const filteredData = useMemo(() => {
    return analyzedData.filter(item => {
      // Risk filter
      if (riskFilter === 'CRITICAL_HIGH' && item.riskLevel !== 'CRITICAL' && item.riskLevel !== 'HIGH') {
        return false;
      }
      if (riskFilter === 'MEDIUM' && item.riskLevel !== 'MEDIUM') {
        return false;
      }
      if (riskFilter === 'LOW' && item.riskLevel !== 'LOW') {
        return false;
      }

      // Category filter
      if (categoryFilter !== 'ALL') {
        const hasCategoryFlag = item.flags.some(f => f.category === categoryFilter);
        if (!hasCategoryFlag) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesCode = item.transaction.voucherCode.toLowerCase().includes(q);
        const matchesBeneficiary = item.transaction.beneficiary.toLowerCase().includes(q);
        const matchesMerchant = item.transaction.merchantName.toLowerCase().includes(q);
        const matchesId = item.transaction.id.toLowerCase().includes(q);
        if (!matchesCode && !matchesBeneficiary && !matchesMerchant && !matchesId) {
          return false;
        }
      }

      return true;
    });
  }, [analyzedData, riskFilter, categoryFilter, searchQuery]);

  // Handle manual rescan
  const handleTriggerScan = () => {
    sounds.playClick();
    setIsScanning(true);
    setScanProgress(15);

    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 25;
      });
    }, 150);

    setTimeout(() => {
      clearInterval(interval);
      setScanProgress(100);
      setIsScanning(false);
      setLastScanTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
      sounds.playSuccess();
      onShowToast?.('Pemindaian AI Risk Scoring selesai. 6 parameter transaksi diperbarui.');
    }, 750);
  };

  // Handle freeze/unfreeze voucher
  const handleToggleFreezeVoucher = (voucher: Voucher) => {
    if (!onUpdateVoucher) return;
    sounds.playAlert();
    const isCurrentlyFrozen = voucher.status === 'FROZEN';
    const newStatus = isCurrentlyFrozen ? 'ACTIVE' : 'FROZEN';

    const updated: Voucher = {
      ...voucher,
      status: newStatus,
    };

    onUpdateVoucher(updated);
    onShowToast?.(
      isCurrentlyFrozen 
        ? `Voucher ${voucher.code} telah dipulihkan ke status AKTIF.`
        : `Voucher ${voucher.code} TELAH DIBEKUKAN demi keamanan transaksi.`
    );
  };

  // Handle whitelist / mark verified
  const handleToggleVerifyTransaction = (txId: string) => {
    sounds.playClick();
    setReviewedTxIds(prev => {
      const next = new Set(prev);
      if (next.has(txId)) {
        next.delete(txId);
        onShowToast?.(`Penandaan verifikasi manual untuk transaksi ${txId} dibatalkan.`);
      } else {
        next.add(txId);
        onShowToast?.(`Transaksi ${txId} diverifikasi manual sebagai transaksi sah.`);
      }
      return next;
    });
  };

  // Inject Simulation Test Cases
  const handleInjectSimulation = (scenario: 'UNAUTHORIZED_MERCHANT' | 'RAPID_BURST' | 'TABARRU_FEE' | 'RESET') => {
    sounds.playClick();
    if (scenario === 'RESET') {
      setSimulatedScenarios([]);
      onShowToast?.('Data simulasi anomali direset ke transaksi standar.');
      return;
    }

    if (scenario === 'UNAUTHORIZED_MERCHANT') {
      const simTx: Transaction = {
        id: `TX-SIM-${Date.now().toString().slice(-5)}`,
        voucherId: 'vch-003',
        voucherCode: 'ICP-HLM-9021-P3W1',
        voucherTitle: 'Voucher Belanja Sembako Halal Mart UMKM',
        amount: 250000,
        currency: 'IDR',
        type: 'REDEEM',
        status: 'SUCCESS',
        merchantName: 'Club Gadget & Karaoke Non-Halal Partner', // clearly suspicious merchant
        bankChannel: 'QRIS_SYARIAH',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        endToEndHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        shariaAuditId: 'AUD-SIM-9099',
        feeUjrah: 5000,
        location: 'Jakarta Barat, Indonesia',
        isTamperProof: true,
        ipAddress: '103.20.18.99',
        beneficiary: 'Rizky Pratama',
        details: 'Simulated Anomaly: Penebusan voucher sembako di merchant tidak berizin',
      };
      setSimulatedScenarios([simTx]);
      sounds.playAlert();
      onShowToast?.('Skenario Anomali Merchant Tidak Berizin disuntikkan ke mesin AI!');
    } else if (scenario === 'RAPID_BURST') {
      const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
      const simTx1: Transaction = {
        id: `TX-SIM-BURST-1`,
        voucherId: 'vch-002',
        voucherCode: 'ICP-UMR-4412-K8B9',
        voucherTitle: 'Voucher Subsidi Perlengkapan Umrah Mabrur',
        amount: 500000,
        currency: 'IDR',
        type: 'REDEEM',
        status: 'SUCCESS',
        merchantName: 'Toko Perlengkapan Haji Madinah',
        bankChannel: 'BSI_SYARIAH',
        timestamp: nowStr,
        endToEndHash: '7c9b2a4e6f8d0c2b4a6e8f0a2c4e6b8d0f2a4c6e9b1c7a8e2f4d6c8b0a1e3f5d',
        shariaAuditId: 'AUD-SIM-BURST-1',
        feeUjrah: 2500,
        location: 'Jakarta Islamic Centre',
        isTamperProof: true,
        ipAddress: '103.144.172.58',
        beneficiary: 'Siti Nurhaliza',
        details: 'Burst Multi-tap 1/2',
      };
      const simTx2: Transaction = {
        id: `TX-SIM-BURST-2`,
        voucherId: 'vch-002',
        voucherCode: 'ICP-UMR-4412-K8B9',
        voucherTitle: 'Voucher Subsidi Perlengkapan Umrah Mabrur',
        amount: 500000,
        currency: 'IDR',
        type: 'REDEEM',
        status: 'SUCCESS',
        merchantName: 'Toko Perlengkapan Haji Madinah',
        bankChannel: 'BSI_SYARIAH',
        timestamp: nowStr,
        endToEndHash: '8d0c2b4a6e8f0a2c4e6b8d0f2a4c6e9b1c7a8e2f4d6c8b0a1e3f5d7c9b2a4e6f',
        shariaAuditId: 'AUD-SIM-BURST-2',
        feeUjrah: 2500,
        location: 'Medan, Sumatera Utara', // Geo jump
        isTamperProof: true,
        ipAddress: '180.252.190.11',
        beneficiary: 'Siti Nurhaliza',
        details: 'Burst Multi-tap 2/2 dengan loncatan lokasi mustahil',
      };
      setSimulatedScenarios([simTx1, simTx2]);
      sounds.playAlert();
      onShowToast?.('Skenario Anomali Kecepatan (Rapid Burst & Geo-jump) berhasil disuntikkan!');
    } else if (scenario === 'TABARRU_FEE') {
      const simTx: Transaction = {
        id: `TX-SIM-FEE-${Date.now().toString().slice(-4)}`,
        voucherId: 'vch-001',
        voucherCode: 'ICP-ZIS-8821-X9A2',
        voucherTitle: 'Voucher Zakat Produktif & Mustahiq Berdaya',
        amount: 1500000,
        currency: 'IDR',
        type: 'REDEEM',
        status: 'SUCCESS',
        merchantName: 'Mitra Zakat Mart',
        bankChannel: 'MUAMALAT',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        endToEndHash: '4c6e9b1c7a8e2f4d6c8b0a1e3f5d7c9b2a4e6f8d0c2b4a6e8f0a2c4e6b8d0f2a',
        shariaAuditId: 'AUD-SIM-TABARRU',
        feeUjrah: 75000, // Non-compliant fee on Tabarru/Zakat
        location: 'Surabaya, Jawa Timur',
        isTamperProof: true,
        ipAddress: '180.252.164.12',
        beneficiary: 'Ahmad Fauzi & Keluarga',
        details: 'Simulasi Pelanggaran Akad: Ujrah Rp 75.000 pada dana Zakat Maal (Wajib Rp 0)',
      };
      setSimulatedScenarios([simTx]);
      sounds.playAlert();
      onShowToast?.('Skenario Pelanggaran Akad Fikih Tabarru berhasil disuntikkan!');
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    sounds.playClick();
    navigator.clipboard.writeText(text);
    setCopiedAuditId(id);
    setTimeout(() => setCopiedAuditId(null), 2000);
    onShowToast?.('Data forensik audit disalin ke clipboard.');
  };

  return (
    <div className="space-y-6 animate-fade-in" id="ai-risk-scoring-module-root">
      
      {/* Top Banner: Engine Status & AI Intelligence Overview */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-[#111622] to-emerald-950 text-white border border-emerald-500/30 shadow-xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold tracking-wide">
                <BrainCircuit className="w-3.5 h-3.5" />
                NEURAL FRAUD & ANOMALY ENGINE v3.8
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[11px] font-mono">
                <Activity className="w-3 h-3 animate-pulse text-emerald-400" />
                Live Heuristic Inspection
              </span>
            </div>

            <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
              <span>AI Risk Scoring & Deteksi Anomali Transaksi</span>
            </h2>

            <p className="text-xs text-slate-300 leading-relaxed">
              Modul inspeksi otomatis pola transaksi voucher secara real-time. Mendeteksi anomali frekuensi transaksi (*velocity spikes*), loncatan lokasi geografis (*geo-drift*), transaksi di merchant tidak berizin, manipulasi ujrah, serta potensi risiko *double-spending* sesuai kepatuhan DSN-MUI & OJK.
            </p>
          </div>

          {/* Real-time Scan Trigger & Sensitivity Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
            {/* Sensitivity Picker */}
            <div className="flex items-center bg-slate-800/80 backdrop-blur-xs p-1 rounded-2xl border border-white/[0.1] text-xs">
              <span className="px-2 text-[10px] font-mono text-slate-400 flex items-center gap-1">
                <Sliders className="w-3 h-3" /> Sensitivitas:
              </span>
              <button
                type="button"
                onClick={() => {
                  sounds.playToggle();
                  setSensitivity('standard');
                }}
                className={`px-2.5 py-1.5 rounded-xl font-bold transition-all ${
                  sensitivity === 'standard' 
                    ? 'bg-emerald-600 text-white shadow-xs' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Standar
              </button>
              <button
                type="button"
                onClick={() => {
                  sounds.playToggle();
                  setSensitivity('strict');
                }}
                className={`px-2.5 py-1.5 rounded-xl font-bold transition-all ${
                  sensitivity === 'strict' 
                    ? 'bg-amber-600 text-white shadow-xs' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Ketat
              </button>
              <button
                type="button"
                onClick={() => {
                  sounds.playToggle();
                  setSensitivity('audit');
                }}
                className={`px-2.5 py-1.5 rounded-xl font-bold transition-all ${
                  sensitivity === 'audit' 
                    ? 'bg-red-600 text-white shadow-xs' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Audit DPS
              </button>
            </div>

            {/* Scan Button */}
            <button
              id="ai-risk-rescan-btn"
              type="button"
              disabled={isScanning}
              onClick={handleTriggerScan}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? `Memindai (${scanProgress}%)...` : 'Pindai Pola Transaksi'}</span>
            </button>
          </div>
        </div>

        {/* Scan Progress Bar */}
        {isScanning && (
          <div className="mt-4 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-200"
              style={{ width: `${scanProgress}%` }}
            />
          </div>
        )}
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        
        {/* Metric 1: System Risk Score */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Skor Risiko Sistem</span>
            <Activity className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl font-black font-mono ${
              metrics.avgScore > 60 ? 'text-rose-500' : metrics.avgScore > 30 ? 'text-amber-500' : 'text-emerald-600 dark:text-emerald-400'
            }`}>
              {metrics.avgScore}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">/ 100</span>
          </div>
          <div className="mt-2 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Kondisi Ekosistem Sehat</span>
          </div>
        </div>

        {/* Metric 2: Total Analyzed */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Transaksi Dianalisis</span>
            <BrainCircuit className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
              {metrics.total}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">record</span>
          </div>
          <div className="mt-2 text-[10px] text-slate-400">
            Terakhir dipindai: <span className="font-bold text-slate-700 dark:text-slate-300">{lastScanTime}</span>
          </div>
        </div>

        {/* Metric 3: Anomalies Detected */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Anomali Terdeteksi</span>
            <AlertOctagon className={`w-4 h-4 ${metrics.anomaliesCount > 0 ? 'text-amber-500' : 'text-slate-400'}`} />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl font-black font-mono ${metrics.anomaliesCount > 0 ? 'text-amber-500' : 'text-slate-900 dark:text-white'}`}>
              {metrics.anomaliesCount}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">kasus</span>
          </div>
          <div className="mt-2 text-[10px] text-slate-500 dark:text-slate-400">
            {metrics.anomaliesCount === 0 ? 'Tidak ada anomali kritis' : 'Memerlukan review'}
          </div>
        </div>

        {/* Metric 4: Safe Transactions Ratio */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Rasio Transaksi Wajar</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
              {metrics.safePercentage}%
            </span>
          </div>
          <div className="mt-2 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
            Tingkat kepatuhan tinggi
          </div>
        </div>

        {/* Metric 5: Active Vouchers Protected */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Voucher Terproteksi</span>
            <ShieldCheck className="w-4 h-4 text-teal-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
              {vouchers.length}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">unit</span>
          </div>
          <div className="mt-2 text-[10px] text-slate-500 dark:text-slate-400">
            {vouchers.filter(v => v.status === 'FROZEN').length} voucher dibekukan
          </div>
        </div>

        {/* Metric 6: Sharia Nonce Integrity */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Integritas Nonce</span>
            <Lock className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
              100%
            </span>
          </div>
          <div className="mt-2 text-[10px] text-slate-500 dark:text-slate-400">
            SHA-256 HMAC Sealed
          </div>
        </div>

      </div>

      {/* Simulator Sandbox: Test Anomaly Scenarios in 1-Click */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.08] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Sandbox Simulasi Pengujian AI Risk Engine:</span>
            <span className="text-[10px] font-normal text-slate-500">Uji respons model terhadap skenario anomali</span>
          </div>

          {simulatedScenarios.length > 0 && (
            <button
              type="button"
              onClick={() => handleInjectSimulation('RESET')}
              className="text-[11px] text-rose-500 hover:text-rose-600 font-bold underline flex items-center gap-1 self-start sm:self-auto"
            >
              Reset ke Transaksi Awal ({simulatedScenarios.length} simulasi aktif)
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handleInjectSimulation('UNAUTHORIZED_MERCHANT')}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-[#202026] hover:bg-slate-100 dark:hover:bg-[#282830] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/[0.08] transition-all flex items-center gap-1.5"
          >
            <Store className="w-3.5 h-3.5 text-rose-500" />
            <span>Uji: Merchant Di Luar Whitelist</span>
          </button>

          <button
            type="button"
            onClick={() => handleInjectSimulation('RAPID_BURST')}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-[#202026] hover:bg-slate-100 dark:hover:bg-[#282830] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/[0.08] transition-all flex items-center gap-1.5"
          >
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>Uji: Anomali Kecepatan (Rapid Burst & Geo-jump)</span>
          </button>

          <button
            type="button"
            onClick={() => handleInjectSimulation('TABARRU_FEE')}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-[#202026] hover:bg-slate-100 dark:hover:bg-[#282830] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/[0.08] transition-all flex items-center gap-1.5"
          >
            <Scale className="w-3.5 h-3.5 text-indigo-500" />
            <span>Uji: Pelanggaran Ujrah Akad Tabarru/Zakat</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-4 bg-white dark:bg-[#121215] rounded-2xl border border-slate-200 dark:border-white/[0.08] shadow-xs">
        
        {/* Risk Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-bold text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filter:
          </span>
          <button
            type="button"
            onClick={() => setRiskFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              riskFilter === 'ALL'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1c1c22]'
            }`}
          >
            Semua ({analyzedData.length})
          </button>

          <button
            type="button"
            onClick={() => setRiskFilter('CRITICAL_HIGH')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              riskFilter === 'CRITICAL_HIGH'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30'
            }`}
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>Anomali / Risiko Tinggi ({metrics.anomaliesCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setRiskFilter('MEDIUM')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              riskFilter === 'MEDIUM'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Waspada ({metrics.medium})</span>
          </button>

          <button
            type="button"
            onClick={() => setRiskFilter('LOW')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              riskFilter === 'LOW'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Wajar & Aman ({metrics.low})</span>
          </button>
        </div>

        {/* Search input */}
        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kode voucher, merchant, nama..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-100 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.08] rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

      </div>

      {/* Main Analysis Cards List */}
      <div className="space-y-3">
        {filteredData.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-[#121215] rounded-2xl border border-slate-200 dark:border-white/[0.08]">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-80" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Tidak Ditemukan Kasus Risiko</h3>
            <p className="text-xs text-slate-500 mt-1">
              Semua transaksi pada filter ini memenuhi parameter kepatuhan transaksi syariah.
            </p>
          </div>
        ) : (
          filteredData.map((item) => {
            const { transaction, voucher, riskScore, riskLevel, flags, aiAnalysisSummary, suggestedAction, isManuallyReviewed } = item;
            const isVoucherFrozen = voucher?.status === 'FROZEN';

            return (
              <div 
                key={transaction.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  riskLevel === 'CRITICAL' || riskLevel === 'HIGH'
                    ? 'bg-rose-50/40 dark:bg-rose-950/15 border-rose-200 dark:border-rose-900/40 hover:border-rose-300'
                    : riskLevel === 'MEDIUM'
                    ? 'bg-amber-50/40 dark:bg-amber-950/15 border-amber-200 dark:border-amber-900/40 hover:border-amber-300'
                    : 'bg-white dark:bg-[#121215] border-slate-200 dark:border-white/[0.08] hover:border-emerald-500/30'
                }`}
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  
                  {/* Left Column: Transaction Identification */}
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-extrabold text-slate-900 dark:text-white">
                        {transaction.voucherCode}
                      </span>

                      {/* Transaction Type Badge */}
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-100 dark:bg-[#1a1a22] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/[0.06]">
                        {transaction.type}
                      </span>

                      {/* Channel */}
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                        {transaction.bankChannel.replace('_', ' ')}
                      </span>

                      {/* Review State Badge */}
                      {isManuallyReviewed && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                          <Check className="w-2.5 h-2.5" /> Terverifikasi Manual
                        </span>
                      )}

                      {/* Frozen Badge */}
                      {isVoucherFrozen && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-600 text-white flex items-center gap-1 animate-pulse">
                          <Lock className="w-2.5 h-2.5" /> Voucher DIBEKUKAN
                        </span>
                      )}
                    </div>

                    <div className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">
                      {transaction.voucherTitle}
                    </div>

                    {/* Metadata chips */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Store className="w-3 h-3 text-slate-400" />
                        <span className="font-medium text-slate-700 dark:text-slate-300">{transaction.merchantName}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{transaction.location}</span>
                      </span>
                      <span className="flex items-center gap-1 font-mono text-[10px]">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{transaction.timestamp}</span>
                      </span>
                      <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">
                        Rp {transaction.amount.toLocaleString('id-ID')}
                      </span>
                      {transaction.feeUjrah > 0 && (
                        <span className="text-[10px] text-slate-500 font-mono">
                          (Ujrah: Rp {transaction.feeUjrah.toLocaleString('id-ID')})
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Middle Column: Risk Score & Level Meter */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono">
                        Tingkat Risiko
                      </div>
                      <div className="flex items-baseline justify-end gap-1">
                        <span className={`text-xl font-black font-mono ${
                          riskLevel === 'CRITICAL' || riskLevel === 'HIGH'
                            ? 'text-rose-600 dark:text-rose-400'
                            : riskLevel === 'MEDIUM'
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-emerald-600 dark:text-emerald-400'
                        }`}>
                          {riskScore}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">/ 100</span>
                      </div>
                    </div>

                    <div className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
                      riskLevel === 'CRITICAL' || riskLevel === 'HIGH'
                        ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25'
                        : riskLevel === 'MEDIUM'
                        ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25'
                        : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {riskLevel === 'CRITICAL' || riskLevel === 'HIGH' ? (
                        <AlertOctagon className="w-3.5 h-3.5" />
                      ) : riskLevel === 'MEDIUM' ? (
                        <AlertTriangle className="w-3.5 h-3.5" />
                      ) : (
                        <ShieldCheck className="w-3.5 h-3.5" />
                      )}
                      <span>{riskLevel === 'CRITICAL' ? 'KRITIS' : riskLevel === 'HIGH' ? 'TINGGI' : riskLevel === 'MEDIUM' ? 'SEDANG' : 'RENDAH'}</span>
                    </div>
                  </div>

                  {/* Right Column: Interactive Actions */}
                  <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end border-t lg:border-t-0 pt-2 lg:pt-0 border-slate-200 dark:border-white/[0.06]">
                    
                    {/* Freeze / Unfreeze Voucher Button */}
                    {voucher && (
                      <button
                        type="button"
                        onClick={() => handleToggleFreezeVoucher(voucher)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                          isVoucherFrozen
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                            : 'bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800/60'
                        }`}
                        title={isVoucherFrozen ? 'Buka Pembekuan Voucher' : 'Bekukan Voucher untuk Mencegah Fraud'}
                      >
                        {isVoucherFrozen ? (
                          <>
                            <Unlock className="w-3.5 h-3.5" />
                            <span>Buka Beku</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-3.5 h-3.5" />
                            <span>Bekukan Voucher</span>
                          </>
                        )}
                      </button>
                    )}

                    {/* Verify / Whitelist Button */}
                    <button
                      type="button"
                      onClick={() => handleToggleVerifyTransaction(transaction.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isManuallyReviewed
                          ? 'bg-slate-200 dark:bg-[#1a1a22] text-slate-700 dark:text-slate-300'
                          : 'bg-white dark:bg-[#16161A] hover:bg-slate-100 dark:hover:bg-[#202026] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/[0.08]'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{isManuallyReviewed ? 'Batal Verifikasi' : 'Verifikasi'}</span>
                    </button>

                    {/* View Details Drawer Toggle */}
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        setSelectedAnalysis(item);
                      }}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 transition-all shadow-xs"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Detail AI</span>
                    </button>

                  </div>

                </div>

                {/* Flagged Factors Pills */}
                {flags.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-white/[0.06] flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                      Indikator Anomali:
                    </span>
                    {flags.map((flag, fIdx) => (
                      <span
                        key={fIdx}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-semibold ${
                          flag.severity === 'CRITICAL' || flag.severity === 'HIGH'
                            ? 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/20'
                            : flag.severity === 'MEDIUM'
                            ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/20'
                            : 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-500/20'
                        }`}
                      >
                        <AlertTriangle className="w-2.5 h-2.5" />
                        <span>{flag.label} (+{flag.scoreImpact})</span>
                      </span>
                    ))}
                  </div>
                )}

                {/* AI Brief Insight Box */}
                <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-[#16161A] border border-slate-100 dark:border-white/[0.04] text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2.5 leading-relaxed">
                  <Sparkles className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-800 dark:text-slate-200 mr-1">Rekomendasi AI:</span>
                    <span>{aiAnalysisSummary}</span>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* AI Mitigations & System Hardening Guidelines */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Rekomendasi Proteksi Otomatis Transaksi Syariah (DSN-MUI Rulebook)
            </h3>
          </div>
          <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
            Autonomous Policy Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.06] space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>Pencegahan Velocity Spike</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Terapkan jeda waktu 45 detik antara dua penebusan berurutan pada kode voucher yang sama untuk mengeliminasi upaya multi-tapping atau bot scraping.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.06] space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
              <Store className="w-3.5 h-3.5 text-emerald-500" />
              <span>Enforcement Merchant Whitelist</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Voucher kategori ZISWAF dan Bantuan Pendidikan secara otomatis ditolak jika dipindai di luar terminal merchant UMKM & Halal Mart binaan terdaftar.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.06] space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
              <Scale className="w-3.5 h-3.5 text-indigo-500" />
              <span>Zero-Ujrah Guarantee Tabarru</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Smart contract verifikasi secara mutlak menolak pemotongan biaya transaksi pada akad Tabarru/Zakat sesuai Fatwa DSN-MUI No. 116.
            </p>
          </div>

        </div>
      </div>

      {/* DETAIL MODAL / DRAWER FOR SELECTED ANALYSIS */}
      {selectedAnalysis && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.1] rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
                  <BrainCircuit className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Audit Forensik AI Risk Scoring
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">
                    ID Transaksi: {selectedAnalysis.transaction.id}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setSelectedAnalysis(null);
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold px-2 py-1 rounded-lg"
              >
                ✕ Tutup
              </button>
            </div>

            {/* Score & Risk Level Banner */}
            <div className={`p-4 rounded-2xl flex items-center justify-between ${
              selectedAnalysis.riskLevel === 'CRITICAL' || selectedAnalysis.riskLevel === 'HIGH'
                ? 'bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400'
                : selectedAnalysis.riskLevel === 'MEDIUM'
                ? 'bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400'
                : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400'
            }`}>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider block">
                  Indeks Risiko Komposit
                </span>
                <span className="text-2xl font-black font-mono">
                  {selectedAnalysis.riskScore} / 100 ({selectedAnalysis.riskLevel})
                </span>
              </div>

              <div className="text-right text-xs space-y-0.5">
                <span className="block font-bold">Status: {selectedAnalysis.status}</span>
                <span className="text-[11px] opacity-80">{selectedAnalysis.flags.length} faktor kecurigaan terdeteksi</span>
              </div>
            </div>

            {/* Breakdown of Risk Flags */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                Rincian Evaluasi Parameter AI:
              </h4>

              {selectedAnalysis.flags.length === 0 ? (
                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Tidak ada anomali atau pelanggaran parameter yang terdeteksi. Transaksi dinilai aman dan syariah compliant.</span>
                </div>
              ) : (
                selectedAnalysis.flags.map((flag, idx) => (
                  <div 
                    key={idx} 
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.06] space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <AlertTriangle className={`w-3.5 h-3.5 ${flag.severity === 'HIGH' || flag.severity === 'CRITICAL' ? 'text-rose-500' : 'text-amber-500'}`} />
                        {flag.label}
                      </span>
                      <span className="font-mono text-[10px] font-bold text-rose-500">
                        +{flag.scoreImpact} pts
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                      {flag.description}
                    </p>
                    <div className="pt-1 text-[10px] font-mono text-slate-500 dark:text-slate-400">
                      Bukti Forensik: <span className="text-slate-700 dark:text-slate-200">{flag.evidence}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cryptographic Hash & Chain Info */}
            <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.06] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 font-mono text-[11px]">
                  <Lock className="w-3.5 h-3.5 text-emerald-500" />
                  SHA-256 HMAC Payload Seal:
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(selectedAnalysis.transaction.endToEndHash, selectedAnalysis.transaction.id)}
                  className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                >
                  {copiedAuditId === selectedAnalysis.transaction.id ? (
                    <>
                      <Check className="w-3 h-3" /> Tersalin
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" /> Salin Hash
                    </>
                  )}
                </button>
              </div>
              <div className="font-mono text-[10px] text-slate-500 dark:text-slate-400 break-all bg-white dark:bg-[#0D0D10] p-2 rounded-lg border border-slate-200 dark:border-white/[0.04]">
                {selectedAnalysis.transaction.endToEndHash}
              </div>
            </div>

            {/* Modal Action Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-white/[0.08]">
              {selectedAnalysis.voucher && (
                <button
                  type="button"
                  onClick={() => {
                    handleToggleFreezeVoucher(selectedAnalysis.voucher!);
                    setSelectedAnalysis(null);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    selectedAnalysis.voucher.status === 'FROZEN'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-rose-600 hover:bg-rose-500 text-white'
                  }`}
                >
                  {selectedAnalysis.voucher.status === 'FROZEN' ? (
                    <>
                      <Unlock className="w-3.5 h-3.5" />
                      <span>Buka Pembekuan Voucher</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Bekukan Voucher Ini Sekarang</span>
                    </>
                  )}
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setSelectedAnalysis(null);
                }}
                className="ml-auto px-4 py-2 rounded-xl text-xs font-bold bg-slate-200 hover:bg-slate-300 dark:bg-[#202026] dark:hover:bg-[#282830] text-slate-800 dark:text-slate-200 transition-all"
              >
                Selesai
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
