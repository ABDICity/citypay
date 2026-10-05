import React, { useState } from 'react';
import { 
  CalendarClock, 
  X, 
  Sparkles, 
  Coins, 
  Users, 
  Building2, 
  Calendar, 
  Repeat, 
  ShieldCheck, 
  CheckCircle2, 
  HelpCircle,
  FileText
} from 'lucide-react';
import { 
  VoucherCategory, 
  ShariaContract, 
  RecurringVoucherSchedule, 
  Voucher 
} from '../../types';
import { generateSha256 } from '../../utils/crypto';
import { sounds } from '../../utils/soundEffects';

interface ScheduleRecurringVoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSchedule: (schedule: RecurringVoucherSchedule, shouldIssueNow: boolean) => void;
}

export const ScheduleRecurringVoucherModal: React.FC<ScheduleRecurringVoucherModalProps> = ({
  isOpen,
  onClose,
  onSaveSchedule,
}) => {
  const [programTitle, setProgramTitle] = useState('');
  const [category, setCategory] = useState<VoucherCategory>('ziswaf');
  const [shariaContract, setShariaContract] = useState<ShariaContract>('Hibah / Tabarru');
  const [asnafCategory, setAsnafCategory] = useState<RecurringVoucherSchedule['asnafCategory']>('FAKIR_MISKIN');
  const [frequency, setFrequency] = useState<'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUAL'>('MONTHLY');
  const [amountPerVoucher, setAmountPerVoucher] = useState<number>(300000);
  const [recipientCount, setRecipientCount] = useState<number>(30);
  const [beneficiaryGroup, setBeneficiaryGroup] = useState('Keluarga Prasejahtera Binaan BAZNAS');
  const [fundingSourceBank, setFundingSourceBank] = useState('BSI Syariah (Rekening Tabarru Zakat)');
  const [nextExecutionDate, setNextExecutionDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [autoIssue, setAutoIssue] = useState<boolean>(true);
  const [issueFirstCycleNow, setIssueFirstCycleNow] = useState<boolean>(true);
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const totalPerCycle = amountPerVoucher * recipientCount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!programTitle.trim()) return;

    sounds.playSuccess();

    const newSchedule: RecurringVoucherSchedule = {
      id: `REC-${Date.now().toString().slice(-6)}`,
      programTitle: programTitle.trim(),
      category,
      shariaContract,
      frequency,
      amountPerVoucher,
      recipientCount,
      beneficiaryGroup: beneficiaryGroup.trim() || 'Mustahiq Terdata',
      asnafCategory,
      nextExecutionDate,
      lastExecutedDate: issueFirstCycleNow ? new Date().toISOString().split('T')[0] : undefined,
      status: 'ACTIVE',
      fundingSourceBank,
      autoIssue,
      totalDisbursed: issueFirstCycleNow ? totalPerCycle : 0,
      cyclesCompleted: issueFirstCycleNow ? 1 : 0,
      description: description.trim() || `Program penerbitan berkala ${frequency.toLowerCase()} untuk kelompok ${asnafCategory}.`,
    };

    onSaveSchedule(newSchedule, issueFirstCycleNow);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
      id="schedule-recurring-voucher-modal"
    >
      <div className="bg-white dark:bg-[#121215] w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-white/[0.08] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-white/[0.08] flex items-center justify-between bg-slate-50 dark:bg-[#16161A]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20 shadow-xs">
              <CalendarClock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                Jadwalkan Voucher Berulang (Recurring Issuance)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Penerbitan otomatis periodik voucher digital untuk program zakat, infaq, dan bantuan kemanusiaan
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          
          {/* Program Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Nama Program Zakat / Bantuan *</span>
              <span className="text-[10px] text-slate-400">Contoh: Bantuan Sembako Berkah Asnaf Fakir</span>
            </label>
            <input
              type="text"
              required
              value={programTitle}
              onChange={(e) => setProgramTitle(e.target.value)}
              placeholder="e.g., Penyaluran Beras & Minyak Bulanan Dhuafa"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#16161A] border border-slate-300 dark:border-white/[0.1] rounded-xl text-xs font-semibold text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>

          {/* Row: Category & Sharia Contract */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Kategori Program
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as VoucherCategory)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-[#16161A] border border-slate-300 dark:border-white/[0.1] rounded-xl text-xs font-semibold text-slate-900 dark:text-slate-100 outline-none"
              >
                <option value="ziswaf">ZISWAF (Zakat, Infaq, Shadaqah)</option>
                <option value="islamic_education">Pendidikan & Beasiswa Santri</option>
                <option value="halal_mart">Halal Mart & Pangan Sehat</option>
                <option value="masjid_community">Pemberdayaan Umat & Masjid</option>
                <option value="qurban_aqiqah">Tabungan Qurban / Aqiqah</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Akad Fikih Syariah (DSN-MUI)
              </label>
              <select
                value={shariaContract}
                onChange={(e) => setShariaContract(e.target.value as ShariaContract)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-[#16161A] border border-slate-300 dark:border-white/[0.1] rounded-xl text-xs font-semibold text-slate-900 dark:text-slate-100 outline-none"
              >
                <option value="Hibah / Tabarru">Hibah / Tabarru (Non-Komersil Sosial)</option>
                <option value="Wakalah bil Ujrah">Wakalah bil Ujrah (Kuasa Perwakilan)</option>
                <option value="Mudharabah">Mudharabah (Bagi Hasil Usaha Mikro)</option>
                <option value="Wadiah Yad Dhamanah">Wadiah Yad Dhamanah (Titipan Terjamin)</option>
              </select>
            </div>
          </div>

          {/* Row: Asnaf & Frequency */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Target Golongan Asnaf
              </label>
              <select
                value={asnafCategory}
                onChange={(e) => setAsnafCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-[#16161A] border border-slate-300 dark:border-white/[0.1] rounded-xl text-xs font-semibold text-slate-900 dark:text-slate-100 outline-none"
              >
                <option value="FAKIR_MISKIN">Fakir & Miskin (Kebutuhan Pokok)</option>
                <option value="FISABILILLAH">Fisabilillah (Da'i, Guru Ngaji, Santri)</option>
                <option value="GHARIMIN">Gharimin (Penyelesaian Utang Mendesak)</option>
                <option value="IBNU_SABIL">Ibnu Sabil (Musafir Kehabisan Bekal)</option>
                <option value="MUALAF">Mualaf (Penguatan Aqidah & Ekonomi)</option>
                <option value="RIQAB">Riqab (Pembebasan / Kemandirian)</option>
                <option value="AMIL">Amil Zakat (Operasional Resmi)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Frekuensi Penerbitan
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-[#16161A] border border-slate-300 dark:border-white/[0.1] rounded-xl text-xs font-semibold text-slate-900 dark:text-slate-100 outline-none"
              >
                <option value="WEEKLY">Mingguan (Tiap Hari Jumat Barakah)</option>
                <option value="MONTHLY">Bulanan (Tiap Awal Bulan)</option>
                <option value="QUARTERLY">Triwulanan (Per 3 Bulan)</option>
                <option value="ANNUAL">Tahunan (Haul Ramadhan / Idul Adha)</option>
              </select>
            </div>
          </div>

          {/* Row: Nominal per Voucher & Recipient Count */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Nominal per Voucher (IDR)</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
                  Rp {amountPerVoucher.toLocaleString('id-ID')}
                </span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Rp</span>
                <input
                  type="number"
                  min={10000}
                  step={5000}
                  value={amountPerVoucher}
                  onChange={(e) => setAmountPerVoucher(Number(e.target.value))}
                  className="w-full pl-9 pr-3.5 py-2 bg-slate-50 dark:bg-[#16161A] border border-slate-300 dark:border-white/[0.1] rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Target Jumlah Penerima</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
                  {recipientCount} Penerima
                </span>
              </label>
              <div className="relative">
                <Users className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  min={1}
                  max={1000}
                  value={recipientCount}
                  onChange={(e) => setRecipientCount(Number(e.target.value))}
                  className="w-full pl-9 pr-3.5 py-2 bg-slate-50 dark:bg-[#16161A] border border-slate-300 dark:border-white/[0.1] rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>
            </div>
          </div>

          {/* Budget Summary Card */}
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/25 border border-emerald-500/30 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[11px] font-medium text-emerald-800 dark:text-emerald-300">
                Total Anggaran per Siklus ({frequency}):
              </span>
              <div className="text-base font-extrabold text-emerald-700 dark:text-emerald-400 font-mono">
                Rp {totalPerCycle.toLocaleString('id-ID')}
              </div>
            </div>
            <div className="text-right text-[11px] text-emerald-800 dark:text-emerald-300/80">
              <span>{recipientCount} voucher x Rp {amountPerVoucher.toLocaleString('id-ID')}</span>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Bebas Riba & Terjadwal Aman</div>
            </div>
          </div>

          {/* Beneficiary Group & Bank Source */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Nama Kelompok Penerima
              </label>
              <input
                type="text"
                value={beneficiaryGroup}
                onChange={(e) => setBeneficiaryGroup(e.target.value)}
                placeholder="e.g. Warga RW 04 Kelurahan Menteng"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-[#16161A] border border-slate-300 dark:border-white/[0.1] rounded-xl text-xs font-semibold text-slate-900 dark:text-slate-100 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Rekening Sumber Dana Syariah
              </label>
              <select
                value={fundingSourceBank}
                onChange={(e) => setFundingSourceBank(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-[#16161A] border border-slate-300 dark:border-white/[0.1] rounded-xl text-xs font-semibold text-slate-900 dark:text-slate-100 outline-none"
              >
                <option value="BSI Syariah (Rekening Tabarru Zakat)">BSI Syariah (Rekening Tabarru Zakat)</option>
                <option value="Bank Muamalat (Kas Infaq Masjid)">Bank Muamalat (Kas Infaq Masjid)</option>
                <option value="BCA Syariah (Dana Abadi Pendidikan)">BCA Syariah (Dana Abadi Pendidikan)</option>
                <option value="CIMB Niaga Syariah (Pool Wakaf Uang)">CIMB Niaga Syariah (Pool Wakaf Uang)</option>
              </select>
            </div>
          </div>

          {/* Execution Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Tanggal Eksekusi Jadwal Berikutnya</span>
              <span className="text-[10px] text-slate-400">Sistem otomatis menerbitkan voucher di jam 00:00 WIB</span>
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="date"
                required
                value={nextExecutionDate}
                onChange={(e) => setNextExecutionDate(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 bg-slate-50 dark:bg-[#16161A] border border-slate-300 dark:border-white/[0.1] rounded-xl text-xs font-semibold text-slate-900 dark:text-slate-100 outline-none"
              />
            </div>
          </div>

          {/* Checkboxes: Auto Issue & Issue First Cycle Now */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/[0.06] space-y-3">
            
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={autoIssue}
                onChange={(e) => setAutoIssue(e.target.checked)}
                className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-900 dark:text-slate-100 block">
                  Otomatisasi Penerbitan Mandiri (Auto-Issue Daemon)
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Voucher langsung disegel kriptografis dan didistribusikan ke dompet mustahiq saat jadwal tiba tanpa perlu persetujuan manual lagi.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer pt-2 border-t border-slate-200 dark:border-white/[0.06]">
              <input
                type="checkbox"
                checked={issueFirstCycleNow}
                onChange={(e) => setIssueFirstCycleNow(e.target.checked)}
                className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-900 dark:text-slate-100 block">
                  Terbitkan Siklus Pertama Sekarang Juga
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Langsung generate voucher sampel ke dalam katalog aktif saat jadwal ini disimpan.
                </span>
              </div>
            </label>

          </div>

        </form>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-white/[0.08] flex items-center justify-between bg-slate-50 dark:bg-[#16161A]">
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-md shadow-emerald-600/25 transition-all flex items-center gap-1.5 hover:scale-[1.02]"
          >
            <CalendarClock className="w-4 h-4" />
            <span>Simpan & Aktifkan Jadwal</span>
          </button>
        </div>

      </div>
    </div>
  );
};
