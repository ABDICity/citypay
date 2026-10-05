import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  CheckCircle2, 
  X, 
  RefreshCw, 
  Copy, 
  Check, 
  AlertTriangle,
  Smartphone,
  Fingerprint
} from 'lucide-react';
import { Language, SecurityStatus } from '../types';
import { translations } from '../utils/translations';
import { generateCurrentTotp, verifyTotpCode } from '../utils/crypto';
import { sounds } from '../utils/soundEffects';

interface TwoFactorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  securityStatus: SecurityStatus;
  onUpdateSecurityStatus: (updated: Partial<SecurityStatus>) => void;
  onVerifiedSuccess?: () => void;
}

export const TwoFactorModal: React.FC<TwoFactorModalProps> = ({
  isOpen,
  onClose,
  currentLang,
  securityStatus,
  onUpdateSecurityStatus,
  onVerifiedSuccess,
}) => {
  const t = translations[currentLang];
  const [totpData, setTotpData] = useState(generateCurrentTotp(securityStatus.totpSecret));
  const [inputCode, setInputCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [verificationResult, setVerificationResult] = useState<'IDLE' | 'SUCCESS' | 'FAILED'>('IDLE');
  const [demoAutoFill, setDemoAutoFill] = useState(false);

  // Live TOTP countdown timer
  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      const current = generateCurrentTotp(securityStatus.totpSecret);
      setTotpData(current);
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, securityStatus.totpSecret]);

  if (!isOpen) return null;

  const handleCopySecret = () => {
    navigator.clipboard.writeText(securityStatus.totpSecret);
    setCopied(true);
    sounds.playClick();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerify = () => {
    sounds.playClick();
    const isValid = verifyTotpCode(inputCode, securityStatus.totpSecret);
    if (isValid) {
      setVerificationResult('SUCCESS');
      sounds.playSuccess();
      onUpdateSecurityStatus({
        twoFactorEnabled: true,
      });
      if (onVerifiedSuccess) {
        setTimeout(() => {
          onVerifiedSuccess();
          onClose();
        }, 1200);
      }
    } else {
      setVerificationResult('FAILED');
      sounds.playAlert();
    }
  };

  const handleToggle2fa = () => {
    sounds.playClick();
    const newStatus = !securityStatus.twoFactorEnabled;
    onUpdateSecurityStatus({
      twoFactorEnabled: newStatus,
    });
  };

  const handleSimulatePasskey = () => {
    sounds.playSuccess();
    setInputCode(totpData.code);
    setVerificationResult('SUCCESS');
    onUpdateSecurityStatus({ twoFactorEnabled: true });
    if (onVerifiedSuccess) {
      setTimeout(() => {
        onVerifiedSuccess();
        onClose();
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-[#121215] w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-white/[0.08] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-white/[0.08] flex items-center justify-between bg-slate-50/70 dark:bg-[#16161A]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {t.security.twoFactorTitle}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Otentikasi Kriptografis Multi-Faktor (RFC 6238 / WebAuthn)
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-600 dark:text-slate-300">
          
          {/* Status Toggle Card */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.08]">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${securityStatus.twoFactorEnabled ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-400'}`} />
              <div>
                <div className="font-bold text-slate-900 dark:text-white">
                  Status 2FA Akun: {securityStatus.twoFactorEnabled ? 'AKTIF (PROTECTED)' : 'NON-AKTIF'}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  {securityStatus.twoFactorEnabled 
                    ? 'Setiap transaksi penukaran dan penerbitan dilindungi kode TOTP' 
                    : 'Disarankan mengaktifkan 2FA untuk kepatuhan regulasi finansial'}
                </div>
              </div>
            </div>
            <button
              onClick={handleToggle2fa}
              className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-colors ${
                securityStatus.twoFactorEnabled
                  ? 'bg-rose-500/15 text-rose-700 hover:bg-rose-500/25 dark:bg-rose-500/20 dark:text-rose-300 border border-rose-500/30'
                  : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-xs'
              }`}
            >
              {securityStatus.twoFactorEnabled ? t.actions.disable2fa : t.actions.enable2fa}
            </button>
          </div>

          {/* Live Virtual Authenticator Simulator */}
          <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-emerald-500" />
                Live Virtual Authenticator (TOTP Simulator)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20">
                Valid: {totpData.secondsRemaining}s
              </span>
            </div>

            <div className="flex items-center justify-between bg-white dark:bg-[#0D0D10] p-3 rounded-lg border border-emerald-300/60 dark:border-emerald-500/30 shadow-inner">
              <div>
                <div className="text-[10px] text-slate-400">Kode Dinamis Saat Ini:</div>
                <div className="font-mono text-2xl font-extrabold tracking-widest text-emerald-600 dark:text-emerald-400">
                  {totpData.code.substring(0, 3)} {totpData.code.substring(3)}
                </div>
              </div>
              <button
                onClick={() => {
                  setInputCode(totpData.code);
                  sounds.playClick();
                }}
                className="px-2.5 py-1.5 text-[11px] font-semibold bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-500/20 dark:hover:bg-emerald-500/30 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20 rounded-lg transition-colors"
              >
                Gunakan Kode Ini
              </button>
            </div>

            {/* Secret key */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
              <div className="flex items-center gap-1">
                <span>Secret Key:</span>
                <code className="font-mono font-bold text-slate-700 dark:text-slate-300">{securityStatus.totpSecret}</code>
              </div>
              <button 
                onClick={handleCopySecret}
                className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Tersalin' : 'Salin'}
              </button>
            </div>
          </div>

          {/* Code Verification Input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">
              Masukkan 6-Digit Kode Verifikasi 2FA:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.replace(/\D/g, ''))}
                placeholder="Contoh: 888999"
                className="flex-1 px-4 py-2 text-center text-lg font-mono font-bold tracking-widest bg-slate-100 dark:bg-[#16161A] border border-slate-300 dark:border-white/[0.08] text-slate-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-emerald-500/40 outline-none"
              />
              <button
                onClick={handleVerify}
                disabled={inputCode.length < 6}
                className="px-5 py-2 font-bold text-xs bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl shadow-xs transition-colors hover:scale-[1.02]"
              >
                Verifikasi
              </button>
            </div>

            {/* Quick test with Biometric / Passkey Simulation */}
            <div className="pt-2 flex justify-center">
              <button
                onClick={handleSimulatePasskey}
                className="flex items-center gap-1.5 text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 text-[11px] font-medium transition-colors"
              >
                <Fingerprint className="w-4 h-4 text-emerald-500" />
                Otorisasi Cepat via Passkey / WebAuthn Biometrik
              </button>
            </div>

            {verificationResult === 'SUCCESS' && (
              <div className="p-3 rounded-lg bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                <span>Otentikasi Kriptografis Berhasil! Akses Divalidasi.</span>
              </div>
            )}

            {verificationResult === 'FAILED' && (
              <div className="p-3 rounded-lg bg-rose-500/15 text-rose-800 dark:text-rose-300 border border-rose-500/30 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>Kode 2FA tidak valid atau sudah kedaluwarsa. Gunakan kode virtual di atas atau 888999.</span>
              </div>
            )}
          </div>

          {/* Sharia Compliance Info */}
          <div className="p-3 rounded-lg bg-slate-100 dark:bg-[#16161A] border border-transparent dark:border-white/[0.06] text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Kepatuhan Regulasi:</span> 2FA adalah standar wajib POJK No. 11/POJK.03/2022 tentang Penyelenggaraan Teknologi Informasi oleh Bank & Fintech Syariah.
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#16161A] flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/[0.06] rounded-lg transition-colors"
          >
            {t.actions.close}
          </button>
        </div>

      </div>
    </div>
  );
};
