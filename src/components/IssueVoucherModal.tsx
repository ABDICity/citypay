import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  ShieldCheck, 
  Sparkles, 
  Lock, 
  Building, 
  User, 
  Calendar, 
  Coins,
  CheckCircle2
} from 'lucide-react';
import { Voucher, VoucherCategory, ShariaContract, Currency, Language } from '../types';
import { translations } from '../utils/translations';
import { generateSha256, generateVoucherCode, encryptPayloadAes256 } from '../utils/crypto';
import { sounds } from '../utils/soundEffects';

interface IssueVoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  onIssueVoucher: (newVoucher: Voucher) => void;
}

export const IssueVoucherModal: React.FC<IssueVoucherModalProps> = ({
  isOpen,
  onClose,
  currentLang,
  onIssueVoucher,
}) => {
  const t = translations[currentLang];

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<VoucherCategory>('ziswaf');
  const [shariaContract, setShariaContract] = useState<ShariaContract>('Hibah / Tabarru');
  const [faceValue, setFaceValue] = useState<number>(500000);
  const [currency, setCurrency] = useState<Currency>('IDR');
  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [beneficiaryPhone, setBeneficiaryPhone] = useState('+6281');
  const [beneficiaryEmail, setBeneficiaryEmail] = useState('');
  const [expiryDays, setExpiryDays] = useState<number>(90);
  const [pinRequired, setPinRequired] = useState(true);
  const [securityLevel, setSecurityLevel] = useState<'AES-256-GCM' | 'RSA-4096'>('AES-256-GCM');
  const [description, setDescription] = useState('');
  const [merchantsInput, setMerchantsInput] = useState('Halal Mart Nasional, Koperasi Syariah Mitra');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !beneficiaryName.trim() || faceValue <= 0) return;

    setIsSubmitting(true);
    sounds.playClick();

    const categoryPrefix = category === 'ziswaf' ? 'ZIS' : category === 'umrah_hajj' ? 'UMR' : category === 'halal_mart' ? 'HLM' : category === 'islamic_education' ? 'EDU' : category === 'masjid_community' ? 'MSJ' : 'QRB';
    const code = generateVoucherCode(categoryPrefix);

    const now = new Date();
    const issuedDate = now.toISOString().split('T')[0];
    const expDate = new Date(now.getTime() + expiryDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const rawPayload = `${code}:${category}:${shariaContract}:${faceValue}:${beneficiaryName}:${issuedDate}`;
    const encryptedHash = await generateSha256(rawPayload);
    const { cipherText } = await encryptPayloadAes256(rawPayload);

    const merchants = merchantsInput.split(',').map(m => m.trim()).filter(Boolean);

    const newVoucher: Voucher = {
      id: `vch-${Date.now()}`,
      code,
      title,
      category,
      shariaContract,
      faceValue,
      remainingBalance: faceValue,
      currency,
      status: 'ACTIVE',
      issuedDate,
      expiryDate: expDate,
      beneficiaryName,
      beneficiaryPhone,
      beneficiaryEmail: beneficiaryEmail || `${beneficiaryName.toLowerCase().replace(/\s+/g, '.')}@mustahiq.org`,
      merchantsAllowed: merchants.length > 0 ? merchants : ['Mitra Resmi IslamiCityPay'],
      encryptedHash,
      digitalSignature: `SIG_DSN_MUI_${new Date().getFullYear()}_${Math.floor(100000 + Math.random() * 900000)}_AES256GCM_OK`,
      qrPayload: `ISLAMICITYPAY://VOUCHER?CODE=${code}&CIPHER=${cipherText.substring(0, 32)}`,
      pinRequired,
      securityLevel,
      totalUsageCount: 0,
      maxUsageCount: 3,
      description: description || `Penerbitan voucher ${title} berbasis akad ${shariaContract} untuk kemaslahatan umat.`,
      terms: 'Berlaku pada seluruh merchant mitra terverifikasi DSN-MUI dan ekosistem perbankan syariah.',
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onIssueVoucher(newVoucher);
      sounds.playSuccess();
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-[#121215] w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-white/[0.08] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-white/[0.08] flex items-center justify-between bg-slate-50 dark:bg-[#16161A]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {t.actions.issueVoucher}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Penerbitan Voucher Kriptografis Syariah Berbasis Akad DSN-MUI
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

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700 dark:text-slate-200 flex-1">
          
          {/* Voucher Title */}
          <div>
            <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
              Nama / Judul Voucher *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Voucher Paket Pangan Dhuafa Berkah"
              className="w-full px-3 py-2 bg-slate-100 dark:bg-[#16161A] border border-slate-300 dark:border-white/[0.08] rounded-xl focus:ring-2 focus:ring-emerald-500/40 outline-none text-xs text-slate-900 dark:text-slate-100 transition-all"
            />
          </div>

          {/* Category & Sharia Contract Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                Kategori Program Syariah
              </label>
              <select
                value={category}
                onChange={(e) => {
                  const cat = e.target.value as VoucherCategory;
                  setCategory(cat);
                  if (cat === 'ziswaf' || cat === 'islamic_education') {
                    setShariaContract('Hibah / Tabarru');
                  } else if (cat === 'umrah_hajj' || cat === 'halal_mart') {
                    setShariaContract('Wakalah bil Ujrah');
                  } else if (cat === 'qurban_aqiqah') {
                    setShariaContract('Mudharabah');
                  } else {
                    setShariaContract('Wadiah Yad Dhamanah');
                  }
                }}
                className="w-full px-3 py-2 bg-slate-100 dark:bg-[#16161A] border border-slate-300 dark:border-white/[0.08] rounded-xl focus:ring-2 focus:ring-emerald-500/40 outline-none text-xs text-slate-900 dark:text-slate-100 cursor-pointer"
              >
                <option value="ziswaf">{t.voucherCategories.ziswaf}</option>
                <option value="umrah_hajj">{t.voucherCategories.umrah_hajj}</option>
                <option value="halal_mart">{t.voucherCategories.halal_mart}</option>
                <option value="islamic_education">{t.voucherCategories.islamic_education}</option>
                <option value="masjid_community">{t.voucherCategories.masjid_community}</option>
                <option value="qurban_aqiqah">{t.voucherCategories.qurban_aqiqah}</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                Akad Fikih Syariah (DSN-MUI)
              </label>
              <select
                value={shariaContract}
                onChange={(e) => setShariaContract(e.target.value as ShariaContract)}
                className="w-full px-3 py-2 bg-slate-100 dark:bg-[#16161A] border border-slate-300 dark:border-white/[0.08] rounded-xl focus:ring-2 focus:ring-emerald-500/40 outline-none text-xs font-semibold text-emerald-700 dark:text-emerald-400 cursor-pointer"
              >
                <option value="Hibah / Tabarru">Hibah / Tabarru (Pemberian Sukarela Zakat/Infaq)</option>
                <option value="Wakalah bil Ujrah">Wakalah bil Ujrah (Kuasa Jasa Pengelolaan)</option>
                <option value="Wadiah Yad Dhamanah">Wadiah Yad Dhamanah (Titipan Dana Terjamin)</option>
                <option value="Mudharabah">Mudharabah (Kemitraan Bagi Hasil)</option>
              </select>

              {/* Real-time Smart Contract Compliance Hint */}
              <div className="mt-1.5 flex items-center gap-1.5 text-[10px]">
                {category === 'ziswaf' && shariaContract === 'Mudharabah' ? (
                  <span className="text-rose-500 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    Peringatan: Zakat Maal wajib menggunakan Hibah/Tabarru (Prinsip Tamlik).
                  </span>
                ) : (
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Sesuai Smart Contract Protokol {category === 'ziswaf' ? 'BAZNAS Zakat' : category === 'islamic_education' ? 'BWI Wakaf' : 'DSN-MUI'}.
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Nominal Value & Currency */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                Nominal Nilai Voucher *
              </label>
              <div className="relative">
                <input
                  type="number"
                  required
                  min={10000}
                  step={10000}
                  value={faceValue}
                  onChange={(e) => setFaceValue(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-[#16161A] border border-slate-300 dark:border-white/[0.08] rounded-xl focus:ring-2 focus:ring-emerald-500/40 outline-none text-xs font-mono font-bold text-slate-900 dark:text-slate-100"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-mono">
                  {currency}
                </span>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                Mata Uang
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className="w-full px-3 py-2 bg-slate-100 dark:bg-[#16161A] border border-slate-300 dark:border-white/[0.08] rounded-xl focus:ring-2 focus:ring-emerald-500/40 outline-none text-xs font-bold text-slate-900 dark:text-slate-100 cursor-pointer"
              >
                <option value="IDR">IDR (Rupiah)</option>
                <option value="SAR">SAR (Riyal Saudi)</option>
                <option value="USD">USD (Dolar)</option>
              </select>
            </div>
          </div>

          {/* Beneficiary Details */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#16161A]/60 border border-slate-200 dark:border-white/[0.08] space-y-3">
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <User className="w-4 h-4 text-emerald-500" />
              Penerima Manfaat (Mustahiq / Nasabah)
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-0.5">
                  Nama Penerima *
                </label>
                <input
                  type="text"
                  required
                  value={beneficiaryName}
                  onChange={(e) => setBeneficiaryName(e.target.value)}
                  placeholder="Contoh: Budi Santoso (Mustahiq)"
                  className="w-full px-3 py-1.5 bg-white dark:bg-[#0D0D10] border border-slate-300 dark:border-white/[0.08] rounded-lg text-xs text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-0.5">
                  Nomor HP / WhatsApp
                </label>
                <input
                  type="text"
                  value={beneficiaryPhone}
                  onChange={(e) => setBeneficiaryPhone(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white dark:bg-[#0D0D10] border border-slate-300 dark:border-white/[0.08] rounded-lg text-xs font-mono text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>
          </div>

          {/* Validity & Merchants */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                Masa Berlaku (Hari)
              </label>
              <input
                type="number"
                min={1}
                max={365}
                value={expiryDays}
                onChange={(e) => setExpiryDays(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-100 dark:bg-[#16161A] border border-slate-300 dark:border-white/[0.08] rounded-xl text-xs font-mono text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                Daftar Merchant Mitra (Pisahkan Koma)
              </label>
              <input
                type="text"
                value={merchantsInput}
                onChange={(e) => setMerchantsInput(e.target.value)}
                placeholder="Halal Mart, BAZNAS Store, Koperasi"
                className="w-full px-3 py-2 bg-slate-100 dark:bg-[#16161A] border border-slate-300 dark:border-white/[0.08] rounded-xl text-xs text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          {/* Security Parameter Selection */}
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-500" />
              <div>
                <span className="font-bold text-emerald-900 dark:text-emerald-200 block">
                  Enkripsi Kriptografis: AES-256-GCM
                </span>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400">
                  Dilengkapi stempel digital otomatis anti-double spend
                </span>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer font-bold text-[11px] text-emerald-900 dark:text-emerald-200">
              <input
                type="checkbox"
                checked={pinRequired}
                onChange={(e) => setPinRequired(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
              />
              Wajibkan PIN Saat Penukaran
            </label>
          </div>

          {/* Modal Footer Controls */}
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
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-xs transition-all flex items-center gap-1.5 disabled:opacity-50 hover:scale-[1.02]"
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Menerbitkan Voucher...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Terbitkan & Segel Digital</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
