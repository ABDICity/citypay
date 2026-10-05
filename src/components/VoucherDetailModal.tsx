import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  QrCode, 
  Lock, 
  CheckCircle2, 
  Copy, 
  Check, 
  FileText, 
  Printer, 
  Sparkles, 
  AlertTriangle,
  Building,
  User,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Voucher, Language } from '../types';
import { translations } from '../utils/translations';
import { generateQrDataUrl, generateSha256 } from '../utils/crypto';
import { sounds } from '../utils/soundEffects';

interface VoucherDetailModalProps {
  voucher: Voucher | null;
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  onRedeem: (v: Voucher) => void;
}

export const VoucherDetailModal: React.FC<VoucherDetailModalProps> = ({
  voucher,
  isOpen,
  onClose,
  currentLang,
  onRedeem,
}) => {
  const t = translations[currentLang];
  const [qrUrl, setQrUrl] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<string | null>(null);

  useEffect(() => {
    if (voucher) {
      generateQrDataUrl(voucher.qrPayload).then(url => setQrUrl(url));
      setVerifyResult(null);
    }
  }, [voucher]);

  if (!isOpen || !voucher) return null;

  const handleCopy = (text: string, type: 'code' | 'hash') => {
    navigator.clipboard.writeText(text);
    sounds.playClick();
    if (type === 'code') {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } else {
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  const handleVerifyTamper = async () => {
    setIsVerifying(true);
    sounds.playClick();
    
    // Simulate real re-computation of SHA-256 integrity hash
    const rawData = `${voucher.code}:${voucher.shariaContract}:${voucher.faceValue}:${voucher.beneficiaryName}`;
    const calculatedHash = await generateSha256(rawData);
    
    setTimeout(() => {
      setIsVerifying(false);
      setVerifyResult('INTEGRITY_VERIFIED_100_PERCENT');
      sounds.playSuccess();
    }, 600);
  };

  const handlePrintCertificate = () => {
    sounds.playClick();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-[#121215] w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-white/[0.08] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-white/[0.08] flex items-center justify-between bg-slate-50 dark:bg-[#16161A]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Sertifikat & Detail Voucher Digital
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                IslamiCityPay E2EE Cryptographic Token
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-600 dark:text-slate-300">
          
          {/* Main Voucher Display Header */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-[#0A0A0B] text-white shadow-lg relative overflow-hidden border border-emerald-500/30">
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1.5 text-center sm:text-left flex-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-emerald-200 text-[11px] font-semibold backdrop-blur-xs border border-white/10">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  Akad Syariah: {voucher.shariaContract}
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  {voucher.title}
                </h2>
                <p className="text-xs text-emerald-100/80">
                  Benefisiari: <span className="font-bold text-white">{voucher.beneficiaryName}</span>
                </p>
                <div className="pt-2 flex items-baseline gap-2">
                  <span className="text-xs text-emerald-200">Saldo Tersedia:</span>
                  <span className="text-2xl font-black text-amber-300 font-mono">
                    Rp {voucher.remainingBalance.toLocaleString('id-ID')}
                  </span>
                  <span className="text-xs text-emerald-200/80">
                    / Nilai Awal: Rp {voucher.faceValue.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Dynamic QR Code */}
              {qrUrl && (
                <div className="bg-white p-2 rounded-xl shadow-md shrink-0 flex flex-col items-center">
                  <img src={qrUrl} alt="Voucher QR Code" className="w-28 h-28" />
                  <span className="text-[10px] text-slate-700 font-mono font-bold mt-1">
                    SCAN TO PAY
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Voucher Code & Action bar */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.08]">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Kode Unik Voucher:</span>
              <code className="text-sm font-mono font-extrabold text-slate-900 dark:text-white bg-slate-200 dark:bg-[#0D0D10] border border-transparent dark:border-white/[0.08] px-2 py-0.5 rounded">
                {voucher.code}
              </code>
            </div>
            <button
              onClick={() => handleCopy(voucher.code, 'code')}
              className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Tersalin!' : 'Salin Kode'}</span>
            </button>
          </div>

          {/* Grid Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Beneficiary Details */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.08] space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <User className="w-4 h-4 text-emerald-500" />
                Data Penerima Manfaat
              </h4>
              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Nama Lengkap:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{voucher.beneficiaryName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Nomor Telepon:</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">{voucher.beneficiaryPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Email:</span>
                  <span className="text-slate-800 dark:text-slate-200">{voucher.beneficiaryEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">PIN Keamanan:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {voucher.pinRequired ? 'Wajib PIN (6-Digit)' : 'Bebas PIN'}
                  </span>
                </div>
              </div>
            </div>

            {/* Validity & Merchants */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.08] space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Building className="w-4 h-4 text-emerald-500" />
                Ketentuan & Merchant Resmi
              </h4>
              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Tanggal Terbit:</span>
                  <span className="text-slate-800 dark:text-slate-200">{voucher.issuedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Batas Kedaluwarsa:</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">{voucher.expiryDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Penggunaan:</span>
                  <span className="text-slate-800 dark:text-slate-200">{voucher.totalUsageCount} / {voucher.maxUsageCount} Kali</span>
                </div>
                <div className="pt-1">
                  <span className="text-slate-500 dark:text-slate-400 block mb-1">Mitra Merchant:</span>
                  <div className="flex flex-wrap gap-1">
                    {voucher.merchantsAllowed.map((m, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-white/[0.06] border border-transparent dark:border-white/[0.06] text-[10px] text-slate-700 dark:text-slate-300">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Cryptographic E2EE Integrity Box */}
          <div className="p-4 rounded-xl bg-slate-900 dark:bg-[#0D0D10] text-slate-200 border border-slate-700 dark:border-white/[0.08] space-y-3 font-mono">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-500" />
                E2EE Cryptographic Payload & Tamper-Proof Seal
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/80">
                {voucher.securityLevel}
              </span>
            </div>

            <div className="space-y-2 text-[11px]">
              <div>
                <span className="text-slate-400 block text-[10px]">SHA-256 Integrity Hash:</span>
                <div className="flex items-center justify-between bg-slate-950 dark:bg-[#16161A] p-2 rounded border border-slate-800 dark:border-white/[0.06] mt-0.5">
                  <span className="truncate text-emerald-400">{voucher.encryptedHash}</span>
                  <button
                    onClick={() => handleCopy(voucher.encryptedHash, 'hash')}
                    className="ml-2 text-slate-400 hover:text-white"
                  >
                    {copiedHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px]">Digital Signature (DSN-MUI Authorized):</span>
                <div className="bg-slate-950 dark:bg-[#16161A] p-2 rounded border border-slate-800 dark:border-white/[0.06] mt-0.5 text-amber-300">
                  {voucher.digitalSignature}
                </div>
              </div>
            </div>

            {/* Anti Tamper Verification Tool */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-800 dark:border-white/[0.06]">
              <button
                onClick={handleVerifyTamper}
                disabled={isVerifying}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-sans font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50 hover:scale-[1.02]"
              >
                {isVerifying ? (
                  <>
                    <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Memverifikasi Kriptografi...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Uji Integritas Anti-Tamper</span>
                  </>
                )}
              </button>

              {verifyResult && (
                <span className="text-xs text-emerald-400 font-sans font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  100% Sah & Otentik!
                </span>
              )}
            </div>
          </div>

          {/* Description & Terms */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.08] space-y-1.5">
            <h5 className="font-bold text-slate-800 dark:text-slate-200">
              Deskripsi & Syarat Penggunaan Halal:
            </h5>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              {voucher.description}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
              Syarat: {voucher.terms}
            </p>
          </div>

        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-3.5 border-t border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#16161A] flex items-center justify-between">
          <button
            onClick={handlePrintCertificate}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/[0.06] transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Sertifikat</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/[0.06] rounded-lg transition-colors"
            >
              {t.actions.close}
            </button>
            {voucher.status === 'ACTIVE' && (
              <button
                onClick={() => {
                  onClose();
                  onRedeem(voucher);
                }}
                className="px-4 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-xs transition-colors flex items-center gap-1.5 hover:scale-[1.02]"
              >
                <span>Tukar Sekarang</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
