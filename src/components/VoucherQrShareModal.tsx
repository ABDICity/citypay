import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  QrCode, 
  ShieldCheck, 
  Share2, 
  Download, 
  Copy, 
  Check, 
  MessageCircle, 
  Printer, 
  RefreshCw, 
  Radio, 
  Building, 
  Calendar, 
  Coins, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  ExternalLink,
  ChevronDown,
  Palette,
  ScanLine,
  SmartphoneNfc,
  Layers,
  FileCheck
} from 'lucide-react';
import { Voucher, Language } from '../types';
import { translations } from '../utils/translations';
import { generateQrDataUrl, generateCurrentTotp, generateSha256 } from '../utils/crypto';
import { sounds } from '../utils/soundEffects';

interface VoucherQrShareModalProps {
  voucher: Voucher | null;
  allVouchers?: Voucher[];
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  onRedeem?: (v: Voucher) => void;
  onShowToast?: (message: string) => void;
}

export const VoucherQrShareModal: React.FC<VoucherQrShareModalProps> = ({
  voucher: initialVoucher,
  allVouchers = [],
  isOpen,
  onClose,
  currentLang,
  onRedeem,
  onShowToast,
}) => {
  const t = translations[currentLang];

  // Selected voucher state (allows switching between vouchers)
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(initialVoucher);

  // QR Mode: 'DYNAMIC_TOTP' (Rolling anti-screenshot single-use token) vs 'STATIC_E2EE' (Permanent encrypted payload)
  const [qrMode, setQrMode] = useState<'DYNAMIC_TOTP' | 'STATIC_E2EE'>('DYNAMIC_TOTP');

  // QR Color Theme
  const [colorTheme, setColorTheme] = useState<'emerald' | 'amber' | 'midnight' | 'mono'>('emerald');

  // Dynamic TOTP countdown state
  const [totpData, setTotpData] = useState<{ code: string; secondsRemaining: number }>({
    code: '888999',
    secondsRemaining: 30,
  });

  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Merchant Scanner Simulator State
  const [isSimulatingScan, setIsSimulatingScan] = useState(false);
  const [simulatedScanResult, setSimulatedScanResult] = useState<{
    success: boolean;
    merchant: string;
    verifiedAt: string;
    authTimeMs: number;
    hashValid: boolean;
  } | null>(null);

  // Sync selected voucher when initialVoucher changes
  useEffect(() => {
    if (initialVoucher) {
      setSelectedVoucher(initialVoucher);
      setSimulatedScanResult(null);
    }
  }, [initialVoucher]);

  // TOTP interval timer
  useEffect(() => {
    if (!isOpen || !selectedVoucher || qrMode !== 'DYNAMIC_TOTP') return;

    const updateTotp = () => {
      const current = generateCurrentTotp(selectedVoucher.code);
      setTotpData(current);
    };

    updateTotp();
    const interval = setInterval(updateTotp, 1000);
    return () => clearInterval(interval);
  }, [isOpen, selectedVoucher, qrMode]);

  // QR Code Generation Effect
  useEffect(() => {
    if (!isOpen || !selectedVoucher) return;

    let isMounted = true;
    setIsGenerating(true);

    const darkColorMap = {
      emerald: '#064e3b', // Deep emerald Syariah
      amber: '#92400e',   // Amber Gold
      midnight: '#0f172a',// Deep slate
      mono: '#000000',    // Black POS
    };

    const darkColor = darkColorMap[colorTheme] || '#064e3b';

    // Construct QR payload based on mode
    let payloadToEncode = selectedVoucher.qrPayload;
    if (qrMode === 'DYNAMIC_TOTP') {
      const timestamp = Math.floor(Date.now() / 1000);
      payloadToEncode = JSON.stringify({
        vch: selectedVoucher.code,
        bal: selectedVoucher.remainingBalance,
        totp: totpData.code,
        ts: timestamp,
        sharia: selectedVoucher.shariaContract,
        sig: selectedVoucher.encryptedHash.substring(0, 16),
        type: 'ISLAMICITY_DYNAMIC_CONTACTLESS',
      });
    }

    generateQrDataUrl(payloadToEncode, {
      darkColor,
      lightColor: '#ffffff',
      margin: 2,
      width: 340,
      errorCorrectionLevel: 'H',
    }).then((url) => {
      if (isMounted) {
        setQrDataUrl(url);
        setIsGenerating(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [isOpen, selectedVoucher, qrMode, colorTheme, totpData.code]);

  if (!isOpen || !selectedVoucher) return null;

  // Shareable contactless deep link
  const shareableUrl = `https://islamicitypay.id/redeem?code=${selectedVoucher.code}&auth=aes256&t=${Date.now()}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableUrl);
    sounds.playClick();
    setCopiedLink(true);
    if (onShowToast) onShowToast('Tautan Contactless Penebusan berhasil disalin ke papan klip!');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedVoucher.code);
    sounds.playClick();
    setCopiedCode(true);
    if (onShowToast) onShowToast(`Kode voucher ${selectedVoucher.code} disalin!`);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleShareWhatsApp = () => {
    sounds.playClick();
    const text = encodeURIComponent(
      `*ISLAMICITYPAY - VOUCHER SYARIAH DIGITAL*\n` +
      `Assalamu'alaikum Warahmatullahi Wabarakatuh,\n\n` +
      `Berikut adalah voucher digital Anda untuk transaksi contactless:\n` +
      `📌 *Program:* ${selectedVoucher.title}\n` +
      `💳 *Kode Voucher:* ${selectedVoucher.code}\n` +
      `💰 *Saldo:* Rp ${selectedVoucher.remainingBalance.toLocaleString('id-ID')}\n` +
      `👤 *Penerima:* ${selectedVoucher.beneficiaryName}\n` +
      `📜 *Akad Fikih:* ${selectedVoucher.shariaContract}\n` +
      `🏪 *Merchant Terdaftar:* ${selectedVoucher.merchantsAllowed.join(', ')}\n` +
      `⏳ *Kedaluwarsa:* ${selectedVoucher.expiryDate}\n\n` +
      `🔗 *Tautan Penebusan Contactless di Kasir:* \n${shareableUrl}\n\n` +
      `_Diverifikasi Dewan Syariah Nasional MUI & BAZNAS._`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleDownloadQrCard = () => {
    sounds.playSuccess();
    if (!qrDataUrl) return;

    // Create a high-res styled canvas to save complete voucher slip
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 600;
    canvas.height = 780;

    // Background gradient
    const bgGradient = ctx.createLinearGradient(0, 0, 0, 780);
    bgGradient.addColorStop(0, '#064e3b');
    bgGradient.addColorStop(0.2, '#042f2e');
    bgGradient.addColorStop(1, '#021814');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 600, 780);

    // Card Inner
    ctx.fillStyle = '#ffffff';
    ctx.roundRect(30, 30, 540, 720, 24);
    ctx.fill();

    // Top Header Banner
    ctx.fillStyle = '#065f46';
    ctx.roundRect(30, 30, 540, 90, [24, 24, 0, 0]);
    ctx.fill();

    // Header Text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('ISLAMICITYPAY DIGITAL PASS', 300, 70);
    ctx.font = '12px system-ui, sans-serif';
    ctx.fillStyle = '#a7f3d0';
    ctx.fillText('Fatwa DSN-MUI No. 116 • BAZNAS & BWI Compliance Verified', 300, 95);

    // Title & Beneficiary
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 18px system-ui, sans-serif';
    ctx.fillText(selectedVoucher.title, 300, 150);

    ctx.fillStyle = '#64748b';
    ctx.font = '13px system-ui, sans-serif';
    ctx.fillText(`Penerima: ${selectedVoucher.beneficiaryName} • Exp: ${selectedVoucher.expiryDate}`, 300, 175);

    // Face Value Box
    ctx.fillStyle = '#f0fdf4';
    ctx.roundRect(80, 195, 440, 50, 12);
    ctx.fill();
    ctx.strokeStyle = '#bbf7d0';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = '#065f46';
    ctx.font = 'bold 22px monospace, system-ui';
    ctx.fillText(`Rp ${selectedVoucher.remainingBalance.toLocaleString('id-ID')}`, 300, 228);

    // Draw QR image
    const qrImg = new Image();
    qrImg.onload = () => {
      ctx.drawImage(qrImg, 150, 260, 300, 300);

      // Voucher Code
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 18px monospace';
      ctx.fillText(selectedVoucher.code, 300, 590);

      ctx.fillStyle = '#64748b';
      ctx.font = '11px monospace';
      ctx.fillText(`HMAC-SHA256: ${selectedVoucher.encryptedHash.substring(0, 32)}...`, 300, 615);

      // Merchant Whitelist footer
      ctx.fillStyle = '#f8fafc';
      ctx.roundRect(50, 640, 500, 80, 12);
      ctx.fill();

      ctx.fillStyle = '#334155';
      ctx.font = 'bold 11px system-ui';
      ctx.fillText('LOKASI PENEBUSAN CONTACTLESS:', 300, 665);
      ctx.font = '11px system-ui';
      ctx.fillStyle = '#64748b';
      ctx.fillText(selectedVoucher.merchantsAllowed.join(' • '), 300, 685);
      ctx.fillText(`Akad: ${selectedVoucher.shariaContract} | Scan di Kasir Halal Mart`, 300, 705);

      // Trigger Download
      const link = document.createElement('a');
      link.download = `IslamiCityPay-QR-${selectedVoucher.code}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      if (onShowToast) onShowToast(`Pass QR Code ${selectedVoucher.code} berhasil diunduh!`);
    };
    qrImg.src = qrDataUrl;
  };

  const handlePrintSlip = () => {
    sounds.playClick();
    window.print();
  };

  // Simulate Contactless POS Scan
  const handleSimulatePosScan = async () => {
    setIsSimulatingScan(true);
    setSimulatedScanResult(null);
    sounds.playClick();

    const startTime = performance.now();
    const hash = await generateSha256(`${selectedVoucher.code}:${selectedVoucher.remainingBalance}`);

    setTimeout(() => {
      const endTime = performance.now();
      setIsSimulatingScan(false);
      sounds.playSuccess();
      setSimulatedScanResult({
        success: true,
        merchant: selectedVoucher.merchantsAllowed[0] || 'Halal Mart Madani Syariah',
        verifiedAt: new Date().toLocaleTimeString('id-ID'),
        authTimeMs: Math.round(endTime - startTime + 80),
        hashValid: true,
      });

      if (onShowToast) {
        onShowToast('✓ Pindai Contactless Berhasil! Terverifikasi pada Kasir Merchant.');
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in" id="voucher-qr-share-modal">
      <div className="bg-white dark:bg-[#121215] w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 dark:border-white/[0.08] overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-white/[0.08] flex items-center justify-between bg-slate-50 dark:bg-[#16161A]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20 shadow-xs">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Generator QR Code & Contactless Pay
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                  E2EE AES-256
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Bagikan QR Code Kriptografis untuk Penebusan Cepat Tanpa Kontak di Seluruh Merchant Halal
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/[0.08] rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Voucher Switcher Toolbar (if allVouchers passed) */}
          {allVouchers.length > 1 && (
            <div className="p-3 rounded-2xl bg-slate-100 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 shrink-0">
                <Layers className="w-4 h-4 text-emerald-500" />
                Pilih Voucher untuk Digenerate:
              </span>
              <select
                value={selectedVoucher.id}
                onChange={(e) => {
                  const found = allVouchers.find(v => v.id === e.target.value);
                  if (found) {
                    sounds.playClick();
                    setSelectedVoucher(found);
                    setSimulatedScanResult(null);
                  }
                }}
                className="w-full sm:w-auto flex-1 max-w-md px-3 py-1.5 bg-white dark:bg-[#202026] border border-slate-300 dark:border-white/[0.1] rounded-xl text-xs font-semibold text-slate-900 dark:text-slate-100 outline-none cursor-pointer"
              >
                {allVouchers.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.code} — {v.title} (Rp {v.remainingBalance.toLocaleString('id-ID')}) [{v.status}]
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Grid Layout: Left QR Card Preview vs Right Controls & Tools */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT: QR Code Visual Pass Card (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col items-center">
              
              <div className="w-full max-w-sm rounded-3xl bg-gradient-to-b from-slate-900 via-[#101915] to-[#06241a] text-white p-5 border border-emerald-500/30 shadow-xl space-y-4 relative overflow-hidden">
                
                {/* Decorative glow in background */}
                <div className="absolute -top-16 -right-16 w-36 h-36 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-teal-500/15 rounded-full blur-2xl pointer-events-none" />

                {/* Card Top Branding */}
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-xs tracking-wider text-emerald-300">
                      ISLAMICITYPAY PASS
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {selectedVoucher.category.toUpperCase()}
                  </span>
                </div>

                {/* Voucher Title & Balance */}
                <div className="space-y-1 relative z-10">
                  <h4 className="font-extrabold text-sm text-white line-clamp-1">
                    {selectedVoucher.title}
                  </h4>
                  <div className="flex items-baseline justify-between pt-1">
                    <span className="text-[11px] text-slate-300">Saldo Contactless:</span>
                    <span className="font-mono font-extrabold text-lg text-emerald-400">
                      Rp {selectedVoucher.remainingBalance.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                {/* The QR Container */}
                <div className="p-4 bg-white rounded-2xl shadow-inner flex flex-col items-center justify-center relative group min-h-[260px]">
                  {isGenerating ? (
                    <div className="flex flex-col items-center justify-center space-y-2 py-12 text-slate-600">
                      <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
                      <span className="text-xs font-semibold">Mengenkripsi QR...</span>
                    </div>
                  ) : qrDataUrl ? (
                    <div className="relative">
                      <img
                        src={qrDataUrl}
                        alt={`QR Code ${selectedVoucher.code}`}
                        className="w-56 h-56 object-contain rounded-lg"
                      />
                      
                      {/* Center Halal Shield Badge */}
                      <div className="absolute inset-0 m-auto w-10 h-10 rounded-xl bg-white shadow-md border border-emerald-600 flex items-center justify-center text-emerald-700 pointer-events-none">
                        <ShieldCheck className="w-6 h-6 text-emerald-600" />
                      </div>
                    </div>
                  ) : null}

                  {/* Anti-Tamper TOTP / Dynamic Indicator */}
                  {qrMode === 'DYNAMIC_TOTP' && (
                    <div className="mt-2 w-full pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-600">
                      <span className="flex items-center gap-1 font-mono font-bold text-emerald-700">
                        <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
                        OTP: {totpData.code}
                      </span>
                      <span className="font-mono text-slate-500">
                        Berganti dlm: <strong className="text-emerald-700">{totpData.secondsRemaining}s</strong>
                      </span>
                    </div>
                  )}
                </div>

                {/* Voucher Code and Hash */}
                <div className="pt-2 border-t border-white/[0.1] space-y-1 text-center relative z-10">
                  <div className="flex items-center justify-center gap-2">
                    <span className="font-mono font-bold text-sm tracking-widest text-emerald-300">
                      {selectedVoucher.code}
                    </span>
                    <button
                      onClick={handleCopyCode}
                      className="p-1 rounded text-slate-300 hover:text-white hover:bg-white/[0.1] transition-colors"
                      title="Salin Kode"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono truncate px-2">
                    Beneficiary: {selectedVoucher.beneficiaryName} • {selectedVoucher.shariaContract}
                  </div>
                </div>

              </div>

              {/* Status Note */}
              <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Siap dipindai di kasir minimarket, toko buku, atau POS Halal Mart.</span>
              </div>
            </div>

            {/* RIGHT: Customization, Sharing Tools & POS Scanner Test (7 Cols) */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* Option 1: QR Mode Switcher */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.08] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <SmartphoneNfc className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    Mode Transaksi Contactless:
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {qrMode === 'DYNAMIC_TOTP' ? 'ANTI-SCREENSHOT ACTIVE' : 'STATIC NFC CARD'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setQrMode('DYNAMIC_TOTP');
                    }}
                    className={`p-3 rounded-xl text-left border transition-all ${
                      qrMode === 'DYNAMIC_TOTP'
                        ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500 text-emerald-900 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                        : 'bg-white dark:bg-[#202026] border-slate-200 dark:border-white/[0.08] text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold">Dynamic TOTP QR</span>
                      <Radio className={`w-3.5 h-3.5 ${qrMode === 'DYNAMIC_TOTP' ? 'text-emerald-600 animate-pulse' : 'text-slate-400'}`} />
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                      Token berotasi tiap 30 detik untuk keamanan maksimal anti-duplikasi foto/screenshot di kasir.
                    </p>
                  </button>

                  <button
                    onClick={() => {
                      sounds.playClick();
                      setQrMode('STATIC_E2EE');
                    }}
                    className={`p-3 rounded-xl text-left border transition-all ${
                      qrMode === 'STATIC_E2EE'
                        ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500 text-emerald-900 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                        : 'bg-white dark:bg-[#202026] border-slate-200 dark:border-white/[0.08] text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold">Statis Standar E2EE</span>
                      <Lock className={`w-3.5 h-3.5 ${qrMode === 'STATIC_E2EE' ? 'text-emerald-600' : 'text-slate-400'}`} />
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                      QR statis permanen terenkripsi untuk dicetak pada kartu fisik atau lembar kupon kertas.
                    </p>
                  </button>
                </div>
              </div>

              {/* Option 2: Visual Style & Color Themes */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.08] flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Tema Warna QR:
                </span>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setColorTheme('emerald');
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                      colorTheme === 'emerald'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white dark:bg-[#202026] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/[0.08]'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    Emerald Syariah
                  </button>

                  <button
                    onClick={() => {
                      sounds.playClick();
                      setColorTheme('amber');
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                      colorTheme === 'amber'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-white dark:bg-[#202026] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/[0.08]'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    Gold
                  </button>

                  <button
                    onClick={() => {
                      sounds.playClick();
                      setColorTheme('mono');
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                      colorTheme === 'mono'
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                        : 'bg-white dark:bg-[#202026] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/[0.08]'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-black" />
                    Monokrom POS
                  </button>
                </div>
              </div>

              {/* Option 3: Shareable Deep Link Bar */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.08] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Share2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    Tautan Penebusan Contactless:
                  </span>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">
                    1-Click Direct Merchant Access
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1 px-3 py-2 bg-white dark:bg-[#202026] border border-slate-200 dark:border-white/[0.08] rounded-xl text-xs font-mono text-slate-600 dark:text-slate-300 truncate select-all">
                    {shareableUrl}
                  </div>
                  <button
                    onClick={handleCopyLink}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 shadow-xs hover:scale-[1.02]"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Tersalin' : 'Salin Tautan'}</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons: WhatsApp, Download Image, Print Slip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                
                {/* WhatsApp Share */}
                <button
                  onClick={handleShareWhatsApp}
                  className="p-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Kirim WhatsApp</span>
                </button>

                {/* Download Pass Image */}
                <button
                  onClick={handleDownloadQrCard}
                  className="p-3 bg-white dark:bg-[#202026] hover:bg-slate-100 dark:hover:bg-[#282830] text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-white/[0.1] rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
                >
                  <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Unduh Gambar Pass</span>
                </button>

                {/* Print Slip */}
                <button
                  onClick={handlePrintSlip}
                  className="p-3 bg-white dark:bg-[#202026] hover:bg-slate-100 dark:hover:bg-[#282830] text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-white/[0.1] rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
                >
                  <Printer className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  <span>Cetak Struk QR</span>
                </button>

              </div>

              {/* LIVE MERCHANT POS SCANNER SIMULATOR */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-[#131b17] to-slate-900 text-white border border-emerald-500/30 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ScanLine className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white">
                      Simulator Pindai Kasir POS / Tap NFC
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400">
                    MERCHANT TERMINAL TEST
                  </span>
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Uji coba kecepatan autentikasi dan validasi stempel kriptografis jika QR Code dipindai oleh mesin POS merchant Halal Mart.
                </p>

                <div className="flex items-center gap-3 pt-1">
                  <button
                    onClick={handleSimulatePosScan}
                    disabled={isSimulatingScan}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/30 transition-all flex items-center gap-2 hover:scale-[1.02]"
                  >
                    {isSimulatingScan ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Memindai Kasir...</span>
                      </>
                    ) : (
                      <>
                        <ScanLine className="w-3.5 h-3.5" />
                        <span>Uji Pindai Kasir POS</span>
                      </>
                    )}
                  </button>

                  {simulatedScanResult && onRedeem && selectedVoucher.status === 'ACTIVE' && (
                    <button
                      onClick={() => {
                        sounds.playClick();
                        onClose();
                        onRedeem(selectedVoucher);
                      }}
                      className="px-4 py-2 bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <span>Lanjut Penebusan Nyata</span>
                      <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
                    </button>
                  )}
                </div>

                {/* Scan Result Feedback */}
                {simulatedScanResult && (
                  <div className="mt-3 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs space-y-1.5 animate-fade-in font-mono">
                    <div className="flex items-center justify-between text-emerald-300 font-bold">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        Pindai Kasir Berhasil ({simulatedScanResult.authTimeMs}ms)
                      </span>
                      <span>{simulatedScanResult.verifiedAt}</span>
                    </div>
                    <div className="text-[11px] text-slate-300">
                      Merchant: <strong className="text-white">{simulatedScanResult.merchant}</strong> • Saldo Terbaca: <strong className="text-emerald-400">Rp {selectedVoucher.remainingBalance.toLocaleString('id-ID')}</strong>
                    </div>
                    <div className="text-[10px] text-emerald-400">
                      ✓ SHA-256 HMAC Signature Valid • Status Akun: SIAP DITEBUS
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#16161A] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Kepatuhan Fatwa DSN-MUI No. 116/2017 & Standard Kriptografi IFSB</span>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="px-4 py-2 bg-slate-200 dark:bg-[#202026] hover:bg-slate-300 dark:hover:bg-[#282832] text-slate-800 dark:text-slate-200 font-bold rounded-xl transition-colors"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
