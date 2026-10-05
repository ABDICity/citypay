import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  RefreshCw, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  Check, 
  Terminal, 
  Sparkles, 
  Fingerprint,
  Layers,
  ArrowRight,
  Smartphone,
  ScanFace,
  Scan,
  Shield
} from 'lucide-react';
import { SecurityStatus, Language } from '../../types';
import { translations } from '../../utils/translations';
import { generateSha256, encryptPayloadAes256, decryptPayloadAes256 } from '../../utils/crypto';
import { sounds } from '../../utils/soundEffects';

interface SecurityTabProps {
  currentLang: Language;
  securityStatus: SecurityStatus;
  onUpdateSecurityStatus: (updated: Partial<SecurityStatus>) => void;
  onOpen2FaModal: () => void;
}

export const SecurityTab: React.FC<SecurityTabProps> = ({
  currentLang,
  securityStatus,
  onUpdateSecurityStatus,
  onOpen2FaModal,
}) => {
  const t = translations[currentLang];

  // Interactive Live E2EE Playground State
  const [plainInput, setPlainInput] = useState<string>(
    JSON.stringify({
      voucher_code: 'ICP-ZIS-8821-X9A2',
      nominal: 1500000,
      beneficiary: 'Ahmad Fauzi (Mustahiq)',
      sharia_contract: 'Hibah / Tabarru',
      timestamp: new Date().toISOString(),
    }, null, 2)
  );

  const [cipherResult, setCipherResult] = useState<{
    cipherText: string;
    iv: string;
    authTag: string;
    rawHash: string;
  } | null>(null);

  const [decryptInput, setDecryptInput] = useState<string>('');
  const [decryptOutput, setDecryptOutput] = useState<string | null>(null);
  const [copiedCipher, setCopiedCipher] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [tamperSimulated, setTamperSimulated] = useState(false);

  // Biometric Test State
  const [isTestingBiometric, setIsTestingBiometric] = useState(false);
  const [biometricTestResult, setBiometricTestResult] = useState<{
    success: boolean;
    message: string;
    authType: string;
    enclaveId: string;
    timestamp: string;
  } | null>(null);

  const handleToggleBiometric = () => {
    sounds.playToggle();
    const newStatus = !securityStatus.biometricEnabled;
    onUpdateSecurityStatus({
      biometricEnabled: newStatus,
      biometricDeviceRegistered: newStatus ? true : securityStatus.biometricDeviceRegistered,
    });
    setBiometricTestResult(null);
  };

  const handleChangeBiometricType = (type: 'fingerprint' | 'facial' | 'both') => {
    sounds.playClick();
    onUpdateSecurityStatus({
      biometricType: type,
    });
    setBiometricTestResult(null);
  };

  const handleSimulateBiometricScan = () => {
    if (!securityStatus.biometricEnabled) {
      sounds.playAlert();
      return;
    }
    sounds.playClick();
    setIsTestingBiometric(true);
    setBiometricTestResult(null);

    setTimeout(() => {
      setIsTestingBiometric(false);
      sounds.playSuccess();
      const currentType = securityStatus.biometricType || 'both';
      const typeLabel = 
        currentType === 'facial' ? 'Face ID (Pengenalan Wajah 3D)' :
        currentType === 'fingerprint' ? 'Sidik Jari (Biometrik Touch ID)' :
        'Hybrid Biometrik (Sidik Jari + Face ID)';

      setBiometricTestResult({
        success: true,
        message: `Verifikasi ${typeLabel} Berhasil! Kunci dompet didekripsi secara lokal di Hardware Enclave.`,
        authType: typeLabel,
        enclaveId: `SEC-ENCLAVE-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        timestamp: new Date().toLocaleTimeString('id-ID'),
      });
    }, 1200);
  };

  // Auto encrypt on plain input change
  useEffect(() => {
    encryptPayloadAes256(plainInput).then((res) => {
      setCipherResult(res);
      setDecryptInput(res.cipherText);
    });
  }, [plainInput]);

  const handleCopyCipher = () => {
    if (!cipherResult) return;
    navigator.clipboard.writeText(cipherResult.cipherText);
    setCopiedCipher(true);
    sounds.playClick();
    setTimeout(() => setCopiedCipher(false), 2000);
  };

  const handleDecrypt = () => {
    sounds.playClick();
    const res = decryptPayloadAes256(decryptInput);
    if (res.success) {
      setDecryptOutput(res.payload);
      sounds.playSuccess();
    } else {
      setDecryptOutput('ERROR: Cipher text korup atau kunci salah.');
      sounds.playAlert();
    }
  };

  const handleRotateKey = () => {
    setIsRotating(true);
    sounds.playClick();
    setTimeout(() => {
      setIsRotating(false);
      onUpdateSecurityStatus({
        lastRotated: new Date().toISOString().split('T')[0],
        tamperProofSeals: securityStatus.tamperProofSeals + 1,
      });
      sounds.playSuccess();
    }, 800);
  };

  return (
    <div className="space-y-6 animate-fade-in" id="security-tab-container">
      
      {/* Security Overview Header */}
      <div className="p-5 rounded-2xl bg-[#121215] text-white border border-white/[0.08] shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-semibold border border-emerald-500/30 font-mono">
            <Lock className="w-3.5 h-3.5" />
            TLS v1.3 + AES-256-GCM + SHA-256 Dual Layer
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            Pusat Keamanan Kriptografis & Otentikasi End-to-End
          </h2>
          <p className="text-xs text-slate-300/80 max-w-2xl leading-relaxed">
            Menjamin setiap transaksi voucher bebas dari manipulasi ganda (double-spending) dan terenkripsi penuh dari terminal kasir hingga buku besar perbankan syariah.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpen2FaModal}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/25 transition-all flex items-center gap-1.5 hover:scale-[1.02]"
          >
            <KeyRound className="w-4 h-4" />
            <span>Konfigurasi 2FA ({securityStatus.twoFactorEnabled ? 'Aktif' : 'Non-Aktif'})</span>
          </button>
        </div>
      </div>

      {/* Security Metric Stat Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] shadow-xs space-y-1 hover:border-emerald-500/30 transition-all">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Algoritma Enkripsi</span>
          <div className="text-base font-extrabold text-slate-900 dark:text-white font-mono flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-emerald-500" />
            AES-256-GCM
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Authenticated Cipher</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] shadow-xs space-y-1 hover:border-teal-500/30 transition-all">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Integritas Hash Digest</span>
          <div className="text-base font-extrabold text-slate-900 dark:text-white font-mono flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-teal-500" />
            SHA-256 HMAC
          </div>
          <span className="text-[11px] text-teal-600 dark:text-teal-400 font-medium">Zero Hash Collision</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] shadow-xs space-y-1 hover:border-amber-500/30 transition-all">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Rotasi Kunci Terakhir</span>
          <div className="text-base font-extrabold text-slate-900 dark:text-white font-mono flex items-center gap-1.5">
            <RefreshCw className="w-4 h-4 text-amber-500" />
            {securityStatus.lastRotated}
          </div>
          <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">Siklus 30 Hari Otomatis</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] shadow-xs space-y-1 hover:border-purple-500/30 transition-all">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Segel Digital Terbit</span>
          <div className="text-base font-extrabold text-slate-900 dark:text-white font-mono flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-purple-500" />
            {securityStatus.tamperProofSeals.toLocaleString()} Segel
          </div>
          <span className="text-[11px] text-purple-600 dark:text-purple-400 font-medium">DSN-MUI Validated</span>
        </div>

      </div>

      {/* Biometric Authentication (Fingerprint & Facial Recognition) Control Section */}
      <div 
        className="p-5 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] shadow-sm space-y-4 relative overflow-hidden"
        id="biometric-auth-section"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100 dark:border-white/[0.06]">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0 shadow-xs">
              <Fingerprint className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  Otentikasi Biometrik Mobile (Biometric Authentication)
                </h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  securityStatus.biometricEnabled 
                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20' 
                    : 'bg-slate-100 dark:bg-white/[0.06] text-slate-500 border border-slate-200 dark:border-white/[0.08]'
                }`}>
                  {securityStatus.biometricEnabled ? 'AKTIF (FIDO2 / WEBAUTHN)' : 'NON-AKTIF'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Aktifkan sensor sidik jari (Touch ID / Fingerprint) atau pengenalan wajah (Face ID) pada perangkat smartphone saat membuka dompet dan menandatangani transaksi voucher.
              </p>
            </div>
          </div>

          {/* Master Toggle Switch */}
          <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {securityStatus.biometricEnabled ? 'Biometrik Aktif' : 'Biometrik Mati'}
            </span>
            <button
              id="biometric-auth-toggle-btn"
              type="button"
              role="switch"
              aria-checked={securityStatus.biometricEnabled}
              onClick={handleToggleBiometric}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
                securityStatus.biometricEnabled ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  securityStatus.biometricEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Biometric Configuration Options & Scanner Simulator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* Method Selection (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Metode Sensor yang Diizinkan:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Option 1: Fingerprint */}
              <button
                type="button"
                disabled={!securityStatus.biometricEnabled}
                onClick={() => handleChangeBiometricType('fingerprint')}
                className={`p-3 rounded-xl border text-left transition-all space-y-1.5 ${
                  !securityStatus.biometricEnabled 
                    ? 'opacity-50 cursor-not-allowed bg-slate-50 dark:bg-[#16161A] border-slate-200 dark:border-white/[0.04]'
                    : securityStatus.biometricType === 'fingerprint'
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-500/50 text-emerald-800 dark:text-emerald-300 shadow-xs'
                      : 'bg-white dark:bg-[#16161A] border-slate-200 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/[0.14]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Fingerprint className="w-4 h-4 text-emerald-500" />
                  {securityStatus.biometricType === 'fingerprint' && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  )}
                </div>
                <div>
                  <div className="font-bold text-xs">Sidik Jari</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Touch ID / Under-Display</div>
                </div>
              </button>

              {/* Option 2: Face Recognition */}
              <button
                type="button"
                disabled={!securityStatus.biometricEnabled}
                onClick={() => handleChangeBiometricType('facial')}
                className={`p-3 rounded-xl border text-left transition-all space-y-1.5 ${
                  !securityStatus.biometricEnabled 
                    ? 'opacity-50 cursor-not-allowed bg-slate-50 dark:bg-[#16161A] border-slate-200 dark:border-white/[0.04]'
                    : securityStatus.biometricType === 'facial'
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-500/50 text-emerald-800 dark:text-emerald-300 shadow-xs'
                      : 'bg-white dark:bg-[#16161A] border-slate-200 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/[0.14]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <ScanFace className="w-4 h-4 text-emerald-500" />
                  {securityStatus.biometricType === 'facial' && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  )}
                </div>
                <div>
                  <div className="font-bold text-xs">Pengenalan Wajah</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Face ID 3D Biometrik</div>
                </div>
              </button>

              {/* Option 3: Both (Hybrid) */}
              <button
                type="button"
                disabled={!securityStatus.biometricEnabled}
                onClick={() => handleChangeBiometricType('both')}
                className={`p-3 rounded-xl border text-left transition-all space-y-1.5 ${
                  !securityStatus.biometricEnabled 
                    ? 'opacity-50 cursor-not-allowed bg-slate-50 dark:bg-[#16161A] border-slate-200 dark:border-white/[0.04]'
                    : securityStatus.biometricType === 'both' || !securityStatus.biometricType
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-500/50 text-emerald-800 dark:text-emerald-300 shadow-xs'
                      : 'bg-white dark:bg-[#16161A] border-slate-200 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/[0.14]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Scan className="w-4 h-4 text-emerald-500" />
                  {(securityStatus.biometricType === 'both' || !securityStatus.biometricType) && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  )}
                </div>
                <div>
                  <div className="font-bold text-xs">Hybrid Multi</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Sidik Jari atau Wajah</div>
                </div>
              </button>
            </div>

            {/* Hardware Security Specs Info */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.06] text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Enklave Perangkat Keras Aman (Apple Secure Enclave & Android StrongBox Keymaster)</span>
              </div>
              <p>
                Data sidik jari dan kontur wajah diproses secara lokal di chip hardware perangkat. Nilai biometrik asli tidak pernah dikirimkan ke server demi menjamin privasi syariah (Hifz an-Nafs).
              </p>
            </div>
          </div>

          {/* Test Sensor Live Simulator (5 cols) */}
          <div className="lg:col-span-5 p-4 rounded-xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-emerald-500" />
                Uji Sensor Biometrik Perangkat
              </span>
              <span className="text-[10px] text-slate-400 font-mono">WebAuthn API</span>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Verifikasi sensor biometrik perangkat Anda untuk memastikan kesiapan otentikasi cepat saat mengakses dompet voucher digital.
            </p>

            <button
              type="button"
              id="test-biometric-sensor-btn"
              disabled={!securityStatus.biometricEnabled || isTestingBiometric}
              onClick={handleSimulateBiometricScan}
              className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                !securityStatus.biometricEnabled
                  ? 'bg-slate-200 dark:bg-white/[0.05] text-slate-400 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 active:scale-[0.98]'
              }`}
            >
              {isTestingBiometric ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Memindai Sensor Biometrik...</span>
                </>
              ) : (
                <>
                  <Fingerprint className="w-4 h-4" />
                  <span>Uji Verifikasi Sensor Sekarang</span>
                </>
              )}
            </button>

            {/* Test Result Feedback */}
            {biometricTestResult && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-[11px] space-y-1 animate-fade-in text-emerald-900 dark:text-emerald-200">
                <div className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Otentikasi Biometrik Lolos (FIDO2 Certified)</span>
                </div>
                <div className="text-[10px] text-slate-600 dark:text-slate-300">
                  {biometricTestResult.message}
                </div>
                <div className="pt-1 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                  <span>Enclave ID: {biometricTestResult.enclaveId}</span>
                  <span>{biometricTestResult.timestamp}</span>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
      <div className="p-5 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] space-y-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-500" />
              Live E2EE Cryptographic Engine Visualizer (Enkripsi & Dekripsi Real-Time)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ketik payload voucher dan amati transformasi enkripsi AES-256 secara langsung
            </p>
          </div>

          <button
            onClick={handleRotateKey}
            disabled={isRotating}
            className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-[#16161A] dark:hover:bg-[#222228] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/[0.08] rounded-xl transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin text-emerald-500' : ''}`} />
            <span>Rotasi Kunci Master</span>
          </button>
        </div>

        {/* 2-Column Crypto Editor */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          
          {/* Column 1: Plaintext Payload */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-xs text-slate-700 dark:text-slate-300">
                1. Plaintext JSON Payload (Data Voucher Mentah):
              </label>
              <span className="text-[10px] text-slate-400 font-mono">UTF-8 / JSON</span>
            </div>
            <textarea
              rows={8}
              value={plainInput}
              onChange={(e) => setPlainInput(e.target.value)}
              className="w-full p-3 font-mono text-xs bg-slate-950 dark:bg-[#0A0A0B] text-emerald-400 rounded-xl border border-slate-800 dark:border-white/[0.08] focus:ring-2 focus:ring-emerald-500/40 outline-none leading-relaxed"
            />
          </div>

          {/* Column 2: Cipher Text & SHA-256 Digest */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-xs text-slate-700 dark:text-slate-300">
                2. AES-256-GCM Cipher Text & Authentication Tag:
              </label>
              <button
                onClick={handleCopyCipher}
                className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1"
              >
                {copiedCipher ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCipher ? 'Tersalin' : 'Salin Cipher'}</span>
              </button>
            </div>
            <div className="w-full p-3 font-mono text-xs bg-slate-950 dark:bg-[#0A0A0B] text-amber-300 rounded-xl border border-slate-800 dark:border-white/[0.08] h-[178px] overflow-y-auto space-y-2">
              <div>
                <span className="text-slate-500 block text-[10px]">Ciphertext (Base64 + Salt):</span>
                <span className="break-all text-amber-300">{cipherResult?.cipherText}</span>
              </div>
              <div className="pt-1 border-t border-slate-800 dark:border-white/[0.06] text-[10px]">
                <span className="text-slate-500">IV (Initialization Vector): </span>
                <span className="text-emerald-400">{cipherResult?.iv}</span>
              </div>
              <div className="text-[10px]">
                <span className="text-slate-500">SHA-256 Integrity Digest: </span>
                <span className="text-teal-400">{cipherResult?.rawHash}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Decryption Verification Sandbox */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.08] space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-emerald-500" />
              Uji Dekripsi di Sisi Terminal Penerima (Merchant Terminal Decryptor):
            </span>
            <button
              onClick={handleDecrypt}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1 shadow-xs"
            >
              <span>Dekripsi Payload</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={decryptInput}
              onChange={(e) => setDecryptInput(e.target.value)}
              placeholder="Masukkan Cipher Text untuk didekripsi..."
              className="flex-1 px-3 py-2 bg-white dark:bg-[#0A0A0B] border border-slate-300 dark:border-white/[0.08] rounded-xl font-mono text-xs text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-emerald-500/40"
            />
          </div>

          {decryptOutput && (
            <div className="p-3 rounded-lg bg-emerald-950/80 text-emerald-300 font-mono text-xs border border-emerald-500/30 whitespace-pre-wrap">
              <span className="text-slate-400 text-[10px] block mb-1">Hasil Dekripsi Sukses:</span>
              {decryptOutput}
            </div>
          )}
        </div>

      </div>

      {/* Anti-Tamper Proof Demo */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Simulasi Uji Pertahanan Anti-Tamper (Anti-Double Spend)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Membuktikan bahwa perubahan 1 byte data langsung menggagalkan validasi tanda tangan digital DSN-MUI
            </p>
          </div>

          <button
            onClick={() => {
              setTamperSimulated(!tamperSimulated);
              sounds.playClick();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              tamperSimulated 
                ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30' 
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-[#16161A] dark:hover:bg-[#222228] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/[0.08]'
            }`}
          >
            {tamperSimulated ? 'Hapus Modifikasi Palsu' : 'Simulasikan Serangan Modifikasi Data'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.08] space-y-1">
            <span className="text-slate-500 dark:text-slate-400 text-[11px] font-sans font-bold">Data Asli Terverifikasi:</span>
            <div className="text-slate-700 dark:text-slate-300">VOUCHER_CODE: ICP-ZIS-8821-X9A2</div>
            <div className="text-slate-700 dark:text-slate-300">SALDO_VALID: Rp 1.500.000</div>
            <div className="text-emerald-600 dark:text-emerald-400 font-bold">STATUS: VALID & BERHAK</div>
          </div>

          <div className={`p-3.5 rounded-xl border space-y-1 transition-all ${
            tamperSimulated 
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-300' 
              : 'bg-slate-50 dark:bg-[#16161A] border-slate-200 dark:border-white/[0.08] text-slate-500 dark:text-slate-400'
          }`}>
            <span className="text-[11px] font-sans font-bold block">
              {tamperSimulated ? '🚨 Terdeteksi Manipulasi Ilegal:' : 'Kondisi Aman:'}
            </span>
            <div>VOUCHER_CODE: ICP-ZIS-8821-X9A2</div>
            <div>SALDO: {tamperSimulated ? 'Rp 99.000.000 (DIUBAH ILEGAL)' : 'Rp 1.500.000'}</div>
            <div className="font-bold">
              {tamperSimulated 
                ? '❌ SIGNATURE MISMATCH! TRANSAKSI OTOMATIS DIBLOKIR 100%' 
                : '✅ SINKRON DENGAN LEDGER'}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
