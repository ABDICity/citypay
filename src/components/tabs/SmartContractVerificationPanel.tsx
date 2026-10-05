import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  BrainCircuit,
  FileCheck,
  RefreshCw,
  Sparkles,
  Sliders,
  Layers,
  Award,
  BookOpen,
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
  Wand2,
  Scale,
  Hash,
  Lock,
  Download,
  Eye,
  ListFilter,
  Activity,
  Zap,
  Info
} from 'lucide-react';
import { Voucher, Language } from '../../types';
import { translations } from '../../utils/translations';
import { sounds } from '../../utils/soundEffects';
import {
  SmartContractProtocol,
  SmartContractVerificationReport,
  ALL_SMART_CONTRACT_PROTOCOLS,
  BAZNAS_ZAKAT_PROTOCOL,
  BWI_WAQF_PROTOCOL,
  INFAQ_TABARRU_PROTOCOL,
  MUI_QURBAN_PROTOCOL,
  matchBestProtocol,
  verifyVoucherSmartContract,
  autoPatchVoucherForSmartContract
} from '../../utils/shariaSmartContractEngine';

interface SmartContractVerificationPanelProps {
  currentLang: Language;
  vouchers: Voucher[];
  onUpdateVoucher?: (updated: Voucher) => void;
  onShowToast?: (message: string) => void;
}

export const SmartContractVerificationPanel: React.FC<SmartContractVerificationPanelProps> = ({
  currentLang,
  vouchers,
  onUpdateVoucher,
  onShowToast
}) => {
  const [selectedVoucherId, setSelectedVoucherId] = useState<string>(vouchers[0]?.id || '');
  const [selectedProtocolId, setSelectedProtocolId] = useState<string>('auto');
  const [isVerifying, setIsVerifying] = useState(false);
  const [currentReport, setCurrentReport] = useState<SmartContractVerificationReport | null>(null);
  const [activeRuleFilter, setActiveRuleFilter] = useState<'ALL' | 'PASSED' | 'WARNING' | 'FAILED'>('ALL');
  const [copiedHash, setCopiedHash] = useState(false);
  const [viewMode, setViewMode] = useState<'single' | 'batch' | 'simulator'>('single');
  const [batchReports, setBatchReports] = useState<SmartContractVerificationReport[]>([]);
  const [isBatchScanning, setIsBatchScanning] = useState(false);

  // Simulator State
  const [simCategory, setSimCategory] = useState<Voucher['category']>('ziswaf');
  const [simContract, setSimContract] = useState<Voucher['shariaContract']>('Hibah / Tabarru');
  const [simFaceValue, setSimFaceValue] = useState<number>(1000000);
  const [simBeneficiary, setSimBeneficiary] = useState<string>('Keluarga Prasejahtera (Mustahiq Dhuafa)');
  const [simMerchants, setSimMerchants] = useState<string>('Halal Mart Nasional, Koperasi Syariah Berkah');
  const [simDesc, setSimDesc] = useState<string>('Bantuan sembako dan modal usaha dhuafa bebas riba.');

  // Current selected voucher object
  const selectedVoucher = vouchers.find(v => v.id === selectedVoucherId) || vouchers[0];

  // Run single verification
  const runVerification = async (voucherToVerify?: Voucher, protocolIdToUse?: string) => {
    const v = voucherToVerify || selectedVoucher;
    if (!v) return;

    setIsVerifying(true);
    sounds.playClick();

    const protoId = protocolIdToUse !== undefined ? protocolIdToUse : selectedProtocolId;
    let protoOverride: SmartContractProtocol | undefined = undefined;
    if (protoId !== 'auto') {
      protoOverride = ALL_SMART_CONTRACT_PROTOCOLS.find(p => p.id === protoId);
    }

    try {
      const report = await verifyVoucherSmartContract(v, protoOverride);
      setTimeout(() => {
        setCurrentReport(report);
        setIsVerifying(false);
        sounds.playSuccess();
      }, 400);
    } catch (err) {
      setIsVerifying(false);
    }
  };

  // Run verification on initial mount or voucher change
  useEffect(() => {
    if (selectedVoucher) {
      runVerification(selectedVoucher, selectedProtocolId);
    }
  }, [selectedVoucherId, selectedProtocolId]);

  // Run Batch Scan over all vouchers
  const handleBatchScanAll = async () => {
    setIsBatchScanning(true);
    sounds.playClick();

    const reports: SmartContractVerificationReport[] = [];
    for (const v of vouchers) {
      const rep = await verifyVoucherSmartContract(v);
      reports.push(rep);
    }

    setTimeout(() => {
      setBatchReports(reports);
      setIsBatchScanning(false);
      setViewMode('batch');
      sounds.playSuccess();
      if (onShowToast) {
        onShowToast(`Audit Smart Contract berhasil: ${reports.length} voucher diverifikasi terhadap protokol DSN-MUI / BWI.`);
      }
    }, 600);
  };

  // Run Simulator Check
  const handleRunSimulatorCheck = async () => {
    setIsVerifying(true);
    sounds.playClick();

    const mockSimVoucher: Voucher = {
      id: 'sim-voucher-001',
      code: 'SIM-TEST-2026-X1',
      title: `Voucher Simulasi: ${simCategory.toUpperCase()}`,
      category: simCategory,
      shariaContract: simContract,
      faceValue: simFaceValue,
      remainingBalance: simFaceValue,
      currency: 'IDR',
      status: 'ACTIVE',
      issuedDate: new Date().toISOString().substring(0, 10),
      expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
      beneficiaryName: simBeneficiary,
      beneficiaryPhone: '+6281200001111',
      beneficiaryEmail: 'mustahiq.sim@example.org',
      merchantsAllowed: simMerchants.split(',').map(m => m.trim()).filter(Boolean),
      encryptedHash: 'sim_hash_aes256_mock_e3b0c44298fc1c149afbf4c8996fb92427ae',
      digitalSignature: 'SIG_DSN_MUI_2026_SIMULATOR_AES256GCM_OK',
      qrPayload: 'ISLAMICITYPAY://SIMULATOR?TEST=1',
      pinRequired: true,
      securityLevel: 'AES-256-GCM',
      totalUsageCount: 0,
      maxUsageCount: 3,
      description: simDesc,
      terms: 'Sesuai fatwa DSN-MUI untuk simulasi kepatuhan.',
    };

    const protoOverride = selectedProtocolId !== 'auto' 
      ? ALL_SMART_CONTRACT_PROTOCOLS.find(p => p.id === selectedProtocolId)
      : undefined;

    const rep = await verifyVoucherSmartContract(mockSimVoucher, protoOverride);
    setTimeout(() => {
      setCurrentReport(rep);
      setIsVerifying(false);
      sounds.playSuccess();
    }, 350);
  };

  // Auto-Remediate (Auto-Patch) Voucher
  const handleAutoRemediate = () => {
    if (!selectedVoucher || !currentReport) return;
    sounds.playClick();

    const patchedVoucher = autoPatchVoucherForSmartContract(selectedVoucher, currentReport.protocol);
    if (onUpdateVoucher) {
      onUpdateVoucher(patchedVoucher);
    }

    // Re-verify patched voucher
    runVerification(patchedVoucher, selectedProtocolId);

    if (onShowToast) {
      onShowToast(`Voucher ${selectedVoucher.code} berhasil diperbaiki otomatis ke 100% Kepatuhan Syariah!`);
    }
  };

  const copyVerificationHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(true);
    sounds.playClick();
    setTimeout(() => setCopiedHash(false), 2000);
  };

  // Filtered Rules
  const filteredRules = currentReport?.ruleResults.filter(r => {
    if (activeRuleFilter === 'ALL') return true;
    return r.status === activeRuleFilter;
  }) || [];

  return (
    <div className="space-y-6 animate-fade-in" id="smart-contract-verification-container">
      
      {/* 1. TOP HEADER & PROTOCOL SELECTION BAR */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950 via-[#101915] to-teal-950 border border-emerald-500/30 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold font-mono border border-emerald-500/40">
              <BrainCircuit className="w-4 h-4 text-emerald-400" />
              <span>ISLAMIC FINANCE SMART CONTRACT ENGINE v2.6</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span>Verifikasi Smart Contract Syariah & Protokol ZISWAF</span>
            </h2>
            <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Pemeriksaan otomatis kepatuhan akad fikih penerbitan voucher terhadap template regulasi <strong>BAZNAS</strong>, <strong>Badan Wakaf Indonesia (BWI)</strong>, dan <strong>Fatwa DSN-MUI</strong> secara real-time & kriptografis.
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-black/40 border border-white/[0.1] shrink-0 self-start lg:self-auto">
            <button
              onClick={() => {
                sounds.playClick();
                setViewMode('single');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'single'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Audit Voucher</span>
            </button>

            <button
              onClick={handleBatchScanAll}
              disabled={isBatchScanning}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'batch'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {isBatchScanning ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
              ) : (
                <Layers className="w-3.5 h-3.5" />
              )}
              <span>Batch Matrix ({vouchers.length})</span>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                setViewMode('simulator');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'simulator'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Simulasi Template</span>
            </button>
          </div>
        </div>

        {/* Protocol Selector Chips */}
        <div className="mt-6 pt-5 border-t border-white/[0.1] flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold text-emerald-400/90 uppercase tracking-wider flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" />
            Template Fikih:
          </span>

          <button
            onClick={() => setSelectedProtocolId('auto')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              selectedProtocolId === 'auto'
                ? 'bg-emerald-500/30 text-emerald-200 border-emerald-400/60 shadow-xs'
                : 'bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 border-white/[0.08]'
            }`}
          >
            ⚡ Auto-Detect Sesuai Kategori Voucher
          </button>

          {ALL_SMART_CONTRACT_PROTOCOLS.map((proto) => (
            <button
              key={proto.id}
              onClick={() => {
                sounds.playClick();
                setSelectedProtocolId(proto.id);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                selectedProtocolId === proto.id
                  ? 'bg-emerald-500/30 text-emerald-200 border-emerald-400/60 shadow-xs'
                  : 'bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 border-white/[0.08]'
              }`}
            >
              {proto.name.split('(')[0].trim()}
            </button>
          ))}
        </div>
      </div>

      {/* 2. MODE: SINGLE VOUCHER VERIFICATION */}
      {viewMode === 'single' && (
        <div className="space-y-6">
          
          {/* Voucher Selector & Quick Action Bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            
            <div className="flex-1 flex items-center gap-3">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0">
                Pilih Voucher:
              </label>
              <select
                value={selectedVoucherId}
                onChange={(e) => setSelectedVoucherId(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#16161A] border border-slate-300 dark:border-white/[0.1] text-xs font-bold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/30 outline-hidden"
              >
                {vouchers.map((v) => (
                  <option key={v.id} value={v.id}>
                    [{v.code}] {v.title} • {v.shariaContract} (Rp {v.faceValue.toLocaleString('id-ID')})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => runVerification()}
                disabled={isVerifying}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold flex items-center gap-2 shadow-md shadow-emerald-600/30 transition-all hover:scale-[1.02] disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
                <span>{isVerifying ? 'Memindai Klausul...' : 'Pindai Ulang Smart Contract'}</span>
              </button>

              {currentReport && currentReport.overallStatus !== 'COMPLIANT' && (
                <button
                  onClick={handleAutoRemediate}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-emerald-600 hover:from-amber-500 hover:to-emerald-500 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-amber-600/20 transition-all hover:scale-[1.02]"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Auto-Fix ke 100% Syariah</span>
                </button>
              )}
            </div>

          </div>

          {/* Verification Report Card */}
          {currentReport && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Compliance Score & Protocol Meta */}
              <div className="lg:col-span-1 space-y-6">
                
                {/* Score Summary Box */}
                <div className="p-6 rounded-3xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] shadow-sm text-center space-y-4">
                  <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-100 dark:text-white/[0.06]"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className={`${
                          currentReport.complianceScore >= 90
                            ? 'text-emerald-500'
                            : currentReport.complianceScore >= 70
                            ? 'text-amber-500'
                            : 'text-rose-500'
                        } transition-all duration-1000 ease-out`}
                        strokeDasharray={`${currentReport.complianceScore}, 100`}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
                        {currentReport.complianceScore}%
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        Kepatuhan
                      </span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {currentReport.overallStatus === 'COMPLIANT' ? (
                      <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-xs font-black">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>LULUS KEPATUHAN SYARIAH</span>
                      </div>
                    ) : currentReport.overallStatus === 'WARNING_ADVISORY' ? (
                      <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-xs font-black">
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                        <span>CATATAN OPTIMASI SYARIAH</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30 text-xs font-black">
                        <XCircle className="w-4 h-4 text-rose-500" />
                        <span>PELANGGARAN AKAD KRITIS</span>
                      </div>
                    )}
                  </div>

                  {/* Stats Breakdown */}
                  <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 dark:border-white/[0.06] text-center">
                    <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/20">
                      <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono">
                        {currentReport.rulesPassed}
                      </div>
                      <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400">Lulus</div>
                    </div>

                    <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-500/20">
                      <div className="text-lg font-black text-amber-600 dark:text-amber-400 font-mono">
                        {currentReport.rulesWarning}
                      </div>
                      <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400">Peringatan</div>
                    </div>

                    <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-500/20">
                      <div className="text-lg font-black text-rose-600 dark:text-rose-400 font-mono">
                        {currentReport.rulesFailed}
                      </div>
                      <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400">Gagal</div>
                    </div>
                  </div>

                </div>

                {/* Protocol Info & Authority */}
                <div className="p-5 rounded-3xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] shadow-sm space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-500 dark:text-slate-400">Protokol Fikih</span>
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      {currentReport.protocol.code}
                    </span>
                  </div>

                  <div className="font-extrabold text-slate-900 dark:text-white text-sm">
                    {currentReport.protocol.name}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    {currentReport.protocol.description}
                  </p>

                  <div className="pt-3 border-t border-slate-100 dark:border-white/[0.06] space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-700 dark:text-slate-300 font-semibold">
                      <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>Otoritas: {currentReport.protocol.authority}</span>
                    </div>
                    <div className="flex items-start gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                      <BookOpen className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>Rujukan: {currentReport.protocol.fatwaReference}</span>
                    </div>
                  </div>
                </div>

                {/* Cryptographic Smart Contract Seal Card */}
                <div className="p-5 rounded-3xl bg-slate-950 text-white border border-emerald-500/30 shadow-lg space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5" />
                      Segel Bukti Kriptografis
                    </span>
                    <span className="text-[9px] font-mono text-slate-400">GASLESS EIP-712</span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[10px] text-slate-400">SHA-256 Verification Hash:</div>
                    <div className="p-2 rounded-xl bg-slate-900 border border-white/[0.1] font-mono text-[10px] text-emerald-300 break-all flex items-center justify-between gap-2">
                      <span>{currentReport.cryptographicSeal.sha256VerificationHash}</span>
                      <button
                        onClick={() => copyVerificationHash(currentReport.cryptographicSeal.sha256VerificationHash)}
                        className="p-1 text-slate-400 hover:text-white shrink-0"
                        title="Salin Hash"
                      >
                        {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-400 space-y-0.5">
                    <div>Signature: <span className="text-slate-200 font-mono">{currentReport.cryptographicSeal.shariaAuditorDigitalSig.substring(0, 32)}...</span></div>
                    <div>Timestamp: <span className="text-slate-200 font-mono">{currentReport.timestamp}</span></div>
                  </div>
                </div>

              </div>

              {/* Right Column: AI Executive Summary & Rules Inspection Matrix */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* AI Executive Summary Card */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-slate-50 to-teal-500/10 dark:from-emerald-950/40 dark:via-[#16161A] dark:to-teal-950/30 border border-emerald-500/20 shadow-sm space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                    <Sparkles className="w-4 h-4" />
                    <span>RINGKASAN EKSEKUTIF AUDIT FIKIH SMART CONTRACT AI</span>
                  </div>
                  <p className="text-xs md:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                    {currentReport.aiExecutiveSummary}
                  </p>

                  {currentReport.remediationRecommendations.length > 0 && (
                    <div className="pt-3 border-t border-slate-200/60 dark:border-white/[0.08] space-y-1.5">
                      <div className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Rekomendasi Tindakan Perbaikan:</span>
                      </div>
                      <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                        {currentReport.remediationRecommendations.map((rec, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-emerald-500 font-bold">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Rules Inspection Filter Bar */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 overflow-x-auto p-1 rounded-2xl bg-slate-100 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.08]">
                    {(['ALL', 'PASSED', 'WARNING', 'FAILED'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => {
                          sounds.playClick();
                          setActiveRuleFilter(tab);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          activeRuleFilter === tab
                            ? 'bg-white dark:bg-[#202026] text-emerald-600 dark:text-emerald-400 shadow-xs'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        {tab === 'ALL' && `Semua Aturan (${currentReport.totalRules})`}
                        {tab === 'PASSED' && `Lulus (${currentReport.rulesPassed})`}
                        {tab === 'WARNING' && `Peringatan (${currentReport.rulesWarning})`}
                        {tab === 'FAILED' && `Gagal (${currentReport.rulesFailed})`}
                      </button>
                    ))}
                  </div>

                  <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                    {filteredRules.length} Aturan Ditampilkan
                  </span>
                </div>

                {/* Detailed Rules List */}
                <div className="space-y-3">
                  {filteredRules.map((rule) => (
                    <div
                      key={rule.ruleId}
                      className={`p-5 rounded-2xl border transition-all ${
                        rule.status === 'PASSED'
                          ? 'bg-white dark:bg-[#121215] border-slate-200 dark:border-white/[0.08] hover:border-emerald-500/40'
                          : rule.status === 'WARNING'
                          ? 'bg-amber-500/[0.04] dark:bg-amber-950/20 border-amber-500/30'
                          : 'bg-rose-500/[0.04] dark:bg-rose-950/20 border-rose-500/30'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2">
                        
                        <div className="flex items-start gap-2.5">
                          {rule.status === 'PASSED' ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          ) : rule.status === 'WARNING' ? (
                            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                          )}

                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-extrabold text-xs md:text-sm text-slate-900 dark:text-white">
                                {rule.ruleName}
                              </h4>
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-slate-100 dark:bg-white/[0.08] text-slate-600 dark:text-slate-300">
                                {rule.fiqhPrinciple}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                              Standar: <span className="font-semibold text-slate-700 dark:text-slate-300">{rule.fiqhStandard}</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono ${
                              rule.status === 'PASSED'
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                : rule.status === 'WARNING'
                                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                            }`}
                          >
                            SKOR: {rule.score}/100
                          </span>
                        </div>

                      </div>

                      {/* Rule Inspection Values Comparison */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-white/[0.06] text-xs">
                        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#16161A] space-y-0.5">
                          <div className="text-[10px] font-bold text-slate-400">Parameter Terdeteksi:</div>
                          <div className="font-semibold text-slate-800 dark:text-slate-200 text-[11px]">
                            {rule.detectedValue}
                          </div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#16161A] space-y-0.5">
                          <div className="text-[10px] font-bold text-slate-400">Persyaratan Smart Contract:</div>
                          <div className="font-semibold text-slate-800 dark:text-slate-200 text-[11px]">
                            {rule.expectedRequirement}
                          </div>
                        </div>
                      </div>

                      {/* Sharia Justification */}
                      <div className="mt-2.5 text-[11px] text-slate-600 dark:text-slate-300 flex items-start gap-1.5 leading-relaxed bg-emerald-500/5 dark:bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-500/15">
                        <Scale className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span><strong>Landasan Fikih:</strong> {rule.shariaJustification}</span>
                      </div>

                      {/* Remediation Advice If Failed/Warning */}
                      {rule.remediationAdvice && (
                        <div className="mt-2 text-[11px] text-amber-800 dark:text-amber-300 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20 flex items-start justify-between gap-2">
                          <div className="flex items-start gap-1.5">
                            <Info className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                            <span><strong>Solusi AI:</strong> {rule.remediationAdvice}</span>
                          </div>
                          {rule.autoFixable && (
                            <button
                              onClick={handleAutoRemediate}
                              className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-[10px] shrink-0"
                            >
                              Terapkan Solusi
                            </button>
                          )}
                        </div>
                      )}

                    </div>
                  ))}
                </div>

              </div>

            </div>
          )}

        </div>
      )}

      {/* 3. MODE: BATCH MATRIX OVERVIEW */}
      {viewMode === 'batch' && (
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Matriks Kepatuhan Smart Contract Seluruh Voucher
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Hasil audit otomatis {batchReports.length} lembar voucher yang beredar di sistem.
                </p>
              </div>

              <button
                onClick={handleBatchScanAll}
                disabled={isBatchScanning}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isBatchScanning ? 'animate-spin' : ''}`} />
                <span>Pindai Ulang Seluruh Voucher</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-white/[0.08] text-[11px] text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-3">Kode & Judul Voucher</th>
                    <th className="py-3 px-3">Akad Fikih</th>
                    <th className="py-3 px-3">Template Protokol</th>
                    <th className="py-3 px-3 text-center">Skor Kepatuhan</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/[0.06]">
                  {batchReports.map((rep) => (
                    <tr key={rep.voucherId} className="hover:bg-slate-50 dark:hover:bg-white/[0.02]">
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900 dark:text-white">{rep.voucherCode}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">{rep.voucherTitle}</div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          {vouchers.find(v => v.id === rep.voucherId)?.shariaContract || '-'}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                          {rep.protocol.code.split('-')[1]} {rep.protocol.code.split('-')[2]}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="font-mono font-bold text-slate-900 dark:text-white">
                          {rep.complianceScore}%
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        {rep.overallStatus === 'COMPLIANT' ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                            COMPLIANT
                          </span>
                        ) : rep.overallStatus === 'WARNING_ADVISORY' ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                            WARNING ({rep.rulesWarning})
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                            VIOLATION ({rep.rulesFailed})
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right space-x-1">
                        <button
                          onClick={() => {
                            setSelectedVoucherId(rep.voucherId);
                            setViewMode('single');
                            sounds.playClick();
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/[0.08] hover:bg-emerald-500/20 hover:text-emerald-400 font-bold text-[11px]"
                        >
                          Lihat Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      )}

      {/* 4. MODE: CUSTOM VOUCHER SIMULATOR */}
      {viewMode === 'simulator' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] shadow-sm space-y-5">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-500" />
              <span>Simulator Pengujian Parameter Sebelum Penerbitan Voucher</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Uji coba kepatuhan fikih terhadap aturan DSN-MUI/BWI sebelum mencetak atau menerbitkan voucher ke mustahiq.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-500 dark:text-slate-400">Kategori Voucher</label>
              <select
                value={simCategory}
                onChange={(e) => setSimCategory(e.target.value as Voucher['category'])}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.1] text-slate-900 dark:text-slate-100 font-semibold"
              >
                <option value="ziswaf">ZISWAF & Bantuan Sosial</option>
                <option value="islamic_education">Pendidikan Islam & Beasiswa Santri</option>
                <option value="halal_mart">Halal Mart & Pangan Sembako</option>
                <option value="qurban_aqiqah">Qurban & Aqiqah Halal</option>
                <option value="umrah_hajj">Umrah & Haji Mabrur</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-500 dark:text-slate-400">Pilihan Akad Fikih</label>
              <select
                value={simContract}
                onChange={(e) => setSimContract(e.target.value as Voucher['shariaContract'])}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.1] text-slate-900 dark:text-slate-100 font-semibold"
              >
                <option value="Hibah / Tabarru">Hibah / Tabarru (Tanpa Balasan Komersial)</option>
                <option value="Wakalah bil Ujrah">Wakalah bil Ujrah (Jasa Pengelolaan)</option>
                <option value="Wadiah Yad Dhamanah">Wadiah Yad Dhamanah (Titipan Amanah)</option>
                <option value="Mudharabah">Mudharabah (Bagi Hasil Usaha - Dilarang untuk Zakat Pokok)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-500 dark:text-slate-400">Nominal Voucher (Rp)</label>
              <input
                type="number"
                value={simFaceValue}
                onChange={(e) => setSimFaceValue(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.1] text-slate-900 dark:text-slate-100 font-mono font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-500 dark:text-slate-400">Nama Penerima & Tagging Asnaf</label>
              <input
                type="text"
                value={simBeneficiary}
                onChange={(e) => setSimBeneficiary(e.target.value)}
                placeholder="Contoh: Bpk. Ahmad (Mustahiq Dhuafa Binaan BAZNAS)"
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.1] text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="font-bold text-slate-500 dark:text-slate-400">Whitelist Merchant Mitra (Dipisahkan Koma)</label>
              <input
                type="text"
                value={simMerchants}
                onChange={(e) => setSimMerchants(e.target.value)}
                placeholder="Halal Mart Nasional, Koperasi Syariah Berkah"
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.1] text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="font-bold text-slate-500 dark:text-slate-400">Keterangan & Ikrar Peruntukan</label>
              <textarea
                rows={2}
                value={simDesc}
                onChange={(e) => setSimDesc(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.1] text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-white/[0.08]">
            <span className="text-xs text-slate-500">
              Evaluator akan memproses parameter di atas menggunakan engine smart contract syariah.
            </span>

            <button
              onClick={() => {
                handleRunSimulatorCheck();
                setViewMode('single');
              }}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition-all hover:scale-[1.02]"
            >
              <Zap className="w-4 h-4" />
              <span>Jalankan Uji Kepatuhan Simulasi</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
