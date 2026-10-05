import React from 'react';
import { 
  CalendarClock, 
  Play, 
  Pause, 
  Trash2, 
  Plus, 
  Coins, 
  Users, 
  Building2, 
  Clock, 
  Repeat, 
  CheckCircle2, 
  AlertCircle,
  Calendar,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { RecurringVoucherSchedule } from '../types';
import { sounds } from '../utils/soundEffects';

interface RecurringVouchersViewProps {
  schedules: RecurringVoucherSchedule[];
  onOpenScheduleModal: () => void;
  onToggleScheduleStatus: (id: string) => void;
  onExecuteScheduleNow: (schedule: RecurringVoucherSchedule) => void;
  onDeleteSchedule: (id: string) => void;
}

export const RecurringVouchersView: React.FC<RecurringVouchersViewProps> = ({
  schedules,
  onOpenScheduleModal,
  onToggleScheduleStatus,
  onExecuteScheduleNow,
  onDeleteSchedule,
}) => {
  const activeCount = schedules.filter(s => s.status === 'ACTIVE').length;
  const totalBeneficiaries = schedules.reduce((acc, s) => acc + (s.status === 'ACTIVE' ? s.recipientCount : 0), 0);
  const totalDisbursedAll = schedules.reduce((acc, s) => acc + s.totalDisbursed, 0);

  const getFrequencyLabel = (freq: RecurringVoucherSchedule['frequency']) => {
    switch (freq) {
      case 'WEEKLY': return 'Mingguan (Jumat Berkah)';
      case 'MONTHLY': return 'Bulanan (Tiap Awal Bulan)';
      case 'QUARTERLY': return 'Triwulanan (Per 3 Bulan)';
      case 'ANNUAL': return 'Tahunan (Haul Ramadhan)';
      default: return freq;
    }
  };

  const getAsnafLabel = (asnaf: RecurringVoucherSchedule['asnafCategory']) => {
    switch (asnaf) {
      case 'FAKIR_MISKIN': return 'Fakir & Miskin';
      case 'FISABILILLAH': return 'Fisabilillah';
      case 'GHARIMIN': return 'Gharimin';
      case 'IBNU_SABIL': return 'Ibnu Sabil';
      case 'MUALAF': return 'Mualaf';
      case 'RIQAB': return 'Riqab';
      case 'AMIL': return 'Amil Zakat';
      default: return asnaf;
    }
  };

  return (
    <div className="space-y-5 animate-fade-in" id="recurring-vouchers-manager">
      
      {/* Overview Stat Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] shadow-xs space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Program Berulang Aktif</span>
          <div className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Repeat className="w-5 h-5 text-emerald-500" />
            {activeCount} / {schedules.length}
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Terjadwal Berkesinambungan</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] shadow-xs space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Target Mustahiq Terlayani</span>
          <div className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-teal-500" />
            {totalBeneficiaries} Jiwa
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Per Periode Aktif</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] shadow-xs space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Dana Tersalurkan</span>
          <div className="text-lg font-extrabold text-slate-900 dark:text-white font-mono flex items-center gap-1.5 truncate">
            <Coins className="w-5 h-5 text-amber-500 shrink-0" />
            Rp {totalDisbursedAll.toLocaleString('id-ID')}
          </div>
          <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">Akumulasi Realisasi ZISWAF</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] shadow-xs space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Audit Fikih Syariah</span>
          <div className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
            <ShieldCheck className="w-5 h-5 text-purple-500" />
            100% Patuh
          </div>
          <span className="text-[11px] text-purple-600 dark:text-purple-400 font-medium">Akad Hibah & Tabarru</span>
        </div>

      </div>

      {/* Toolbar & Action Header */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/[0.08] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarClock className="w-4 h-4 text-emerald-500" />
            Daftar Jadwal Penyaluran Rutin (Recurring ZISWAF Schedules)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Sistem otomatis memicu penerbitan dan enkripsi voucher mustahiq tepat waktu sesuai ketentuan DSN-MUI
          </p>
        </div>

        <button
          id="create-new-schedule-btn"
          onClick={() => {
            sounds.playClick();
            onOpenScheduleModal();
          }}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5 shrink-0 hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Jadwal Penyaluran Baru</span>
        </button>
      </div>

      {/* List of Schedules */}
      {schedules.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#121215] border border-dashed border-slate-300 dark:border-white/[0.1] space-y-3">
          <CalendarClock className="w-12 h-12 text-slate-400 mx-auto" />
          <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">Belum Ada Jadwal Voucher Berulang</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Mulai atur otomatisasi penyaluran zakat, bantuan sembako, atau sedekah jumat berkala.
          </p>
          <button
            onClick={onOpenScheduleModal}
            className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl"
          >
            Jadwalkan Sekarang
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {schedules.map((schedule) => {
            const isActive = schedule.status === 'ACTIVE';
            const totalBudgetPerCycle = schedule.amountPerVoucher * schedule.recipientCount;

            return (
              <div 
                key={schedule.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                  isActive 
                    ? 'bg-white dark:bg-[#121215] border-slate-200 dark:border-white/[0.08] shadow-xs hover:border-emerald-500/40' 
                    : 'bg-slate-50/70 dark:bg-[#16161A]/60 border-slate-200/60 dark:border-white/[0.04] opacity-80'
                }`}
              >
                {/* Card Top: Badges & Status */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold flex items-center gap-1 ${
                      isActive 
                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20' 
                        : 'bg-slate-200 dark:bg-white/[0.08] text-slate-600 dark:text-slate-400'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                      {isActive ? 'AKTIF BERJALAN' : 'DIJEDA (PAUSED)'}
                    </span>

                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-teal-500/10 text-teal-700 dark:text-teal-400 border border-teal-500/20">
                      {schedule.frequency}
                    </span>
                  </div>

                  {/* Title */}
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-snug line-clamp-2">
                    {schedule.programTitle}
                  </h4>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                    {schedule.description}
                  </p>
                </div>

                {/* Key Metrics Breakdown */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#16161A] border border-slate-200/80 dark:border-white/[0.06] space-y-2 text-xs">
                  
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400 text-[11px]">Nominal per Voucher:</span>
                    <span className="font-bold text-slate-900 dark:text-white font-mono">
                      Rp {schedule.amountPerVoucher.toLocaleString('id-ID')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400 text-[11px]">Penerima per Siklus:</span>
                    <span className="font-bold text-slate-900 dark:text-white font-mono flex items-center gap-1">
                      <Users className="w-3 h-3 text-emerald-500" />
                      {schedule.recipientCount} Mustahiq
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200 dark:border-white/[0.06]">
                    <span className="text-slate-500 dark:text-slate-400 text-[11px]">Anggaran per Siklus:</span>
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                      Rp {totalBudgetPerCycle.toLocaleString('id-ID')}
                    </span>
                  </div>

                </div>

                {/* Asnaf, Bank, & Next Execution Info */}
                <div className="space-y-1.5 text-[11px]">
                  
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      Asnaf Target:
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {getAsnafLabel(schedule.asnafCategory)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-blue-500" />
                      Sumber Dana:
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[150px]" title={schedule.fundingSourceBank}>
                      {schedule.fundingSourceBank}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-emerald-500" />
                      Jadwal Berikutnya:
                    </span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {schedule.nextExecutionDate}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                    <span>Siklus Selesai: {schedule.cyclesCompleted}x</span>
                    <span>Realisasi: Rp {schedule.totalDisbursed.toLocaleString('id-ID')}</span>
                  </div>

                </div>

                {/* Card Action Buttons */}
                <div className="pt-2 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between gap-2">
                  
                  {/* Immediate Execution Button */}
                  <button
                    type="button"
                    title="Terbitkan Voucher Siklus Ini Sekarang"
                    onClick={() => onExecuteScheduleNow(schedule)}
                    className="flex-1 py-1.5 px-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Jalankan Sekarang</span>
                  </button>

                  {/* Pause / Resume Button */}
                  <button
                    type="button"
                    title={isActive ? 'Jeda Jadwal Otomatis' : 'Lanjutkan Jadwal Otomatis'}
                    onClick={() => onToggleScheduleStatus(schedule.id)}
                    className={`p-2 rounded-xl border text-xs font-semibold transition-colors flex items-center justify-center ${
                      isActive 
                        ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-500/20' 
                        : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-500/20'
                    }`}
                  >
                    {isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  </button>

                  {/* Delete Button */}
                  <button
                    type="button"
                    title="Hapus Jadwal Penyaluran"
                    onClick={() => onDeleteSchedule(schedule.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl border border-transparent hover:border-rose-200 dark:hover:border-rose-800/30 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
