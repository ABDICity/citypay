import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  QrCode, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Building2, 
  Sparkles, 
  Lock, 
  AlertTriangle,
  Receipt,
  ScanLine
} from 'lucide-react';
import { Voucher, BankChannel, Language, Transaction, SecurityStatus } from '../types';
import { translations } from '../utils/translations';
import { generateSha256, verifyTotpCode } from '../utils/crypto';
import { sounds } from '../utils/soundEffects';

interface RedeemVoucherModalProps {
  voucher: Voucher | null;
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  securityStatus: SecurityStatus;
  allVouchers: Voucher[];
  onRedeemSuccess: (transaction: Transaction, updatedVoucher: Voucher) => void;
}

export const RedeemVoucherModal: React.FC<RedeemVoucherModalProps> = ({
  voucher,
  isOpen,
  onClose,
  currentLang,
  securityStatus,
  allVouchers,
  onRedeemSuccess,
}) => {
  const t = translations[currentLang];

  const [selectedVoucherCode, setSelectedVoucherCode] = useState<string>('');
  const [redeemAmount, setRedeemAmount] = useState<number>(0);
  const [selectedMerchant, setSelectedMerchant] = useState<string>('Halal Mart Nasional');
  const [selectedBank, setSelectedBank] = useState<BankChannel>('BSI_SYARIAH');
  const [totpInput, setTotpInput] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [receiptTx, setReceiptTx] = useState<Transaction | null>(null);

  // Active target voucher
  const targetVoucher = allVouchers.find(v => v.code === selectedVoucherCode) || voucher;

  useEffect(() => {
    if (voucher) {
      setSelectedVoucherCode(voucher.code);
      setRedeemAmount(voucher.remainingBalance);
      if (voucher.merchantsAllowed.length > 0) {
        setSelectedMerchant(voucher.merchantsAllowed[0]);
      }
    } else {
      const activeFirst = allVouchers.find(v => v.status === 'ACTIVE');
      if (activeFirst) {
        setSelectedVoucherCode(activeFirst.code);
        setRedeemAmount(activeFirst.remainingBalance);
      }
    }
    setReceiptTx(null);
    setErrorMsg(null);
  }, [voucher, allVouchers, isOpen]);

  if (!isOpen) return null;

  const handleSimulateScan = () => {
    setIsScanning(true);
    sounds.playClick();
    setTimeout(() => {
      setIsScanning(false);
      const activeVouchers = allVouchers.filter(v => v.status === 'ACTIVE');
      if (activeVouchers.length > 0) {
        const randomV = activeVouchers[Math.floor(Math.random() * activeVouchers.length)];
        setSelectedVoucherCode(randomV.code);
        setRedeemAmount(randomV.remainingBalance);
        sounds.playSuccess();
      }
    }, 1000);
  };

  const handleRedeemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetVoucher) {
      setErrorMsg('Pilih atau pindai voucher yang valid.');
      sounds.playAlert();
      return;
    }

    if (targetVoucher.status !== 'ACTIVE') {
      setErrorMsg('Voucher ini sudah tidak aktif atau habis.');
      sounds.playAlert();
      return;
    }

    if (redeemAmount <= 0 || redeemAmount > targetVoucher.remainingBalance) {
      setErrorMsg(`Nominal penukaran harus antara Rp 1 dan Rp ${targetVoucher.remainingBalance.toLocaleString('id-ID')}.`);
      sounds.playAlert();
      return;
    }

    // Check 2FA if enabled
    if (securityStatus.twoFactorEnabled) {
      const is2faValid = verifyTotpCode(totpInput, securityStatus.totpSecret);
      if (!is2faValid) {
        setErrorMsg('Kode 2FA salah atau kedaluwarsa. Masukkan kode 6-digit yang benar (atau 888999).');
        sounds.playAlert();
        return;
      }
    }

    setIsProcessing(true);
    setErrorMsg(null);
    sounds.playClick();

    const newBalance = targetVoucher.remainingBalance - redeemAmount;
    const isFullyRedeemed = newBalance <= 0;

    const txId = `TX-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${Math.floor(10000 + Math.random() * 90000)}`;
    const e2eeHash = await generateSha256(`${txId}:${targetVoucher.code}:${redeemAmount}:${selectedBank}:${Date.now()}`);

    // Ujrah fee calculation (0.5% or 0 for tabarru)
    const feeUjrah = targetVoucher.shariaContract === 'Wakalah bil Ujrah' ? Math.round(redeemAmount * 0.005) : 0;

    const newTransaction: Transaction = {
      id: txId,
      voucherId: targetVoucher.id,
      voucherCode: targetVoucher.code,
      voucherTitle: targetVoucher.title,
      amount: redeemAmount,
      currency: targetVoucher.currency,
      type: 'REDEEM',
      status: 'SUCCESS',
      merchantName: selectedMerchant,
      bankChannel: selectedBank,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      endToEndHash: e2eeHash,
      shariaAuditId: `AUD-DSN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      feeUjrah,
      location: 'Merchant POS Terminal IslamiCityPay',
      isTamperProof: true,
      ipAddress: '103.144.172.58',
      beneficiary: targetVoucher.beneficiaryName,
      details: `Penukaran voucher halal via ${selectedBank} (Akad ${targetVoucher.shariaContract})`,
    };

    const updatedVoucher: Voucher = {
      ...targetVoucher,
      remainingBalance: newBalance,
      status: isFullyRedeemed ? 'REDEEMED' : 'ACTIVE',
      totalUsageCount: targetVoucher.totalUsageCount + 1,
    };

    setTimeout(() => {
      setIsProcessing(false);
      setReceiptTx(newTransaction);
      onRedeemSuccess(newTransaction, updatedVoucher);
      sounds.playSuccess();

      // Confetti burst
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#059669', '#10b981', '#f59e0b', '#3b82f6'],
      });
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-[#121215] w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 dark:border-white/[0.08] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-white/[0.08] flex items-center justify-between bg-slate-50 dark:bg-[#16161A]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <ScanLine className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Terminal Penukaran Voucher (Merchant POS)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Penebusan Real-Time dengan Gateway Bank Syariah
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

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700 dark:text-slate-200 flex-1">
          
          {receiptTx ? (
            /* Digital Receipt on Success */
            <div className="space-y-4 text-center animate-scale-up">
              <div className="w-14 h-14 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                  Penukaran Voucher Berhasil!
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Transaksi telah tervalidasi secara kriptografis & tercatat pada buku besar audit.
                </p>
              </div>

              {/* Receipt Box */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.08] text-left space-y-2 font-mono text-[11px]">
                <div className="flex justify-between border-b border-slate-200 dark:border-white/[0.06] pb-2">
                  <span className="text-slate-500 dark:text-slate-400">ID Transaksi:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{receiptTx.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Kode Voucher:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{receiptTx.voucherCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Nominal Penukaran:</span>
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                    Rp {receiptTx.amount.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Merchant Penerima:</span>
                  <span className="text-slate-900 dark:text-slate-200">{receiptTx.merchantName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Gateway Perbankan:</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">{receiptTx.bankChannel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Ujrah Pengelolaan:</span>
                  <span className="text-slate-900 dark:text-slate-200">Rp {receiptTx.feeUjrah.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-white/[0.06]">
                  <span className="text-slate-500 dark:text-slate-400">Hash SHA-256:</span>
                  <span className="truncate max-w-[180px] text-slate-400">{receiptTx.endToEndHash}</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-xs transition-all hover:scale-[1.01]"
              >
                Selesai & Tutup Struk
              </button>
            </div>
          ) : (
            /* Redemption Form */
            <form onSubmit={handleRedeemSubmit} className="space-y-4">
              
              {/* Scan Barcode / Select Voucher */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 dark:text-slate-200">
                    Pilih Voucher Aktif *
                  </label>
                  <button
                    type="button"
                    onClick={handleSimulateScan}
                    disabled={isScanning}
                    className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>{isScanning ? 'Memindai Kamera...' : 'Simulasi Scan QR'}</span>
                  </button>
                </div>

                <select
                  value={selectedVoucherCode}
                  onChange={(e) => {
                    setSelectedVoucherCode(e.target.value);
                    const v = allVouchers.find(item => item.code === e.target.value);
                    if (v) setRedeemAmount(v.remainingBalance);
                  }}
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-[#16161A] border border-slate-300 dark:border-white/[0.08] rounded-xl font-mono text-xs font-semibold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/40 outline-none cursor-pointer"
                >
                  {allVouchers.map((v) => (
                    <option key={v.id} value={v.code} disabled={v.status !== 'ACTIVE'}>
                      {v.code} - {v.title} (Sisa: Rp {v.remainingBalance.toLocaleString('id-ID')}) [{v.status}]
                    </option>
                  ))}
                </select>
              </div>

              {/* Target Voucher Summary Card */}
              {targetVoucher && (
                <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/30 space-y-1 text-[11px]">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-emerald-900 dark:text-emerald-200">{targetVoucher.title}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20">
                      {targetVoucher.shariaContract}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Benefisiari: {targetVoucher.beneficiaryName}</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400 font-mono">
                      Sisa Saldo: Rp {targetVoucher.remainingBalance.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              )}

              {/* Amount Input */}
              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Nominal yang Ditebus (Rp) *
                </label>
                <input
                  type="number"
                  required
                  min={1000}
                  max={targetVoucher?.remainingBalance || 100000000}
                  step={1000}
                  value={redeemAmount}
                  onChange={(e) => setRedeemAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-[#16161A] border border-slate-300 dark:border-white/[0.08] rounded-xl text-sm font-mono font-extrabold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/40 outline-none"
                />
              </div>

              {/* Merchant & Bank Channel */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Merchant Kasir / POS
                  </label>
                  <select
                    value={selectedMerchant}
                    onChange={(e) => setSelectedMerchant(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-[#16161A] border border-slate-300 dark:border-white/[0.08] rounded-xl text-xs text-slate-900 dark:text-slate-100 cursor-pointer"
                  >
                    <option value="Halal Mart Nasional">Halal Mart Nasional</option>
                    <option value="Toko Perlengkapan Haji Madinah">Toko Perlengkapan Haji Madinah</option>
                    <option value="Koperasi Syariah Berkah">Koperasi Syariah Berkah</option>
                    <option value="Sentra Ternak Qurban BAZNAS">Sentra Ternak Qurban BAZNAS</option>
                    <option value="Ponpes Darul Quran Kasir">Ponpes Darul Quran Kasir</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Kanal Gateway Bank Syariah
                  </label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value as BankChannel)}
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-[#16161A] border border-slate-300 dark:border-white/[0.08] rounded-xl text-xs font-semibold text-emerald-700 dark:text-emerald-400 cursor-pointer"
                  >
                    <option value="BSI_SYARIAH">Bank Syariah Indonesia (BSI)</option>
                    <option value="MUAMALAT">Bank Muamalat Indonesia</option>
                    <option value="BCA_SYARIAH">BCA Syariah Gateway</option>
                    <option value="CIMB_SYARIAH">CIMB Niaga Syariah</option>
                    <option value="ALADIN_SYARIAH">Aladin Syariah Digital</option>
                    <option value="QRIS_SYARIAH">QRIS Standar Nasional Syariah</option>
                    <option value="BI_FAST_SYARIAH">BI-FAST Real-Time Syariah</option>
                  </select>
                </div>
              </div>

              {/* 2FA Challenge Box (if enabled) */}
              {securityStatus.twoFactorEnabled && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-amber-500" />
                      Otorisasi 2FA Wajib:
                    </label>
                    <span className="text-[10px] text-amber-700 dark:text-amber-400 font-mono">
                      (Gunakan 888999 untuk demo cepat)
                    </span>
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={totpInput}
                    onChange={(e) => setTotpInput(e.target.value)}
                    placeholder="Masukkan 6-digit TOTP"
                    className="w-full px-3 py-2 bg-white dark:bg-[#0D0D10] border border-amber-500/30 rounded-lg text-center font-mono font-bold tracking-widest text-sm text-slate-900 dark:text-slate-100"
                  />
                </div>
              )}

              {/* Error Box */}
              {errorMsg && (
                <div className="p-3 rounded-lg bg-rose-500/10 text-rose-800 dark:text-rose-300 border border-rose-500/25 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200 dark:border-white/[0.08]">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/[0.06] rounded-xl transition-colors"
                >
                  {t.actions.cancel}
                </button>

                <button
                  type="submit"
                  disabled={isProcessing || !targetVoucher || targetVoucher.status !== 'ACTIVE'}
                  className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-xs transition-all flex items-center gap-1.5 disabled:opacity-50 hover:scale-[1.02]"
                >
                  {isProcessing ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Memproses Kriptografi...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Konfirmasi Penukaran</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
